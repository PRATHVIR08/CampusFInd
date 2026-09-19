import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CAMPUS_LOCATIONS, HOLDING_LOCATIONS } from '../services/seedData';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  AlertCircle, 
  Share2, 
  X, 
  ArrowLeft,
  Building,
  Camera
} from 'lucide-react';

export default function ReportFoundPage({ setActiveTab }) {
  const { activeUser, createFoundItem, addToast } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [locationFound, setLocationFound] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [dateFound, setDateFound] = useState(new Date().toISOString().split('T')[0]);
  const [holdingLocation, setHoldingLocation] = useState(HOLDING_LOCATIONS[0]);
  const [customHolding, setCustomHolding] = useState('');
  const [email, setEmail] = useState(activeUser.email || '');
  const [phone, setPhone] = useState(activeUser.phone || '');
  const [displayName, setDisplayName] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedItem, setSubmittedItem] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 3) {
      addToast('You can attach up to 3 photos', 'warning');
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
    const sample = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23064E3B"/><circle cx="300" cy="200" r="80" fill="%2322C55E" fill-opacity="0.3"/><text x="300" y="215" font-family="sans-serif" font-size="54" text-anchor="middle" fill="white">${type === 'watch' ? '⌚' : type === 'bottle' ? '🍶' : '🧥'}</text><text x="300" y="340" font-family="sans-serif" font-size="20" text-anchor="middle" fill="%23A7F3D0">Found Item Verified Photo</text></svg>`;
    setPhotos((prev) => [...prev, sample]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.trim().length < 15) {
      setError('Please provide at least 15 characters describing where and how the item was found.');
      return;
    }

    const finalLocation = customLocation.trim() ? customLocation.trim() : locationFound;
    const finalHolding = customHolding.trim() ? customHolding.trim() : holdingLocation;

    setSubmitting(true);
    setError('');

    try {
      const created = await createFoundItem({
        title: title.trim(),
        category,
        description: description.trim(),
        location_found: finalLocation,
        date_found: dateFound,
        holding_location: finalHolding,
        email: email.trim(),
        phone: phone.trim(),
        display_name: displayName,
        photo_urls: photos
      });
      setSubmittedItem(created);
    } catch (err) {
      setError('Error publishing found report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/#found-${submittedItem.id}`;
    navigator.clipboard.writeText(url);
    addToast('Item share link copied to clipboard!', 'success');
  };

  return (
    <div className="container" style={{ padding: '36px 16px', maxWidth: '780px' }}>
      <button 
        onClick={() => setActiveTab('found')} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 500 }}
      >
        <ArrowLeft size={16} />
        <span>Back to Found Items Vault</span>
      </button>

      {submittedItem ? (
        <div className="card" style={{ padding: '36px', textAlign: 'center', animation: 'scaleUp 0.25s ease' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={40} color="#16A34A" />
          </div>

          <h2 style={{ fontSize: '1.6rem', color: '#111827', marginBottom: '8px' }}>
            Found Item Registered!
          </h2>
          <p style={{ color: '#4B5563', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Thank you for being a responsible campus citizen. <strong>"{submittedItem.title}"</strong> is now cataloged. Students can submit verification claims to recover it.
          </p>

          <div style={{ background: '#F3F4F6', padding: '14px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', maxWidth: '520px', margin: '0 auto 24px' }}>
            <span style={{ fontSize: '0.85rem', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {`${window.location.origin}/#found-${submittedItem.id}`}
            </span>
            <button className="btn btn-outline btn-sm" onClick={copyShareLink}>
              <Share2 size={14} />
              <span>Copy Link</span>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => setActiveTab('found')}>
              View in Found Vault
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
              Log Another Found Item
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-found">Campus Citizen Good Deed</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', color: '#111827' }}>I Found Something</h1>
            <p style={{ color: '#6B7280' }}>
              Report an item found on campus. You can keep custody of it or turn it into a campus lost & found station.
            </p>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '12px 14px', borderRadius: '8px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Item Title */}
            <div className="form-group">
              <label className="form-label">
                What do you think it is? <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Set of car keys with Toyota fob, Silver Apple Watch, Blue hydro flask"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category and Date Found */}
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
                  Date Found <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={dateFound}
                  onChange={(e) => setDateFound(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {/* Location Found */}
            <div className="form-group">
              <label className="form-label">
                Where was it found on campus? <span className="required">*</span>
              </label>
              <select
                className="form-control"
                value={locationFound}
                onChange={(e) => setLocationFound(e.target.value)}
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
                placeholder="Specific spot (e.g. on bench near fountain, table 4 in cafe)"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
              />
            </div>

            {/* Where is it being held? */}
            <div className="form-group">
              <label className="form-label">
                Where is it being held currently? <span className="required">*</span>
              </label>
              <select
                className="form-control"
                value={holdingLocation}
                onChange={(e) => setHoldingLocation(e.target.value)}
                style={{ marginBottom: '8px' }}
              >
                {HOLDING_LOCATIONS.map((hl) => (
                  <option key={hl} value={hl}>
                    {hl}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control"
                placeholder="Or specify exact holding spot (e.g. Dorm Room 304, RA desk, Library desk)"
                value={customHolding}
                onChange={(e) => setCustomHolding(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Description & Circumstances <span className="required">*</span>
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Describe condition, where you picked it up, or anything notable..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div className="form-help">
                <span>Keep some hidden details unmentioned so claimants can prove ownership</span>
              </div>
            </div>

            {/* Photos */}
            <div className="form-group">
              <label className="form-label">Photos (Optional, up to 3)</label>
              <div 
                className="photo-uploader"
                onClick={() => document.getElementById('found-photo-input').click()}
              >
                <Camera size={32} color="#22C55E" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontWeight: 600, color: '#1F2937', fontSize: '0.9rem' }}>
                  Click to attach photo or drag & drop
                </p>
                <input
                  id="found-photo-input"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>Quick sample photo:</span>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => addSamplePhoto('watch')}>
                  + Watch
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => addSamplePhoto('bottle')}>
                  + Hydroflask
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => addSamplePhoto('jacket')}>
                  + Jacket
                </button>
              </div>

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
                Finder Contact Details
              </h4>

              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    Your Email <span className="required">*</span>
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                <input
                  type="checkbox"
                  id="found-display-name-toggle"
                  checked={displayName}
                  onChange={(e) => setDisplayName(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#22C55E', cursor: 'pointer' }}
                />
                <label htmlFor="found-display-name-toggle" style={{ fontSize: '0.88rem', color: '#374151', cursor: 'pointer' }}>
                  Show my first name (<strong>{activeUser.name.split(' ')[0]}</strong>) on the public listing
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setActiveTab('found')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-secondary btn-lg"
                disabled={submitting}
              >
                {submitting ? 'Publishing...' : 'Register Found Item'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
