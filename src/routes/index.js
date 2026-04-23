const express = require('express');
const router = express.Router();

// Health check
router.get('/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Artikel routes (primary for this fix)
try {
  const artikelRoutes = require('./artikelRoutes');
  router.use('/artikel', artikelRoutes);
} catch (e) {
  router.get('/artikel', (req, res) => res.status(500).json({ error: 'Artikel routes not configured', details: e.message }));
}

// Placeholder for other routes
router.use('/dokter', (req, res) => res.status(501).json({ error: 'dokter routes WIP' }));
router.use('/faskes', (req, res) => res.status(501).json({ error: 'faskes routes WIP' }));
router.use('/jadwal', (req, res) => res.status(501).json({ error: 'jadwal routes WIP' }));
router.use('/pemesanan', (req, res) => res.status(501).json({ error: 'pemesanan routes WIP' }));
router.use('/maps', (req, res) => res.status(501).json({ error: 'maps routes WIP' }));

module.exports = router;
