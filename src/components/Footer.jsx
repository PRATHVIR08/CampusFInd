import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, RotateCcw, Heart, Shield } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const { resetAllData } = useApp();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="nav-brand" style={{ marginBottom: '12px' }}>
              <div className="nav-logo-icon">
                <MapPin size={20} />
              </div>
              <span>Campus<strong>Find</strong></span>
            </div>
            <p style={{ maxWidth: '320px', marginBottom: '16px', lineHeight: 1.6 }}>
              The official centralized campus platform reuniting university students and staff with their missing valuables quickly, securely, and seamlessly.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={resetAllData} 
                className="btn btn-outline btn-sm"
                title="Reset local data to default demo state"
                style={{ fontSize: '0.78rem' }}
              >
                <RotateCcw size={14} />
                <span>Reset Demo Records</span>
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#374151' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>
                  Home Dashboard
                </a>
              </li>
              <li>
                <a href="#lost" onClick={(e) => { e.preventDefault(); setActiveTab('lost'); }}>
                  Browse Lost Items
                </a>
              </li>
              <li>
                <a href="#found" onClick={(e) => { e.preventDefault(); setActiveTab('found'); }}>
                  Browse Found Items
                </a>
              </li>
              <li>
                <a href="#myposts" onClick={(e) => { e.preventDefault(); setActiveTab('myposts'); }}>
                  My Posts & Claims
                </a>
              </li>
            </ul>
          </div>

          {/* Campus Hotspots */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#374151' }}>
              Campus Drop-offs
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#4B5563' }}>
              <li>Student Union Room 102</li>
              <li>Central Library Front Desk</li>
              <li>Campus Police HQ (North Gate)</li>
              <li>Recreation Center Service Desk</li>
              <li>Dining Hall Manager Office</li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#374151' }}>
              Lost & Found Office
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4B5563' }}>
                <MapPin size={16} color="#0066CC" />
                <span>Student Union, Room 102</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4B5563' }}>
                <Phone size={16} color="#22C55E" />
                <span>(555) 911-LOST (5678)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4B5563' }}>
                <Mail size={16} color="#0066CC" />
                <span>lostandfound@campus.edu</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '4px' }}>
                Hours: Mon – Fri: 8:00 AM – 6:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} CampusFind. Built for University Students & Campus Community.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
            <span>Made with</span>
            <Heart size={14} color="#EF4444" fill="#EF4444" />
            <span>for campus safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
