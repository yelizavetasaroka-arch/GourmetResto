// script.js — основной модуль с оффлайн поддержкой

// Компоненты
import { initGallery } from "./components/gallery.js";
import { initMenuCategories } from "./components/menuCategories.js";
import { initChefCarousel } from "./components/chefCarousel.js";
import { initBurgerMenu } from "./components/burgerMenu.js";
import { initReviewsSlider } from "./components/reviewsSlider.js";
import { initPromoManager } from "./components/promoManager.js";

// API и хранилище
import { apiService } from "./api/apiService.js";
import {
  menuCache,
  offlineQueue,
  syncedBookings,
} from "./storage/localStorage.js";
import { sessionStorageService } from "./storage/sessionStorage.js";
import { MenuDataParser, BookingParser } from "./utils/dataParser.js";

// Утилиты
import { validateReservationForm } from "./utils/validation.js";
import { showNotification } from "./utils/notifications.js";
import { getFormData, resetForm, smoothScrollTo } from "./utils/helpers.js";

// Состояние приложения
let isOnline = navigator.onLine;
let menuData = null;
let categories = null;

// ========== ЗАГРУЗКА МЕНЮ (с кэшем) ==========
async function loadMenu() {
  const cachedMenu = menuCache.get();
  if (cachedMenu) {
    menuData = cachedMenu;
    categories = cachedMenu.categories;
    renderMenu();
  }

  if (isOnline) {
    try {
      const result = await apiService.getMenu();
      if (result.success && result.data) {
        menuData = result.data;
        categories = result.data.categories;
        menuCache.save(menuData);
        renderMenu();
      }
    } catch (error) {
      console.error("Ошибка загрузки меню:", error);
      if (!cachedMenu) {
        showNotification("Не удалось загрузить меню", "error");
      }
    }
  } else if (!cachedMenu) {
    showNotification("Нет соединения и нет сохраненного меню", "error");
  }
}

// Отображение меню
function renderMenu() {
  if (!menuData || !menuData.menu) return;

  if (menuData.restaurant) {
    const addressEl = document.querySelector(".footer__address");
    const phoneEl = document.querySelector(".footer__phone");
    if (addressEl) addressEl.textContent = menuData.restaurant.address;
    if (phoneEl) phoneEl.textContent = menuData.restaurant.phone;
  }

  updatePricesInDOM(menuData.menu);
}

// Обновление цен в DOM
function updatePricesInDOM(menuItems) {
  const menuArticles = document.querySelectorAll(".menu-item");

  menuArticles.forEach((article) => {
    const nameEl = article.querySelector(".menu-item__name");
    const priceEl = article.querySelector(".menu-item__price");

    if (nameEl && priceEl) {
      const itemName = nameEl.textContent.trim();
      const menuItem = menuItems.find((item) => item.name === itemName);

      if (menuItem) {
        priceEl.innerHTML = `${MenuDataParser.formatPrice(menuItem.price)}`;
        if (!menuItem.available) {
          priceEl.innerHTML +=
            ' <span class="unavailable">(нет в наличии)</span>';
        }
      }
    }
  });
}

// ========== БРОНИРОВАНИЕ С ОФФЛАЙН ПОДДЕРЖКОЙ ==========
async function handleReservationSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = getFormData(form);

  const validation = validateReservationForm(formData);
  if (!validation.isValid) {
    showNotification(Object.values(validation.errors).join("\n"), "error");
    return;
  }

  const bookingData = BookingParser.prepareForAPI(formData);
  sessionStorageService.saveFormDraft(formData);

  if (isOnline) {
    await sendBookingToServer(bookingData, form);
  } else {
    // Оффлайн - сохраняем в очередь
    offlineQueue.add(bookingData);
    const queueLength = offlineQueue.getCount();
    console.log(
      `📱 Бронирование сохранено в очередь. Всего в очереди: ${queueLength}`,
    );
    showNotification(
      `Нет интернета. Бронирование сохранено (очередь: ${queueLength}). Отправится при восстановлении связи.`,
      "info",
      5000,
    );
    resetForm(form);
    sessionStorageService.clearFormDraft();
  }
}

// Отправка на сервер
async function sendBookingToServer(bookingData, form) {
  try {
    const result = await apiService.createBooking(bookingData);
    if (result.success) {
      showNotification(
        `Бронирование успешно создано! Номер: ${result.data.id}`,
        "success",
      );
      resetForm(form);
      sessionStorageService.clearFormDraft();
      syncedBookings.add(result.data);
    }
  } catch (error) {
    console.error("Ошибка отправки:", error);
    offlineQueue.add(bookingData);
    const queueLength = offlineQueue.getCount();
    showNotification(
      `Ошибка сервера. Бронирование сохранено в очередь (очередь: ${queueLength})`,
      "error",
    );
  }
}

// ========== СИНХРОНИЗАЦИЯ ОФФЛАЙН БРОНИРОВАНИЙ ==========
let isSyncing = false;

async function syncOfflineBookings(showStartMessage = true) {
  console.log(
    "🔍 syncOfflineBookings вызван, isOnline:",
    isOnline,
    "showStartMessage:",
    showStartMessage,
  );

  if (!isOnline) return;
  if (isSyncing) return;

  const queue = offlineQueue.getAll();
  console.log("📋 Очередь:", queue.length, queue);

  if (queue.length === 0) return null;

  isSyncing = true;

  if (showStartMessage) {
    showNotification(
      `🔄 Синхронизация ${queue.length} бронирований...`,
      "info",
      4000,
    );
  }

  let synced = 0;
  let failed = 0;

  for (const booking of queue) {
    try {
      console.log("📤 Отправка:", booking);
      const result = await apiService.createBooking(booking);
      console.log("📥 Ответ:", result);

      if (result.success) {
        offlineQueue.remove(booking.id);
        syncedBookings.add(result.data);
        synced++;
        console.log(`✅ Отправлено. Осталось: ${offlineQueue.getCount()}`);
      } else {
        failed++;
      }
    } catch (error) {
      console.error("❌ Ошибка:", error);
      failed++;
    }
  }

  isSyncing = false;
  console.log(`🏁 ИТОГО: отправлено ${synced}, ошибок ${failed}`);

  return { synced, failed, total: queue.length };
}
// ========== ВОССТАНОВЛЕНИЕ ЧЕРНОВИКА ==========
function restoreFormDraft() {
  const draft = sessionStorageService.getFormDraft();
  if (draft) {
    const form = document.querySelector(".reservation-form");
    if (form) {
      for (const [key, value] of Object.entries(draft)) {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) input.value = value;
      }
      showNotification("Восстановлены неотправленные данные формы", "info");
    }
  }
}

// ========== ОБРАБОТКА СОСТОЯНИЯ СЕТИ ==========
async function handleOnline() {
  console.log("🟢 Интернет появился");
  isOnline = true;

  const pendingCount = offlineQueue.getCount();
  console.log(`📋 В очереди: ${pendingCount} бронирований`);

  if (pendingCount > 0) {
    console.log("🔄 Запускаем синхронизацию...");
    const result = await syncOfflineBookings(false);
    console.log("📊 Результат синхронизации:", result);

    if (result && result.synced > 0) {
      console.log(`✅ Показываем уведомление: отправлено ${result.synced}`);
      showNotification(
        `✅ Соединение восстановлено! Отправлено ${result.synced} бронирований`,
        "success",
        5000,
      );
    } else if (result && result.synced === 0) {
      console.log(
        `⚠️ Ничего не отправлено, synced=${result.synced}, failed=${result.failed}`,
      );
    }
  } else {
    showNotification("Соединение восстановлено!", "success", 3000);
  }

  await updatePricesOnly();
}

function handleOffline() {
  console.log("🔴 Интернет пропал");
  isOnline = false;
  showNotification("Нет интернета. Работа в оффлайн режиме.", "error", 4000);
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const initComponents = () => {
  initGallery();
  initMenuCategories();
  initChefCarousel();
  initBurgerMenu();
  initReviewsSlider();
  initPromoManager();
};

const initEventHandlers = () => {
  const form = document.querySelector(".reservation-form");
  if (form) form.addEventListener("submit", handleReservationSubmit);

  document.body.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.getAttribute("href") === "#") return;

    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) smoothScrollTo(target, 80);
  });

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
};

const initApp = async () => {
  initComponents();
  initEventHandlers();
  await loadMenu();
  restoreFormDraft();

  const pendingCount = offlineQueue.getCount();
  if (pendingCount > 0) {
    console.log(`📋 При запуске в очереди: ${pendingCount} бронирований`);
    if (isOnline) {
      const result = await syncOfflineBookings(false);
      if (result && result.synced > 0) {
        showNotification(
          `Отправлено ${result.synced} бронирований из очереди`,
          "success",
          4000,
        );
      }
    } else {
      showNotification(
        `Есть ${pendingCount} неотправленных бронирований`,
        "info",
        4000,
      );
    }
  }

  document.documentElement.classList.add("loaded");
};

document.addEventListener("DOMContentLoaded", initApp);
