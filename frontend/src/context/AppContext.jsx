import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { api } from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeUser, setActiveUserState] = useState(() => storageService.getActiveUser());
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({ total_lost_month: 0, total_found_month: 0, items_claimed: 0 });
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Modals state
  const [selectedItem, setSelectedItem] = useState(null);
  const [claimTargetItem, setClaimTargetItem] = useState(null);
  const [contactTargetItem, setContactTargetItem] = useState(null);
  const [toasts, setToasts] = useState([]);
  const isSupabaseConnected = api.isCloudConnected();

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshData = async () => {
    try {
      const [lost, found, allClaims, newStats] = await Promise.all([
        api.getLostItems(),
        api.getFoundItems(),
        api.getClaims(),
        api.getStats()
      ]);
      setLostItems(lost);
      setFoundItems(found);
      setClaims(allClaims);
      setStats(newStats);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Update user identity (name, email, phone) — persisted to localStorage
  const setActiveUser = (user) => {
    // Generate a stable ID from the email so "My Posts" can match across sessions
    const userId = user.email
      ? `user_${user.email.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`
      : `user_${Date.now()}`;
    const fullUser = { ...user, id: userId };
    storageService.setActiveUser(fullUser);
    setActiveUserState(fullUser);
  };

  const createLostItem = async (itemData) => {
    const created = await api.createLostItem({
      ...itemData,
      poster_id: activeUser.id,
      poster_name: activeUser.name,
      email: itemData.email || activeUser.email,
      phone: itemData.phone || activeUser.phone
    });
    await refreshData();
    addToast('Lost item report published successfully!', 'success');
    return created;
  };

  const createFoundItem = async (itemData) => {
    const created = await api.createFoundItem({
      ...itemData,
      finder_id: activeUser.id,
      finder_name: activeUser.name,
      email: itemData.email || activeUser.email,
      phone: itemData.phone || activeUser.phone
    });
    await refreshData();
    addToast('Found item report published successfully!', 'success');
    return created;
  };

  const updateLostItem = async (id, updates) => {
    const updated = await api.updateLostItem(id, updates);
    await refreshData();
    addToast('Item updated successfully', 'success');
    return updated;
  };

  const deleteLostItem = async (id) => {
    await api.deleteLostItem(id);
    await refreshData();
    addToast('Item deleted', 'info');
  };

  const updateFoundItem = async (id, updates) => {
    const updated = await api.updateFoundItem(id, updates);
    await refreshData();
    addToast('Item updated successfully', 'success');
    return updated;
  };

  const deleteFoundItem = async (id) => {
    await api.deleteFoundItem(id);
    await refreshData();
    addToast('Item deleted', 'info');
  };

  const submitClaim = async (claimData) => {
    const created = await api.submitClaim({
      ...claimData,
      claimer_id: activeUser.id,
      claimer_name: activeUser.name,
      claimer_email: activeUser.email,
      claimer_phone: activeUser.phone
    });
    await refreshData();
    addToast('Claim submitted! The finder has been notified.', 'success');
    return created;
  };

  const handleClaimDecision = async (claimId, decision) => {
    const updated = await api.updateClaimStatus(claimId, decision);
    await refreshData();
    if (decision === 'approved') {
      addToast('Claim APPROVED! Item marked as Claimed & contact info shared.', 'success');
    } else {
      addToast('Claim was declined.', 'info');
    }
    return updated;
  };

  // Check whether the user has set their identity
  const hasIdentity = !!(activeUser.name && activeUser.email);

  return (
    <AppContext.Provider
      value={{
        activeUser,
        setActiveUser,
        hasIdentity,
        lostItems,
        foundItems,
        claims,
        stats,
        globalSearch,
        setGlobalSearch,
        selectedItem,
        setSelectedItem,
        claimTargetItem,
        setClaimTargetItem,
        contactTargetItem,
        setContactTargetItem,
        toasts,
        addToast,
        removeToast,
        createLostItem,
        createFoundItem,
        updateLostItem,
        deleteLostItem,
        updateFoundItem,
        deleteFoundItem,
        submitClaim,
        handleClaimDecision,
        refreshData,
        isSupabaseConnected
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
