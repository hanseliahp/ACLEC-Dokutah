'use strict';

/**
 * src/controllers/chatController.js
 * Controller for chat functionality
 */

const { getSupabaseClient } = require('../config/supabase');
const { successResponse, notFoundResponse, errorResponse } = require('../utils/responseHelper');

// Get demo chat session (no auth required)
const getDemoChatSession = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();

    // Create demo session if not exists
    const demoSessionId = 'demo-session-001';
    const demoDoctorId = 999; // Demo doctor ID

    // Check if demo session exists
    let { data: existingSession } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', demoSessionId)
      .single();

    if (!existingSession) {
      // Create demo session
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          id: demoSessionId,
          user_id: 'demo-user', // Demo user
          doctor_id: demoDoctorId,
          status: 'active'
        })
        .select()
        .single();

      if (error && !error.message.includes('duplicate key')) throw error;
      existingSession = data;
    }

    // Return demo session with fake doctor data
    const demoSession = {
      id: demoSessionId,
      doctor_id: demoDoctorId,
      status: 'active',
      created_at: existingSession?.created_at || new Date().toISOString(),
      updated_at: existingSession?.updated_at || new Date().toISOString(),
      dokter: {
        id_dokter: demoDoctorId,
        nama_dokter: 'Dr. Demo AI',
        spesialis: 'Kesehatan Umum',
        foto_profil_dokter: 'https://via.placeholder.com/100x100?text=Dr+Demo'
      }
    };

    successResponse(res, 'Demo chat session retrieved', [demoSession]);
  } catch (err) {
    next(err);
  }
};

// Get demo messages
const getDemoMessages = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const demoSessionId = 'demo-session-001';

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', demoSessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    successResponse(res, 'Demo messages retrieved', data || []);
  } catch (err) {
    next(err);
  }
};

// Send demo message
const sendDemoMessage = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const demoSessionId = 'demo-session-001';
    const { message } = req.body;

    if (!message) {
      return errorResponse(res, 'Message required', 400);
    }

    // Insert user message
    const { data: userMessage, error: userError } = await supabase
      .from('messages')
      .insert({
        session_id: demoSessionId,
        sender_type: 'user',
        sender_id: 'demo-user',
        message: message
      })
      .select()
      .single();

    if (userError) throw userError;

    // Generate AI response (simple demo responses)
    const responses = [
      'Halo! Saya Dr. Demo AI. Bagaimana saya bisa membantu Anda hari ini?',
      'Baik, saya mengerti keluhan Anda. Apakah Anda memiliki gejala lain?',
      'Untuk kesehatan yang optimal, disarankan makan teratur dan olahraga rutin.',
      'Jika gejala memburuk, segera konsultasi ke dokter terdekat.',
      'Apakah Anda sudah minum obat sesuai anjuran?',
      'Istirahat yang cukup sangat penting untuk pemulihan.',
      'Apakah ada riwayat penyakit keluarga yang perlu saya ketahui?'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Insert AI response after a short delay (simulated)
    setTimeout(async () => {
      try {
        await supabase
          .from('messages')
          .insert({
            session_id: demoSessionId,
            sender_type: 'doctor',
            sender_id: 'demo-doctor',
            message: randomResponse
          });
      } catch (err) {
        console.error('Error inserting demo response:', err);
      }
    }, 1000 + Math.random() * 2000); // 1-3 second delay

    successResponse(res, 'Demo message sent', userMessage);
  } catch (err) {
    next(err);
  }
};

// Get user chat sessions
const getUserChatSessions = async (req, res, next) => {
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
  getChatSessions: getUserChatSessions,
  startChatSession,
  getMessages,
  sendMessage,
  closeChatSession,
  getDemoChatSession,
  getDemoMessages,
  sendDemoMessage
};