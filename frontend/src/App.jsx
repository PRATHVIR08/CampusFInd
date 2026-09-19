import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ItemDetailModal from './components/ItemDetailModal';
import ClaimModal from './components/ClaimModal';
import ContactModal from './components/ContactModal';

// Pages
import HomePage from './pages/HomePage';
import LostItemsPage from './pages/LostItemsPage';
import FoundItemsPage from './pages/FoundItemsPage';
import ReportLostPage from './pages/ReportLostPage';
import ReportFoundPage from './pages/ReportFoundPage';
import MyPostsPage from './pages/MyPostsPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [detailModalItem, setDetailModalItem] = useState(null);
  const [detailModalType, setDetailModalType] = useState('lost');
  const [claimTargetItem, setClaimTargetItem] = useState(null);
  const [contactTargetItem, setContactTargetItem] = useState(null);
  const [contactTargetType, setContactTargetType] = useState('lost');

  // Handle URL hash routing if user opens a direct share link (e.g. #lost-101 or #found-201)
  const { lostItems, foundItems } = useApp();

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('lost-')) {
        const id = hash.replace('lost-', '');
        const target = lostItems.find(i => i.id === id);
        if (target) {
          setDetailModalItem(target);
          setDetailModalType('lost');
          setActiveTab('lost');
        }
      } else if (hash.startsWith('found-')) {
        const id = hash.replace('found-', '');
        const target = foundItems.find(i => i.id === id);
        if (target) {
          setDetailModalItem(target);
          setDetailModalType('found');
          setActiveTab('found');
        }
      }
    };

    if (lostItems.length > 0 || foundItems.length > 0) {
      handleHash();
    }
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [lostItems, foundItems]);

  const handleSelectItem = (item, type = 'lost') => {
    setDetailModalItem(item);
    setDetailModalType(type);
  };

  const handleOpenClaim = (item) => {
    setDetailModalItem(null);
    setClaimTargetItem(item);
  };

  const handleOpenContact = (item, type = 'lost') => {
    setDetailModalItem(null);
    setContactTargetItem(item);
    setContactTargetType(type);
  };

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content View based on Active Tab */}
      <main className="main-content">
        {activeTab === 'home' && (
          <HomePage 
            setActiveTab={setActiveTab} 
            onSelectItem={handleSelectItem} 
          />
        )}

        {activeTab === 'lost' && (
          <LostItemsPage 
            setActiveTab={setActiveTab} 
            onSelectItem={handleSelectItem} 
          />
        )}

        {activeTab === 'found' && (
          <FoundItemsPage 
            setActiveTab={setActiveTab} 
            onSelectItem={handleSelectItem}
            onOpenClaim={handleOpenClaim} 
          />
        )}

        {activeTab === 'report-lost' && (
          <ReportLostPage 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'report-found' && (
          <ReportFoundPage 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'myposts' && (
          <MyPostsPage 
            setActiveTab={setActiveTab} 
            onSelectItem={handleSelectItem} 
          />
        )}

        {activeTab === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Item Detail View Modal */}
      {detailModalItem && (
        <ItemDetailModal
          item={detailModalItem}
          type={detailModalType}
          onClose={() => setDetailModalItem(null)}
          onOpenClaim={handleOpenClaim}
          onOpenContact={handleOpenContact}
        />
      )}

      {/* Claim Submission Modal */}
      {claimTargetItem && (
        <ClaimModal
          item={claimTargetItem}
          onClose={() => setClaimTargetItem(null)}
        />
      )}

      {/* Contact / In-App Message Modal */}
      {contactTargetItem && (
        <ContactModal
          item={contactTargetItem}
          type={contactTargetType}
          onClose={() => setContactTargetItem(null)}
        />
      )}

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
}
