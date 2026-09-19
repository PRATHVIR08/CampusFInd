// LocalStorage Management & Persistence Layer
import { INITIAL_LOST_ITEMS, INITIAL_FOUND_ITEMS, INITIAL_CLAIMS, DEMO_USERS } from './seedData';

const STORAGE_KEYS = {
  LOST_ITEMS: 'campusfind_lost_items',
  FOUND_ITEMS: 'campusfind_found_items',
  CLAIMS: 'campusfind_claims',
  ACTIVE_USER: 'campusfind_active_user',
  SEARCH_HISTORY: 'campusfind_search_history',
  NOTIFICATIONS: 'campusfind_notifications'
};

export const storageService = {
  getLostItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOST_ITEMS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.LOST_ITEMS, JSON.stringify(INITIAL_LOST_ITEMS));
        return INITIAL_LOST_ITEMS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LOST_ITEMS;
    }
  },

  saveLostItems(items) {
    localStorage.setItem(STORAGE_KEYS.LOST_ITEMS, JSON.stringify(items));
  },

  getFoundItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOUND_ITEMS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.FOUND_ITEMS, JSON.stringify(INITIAL_FOUND_ITEMS));
        return INITIAL_FOUND_ITEMS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_FOUND_ITEMS;
    }
  },

  saveFoundItems(items) {
    localStorage.setItem(STORAGE_KEYS.FOUND_ITEMS, JSON.stringify(items));
  },

  getClaims() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLAIMS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
        return INITIAL_CLAIMS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CLAIMS;
    }
  },

  saveClaims(claims) {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
  },

  getActiveUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (!data) {
        const defaultUser = DEMO_USERS[0];
        localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(defaultUser));
        return defaultUser;
      }
      return JSON.parse(data);
    } catch {
      return DEMO_USERS[0];
    }
  },

  setActiveUser(user) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
  },

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.LOST_ITEMS, JSON.stringify(INITIAL_LOST_ITEMS));
    localStorage.setItem(STORAGE_KEYS.FOUND_ITEMS, JSON.stringify(INITIAL_FOUND_ITEMS));
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(DEMO_USERS[0]));
  }
};
