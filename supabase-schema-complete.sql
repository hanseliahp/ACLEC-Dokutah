-- Supabase Complete Schema for ACLEC Dokutah
-- Run FULL script in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- Includes: tables, FKs, indexes, RLS policies, triggers

-- 1. Drop tables if exist (safe recreate)
DROP TABLE IF EXISTS jadwal_dokter CASCADE;
DROP TABLE IF EXISTS jenis_poli CASCADE;
DROP TABLE IF EXISTS dokter CASCADE;
DROP TABLE IF EXISTS fasilitas_kesehatan CASCADE;
DROP TABLE IF EXISTS rumah_sakit CASCADE;
DROP TABLE IF EXISTS pesanan CASCADE;

-- 2. Core Tables
CREATE TABLE rumah_sakit (
  id_rumah_sakit SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  alamat TEXT NOT NULL,
  terima_bpjs BOOLEAN DEFAULT true,
  lattitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  no_telp TEXT,
  jam_buka TIME,
  jam_tutup TIME,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE fasilitas_kesehatan (
  id_faskes SERIAL PRIMARY KEY,
  nama_faskes TEXT NOT NULL,
  alamat TEXT NOT NULL,
  terima_bpjs BOOLEAN DEFAULT true,
  lattitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  no_telp TEXT,
  jam_buka TIME,
  jam_tutup TIME,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE dokter (
  id_dokter SERIAL PRIMARY KEY,
  nama_dokter TEXT NOT NULL,
  spesialis TEXT,
  no_hp TEXT,
  alamat_praktik TEXT,
  terima_bpjs BOOLEAN DEFAULT false,
  rating DECIMAL(3,1),
latitude DECIMAL(10,8),  -- standardized
  longitude DECIMAL(11,8),
  lattitude DECIMAL(10,8),  -- seed uses this
  foto_profil_dokter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE jenis_poli (
  id_poli SERIAL PRIMARY KEY,
  nama_poli TEXT NOT NULL,
  fasilitas_kesehatan_id_faskes INTEGER REFERENCES fasilitas_kesehatan(id_faskes)
);

CREATE TABLE jadwal_dokter (
  id_jadwal_dokter SERIAL PRIMARY KEY,
  dokter_id_dokter INTEGER NOT NULL REFERENCES dokter(id_dokter) ON DELETE CASCADE,
  jenis_poli_id_poli INTEGER NOT NULL REFERENCES jenis_poli(id_poli) ON DELETE CASCADE,
  jadwal_praktik TEXT CHECK (jadwal_praktik IN ('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu')),
  jam_periksa_buka TIME,
  jam_periksa_tutup TIME,
  kuota_maksimal INTEGER DEFAULT 20
);

CREATE TABLE pesanan (
  id_pesanan SERIAL PRIMARY KEY,
  id_user UUID REFERENCES auth.users(id),  -- Supabase auth.users
  id_faskes INTEGER REFERENCES fasilitas_kesehatan(id_faskes),
  id_rumah_sakit INTEGER REFERENCES rumah_sakit(id_rumah_sakit),
  jenis_pesanan TEXT DEFAULT 'Umum',
  tanggal_periksa DATE NOT NULL,
  nomor_antrean INTEGER NOT NULL,
  status_antrean TEXT DEFAULT 'menunggu' CHECK (status_antrean IN ('menunggu','dipanggil','selesai','dibatalkan')),
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for performance
CREATE INDEX idx_dokter_spesialis ON dokter(spesialis);
CREATE INDEX idx_dokter_terima_bpjs ON dokter(terima_bpjs);
CREATE INDEX idx_dokter_location ON dokter USING GIST (point(longitude, latitude));
CREATE INDEX idx_faskes_location ON fasilitas_kesehatan USING GIST (point(longitude, lattitude));
CREATE INDEX idx_rs_location ON rumah_sakit USING GIST (point(longitude, lattitude));
CREATE INDEX idx_pesanan_tanggal ON pesanan(tanggal_periksa);
CREATE INDEX idx_jadwal_dokter_id ON jadwal_dokter(dokter_id_dokter);

-- 4. RLS Policies (public read-only, auth write)
ALTER TABLE dokter ENABLE ROW LEVEL SECURITY;
CREATE POLICY \"Public read dokter\" ON dokter FOR SELECT USING (true);
CREATE POLICY \"Authenticated write dokter\" ON dokter FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE fasilitas_kesehatan ENABLE ROW LEVEL SECURITY;
CREATE POLICY \"Public read faskes\" ON fasilitas_kesehatan FOR SELECT USING (true);
CREATE POLICY \"Authenticated write faskes\" ON fasilitas_kesehatan FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE rumah_sakit ENABLE ROW LEVEL SECURITY;
CREATE POLICY \"Public read rs\" ON rumah_sakit FOR SELECT USING (true);
CREATE POLICY \"Authenticated write rs\" ON rumah_sakit FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE jadwal_dokter ENABLE ROW LEVEL SECURITY;
CREATE POLICY \"Public read jadwal\" ON jadwal_dokter FOR SELECT USING (true);
CREATE POLICY \"Authenticated write jadwal\" ON jadwal_dokter FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE jenis_poli ENABLE ROW LEVEL SECURITY;
CREATE POLICY \"Public read poli\" ON jenis_poli FOR SELECT USING (true);
CREATE POLICY \"Authenticated write poli\" ON jenis_poli FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE pesanan ENABLE ROW LEVEL SECURITY;
CREATE POLICY \"Public read own pesanan\" ON pesanan FOR SELECT USING (auth.uid()::text = id_user::text);
CREATE POLICY \"Authenticated create pesanan\" ON pesanan FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY \"Authenticated update own pesanan\" ON pesanan FOR UPDATE USING (auth.uid()::text = id_user::text);

-- 5. Updated_at trigger (for artikel too)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at (if added later)

-- 6. Verify
SELECT 'Schema created successfully' as status;
\\dt  -- list tables
