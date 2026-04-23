const validateEnv = () => {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`[CONFIG] Missing env vars: ${missing.join(', ')}`);
  }
};

module.exports = { validateEnv };
