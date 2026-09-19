import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ShieldCheck 
} from 'lucide-react';

export default function ContactPage() {
  const { activeUser, addToast } = useApp();
  const [name, setName] = useState(activeUser.name || '');
  const [email, setEmail] = useState(activeUser.email || '');
  const [department, setDepartment] = useState('Central Lost & Found Desk (Student Union 102)');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    addToast('Your campus inquiry has been logged! Staff will reply within 24 hours.', 'success');
  };

  const faqs = [
    {
      q: 'How long are found items kept before donation or disposal?',
      a: 'Valuable electronics, keys, and official IDs are retained at the Campus Police & Security HQ for 90 days. Clothing, books, and general accessories are held for 30 days before being donated to campus charity.'
    },
    {
      q: 'What verification is required to pick up an item at a campus station?',
      a: 'You must bring a valid student ID or government-issued photo ID. For electronic items (phones, laptops, smartwatches), you will be asked to unlock the device with your passcode or provide serial number verification.'
    },
    {
      q: 'What if someone claims my lost item maliciously?',
      a: 'CampusFind protects items through verification descriptions. Finders review specific details only genuine owners know (unique scratches, stickers, screen wallpapers) before releasing contact or custody.'
    },
    {
      q: 'Where is the central drop-off box outside office hours?',
      a: 'After hours (after 6:00 PM), items may be deposited at the 24/7 Campus Safety North Gate Kiosk or with the Central Library circulation night supervisor.'
    }
  ];

  return (
    <div className="container" style={{ padding: '36px 16px', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#111827', marginBottom: '8px' }}>
          Campus Lost & Found Directory
        </h1>
        <p style={{ color: '#6B7280', maxWidth: '580px', margin: '0 auto' }}>
          Need assistance or looking for an item turned into campus custody? Contact our official physical lost & found stations or send an inquiry below.
        </p>
      </div>

      {/* 3 Physical Stations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '24px', borderTop: '4px solid #0066CC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Building size={22} color="#0066CC" />
            <h3 style={{ fontSize: '1.15rem', color: '#111827' }}>Central Student Union</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '14px' }}>
            Main hub for electronics, bags, books, and general items found across student activity areas.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#374151' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#0066CC" />
              <span>Student Union, Room 102</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#0066CC" />
              <span>Mon - Fri: 8:00 AM - 6:00 PM</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} color="#0066CC" />
              <span>(555) 019-5678</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', borderTop: '4px solid #22C55E' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Building size={22} color="#22C55E" />
            <h3 style={{ fontSize: '1.15rem', color: '#111827' }}>Central Library Desk</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '14px' }}>
            Drop-off station for textbooks, stationery, computing accessories, notebooks, and study room items.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#374151' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#22C55E" />
              <span>Library Ground Floor Desk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#22C55E" />
              <span>Mon - Sun: 7:30 AM - 11:00 PM</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} color="#22C55E" />
              <span>(555) 019-2244</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', borderTop: '4px solid #FF6B35' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <ShieldCheck size={22} color="#FF6B35" />
            <h3 style={{ fontSize: '1.15rem', color: '#111827' }}>Campus Police HQ</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '14px' }}>
            High-value items: laptops, wallets, credit cards, government IDs, and dorm master keys.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#374151' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#FF6B35" />
              <span>North Campus Gate Security HQ</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#FF6B35" />
              <span>24 Hours / 7 Days a Week</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} color="#FF6B35" />
              <span>(555) 911-0000 (Dispatch)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Form & FAQs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
        {/* Contact Form */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#111827', marginBottom: '8px' }}>
            Send an Official Campus Inquiry
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#6B7280', marginBottom: '20px' }}>
            Have a question about a lost or found item in university custody? Submit an inquiry to campus coordinators.
          </p>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '36px 16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={32} color="#16A34A" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Inquiry Received!</h3>
              <p style={{ color: '#4B5563', fontSize: '0.9rem' }}>
                A confirmation copy has been sent to <strong>{email}</strong>. Our staff will investigate and respond shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Campus Email <span className="required">*</span></label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Campus Desk Destination</label>
                <select
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="Central Lost & Found Desk (Student Union 102)">Central Student Union (Room 102)</option>
                  <option value="Library Circulation Desk">Central Library Service Desk</option>
                  <option value="Campus Safety & Police HQ">Campus Police & Safety HQ</option>
                  <option value="General Question">General CampusFind Support</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message / Inquiry <span className="required">*</span></label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Provide details or reference item IDs you are inquiring about..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Send size={16} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* FAQs */}
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#111827', marginBottom: '8px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#6B7280', marginBottom: '20px' }}>
            Common procedures for retrieving lost goods on campus.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="card" 
                style={{ padding: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.98rem', color: '#1E293B', fontWeight: 600, paddingRight: '8px' }}>
                    {faq.q}
                  </h4>
                  <ChevronDown 
                    size={18} 
                    color="#6B7280"
                    style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                  />
                </div>
                {openFaq === idx && (
                  <p style={{ fontSize: '0.88rem', color: '#4B5563', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F3F4F6', lineHeight: 1.5 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
