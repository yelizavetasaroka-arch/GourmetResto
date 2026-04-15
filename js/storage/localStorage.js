// Кэш для меню
class MenuCache {
  constructor() {
    this.CACHE_KEY = "gourmet_menu_cache";
  }

  save(menuData) {
    try {
      const cache = {
        data: menuData,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
      return true;
    } catch (error) {
      return false;
    }
  }

  get() {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      // Кэш действителен 1 час
      const isValid = Date.now() - timestamp < 3600000;
      return isValid ? data : null;
    } catch (error) {
      return null;
    }
  }

  has() {
    return this.get() !== null;
  }

  clear() {
    localStorage.removeItem(this.CACHE_KEY);
  }
}

// Очередь оффлайн бронирований
class OfflineQueue {
  constructor() {
    this.QUEUE_KEY = "gourmet_offline_queue";
  }

  add(booking) {
    try {
      const queue = this.getAll();
      queue.push({
        ...booking,
        id: Date.now(),
        queuedAt: new Date().toISOString(),
      });
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
      return true;
    } catch (error) {
      return false;
    }
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  remove(id) {
    try {
      const queue = this.getAll();
      const filtered = queue.filter((item) => item.id !== id);
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      return false;
    }
  }

  hasPending() {
    return this.getAll().length > 0;
  }

  getCount() {
    return this.getAll().length;
  }

  clear() {
    localStorage.removeItem(this.QUEUE_KEY);
  }
}

// Сохранение бронирований после синхронизации
class SyncedBookings {
  constructor() {
    this.KEY = "gourmet_synced_bookings";
  }

  save(bookings) {
    localStorage.setItem(this.KEY, JSON.stringify(bookings));
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  add(booking) {
    const bookings = this.getAll();
    bookings.push(booking);
    this.save(bookings);
  }
}

export const menuCache = new MenuCache();
export const offlineQueue = new OfflineQueue();
export const syncedBookings = new SyncedBookings();
