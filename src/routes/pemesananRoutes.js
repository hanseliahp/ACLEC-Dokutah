'use strict';

const { Router } = require('express');
const router = Router();
const { getSupabaseClient } = require('../config/supabase');

// CREATE booking (pesanan)
router.post('/', async (req, res) => {
  try {
    const supabase = getSupabaseClient();

    const {
      id_user,
      id_faskes,
      id_rumah_sakit,
      jenis_pesanan,
      tanggal_periksa
    } = req.body;

    // Generate nomor antrean otomatis
    const { count } = await supabase
      .from('pesanan')
      .select('*', { count: 'exact', head: true })
      .eq('tanggal_periksa', tanggal_periksa);

    const nomor_antrean = (count || 0) + 1;

    const { data, error } = await supabase
      .from('pesanan')
      .insert([
        {
          id_user,
          id_faskes,
          id_rumah_sakit,
          jenis_pesanan,
          tanggal_periksa,
          nomor_antrean,
          status_antrean: 'menunggu'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Booking berhasil',
      data
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('pesanan')
      .select('*');

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('pesanan')
      .select('*')
      .eq('id_user', req.params.id);

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

