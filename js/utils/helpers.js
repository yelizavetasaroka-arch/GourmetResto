// utils/helpers.js

export const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};

export const smoothScrollTo = (target, offset = 0) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
        top,
        behavior: 'smooth'
    });
};

export const getFormData = (form) =>
    Object.fromEntries(new FormData(form).entries());

export const resetForm = (form) => form.reset();
