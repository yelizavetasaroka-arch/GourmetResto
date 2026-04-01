/**
 * Инициализирует плавную прокрутку для якорей
 */
export function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#main') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Закрываем мобильное меню если открыто
                const mobileNav = document.querySelector('.header__mobile-nav');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    const burger = document.querySelector('.header__burger');
                    const overlay = document.querySelector('.header__mobile-overlay');
                    if (burger) burger.classList.remove('active');
                    if (mobileNav) mobileNav.classList.remove('active');
                    if (overlay) overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

