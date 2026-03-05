/* ================== ГАЛЕРЕЯ О РЕСТОРАНЕ ================== */

const galleryTrack = document.querySelector('.gallery-track');
const galleryPrev = document.querySelector('.gallery-btn.prev');
const galleryNext = document.querySelector('.gallery-btn.next');

let galleryIndex = 0;
const galleryStep = 370; // ширина фото + gap
const galleryMax = 6 - 1; // 6 фото → 5 шагов

galleryNext.addEventListener('click', () => {
    if (galleryIndex < galleryMax) galleryIndex++;
    galleryTrack.style.transform = `translateX(-${galleryIndex * galleryStep}px)`;
});

galleryPrev.addEventListener('click', () => {
    if (galleryIndex > 0) galleryIndex--;
    galleryTrack.style.transform = `translateX(-${galleryIndex * galleryStep}px)`;
});

/* ================== КАТЕГОРИИ МЕНЮ ================== */

const categoryButtons = document.querySelectorAll('.menu-categories li');
const menuLists = document.querySelectorAll('.menu-list');

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        menuLists.forEach(list => list.classList.remove('active'));
        document.getElementById(btn.dataset.category).classList.add('active');
    });
});

/* ================== БЛЮДА ОТ ШЕФА (КАРУСЕЛЬ) ================== */

const chefTrack = document.querySelector('.chef-track');
const chefPrev = document.querySelector('.chef-prev');
const chefNext = document.querySelector('.chef-next');

let chefIndex = 0;
const chefStep = 280; // ширина карточки + gap
const chefMax = 5 - 1; // 5 блюд → 4 шага

chefNext.addEventListener('click', () => {
    if (chefIndex < chefMax) chefIndex++;
    chefTrack.style.transform = `translateX(-${chefIndex * chefStep}px)`;
});

chefPrev.addEventListener('click', () => {
    if (chefIndex > 0) chefIndex--;
    chefTrack.style.transform = `translateX(-${chefIndex * chefStep}px)`;
});



/* ================== ОБРАБОТЧИК БРОНИРОВАНИЯ ================== */

const reservationForm = document.querySelector('.reservation-form');

reservationForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const date = reservationForm.date.value;
    const time = reservationForm.time.value;
    const guests = reservationForm.guests.value;
    const phone = reservationForm.phone.value.trim();
    const comment = reservationForm.comment.value.trim();

    // Проверка телефона
    const phoneClean = phone.replace(/[\s()-]/g, ""); // убираем пробелы, скобки, дефисы
    const phoneValid = /^\+375\d{9}$/.test(phoneClean);

    if (!date || !time || !guests || !phone) {
        showMessage("Пожалуйста, заполните дату, время, гостей и телефон.", "error");
        return;
    }

    if (!phoneValid) {
        showMessage("Введите корректный номер телефона в формате +375XXXXXXXXX", "error");
        return;
    }

    const message =
`Заявка отправлена!
Дата: ${date}
Время: ${time}
Гостей: ${guests}
Телефон: ${phone}
Пожелания: ${comment || "нет"}`;

    showMessage(message, "success");
    reservationForm.reset();
});

/* ================== УВЕДОМЛЕНИЯ ================== */

function showMessage(text, type = "success") {
    const box = document.createElement("div");
    box.className = `alert ${type}`;
    box.textContent = text;

    document.body.appendChild(box);

    setTimeout(() => box.classList.add("show"), 10);

    setTimeout(() => {
        box.classList.remove("show");
        setTimeout(() => box.remove(), 300);
    }, 3500);
}
