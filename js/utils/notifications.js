export const showNotification = (text, type = "success", duration = 8000) => {
  // Удаляем предыдущее уведомление
  const existingNotification = document.querySelector(".custom-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const box = document.createElement("div");
  box.className = `custom-notification ${type}`;
  box.textContent = text;

  Object.assign(box.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "14px 24px",
    borderRadius: "8px",
    color: "#fff",
    background:
      type === "success" ? "#2ecc71" : type === "error" ? "#dc3545" : "#3498db",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontSize: "14px",
    fontWeight: "500",
    zIndex: 9999,
    opacity: 0,
    transform: "translateY(20px)",
    transition: "0.3s ease",
    pointerEvents: "none",
    whiteSpace: "pre-line",
    maxWidth: "400px",
    lineHeight: "1.5",
  });

  document.body.appendChild(box);

  requestAnimationFrame(() => {
    box.style.opacity = 1;
    box.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    box.style.opacity = 0;
    box.style.transform = "translateY(20px)";
    setTimeout(() => box.remove(), 300);
  }, duration);
};
