import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch user details, reviews, and favorites after login
  useEffect(() => {
    if (userDetails) {
      // Fetch user's received reviews
      api.user.getReceivedReviews(userDetails.id)
        .then(data => setReviews(data))
        .catch(err => console.error('Error fetching reviews:', err));

      // Fetch user's favorite items
      api.user.getFavorites(userDetails.id)
        .then(data => setFavorites(data))
        .catch(err => console.error('Error fetching favorites:', err));
    }
  }, [userDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Use the proper authentication API
      const loginResponse = await api.auth.login({
        username: formData.username,
        password: formData.password
      });
      
      // Check if login was successful
      if (!loginResponse.success) {
        throw new Error(loginResponse.message || 'Login failed');
      }
      
      // Extract user data from the response
      const user = loginResponse.user;
      
      // Login successful - store user info
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        bio: user.bio,
        country: user.country,
        city: user.city,
        phone_number: user.phone_number
      }));
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      // Set user details to trigger useEffect for fetching additional data
      setUserDetails(user);
      
      // Success - redirect to dashboard or home after short delay to show welcome message
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!userDetails ? (
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <div className="mt-4">
          <div className="alert alert-success">
            <h3>Welcome, {userDetails.username}!</h3>
            <p>Login successful! Redirecting to home page...</p>
          </div>
          
          <div className="row mt-3">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">Your Reviews ({reviews.length})</div>
                <div className="card-body">
                  {reviews.length > 0 ? (
                    <ul className="list-group">
                      {reviews.map(review => (
                        <li key={review.id} className="list-group-item">
                          <div className="d-flex justify-content-between">
                            <div>
                              <strong>Rating:</strong> {review.rating}/5
                            </div>
                            <small>From: {review.reviewer?.username}</small>
                          </div>
                          <p>{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No reviews yet</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">Your Favorite Items ({favorites.length})</div>
                <div className="card-body">
                  {favorites.length > 0 ? (
                    <ul className="list-group">
                      {favorites.map(item => (
                        <li key={item.id} className="list-group-item">
                          <div className="d-flex justify-content-between">
                            <strong>{item.title}</strong>
                            <span>${item.price}</span>
                          </div>
                          <p className="small mb-0">{item.description?.substring(0, 100)}...</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No favorite items yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;