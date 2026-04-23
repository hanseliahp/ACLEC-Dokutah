'use strict';

/**
 * src/middleware/validator.js
 * Middleware factory untuk validasi input request.
 *
 * FIX #5: pemesananSchema disesuaikan dengan field yang dipakai
 *         pemesananController.create:
 *         { id_user, id_faskes | id_rumah_sakit, jenis_pesanan, tanggal_periksa, catatan }
 *
 * Konsep JS:
 * - Higher-Order Functions: validate() menerima schema dan return middleware
 * - Closure: schema "diingat" oleh middleware yang dikembalikan
 */

const { clientErrorResponse } = require('../utils/responseHelper');

/**
 * validate — HOF yang menerima schema dan return Express middleware.
 * @param {Function} schema - fungsi (data) => string[] errors
 * @param {'body'|'params'|'query'} [source='body']
 * @returns {Function} Express middleware
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data   = req[source];
    const errors = schema(data);
    if (errors.length > 0) {
      return clientErrorResponse(res, 'Validasi gagal. Periksa input Anda.', 400, errors);
    }
    next();
  };
};

// ─── Schema Definitions ───────────────────────────────────────────────────────

/**
 * pemesananSchema — validasi body untuk POST /api/pemesanan.
 *
 * Field yang diterima pemesananController.create:
 *   id_user (wajib), id_faskes ATAU id_rumah_sakit (salah satu wajib),
 *   jenis_pesanan (opsional), tanggal_periksa (opsional), catatan (opsional)
 */
const pemesananSchema = ({ id_user, id_faskes, id_rumah_sakit, tanggal_periksa } = {}) => {
  const errors = [];

  if (!id_user)
    errors.push('id_user wajib diisi.');

  if (!id_faskes && !id_rumah_sakit)
    errors.push('id_faskes atau id_rumah_sakit wajib diisi (minimal salah satu).');

  if (tanggal_periksa && isNaN(Date.parse(tanggal_periksa)))
    errors.push('tanggal_periksa harus format tanggal yang valid (YYYY-MM-DD).');

  return errors;
};

/**
 * koordinatSchema — validasi query params untuk endpoint nearby/maps.
 */
const koordinatSchema = ({ lat, lng } = {}) => {
  const errors = [];

  if (!lat || !lng)
    errors.push('Parameter lat dan lng wajib diisi.');
  if (lat && isNaN(parseFloat(lat)))
    errors.push('Parameter lat harus berupa angka desimal.');
  if (lng && isNaN(parseFloat(lng)))
    errors.push('Parameter lng harus berupa angka desimal.');

  return errors;
};

/**
 * artikelSchema — validasi body untuk POST /api/artikel.
 */
const artikelSchema = ({ judul, konten, kategori } = {}) => {
  const errors = [];

  if (!judul  || judul.trim().length < 5)   errors.push('judul minimal 5 karakter.');
  if (!konten || konten.trim().length < 50)  errors.push('konten minimal 50 karakter.');
  if (!kategori)                             errors.push('kategori wajib diisi.');

  return errors;
};

module.exports = {
  validate,
  schemas: { pemesananSchema, koordinatSchema, artikelSchema },
};
