// utils/notifications.js

export const showNotification = (text, type = 'success', duration = 3500) => {
    const box = document.createElement('div');
    box.className = `alert ${type}`;
    box.textContent = text;

    Object.assign(box.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: '#fff',
        background: type === 'success' ? '#2ecc71' : '#dc3545',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 9999,
        opacity: 0,
        transform: 'translateY(20px)',
        transition: '0.3s ease',
        pointerEvents: 'none',
        whiteSpace: 'pre-line'
    });

    document.body.appendChild(box);

    requestAnimationFrame(() => {
        box.style.opacity = 1;
        box.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        box.style.opacity = 0;
        box.style.transform = 'translateY(20px)';
        setTimeout(() => box.remove(), 300);
    }, duration);
};
