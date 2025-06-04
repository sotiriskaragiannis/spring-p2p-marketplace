import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch detailed user profile
        const userProfile = await api.user.getProfile(userData.id);
        setUser(prev => ({ ...prev, ...userProfile }));
        
        // Fetch user items
        const items = await api.user.getUserItems(userData.id);
        setUserItems(items);
        
        // Fetch favorite items
        const favorites = await api.user.getFavorites(userData.id);
        setFavoriteItems(favorites);
        
        // Fetch reviews
        const received = await api.user.getReceivedReviews(userData.id);
        setReceivedReviews(received);
        
        const written = await api.user.getWrittenReviews(userData.id);
        setWrittenReviews(written);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border"></div></div>;
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="dashboard">
      <h1 className="mb-4">Dashboard</h1>
      
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
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">Profile Information</div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 text-center mb-3">
                    {/* Placeholder avatar */}
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
              </div>
            </div>
          )}
          
          {activeTab === 'myItems' && (
            <div className="card">
              <div className="card-header">My Items</div>
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
                          <div className="card-body">
                            <h5 className="card-title">{item.title}</h5>
                            <p className="card-text">${item.price}</p>
                            <p className="card-text small">{item.description?.substring(0, 60) || 'No description'}</p>
                            <div className="d-flex justify-content-between">
                              <span className={`badge ${item.sold ? 'bg-danger' : 'bg-success'}`}>
                                {item.sold ? 'Sold' : 'Available'}
                              </span>
                              <span className="badge bg-secondary">{item.itemCondition}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>You haven't listed any items yet.</p>
                )}
              </div>
            </div>
          )}
          
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
                            <strong>From: {review.reviewer_id}</strong>
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
          
          {activeTab === 'writtenReviews' && (
            <div className="card">
              <div className="card-header">Reviews Written</div>
              <div className="card-body">
                {writtenReviews.length > 0 ? (
                  <div className="list-group">
                    {writtenReviews.map(review => (
                      <div key={review.id} className="list-group-item">
                        <div className="d-flex justify-content-between">
                          <div>
                            <span className="badge bg-primary me-2">{review.rating}/5</span>
                            <strong>For: {review.reviewee_id}</strong>
                          </div>
                          <small>{new Date(review.date).toLocaleDateString()}</small>
                        </div>
                        <p className="mt-2 mb-0">{review.comment}</p>
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
    </div>
  );
};

export default UserDashboard;