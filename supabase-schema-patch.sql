-- Schema PATCH for existing tables
-- Add missing columns for controllers + fix types

-- DOKTER: Add required columns
ALTER TABLE dokter ADD COLUMN IF NOT EXISTS spesialis TEXT;
ALTER TABLE dokter ADD COLUMN IF NOT EXISTS no_hp TEXT;
ALTER TABLE dokter ADD COLUMN IF NOT EXISTS alamat_praktik TEXT;
ALTER TABLE dokter ADD COLUMN IF NOT EXISTS terima_bpjs BOOLEAN DEFAULT false;
ALTER TABLE dokter ADD COLUMN IF NOT EXISTS rating DECIMAL(3,1);
ALTER TABLE dokter ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8);
ALTER TABLE dokter ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8);
ALTER TABLE dokter ALTER COLUMN foto_profil_dokter TYPE TEXT;  -- BYTEA → TEXT

-- FASKES: Add details
ALTER TABLE fasilitas_kesehatan ADD COLUMN IF NOT EXISTS no_telp TEXT;
ALTER TABLE fasilitas_kesehatan ADD COLUMN IF NOT EXISTS jam_buka TIME;
ALTER TABLE fasilitas_kesehatan ADD COLUMN IF NOT EXISTS jam_tutup TIME;
ALTER TABLE fasilitas_kesehatan ADD COLUMN IF NOT EXISTS lattitude DECIMAL(10,8);  -- seed expects

-- RUMAH SAKIT: Add details
ALTER TABLE rumah_sakit ADD COLUMN IF NOT EXISTS no_telp TEXT;
ALTER TABLE rumah_sakit ADD COLUMN IF NOT EXISTS jam_buka TIME;
ALTER TABLE rumah_sakit ADD COLUMN IF NOT EXISTS jam_tutup TIME;
ALTER TABLE rumah_sakit ADD COLUMN IF NOT EXISTS lattitude DECIMAL(10,8);

-- JADWAL DOKTER: Add kuota
ALTER TABLE jadwal_dokter ADD COLUMN IF NOT EXISTS kuota_maksimal INTEGER DEFAULT 20;

-- JENIS POLI: Fix FK (user schema has dual id_faskes/id_rumah_sakit)
-- Ignore - controllers use fasilitas_kesehatan_id_faskes

-- Verify
SELECT 'Patch applied' as status;
SELECT COUNT(*) FROM dokter;
