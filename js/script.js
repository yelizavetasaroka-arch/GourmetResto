/* ================== ГАЛЕРЕЯ О РЕСТОРАНЕ ================== */

const galleryTrack = document.querySelector('.about__gallery-track');
const galleryPrev = document.querySelector('.about__gallery-btn--prev');
const galleryNext = document.querySelector('.about__gallery-btn--next');

if (galleryTrack && galleryPrev && galleryNext) {
    let galleryIndex = 0;
    const galleryStep = 574; // ширина фото 550px + gap 24px
    const galleryMax = 5; // 6 фото → максимум 5 шагов (0-5)

    galleryNext.addEventListener('click', () => {
        if (galleryIndex < galleryMax) {
            galleryIndex++;
            galleryTrack.style.transform = `translateX(-${galleryIndex * galleryStep}px)`;
        }
    });

    galleryPrev.addEventListener('click', () => {
        if (galleryIndex > 0) {
            galleryIndex--;
            galleryTrack.style.transform = `translateX(-${galleryIndex * galleryStep}px)`;
        }
    });
}

/* ================== КАТЕГОРИИ МЕНЮ ================== */

const categoryButtons = document.querySelectorAll('.menu__category');
const menuLists = document.querySelectorAll('.menu__list');

if (categoryButtons.length && menuLists.length) {
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем активный класс у всех категорий
            categoryButtons.forEach(b => b.classList.remove('menu__category--active'));
            // Добавляем активный класс текущей категории
            btn.classList.add('menu__category--active');

            // Скрываем все списки меню
            menuLists.forEach(list => list.classList.remove('menu__list--active'));
            // Показываем выбранный список
            const categoryId = btn.dataset.category;
            if (categoryId) {
                const targetList = document.getElementById(categoryId);
                if (targetList) {
                    targetList.classList.add('menu__list--active');
                }
            }
        });
    });
}

/* ================== БЛЮДА ОТ ШЕФА (КАРУСЕЛЬ) ================== */

const chefTrack = document.querySelector('.chef__track');
const chefPrev = document.querySelector('.chef__btn--prev');
const chefNext = document.querySelector('.chef__btn--next');

if (chefTrack && chefPrev && chefNext) {
    let chefIndex = 0;
    const chefStep = 280; // ширина карточки 260px + gap 20px
    const chefCards = document.querySelectorAll('.chef-card');
    const chefMax = chefCards.length - 1; // количество карточек - 1

    if (chefMax > 0) {
        chefNext.addEventListener('click', () => {
            if (chefIndex < chefMax) {
                chefIndex++;
                chefTrack.style.transform = `translateX(-${chefIndex * chefStep}px)`;
            }
        });

        chefPrev.addEventListener('click', () => {
            if (chefIndex > 0) {
                chefIndex--;
                chefTrack.style.transform = `translateX(-${chefIndex * chefStep}px)`;
            }
        });
    }
}

/* ================== ОБРАБОТЧИК БРОНИРОВАНИЯ ================== */

const reservationForm = document.querySelector('.reservation-form');

if (reservationForm) {
    reservationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const date = reservationForm.date?.value;
        const time = reservationForm.time?.value;
        const guests = reservationForm.guests?.value;
        const phone = reservationForm.phone?.value.trim();
        const comment = reservationForm.comment?.value.trim();

        // Проверка телефона
        const phoneClean = phone ? phone.replace(/[\s()-]/g, "") : "";
        const phoneValid = /^\+375\d{9}$/.test(phoneClean);

        if (!date || !time || !guests || !phone) {
            showMessage("Пожалуйста, заполните дату, время, гостей и телефон.", "error");
            return;
        }

        if (!phoneValid) {
            showMessage("Введите корректный номер телефона в формате +375XXXXXXXXX", "error");
            return;
        }

        const message = `Заявка отправлена!
Дата: ${date}
Время: ${time}
Гостей: ${guests}
Телефон: ${phone}
Пожелания: ${comment || "нет"}`;

        showMessage(message, "success");
        reservationForm.reset();
    });
}

/* ================== УВЕДОМЛЕНИЯ ================== */

function showMessage(text, type = "success") {
    const box = document.createElement("div");
    box.className = `alert ${type}`;
    box.textContent = text;
    box.setAttribute('role', 'alert');

    // Стили для уведомлений (можно добавить в CSS)
    box.style.position = 'fixed';
    box.style.bottom = '20px';
    box.style.right = '20px';
    box.style.padding = 'var(--space-sm) var(--space-md)';
    box.style.background = type === 'success' ? 'var(--color-accent)' : '#dc3545';
    box.style.color = 'var(--color-white)';
    box.style.borderRadius = 'var(--radius-md)';
    box.style.boxShadow = 'var(--shadow-strong)';
    box.style.zIndex = '9999';
    box.style.opacity = '0';
    box.style.transform = 'translateY(20px)';
    box.style.transition = 'all var(--transition-base)';

    document.body.appendChild(box);

    // Анимация появления
    setTimeout(() => {
        box.style.opacity = '1';
        box.style.transform = 'translateY(0)';
    }, 10);

    // Автоматическое скрытие
    setTimeout(() => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        setTimeout(() => box.remove(), 300);
    }, 3500);
}

/* ================== ДОПОЛНИТЕЛЬНО: ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРЕЙ ================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ================== ДОПОЛНИТЕЛЬНО: АКТИВНЫЙ ПУНКТ МЕНЮ ПРИ СКРОЛЛЕ ================== */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.header__nav-link');

if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100; // небольшой offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}


/* ================== БУРГЕР-МЕНЮ ================== */

const burger = document.querySelector('.header__burger');
const mobileNav = document.querySelector('.header__mobile-nav');
const overlay = document.querySelector('.header__mobile-overlay');
const mobileLinks = document.querySelectorAll('.header__mobile-nav-link');

if (burger && mobileNav && overlay) {
    
    function openMenu() {
        burger.classList.add('active');
        mobileNav.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        burger.classList.remove('active');
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Открытие по клику на бургер
    burger.addEventListener('click', openMenu);
    
    // Закрытие по клику на оверлей
    overlay.addEventListener('click', closeMenu);
    
    // Закрытие по клику на ссылки
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}