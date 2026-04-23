'use strict';

/**
 * src/routes/jadwalRoutes.js
 * FIX #2: '../controllers/...' → '../controller/...'
 *
 * Endpoint:
 *   GET /api/jadwal          → semua jadwal (?id_dokter=)
 *   GET /api/jadwal/:id      → detail jadwal by ID
 */

const { Router } = require('express');
const { getAll, getById } = require('../controller/jadwalController');

const router = Router();

router.get('/',    getAll);
router.get('/:id', getById);

module.exports = router;
