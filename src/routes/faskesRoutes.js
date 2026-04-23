router.get('/', async (req, res) => {
  try {
    const { getSupabaseClient } = require('../config/supabase');
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('fasilitas_kesehatan')
      .select('*');

    if (error) throw error;

    // Transform to frontend format
    const formatted = data.map(f => ({
      id: f.id_faskes,
      name: f.nama_faskes,
      address: f.alamat,
      phone: '-', // you didn't store this in new schema
      lat: f.latitude,
      lng: f.longitude,
      type: 'puskesmas', // or dynamic later
      services: ['Umum']
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});