export class StorageService {
    constructor(storeName) {
        this.storeName = storeName;
    }

    getAll() {
        const data = localStorage.getItem(this.storeName);
        return data ? JSON.parse(data) : [];
    }

    saveAll(data) {
        localStorage.setItem(this.storeName, JSON.stringify(data));
        return data;
    }

    add(item) {
        const items = this.getAll();
        const newItem = {
            ...item,
            id: Date.now(),
            createdAt: Date.now()
        };
        items.push(newItem);
        this.saveAll(items);
        return newItem;
    }

    update(id, updatedData) {
        const items = this.getAll();
        const index = items.findIndex(item => item.id === id);

        if (index !== -1) {
            items[index] = {
                ...items[index],
                ...updatedData,
                updatedAt: Date.now()
            };
            this.saveAll(items);
            return items[index];
        }

        return null;
    }

    delete(id) {
        const items = this.getAll();
        const filtered = items.filter(item => item.id !== id);
        this.saveAll(filtered);
        return filtered;
    }

    clear() {
        localStorage.removeItem(this.storeName);
    }
}
