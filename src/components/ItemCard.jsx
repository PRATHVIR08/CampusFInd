import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, User, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ItemCard({ item, type = 'lost', onSelect }) {
  const isLost = type === 'lost';

  // Format relative time (e.g. "2 hours ago", "Yesterday", etc.)
  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Recently';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Category badge class
  const getCatClass = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'electronics': return 'cat-electronics';
      case 'keys': return 'cat-keys';
      case 'clothing': return 'cat-clothing';
      case 'documents': return 'cat-documents';
      case 'accessories': return 'cat-accessories';
      default: return 'cat-other';
    }
  };

  // Poster / Finder name display logic
  const displayName = isLost
    ? (item.display_name ? item.poster_name?.split(' ')[0] : 'Campus Student')
    : (item.display_name ? item.finder_name?.split(' ')[0] : 'Good Samaritan');

  const location = isLost ? item.location_lost : item.location_found;
  const photoUrl = item.photo_urls && item.photo_urls.length > 0
    ? item.photo_urls[0]
    : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23E5E7EB"/><text x="200" y="150" font-family="sans-serif" font-size="20" fill="%239CA3AF" text-anchor="middle">No Photo Available</text></svg>';

  const isClaimed = item.status === 'claimed';

  return (
    <div className="card item-card" onClick={() => onSelect(item, type)}>
      <div className="item-card-image">
        <img src={photoUrl} alt={item.title} loading="lazy" />

        <div className="item-card-badges">
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>

          {isClaimed ? (
            <span className="badge badge-claimed">
              <CheckCircle2 size={12} /> Claimed
            </span>
          ) : (
            <span className={`cat-badge ${getCatClass(item.category)}`}>
              {item.category}
            </span>
          )}
        </div>
      </div>

      <div className="item-card-body">
        <h4 className="item-card-title" title={item.title}>
          {item.title}
        </h4>

        <p className="item-card-desc">
          {item.description}
        </p>

        <div className="item-card-meta">
          <div className="item-meta-item" style={{ color: '#4B5563', fontWeight: 500 }}>
            <MapPin size={14} color={isLost ? '#0066CC' : '#22C55E'} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {location}
            </span>
          </div>

          {!isLost && item.holding_location && (
            <div className="item-meta-item" style={{ fontSize: '0.75rem', color: '#6B7280' }}>
              <span style={{ fontWeight: 600, color: '#16A34A' }}>Holding:</span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.holding_location}
              </span>
            </div>
          )}

          <div className="item-meta-row" style={{ marginTop: '4px' }}>
            <div className="item-meta-item">
              <Clock size={13} />
              <span>{formatRelativeTime(item.date_posted || item.created_at)}</span>
            </div>

            <div className="item-meta-item">
              <User size={13} />
              <span>{displayName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
