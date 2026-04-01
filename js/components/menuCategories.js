// components/menuCategories.js

export function initMenuCategories() {
    const buttons = [...document.querySelectorAll('.menu__category')];
    const lists = [...document.querySelectorAll('.menu__list')];

    if (!buttons.length || !lists.length) return;

    const ACTIVE_BTN = 'menu__category--active';
    const ACTIVE_LIST = 'menu__list--active';

    const switchCategory = (btn) => {
        const id = btn.dataset.category;

        buttons.forEach(b => b.classList.toggle(ACTIVE_BTN, b === btn));
        lists.forEach(list => list.classList.toggle(ACTIVE_LIST, list.id === id));
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchCategory(btn);
        });
    });

    // Активируем первую категорию по умолчанию
    switchCategory(buttons[0]);
}
