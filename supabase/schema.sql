-- ==============================================================================
-- CampusFind Supabase Database Schema & Seed Script
-- Run this script directly in the Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Create Lost Items Table
CREATE TABLE IF NOT EXISTS lost_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    location_lost TEXT NOT NULL,
    date_lost DATE NOT NULL,
    date_posted TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    photo_urls TEXT[] DEFAULT '{}',
    poster_id TEXT,
    poster_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    display_name BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'expired')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Found Items Table
CREATE TABLE IF NOT EXISTS found_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    location_found TEXT NOT NULL,
    date_found DATE NOT NULL,
    date_posted TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    photo_urls TEXT[] DEFAULT '{}',
    finder_id TEXT,
    finder_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    display_name BOOLEAN DEFAULT TRUE,
    holding_location TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'expired')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Claims Table
CREATE TABLE IF NOT EXISTS claims (
    id TEXT PRIMARY KEY,
    found_item_id TEXT REFERENCES found_items(id) ON DELETE CASCADE,
    item_title TEXT,
    claimer_id TEXT,
    claimer_name TEXT,
    claimer_email TEXT NOT NULL,
    claimer_phone TEXT,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE lost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- 5. Define Permissive Policies for Campus Community Usage
-- Public read access
CREATE POLICY "Allow public read on lost_items" ON lost_items FOR SELECT USING (true);
CREATE POLICY "Allow public read on found_items" ON found_items FOR SELECT USING (true);
CREATE POLICY "Allow public read on claims" ON claims FOR SELECT USING (true);

-- Insert access for all campus students/visitors
CREATE POLICY "Allow insert on lost_items" ON lost_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert on found_items" ON found_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert on claims" ON claims FOR INSERT WITH CHECK (true);

-- Update access for edits & claim status decisions
CREATE POLICY "Allow update on lost_items" ON lost_items FOR UPDATE USING (true);
CREATE POLICY "Allow update on found_items" ON found_items FOR UPDATE USING (true);
CREATE POLICY "Allow update on claims" ON claims FOR UPDATE USING (true);

-- Delete access
CREATE POLICY "Allow delete on lost_items" ON lost_items FOR DELETE USING (true);
CREATE POLICY "Allow delete on found_items" ON found_items FOR DELETE USING (true);

-- 6. Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_lost_category ON lost_items(category);
CREATE INDEX IF NOT EXISTS idx_lost_location ON lost_items(location_lost);
CREATE INDEX IF NOT EXISTS idx_lost_status ON lost_items(status);
CREATE INDEX IF NOT EXISTS idx_lost_created_at ON lost_items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_found_category ON found_items(category);
CREATE INDEX IF NOT EXISTS idx_found_location ON found_items(location_found);
CREATE INDEX IF NOT EXISTS idx_found_status ON found_items(status);
CREATE INDEX IF NOT EXISTS idx_found_created_at ON found_items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_claims_found_item ON claims(found_item_id);

-- 7. Seed Initial Campus Records (Optional / Ready for Demo)
INSERT INTO lost_items (id, title, description, category, location_lost, date_lost, poster_id, poster_name, email, phone, display_name, status)
VALUES 
(
  'lost-101',
  'Space Gray MacBook Air M2 13-inch',
  'Left inside a dark gray neoprene sleeve on desk 34 in 3rd-floor quiet study area. Has a GitHub sticker and a small scratch on top left lid.',
  'Electronics',
  'Central Library - 3rd Floor Quiet Study',
  CURRENT_DATE - INTERVAL '1 day',
  'user_alex',
  'Alex Rivera',
  'alex.rivera@campus.edu',
  '(555) 234-5678',
  true,
  'open'
),
(
  'lost-102',
  'AirPods Pro (2nd Gen) in Matte Black Case',
  'Lost during Wednesday afternoon Physics lecture in Hall B. Case has a small carabiner attached and left earbud has an orange silicone tip.',
  'Electronics',
  'Engineering Complex - Room 204',
  CURRENT_DATE - INTERVAL '2 days',
  'user_taylor',
  'Taylor Chen',
  'taylor.chen@campus.edu',
  '(555) 345-6789',
  true,
  'open'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO found_items (id, title, description, category, location_found, date_found, holding_location, finder_id, finder_name, email, phone, display_name, status)
VALUES
(
  'found-201',
  'Dorm Keys on Red University Lanyard',
  'Found on the outdoor concrete bench near the Science Quad fountain. Set of 3 brass keys, plastic RF dorm access fob, and a mini flashlight.',
  'Keys',
  'Science Quad & Chemistry Lab',
  CURRENT_DATE - INTERVAL '1 day',
  'Student Union - Room 102 (Lost & Found Desk)',
  'user_jordan',
  'Jordan Smith',
  'jordan.smith@campus.edu',
  '(555) 876-5432',
  true,
  'open'
),
(
  'found-202',
  'Silver Apple Watch Series 8 with Sport Loop',
  'Found on the couch in the second-floor lounge of the Student Union. Watch has 40% battery remaining, digital lock code required.',
  'Electronics',
  'Student Union - Main Lounge',
  CURRENT_DATE - INTERVAL '1 day',
  'Campus Police & Security HQ',
  'user_desk',
  'Officer Davis',
  'campus.security@campus.edu',
  '(555) 911-0000',
  true,
  'open'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO claims (id, found_item_id, item_title, claimer_id, claimer_name, claimer_email, claimer_phone, description, status)
VALUES
(
  'claim-301',
  'found-201',
  'Dorm Keys on Red University Lanyard',
  'user_alex',
  'Alex Rivera',
  'alex.rivera@campus.edu',
  '(555) 234-5678',
  'These are my North Quad dorm keys. The lanyard has University Athletics on it and the key fob ends in 412.',
  'pending'
)
ON CONFLICT (id) DO NOTHING;
