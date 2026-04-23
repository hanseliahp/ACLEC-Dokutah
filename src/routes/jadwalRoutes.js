'use strict';

const { Router } = require('express');
const router = Router();
const { getSupabaseClient } = require('../config/supabase');

// GET all jadwal dokter
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('jadwal_dokter')
      .select(`
        id_jadwal_dokter,
        jam_periksa_buka,
        jam_periksa_tutup,
        jadwal_praktik,
        dokter (
          id_dokter,
          nama_dokter
        ),
        jenis_poli (
          id_poli,
          nama_poli
        )
      `);

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET jadwal by dokter
router.get('/dokter/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('jadwal_dokter')
      .select('*')
      .eq('id_dokter', req.params.id);

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;