-- Supabase Seed Data — ACLEC Dokutah Kota Salatiga
-- Run AFTER supabase-schema-complete.sql
-- Copy-paste INSERTs ke Supabase SQL Editor

-- ─── Rumah Sakit ──────────────────────────────────────────────
INSERT INTO rumah_sakit (nama, alamat, terima_bpjs, lattitude, longitude, no_telp, jam_buka, jam_tutup) VALUES
('RSUD Kota Salatiga',           'Jl. Osamaliki No.19, Kebonsari, Salatiga',        true,  -7.3275, 110.4962, '(0298) 326017', '00:00', '23:59'),
('RS DKT Salatiga',              'Jl. Dr. Muwardi No.50, Mrican, Salatiga',         true,  -7.3310, 110.5106, '(0298) 321098', '00:00', '23:59'),
('RS Puri Asih Salatiga',        'Jl. Jenderal Sudirman, Pancuran, Salatiga',       true,  -7.3386, 110.5085, '(0298) 323209', '00:00', '23:59'),
('RSIA Hermina Mutiara Bunda',   'Jl. Merak, Togaten, Salatiga',                    true,  -7.3308, 110.4953, '(0298) 325555', '00:00', '23:59'),
('RS Paru Dr. Ario Wirawan',     'Jl. Hasanuddin No.806, Bendosari, Salatiga',      true,  -7.3500, 110.4893, '(0298) 326519', '07:00', '16:00'),
('RS Islam Tunas Harapan',       'Jl. Soekarno-Hatta, Cebongan, Salatiga',         true,  -7.3626, 110.5133, '(0298) 312345', '00:00', '23:59'),
('RSU Ananda Salatiga',          'Jl. Ki Penjawi, Bancaan Barat, Salatiga',         false, -7.3096, 110.4913, '(0298) 318899', '07:00', '21:00');

-- ─── Fasilitas Kesehatan ─────────────────────────────────────
INSERT INTO fasilitas_kesehatan (nama_faskes, alamat, terima_bpjs, lattitude, longitude, no_telp, jam_buka, jam_tutup) VALUES
('Puskesmas Kalicacing',         'Jl. Brigjen Sudiarto No.49, Kebonsari, Salatiga', true,  -7.3349, 110.4984, '(0298) 312001', '07:30', '14:00'),
('Puskesmas Tegalrejo',          'Jl. Tegalrejo Raya, Kenteng, Salatiga',           true,  -7.3477, 110.5003, '(0298) 312002', '07:30', '14:00'),
('Puskesmas Mangunsari',         'Jl. Bangau No.16, Jangkungan, Salatiga',          true,  -7.3287, 110.4919, '(0298) 312003', '07:30', '14:00'),
('Puskesmas Sidorejo Lor',       'Jl. Diponegoro No.100, Bancaan, Salatiga',        true,  -7.3123, 110.4918, '(0298) 312004', '07:30', '14:00'),
('Puskesmas Cebongan',           'Jl. Soekarno-Hatta Km.1, Cebongan, Salatiga',    true,  -7.3583, 110.5125, '(0298) 312005', '07:30', '14:00'),
('Puskesmas Sidorejo Kidul',     'Jl. Tritis Mukti No.1, Tingkir, Salatiga',       true,  -7.3384, 110.5179, '(0298) 312006', '07:30', '14:00'),
('Klinik Pratama Hestiwirasakti','Jl. Nanggulan No.21, Gendongan, Salatiga',        true,  -7.3325, 110.5101, '(0298) 313001', '08:00', '20:00'),
('Klinik NL Salatiga',           'Jl. Imam Bonjol, Winang, Salatiga',               false, -7.3209, 110.4948, '(0298) 313002', '08:00', '17:00'),
('Klinik Zamathera',             'Jl. Kyai Condro No.7, Karangpandan, Salatiga',   false, -7.3228, 110.4806, '(0298) 313003', '08:00', '20:00'),
('Aura Medika',                  'Jl. Brigjen Sudiarto, Kebonsari, Salatiga',       false, -7.3311, 110.4991, '(0298) 313004', '08:00', '21:00');

-- ─── Dokter ───────────────────────────────────────────────────
INSERT INTO dokter (nama_dokter, spesialis, no_hp, alamat_praktik, terima_bpjs, rating, latitude, longitude) VALUES
('dr. Ahmad Santoso, Sp.PD',    'Penyakit Dalam', '081234567001', 'RSUD Kota Salatiga',           true,  4.8, -7.3275, 110.4962),
('dr. Budi Raharjo',            'Umum',           '081234567002', 'Puskesmas Kalicacing',         true,  4.5, -7.3349, 110.4984),
('dr. Citra Dewi, Sp.A',        'Anak',           '081234567003', 'RS DKT Salatiga',              true,  4.7, -7.3310, 110.5106),
('dr. Dian Kusuma',             'Umum',           '081234567004', 'Puskesmas Mangunsari',         true,  4.3, -7.3287, 110.4919),
('drg. Eka Wulandari',          'Gigi',           '081234567005', 'Klinik Pratama Hestiwirasakti',true,  4.6, -7.3325, 110.5101),
('dr. Fajar Nugroho, Sp.OG',    'Kandungan',      '081234567006', 'RSIA Hermina Mutiara Bunda',   true,  4.9, -7.3308, 110.4953),
('dr. Galuh Purnama, Sp.JP',    'Jantung',        '081234567007', 'RSUD Kota Salatiga',           true,  4.8, -7.3275, 110.4962),
('dr. Hendra Wijaya',           'Umum',           '081234567008', 'Puskesmas Sidorejo Lor',       true,  4.4, -7.3123, 110.4918),
('dr. Indah Lestari, Sp.S',     'Saraf',          '081234567009', 'RS Puri Asih Salatiga',        true,  4.7, -7.3386, 110.5085),
('dr. Joko Santoso',            'Umum',           '081234567010', 'Puskesmas Tegalrejo',          true,  4.2, -7.3477, 110.5003),
('drg. Kartika Sari',           'Gigi',           '081234567011', 'Klinik NL Salatiga',           false, 4.5, -7.3209, 110.4948),
('dr. Lutfi Hakim, Sp.M',       'Mata',           '081234567012', 'RS DKT Salatiga',              true,  4.6, -7.3310, 110.5106),
('dr. Maya Puspita',            'Umum',           '081234567013', 'Puskesmas Cebongan',           true,  4.3, -7.3583, 110.5125),
('dr. Nanda Pratama, Sp.KK',    'Kulit',          '081234567014', 'Aura Medika',                  false, 4.7, -7.3311, 110.4991),
('dr. Putri Ramadhani',         'Umum',           '081234567015', 'Puskesmas Sidorejo Kidul',     true,  4.1, -7.3384, 110.5179);

-- ─── Jenis Poli ───────────────────────────────────────────────
INSERT INTO jenis_poli (nama_poli, fasilitas_kesehatan_id_faskes) VALUES
('Poli Umum',    1),  -- Puskesmas Kalicacing (id_faskes=1)
('Poli Gigi',    1),
('Poli Umum',    2),  -- Puskesmas Tegalrejo
('Poli Gigi',    2),
('Poli Umum',    3),  -- Puskesmas Mangunsari  
('Poli Umum',    4),  -- Puskesmas Sidorejo Lor
('Poli Umum',    5),  -- Puskesmas Cebongan
('Poli Umum',    6),  -- Puskesmas Sidorejo Kidul
('Poli Gigi',    7),  -- Klinik Pratama Hestiwirasakti
('Poli Umum',    7);

-- ─── Jadwal Dokter ────────────────────────────────────────────
INSERT INTO jadwal_dokter (dokter_id_dokter, jenis_poli_id_poli, jadwal_praktik, jam_periksa_buka, jam_periksa_tutup, kuota_maksimal) VALUES
(2,  1, 'Senin',    '08:00', '12:00', 20),
(2,  1, 'Rabu',     '08:00', '12:00', 20),
(2,  1, 'Jumat',    '08:00', '12:00', 20),
(4,  5, 'Selasa',   '08:00', '12:00', 15),
(4,  5, 'Kamis',    '08:00', '12:00', 15),
(5,  9, 'Senin',    '09:00', '15:00', 15),
(5,  9, 'Rabu',     '09:00', '15:00', 15),
(8,  6, 'Senin',    '08:00', '12:00', 20),
(8,  6, 'Selasa',   '08:00', '12:00', 20),
(10, 3, 'Senin',    '08:00', '13:00', 20),
(10, 3, 'Rabu',     '08:00', '13:00', 20),
(13, 7, 'Selasa',   '08:00', '12:00', 15),
(13, 7, 'Kamis',    '08:00', '12:00', 15),
(15, 8, 'Senin',    '08:00', '12:00', 20),
(15, 8, 'Jumat',    '08:00', '12:00', 20);

-- Verify seed data
SELECT 'Seed completed' as status,
  (SELECT COUNT(*) FROM rumah_sakit) as rs_count,
  (SELECT COUNT(*) FROM fasilitas_kesehatan) as faskes_count,
  (SELECT COUNT(*) FROM dokter) as dokter_count,
  (SELECT COUNT(*) FROM jenis_poli) as poli_count,
  (SELECT COUNT(*) FROM jadwal_dokter) as jadwal_count;

