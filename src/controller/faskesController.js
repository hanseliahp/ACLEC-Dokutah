'use strict';

/**
 * src/controller/faskesController.js
 * Handler untuk data fasilitas kesehatan.
 * ⭐ BARU: getNearestDijkstra — endpoint Algoritma Dijkstra
 */

const { getSupabaseClient }                    = require('../config/supabase');
const { successResponse, notFoundResponse,
        clientErrorResponse }                  = require('../utils/responseHelper');
const { enrichWithDistance, parseCoordinates } = require('../utils/geoHelper');
const { findNearestFaskes }                    = require('../utils/dijkstra');

const normaliseFaskes = (row, jenis) => ({
  id_faskes:   row.id_faskes      || row.id_rumah_sakit,
  nama:        row.nama_faskes    || row.nama,
  alamat:      row.alamat,
  jenis,
  terima_bpjs: row.terima_bpjs === true,
  latitude:    parseFloat(row.latitude || row.lattitude) || null,
  longitude:   parseFloat(row.longitude) || null,
  no_telp:     row.no_telp   || null,
  jam_buka:    row.jam_buka  || null,
  jam_tutup:   row.jam_tutup || null,
});

const fetchAllFaskes = async (supabase, jenis = null) => {
  let result = [];
  if (!jenis || jenis !== 'rs') {
    const { data, error } = await supabase
      .from('fasilitas_kesehatan')
      .select('id_faskes, nama_faskes, alamat, terima_bpjs, latitude, longitude, no_telp, jam_buka, jam_tutup')
      .not('latitude', 'is', null);
    if (!error && data) result = [...result, ...data.map(r => normaliseFaskes(r, 'faskes'))];
  }
  if (!jenis || jenis === 'rs') {
    const { data, error } = await supabase
      .from('rumah_sakit')
      .select('id_rumah_sakit, nama, alamat, terima_bpjs, latitude, longitude, no_telp, jam_buka, jam_tutup')
      .not('latitude', 'is', null);
    if (!error && data) result = [...result, ...data.map(r => normaliseFaskes(r, 'rs'))];
  }
  return result;
};

const getAll = async (req, res, next) => {
  try {
    const { jenis } = req.query;
    const supabase  = getSupabaseClient();
    let result      = [];

    if (!jenis || jenis !== 'rs') {
      const { data, error } = await supabase
        .from('fasilitas_kesehatan')
        .select('id_faskes, nama_faskes, alamat, terima_bpjs, latitude, longitude, no_telp, jam_buka, jam_tutup')
        .order('nama_faskes', { ascending: true });
      if (error) throw error;
      result = [...result, ...data.map(r => normaliseFaskes(r, 'faskes'))];
    }
    if (!jenis || jenis === 'rs') {
      const { data, error } = await supabase
        .from('rumah_sakit')
        .select('id_rumah_sakit, nama, alamat, terima_bpjs, latitude, longitude, no_telp, jam_buka, jam_tutup')
        .order('nama', { ascending: true });
      if (error) throw error;
      result = [...result, ...data.map(r => normaliseFaskes(r, 'rs'))];
    }
    successResponse(res, 'Data faskes berhasil diambil.', result, 200, { total: result.length });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const { id }   = req.params;
    const supabase = getSupabaseClient();
    const { data: faskes } = await supabase.from('fasilitas_kesehatan').select('*').eq('id_faskes', id).single();
    if (faskes) return successResponse(res, 'Detail faskes berhasil diambil.', normaliseFaskes(faskes, 'faskes'));
    const { data: rs, error } = await supabase.from('rumah_sakit').select('*').eq('id_rumah_sakit', id).single();
    if (error || !rs) return notFoundResponse(res, 'Fasilitas Kesehatan');
    successResponse(res, 'Detail faskes berhasil diambil.', normaliseFaskes(rs, 'rs'));
  } catch (err) { next(err); }
};

const getNearby = async (req, res, next) => {
  try {
    const { lat, lng, radius = '10', jenis } = req.query;
    const userLocation = parseCoordinates(lat, lng);
    if (!userLocation) return clientErrorResponse(res, 'Parameter lat dan lng tidak valid.', 400);
    const supabase = getSupabaseClient();
    const allData  = await fetchAllFaskes(supabase, jenis);
    const enriched = enrichWithDistance(allData, userLocation, parseFloat(radius));
    successResponse(res, `${enriched.length} faskes dalam radius ${radius} km ditemukan.`, enriched, 200, {
      total: enriched.length, radius_km: parseFloat(radius), user_location: userLocation, algoritma: 'Haversine',
    });
  } catch (err) { next(err); }
};

/**
 * getNearestDijkstra — GET /api/faskes/dijkstra?lat=&lng=&jenis=&top=
 * ⭐ Algoritma Dijkstra: mencari faskes terdekat via shortest path graph.
 *
 * Graf dibangun dengan:
 * - Node: USER + setiap faskes yang punya koordinat
 * - Edge weight: jarak Haversine antar titik (km)
 * - Source: USER (posisi pengguna)
 * - Output: faskes diurutkan dari shortest path terpendek
 */
const getNearestDijkstra = async (req, res, next) => {
  try {
    const { lat, lng, jenis, top = '10' } = req.query;
    const userLocation = parseCoordinates(lat, lng);
    if (!userLocation) return clientErrorResponse(res, 'Parameter lat dan lng tidak valid.', 400);

    const supabase = getSupabaseClient();
    const allData  = await fetchAllFaskes(supabase, jenis);

    if (!allData.length) {
      return successResponse(res, 'Tidak ada faskes dengan koordinat tersedia.', [], 200, { total: 0 });
    }

    const topN   = Math.min(parseInt(top, 10) || 10, 20);
    const ranked = findNearestFaskes(userLocation, allData, topN);

    successResponse(
      res,
      `${ranked.length} faskes terdekat ditemukan menggunakan Algoritma Dijkstra.`,
      ranked,
      200,
      {
        total:         ranked.length,
        user_location: userLocation,
        algoritma:     'Dijkstra',
        keterangan:    'Shortest path dari lokasi pengguna ke setiap faskes',
        jenis:         jenis || 'semua',
      },
    );
  } catch (err) { next(err); }
};

const getAllJenis = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const [{ count: countFaskes }, { count: countRs }] = await Promise.all([
      supabase.from('fasilitas_kesehatan').select('*', { count: 'exact', head: true }),
      supabase.from('rumah_sakit').select('*', { count: 'exact', head: true }),
    ]);
    successResponse(res, 'Jenis faskes berhasil diambil.', [
      { jenis: 'faskes', label: 'Puskesmas & Klinik', jumlah: countFaskes || 0 },
      { jenis: 'rs',     label: 'Rumah Sakit',        jumlah: countRs     || 0 },
    ]);
  } catch (err) { next(err); }
};

const getByDokterKriteria = async (req, res, next) => {
  try {
    const { kriteria, lat, lng, radius = '10' } = req.query;
    if (!kriteria) return clientErrorResponse(res, 'Parameter kriteria wajib.', 400);
    const userLocation = parseCoordinates(lat, lng);
    if (!userLocation) return clientErrorResponse(res, 'Parameter lat dan lng tidak valid.', 400);

    const supabase = getSupabaseClient();
    const { data: dokterData, error: dokterErr } = await supabase.from('dokter').select('id_dokter').ilike('spesialis', `%${kriteria}%`);
    if (dokterErr) throw dokterErr;
    if (!dokterData.length) return successResponse(res, `Tidak ada dokter ${kriteria}.`, [], 200, { total: 0 });

    const { data: jadwalData, error: jadwalErr } = await supabase.from('jadwal_dokter').select('id_poli').in('id_dokter', dokterData.map(d => d.id_dokter));
    if (jadwalErr) throw jadwalErr;
    const idPoliList = [...new Set(jadwalData.map(j => j.id_poli))];
    if (!idPoliList.length) return successResponse(res, `Tidak ada faskes dengan dokter ${kriteria}.`, [], 200, { total: 0 });

    const { data: poliData, error: poliErr } = await supabase.from('jenis_poli').select('id_faskes').in('id_poli', idPoliList).not('id_faskes', 'is', null);
    if (poliErr) throw poliErr;
    const idFaskesList = [...new Set(poliData.map(p => p.id_faskes))];

    const { data: faskesData, error: faskesErr } = await supabase.from('fasilitas_kesehatan').select('id_faskes, nama_faskes, alamat, terima_bpjs, latitude, longitude').in('id_faskes', idFaskesList).not('latitude', 'is', null);
    if (faskesErr) throw faskesErr;

    const enriched = enrichWithDistance(faskesData.map(r => normaliseFaskes(r, 'faskes')), userLocation, parseFloat(radius));
    successResponse(res, `${enriched.length} faskes dengan dokter ${kriteria}.`, enriched, 200, {
      total: enriched.length, kriteria, radius_km: parseFloat(radius), user_location: userLocation,
    });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, getNearby, getNearestDijkstra, getAllJenis, getByDokterKriteria };
