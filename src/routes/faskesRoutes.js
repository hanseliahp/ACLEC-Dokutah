'use strict';

/**
 * src/routes/faskesRoutes.js
 *
 * GET /api/faskes                  → getAll
 * GET /api/faskes/jenis            → getAllJenis
 * GET /api/faskes/nearby           → getNearby (Haversine)
 * GET /api/faskes/dijkstra         → getNearestDijkstra ⭐ Dijkstra Algorithm
 * GET /api/faskes/by-dokter        → getByDokterKriteria
 * GET /api/faskes/:id              → getById
 */

const { Router } = require('express');
const { validate, schemas }    = require('../middleware/validator');
const {
  getAll, getById, getNearby, getNearestDijkstra,
  getAllJenis, getByDokterKriteria,
} = require('../controller/faskesController');

const router = Router();

// Statis dulu, baru dinamis (:id)
router.get('/jenis',     getAllJenis);
router.get('/nearby',    validate(schemas.koordinatSchema, 'query'), getNearby);
router.get('/dijkstra',  validate(schemas.koordinatSchema, 'query'), getNearestDijkstra);
router.get('/by-dokter', validate(schemas.koordinatSchema, 'query'), getByDokterKriteria);
router.get('/',          getAll);
router.get('/:id',       getById);

module.exports = router;
