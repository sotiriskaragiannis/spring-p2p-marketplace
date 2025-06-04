import React, { useState } from 'react';
import api from '../../services/api';

const CreateItemForm = ({ categories, currentUser, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category_id: '',
    itemCondition: 'NEW',
    sold: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create an item');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create the item first
      const itemData = {
        ...formData,
        seller_id: currentUser.id
      };
      
      const createdItem = await api.item.createItem(itemData);
      
      // If there's an image, upload it
      if (imageFile && createdItem.id) {
        await api.item.uploadImage(createdItem.id, imageFile);
      }
      
      // Get the updated item with image
      const updatedItems = await api.item.getAllItems();
      const newlyCreated = updatedItems.find(item => item.id === createdItem.id);
      
      // Reset form
      setFormData({
        title: '',
        price: '',
        description: '',
        category_id: '',
        itemCondition: 'NEW',
        sold: false
      });
      setImageFile(null);
      
      // Notify parent component of success
      onSuccess(newlyCreated);
      
    } catch (err) {
      console.error('Error creating item:', err);
      setError('Failed to create item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Create New Item</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="title" className="form-label">Title *</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="price" className="form-label">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="category_id" className="form-label">Category *</label>
              <select
                className="form-select"
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {Object.values(categories).map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="itemCondition" className="form-label">Condition *</label>
              <select
                className="form-select"
                id="itemCondition"
                name="itemCondition"
                value={formData.itemCondition}
                onChange={handleChange}
                required
              >
                <option value="NEW">New</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
              </select>
            </div>
            
            <div className="col-12 mb-3">
              <label htmlFor="description" className="form-label">Description *</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>
            
            <div className="col-12 mb-3">
              <label htmlFor="image" className="form-label">Item Image</label>
              <input
                type="file"
                className="form-control"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <small className="text-muted">Optional: Upload an image of your item</small>
            </div>
          </div>
          
          <div className="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItemForm;