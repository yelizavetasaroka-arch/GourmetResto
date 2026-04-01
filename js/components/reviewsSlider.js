// components/reviewsSlider.js

export function initReviewsSlider() {
    const viewport = document.querySelector('.reviews__viewport');
    const btnPrev = document.querySelector('.reviews__btn--prev');
    const btnNext = document.querySelector('.reviews__btn--next');
    const cards = [...document.querySelectorAll('.review')];

    if (!viewport || !btnPrev || !btnNext || cards.length <= 1) return;

    const getStep = () => cards[0].offsetWidth + 24; // gap = 24px

    btnNext.addEventListener('click', () => {
        viewport.scrollBy({
            left: getStep(),
            behavior: 'smooth'
        });
    });

    btnPrev.addEventListener('click', () => {
        viewport.scrollBy({
            left: -getStep(),
            behavior: 'smooth'
        });
    });
}
