import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../services/seedData';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Calendar, 
  MapPin, 
  X, 
  PlusCircle,
  FileQuestion
} from 'lucide-react';

export default function LostItemsPage({ setActiveTab, onSelectItem }) {
  const { lostItems, globalSearch, setGlobalSearch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [dateFilter, setDateFilter] = useState('All Time'); // Today, This Week, This Month, All Time
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, activity
  const [searchTerm, setSearchTerm] = useState(globalSearch || '');

  // Filter & Sort Pipeline
  const filteredItems = useMemo(() => {
    return lostItems.filter((item) => {
      // Search match
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(term);
        const matchesDesc = item.description.toLowerCase().includes(term);
        const matchesLoc = item.location_lost.toLowerCase().includes(term);
        const matchesCat = item.category.toLowerCase().includes(term);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesCat) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All' && !item.location_lost.includes(selectedLocation)) {
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
      if (sortBy === 'activity') return dateB - dateA;
      return 0;
    });
  }, [lostItems, searchTerm, selectedCategory, selectedLocation, dateFilter, sortBy]);

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
      <div className="page-header-row">
        <div>
          <h1 className="page-title">
            Lost Items Directory
          </h1>
          <p style={{ color: '#6B7280' }}>
            Browse items reported missing on campus. Found one of these? Click to help reunite it!
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setActiveTab('report-lost')}
        >
          <PlusCircle size={18} />
          <span>Report Lost Item</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        {/* Search row */}
        <div className="filter-row-wrap">
          <div className="filter-field" style={{ position: 'relative' }}>
            <Search 
              size={18} 
              color="#9CA3AF" 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '38px' }}
              placeholder="Search lost items (e.g. MacBook, dorm keys, wallet)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Location Select */}
          <div className="filter-field-select">
            <select
              className="filter-select"
              style={{ width: '100%', height: '100%' }}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="All">All Campus Locations</option>
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
          <div className="filter-field-select">
            <select
              className="filter-select"
              style={{ width: '100%', height: '100%' }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="All Time">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="filter-field-select">
            <select
              className="filter-select"
              style={{ width: '100%', height: '100%' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="activity">Sort: Recent Activity</option>
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
        <span>Showing <strong>{filteredItems.length}</strong> items lost on campus</span>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: 'white', borderRadius: '16px', border: '1px dashed #D1D5DB' }}>
          <FileQuestion size={48} color="#9CA3AF" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '6px' }}>
            No Matching Lost Items Found
          </h3>
          <p style={{ color: '#6B7280', maxWidth: '400px', margin: '0 auto 16px' }}>
            Try adjusting your search terms, changing the location filter, or check back soon.
          </p>
          <button className="btn btn-outline btn-sm" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              type="lost"
              onSelect={(selected) => onSelectItem(selected, 'lost')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
