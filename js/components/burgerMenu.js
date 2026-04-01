// components/burgerMenu.js

export function initBurgerMenu() {
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__mobile-nav');
    const overlay = document.querySelector('.header__mobile-overlay');
    const links = [...document.querySelectorAll('.header__mobile-nav-link')];

    if (!burger || !nav || !overlay) return;

    const open = () => {
        burger.classList.add('active');
        nav.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const close = () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    const toggle = () => {
        nav.classList.contains('active') ? close() : open();
    };

    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle();
    });

    overlay.addEventListener('click', close);
    links.forEach(link => link.addEventListener('click', close));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
}
