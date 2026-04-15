import { API_CONFIG, API_ENDPOINTS } from "./config.js";

class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.TIMEOUT,
      );

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("timeout");
      }
      throw error;
    }
  }

  async getMenu() {
    return this.request(API_ENDPOINTS.MENU);
  }

  async getCategories() {
    return this.request(API_ENDPOINTS.CATEGORIES);
  }

  async createBooking(bookingData) {
    return this.request(API_ENDPOINTS.BOOKINGS, {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  }
}

export const apiService = new ApiService();
