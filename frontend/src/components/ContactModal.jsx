import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';

export default function ContactModal({ item, type, onClose }) {
  const { activeUser, addToast } = useApp();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState(activeUser.phone || '');
  const [sent, setSent] = useState(false);

  if (!item) return null;

  const isLost = type === 'lost';
  const recipientName = isLost ? item.poster_name : item.finder_name;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      addToast(`Message sent to ${recipientName || 'campus poster'}!`, 'success');
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EBF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} color="#0066CC" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#111827' }}>
                Contact {recipientName ? recipientName.split(' ')[0] : 'Poster'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Regarding: {item.title}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {sent ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={32} color="#16A34A" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#111827' }}>
              Message Transmitted!
            </h3>
            <p style={{ color: '#4B5563', fontSize: '0.9rem' }}>
              We have forwarded your campus message and contact details to {recipientName || 'the poster'}. Keep an eye on your campus email inbox for their reply!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Inquiry about ${item.title}`}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message <span className="required">*</span></label>
                <textarea
                  className="form-control"
                  placeholder="Hey! I think I saw your item near the Science Quad / I have more information..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Your Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={activeUser.email}
                    disabled
                    style={{ background: '#F3F4F6' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Your Phone (Optional)</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
