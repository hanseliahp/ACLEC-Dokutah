'use strict';

const { Router } = require('express');
const router = Router();
const { getSupabaseClient } = require('../config/supabase');

// GET all dokter
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('dokter')
      .select('*');

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET dokter by ID
router.get('/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('dokter')
      .select('*')
      .eq('id_dokter', req.params.id)
      .single();

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;