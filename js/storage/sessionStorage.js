// Временное хранение данных сессии
class SessionStorageService {
  constructor() {
    this.FORM_DRAFT_KEY = "booking_form_draft";
  }

  // Сохранить черновик формы
  saveFormDraft(formData) {
    try {
      const draft = {
        data: formData,
        timestamp: Date.now(),
      };
      window.sessionStorage.setItem(this.FORM_DRAFT_KEY, JSON.stringify(draft));
      return true;
    } catch (error) {
      console.error("Ошибка сохранения черновика:", error);
      return false;
    }
  }

  // Получить черновик формы
  getFormDraft() {
    try {
      const draft = window.sessionStorage.getItem(this.FORM_DRAFT_KEY);
      if (!draft) return null;

      const { data, timestamp } = JSON.parse(draft);
      // Черновик действителен 30 минут
      const isValid = Date.now() - timestamp < 1800000;

      return isValid ? data : null;
    } catch (error) {
      console.error("Ошибка получения черновика:", error);
      return null;
    }
  }

  // Очистить черновик
  clearFormDraft() {
    try {
      window.sessionStorage.removeItem(this.FORM_DRAFT_KEY);
      return true;
    } catch (error) {
      console.error("Ошибка очистки черновика:", error);
      return false;
    }
  }

  // Сохранить состояние фильтрации меню
  saveFilterState(categoryId) {
    try {
      window.sessionStorage.setItem("current_category", categoryId);
    } catch (error) {
      console.error("Ошибка сохранения фильтра:", error);
    }
  }

  getFilterState() {
    try {
      return window.sessionStorage.getItem("current_category");
    } catch (error) {
      return null;
    }
  }
}

export const sessionStorageService = new SessionStorageService();
