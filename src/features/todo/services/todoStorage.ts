// STORAGE SERVICE - Handles all localStorage operations

const STORAGE_KEY = "furo-todos";

export const todoStorage = {
  load: <T>(): T[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load from storage:", error);
      return [];
    }
  },

  save: <T>(data: T[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save to storage:", error);
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  },
};