import { StorageService } from '../utils/localStorage.js';

export function initPromoManager() {
    // Создаём хранилище
    const promoStorage = new StorageService('promoList');

    // Ищем элементы в DOM
    const list = document.getElementById('promoList');
    const addBtn = document.querySelector('.promo-add-btn');
    const template = document.getElementById('promoItemTemplate');
    const modalTemplate = document.getElementById('promoModalTemplate');

    // Если блока нет — просто выходим, ничего не ломаем
    if (!list || !addBtn || !template || !modalTemplate) return;

    // Загружаем акции
    let promos = promoStorage.getAll();
    let editingId = null;

    // -----------------------------
    // МОДАЛЬНОЕ ОКНО
    // -----------------------------
    const openModal = (title, text = '') => {
        const modalNode = modalTemplate.content.cloneNode(true);
        const modal = modalNode.querySelector('.promo-modal');

        const modalTitle = modal.querySelector('.promo-modal__title');
        const input = modal.querySelector('.promo-modal__input');
        const saveBtn = modal.querySelector('.promo-modal__save');
        const cancelBtn = modal.querySelector('.promo-modal__cancel');

        modalTitle.textContent = title;
        input.value = text;

        document.body.appendChild(modal);

        cancelBtn.onclick = () => modal.remove();

        saveBtn.onclick = () => {
            const value = input.value.trim();
            if (!value) return;

            if (editingId) {
                // Редактирование
                const item = promos.find(p => p.id === editingId);
                if (item) item.text = value;
                editingId = null;
            } else {
                // Добавление
                promos.push({
                    id: Date.now(),
                    text: value
                });
            }

            promoStorage.saveAll(promos);
            render();
            modal.remove();
        };
    };

    // -----------------------------
    // СОЗДАНИЕ ЭЛЕМЕНТА АКЦИИ
    // -----------------------------
    const createPromoElement = (item) => {
        const node = template.content.cloneNode(true);
        const root = node.querySelector('.promo');

        const text = root.querySelector('.promo__text');
        const editBtn = root.querySelector('.promo__edit');
        const deleteBtn = root.querySelector('.promo__delete');

        text.textContent = item.text;

        editBtn.onclick = () => {
            editingId = item.id;
            openModal('Редактировать акцию', item.text);
        };

        deleteBtn.onclick = () => {
            promos = promos.filter(p => p.id !== item.id);
            promoStorage.saveAll(promos);
            render();
        };

        return node;
    };

    // -----------------------------
    // РЕНДЕР
    // -----------------------------
    const render = () => {
        list.innerHTML = '';
        promos.forEach(item => list.appendChild(createPromoElement(item)));
    };

    // -----------------------------
    // ДОБАВЛЕНИЕ АКЦИИ
    // -----------------------------
    addBtn.onclick = () => {
        editingId = null;
        openModal('Добавить акцию');
    };

    // Первый рендер
    render();
}
