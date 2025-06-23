import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewModal from '../components/marketplace/ReviewModal';
import ItemModal from '../components/marketplace/ItemModal';
import DeleteConfirmation from '../components/marketplace/DeleteConfirmation';
import api from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [userNames, setUserNames] = useState({}); // Cache for user names
  const [categories, setCategories] = useState({}); // Categories for item editing
  
  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewModalMode, setReviewModalMode] = useState('create'); // 'create', 'edit', 'delete'
  const [selectedReview, setSelectedReview] = useState(null);
  
  // Item modal states
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemModalMode, setItemModalMode] = useState('create'); // 'create' or 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    let userData;
    try {
      userData = JSON.parse(storedUser);
      if (!userData || !userData.id) {
        throw new Error('Invalid user data');
      }
      setUser(userData);
      setFormData({
        username: userData.username || '',
        full_name: userData.full_name || '',
        email: userData.email || '',
        bio: userData.bio || '',
        country: userData.country || '',
        city: userData.city || '',
        phone_number: userData.phone_number || ''
      });
    } catch (err) {
      console.error('Error parsing stored user data:', err);
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }
    
    // Fetch user data from API
    fetchUserData(userData);
  }, [navigate]);

  const fetchUserData = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch categories first for item editing
      try {
        const categoriesData = await api.category.getAllCategories();
        const categoriesMap = {};
        categoriesData.forEach(category => {
          categoriesMap[category.id] = category;
        });
        setCategories(categoriesMap);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
      
      // Fetch detailed user profile
      try {
        const userProfile = await api.user.getProfile(userData.id);
        setUser(prev => ({ ...prev, ...userProfile }));
        setFormData({
          username: userProfile.username || '',
          full_name: userProfile.full_name || '',
          email: userProfile.email || '',
          bio: userProfile.bio || '',
          country: userProfile.country || '',
          city: userProfile.city || '',
          phone_number: userProfile.phone_number || ''
        });
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Could not load your profile. Please try logging in again.');
      }
      
      // Fetch user items with error handling
      try {
        const items = await api.user.getUserItems(userData.id);
        setUserItems(items);
      } catch (err) {
        console.error('Error fetching user items:', err);
        setUserItems([]);
      }
      
      // Fetch favorite items with error handling
      try {
        const favorites = await api.user.getFavorites(userData.id);
        setFavoriteItems(favorites);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setFavoriteItems([]);
      }
      
      // Fetch reviews with error handling
      try {
        const received = await api.user.getReceivedReviews(userData.id);
        setReceivedReviews(received);
        
        // Fetch reviewer names for received reviews
        const reviewerIds = [...new Set(received.map(review => review.reviewer_id))];
        await fetchUserNames(reviewerIds);
      } catch (err) {
        console.error('Error fetching received reviews:', err);
        setReceivedReviews([]);
      }
      
      try {
        const written = await api.user.getWrittenReviews(userData.id);
        setWrittenReviews(written);
        
        // Fetch reviewee names for written reviews
        const revieweeIds = [...new Set(written.map(review => review.reviewee_id))];
        await fetchUserNames(revieweeIds);
      } catch (err) {
        console.error('Error fetching written reviews:', err);
        setWrittenReviews([]);
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch user names and cache them
  const fetchUserNames = async (userIds) => {
    try {
      const newUserNames = {};
      const promises = userIds.map(async (userId) => {
        if (!userNames[userId]) { // Only fetch if not already cached
          try {
            const userProfile = await api.user.getProfile(userId);
            newUserNames[userId] = {
              username: userProfile.username,
              full_name: userProfile.full_name
            };
          } catch (err) {
            console.error(`Error fetching user ${userId}:`, err);
            newUserNames[userId] = {
              username: 'Unknown User',
              full_name: 'Unknown User'
            };
          }
        }
      });
      
      await Promise.all(promises);
      setUserNames(prev => ({ ...prev, ...newUserNames }));
    } catch (error) {
      console.error('Error fetching user names:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Reset form data when canceling edit
      setFormData({
        username: user.username || '',
        full_name: user.full_name || '',
        email: user.email || '',
        bio: user.bio || '',
        country: user.country || '',
        city: user.city || '',
        phone_number: user.phone_number || ''
      });
      setUpdateError('');
    }
    setEditMode(!editMode);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateLoading(true);

    try {
      const updatedUser = await api.user.updateProfile(user.id, formData);
      
      // Update localStorage with new user data
      const storedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        username: updatedUser.username,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        bio: updatedUser.bio,
        country: updatedUser.country,
        city: updatedUser.city,
        phone_number: updatedUser.phone_number
      }));
      
      // Update local state with ALL fields from the response
      setUser(updatedUser);
      setEditMode(false);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Item management functions
  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemModalMode('edit');
    setShowItemModal(true);
  };

  const handleDeleteItem = (item) => {
    setDeletingItem(item);
  };

  const handleItemSuccess = async (updatedItem) => {
    // Refresh user items after update/create
    try {
      const items = await api.user.getUserItems(user.id);
      setUserItems(items);
      setEditingItem(null);
    } catch (err) {
      console.error('Error refreshing items:', err);
    }
  };

  const handleItemDeleted = async () => {
    // Refresh user items after deletion
    try {
      const items = await api.user.getUserItems(user.id);
      setUserItems(items);
      setDeletingItem(null);
    } catch (err) {
      console.error('Error refreshing items:', err);
    }
  };

  const handleItemModalClose = () => {
    setShowItemModal(false);
    setEditingItem(null);
    setItemModalMode('create');
  };

  // Review management functions
  const handleEditReview = (review) => {
    setSelectedReview(review);
    setReviewModalMode('edit');
    setShowReviewModal(true);
  };

  const handleDeleteReview = (review) => {
    setSelectedReview(review);
    setReviewModalMode('delete');
    setShowReviewModal(true);
  };

  const handleReviewModalClose = () => {
    setShowReviewModal(false);
    setSelectedReview(null);
    setReviewModalMode('create');
  };

  const handleReviewSubmitted = async () => {
    // Refresh reviews after any operation
    const userData = JSON.parse(localStorage.getItem('user'));
    
    try {
      const written = await api.user.getWrittenReviews(userData.id);
      setWrittenReviews(written);
      
      const received = await api.user.getReceivedReviews(userData.id);
      setReceivedReviews(received);
      
      // Refresh user names for any new reviews
      const allUserIds = [
        ...new Set([
          ...written.map(review => review.reviewee_id),
          ...received.map(review => review.reviewer_id)
        ])
      ];
      await fetchUserNames(allUserIds);
    } catch (error) {
      console.error('Error refreshing reviews:', error);
    }
  };

  const getUserDisplayName = (userId) => {
    if (userNames[userId]) {
      return `${userNames[userId].full_name} (@${userNames[userId].username})`;
    }
    return userId; // Fallback to ID if name not loaded yet
  };
  
  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border"></div></div>;
  }
  
  if (error) {
    return (
      <div className="alert alert-danger">
        <h4>Error</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Return to Login
        </button>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">
      <h1 className="mb-4">Your Profile</h1>
      
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="list-group">
            <button 
              className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`} 
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeTab === 'myItems' ? 'active' : ''}`} 
              onClick={() => setActiveTab('myItems')}
            >
              My Items ({userItems.length})
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeTab === 'favorites' ? 'active' : ''}`} 
              onClick={() => setActiveTab('favorites')}
            >
              Favorite Items ({favoriteItems.length})
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeTab === 'receivedReviews' ? 'active' : ''}`} 
              onClick={() => setActiveTab('receivedReviews')}
            >
              Reviews Received ({receivedReviews.length})
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeTab === 'writtenReviews' ? 'active' : ''}`} 
              onClick={() => setActiveTab('writtenReviews')}
            >
              Reviews Written ({writtenReviews.length})
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="col-md-9">
          {/* Profile section stays the same */}
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>{editMode ? 'Edit Profile' : 'Profile Information'}</span>
                <button 
                  className={`btn ${editMode ? 'btn-outline-secondary' : 'btn-outline-primary'} btn-sm`}
                  onClick={handleEditToggle}
                >
                  {editMode ? (
                    <>
                      <i className="bi bi-x-circle me-1"></i>
                      Cancel
                    </>
                  ) : (
                    <>
                      <i className="bi bi-pencil me-1"></i>
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
              <div className="card-body">
                {/* Profile edit form and display - keeping existing code */}
                {editMode ? (
                  <form onSubmit={handleProfileUpdate}>
                    {updateError && <div className="alert alert-danger">{updateError}</div>}
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Username *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Bio</label>
                      <textarea
                        className="form-control"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="3"
                        maxLength={500}
                      />
                      <div className="form-text">{formData.bio.length}/500 characters</div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="d-flex gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={updateLoading}
                      >
                        {updateLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-1"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleEditToggle}
                        disabled={updateLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="row">
                    <div className="col-md-3 text-center mb-3">
                      <div className="bg-light rounded-circle mx-auto" style={{width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <i className="bi bi-person" style={{fontSize: '3rem'}}></i>
                      </div>
                    </div>
                    <div className="col-md-9">
                      <h3>{user.full_name}</h3>
                      <p className="text-muted">@{user.username}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Location:</strong> {user.city || 'N/A'}{user.city && user.country ? ', ' : ''}{user.country || ''}</p>
                      <p><strong>Phone:</strong> {user.phone_number || 'N/A'}</p>
                      <p><strong>Bio:</strong> {user.bio || 'No bio provided'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Updated My Items section with edit/delete functionality */}
          {activeTab === 'myItems' && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>My Items</span>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setItemModalMode('create');
                    setEditingItem(null);
                    setShowItemModal(true);
                  }}
                >
                  <i className="bi bi-plus me-1"></i>
                  Add New Item
                </button>
              </div>
              <div className="card-body">
                {userItems.length > 0 ? (
                  <div className="row">
                    {userItems.map(item => (
                      <div key={item.id} className="col-md-6 mb-3">
                        <div className="card h-100">
                          {item.images && item.images.length > 0 ? (
                            <img 
                              src={api.image.getImageUrl(item.images[0].id)}
                              className="card-img-top"
                              alt={item.title}
                              style={{height: '140px', objectFit: 'cover'}}
                            />
                          ) : (
                            <div className="bg-light text-center p-4">No Image</div>
                          )}
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{item.title}</h5>
                            <p className="card-text">${item.price}</p>
                            <p className="card-text small flex-grow-1">{item.description?.substring(0, 60) || 'No description'}</p>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className={`badge ${item.sold ? 'bg-danger' : 'bg-success'}`}>
                                {item.sold ? 'Sold' : 'Available'}
                              </span>
                              <span className="badge bg-secondary">{item.itemCondition}</span>
                            </div>
                            
                            {/* Action buttons */}
                            <div className="d-grid gap-2">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEditItem(item)}
                              >
                                <i className="bi bi-pencil me-1"></i>
                                Edit Item
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteItem(item)}
                              >
                                <i className="bi bi-trash me-1"></i>
                                Delete Item
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p>You haven't listed any items yet.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setItemModalMode('create');
                        setEditingItem(null);
                        setShowItemModal(true);
                      }}
                    >
                      <i className="bi bi-plus me-1"></i>
                      Create Your First Item
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Favorites section stays the same */}
          {activeTab === 'favorites' && (
            <div className="card">
              <div className="card-header">Favorite Items</div>
              <div className="card-body">
                {favoriteItems.length > 0 ? (
                  <div className="row">
                    {favoriteItems.map(item => (
                      <div key={item.id} className="col-md-6 mb-3">
                        <div className="card h-100">
                          {item.images && item.images.length > 0 ? (
                            <img 
                              src={api.image.getImageUrl(item.images[0].id)}
                              className="card-img-top"
                              alt={item.title}
                              style={{height: '140px', objectFit: 'cover'}}
                            />
                          ) : (
                            <div className="bg-light text-center p-4">No Image</div>
                          )}
                          <div className="card-body">
                            <h5 className="card-title">{item.title}</h5>
                            <p className="card-text">${item.price}</p>
                            <button className="btn btn-sm btn-outline-danger" 
                              onClick={() => api.user.removeFromFavorites(user.id, item.id)
                                .then(() => setFavoriteItems(prev => prev.filter(i => i.id !== item.id)))
                                .catch(err => console.error('Error removing favorite:', err))
                              }
                            >
                              Remove from favorites
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>You don't have any favorite items yet.</p>
                )}
              </div>
            </div>
          )}
          
          {/* Reviews sections stay the same */}
          {activeTab === 'receivedReviews' && (
            <div className="card">
              <div className="card-header">Reviews Received</div>
              <div className="card-body">
                {receivedReviews.length > 0 ? (
                  <div className="list-group">
                    {receivedReviews.map(review => (
                      <div key={review.id} className="list-group-item">
                        <div className="d-flex justify-content-between">
                          <div>
                            <span className="badge bg-primary me-2">{review.rating}/5</span>
                            <strong>From: {getUserDisplayName(review.reviewer_id)}</strong>
                          </div>
                          <small>{new Date(review.date).toLocaleDateString()}</small>
                        </div>
                        <p className="mt-2 mb-0">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>You haven't received any reviews yet.</p>
                )}
              </div>
            </div>
          )}
          
          {/* Written Reviews section with edit/delete */}
          {activeTab === 'writtenReviews' && (
            <div className="card">
              <div className="card-header">Reviews Written</div>
              <div className="card-body">
                {writtenReviews.length > 0 ? (
                  <div className="list-group">
                    {writtenReviews.map(review => (
                      <div key={review.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <span className="badge bg-primary me-2">{review.rating}/5</span>
                                <strong>For: {getUserDisplayName(review.reviewee_id)}</strong>
                              </div>
                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEditReview(review)}
                                  title="Edit Review"
                                >
                                  <i className="bi bi-pencil"></i>
                                  <span className="ms-1">Edit</span>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteReview(review)}
                                  title="Delete Review"
                                >
                                  <i className="bi bi-trash"></i>
                                  <span className="ms-1">Delete</span>
                                </button>
                              </div>
                            </div>
                            <p className="mb-1">{review.comment}</p>
                            <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>You haven't written any reviews yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Item Modal for Create/Edit */}
      <ItemModal
        show={showItemModal}
        onHide={handleItemModalClose}
        mode={itemModalMode}
        item={editingItem}
        categories={categories}
        currentUser={user}
        onSuccess={handleItemSuccess}
      />

      {/* Item Delete Confirmation */}
      {deletingItem && (
        <DeleteConfirmation
          item={deletingItem}
          onConfirm={handleItemDeleted}
          onCancel={() => setDeletingItem(null)}
        />
      )}

      {/* Review Modal for Edit/Delete */}
      <ReviewModal
        show={showReviewModal}
        onHide={handleReviewModalClose}
        mode={reviewModalMode}
        reviewToEdit={selectedReview}
        currentUser={user}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default Profile;