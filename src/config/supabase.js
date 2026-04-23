const { createClient } = require('@supabase/supabase-js');

let supabase = null;

const connectSupabase = async () => {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Missing Supabase credentials in .env');
    }

    supabase = createClient(url, key);
    console.log('[SUPABASE] Connected successfully');
    return supabase;
  } catch (err) {
    console.error('[SUPABASE] Connection failed:', err.message);
    throw err;
  }
};

const getSupabase = () => supabase;

module.exports = { connectSupabase, getSupabase };
