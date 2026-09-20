import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import { 
  Search, 
  PlusCircle, 
  HelpCircle, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  MapPin,
  Clock
} from 'lucide-react';

export default function HomePage({ setActiveTab, onSelectItem }) {
  const { lostItems, foundItems, stats, setGlobalSearch } = useApp();
  const [searchInput, setSearchInput] = useState('');
  const [feedFilter, setFeedFilter] = useState('all'); // all, lost, found

  // Calculate dynamic stats
  const totalLost = lostItems.length;
  const totalFound = foundItems.length;
  const totalClaimed = [...lostItems, ...foundItems].filter(i => i.status === 'claimed').length;

  // Mix lost and found for recent activity feed (sorted newest first)
  const allMixedItems = [
    ...lostItems.map(item => ({ ...item, itemType: 'lost' })),
    ...foundItems.map(item => ({ ...item, itemType: 'found' }))
  ].sort((a, b) => new Date(b.date_posted || b.created_at) - new Date(a.date_posted || a.created_at));

  // Filter feed items
  const filteredFeed = allMixedItems.filter(item => {
    if (feedFilter === 'lost') return item.itemType === 'lost';
    if (feedFilter === 'found') return item.itemType === 'found';
    return true;
  }).slice(0, 8); // Latest 6-8 items

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setGlobalSearch(searchInput.trim());
      setActiveTab('lost'); // Navigate to search results in Lost tab
    }
  };

  const handleQuickTagClick = (tag) => {
    setGlobalSearch(tag);
    setActiveTab('lost');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <Sparkles size={16} />
            <span>Official University Lost & Found Portal</span>
          </div>

          <h1 className="hero-title">
            Lost Something on Campus? <br />
            <span className="highlight">Let's Get It Back To You.</span>
          </h1>

          <p className="hero-subtitle">
            CampusFind bridges the gap between students who lose items and good Samaritans who find them. Search campus-wide records, verify claims, and protect your valuables.
          </p>

          {/* Prominent Global Search Bar */}
          <form className="hero-search-box" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={22} />
              <input
                type="text"
                placeholder="Search by keywords (e.g. MacBook, keys, Hydro Flask, dorm, AirPods)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 18px' }}>
                Search All
              </button>
            </div>

            <div className="hero-quick-tags">
              <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>Quick search:</span>
              {['MacBook', 'Dorm Keys', 'AirPods', 'Water Bottle', 'Student ID', 'Jacket'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="quick-tag"
                  onClick={() => handleQuickTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Two Large CTAs */}
          <div className="hero-cta-group">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setActiveTab('report-lost')}
            >
              <FileText size={20} />
              <span>Report Lost Item</span>
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => setActiveTab('report-found')}
            >
              <CheckCircle2 size={20} />
              <span>I Found Something</span>
            </button>
          </div>

          {/* Quick Stats Dashboard */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <FileText size={28} />
              </div>
              <div className="stat-info">
                <h3>{totalLost}</h3>
                <p>Total Items Lost (This Month)</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <CheckCircle2 size={28} />
              </div>
              <div className="stat-info">
                <h3>{totalFound}</h3>
                <p>Total Items Found (This Month)</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <TrendingUp size={28} />
              </div>
              <div className="stat-info">
                <h3>{totalClaimed}</h3>
                <p>Items Claimed & Reunited</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Feed */}
      <section style={{ padding: '32px 0 48px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Clock size={18} color="#0066CC" />
                <h2 style={{ fontSize: '1.6rem', color: '#111827' }}>Recent Campus Activity</h2>
              </div>
              <p style={{ color: '#6B7280' }}>
                Real-time feed of the latest lost and found reports submitted across campus
              </p>
            </div>

            {/* Feed Filters */}
            <div className="feed-filter-bar">
              <button
                className={`btn btn-sm ${feedFilter === 'all' ? 'btn-primary' : ''}`}
                style={feedFilter !== 'all' ? { color: '#4B5563' } : {}}
                onClick={() => setFeedFilter('all')}
              >
                All Items ({allMixedItems.length})
              </button>
              <button
                className={`btn btn-sm ${feedFilter === 'lost' ? 'btn-primary' : ''}`}
                style={feedFilter !== 'lost' ? { color: '#4B5563' } : {}}
                onClick={() => setFeedFilter('lost')}
              >
                Lost Only ({lostItems.length})
              </button>
              <button
                className={`btn btn-sm ${feedFilter === 'found' ? 'btn-secondary' : ''}`}
                style={feedFilter !== 'found' ? { color: '#4B5563' } : {}}
                onClick={() => setFeedFilter('found')}
              >
                Found Only ({foundItems.length})
              </button>
            </div>
          </div>

          {/* Activity Grid */}
          {filteredFeed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', border: '1px dashed #D1D5DB' }}>
              <p style={{ fontSize: '1.1rem', color: '#6B7280' }}>No items match your criteria right now.</p>
            </div>
          ) : (
            <div className="items-grid">
              {filteredFeed.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  type={item.itemType}
                  onSelect={(selected, type) => onSelectItem(selected, type)}
                />
              ))}
            </div>
          )}

          {/* View More Bar */}
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => setActiveTab('lost')}
            >
              <span>Explore All Lost & Found Records</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Campus Trust & How It Works */}
      <section style={{ background: '#FFFFFF', padding: '48px 0', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>How CampusFind Protects Students</h2>
            <p>A secure 3-step workflow ensuring only genuine owners reclaim campus items.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ padding: '24px', borderRadius: '12px', background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#EBF5FF', color: '#0066CC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', fontWeight: 800 }}>
                1
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Report Fast & Detailed</h4>
              <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.5 }}>
                Post what you lost or found in seconds with campus location autocomplete and photos.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: '12px', background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', fontWeight: 800 }}>
                2
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Proof of Ownership Verification</h4>
              <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.5 }}>
                Claimants must describe unique identifying details (serial numbers, case marks, lock screens).
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: '12px', background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', fontWeight: 800 }}>
                3
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Safe Campus Handover</h4>
              <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.5 }}>
                Once approved by the finder, contact information unlocks for safe handoff or campus desk pickup.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
