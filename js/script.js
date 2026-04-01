// script.js — основной модуль

// Компоненты
import { initGallery } from './components/gallery.js';
import { initMenuCategories } from './components/menuCategories.js';
import { initChefCarousel } from './components/chefCarousel.js';
import { initBurgerMenu } from './components/burgerMenu.js';
import { initReviewsSlider } from './components/reviewsSlider.js';
import { initPromoManager } from './components/promoManager.js';



// Утилиты
import { validateReservationForm } from './utils/validation.js';
import { showNotification } from './utils/notifications.js';
import { getFormData, resetForm, smoothScrollTo } from './utils/helpers.js';
import {initSmoothScroll} from './utils/scroll.js';
// ------------------------------
// ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ
// ------------------------------

const initComponents = () => {
    initGallery();
    initMenuCategories();
    initChefCarousel();
    initBurgerMenu();
    initSmoothScroll();
    initReviewsSlider();
    initPromoManager ();
 
};

// ------------------------------
// ОБРАБОТЧИК ФОРМЫ
// ------------------------------

const handleReservationSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = getFormData(form);

    const validation = validateReservationForm(data);

    if (!validation.isValid) {
        showNotification(Object.values(validation.errors).join('\n'), 'error');
        return;
    }

    const msg = 
        `Заявка отправлена!\n\n` +
        `Дата: ${data.date}\n` +
        `Время: ${data.time}\n` +
        `Гостей: ${data.guests}\n` +
        `Телефон: ${data.phone}\n` +
        `Пожелания: ${data.comment || 'нет'}`;

    showNotification(msg, 'success');
    resetForm(form);
};

// ------------------------------
// ОБРАБОТЧИКИ СОБЫТИЙ
// ------------------------------

const initEventHandlers = () => {
    const form = document.querySelector('.reservation-form');
    if (form) form.addEventListener('submit', handleReservationSubmit);

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link || link.getAttribute('href') === '#') return;

        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) smoothScrollTo(target, 80);
    });
};

// ------------------------------
// ЗАПУСК ПРИЛОЖЕНИЯ
// ------------------------------

const initApp = () => {
    initComponents();
    initEventHandlers();
    document.documentElement.classList.add('loaded');
};

document.addEventListener('DOMContentLoaded', initApp);
