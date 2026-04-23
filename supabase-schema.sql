-- Supabase Schema for ACLEC Dokutah
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql)

-- Enable RLS on all tables after creation
-- ALTER TABLE artikel ENABLE ROW LEVEL SECURITY;

-- Articles table
CREATE TABLE IF NOT EXISTS public.artikel (
  id_artikel BIGSERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  ringkasan TEXT,
  konten TEXT NOT NULL,
  kategori TEXT CHECK (kategori IN ('umum', 'penyakit', 'gizi', 'ibu-anak', 'kesehatan-jiwa', 'obat', 'tips', 'darurat', 'bpjs')) NOT NULL,
  gambar_url TEXT,
  penulis TEXT DEFAULT 'Admin',
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_artikel_aktif ON artikel(aktif);
CREATE INDEX IF NOT EXISTS idx_artikel_kategori ON artikel(kategori);
CREATE INDEX IF NOT EXISTS idx_artikel_slug ON artikel(slug);
CREATE INDEX IF NOT EXISTS idx_artikel_created ON artikel(created_at DESC);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_artikel_updated_at BEFORE UPDATE
  ON artikel FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Sample data (optional)
INSERT INTO artikel (judul, slug, ringkasan, konten, kategori, penulis) VALUES
('Welcome to ACLEC Dokutah', 'welcome-to-aclec-dokutah', 'Intro to medical consultation platform', 'Full content here...', 'umum', 'Admin')
ON CONFLICT (slug) DO NOTHING;

-- Verify
SELECT * FROM artikel ORDER BY created_at DESC LIMIT 5;

