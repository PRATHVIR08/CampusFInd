# CampusFind 🎒🔍

**CampusFind** is a modern college-specific lost & found web platform designed to seamlessly connect university students and campus staff who have lost items with those who have found them.

---

## ✨ Features

- **🏠 Home Landing & Dashboard**
  - Live statistics dashboard (Total Items Lost, Found, Reunited/Claimed).
  - Prominent global search bar with instant keyword filtering and category chips.
  - Quick CTAs: **Report Lost Item** (Campus Blue `#0066CC`) and **I Found Something** (Emerald Green `#22C55E`).
  - Real-time campus activity feed showing the newest mixed lost and found items.

- **🔎 Lost Items Directory**
  - Responsive grid layout (1 column mobile, 2 columns tablet, 3+ columns desktop).
  - Multi-dimensional filters: Category (*Electronics, Keys, Clothing, Documents, Accessories, Other*), Campus Location (*Library, Student Union, Science Quad, Dorms, Gym, Dining Hall*), and Date Range.
  - Sorting: Newest, Oldest, Most Recent Activity.
  - Item detail modal with photo carousel, interactive campus coordinate zone, contact options, and shareable link generator.

- **🛡️ Found Items & Ownership Claim Workflow**
  - Catalog of items found across campus with custody notes (*Where is it being held?*).
  - Multi-step **Claim Ownership Verification Form**: Claimants must provide proof details only the genuine owner would know (e.g., serial numbers, stickers, lock screen, unique scratches).
  - **Finder Review & Approval**: Finders review submitted claims in their dashboard to **Approve** or **Deny**.
  - Automatic contact unlocking and celebration upon claim approval.

- **📝 Reporting Systems**
  - **Report Lost Item**: Minimum 20-character description enforcement, campus location autocomplete, photo uploads (with sample asset presets), and share link.
  - **Report Found Item**: What you think it is, custody status (*With me*, *Lost & Found Desk Room 102*, *Campus Police HQ*), and instant cataloging.

- **👤 My Posts & User Dashboard**
  - Tabbed management of posted lost items, posted found items, and incoming ownership claims.
  - In-app demo user switcher in the navigation bar (*Alex Rivera*, *Jordan Smith*, *Officer Davis*) to easily test both sides of the lost/found/claim workflow.

- **🏢 Campus Lost & Found Directory**
  - Official campus desks, operating hours, emergency dispatch phone lines, direct inquiry form, and interactive FAQs.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, CSS3 Design Tokens (8px grid spacing, responsive breakpoints, glassmorphism, micro-animations).
- **Persistence**: Dual-layer architecture (FastAPI REST API with resilient client-side `LocalStorage` fallback).
- **Backend**: FastAPI (Python 3), Pydantic, Uvicorn, RESTful CRUD endpoints.

---

## 🚀 Quick Start

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend Setup (Optional)
```bash
# Run FastAPI backend
python -m uvicorn backend.main:app --port 8000
```
API documentation available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 📂 File Structure

```
CampusFind/
├── index.html                  # HTML5 entry with fonts & meta tags
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration & API proxy
├── .gitignore                  # Git ignore rules
├── backend/
│   ├── main.py                 # FastAPI app, models & CRUD endpoints
│   └── requirements.txt        # Python dependencies
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Routing, layout & modal orchestration
    ├── index.css               # Vanilla CSS design system & tokens
    ├── context/
    │   └── AppContext.jsx      # Global state, user switcher & CRUD actions
    ├── services/
    │   ├── api.js              # Dual HTTP / LocalStorage client
    │   ├── storage.js          # LocalStorage persistence manager
    │   └── seedData.js         # Realistic campus seed items & locations
    ├── components/
    │   ├── Navbar.jsx          # Header with user switcher & navigation
    │   ├── Footer.jsx          # Campus hotspots, support & reset action
    │   ├── ItemCard.jsx        # Responsive item card
    │   ├── ItemDetailModal.jsx # Detailed view with photo carousel
    │   ├── ClaimModal.jsx      # Proof of ownership verification modal
    │   ├── ContactModal.jsx    # Poster contact & messaging modal
    │   ├── CampusMapVisualizer.jsx # Campus zone & coordinate pin box
    │   └── Toast.jsx           # Floating status toasts
    └── pages/
        ├── HomePage.jsx        # Hero, search, stats, recent activity
        ├── LostItemsPage.jsx   # Filterable lost items directory
        ├── FoundItemsPage.jsx  # Found items directory & claim triggers
        ├── ReportLostPage.jsx  # Report lost item form
        ├── ReportFoundPage.jsx # Report found item form
        ├── MyPostsPage.jsx     # User dashboard & claim reviews
        └── ContactPage.jsx     # Campus desk directory & FAQs
```

---

## 🎨 Design Guidelines & Palette

- **Primary**: `#0066CC` (Campus Blue)
- **Secondary**: `#22C55E` (Found Green)
- **Accent**: `#FF6B35` (Urgent Amber)
- **Neutral**: `#F3F4F6` (Light Background)
- **Text**: `#1F2937` (Dark Gray)
- **Typography**: `Outfit` (Headlines) & `Inter` (Body)
