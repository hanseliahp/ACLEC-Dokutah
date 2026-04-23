'use strict';

/**
 * src/routes/index.js
 * Router utama — mount semua sub-router di sini.
 *
 * FIX #1: Semua sub-route sekarang dimount dengan benar.
 * FIX #4: getSupabase() → getSupabaseClient() sesuai ekspor di src/config/supabase.js
 */

const { Router } = require('express');

const router = Router();

// ─── Health check ─────────────────────────────────────────────────────────────
router.get('/status', (req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    version:   '1.0.0',
  });
});

// ─── Sub-routes ───────────────────────────────────────────────────────────────
router.use('/dokter',    require('./dokterRoutes'));
router.use('/faskes',    require('./faskesRoutes'));
router.use('/artikel',   require('./artikelRoutes'));
router.use('/jadwal',    require('./jadwalRoutes'));
router.use('/maps',      require('./mapsRoutes'));
router.use('/pemesanan', require('./pemesananRoutes'));

// ─── Users (Supabase) ─────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { getSupabaseClient } = require('../config/supabase'); // FIX #4
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.from('users').select('*');

    if (error) return res.status(500).json({ success: false, error: error.message });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
