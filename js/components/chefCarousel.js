// components/chefCarousel.js

export function initChefCarousel() {
    const track = document.querySelector('.chef__track');
    const btnPrev = document.querySelector('.chef__btn--prev');
    const btnNext = document.querySelector('.chef__btn--next');
    const cards = [...document.querySelectorAll('.chef-card')];

    if (!track || !btnPrev || !btnNext || cards.length <= 1) return;

    let index = 0;

    const getCardWidth = () => cards[0].clientWidth + 20; // если есть gap
    const maxIndex = cards.length - 1;

    const update = () => {
        track.style.transform = `translateX(-${index * getCardWidth()}px)`;
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

    // Пересчёт при ресайзе
    window.addEventListener('resize', update);
}
