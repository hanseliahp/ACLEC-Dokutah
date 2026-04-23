const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Users endpoint (from original server.js)
router.get('/users', async (req, res) => {
  try {
    const { getSupabase } = require('../config/supabase');
    const supabase = getSupabase();

    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not connected' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Articles endpoints
router.get('/articles', async (req, res) => {
  try {
    const { getSupabase } = require('../config/supabase');
    const supabase = getSupabase();

    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not connected' });
    }

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/articles/:id', async (req, res) => {
  try {
    const { getSupabase } = require('../config/supabase');
    const supabase = getSupabase();

    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not connected' });
    }

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/articles', async (req, res) => {
  try {
    const { getSupabase } = require('../config/supabase');
    const supabase = getSupabase();

    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not connected' });
    }

    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title,
        content,
        category: category || 'Umum',
        created_at: new Date().toISOString(),
      }])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/articles/:id', async (req, res) => {
  try {
    const { getSupabase } = require('../config/supabase');
    const supabase = getSupabase();

    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not connected' });
    }

    const { title, content, category } = req.body;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('articles')
      .update({ title, content, category, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/articles/:id', async (req, res) => {
  try {
    const { getSupabase } = require('../config/supabase');
    const supabase = getSupabase();

    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not connected' });
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
