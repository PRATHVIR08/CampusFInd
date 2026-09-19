import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import { CATEGORIES } from '../services/seedData';
import { 
  Search, 
  PlusCircle, 
  FileQuestion, 
  X, 
  Sparkles,
  ShieldCheck 
} from 'lucide-react';

export default function FoundItemsPage({ setActiveTab, onSelectItem, onOpenClaim }) {
  const { foundItems, globalSearch, setGlobalSearch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState(globalSearch || '');

  // Filter & Sort Pipeline
  const filteredItems = useMemo(() => {
    return foundItems.filter((item) => {
      // Search match
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(term);
        const matchesDesc = item.description.toLowerCase().includes(term);
        const matchesLoc = item.location_found.toLowerCase().includes(term);
        const matchesCat = item.category.toLowerCase().includes(term);
        const matchesHolding = item.holding_location?.toLowerCase().includes(term);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesCat && !matchesHolding) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All' && !item.location_found.includes(selectedLocation)) {
        return false;
      }

      // Date range filter
      if (dateFilter !== 'All Time') {
        const itemDate = new Date(item.date_posted || item.created_at);
        const now = new Date();
        const diffDays = (now - itemDate) / (1000 * 3600 * 24);

        if (dateFilter === 'Today' && diffDays > 1) return false;
        if (dateFilter === 'This Week' && diffDays > 7) return false;
        if (dateFilter === 'This Month' && diffDays > 30) return false;
      }

      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.date_posted || a.created_at);
      const dateB = new Date(b.date_posted || b.created_at);

      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      return 0;
    });
  }, [foundItems, searchTerm, selectedCategory, selectedLocation, dateFilter, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedLocation('All');
    setDateFilter('All Time');
    setSortBy('newest');
    setSearchTerm('');
    setGlobalSearch('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedLocation !== 'All' || dateFilter !== 'All Time' || searchTerm !== '';

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-found">Good Samaritan Vault</span>
            <h1 style={{ fontSize: '2rem', color: '#111827' }}>
              Found Items on Campus
            </h1>
          </div>
          <p style={{ color: '#6B7280' }}>
            Items safely turned in or held by campus students and security. Recognise something? Click to submit a claim!
          </p>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={() => setActiveTab('report-found')}
        >
          <PlusCircle size={18} />
          <span>I Found Something</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        {/* Search row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search 
              size={18} 
              color="#9CA3AF" 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '38px' }}
              placeholder="Search found items (e.g. Apple Watch, keys, jacket, holding location)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Where Found Location Select */}
          <div style={{ minWidth: '180px' }}>
            <select
              className="filter-select"
              style={{ width: '100%', height: '100%' }}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="All">All Found Locations</option>
              <option value="Library">Central Library</option>
              <option value="Student Union">Student Union</option>
              <option value="Science">Science Quad</option>
              <option value="Dorm">North/South Dorms</option>
              <option value="Engineering">Engineering Complex</option>
              <option value="Gym">Recreation & Gym</option>
              <option value="Dining">Dining Halls</option>
              <option value="Auditorium">Auditorium</option>
            </select>
          </div>

          {/* Date Filter */}
          <div style={{ minWidth: '140px' }}>
            <select
              className="filter-select"
              style={{ width: '100%', height: '100%' }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="All Time">Date Found: All</option>
              <option value="Today">Found Today</option>
              <option value="This Week">Found This Week</option>
              <option value="This Month">Found This Month</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div style={{ minWidth: '150px' }}>
            <select
              className="filter-select"
              style={{ width: '100%', height: '100%' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>
        </div>

        {/* Category Pills Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div className="category-pills">
            <button
              className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('All')}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#EF4444', fontWeight: 600 }}
            >
              <X size={14} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', color: '#6B7280' }}>
        <span>Showing <strong>{filteredItems.length}</strong> items awaiting owner claims</span>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: 'white', borderRadius: '16px', border: '1px dashed #D1D5DB' }}>
          <FileQuestion size={48} color="#9CA3AF" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '6px' }}>
            No Matching Found Items
          </h3>
          <p style={{ color: '#6B7280', maxWidth: '400px', margin: '0 auto 16px' }}>
            No items currently in custody match this search. Have you found something? Help the campus community by posting it!
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('report-found')}>
            Report Found Item
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              type="found"
              onSelect={(selected) => onSelectItem(selected, 'found')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
