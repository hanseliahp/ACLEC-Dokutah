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
  closeChatSession
} = require('../controller/chatController');

const { authenticate } = require('../middleware/auth');

// All routes require authentication
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