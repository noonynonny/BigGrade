-- BigGrade Database Schema for Neon PostgreSQL
-- Created: October 26, 2025

-- Users table (extends authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    user_type VARCHAR(50) CHECK (user_type IN ('student', 'tutor', 'admin')),
    avatar_url TEXT,
    theme VARCHAR(50) DEFAULT 'cyberpunk',
    is_setup_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Marketplace Requests
CREATE TABLE marketplace_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type VARCHAR(50) CHECK (request_type IN ('help_wanted', 'offering_help')),
    help_from VARCHAR(50),
    author_email VARCHAR(255) NOT NULL,
    author_name VARCHAR(255),
    author_avatar_url TEXT,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    subject VARCHAR(100),
    compensation_type VARCHAR(50) CHECK (compensation_type IN ('paid', 'free', 'exchange')),
    offered_price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
    responder_email VARCHAR(255),
    responder_name VARCHAR(255),
    session_start_time TIMESTAMP,
    session_end_time TIMESTAMP,
    session_duration_minutes INTEGER,
    session_force_started BOOLEAN DEFAULT false,
    session_ended_by_email VARCHAR(255),
    session_ended_by_name VARCHAR(255),
    meeting_link TEXT,
    link_confirmed BOOLEAN DEFAULT false,
    payment_instructions TEXT,
    payment_instructions_sent BOOLEAN DEFAULT false,
    student_paid BOOLEAN DEFAULT false,
    tutor_confirmed_payment BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Megathreads (Discussion threads)
CREATE TABLE megathreads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    content TEXT,
    author_type VARCHAR(50) CHECK (author_type IN ('student', 'tutor', 'admin')),
    author_name VARCHAR(255),
    subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Thread Replies
CREATE TABLE thread_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES megathreads(id) ON DELETE CASCADE,
    author_email VARCHAR(255) NOT NULL,
    author_name VARCHAR(255),
    author_avatar_url TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat Messages (Direct messages)
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    receiver_email VARCHAR(255) NOT NULL,
    receiver_name VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Global Chat Messages
CREATE TABLE global_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_email VARCHAR(255) NOT NULL,
    author_name VARCHAR(255),
    author_avatar_url TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Session Chat (Chat within active sessions)
CREATE TABLE session_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID,
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- News Posts
CREATE TABLE news_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    content TEXT,
    author_email VARCHAR(255) NOT NULL,
    author_name VARCHAR(255),
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Session Notifications
CREATE TABLE session_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    notification_type VARCHAR(100),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_session_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tutor Listings
CREATE TABLE tutor_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_email VARCHAR(255) NOT NULL,
    tutor_name VARCHAR(255),
    tutor_avatar_url TEXT,
    subjects TEXT[],
    bio TEXT,
    hourly_rate DECIMAL(10, 2),
    availability TEXT,
    rating DECIMAL(3, 2),
    total_sessions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Student Endorsements
CREATE TABLE student_endorsements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_email VARCHAR(255) NOT NULL,
    tutor_email VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vouches (User recommendations)
CREATE TABLE vouches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_email VARCHAR(255) NOT NULL,
    voucher_name VARCHAR(255),
    vouchee_email VARCHAR(255) NOT NULL,
    vouchee_name VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Public User Directory
CREATE TABLE public_user_directory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    user_type VARCHAR(50) CHECK (user_type IN ('student', 'tutor')),
    subjects_interested TEXT[],
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_marketplace_status ON marketplace_requests(status);
CREATE INDEX idx_marketplace_author ON marketplace_requests(author_email);
CREATE INDEX idx_chat_receiver ON chat_messages(receiver_email);
CREATE INDEX idx_chat_sender ON chat_messages(sender_email);
CREATE INDEX idx_thread_replies_thread ON thread_replies(thread_id);
CREATE INDEX idx_notifications_user ON session_notifications(user_email);
CREATE INDEX idx_tutor_listings_email ON tutor_listings(tutor_email);

