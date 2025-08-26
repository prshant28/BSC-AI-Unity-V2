
-- Enhanced Concerns Table (update existing)
ALTER TABLE concerns 
ADD COLUMN IF NOT EXISTS helpful_votes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS not_helpful_votes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general',
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS hidden_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS hidden_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS student_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS student_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_info VARCHAR(255);

-- Create Concern Replies Table
CREATE TABLE IF NOT EXISTS concern_replies (
    id SERIAL PRIMARY KEY,
    concern_id INTEGER REFERENCES concerns(id) ON DELETE CASCADE,
    reply_text TEXT NOT NULL,
    author VARCHAR(255) NOT NULL DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create User Votes Table (to track who voted what)
CREATE TABLE IF NOT EXISTS concern_votes (
    id SERIAL PRIMARY KEY,
    concern_id INTEGER REFERENCES concerns(id) ON DELETE CASCADE,
    user_identifier VARCHAR(255) NOT NULL, -- Could be IP, session ID, or user ID
    vote_type VARCHAR(20) NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(concern_id, user_identifier)
);

-- Add missing columns to existing tables
ALTER TABLE concern_votes ADD COLUMN IF NOT EXISTS user_session VARCHAR(255);
ALTER TABLE concern_replies ADD COLUMN IF NOT EXISTS author VARCHAR(255);
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create missing tables if they don't exist
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    subject_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Analytics Table for tracking system usage
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    user_identifier VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_concern_replies_concern_id ON concern_replies(concern_id);
CREATE INDEX IF NOT EXISTS idx_concern_votes_concern_id ON concern_votes(concern_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE concern_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE concern_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Allow read/write for now, adjust as needed)
CREATE POLICY "Allow all operations on concern_replies" ON concern_replies FOR ALL USING (true);
CREATE POLICY "Allow all operations on concern_votes" ON concern_votes FOR ALL USING (true);
CREATE POLICY "Allow all operations on analytics_events" ON analytics_events FOR ALL USING (true);

-- Update existing tables with better structure if needed
-- Add indexes to existing tables for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_responses_subject_name ON quiz_responses(subject_name);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_quiz_title ON quiz_responses(quiz_title);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_timestamp ON quiz_responses(timestamp);
CREATE INDEX IF NOT EXISTS idx_quizzes_subject_name ON quizzes(subject_name);
CREATE INDEX IF NOT EXISTS idx_quizzes_quiz_title ON quizzes(quiz_title);
CREATE INDEX IF NOT EXISTS idx_concerns_status ON concerns(status);
CREATE INDEX IF NOT EXISTS idx_concerns_category ON concerns(category);
CREATE INDEX IF NOT EXISTS idx_concerns_created_at ON concerns(created_at);
