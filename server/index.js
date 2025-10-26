// BigGrade API Server
// Connects React frontend to Neon PostgreSQL database

import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'BigGrade API is running' });
});

// ============================================
// USERS
// ============================================
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { email, full_name, user_type, avatar_url, theme } = req.body;
    const result = await pool.query(
      'INSERT INTO users (email, full_name, user_type, avatar_url, theme) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, full_name, user_type, avatar_url, theme]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// MARKETPLACE REQUESTS
// ============================================
app.get('/api/marketplace-requests', async (req, res) => {
  try {
    const { status, subject, author_email } = req.query;
    let query = 'SELECT * FROM marketplace_requests WHERE 1=1';
    const params = [];
    
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (subject) {
      params.push(subject);
      query += ` AND subject = $${params.length}`;
    }
    if (author_email) {
      params.push(author_email);
      query += ` AND author_email = $${params.length}`;
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/marketplace-requests', async (req, res) => {
  try {
    const {
      request_type, help_from, author_email, author_name, author_avatar_url,
      title, description, subject, compensation_type, offered_price
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO marketplace_requests 
       (request_type, help_from, author_email, author_name, author_avatar_url, 
        title, description, subject, compensation_type, offered_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [request_type, help_from, author_email, author_name, author_avatar_url,
       title, description, subject, compensation_type, offered_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// MEGATHREADS
// ============================================
app.get('/api/megathreads', async (req, res) => {
  try {
    const { author_type, subject } = req.query;
    let query = 'SELECT * FROM megathreads WHERE 1=1';
    const params = [];
    
    if (author_type) {
      params.push(author_type);
      query += ` AND author_type = $${params.length}`;
    }
    if (subject) {
      params.push(subject);
      query += ` AND subject = $${params.length}`;
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/megathreads', async (req, res) => {
  try {
    const { title, content, author_type, author_name, subject } = req.body;
    const result = await pool.query(
      'INSERT INTO megathreads (title, content, author_type, author_name, subject) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, content, author_type, author_name, subject]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// THREAD REPLIES
// ============================================
app.get('/api/megathreads/:threadId/replies', async (req, res) => {
  try {
    const { threadId } = req.params;
    const result = await pool.query(
      'SELECT * FROM thread_replies WHERE thread_id = $1 ORDER BY created_at ASC',
      [threadId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/megathreads/:threadId/replies', async (req, res) => {
  try {
    const { threadId } = req.params;
    const { author_email, author_name, author_avatar_url, content } = req.body;
    const result = await pool.query(
      'INSERT INTO thread_replies (thread_id, author_email, author_name, author_avatar_url, content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [threadId, author_email, author_name, author_avatar_url, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CHAT MESSAGES
// ============================================
app.get('/api/chat-messages', async (req, res) => {
  try {
    const { sender_email, receiver_email } = req.query;
    let query = 'SELECT * FROM chat_messages WHERE 1=1';
    const params = [];
    
    if (sender_email) {
      params.push(sender_email);
      query += ` AND sender_email = $${params.length}`;
    }
    if (receiver_email) {
      params.push(receiver_email);
      query += ` AND receiver_email = $${params.length}`;
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat-messages', async (req, res) => {
  try {
    const { sender_email, sender_name, receiver_email, receiver_name, message } = req.body;
    const result = await pool.query(
      'INSERT INTO chat_messages (sender_email, sender_name, receiver_email, receiver_name, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [sender_email, sender_name, receiver_email, receiver_name, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GLOBAL CHAT
// ============================================
app.get('/api/global-chat', async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const result = await pool.query(
      'SELECT * FROM global_chat_messages ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/global-chat', async (req, res) => {
  try {
    const { author_email, author_name, author_avatar_url, message } = req.body;
    const result = await pool.query(
      'INSERT INTO global_chat_messages (author_email, author_name, author_avatar_url, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [author_email, author_name, author_avatar_url, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// NEWS POSTS
// ============================================
app.get('/api/news-posts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM news_posts WHERE published = true ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/news-posts', async (req, res) => {
  try {
    const { title, content, author_email, author_name, published } = req.body;
    const result = await pool.query(
      'INSERT INTO news_posts (title, content, author_email, author_name, published) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, content, author_email, author_name, published || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// TUTOR LISTINGS
// ============================================
app.get('/api/tutor-listings', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tutor_listings ORDER BY rating DESC, total_sessions DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tutor-listings', async (req, res) => {
  try {
    const { tutor_email, tutor_name, tutor_avatar_url, subjects, bio, hourly_rate, availability } = req.body;
    const result = await pool.query(
      'INSERT INTO tutor_listings (tutor_email, tutor_name, tutor_avatar_url, subjects, bio, hourly_rate, availability) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [tutor_email, tutor_name, tutor_avatar_url, subjects, bio, hourly_rate, availability]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PUBLIC USER DIRECTORY
// ============================================
app.get('/api/directory', async (req, res) => {
  try {
    const { user_type } = req.query;
    let query = 'SELECT * FROM public_user_directory WHERE visible = true';
    const params = [];
    
    if (user_type) {
      params.push(user_type);
      query += ` AND user_type = $${params.length}`;
    }
    
    query += ' ORDER BY display_name ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BigGrade API server running on port ${PORT}`);
  console.log(`📊 Connected to Neon database`);
});

