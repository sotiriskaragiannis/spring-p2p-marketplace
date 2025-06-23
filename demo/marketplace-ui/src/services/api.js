const API_URL = 'http://localhost:8080';

// Helper function to handle fetch requests (simplified - no auth)
const fetchClient = async (endpoint, options = {}) => {
  // Add default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add mode credentials for CORS
  const config = {
    ...options,
    headers,
    mode: 'cors',
    credentials: 'include'
  };
  
  // Make request
  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  // Check if response is ok
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }
  
  // For DELETE requests or empty responses, don't try to parse JSON
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }
  
  // Return JSON response
  return response.json().catch(err => {
    console.warn('Failed to parse JSON response', err);
    return null;
  });
};

// Authentication related API calls
export const authAPI = {
  // Login user using proper auth endpoint
  login: (credentials) => fetchClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password
    })
  }),
  
  // Logout (if you implement it later)
  logout: () => fetchClient('/auth/logout', {
    method: 'POST'
  })
};

// User related API calls
export const userAPI = {
  // Register a new user
  register: (userData) => fetchClient('/users/', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  // Get user profile with better error handling
  getProfile: async (userId) => {
    try {
      return await fetchClient(`/users/${userId}`);
    } catch (err) {
      console.error(`Error fetching profile for user ${userId}:`, err);
      if (err.message.includes('404')) {
        // Clear invalid user data
        localStorage.removeItem('user');
      }
      throw err;
    }
  },
  
  // Update user profile
  updateProfile: (userId, userData) => fetchClient(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  
  // Get user items
  getUserItems: (userId) => fetchClient(`/users/${userId}/items/`),
  
  // Get user written reviews
  getWrittenReviews: (userId) => fetchClient(`/users/${userId}/writtenReviews/`),
  
  // Get user received reviews
  getReceivedReviews: (userId) => fetchClient(`/users/${userId}/receivedReviews/`),
  
  // Add item to favorites
  addToFavorites: (userId, itemId) => fetchClient(`/users/${userId}/favoriteItems/?item_id=${itemId}`, {
    method: 'POST'
  }),
  
  // Remove item from favorites
  removeFromFavorites: (userId, itemId) => fetchClient(`/users/${userId}/favoriteItems/?item_id=${itemId}`, {
    method: 'DELETE'
  }),
  
  // Get user favorite items
  getFavorites: (userId) => fetchClient(`/users/${userId}/favoriteItems/`),
  
  // Get all users (admin)
  getAllUsers: () => fetchClient('/users/')
};

// The rest of your API methods remain the same...
export const itemAPI = {
  // Get all items
  getAllItems: () => fetchClient('/items/'),
  
  // Get item by ID
  getItem: (itemId) => fetchClient(`/items/${itemId}`),
  
  // Create new item
  createItem: (itemData) => fetchClient('/items/', {
    method: 'POST',
    body: JSON.stringify(itemData)
  }),
  
  // Update item
  updateItem: (itemId, itemData) => fetchClient(`/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(itemData)
  }),
  
  // Delete item
  deleteItem: (itemId) => fetchClient(`/items/${itemId}`, {
    method: 'DELETE'
  }),
  
  // Upload image to item - FIXED TO MATCH JAVA BACKEND
  uploadImage: async (itemId, file) => {
    // Compress image if it's too large
    const compressedFile = await compressImageIfNeeded(file);
    
    const formData = new FormData();
    formData.append('image_file', compressedFile); // Backend expects 'image_file'
    
    try {
      const response = await fetch(`${API_URL}/items/${itemId}/images`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'include'
        // Don't set Content-Type header - let browser set it for FormData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
  
  // Remove image from item
  removeImage: (itemId, imageId) => fetchClient(`/items/${itemId}/images/${imageId}`, {
    method: 'DELETE'
  })
};

// Helper function to compress images if they're too large
const compressImageIfNeeded = (file) => {
  return new Promise((resolve) => {
    const maxSize = 2 * 1024 * 1024; // 2MB limit
    
    if (file.size <= maxSize) {
      resolve(file);
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions to reduce file size
      const maxWidth = 1200;
      const maxHeight = 1200;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        'image/jpeg',
        0.8 // Compression quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Review related API calls
const reviewAPI = {
  createReview: (reviewData) => {
    return fetchClient('/reviews/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData)
    });
  },
  
  getReviewsByUser: (userId) => 
    fetchClient(`/reviews/user/${userId}`),
  
  getReviewsForUser: (userId) => 
    fetchClient(`/reviews/for-user/${userId}`),
  
  updateReview: (reviewId, reviewData) => 
    fetchClient(`/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData)
    }),
  
  deleteReview: (reviewId) => 
    fetchClient(`/reviews/${reviewId}`, {
      method: 'DELETE'
    })
};

// Category related API calls
export const categoryAPI = {
  // Get all categories
  getAllCategories: () => fetchClient('/categories/')
};

// Image related API calls
const imageAPI = {
  // Get image by ID
  getImageUrl: (imageId) => `${API_URL}/images/${imageId}`,
  
  // Upload image to item - CORRECTED TO MATCH JAVA BACKEND
  uploadImage: async (itemId, file) => {
    const formData = new FormData();
    formData.append('image_file', file); // Backend expects 'image_file', not 'image'
    
    try {
      const response = await fetch(`${API_URL}/items/${itemId}/images`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it for FormData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
  
  // Remove image from item - CORRECTED TO MATCH JAVA BACKEND
  removeImage: (itemId, imageId) => fetchClient(`/items/${itemId}/images/${imageId}`, {
    method: 'DELETE'
  })
};

// Export a default API object with all services
export default {
  auth: authAPI,
  user: userAPI,
  item: itemAPI,
  category: categoryAPI,
  image: imageAPI,
  review: reviewAPI  // Make sure this is included in the export
};