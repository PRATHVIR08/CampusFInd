// LocalStorage Management & Persistence Layer — no fake seed data
// Items come exclusively from user submissions (Supabase primary, localStorage fallback).

const STORAGE_KEYS = {
  LOST_ITEMS: 'campusfind_lost_items',
  FOUND_ITEMS: 'campusfind_found_items',
  CLAIMS: 'campusfind_claims',
  ACTIVE_USER: 'campusfind_active_user',
};

const BLANK_USER = {
  id: '',
  name: '',
  email: '',
  phone: '',
};

export const storageService = {
  getLostItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOST_ITEMS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveLostItems(items) {
    localStorage.setItem(STORAGE_KEYS.LOST_ITEMS, JSON.stringify(items));
  },

  getFoundItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOUND_ITEMS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveFoundItems(items) {
    localStorage.setItem(STORAGE_KEYS.FOUND_ITEMS, JSON.stringify(items));
  },

  getClaims() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLAIMS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveClaims(claims) {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
  },

  getActiveUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      return data ? JSON.parse(data) : BLANK_USER;
    } catch {
      return BLANK_USER;
    }
  },

  setActiveUser(user) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
  },

  clearAll() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
