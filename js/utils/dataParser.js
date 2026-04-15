// Парсер данных меню
export class MenuDataParser {
  // Группировка блюд по категориям
  static groupByCategory(menuData, categories) {
    const grouped = {};

    categories.forEach((cat) => {
      grouped[cat.slug] = {
        id: cat.id,
        name: cat.name,
        items: [],
      };
    });

    if (menuData && menuData.length) {
      menuData.forEach((item) => {
        const category = categories.find((c) => c.id === item.category_id);
        if (category && grouped[category.slug]) {
          grouped[category.slug].items.push(item);
        }
      });
    }

    return grouped;
  }

  // Поиск блюд
  static searchItems(menuData, query) {
    if (!query) return menuData;
    const searchTerm = query.toLowerCase();
    return menuData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm),
    );
  }

  // Фильтрация по цене
  static filterByPrice(menuData, minPrice, maxPrice) {
    return menuData.filter(
      (item) => item.price >= minPrice && item.price <= maxPrice,
    );
  }

  // Форматирование цены
  static formatPrice(price) {
    return `${price} BYN`;
  }
}

// Парсер бронирований
export class BookingParser {
  // Подготовка данных для API
  static prepareForAPI(formData) {
    return {
      date: formData.date,
      time: formData.time,
      guests: parseInt(formData.guests),
      phone: formData.phone.replace(/[\s()-]/g, ""),
      comment: formData.comment || "",
      source: "web",
    };
  }

  // Форматирование для отображения
  static formatForDisplay(booking) {
    return {
      id: booking.id,
      date: new Date(booking.date).toLocaleDateString("ru-RU"),
      time: booking.time,
      guests: booking.guests,
      phone: booking.phone,
      comment: booking.comment || "Нет пожеланий",
      createdAt: booking.createdAt
        ? new Date(booking.createdAt).toLocaleString("ru-RU")
        : "Только что",
    };
  }
}
