'use strict';

/**
 * src/routes/dokterRoutes.js
 * FIX #2: '../controllers/...' → '../controller/...' (folder tidak pakai 's')
 *
 * Endpoint:
 *   GET /api/dokter                     → semua dokter (?spesialis=&nama=)
 *   GET /api/dokter/bpjs?lat=&lng=      → dokter yang terima BPJS, urutkan by jarak
 *   GET /api/dokter/spesialis/:jenis    → dokter by spesialis
 *   GET /api/dokter/by-faskes/:id       → dokter by faskes tertentu
 *   GET /api/dokter/:id                 → detail dokter by ID
 */

const { Router } = require('express');
const { getAll, getById, getBySpesialis, getBpjsDokter, getByFaskesKriteria } =
  require('../controller/dokterController');

const router = Router();

// URUTAN PENTING: statis sebelum dinamis
router.get('/bpjs',                 getBpjsDokter);
router.get('/by-faskes/:id_faskes', getByFaskesKriteria);
router.get('/spesialis/:jenis',     getBySpesialis);
router.get('/',                     getAll);
router.get('/:id',                  getById);

module.exports = router;
