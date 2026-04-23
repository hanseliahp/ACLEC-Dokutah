-- Supabase SQL: Create articles table
-- Run this SQL in your Supabase SQL Editor to set up the articles table

CREATE TABLE articles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'Umum',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255),
  is_published BOOLEAN DEFAULT true
);

-- Add RLS (Row Level Security) policy if needed
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Enable read access for all users" ON articles
  FOR SELECT USING (true);

-- Allow public insert (optional, restrict if needed)
CREATE POLICY "Enable insert for all users" ON articles
  FOR INSERT WITH CHECK (true);

-- Allow delete and update (optional, restrict if needed)
CREATE POLICY "Enable update for all users" ON articles
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON articles
  FOR DELETE USING (true);

-- Create index for faster queries
CREATE INDEX articles_created_at_idx ON articles (created_at DESC);
