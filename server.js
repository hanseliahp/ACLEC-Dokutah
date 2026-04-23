'use strict';

require('dotenv').config();

const path    = require('path');
const http    = require('http');
const express = require('express');
const cors    = require('cors');

const { validateEnv }     = require('./src/config/env');
const apiRoutes            = require('./src/routes/index');
const { errorHandler }    = require('./src/middleware/errorHandler');
const { requestLogger }   = require('./src/middleware/logger');
const { connectSupabase } = require('./src/config/supabase');

validateEnv();

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin:         process.env.CORS_ORIGIN || '*',
  methods:        ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);
app.use(errorHandler);

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectSupabase();
  } catch (err) {
    // Don't exit on API key or connection errors - tables might not exist yet
    console.warn('[SERVER] Supabase warning:', err.message);
    console.warn('[SERVER] Server will continue without Supabase, but API endpoints may fail.');
  }

  server.listen(PORT, () => {
    console.log(`\n✅ Server running at http://localhost:${PORT}`);
    console.log(`📁 Static files from /public`);
    console.log(`🌐 APIs at http://localhost:${PORT}/api`);
    console.log(`📝 Article Editor: http://localhost:${PORT}/article-editor.html`);
    console.log(`🏠 Homepage: http://localhost:${PORT}\n`);
  });
};

startServer();

const shutdown = (signal) => {
  console.log(`\n[SERVER] Received ${signal}, shutting down...`);
  server.close(() => {
    console.log('[SERVER] Closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));