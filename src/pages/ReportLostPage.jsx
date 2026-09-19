import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../services/seedData';
import { 
  Upload, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  Share2, 
  X, 
  ArrowLeft,
  Sparkles,
  Camera
} from 'lucide-react';

export default function ReportLostPage({ setActiveTab }) {
  const { activeUser, hasIdentity, createLostItem, addToast } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [locationLost, setLocationLost] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [dateLost, setDateLost] = useState(new Date().toISOString().split('T')[0]);
  const [email, setEmail] = useState(activeUser.email || '');
  const [phone, setPhone] = useState(activeUser.phone || '');
  const [displayName, setDisplayName] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedItem, setSubmittedItem] = useState(null);
  const [error, setError] = useState('');

  // Sync contact fields when user sets/updates their identity
  useEffect(() => {
    setEmail(activeUser.email || '');
    setPhone(activeUser.phone || '');
  }, [activeUser.email, activeUser.phone]);

  // Handle image upload from file or sample
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 3) {
      addToast('You can attach up to 3 photos per item', 'warning');
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [...prev.slice(0, 2), reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const addSamplePhoto = (type) => {
    if (photos.length >= 3) {
      addToast('Maximum 3 photos reached', 'warning');
      return;
    }
    const sample = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230F172A"/><circle cx="300" cy="200" r="80" fill="%230066CC" fill-opacity="0.3"/><text x="300" y="215" font-family="sans-serif" font-size="54" text-anchor="middle" fill="white">${type === 'laptop' ? '💻' : type === 'keys' ? '🔑' : '🎒'}</text><text x="300" y="340" font-family="sans-serif" font-size="20" text-anchor="middle" fill="%23E2E8F0">Campus Photo Attachment</text></svg>`;
    setPhotos((prev) => [...prev, sample]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.trim().length < 20) {
      setError('Item description must be at least 20 characters long to provide sufficient detail.');
      return;
    }

    const finalLocation = customLocation.trim() 
      ? customLocation.trim() 
      : locationLost;

    setSubmitting(true);
    setError('');

    try {
      const created = await createLostItem({
        title: title.trim(),
        category,
        description: description.trim(),
        location_lost: finalLocation,
        date_lost: dateLost,
        email: email.trim(),
        phone: phone.trim(),
        display_name: displayName,
        photo_urls: photos
      });
      setSubmittedItem(created);
    } catch (err) {
      setError('Error publishing report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/#lost-${submittedItem.id}`;
    navigator.clipboard.writeText(url);
    addToast('Item share link copied to clipboard!', 'success');
  };

  return (
    <div className="container" style={{ padding: '36px 16px', maxWidth: '780px' }}>
      {/* Return button */}
      <button 
        onClick={() => setActiveTab('lost')} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 500 }}
      >
        <ArrowLeft size={16} />
        <span>Back to Lost Items Directory</span>
      </button>

      {/* Success Confirmation Card */}
      {submittedItem ? (
        <div className="card" style={{ padding: '36px', textAlign: 'center', animation: 'scaleUp 0.25s ease' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={40} color="#16A34A" />
          </div>

          <h2 style={{ fontSize: '1.6rem', color: '#111827', marginBottom: '8px' }}>
            Lost Item Report Published!
          </h2>
          <p style={{ color: '#4B5563', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Your item <strong>"{submittedItem.title}"</strong> is now publicly listed on the CampusFind directory. Fellow students and campus security can reach out as soon as it is spotted.
          </p>

          <div style={{ background: '#F3F4F6', padding: '14px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', maxWidth: '520px', margin: '0 auto 24px' }}>
            <span style={{ fontSize: '0.85rem', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {`${window.location.origin}/#lost-${submittedItem.id}`}
            </span>
            <button className="btn btn-outline btn-sm" onClick={copyShareLink}>
              <Share2 size={14} />
              <span>Copy Link</span>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('lost')}>
              View in Lost Directory
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => {
                setSubmittedItem(null);
                setTitle('');
                setDescription('');
                setPhotos([]);
              }}
            >
              Report Another Item
            </button>
          </div>
        </div>
      ) : (
        /* Report Form Card */
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-lost">Report Missing Valuables</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', color: '#111827' }}>Report a Lost Item</h1>
            <p style={{ color: '#6B7280' }}>
              Fill in as much detail as possible to help campus members identify and return your property.
            </p>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '12px 14px', borderRadius: '8px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Item Name */}
            <div className="form-group">
              <label className="form-label">
                Item Name / Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Space Gray MacBook Air M2 13-inch, Dorm Keys, Hydro Flask"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category and Date Lost */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Date Lost <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={dateLost}
                  onChange={(e) => setDateLost(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {/* Campus Location */}
            <div className="form-group">
              <label className="form-label">
                Campus Location Lost <span className="required">*</span>
              </label>
              <select
                className="form-control"
                value={locationLost}
                onChange={(e) => setLocationLost(e.target.value)}
                style={{ marginBottom: '8px' }}
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control"
                placeholder="Or type specific room / desk (e.g. 3rd floor study desk #14, by the vending machine)"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
              />
            </div>

            {/* Detailed Description */}
            <div className="form-group">
              <label className="form-label">
                Detailed Description <span className="required">*</span>
              </label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Describe color, brand, stickers, unique scratches, distinguishing markings, or case details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div className="form-help">
                <span>Minimum 20 characters required</span>
                <span style={{ color: description.length >= 20 ? '#16A34A' : '#EF4444', fontWeight: 600 }}>
                  {description.length} / 20 chars
                </span>
              </div>
            </div>

            {/* Photos Upload Section */}
            <div className="form-group">
              <label className="form-label">
                Photos (Optional, up to 3)
              </label>
              <div 
                className="photo-uploader"
                onClick={() => document.getElementById('lost-photo-input').click()}
              >
                <Camera size={32} color="#0066CC" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontWeight: 600, color: '#1F2937', fontSize: '0.9rem' }}>
                  Click to upload photos or drag & drop
                </p>
                <p style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                  PNG, JPG or WebP up to 5MB each (Max 3 photos)
                </p>
                <input
                  id="lost-photo-input"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </div>

              {/* Sample Photo Quick Insert (Helps with testing) */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>Quick sample photo:</span>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => addSamplePhoto('laptop')}>
                  + Laptop
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => addSamplePhoto('keys')}>
                  + Keys
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => addSamplePhoto('bag')}>
                  + Backpack
                </button>
              </div>

              {/* Uploaded Photo Previews */}
              {photos.length > 0 && (
                <div className="photo-previews">
                  {photos.map((url, idx) => (
                    <div key={idx} className="photo-preview-item">
                      <img src={url} alt={`Upload ${idx + 1}`} />
                      <button 
                        type="button" 
                        className="photo-remove-btn"
                        onClick={() => removePhoto(idx)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Details */}
            <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB', margin: '20px 0' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: '#111827' }}>
                Contact Preferences
              </h4>

              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    Contact Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Contact Phone (Optional)</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Display Name Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                <input
                  type="checkbox"
                  id="display-name-toggle"
                  checked={displayName}
                  onChange={(e) => setDisplayName(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#0066CC', cursor: 'pointer' }}
                />
                <label htmlFor="display-name-toggle" style={{ fontSize: '0.88rem', color: '#374151', cursor: 'pointer' }}>
                  Allow my first name (<strong>{activeUser.name.split(' ')[0]}</strong>) to be shown on the public post
                </label>
              </div>
            </div>

            {/* Submit CTA */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setActiveTab('lost')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={submitting}
              >
                {submitting ? 'Publishing Report...' : 'Submit Lost Item Report'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
