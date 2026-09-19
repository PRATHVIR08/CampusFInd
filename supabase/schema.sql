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

-- 7. Cleanup: Remove any previously seeded fake demo records
-- Run this block in the Supabase SQL Editor to wipe old test data.
-- The app is now fully real-time — items come from real user submissions only.
DELETE FROM claims WHERE id IN ('claim-301');
DELETE FROM found_items WHERE id IN ('found-201', 'found-202', 'found-203');
DELETE FROM lost_items WHERE id IN ('lost-101', 'lost-102', 'lost-103', 'lost-104');

-- No seed data. All lost/found items are created by real users via the web app.
