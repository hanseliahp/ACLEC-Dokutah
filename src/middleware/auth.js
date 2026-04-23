'use strict';

/**
 * src/middleware/auth.js
 * Authentication middleware using Supabase
 */

const { getSupabaseClient } = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const supabase = getSupabaseClient();

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

module.exports = { authenticate };