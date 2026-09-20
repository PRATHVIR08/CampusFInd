import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  PlusCircle, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Database,
  CheckCircle2,
  Edit3
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { activeUser, setActiveUser, hasIdentity, claims, isSupabaseConnected } = useApp();
  const [identityOpen, setIdentityOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Local form state for identity editing
  const [draftName, setDraftName] = useState(activeUser.name || '');
  const [draftEmail, setDraftEmail] = useState(activeUser.email || '');
  const [draftPhone, setDraftPhone] = useState(activeUser.phone || '');

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIdentityOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync draft when identity panel opens
  useEffect(() => {
    if (identityOpen) {
      setDraftName(activeUser.name || '');
      setDraftEmail(activeUser.email || '');
      setDraftPhone(activeUser.phone || '');
    }
  }, [identityOpen, activeUser]);

  const pendingClaimsCount = claims.filter(c => c.status === 'pending').length;

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveIdentity = () => {
    if (!draftName.trim() || !draftEmail.trim()) return;
    setActiveUser({
      name: draftName.trim(),
      email: draftEmail.trim().toLowerCase(),
      phone: draftPhone.trim()
    });
    setIdentityOpen(false);
  };

  const avatarLetter = activeUser.name ? activeUser.name.charAt(0).toUpperCase() : '?';
  const displayName = activeUser.name ? activeUser.name.split(' ')[0] : 'Set Profile';

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
          <li className="nav-mobile-only">
            <button
              type="button"
              className="nav-link"
              onClick={() => {
                setMobileMenuOpen(false);
                setDbModalOpen(true);
              }}
            >
              <Database size={16} />
              Database ({isSupabaseConnected ? 'Cloud' : 'Local'})
            </button>
          </li>
        </ul>

        {/* User Identity & Actions */}
        <div className="nav-actions">
          {/* Identity Button & Dropdown */}
          <div className="user-switcher-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              className="user-switcher"
              onClick={() => setIdentityOpen(!identityOpen)}
              title={hasIdentity ? `Posting as ${activeUser.name}` : 'Set your identity to post items'}
              style={{
                borderColor: !hasIdentity ? '#FF6B35' : undefined,
                background: !hasIdentity ? '#FFF7ED' : undefined,
              }}
            >
              <div
                className="user-avatar"
                style={{
                  background: hasIdentity ? undefined : '#FF6B35',
                }}
              >
                {avatarLetter}
              </div>
              <span className="nav-user-label">
                {displayName}
              </span>
              <ChevronDown size={14} color="#6B7280" />
            </button>

            {identityOpen && (
              <div className="identity-dropdown-panel">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EBF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} color="#0066CC" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>Your Identity</p>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Used when you post items or claims</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '0.85rem', padding: '7px 10px' }}
                      placeholder="e.g. Priya Sharma"
                      value={draftName}
                      onChange={e => setDraftName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Campus Email *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      style={{ fontSize: '0.85rem', padding: '7px 10px' }}
                      placeholder="you@campus.edu"
                      value={draftEmail}
                      onChange={e => setDraftEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      style={{ fontSize: '0.85rem', padding: '7px 10px' }}
                      placeholder="e.g. 9876543210"
                      value={draftPhone}
                      onChange={e => setDraftPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: '0.875rem' }}
                  onClick={handleSaveIdentity}
                  disabled={!draftName.trim() || !draftEmail.trim()}
                >
                  <CheckCircle2 size={15} />
                  <span>Save & Use This Identity</span>
                </button>

                {hasIdentity && (
                  <p style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: '10px', textAlign: 'center' }}>
                    Posting as <strong style={{ color: '#374151' }}>{activeUser.email}</strong>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Database Cloud Status Pill */}
          <button
            className="nav-db-pill"
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

      {/* Identity Prompt Banner — shown when user hasn't set name/email */}
      {!hasIdentity && (
        <div className="nav-identity-banner">
          <Edit3 size={14} aria-hidden />
          <span>Set your name &amp; email so others can contact you when you report items.</span>
          <button
            type="button"
            className="nav-identity-banner-btn"
            onClick={() => setIdentityOpen(true)}
          >
            Set Profile →
          </button>
        </div>
      )}

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
