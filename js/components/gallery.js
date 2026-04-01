// components/gallery.js

export function initGallery() {
    const track = document.querySelector('.about__gallery-track');
    const btnPrev = document.querySelector('.about__gallery-btn--prev');
    const btnNext = document.querySelector('.about__gallery-btn--next');
    const images = [...document.querySelectorAll('.about__gallery-img')];

    if (!track || !btnPrev || !btnNext || !images.length) return;

    let index = 0;

    const getStep = () => images[0].clientWidth;
    const maxIndex = images.length - 1;

    const update = () => {
        track.style.transform = `translateX(-${index * getStep()}px)`;
    };

    btnNext.addEventListener('click', () => {
        if (index < maxIndex) {
            index++;
            update();
        }
    });

    btnPrev.addEventListener('click', () => {
        if (index > 0) {
            index--;
            update();
        }
    });

    // Пересчёт шага при ресайзе
    window.addEventListener('resize', update);
}
