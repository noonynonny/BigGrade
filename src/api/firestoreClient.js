// Firestore Database Client
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { auth } from '../config/firebase';

// Get Firestore instance
const db = getFirestore();

// Helper function to get current user
const getCurrentUser = () => {
  const user = auth.currentUser;
  if (!user) {
    console.warn('No authenticated user');
    return null;
  }
  return user;
};

// Firestore Client
export const firestore = {
  // Users
  users: {
    async create(userData) {
      const user = getCurrentUser();
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...userData };
    },

    async get(userId) {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    },

    async getByEmail(email) {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    },

    async update(userId, updates) {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { id: userId, ...updates };
    },

    async list() {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  // Marketplace Requests
  marketplaceRequests: {
    async create(requestData) {
      const user = getCurrentUser();
      const docRef = await addDoc(collection(db, 'marketplaceRequests'), {
        ...requestData,
        authorEmail: user?.email || requestData.authorEmail,
        authorName: user?.displayName || requestData.authorName,
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...requestData };
    },

    async get(requestId) {
      const docRef = doc(db, 'marketplaceRequests', requestId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    },

    async list(filters = {}) {
      let q = collection(db, 'marketplaceRequests');
      
      if (filters.requestType) {
        q = query(q, where('requestType', '==', filters.requestType));
      }
      if (filters.subject) {
        q = query(q, where('subject', '==', filters.subject));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async update(requestId, updates) {
      const docRef = doc(db, 'marketplaceRequests', requestId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { id: requestId, ...updates };
    },

    async delete(requestId) {
      const docRef = doc(db, 'marketplaceRequests', requestId);
      await deleteDoc(docRef);
      return { id: requestId };
    }
  },

  // Megathreads
  megathreads: {
    async create(threadData) {
      const user = getCurrentUser();
      const docRef = await addDoc(collection(db, 'megathreads'), {
        ...threadData,
        authorEmail: user?.email || threadData.authorEmail,
        authorName: user?.displayName || threadData.authorName,
        replyCount: 0,
        viewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...threadData };
    },

    async get(threadId) {
      const docRef = doc(db, 'megathreads', threadId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    },

    async list(filters = {}) {
      let q = collection(db, 'megathreads');
      
      if (filters.authorType) {
        q = query(q, where('authorType', '==', filters.authorType));
      }
      if (filters.subject) {
        q = query(q, where('subject', '==', filters.subject));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async update(threadId, updates) {
      const docRef = doc(db, 'megathreads', threadId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { id: threadId, ...updates };
    },

    async delete(threadId) {
      const docRef = doc(db, 'megathreads', threadId);
      await deleteDoc(docRef);
      return { id: threadId };
    }
  },

  // Thread Replies
  threadReplies: {
    async create(replyData) {
      const user = getCurrentUser();
      const docRef = await addDoc(collection(db, 'threadReplies'), {
        ...replyData,
        authorEmail: user?.email || replyData.authorEmail,
        authorName: user?.displayName || replyData.authorName,
        createdAt: serverTimestamp()
      });
      
      // Increment reply count on parent thread
      if (replyData.threadId) {
        const threadRef = doc(db, 'megathreads', replyData.threadId);
        const threadSnap = await getDoc(threadRef);
        if (threadSnap.exists()) {
          await updateDoc(threadRef, {
            replyCount: (threadSnap.data().replyCount || 0) + 1,
            updatedAt: serverTimestamp()
          });
        }
      }
      
      return { id: docRef.id, ...replyData };
    },

    async getByThread(threadId) {
      const q = query(
        collection(db, 'threadReplies'),
        where('threadId', '==', threadId),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async delete(replyId) {
      const docRef = doc(db, 'threadReplies', replyId);
      await deleteDoc(docRef);
      return { id: replyId };
    }
  },

  // Chat Messages
  chatMessages: {
    async create(messageData) {
      const user = getCurrentUser();
      const docRef = await addDoc(collection(db, 'chatMessages'), {
        ...messageData,
        senderEmail: user?.email || messageData.senderEmail,
        senderName: user?.displayName || messageData.senderName,
        read: false,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...messageData };
    },

    async getConversation(user1Email, user2Email) {
      const q = query(
        collection(db, 'chatMessages'),
        where('participants', 'array-contains-any', [user1Email, user2Email]),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async markAsRead(messageId) {
      const docRef = doc(db, 'chatMessages', messageId);
      await updateDoc(docRef, { read: true });
      return { id: messageId };
    }
  },

  // Global Chat
  globalChat: {
    async create(messageData) {
      const user = getCurrentUser();
      const docRef = await addDoc(collection(db, 'globalChatMessages'), {
        ...messageData,
        senderEmail: user?.email || messageData.senderEmail,
        senderName: user?.displayName || messageData.senderName,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...messageData };
    },

    async list(limitCount = 50) {
      const q = query(
        collection(db, 'globalChatMessages'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
    }
  },

  // News Posts
  newsPosts: {
    async create(postData) {
      const user = getCurrentUser();
      const docRef = await addDoc(collection(db, 'newsPosts'), {
        ...postData,
        authorEmail: user?.email || postData.authorEmail,
        authorName: user?.displayName || postData.authorName,
        published: postData.published || false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...postData };
    },

    async list(publishedOnly = true) {
      let q = collection(db, 'newsPosts');
      
      if (publishedOnly) {
        q = query(q, where('published', '==', true));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async update(postId, updates) {
      const docRef = doc(db, 'newsPosts', postId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { id: postId, ...updates };
    }
  },

  // Tutor Listings
  tutorListings: {
    async create(listingData) {
      const user = getCurrentUser();
      const docRef = await addDoc(collection(db, 'tutorListings'), {
        ...listingData,
        tutorEmail: user?.email || listingData.tutorEmail,
        tutorName: user?.displayName || listingData.tutorName,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...listingData };
    },

    async list(filters = {}) {
      let q = collection(db, 'tutorListings');
      
      q = query(q, where('active', '==', true));
      
      if (filters.subject) {
        q = query(q, where('subjects', 'array-contains', filters.subject));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async update(listingId, updates) {
      const docRef = doc(db, 'tutorListings', listingId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { id: listingId, ...updates };
    }
  },

  // Notifications
  notifications: {
    async create(notificationData) {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notificationData,
        read: false,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...notificationData };
    },

    async getForUser(userEmail) {
      const q = query(
        collection(db, 'notifications'),
        where('recipientEmail', '==', userEmail),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async markAsRead(notificationId) {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, { read: true });
      return { id: notificationId };
    }
  },

  // Directory
  directory: {
    async list(userType = null) {
      let q = collection(db, 'users');
      
      if (userType) {
        q = query(q, where('userType', '==', userType));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  }
};

// Export db instance for advanced usage
export { db };

console.log('🔥 Firestore client loaded successfully');

