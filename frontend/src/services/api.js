// Unified API & Data Service with Supabase PostgreSQL and LocalStorage Fallback
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { storageService } from './storage';

export const api = {
  isCloudConnected() {
    return isSupabaseConfigured();
  },

  // Stats
  async getStats() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const [lostRes, foundRes] = await Promise.all([
          supabase.from('lost_items').select('id, status'),
          supabase.from('found_items').select('id, status')
        ]);

        if (!lostRes.error && !foundRes.error) {
          const lost = lostRes.data || [];
          const found = foundRes.data || [];
          const claimed = [...lost, ...found].filter(i => i.status === 'claimed').length;
          return {
            total_lost_month: lost.length,
            total_found_month: found.length,
            items_claimed: claimed
          };
        }
      } catch (err) {
        console.warn('Supabase stats error, using local fallback:', err);
      }
    }

    // Local fallback
    const lost = storageService.getLostItems();
    const found = storageService.getFoundItems();
    const claimed = [...lost, ...found].filter(i => i.status === 'claimed').length;
    return {
      total_lost_month: lost.length,
      total_found_month: found.length,
      items_claimed: claimed
    };
  },

  // Lost Items
  async getLostItems() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('lost_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error) {
          return data || [];
        }
      } catch (err) {
        console.warn('Supabase getLostItems error, falling back:', err);
      }
    }
    return storageService.getLostItems();
  },

  async createLostItem(item) {
    const newItem = {
      ...item,
      id: item.id || `lost-${Date.now()}`,
      created_at: new Date().toISOString(),
      date_posted: new Date().toISOString(),
      status: 'open',
      photo_urls: item.photo_urls || []
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('lost_items')
          .insert([newItem])
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase createLostItem error, falling back:', err);
      }
    }

    // Local fallback
    const items = storageService.getLostItems();
    const updated = [newItem, ...items];
    storageService.saveLostItems(updated);
    return newItem;
  },

  async updateLostItem(id, updates) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('lost_items')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase updateLostItem error, falling back:', err);
      }
    }

    // Local fallback
    const items = storageService.getLostItems();
    const updated = items.map(i => i.id === id ? { ...i, ...updates } : i);
    storageService.saveLostItems(updated);
    return updated.find(i => i.id === id);
  },

  async deleteLostItem(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('lost_items')
          .delete()
          .eq('id', id);

        if (!error) return true;
      } catch (err) {
        console.warn('Supabase deleteLostItem error, falling back:', err);
      }
    }

    const items = storageService.getLostItems();
    const updated = items.filter(i => i.id !== id);
    storageService.saveLostItems(updated);
    return true;
  },

  // Found Items
  async getFoundItems() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('found_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error) {
          return data || [];
        }
      } catch (err) {
        console.warn('Supabase getFoundItems error, falling back:', err);
      }
    }
    return storageService.getFoundItems();
  },

  async createFoundItem(item) {
    const newItem = {
      ...item,
      id: item.id || `found-${Date.now()}`,
      created_at: new Date().toISOString(),
      date_posted: new Date().toISOString(),
      status: 'open',
      photo_urls: item.photo_urls || []
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('found_items')
          .insert([newItem])
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase createFoundItem error, falling back:', err);
      }
    }

    const items = storageService.getFoundItems();
    const updated = [newItem, ...items];
    storageService.saveFoundItems(updated);
    return newItem;
  },

  async updateFoundItem(id, updates) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('found_items')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase updateFoundItem error, falling back:', err);
      }
    }

    const items = storageService.getFoundItems();
    const updated = items.map(i => i.id === id ? { ...i, ...updates } : i);
    storageService.saveFoundItems(updated);
    return updated.find(i => i.id === id);
  },

  async deleteFoundItem(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('found_items')
          .delete()
          .eq('id', id);

        if (!error) return true;
      } catch (err) {
        console.warn('Supabase deleteFoundItem error, falling back:', err);
      }
    }

    const items = storageService.getFoundItems();
    const updated = items.filter(i => i.id !== id);
    storageService.saveFoundItems(updated);
    return true;
  },

  // Claims
  async getClaims() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('claims')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error) {
          return data || [];
        }
      } catch (err) {
        console.warn('Supabase getClaims error, falling back:', err);
      }
    }
    return storageService.getClaims();
  },

  async submitClaim(claim) {
    const newClaim = {
      ...claim,
      id: claim.id || `claim-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('claims')
          .insert([newClaim])
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase submitClaim error, falling back:', err);
      }
    }

    const claims = storageService.getClaims();
    const updated = [newClaim, ...claims];
    storageService.saveClaims(updated);
    return newClaim;
  },

  async updateClaimStatus(claimId, status) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('claims')
          .update({ status })
          .eq('id', claimId)
          .select()
          .single();

        if (!error && data) {
          if (status === 'approved') {
            await supabase
              .from('found_items')
              .update({ status: 'claimed' })
              .eq('id', data.found_item_id);
          }
          return data;
        }
      } catch (err) {
        console.warn('Supabase updateClaimStatus error, falling back:', err);
      }
    }

    const claims = storageService.getClaims();
    const target = claims.find(c => c.id === claimId);
    if (!target) return null;

    target.status = status;
    storageService.saveClaims(claims);

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
