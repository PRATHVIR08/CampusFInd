import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CampusMapVisualizer from './CampusMapVisualizer';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Share2, 
  MessageSquare, 
  CheckCircle, 
  ShieldCheck, 
  Building
} from 'lucide-react';

export default function ItemDetailModal({ item, type, onClose, onOpenClaim, onOpenContact }) {
  const { addToast, activeUser } = useApp();
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!item) return null;

  const isLost = type === 'lost';
  const photos = item.photo_urls && item.photo_urls.length > 0 
    ? item.photo_urls 
    : ['data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23E5E7EB"/><text x="300" y="200" font-family="sans-serif" font-size="24" fill="%239CA3AF" text-anchor="middle">No Photo Attached</text></svg>'];

  const nextPhoto = () => {
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/#${isLost ? 'lost' : 'found'}-${item.id}`;
    navigator.clipboard.writeText(url);
    addToast('Shareable item link copied to clipboard!', 'success');
  };

  const dateValue = isLost ? item.date_lost : item.date_found;
  const locationValue = isLost ? item.location_lost : item.location_found;
  const posterName = isLost ? item.poster_name : item.finder_name;
  const isClaimed = item.status === 'claimed';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
              {isLost ? 'Lost Item' : 'Found Item'}
            </span>
            <span className="cat-badge">{item.category}</span>
            {isClaimed && (
              <span className="badge badge-claimed">
                <CheckCircle size={12} /> Claimed / Recovered
              </span>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Photo Carousel */}
          <div className="carousel-container">
            <img 
              src={photos[photoIndex]} 
              alt={item.title} 
              className="carousel-img"
            />
            {photos.length > 1 && (
              <>
                <button className="carousel-nav-btn prev" onClick={prevPhoto} aria-label="Previous photo">
                  <ChevronLeft size={24} />
                </button>
                <button className="carousel-nav-btn next" onClick={nextPhoto} aria-label="Next photo">
                  <ChevronRight size={24} />
                </button>
                <div className="carousel-dots">
                  {photos.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`carousel-dot ${idx === photoIndex ? 'active' : ''}`}
                      onClick={() => setPhotoIndex(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <h2 style={{ fontSize: '1.45rem', marginBottom: '8px', color: '#111827' }}>
            {item.title}
          </h2>

          {/* Description */}
          <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px', letterSpacing: '0.5px' }}>
              Item Details & Description
            </h4>
            <p style={{ color: '#374151', fontSize: '0.95rem', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
              {item.description}
            </p>
          </div>

          {/* Campus Map Pin Box */}
          <CampusMapVisualizer location={locationValue} isLost={isLost} />

          {/* Holding Location for Found items */}
          {!isLost && item.holding_location && (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '14px 16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Building size={22} color="#16A34A" />
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase' }}>
                  Current Custody & Holding Location
                </p>
                <p style={{ fontWeight: 600, color: '#166534', fontSize: '0.92rem' }}>
                  {item.holding_location}
                </p>
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', background: '#F3F4F6', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.78rem', fontWeight: 600 }}>
                <Calendar size={14} />
                <span>{isLost ? 'DATE LOST' : 'DATE FOUND'}</span>
              </div>
              <div style={{ marginTop: '4px', fontWeight: 600, color: '#1F2937' }}>
                {dateValue || 'Not specified'}
              </div>
            </div>

            <div style={{ padding: '12px', background: '#F3F4F6', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.78rem', fontWeight: 600 }}>
                <Clock size={14} />
                <span>POSTED ON</span>
              </div>
              <div style={{ marginTop: '4px', fontWeight: 600, color: '#1F2937' }}>
                {new Date(item.date_posted || item.created_at).toLocaleDateString()}
              </div>
            </div>

            <div style={{ padding: '12px', background: '#F3F4F6', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.78rem', fontWeight: 600 }}>
                <User size={14} />
                <span>POSTED BY</span>
              </div>
              <div style={{ marginTop: '4px', fontWeight: 600, color: '#1F2937' }}>
                {item.display_name ? posterName : 'Anonymous Student'}
              </div>
            </div>
          </div>

          {/* Contact Information (if allowed or unlocked) */}
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.88rem', textTransform: 'uppercase', color: '#4B5563', marginBottom: '10px', letterSpacing: '0.5px' }}>
              Direct Contact Details
            </h4>
            {item.display_name ? (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {item.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1F2937', fontSize: '0.9rem' }}>
                    <Mail size={16} color="#0066CC" />
                    <span>{item.email}</span>
                  </div>
                )}
                {item.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1F2937', fontSize: '0.9rem' }}>
                    <Phone size={16} color="#22C55E" />
                    <span>{item.phone}</span>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                The poster chose to keep their contact details private. Use the secure in-app messaging button below to contact them directly!
              </p>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="modal-footer">
          <button 
            className="btn btn-outline"
            onClick={handleCopyShareLink}
            title="Copy share link to clipboard"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>

          <button 
            className="btn btn-outline"
            onClick={() => onOpenContact(item, type)}
          >
            <MessageSquare size={16} />
            <span>Message / Contact</span>
          </button>

          {!isLost && !isClaimed && (
            <button 
              className="btn btn-secondary"
              onClick={() => onOpenClaim(item)}
            >
              <ShieldCheck size={18} />
              <span>Claim This Item</span>
            </button>
          )}

          {isLost && !isClaimed && (
            <button 
              className="btn btn-primary"
              onClick={() => onOpenContact(item, type)}
            >
              <Mail size={16} />
              <span>Contact Poster</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
