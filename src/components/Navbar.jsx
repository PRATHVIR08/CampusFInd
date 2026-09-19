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
  Inbox,
  Database
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { activeUser, setActiveUser, demoUsers, claims, isSupabaseConnected } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
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

          {/* Database Cloud Status Pill */}
          <button
            onClick={() => setDbModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: '999px',
              border: isSupabaseConnected ? '1px solid #BBF7D0' : '1px solid #E5E7EB',
              background: isSupabaseConnected ? '#F0FDF4' : '#F9FAFB',
              color: isSupabaseConnected ? '#15803D' : '#6B7280',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Database Connection Status"
          >
            <Database size={13} color={isSupabaseConnected ? '#16A34A' : '#9CA3AF'} />
            <span>{isSupabaseConnected ? 'Supabase' : 'Local DB'}</span>
          </button>

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

      {/* Database Connection Guide Modal */}
      {dbModalOpen && (
        <div className="modal-overlay" onClick={() => setDbModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={18} color="#16A34A" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>Supabase Database Setup</h3>
                  <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                    Status: <strong>{isSupabaseConnected ? '🟢 Connected to Cloud PostgreSQL' : '⚡ Local Demo Storage Mode'}</strong>
                  </p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setDbModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.88rem', color: '#4B5563', marginBottom: '16px', lineHeight: 1.5 }}>
                CampusFind supports both live <strong>Supabase Cloud PostgreSQL</strong> and seamless <strong>LocalStorage offline mode</strong>.
              </p>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.88rem', color: '#1E293B', marginBottom: '10px', fontWeight: 700 }}>
                  🚀 3-Step Supabase Cloud Setup:
                </h4>
                <ol style={{ paddingLeft: '20px', fontSize: '0.84rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.4 }}>
                  <li>
                    Create a free project at <strong>supabase.com</strong>.
                  </li>
                  <li>
                    Open <strong>SQL Editor</strong> in Supabase and run the provided script in <code>supabase/schema.sql</code>.
                  </li>
                  <li>
                    Add your credentials into your <code>.env</code> file:
                    <pre style={{ background: '#1E293B', color: '#38BDF8', padding: '8px 10px', borderRadius: '6px', fontSize: '0.78rem', marginTop: '6px', overflowX: 'auto' }}>
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key`}
                    </pre>
                  </li>
                </ol>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                💡 If no keys are entered, CampusFind continues to operate in LocalStorage mode with full search, reporting, and claim workflows!
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setDbModalOpen(false)}>
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
