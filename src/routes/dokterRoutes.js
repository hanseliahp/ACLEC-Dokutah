'use strict';

/**
 * src/routes/dokterRoutes.js
 *
 * URUTAN PENTING: route statis HARUS sebelum /:id
 * Kalau /:id duluan, "/bpjs" dan "/spesialis/umum" akan tertangkap sebagai ID.
 *
 * GET /api/dokter                        → semua dokter
 * GET /api/dokter/bpjs?lat=&lng=         → dokter terima BPJS terdekat
 * GET /api/dokter/spesialis/:jenis       → dokter by spesialis
 * GET /api/dokter/by-faskes/:id_faskes   → dokter di faskes tertentu
 * GET /api/dokter/:id                    → detail dokter by ID
 */

const { Router }        = require('express');
const { getSupabaseClient } = require('../config/supabase');
const { enrichWithDistance, parseCoordinates } = require('../utils/geoHelper');

const router = Router();

// ─── GET / — semua dokter ─────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { spesialis, nama } = req.query;
    const supabase = getSupabaseClient();

    let q = supabase
      .from('dokter')
      .select(`
        id_dokter, nama_dokter, foto_profil_dokter,
        spesialis, no_hp, alamat_praktik, terima_bpjs, rating,
        latitude, longitude
      `)
      .order('nama_dokter', { ascending: true });

    if (spesialis) q = q.ilike('spesialis', `%${spesialis}%`);
    if (nama)      q = q.ilike('nama_dokter', `%${nama}%`);

    const { data, error } = await q;
    if (error) throw error;

    res.json({ success: true, data, total: data.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /bpjs — dokter BPJS terdekat ────────────────────────────────────────
// HARUS sebelum /:id agar "bpjs" tidak ditangkap sebagai ID
router.get('/bpjs', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const supabase     = getSupabaseClient();

    const { data, error } = await supabase
      .from('dokter')
      .select(`
        id_dokter, nama_dokter, foto_profil_dokter,
        spesialis, no_hp, alamat_praktik, terima_bpjs, rating,
        latitude, longitude
      `)
      .eq('terima_bpjs', true)
      .order('nama_dokter', { ascending: true });

    if (error) throw error;

    // Sort by distance jika ada koordinat
    const userLocation = parseCoordinates(lat, lng);
    let result = data;
    if (userLocation) {
      result = enrichWithDistance(data, userLocation, 50)
        .sort((a, b) => a.distance_km - b.distance_km);
    }

    res.json({ success: true, data: result, total: result.length, bpjs_filtered: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /spesialis/:jenis ────────────────────────────────────────────────────
// HARUS sebelum /:id
router.get('/spesialis/:jenis', async (req, res) => {
  try {
    const { jenis }  = req.params;
    const supabase   = getSupabaseClient();

    const { data, error } = await supabase
      .from('dokter')
      .select('*')
      .ilike('spesialis', `%${jenis}%`)
      .order('rating', { ascending: false, nullsFirst: false });

    if (error) throw error;

    res.json({ success: true, data, total: data.length, spesialis: jenis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /by-faskes/:id_faskes ───────────────────────────────────────────────
// HARUS sebelum /:id
router.get('/by-faskes/:id_faskes', async (req, res) => {
  try {
    const { id_faskes }          = req.params;
    const { kriteria, lat, lng } = req.query;
    const supabase               = getSupabaseClient();

    // Ambil id_dokter dari jadwal_dokter di faskes ini
    const { data: jadwal, error: jadwalErr } = await supabase
      .from('jadwal_dokter')
      .select('dokter_id_dokter')
      .eq('jenis_poli_id_poli', id_faskes); // sesuaikan jika relasi berbeda

    if (jadwalErr) throw jadwalErr;
    const idDokterList = [...new Set(jadwal.map(j => j.dokter_id_dokter))];
    if (!idDokterList.length) return res.json({ success: true, data: [], total: 0 });

    let q = supabase
      .from('dokter')
      .select('*')
      .in('id_dokter', idDokterList)
      .order('nama_dokter', { ascending: true });

    if (kriteria) q = q.ilike('spesialis', `%${kriteria}%`);

    const { data, error } = await q;
    if (error) throw error;

    const userLocation = parseCoordinates(lat, lng);
    let result = data;
    if (userLocation) {
      result = enrichWithDistance(data, userLocation, 50)
        .sort((a, b) => a.distance_km - b.distance_km);
    }

    res.json({ success: true, data: result, total: result.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /:id — detail dokter (HARUS PALING BAWAH) ───────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('dokter')
      .select('*')
      .eq('id_dokter', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Dokter tidak ditemukan.' });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
