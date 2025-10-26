// Neon Database Client for BigGrade
// This client connects to your Neon PostgreSQL database

const NEON_API_URL = import.meta.env.VITE_NEON_API_URL;

class NeonClient {
  constructor() {
    this.apiUrl = NEON_API_URL;
  }

  // Generic request handler
  async request(endpoint, method = 'GET', body = null) {
    if (!this.apiUrl) {
      console.error('❌ Neon API URL not configured! Set VITE_NEON_API_URL in environment variables.');
      throw new Error('Neon API URL not configured');
    }

    const url = `${this.apiUrl}/${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Neon API Error (${response.status}):`, errorText);
        throw new Error(`Neon API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Neon request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  auth = {
    async me() {
      try {
        return await neon.request('auth/me');
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        // Return mock user for development
        return {
          email: 'demo@biggrade.com',
          full_name: 'Demo User',
          user_type: 'student',
          avatar_url: '',
          theme: 'cyberpunk',
          is_setup_complete: false
        };
      }
    },

    async updateMe(data) {
      return await neon.request('auth/me', 'PUT', data);
    },

    async logout() {
      // Clear local storage and redirect
      localStorage.clear();
      window.location.href = '/';
    }
  };

  // Users
  users = {
    async list() {
      return await neon.request('users');
    },
    async get(id) {
      return await neon.request(`users/${id}`);
    },
    async create(data) {
      return await neon.request('users', 'POST', data);
    },
    async update(id, data) {
      return await neon.request(`users/${id}`, 'PUT', data);
    },
    async delete(id) {
      return await neon.request(`users/${id}`, 'DELETE');
    }
  };

  // Marketplace Requests
  marketplaceRequests = {
    async list(filters = {}) {
      const params = new URLSearchParams(filters);
      return await neon.request(`marketplace-requests?${params}`);
    },
    async get(id) {
      return await neon.request(`marketplace-requests/${id}`);
    },
    async create(data) {
      return await neon.request('marketplace-requests', 'POST', data);
    },
    async update(id, data) {
      return await neon.request(`marketplace-requests/${id}`, 'PUT', data);
    },
    async delete(id) {
      return await neon.request(`marketplace-requests/${id}`, 'DELETE');
    }
  };

  // Megathreads
  megathreads = {
    async list(filters = {}) {
      const params = new URLSearchParams(filters);
      return await neon.request(`megathreads?${params}`);
    },
    async get(id) {
      return await neon.request(`megathreads/${id}`);
    },
    async create(data) {
      return await neon.request('megathreads', 'POST', data);
    },
    async update(id, data) {
      return await neon.request(`megathreads/${id}`, 'PUT', data);
    },
    async delete(id) {
      return await neon.request(`megathreads/${id}`, 'DELETE');
    }
  };

  // Thread Replies
  threadReplies = {
    async list(threadId) {
      return await neon.request(`megathreads/${threadId}/replies`);
    },
    async create(threadId, data) {
      return await neon.request(`megathreads/${threadId}/replies`, 'POST', data);
    },
    async delete(id) {
      return await neon.request(`thread-replies/${id}`, 'DELETE');
    }
  };

  // Chat Messages
  chatMessages = {
    async list(filters = {}) {
      const params = new URLSearchParams(filters);
      return await neon.request(`chat-messages?${params}`);
    },
    async send(data) {
      return await neon.request('chat-messages', 'POST', data);
    },
    async markAsRead(id) {
      return await neon.request(`chat-messages/${id}/read`, 'PUT');
    }
  };

  // Global Chat
  globalChat = {
    async list(limit = 50) {
      return await neon.request(`global-chat?limit=${limit}`);
    },
    async send(data) {
      return await neon.request('global-chat', 'POST', data);
    }
  };

  // News Posts
  newsPosts = {
    async list() {
      return await neon.request('news-posts');
    },
    async get(id) {
      return await neon.request(`news-posts/${id}`);
    },
    async create(data) {
      return await neon.request('news-posts', 'POST', data);
    },
    async update(id, data) {
      return await neon.request(`news-posts/${id}`, 'PUT', data);
    },
    async delete(id) {
      return await neon.request(`news-posts/${id}`, 'DELETE');
    }
  };

  // Tutor Listings
  tutorListings = {
    async list(filters = {}) {
      const params = new URLSearchParams(filters);
      return await neon.request(`tutor-listings?${params}`);
    },
    async get(id) {
      return await neon.request(`tutor-listings/${id}`);
    },
    async create(data) {
      return await neon.request('tutor-listings', 'POST', data);
    },
    async update(id, data) {
      return await neon.request(`tutor-listings/${id}`, 'PUT', data);
    },
    async delete(id) {
      return await neon.request(`tutor-listings/${id}`, 'DELETE');
    }
  };

  // Session Notifications
  notifications = {
    async list(userEmail) {
      return await neon.request(`notifications?user_email=${userEmail}`);
    },
    async markAsRead(id) {
      return await neon.request(`notifications/${id}/read`, 'PUT');
    }
  };

  // Public User Directory
  directory = {
    async list(filters = {}) {
      const params = new URLSearchParams(filters);
      return await neon.request(`directory?${params}`);
    },
    async get(userEmail) {
      return await neon.request(`directory/${encodeURIComponent(userEmail)}`);
    },
    async update(userEmail, data) {
      return await neon.request(`directory/${encodeURIComponent(userEmail)}`, 'PUT', data);
    }
  };
}

// Export singleton instance
export const neon = new NeonClient();

// Export for debugging
if (import.meta.env.DEV) {
  window.neon = neon;
  console.log('🔧 Neon client loaded in development mode');
  console.log('API URL:', neon.apiUrl || '✗ Not configured');
}

