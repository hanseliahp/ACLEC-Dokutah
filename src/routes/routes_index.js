'use strict';

/**
 * src/routes/routes_index.js
 * Router utama — mount semua sub-router.
 */

const { Router } = require('express');
const router = Router();

// ─── Health check ─────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({
    success:   true,
    message:   'Dokutah API berjalan normal 🏥',
    timestamp: new Date().toISOString(),
    version:   '1.0.0',
    scope:     'Kota Salatiga, Jawa Tengah',
  });
});

router.get('/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Sub-routes ───────────────────────────────────────────────────────────────
router.use('/dokter',    require('./dokterRoutes'));
router.use('/faskes',    require('./faskesRoutes'));
router.use('/artikel',   require('./artikelRoutes'));
router.use('/jadwal',    require('./jadwalRoutes'));
router.use('/maps',      require('./mapsRoutes'));
router.use('/pemesanan', require('./pemesananRoutes'));

module.exports = router;
