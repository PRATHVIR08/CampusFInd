import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

export default function CampusMapVisualizer({ location, isLost = true }) {
  // Extract simple building zone
  const getZone = (loc = '') => {
    if (loc.includes('Library')) return { zone: 'North Academic Sector', pin: 'BLDG-L1' };
    if (loc.includes('Student Union')) return { zone: 'Central Campus Commons', pin: 'SU-C1' };
    if (loc.includes('Science')) return { zone: 'East STEM Quadrangle', pin: 'SCI-E2' };
    if (loc.includes('Engineering')) return { zone: 'North Technology Center', pin: 'ENG-N3' };
    if (loc.includes('Dorm') || loc.includes('North Quad') || loc.includes('South Quad')) return { zone: 'Residential District', pin: 'RES-R4' };
    if (loc.includes('Gym') || loc.includes('Recreation')) return { zone: 'South Athletic Complex', pin: 'ATH-S1' };
    if (loc.includes('Dining')) return { zone: 'Campus Dining Plaza', pin: 'DIN-W1' };
    return { zone: 'Main Campus Grounds', pin: 'GEN-CAMPUS' };
  };

  const { zone, pin } = getZone(location);

  return (
    <div className="campus-map-box">
      <div 
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '10px',
          background: isLost ? '#0066CC' : '#22C55E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0
        }}
      >
        <MapPin size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: isLost ? '#0066CC' : '#16A34A' }}>
            {zone} • [{pin}]
          </span>
        </div>
        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#1E293B' }}>
          {location}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
          <Compass size={12} />
          <span>Interactive Campus Coordinate Verified</span>
        </div>
      </div>
    </div>
  );
}
