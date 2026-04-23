const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Users endpoint (from original server.js)
router.get('/users', async (req, res) => {
  try {
    const { getSupabase } = require('../config/supabase');
    const supabase = getSupabase();

    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not connected' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
