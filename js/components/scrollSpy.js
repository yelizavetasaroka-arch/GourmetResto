// components/scrollSpy.js

export function initScrollSpy(offset = 100) {
    const sections = [...document.querySelectorAll('section[id]')];
    const links = [...document.querySelectorAll('.header__nav-link')];

    if (!sections.length || !links.length) return;

    const update = () => {
        const y = window.scrollY + offset;

        const current = sections.find(sec => {
            const top = sec.offsetTop;
            const bottom = top + sec.offsetHeight;
            return y >= top && y < bottom;
        })?.id;

        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };

    window.addEventListener('scroll', () => requestAnimationFrame(update));
    update();
}
