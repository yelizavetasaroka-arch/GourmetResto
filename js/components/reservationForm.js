// components/reservationForm.js

import { validateReservationForm } from '../utils/validation.js';
import { showNotification } from '../utils/notifications.js';
import { getFormData, resetForm } from '../utils/helpers.js';

export function initReservationForm() {
    const form = document.querySelector('.reservation-form');
    if (!form) return;

    form.setAttribute('novalidate', '');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = getFormData(form);
        const validation = validateReservationForm(data);

        if (!validation.isValid) {
            showNotification(Object.values(validation.errors).join('\n'), 'error');
            return;
        }

        const message =
            `Заявка отправлена!\n\n` +
            `Дата: ${data.date}\n` +
            `Время: ${data.time}\n` +
            `Гостей: ${data.guests}\n` +
            `Телефон: ${data.phone}\n` +
            `Пожелания: ${data.comment || 'нет'}`;

        showNotification(message, 'success');
        resetForm(form);
    });
}
