import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  MapPin, 
  PlusCircle, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  Inbox
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { activeUser, setActiveUser, demoUsers, claims } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Claims count for the active user (either as finder or claimer)
  const pendingClaimsCount = claims.filter(c => c.status === 'pending').length;

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div 
          className="nav-brand" 
          onClick={() => handleNavClick('home')} 
          style={{ cursor: 'pointer' }}
        >
          <div className="nav-logo-icon">
            <MapPin size={20} />
          </div>
          <span>Campus<strong>Find</strong></span>
        </div>

        {/* Desktop Navigation Links */}
        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <button
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'lost' ? 'active' : ''}`}
              onClick={() => handleNavClick('lost')}
            >
              Lost Items
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'found' ? 'active' : ''}`}
              onClick={() => handleNavClick('found')}
            >
              Found Items
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'myposts' ? 'active' : ''}`}
              onClick={() => handleNavClick('myposts')}
              style={{ position: 'relative' }}
            >
              My Posts
              {pendingClaimsCount > 0 && (
                <span 
                  style={{
                    backgroundColor: '#FF6B35',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '999px',
                    padding: '1px 6px',
                    marginLeft: '4px'
                  }}
                >
                  {pendingClaimsCount}
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => handleNavClick('contact')}
            >
              Contact
            </button>
          </li>
        </ul>

        {/* User Account Switcher & Actions */}
        <div className="nav-actions">
          <div className="user-switcher-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              className="user-switcher"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              title="Switch user demo profile"
            >
              <div className="user-avatar">
                {activeUser.name.charAt(0)}
              </div>
              <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeUser.name.split(' ')[0]}
              </span>
              <ChevronDown size={14} color="#6B7280" />
            </button>

            {userDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '260px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  border: '1px solid #E5E7EB',
                  padding: '8px',
                  zIndex: 100,
                  animation: 'fadeIn 0.15s ease'
                }}
              >
                <div style={{ padding: '8px 10px 6px', borderBottom: '1px solid #F3F4F6' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Active Demo Student
                  </p>
                  <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.92rem' }}>
                    {activeUser.name}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                    {activeUser.role}
                  </p>
                </div>

                <div style={{ padding: '6px 0' }}>
                  <p style={{ fontSize: '0.72rem', color: '#9CA3AF', padding: '4px 10px', textTransform: 'uppercase', fontWeight: 600 }}>
                    Switch Demo Profile:
                  </p>
                  {demoUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setActiveUser(u);
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        borderRadius: '8px',
                        background: activeUser.id === u.id ? '#EBF5FF' : 'transparent',
                        color: activeUser.id === u.id ? '#0066CC' : '#374151',
                        fontWeight: activeUser.id === u.id ? 600 : 400,
                        fontSize: '0.85rem'
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: activeUser.id === u.id ? '#0066CC' : '#E5E7EB',
                          color: activeUser.id === u.id ? 'white' : '#4B5563',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700
                        }}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div>{u.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{u.role.split(',')[0]}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Post Button */}
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleNavClick('report-lost')}
            style={{ display: 'none', md: 'inline-flex' }}
          >
            <PlusCircle size={16} />
            <span>Post Item</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
