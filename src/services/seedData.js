// CampusFind Realistic Seed Data & Campus Constants

export const CATEGORIES = [
  'Electronics',
  'Keys',
  'Clothing',
  'Documents',
  'Accessories',
  'Other'
];

export const CAMPUS_LOCATIONS = [
  'Central Library - 3rd Floor Quiet Study',
  'Central Library - 1st Floor Cafe',
  'Student Union - Main Lounge',
  'Student Union - Room 102 (Lost & Found Desk)',
  'Science Quad & Chemistry Lab',
  'North Quad Dormitories - Hallway B',
  'South Quad Dormitories - Common Area',
  'Engineering Complex - Room 204',
  'Campus Recreation & Gym Center',
  'Dining Hall West',
  'Dining Hall East',
  'University Auditorium',
  'Campus Shuttle Stop North',
  'Mathematics Building - Room 108',
  'Campus Tennis & Athletic Fields'
];

export const HOLDING_LOCATIONS = [
  'With me (Finder)',
  'Student Union - Info Desk (Room 102)',
  'Central Library Front Circulation Desk',
  'Campus Police & Security HQ',
  'Dorm Resident Advisor (RA) Office',
  'Dining Hall Manager Office'
];

export const DEMO_USERS = [
  {
    id: 'user_alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    phone: '(555) 234-5678',
    role: 'Sophomore, Computer Science'
  },
  {
    id: 'user_jordan',
    name: 'Jordan Smith',
    email: 'jordan.smith@campus.edu',
    phone: '(555) 876-5432',
    role: 'Senior, Biology'
  },
  {
    id: 'user_taylor',
    name: 'Taylor Chen',
    email: 'taylor.chen@campus.edu',
    phone: '(555) 345-6789',
    role: 'Junior, Economics'
  },
  {
    id: 'user_desk',
    name: 'Officer Davis',
    email: 'campus.security@campus.edu',
    phone: '(555) 911-0000',
    role: 'Campus Safety Coordinator'
  }
];

// High-fidelity SVG illustration helper for realistic item photos
const createSvgPhoto = (type, title, bgColor, accentColor) => {
  const encoded = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgColor}" />
          <stop offset="100%" stop-color="#1E293B" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect width="600" height="400" fill="url(#bg)"/>
      <g filter="url(#shadow)" transform="translate(150, 60)">
        <rect width="300" height="220" rx="24" fill="#FFFFFF" fill-opacity="0.1" stroke="${accentColor}" stroke-width="2"/>
        <circle cx="150" cy="110" r="50" fill="${accentColor}" fill-opacity="0.2"/>
        <text x="150" y="118" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto" font-size="44" text-anchor="middle" fill="#FFFFFF">
          ${type === 'macbook' ? '💻' : type === 'keys' ? '🔑' : type === 'hydroflask' ? '🍶' : type === 'airpods' ? '🎧' : type === 'watch' ? '⌚' : type === 'jacket' ? '🧥' : type === 'calc' ? '🔢' : '📦'}
        </text>
      </g>
      <text x="300" y="325" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto" font-weight="700" font-size="22" text-anchor="middle" fill="#F8FAFC">
        ${title}
      </text>
      <text x="300" y="355" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto" font-weight="500" font-size="14" text-anchor="middle" fill="#94A3B8">
        CampusFind Verified Item Record
      </text>
    </svg>
  `);
  return `data:image/svg+xml;utf8,${encoded}`;
};

export const INITIAL_LOST_ITEMS = [
  {
    id: 'lost-101',
    title: 'Space Gray MacBook Air M2 13-inch',
    description: 'Left inside a dark gray neoprene sleeve on desk 34 in 3rd-floor quiet study area. Has a GitHub octocat sticker and a small scratch on the top left lid corner. Contains important term projects.',
    category: 'Electronics',
    location_lost: 'Central Library - 3rd Floor Quiet Study',
    date_lost: '2026-09-18',
    date_posted: new Date(Date.now() - 3 * 3600000).toISOString(),
    photo_urls: [
      createSvgPhoto('macbook', 'MacBook Air M2 13"', '#0F172A', '#38BDF8'),
      createSvgPhoto('macbook', 'Neoprene Sleeve View', '#1E293B', '#818CF8')
    ],
    poster_id: 'user_alex',
    poster_name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    phone: '(555) 234-5678',
    display_name: true,
    status: 'open',
    created_at: new Date(Date.now() - 3 * 3600000).toISOString()
  },
  {
    id: 'lost-102',
    title: 'AirPods Pro (2nd Gen) in Matte Black Case',
    description: 'Lost during Wednesday afternoon Physics lecture in Hall B. Case has a small carabiner attached and left earbud has an orange silicone tip.',
    category: 'Electronics',
    location_lost: 'Engineering Complex - Room 204',
    date_lost: '2026-09-17',
    date_posted: new Date(Date.now() - 14 * 3600000).toISOString(),
    photo_urls: [
      createSvgPhoto('airpods', 'AirPods Pro Matte Case', '#18181B', '#F97316')
    ],
    poster_id: 'user_taylor',
    poster_name: 'Taylor Chen',
    email: 'taylor.chen@campus.edu',
    phone: '(555) 345-6789',
    display_name: true,
    status: 'open',
    created_at: new Date(Date.now() - 14 * 3600000).toISOString()
  },
  {
    id: 'lost-103',
    title: 'Blue Hydro Flask (32oz Wide Mouth)',
    description: 'Cobalt blue 32oz bottle with stickers from National Parks (Yosemite, Zion) and a boot protector on the bottom. Forgotten on the treadmill bench.',
    category: 'Accessories',
    location_lost: 'Campus Recreation & Gym Center',
    date_lost: '2026-09-18',
    date_posted: new Date(Date.now() - 20 * 3600000).toISOString(),
    photo_urls: [
      createSvgPhoto('hydroflask', 'Hydro Flask 32oz Cobalt', '#0284C7', '#38BDF8')
    ],
    poster_id: 'user_alex',
    poster_name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    phone: '(555) 234-5678',
    display_name: false,
    status: 'open',
    created_at: new Date(Date.now() - 20 * 3600000).toISOString()
  },
  {
    id: 'lost-104',
    title: 'Texas Instruments TI-84 Plus CE Calculator',
    description: 'Black graphing calculator with white cover slide. Has my initials "TC" scratched onto the battery compartment door in back.',
    category: 'Electronics',
    location_lost: 'Mathematics Building - Room 108',
    date_lost: '2026-09-16',
    date_posted: new Date(Date.now() - 48 * 3600000).toISOString(),
    photo_urls: [
      createSvgPhoto('calc', 'TI-84 Plus CE Graphing Calc', '#334155', '#4ADE80')
    ],
    poster_id: 'user_taylor',
    poster_name: 'Taylor Chen',
    email: 'taylor.chen@campus.edu',
    phone: '(555) 345-6789',
    display_name: true,
    status: 'claimed',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString()
  }
];

export const INITIAL_FOUND_ITEMS = [
  {
    id: 'found-201',
    title: 'Dorm Keys on Red University Lanyard',
    description: 'Found on the outdoor concrete bench near the Science Quad fountain. Set of 3 brass keys, plastic RF dorm access fob, and a mini flashlight.',
    category: 'Keys',
    location_found: 'Science Quad & Chemistry Lab',
    date_found: '2026-09-18',
    date_posted: new Date(Date.now() - 5 * 3600000).toISOString(),
    photo_urls: [
      createSvgPhoto('keys', 'Dorm Keys on Red Lanyard', '#7F1D1D', '#EF4444'),
      createSvgPhoto('keys', 'Key Ring Detail', '#991B1B', '#FCA5A5')
    ],
    finder_id: 'user_jordan',
    finder_name: 'Jordan Smith',
    email: 'jordan.smith@campus.edu',
    phone: '(555) 876-5432',
    display_name: true,
    holding_location: 'Student Union - Room 102 (Lost & Found Desk)',
    status: 'open',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'found-202',
    title: 'Silver Apple Watch Series 8 with Sport Loop',
    description: 'Found on the couch in the second-floor lounge of the Student Union. Watch has 40% battery remaining, digital lock code required.',
    category: 'Electronics',
    location_found: 'Student Union - Main Lounge',
    date_found: '2026-09-18',
    date_posted: new Date(Date.now() - 10 * 3600000).toISOString(),
    photo_urls: [
      createSvgPhoto('watch', 'Silver Apple Watch Series 8', '#374151', '#E5E7EB')
    ],
    finder_id: 'user_desk',
    finder_name: 'Officer Davis',
    email: 'campus.security@campus.edu',
    phone: '(555) 911-0000',
    display_name: true,
    holding_location: 'Campus Police & Security HQ',
    status: 'open',
    created_at: new Date(Date.now() - 10 * 3600000).toISOString()
  },
  {
    id: 'found-203',
    title: 'Vintage Denim Trucker Jacket (Size L)',
    description: 'Light wash denim jacket left over the back of seat Row J-14 during the guest speaker seminar. Has a green pin on the left lapel.',
    category: 'Clothing',
    location_found: 'University Auditorium',
    date_found: '2026-09-17',
    date_posted: new Date(Date.now() - 28 * 3600000).toISOString(),
    photo_urls: [
      createSvgPhoto('jacket', 'Denim Jacket Size L', '#1E3A8A', '#60A5FA')
    ],
    finder_id: 'user_jordan',
    finder_name: 'Jordan Smith',
    email: 'jordan.smith@campus.edu',
    phone: '(555) 876-5432',
    display_name: true,
    holding_location: 'With me (Finder)',
    status: 'open',
    created_at: new Date(Date.now() - 28 * 3600000).toISOString()
  }
];

export const INITIAL_CLAIMS = [
  {
    id: 'claim-301',
    found_item_id: 'found-201',
    item_title: 'Dorm Keys on Red University Lanyard',
    claimer_id: 'user_alex',
    claimer_name: 'Alex Rivera',
    claimer_email: 'alex.rivera@campus.edu',
    claimer_phone: '(555) 234-5678',
    description: 'I lost my North Quad dorm keys! The red lanyard says "University Athletics 2024" and one of the keys has a green rubber identifier ring. Fob number ends in 412.',
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString()
  }
];
