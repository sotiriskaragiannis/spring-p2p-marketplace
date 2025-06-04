import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    bio: '',
    country: '',
    city: '',
    phone_number: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Use the API service instead of direct fetch
      const data = await api.user.register(formData);
      
      // Store user token if returned by the API
      if (data.token) {
        localStorage.setItem('userToken', data.token);
      }
      
      // Store basic user info
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email
      }));
      
      // Success - redirect to login or dashboard
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  // The rest of your component remains the same
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="username" className="form-label">Username*</label>
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
        
        <div className="col-md-6 mb-3">
          <label htmlFor="full_name" className="form-label">Full Name*</label>
          <input
            type="text"
            className="form-control"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email*</label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password*</label>
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

      <div className="mb-3">
        <label htmlFor="bio" className="form-label">Bio</label>
        <textarea
          className="form-control"
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="country" className="form-label">Country</label>
          <input
            type="text"
            className="form-control"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        
        <div className="col-md-6 mb-3">
          <label htmlFor="city" className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="phone_number" className="form-label">Phone Number</label>
        <input
          type="tel"
          className="form-control"
          id="phone_number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;