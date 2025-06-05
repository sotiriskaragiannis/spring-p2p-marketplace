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

// User related API calls
export const userAPI = {
  // Register a new user
  register: (userData) => fetchClient('/users/', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  // Login user
  login: (credentials) => fetchClient('/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
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
  
  // Upload image to item
  uploadImage: (itemId, imageFile) => {
    const formData = new FormData();
    formData.append('image_file', imageFile);
    
    return fetch(`${API_URL}/items/${itemId}/images`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
      // No Content-Type header for multipart/form-data
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    });
  },
  
  // Remove image from item
  removeImage: (itemId, imageId) => fetchClient(`/items/${itemId}/images/${imageId}`, {
    method: 'DELETE'
  })
};

// Keep the remaining API objects as they are
export const reviewAPI = {
  // Get all reviews
  getAllReviews: () => fetchClient('/reviews/'),
  
  // Get review by ID
  getReview: (reviewId) => fetchClient(`/reviews/${reviewId}`),
  
  // Create review
  createReview: (reviewData) => fetchClient('/reviews/', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  }),
  
  // Update review
  updateReview: (reviewId, reviewData) => fetchClient(`/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData)
  }),
  
  // Delete review
  deleteReview: (reviewId) => fetchClient(`/reviews/${reviewId}`, {
    method: 'DELETE'
  })
};

// Category related API calls
export const categoryAPI = {
  // Get all categories
  getAllCategories: () => fetchClient('/categories/')
};

// Image related API calls
export const imageAPI = {
  // Get image URL (direct URL construction without fetch)
  getImageUrl: (imageId) => `${API_URL}/images/${imageId}`,
  
  // Upload image to item (using FormData properly)
  uploadImage: (itemId, imageFile) => {
    const formData = new FormData();
    formData.append('image_file', imageFile);
    
    return fetch(`${API_URL}/items/${itemId}/images`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
      // No Content-Type header for multipart/form-data
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    });
  },
  
  // Remove image from item
  removeImage: (itemId, imageId) => fetchClient(`/items/${itemId}/images/${imageId}`, {
    method: 'DELETE'
  })
};

// Export a default API object with all services
const api = {
  user: userAPI,
  item: itemAPI,
  review: reviewAPI,
  category: categoryAPI,
  image: imageAPI
};

export default api;