// API Client with automatic LocalStorage fallback
import { storageService } from './storage';

const API_BASE = '/api';

export const api = {
  // Stats
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const lost = storageService.getLostItems();
    const found = storageService.getFoundItems();
    const totalLostMonth = lost.length;
    const totalFoundMonth = found.length;
    const claimedCount = [...lost, ...found].filter(i => i.status === 'claimed').length;
    return {
      total_lost_month: totalLostMonth,
      total_found_month: totalFoundMonth,
      items_claimed: claimedCount
    };
  },

  // Lost Items
  async getLostItems() {
    try {
      const res = await fetch(`${API_BASE}/items/lost`);
      if (res.ok) return await res.json();
    } catch {}
    return storageService.getLostItems();
  },

  async createLostItem(item) {
    try {
      const res = await fetch(`${API_BASE}/items/lost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) return await res.json();
    } catch {}

    const items = storageService.getLostItems();
    const newItem = {
      ...item,
      id: `lost-${Date.now()}`,
      created_at: new Date().toISOString(),
      date_posted: new Date().toISOString(),
      status: 'open'
    };
    const updated = [newItem, ...items];
    storageService.saveLostItems(updated);
    return newItem;
  },

  async updateLostItem(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/items/lost/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch {}

    const items = storageService.getLostItems();
    const updated = items.map(item => item.id === id ? { ...item, ...updates } : item);
    storageService.saveLostItems(updated);
    return updated.find(i => i.id === id);
  },

  async deleteLostItem(id) {
    try {
      const res = await fetch(`${API_BASE}/items/lost/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {}

    const items = storageService.getLostItems();
    const updated = items.filter(item => item.id !== id);
    storageService.saveLostItems(updated);
    return true;
  },

  // Found Items
  async getFoundItems() {
    try {
      const res = await fetch(`${API_BASE}/items/found`);
      if (res.ok) return await res.json();
    } catch {}
    return storageService.getFoundItems();
  },

  async createFoundItem(item) {
    try {
      const res = await fetch(`${API_BASE}/items/found`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) return await res.json();
    } catch {}

    const items = storageService.getFoundItems();
    const newItem = {
      ...item,
      id: `found-${Date.now()}`,
      created_at: new Date().toISOString(),
      date_posted: new Date().toISOString(),
      status: 'open'
    };
    const updated = [newItem, ...items];
    storageService.saveFoundItems(updated);
    return newItem;
  },

  async updateFoundItem(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/items/found/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch {}

    const items = storageService.getFoundItems();
    const updated = items.map(item => item.id === id ? { ...item, ...updates } : item);
    storageService.saveFoundItems(updated);
    return updated.find(i => i.id === id);
  },

  async deleteFoundItem(id) {
    try {
      const res = await fetch(`${API_BASE}/items/found/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {}

    const items = storageService.getFoundItems();
    const updated = items.filter(item => item.id !== id);
    storageService.saveFoundItems(updated);
    return true;
  },

  // Claims
  async getClaims() {
    try {
      const res = await fetch(`${API_BASE}/claims`);
      if (res.ok) return await res.json();
    } catch {}
    return storageService.getClaims();
  },

  async submitClaim(claim) {
    try {
      const res = await fetch(`${API_BASE}/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claim)
      });
      if (res.ok) return await res.json();
    } catch {}

    const claims = storageService.getClaims();
    const newClaim = {
      ...claim,
      id: `claim-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    const updated = [newClaim, ...claims];
    storageService.saveClaims(updated);
    return newClaim;
  },

  async updateClaimStatus(claimId, status) {
    try {
      const res = await fetch(`${API_BASE}/claims/${claimId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch {}

    const claims = storageService.getClaims();
    const target = claims.find(c => c.id === claimId);
    if (!target) return null;

    target.status = status;
    storageService.saveClaims(claims);

    // If approved, mark the found item as claimed as well!
    if (status === 'approved') {
      const foundItems = storageService.getFoundItems();
      const updatedFound = foundItems.map(item =>
        item.id === target.found_item_id ? { ...item, status: 'claimed' } : item
      );
      storageService.saveFoundItems(updatedFound);
    }
    return target;
  }
};
