'use strict';

/**
 * src/routes/pemesananRoutes.js
 * FIX #2: '../controllers/...' → '../controller/...'
 *
 * Endpoint:
 *   GET    /api/pemesanan                    → daftar pemesanan (?id_faskes=&id_rumah_sakit=)
 *   POST   /api/pemesanan                    → buat pemesanan baru
 *   DELETE /api/pemesanan/:id                → batalkan pemesanan
 */

const { Router } = require('express');
const { validate, schemas } = require('../middleware/validator');
const { create, getByJadwal, cancel } = require('../controller/pemesananController');

const router = Router();

router.get('/',       getByJadwal);
router.post('/',      validate(schemas.pemesananSchema, 'body'), create);
router.delete('/:id', cancel);

module.exports = router;
