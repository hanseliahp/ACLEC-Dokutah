'use strict';

/**
 * src/controllers/chatController.js
 * Controller for chat functionality
 */

const { getSupabaseClient } = require('../config/supabase');
const { successResponse, notFoundResponse, errorResponse } = require('../utils/responseHelper');

// Get all chat sessions for the authenticated user
const getChatSessions = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const userId = req.user?.id; // Assuming auth middleware sets req.user

    if (!userId) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .select(`
        id,
        doctor_id,
        status,
        created_at,
        updated_at,
        dokter (
          id_dokter,
          nama_dokter,
          spesialis,
          foto_profil_dokter
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    successResponse(res, 'Chat sessions retrieved', data);
  } catch (err) {
    next(err);
  }
};

// Start a new chat session with a doctor
const startChatSession = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const userId = req.user?.id;
    const { doctor_id } = req.body;

    if (!userId) {
      return errorResponse(res, 'Authentication required', 401);
    }

    if (!doctor_id) {
      return errorResponse(res, 'Doctor ID required', 400);
    }

    // Check if active session already exists
    const { data: existing } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('doctor_id', doctor_id)
      .eq('status', 'active')
      .single();

    if (existing) {
      return successResponse(res, 'Chat session already exists', { session_id: existing.id });
    }

    // Create new session
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        doctor_id: doctor_id,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    successResponse(res, 'Chat session started', data);
  } catch (err) {
    next(err);
  }
};

// Get messages for a session
const getMessages = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const userId = req.user?.id;
    const { session_id } = req.params;

    if (!userId) {
      return errorResponse(res, 'Authentication required', 401);
    }

    // Verify session belongs to user
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', session_id)
      .eq('user_id', userId)
      .single();

    if (!session) {
      return notFoundResponse(res, 'Chat session not found');
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', session_id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    successResponse(res, 'Messages retrieved', data);
  } catch (err) {
    next(err);
  }
};

// Send a message
const sendMessage = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const userId = req.user?.id;
    const { session_id, message } = req.body;

    if (!userId) {
      return errorResponse(res, 'Authentication required', 401);
    }

    if (!message || !session_id) {
      return errorResponse(res, 'Session ID and message required', 400);
    }

    // Verify session belongs to user
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', session_id)
      .eq('user_id', userId)
      .single();

    if (!session) {
      return notFoundResponse(res, 'Chat session not found');
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        session_id: session_id,
        sender_type: 'user',
        sender_id: userId,
        message: message
      })
      .select()
      .single();

    if (error) throw error;

    // Update session updated_at
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', session_id);

    successResponse(res, 'Message sent', data);
  } catch (err) {
    next(err);
  }
};

// Close chat session
const closeChatSession = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const userId = req.user?.id;
    const { session_id } = req.params;

    if (!userId) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ status: 'closed', updated_at: new Date().toISOString() })
      .eq('id', session_id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    successResponse(res, 'Chat session closed', data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getChatSessions,
  startChatSession,
  getMessages,
  sendMessage,
  closeChatSession
};

module.exports = {
  getChatSessions,
  startChatSession,
  getMessages,
  sendMessage,
  closeChatSession
};