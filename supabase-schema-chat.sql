-- Chat Feature Schema Patch for ACLEC Dokutah
-- Add these tables to your Supabase database

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id INTEGER REFERENCES dokter(id_dokter) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, doctor_id, status) -- Prevent multiple active chats between same user-doctor
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_type TEXT CHECK (sender_type IN ('user', 'doctor')) NOT NULL,
  sender_id UUID, -- For user, or doctor_id if doctor
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_doctor ON chat_sessions(doctor_id);
CREATE INDEX idx_messages_session ON messages(session_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- RLS Policies
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own chat sessions" ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create chat sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own chat sessions" ON chat_sessions FOR UPDATE USING (auth.uid() = user_id);

-- For doctors, assume they have user accounts too, or adjust accordingly
-- For simplicity, allow authenticated users to read/write messages in their sessions
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in own sessions" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_sessions cs
    WHERE cs.id = messages.session_id AND cs.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert messages in own sessions" ON messages FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM chat_sessions cs
    WHERE cs.id = messages.session_id AND cs.user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE
  ON chat_sessions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();