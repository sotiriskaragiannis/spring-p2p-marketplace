import React, { useState } from 'react';
import api from '../../services/api';

const EditItemForm = ({ item, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: item.title,
    price: item.price,
    description: item.description,
    category_id: item.category_id,
    itemCondition: item.itemCondition,
    sold: item.sold || false
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
    setLoading(true);
    setError(null);
    
    try {
      // Update the item
      await api.item.updateItem(item.id, formData);
      
      // If there's a new image, upload it
      if (imageFile) {
        await api.item.uploadImage(item.id, imageFile);
      }
      
      // Notify parent of successful update
      onSave();
      
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-warning">
        <h5 className="mb-0">Edit Item</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="edit-title" className="form-label">Title *</label>
              <input
                type="text"
                className="form-control"
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="edit-price" className="form-label">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                id="edit-price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="edit-category" className="form-label">Category *</label>
              <select
                className="form-select"
                id="edit-category"
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
              <label htmlFor="edit-condition" className="form-label">Condition *</label>
              <select
                className="form-select"
                id="edit-condition"
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
            
            <div className="col-md-6 mb-3">
              <label htmlFor="edit-sold" className="form-label">Status</label>
              <select
                className="form-select"
                id="edit-sold"
                name="sold"
                value={formData.sold.toString()}
                onChange={(e) => setFormData({...formData, sold: e.target.value === 'true'})}
              >
                <option value="false">Available</option>
                <option value="true">Sold</option>
              </select>
            </div>
            
            <div className="col-12 mb-3">
              <label htmlFor="edit-description" className="form-label">Description *</label>
              <textarea
                className="form-control"
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>
            
            <div className="col-12 mb-3">
              <label htmlFor="edit-image" className="form-label">New Image</label>
              <input
                type="file"
                className="form-control"
                id="edit-image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <small className="text-muted">Optional: Upload a new image for your item</small>
            </div>
          </div>
          
          <div className="d-flex gap-2 justify-content-end">
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemForm;