import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

export default function ClaimModal({ item, onClose }) {
  const { activeUser, submitClaim } = useApp();
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 15) {
      setError('Please provide at least 15 characters describing specific identifying details to verify ownership.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await submitClaim({
        found_item_id: item.id,
        item_title: item.title,
        description: description.trim()
      });
      onClose();
    } catch (err) {
      setError('Failed to submit claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="#16A34A" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#111827' }}>Claim Ownership</h3>
              <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Verification required to protect student property</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Target Item summary */}
            <div style={{ background: '#F3F4F6', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                  Item you are claiming
                </p>
                <p style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.95rem' }}>
                  {item.title}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                  Found at: {item.location_found}
                </p>
              </div>
            </div>

            {/* Informational callout */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px 14px', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '10px' }}>
              <HelpCircle size={18} color="#0066CC" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.82rem', color: '#1E40AF', lineHeight: '1.45' }}>
                To avoid false claims, describe details only the real owner would know (e.g., lock screen wallpaper, specific keychain, hidden marks, exact bag contents, or serial numbers).
              </p>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '10px 12px', borderRadius: '6px', marginBottom: '14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Description Form Input */}
            <div className="form-group">
              <label className="form-label">
                Identifying Details & Proof of Ownership <span className="required">*</span>
              </label>
              <textarea
                className="form-control"
                placeholder="Example: My keys have a miniature blue flashlight with a dead battery and a dorm card with student # ending in 771..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div className="form-help">
                <span>Minimum 15 characters</span>
                <span>{description.length} characters</span>
              </div>
            </div>

            {/* Claimer Profile Review */}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '14px' }}>
              <p style={{ fontSize: '0.78rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
                Your Contact Info (Auto-shared upon approval)
              </p>
              <div style={{ fontSize: '0.88rem', color: '#374151' }}>
                <strong>{activeUser.name}</strong> • {activeUser.email} • {activeUser.phone}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-secondary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
