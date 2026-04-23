'use strict';

/**
 * src/routes/artikelRoutes.js
 * FIX #2: '../controllers/...' → '../controller/...' (folder tidak pakai 's')
 *
 * Endpoint:
 *   GET  /api/artikel                  → semua artikel (?kategori=&search=&page=&limit=)
 *   GET  /api/artikel/kategori         → daftar kategori + jumlah
 *   GET  /api/artikel/:slug            → detail artikel by slug
 *   POST /api/artikel                  → buat artikel baru (CMS)
 */

const { Router } = require('express');
const { validate, schemas } = require('../middleware/validator');
const { getAll, getBySlug, getKategori, create } = require('../controller/artikelController');

const router = Router();

// Statis sebelum dinamis — /kategori harus diatas /:slug
router.get('/kategori', getKategori);
router.get('/',         getAll);
router.get('/:slug',    getBySlug);
router.post('/',        validate(schemas.artikelSchema, 'body'), create);

module.exports = router;
