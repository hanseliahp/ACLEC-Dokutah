'use strict';

/**
 * src/routes/mapsRoutes.js
 * FIX #2: '../controllers/...' → '../controller/...'
 *
 * Endpoint (semua via Nominatim / OpenStreetMap — gratis, no API key):
 *   GET /api/maps/nearby?lat=&lng=&jenis=&radius=  → cari 1 jenis faskes
 *   GET /api/maps/all?lat=&lng=&radius=            → cari semua jenis sekaligus (paralel)
 *   GET /api/maps/detail/:osmId                    → detail tempat by OSM ID
 *   GET /api/maps/geocode?alamat=                  → konversi alamat → koordinat
 */

const { Router } = require('express');
const { validate, schemas }                      = require('../middleware/validator');
const { searchNearby, searchAllFaskes,
        getPlaceDetails, geocode }               = require('../controller/mapsController');

const router = Router();

router.get('/nearby',        validate(schemas.koordinatSchema, 'query'), searchNearby);
router.get('/all',           validate(schemas.koordinatSchema, 'query'), searchAllFaskes);
router.get('/detail/:osmId', getPlaceDetails);
router.get('/geocode',       geocode);

module.exports = router;
