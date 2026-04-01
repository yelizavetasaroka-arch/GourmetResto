// utils/validation.js

// --- Примитивные проверки ---

export const validatePhone = (phone) =>
    /^\+375\d{9}$/.test(phone?.replace(/[\s()-]/g, "") || "");

export const validateDate = (date) => {
    if (!date) return false;
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
};

export const validateWorkingHours = (time) => {
    if (!time) return false;
    const [h, m] = time.split(':').map(Number);
    const minutes = h * 60 + m;
    return minutes >= 720 && minutes <= 1439; // 12:00–23:59
};

// --- Основная валидация формы ---

export const validateReservationForm = (data) => {
    const errors = {};

    if (!data.date) {
        errors.date = 'Укажите дату';
    } else if (!validateDate(data.date)) {
        errors.date = 'Дата не может быть в прошлом';
    }

    if (!data.time) {
        errors.time = 'Укажите время';
    } else if (!validateWorkingHours(data.time)) {
        errors.time = 'Ресторан работает с 12:00 до 23:00';
    }

    if (!data.guests) {
        errors.guests = 'Укажите количество гостей';
    }

    if (!data.phone) {
        errors.phone = 'Укажите номер телефона';
    } else if (!validatePhone(data.phone)) {
        errors.phone = 'Введите корректный номер в формате +375XXXXXXXXX';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
