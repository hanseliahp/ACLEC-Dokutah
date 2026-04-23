'use strict';

/**
 * src/routes/chatRoutes.js
 * Routes for chat functionality
 */

const { Router } = require('express');
const router = Router();
const {
  getChatSessions,
  startChatSession,
  getMessages,
  sendMessage,
  closeChatSession,
  getDemoChatSession,
  getDemoMessages,
  sendDemoMessage
} = require('../controller/chatController');

const { authenticate } = require('../middleware/auth');

// Demo chat routes (no auth required) - BEFORE auth middleware
router.get('/demo/sessions', getDemoChatSession);
router.get('/demo/messages', getDemoMessages);
router.post('/demo/messages', sendDemoMessage);

// All routes below require authentication
router.use(authenticate);

// Get all chat sessions for user
router.get('/sessions', getChatSessions);

// Start new chat session
router.post('/sessions', startChatSession);

// Get messages for a session
router.get('/sessions/:session_id/messages', getMessages);

// Send message
router.post('/messages', sendMessage);

// Close chat session
router.put('/sessions/:session_id/close', closeChatSession);

module.exports = router;

module.exports = router;