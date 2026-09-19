import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  X, 
  Clock, 
  AlertCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function MyPostsPage({ setActiveTab, onSelectItem }) {
  const { 
    activeUser, 
    lostItems, 
    foundItems, 
    claims, 
    updateLostItem, 
    deleteLostItem, 
    updateFoundItem, 
    deleteFoundItem, 
    handleClaimDecision,
    addToast 
  } = useApp();

  const [activeTabSection, setActiveTabSection] = useState('found'); // 'lost', 'found', 'myclaims'
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('open');

  // Filter items matching active user
  const myLostItems = lostItems.filter(item => 
    item.poster_id === activeUser.id || 
    item.email === activeUser.email || 
    item.poster_name === activeUser.name
  );

  const myFoundItems = foundItems.filter(item => 
    item.finder_id === activeUser.id || 
    item.email === activeUser.email || 
    item.finder_name === activeUser.name
  );

  // Claims received on my found items
  const myFoundItemIds = myFoundItems.map(f => f.id);
  const claimsReceived = claims.filter(c => myFoundItemIds.includes(c.found_item_id));

  // Claims submitted by me
  const mySubmittedClaims = claims.filter(c => 
    c.claimer_id === activeUser.id || 
    c.claimer_email === activeUser.email
  );

  // Edit item handlers
  const startEdit = (item, type) => {
    setEditingItem({ ...item, itemType: type });
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditStatus(item.status || 'open');
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    if (editingItem.itemType === 'lost') {
      await updateLostItem(editingItem.id, {
        title: editTitle,
        description: editDescription,
        status: editStatus
      });
    } else {
      await updateFoundItem(editingItem.id, {
        title: editTitle,
        description: editDescription,
        status: editStatus
      });
    }
    setEditingItem(null);
  };

  return (
    <div className="container" style={{ padding: '36px 16px' }}>
      {/* Dashboard Top Banner */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #0066CC, #3B82F6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700 }}>
            {activeUser.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.5rem', color: '#111827' }}>{activeUser.name}</h1>
              <span className="badge badge-lost" style={{ fontSize: '0.72rem' }}>{activeUser.role}</span>
            </div>
            <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>
              {activeUser.email} • {activeUser.phone}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('report-lost')}>
            + Report Lost
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('report-found')}>
            + Report Found
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '24px', gap: '8px' }}>
        <button
          onClick={() => setActiveTabSection('found')}
          style={{
            padding: '10px 18px',
            fontWeight: 600,
            fontSize: '0.95rem',
            borderBottom: activeTabSection === 'found' ? '3px solid #22C55E' : '3px solid transparent',
            color: activeTabSection === 'found' ? '#16A34A' : '#6B7280',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Found Items & Claims Received</span>
          <span style={{ background: '#DCFCE7', color: '#15803D', borderRadius: '999px', padding: '1px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
            {myFoundItems.length}
          </span>
          {claimsReceived.filter(c => c.status === 'pending').length > 0 && (
            <span style={{ background: '#FF6B35', color: 'white', borderRadius: '999px', padding: '1px 6px', fontSize: '0.7rem', fontWeight: 800 }}>
              {claimsReceived.filter(c => c.status === 'pending').length} Action
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTabSection('lost')}
          style={{
            padding: '10px 18px',
            fontWeight: 600,
            fontSize: '0.95rem',
            borderBottom: activeTabSection === 'lost' ? '3px solid #0066CC' : '3px solid transparent',
            color: activeTabSection === 'lost' ? '#0066CC' : '#6B7280',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>My Lost Items</span>
          <span style={{ background: '#EBF5FF', color: '#0066CC', borderRadius: '999px', padding: '1px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
            {myLostItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTabSection('myclaims')}
          style={{
            padding: '10px 18px',
            fontWeight: 600,
            fontSize: '0.95rem',
            borderBottom: activeTabSection === 'myclaims' ? '3px solid #FF6B35' : '3px solid transparent',
            color: activeTabSection === 'myclaims' ? '#FF6B35' : '#6B7280',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Claims I Submitted</span>
          <span style={{ background: '#FFF7ED', color: '#EA580C', borderRadius: '999px', padding: '1px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
            {mySubmittedClaims.length}
          </span>
        </button>
      </div>

      {/* SECTION 1: Found Items & Incoming Claims */}
      {activeTabSection === 'found' && (
        <div>
          {/* Claims Received Pending Verification Review */}
          {claimsReceived.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <ShieldCheck size={20} color="#16A34A" />
                <h3 style={{ fontSize: '1.25rem', color: '#111827' }}>
                  Ownership Claims on Your Found Items ({claimsReceived.length})
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {claimsReceived.map((claim) => {
                  const isPending = claim.status === 'pending';
                  const isApproved = claim.status === 'approved';

                  return (
                    <div 
                      key={claim.id} 
                      className="card"
                      style={{ 
                        padding: '20px', 
                        borderLeft: isPending ? '4px solid #FF6B35' : isApproved ? '4px solid #22C55E' : '4px solid #9CA3AF',
                        background: '#FFFFFF'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280' }}>
                              Claim For:
                            </span>
                            <span style={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>
                              {claim.item_title}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: '#4B5563' }}>
                            <span>Claimant: <strong>{claim.claimer_name}</strong></span>
                            <span>•</span>
                            <span>{new Date(claim.created_at).toLocaleString()}</span>
                          </div>
                        </div>

                        <div>
                          <span 
                            className="badge"
                            style={{
                              background: isPending ? '#FFF7ED' : isApproved ? '#DCFCE7' : '#F3F4F6',
                              color: isPending ? '#EA580C' : isApproved ? '#15803D' : '#4B5563'
                            }}
                          >
                            {claim.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Claimer's Proof of Ownership Description */}
                      <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
                        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Claimant's Proof of Ownership Description:
                        </p>
                        <p style={{ fontSize: '0.92rem', color: '#1F2937', fontStyle: 'italic', lineHeight: 1.5 }}>
                          "{claim.description}"
                        </p>
                      </div>

                      {/* If Approved: Auto-shared contact info */}
                      {isApproved && (
                        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '12px 16px', borderRadius: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, color: '#15803D', fontSize: '0.85rem' }}>
                            UNLOCKED CONTACT:
                          </span>
                          <span style={{ fontSize: '0.88rem', color: '#166534' }}>
                            Email: <strong>{claim.claimer_email}</strong>
                          </span>
                          {claim.claimer_phone && (
                            <span style={{ fontSize: '0.88rem', color: '#166534' }}>
                              Phone: <strong>{claim.claimer_phone}</strong>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Decision Buttons for Finder */}
                      {isPending && (
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ color: '#DC2626', borderColor: '#FECACA' }}
                            onClick={() => handleClaimDecision(claim.id, 'denied')}
                          >
                            Deny Claim
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleClaimDecision(claim.id, 'approved')}
                          >
                            <CheckCircle2 size={16} />
                            <span>Approve & Reveal Contact Info</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* List of My Found Items */}
          <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '16px' }}>
            Found Items Registered by You
          </h3>

          {myFoundItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: 'white', borderRadius: '12px', border: '1px dashed #D1D5DB' }}>
              <p style={{ color: '#6B7280', marginBottom: '12px' }}>You haven't logged any found items yet.</p>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('report-found')}>
                I Found Something
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myFoundItems.map((item) => (
                <div 
                  key={item.id} 
                  className="card" 
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#F3F4F6' }}>
                      <img 
                        src={item.photo_urls?.[0] || ''} 
                        alt={item.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '1rem', color: '#111827' }}>{item.title}</h4>
                        <span className={`badge ${item.status === 'claimed' ? 'badge-claimed' : 'badge-found'}`}>
                          {item.status === 'claimed' ? 'Claimed' : 'Open'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                        Where: {item.location_found} • Holding: {item.holding_location}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => onSelectItem(item, 'found')}
                      title="View public listing"
                    >
                      <ExternalLink size={14} />
                      <span>View</span>
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => startEdit(item, 'found')}
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      style={{ color: '#EF4444' }}
                      onClick={() => {
                        if (confirm(`Delete found item "${item.title}"?`)) {
                          deleteFoundItem(item.id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Lost Items */}
      {activeTabSection === 'lost' && (
        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '16px' }}>
            Lost Items Reported by You
          </h3>

          {myLostItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: 'white', borderRadius: '12px', border: '1px dashed #D1D5DB' }}>
              <p style={{ color: '#6B7280', marginBottom: '12px' }}>You haven't reported any lost items yet.</p>
              <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('report-lost')}>
                Report Lost Item
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myLostItems.map((item) => (
                <div 
                  key={item.id} 
                  className="card" 
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#F3F4F6' }}>
                      <img 
                        src={item.photo_urls?.[0] || ''} 
                        alt={item.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '1rem', color: '#111827' }}>{item.title}</h4>
                        <span className={`badge ${item.status === 'claimed' ? 'badge-claimed' : 'badge-lost'}`}>
                          {item.status === 'claimed' ? 'Recovered' : item.status || 'Open'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                        Lost at: {item.location_lost} • Date: {item.date_lost}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => onSelectItem(item, 'lost')}
                    >
                      <ExternalLink size={14} />
                      <span>View</span>
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => startEdit(item, 'lost')}
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      style={{ color: '#EF4444' }}
                      onClick={() => {
                        if (confirm(`Delete listing "${item.title}"?`)) {
                          deleteLostItem(item.id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: Claims Submitted by User */}
      {activeTabSection === 'myclaims' && (
        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '16px' }}>
            Claims You Have Filed on Found Items
          </h3>

          {mySubmittedClaims.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: 'white', borderRadius: '12px', border: '1px dashed #D1D5DB' }}>
              <p style={{ color: '#6B7280', marginBottom: '12px' }}>You haven't submitted any ownership claims yet.</p>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('found')}>
                Browse Found Items Vault
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mySubmittedClaims.map((claim) => (
                <div key={claim.id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '1.05rem', color: '#111827' }}>
                      Claim for: {claim.item_title}
                    </h4>
                    <span 
                      className="badge"
                      style={{
                        background: claim.status === 'approved' ? '#DCFCE7' : claim.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                        color: claim.status === 'approved' ? '#15803D' : claim.status === 'pending' ? '#B45309' : '#B91C1C'
                      }}
                    >
                      {claim.status.toUpperCase()}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#4B5563', marginBottom: '12px' }}>
                    <strong>Your submitted proof:</strong> "{claim.description}"
                  </p>

                  {claim.status === 'approved' && (
                    <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '12px', borderRadius: '8px' }}>
                      <p style={{ fontSize: '0.88rem', color: '#166534', fontWeight: 600 }}>
                        🎉 Claim Approved! Please proceed to the drop-off location or contact the finder to collect your item.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>Edit Listing</h3>
              <button className="modal-close-btn" onClick={() => setEditingItem(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="open">Open (Active)</option>
                    <option value="claimed">Claimed / Recovered</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
