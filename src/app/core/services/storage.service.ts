import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    /**
     * Retrieves an item from storage by key.
     * @param key The key of the item to retrieve.
     * @returns The item value or null if not found.
     */
    public getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    /**
     * Stores an item in storage.
     * @param key The key to store the value under.
     * @param value The value to store.
     */
    public setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    /**
     * Removes an item from storage by key.
     * @param key The key of the item to remove.
     */
    public removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Clears all items from storage.
     */
    public clear(): void {
        localStorage.clear();
    }
}
