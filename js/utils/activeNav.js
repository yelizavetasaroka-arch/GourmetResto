/**
 * Инициализирует подсветку активного пункта меню при скролле
 */
export function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');

   
    if (!sections.length || !navLinks.length) return;

    const updateActiveLink = () => {
        const scrollY = window.scrollY + 100;

        const current = sections.find(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            return scrollY >= top && scrollY < bottom;
        })?.id;

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}