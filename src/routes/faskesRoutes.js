'use strict';

/**
 * src/routes/faskesRoutes.js
 * FIX #2: '../controllers/...' → '../controller/...' (folder tidak pakai 's')
 *
 * Endpoint:
 *   GET /api/faskes                          → semua faskes (?jenis=)
 *   GET /api/faskes/jenis                    → daftar jenis + jumlah
 *   GET /api/faskes/nearby?lat=&lng=&radius= → faskes terdekat dari DB lokal
 *   GET /api/faskes/by-dokter?kriteria=...   → faskes yang punya dokter sesuai kriteria
 *   GET /api/faskes/:id                      → detail faskes by ID
 */

const { Router } = require('express');
const { validate, schemas } = require('../middleware/validator');
const { getAll, getById, getNearby, getAllJenis, getByDokterKriteria } =
  require('../controller/faskesController');

const router = Router();

// Statis sebelum dinamis
router.get('/by-dokter', validate(schemas.koordinatSchema, 'query'), getByDokterKriteria);
router.get('/jenis',     getAllJenis);
router.get('/nearby',    validate(schemas.koordinatSchema, 'query'), getNearby);
router.get('/',          getAll);
router.get('/:id',       getById);

module.exports = router;
