// supabase configuration
'use strict';

/**
 * src/config/supabase.js
 * Inisialisasi Supabase client untuk REST API dan realtime features.
 *
 * Konsep JS yang diterapkan:
 * - Singleton: hanya satu instance client
 * - Lazy initialization: client dibuat saat pertama kali diakses
 * - Environment variables: dari .env atau Railway
 */

const fs = require('fs');
if (fs.existsSync('.env')) {
  require('dotenv').config();
}
const { createClient } = require('@supabase/supabase-js');

let _supabaseClient = null;

/**
 * Membuat Supabase client dengan credentials dari environment variables.
 *
 * @returns {SupabaseClient} instance Supabase client
 * @throws {Error} jika credentials tidak tersedia
 */
const createSupabaseClient = () => {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY } = process.env;

  if (!SUPABASE_URL) {
    throw new Error('Missing SUPABASE_URL in environment variables.');
  }

  // Server-side: gunakan service role key agar bypass RLS dan bisa akses semua tabel.
  // Anon key hanya untuk client-side (browser). Kalau service role tidak ada, fallback ke anon.
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      'Missing Supabase key. Set SUPABASE_SERVICE_ROLE_KEY (recommended) or SUPABASE_ANON_KEY in .env'
    );
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[Supabase] ⚠️  SERVICE_ROLE_KEY tidak ditemukan, fallback ke ANON_KEY. RLS mungkin memblokir akses tabel.');
  }

  return createClient(SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
  });
};

/**
 * Membuat Supabase admin client dengan service role key.
 * Gunakan untuk operasi di server yang memerlukan privilege tinggi.
 *
 * @returns {SupabaseClient} instance Supabase admin client
 * @throws {Error} jika credentials tidak tersedia
 */
const createSupabaseAdminClient = () => {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Missing Supabase admin credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env'
    );
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
};

/**
 * getSupabaseClient — mengembalikan instance client yang sudah dibuat.
 * Implementasi Singleton dengan lazy initialization.
 *
 * @returns {SupabaseClient}
 */
const getSupabaseClient = () => {
  if (!_supabaseClient) {
    _supabaseClient = createSupabaseClient();
    console.log('[Supabase] Client initialized successfully');
  }
  return _supabaseClient;
};

/**
 * connectSupabase — menginisialisasi client dan test koneksi.
 * Dipanggil SEKALI saat server.js start.
 *
 * @returns {Promise<void>}
 */
const connectSupabase = async () => {
  try {
    const client = getSupabaseClient();

    // Test multiple key tables: dokter and artikel
    const tablesToTest = ['dokter', 'artikel'];
    
    for (const table of tablesToTest) {
      try {
        const { error: testError } = await client
          .from(table)
          .select('id_*')  // Generic ID column
          .limit(1);
        
        if (testError && testError.code === 'PGRST116') {  // Table does not exist
          console.warn(`[Supabase] ⚠️  Table '${table}' not found (PGRST116). Server continues.`);
        } else if (testError) {
          console.error(`[Supabase] Test '${table}' error:`, testError.message);
        }
      } catch (testErr) {
        console.warn(`[Supabase] Test '${table}' failed:`, testErr.message);
      }
    }
    
    console.log('[Supabase] Koneksi berhasil — some tables may need setup ✓');
  } catch (err) {
    // Jangan crash server, cukup log warning
    if (err.code === 'PGRST205') return;
    console.error('[Supabase] Failed to connect:', err.message);
    throw err;
  }
};

module.exports = {
  getSupabaseClient,
  createSupabaseAdminClient,
  connectSupabase,
};
