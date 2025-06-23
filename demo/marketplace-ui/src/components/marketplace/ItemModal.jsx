import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ItemModal = ({ 
  show, 
  onHide, 
  mode = 'create', // 'create' or 'edit'
  item = null, // existing item for edit mode
  categories, 
  currentUser, 
  onSuccess 
}) => {
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
  
  // Image management
  const [newImages, setNewImages] = useState([]); // New images to upload
  const [existingImages, setExistingImages] = useState([]); // Existing images from item
  const [deletedImageIds, setDeletedImageIds] = useState([]); // IDs of images to delete
  const [imageError, setImageError] = useState('');

  // Initialize form data when item changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && item) {
      setFormData({
        title: item.title || '',
        price: item.price || '',
        description: item.description || '',
        category_id: item.category_id || '',
        itemCondition: item.itemCondition || 'NEW',
        sold: item.sold || false
      });
      setExistingImages(item.images || []);
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        price: '',
        description: '',
        category_id: '',
        itemCondition: 'NEW',
        sold: false
      });
      setExistingImages([]);
    }
    setError(null);
    setImageError('');
    setNewImages([]);
    setDeletedImageIds([]);
  }, [mode, item, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    });
  };

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    setImageError('');
    
    // Validate file types and sizes
    const validFiles = [];
    const maxSize = 2 * 1024 * 1024; // Reduced to 2MB to prevent 413 errors
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setImageError(`${file.name} is not a valid image format. Please use JPG, PNG, GIF, or WebP.`);
        continue;
      }
      
      if (file.size > maxSize) {
        setImageError(`${file.name} is too large. Please use images under 2MB.`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    // Check total image count
    const totalImages = existingImages.length - deletedImageIds.length + newImages.length + validFiles.length;
    if (totalImages > 10) {
      setImageError('Maximum 10 images allowed per item.');
      return;
    }
    
    // Add preview URLs to new images
    const newImagesWithPreview = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `new-${Date.now()}-${Math.random()}`
    }));
    
    setNewImages(prev => [...prev, ...newImagesWithPreview]);
    
    // Reset the file input
    e.target.value = '';
  };

  const handleRemoveNewImage = (imageId) => {
    setNewImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove && imageToRemove.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  const handleRemoveExistingImage = (imageId) => {
    setDeletedImageIds(prev => [...prev, imageId]);
  };

  const handleRestoreExistingImage = (imageId) => {
    setDeletedImageIds(prev => prev.filter(id => id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to manage items');
      return;
    }
    
    setLoading(true);
    setError(null);
    setImageError('');
    
    try {
      let resultItem;
      
      if (mode === 'create') {
        // Create new item
        const itemData = {
          ...formData,
          seller_id: currentUser.id
        };
        
        resultItem = await api.item.createItem(itemData);
        
        // Upload new images sequentially with delay
        if (newImages.length > 0 && resultItem.id) {
          console.log(`Uploading ${newImages.length} images for item ${resultItem.id}`);
          
          for (let i = 0; i < newImages.length; i++) {
            try {
              console.log(`Uploading image ${i + 1}/${newImages.length}`);
              await api.item.uploadImage(resultItem.id, newImages[i].file);
              console.log(`Successfully uploaded image ${i + 1}`);
              
              // Add small delay between uploads to prevent server overload
              if (i < newImages.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            } catch (uploadError) {
              console.error(`Failed to upload image ${i + 1}:`, uploadError);
              setImageError(prev => (prev || '') + ` Failed to upload image ${i + 1}. `);
            }
          }
        }
        
      } else {
        // Update existing item
        resultItem = await api.item.updateItem(item.id, formData);
        
        // Delete marked images first
        if (deletedImageIds.length > 0) {
          console.log(`Deleting ${deletedImageIds.length} images`);
          
          for (const imageId of deletedImageIds) {
            try {
              await api.item.removeImage(item.id, imageId);
              console.log(`Successfully deleted image ${imageId}`);
              // Small delay between deletions
              await new Promise(resolve => setTimeout(resolve, 200));
            } catch (deleteError) {
              console.error(`Failed to delete image ${imageId}:`, deleteError);
            }
          }
        }
        
        // Upload new images sequentially with delay
        if (newImages.length > 0) {
          console.log(`Uploading ${newImages.length} new images for item ${item.id}`);
          
          for (let i = 0; i < newImages.length; i++) {
            try {
              console.log(`Uploading new image ${i + 1}/${newImages.length}`);
              await api.item.uploadImage(item.id, newImages[i].file);
              console.log(`Successfully uploaded new image ${i + 1}`);
              
              // Add delay between uploads
              if (i < newImages.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            } catch (uploadError) {
              console.error(`Failed to upload new image ${i + 1}:`, uploadError);
              setImageError(prev => (prev || '') + ` Failed to upload image ${i + 1}. `);
            }
          }
        }
      }
      
      // Wait a bit before fetching updated item to ensure all images are processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the updated item with all images
      try {
        resultItem = await api.item.getItem(resultItem.id);
        console.log('Updated item with images:', resultItem);
      } catch (fetchError) {
        console.error('Failed to fetch updated item:', fetchError);
        // Fallback - fetch all items and find the updated one
        try {
          const allItems = await api.item.getAllItems();
          const updatedItem = allItems.find(i => i.id === resultItem.id);
          if (updatedItem) {
            resultItem = updatedItem;
          }
        } catch (fallbackError) {
          console.error('Fallback fetch also failed:', fallbackError);
        }
      }
      
      // Clean up preview URLs
      newImages.forEach(imageObj => {
        if (imageObj.preview) {
          URL.revokeObjectURL(imageObj.preview);
        }
      });
      
      // Reset form
      setFormData({
        title: '',
        price: '',
        description: '',
        category_id: '',
        itemCondition: 'NEW',
        sold: false
      });
      setNewImages([]);
      setExistingImages([]);
      setDeletedImageIds([]);
      
      // Show success message if there were any image errors but item was saved
      if (imageError) {
        console.warn('Item saved but some images failed:', imageError);
      }
      
      // Notify parent component of success
      onSuccess(resultItem);
      
      // Close modal
      onHide();
      
    } catch (err) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} item:`, err);
      setError(`Failed to ${mode === 'create' ? 'create' : 'update'} item. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up preview URLs
    newImages.forEach(imageObj => {
      if (imageObj.preview) {
        URL.revokeObjectURL(imageObj.preview);
      }
    });
    
    setFormData({
      title: '',
      price: '',
      description: '',
      category_id: '',
      itemCondition: 'NEW',
      sold: false
    });
    setNewImages([]);
    setExistingImages([]);
    setDeletedImageIds([]);
    setError(null);
    setImageError('');
    onHide();
  };

  if (!show) return null;

  const getModalTitle = () => {
    return mode === 'create' ? 'Create New Item' : 'Edit Item';
  };

  const getSubmitButtonText = () => {
    if (loading) {
      return mode === 'create' ? 'Creating...' : 'Saving...';
    }
    return mode === 'create' ? 'Create Item' : 'Save Changes';
  };

  const getTotalImageCount = () => {
    return existingImages.length - deletedImageIds.length + newImages.length;
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{getModalTitle()}</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
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
                    {Object.values(categories || {}).map(category => (
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
                
                {mode === 'edit' && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="sold" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="sold"
                      name="sold"
                      value={formData.sold.toString()}
                      onChange={(e) => setFormData({...formData, sold: e.target.value === 'true'})}
                    >
                      <option value="false">Available</option>
                      <option value="true">Sold</option>
                    </select>
                  </div>
                )}
                
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
                
                {/* Image Management Section */}
                <div className="col-12 mb-3">
                  <label className="form-label">
                    Item Images 
                    <span className="text-muted">({getTotalImageCount()}/10)</span>
                  </label>
                  
                  {imageError && <div className="alert alert-warning alert-sm">{imageError}</div>}
                  
                  {/* Add Images Button */}
                  {getTotalImageCount() < 10 && (
                    <div className="mb-3">
                      <input
                        type="file"
                        className="form-control"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageAdd}
                      />
                      <small className="text-muted">
                        Select multiple images (JPG, PNG, GIF, WebP) - Max 5MB each, 10 images total
                      </small>
                    </div>
                  )}
                  
                  {/* Existing Images (Edit Mode) */}
                  {mode === 'edit' && existingImages.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-muted">Current Images:</h6>
                      <div className="row g-2">
                        {existingImages.map(image => (
                          <div key={image.id} className="col-md-3 col-sm-4 col-6">
                            <div className={`position-relative ${deletedImageIds.includes(image.id) ? 'opacity-50' : ''}`}>
                              <img
                                src={api.image.getImageUrl(image.id)}
                                alt="Item"
                                className="img-thumbnail w-100"
                                style={{ height: '120px', objectFit: 'cover' }}
                              />
                              {deletedImageIds.includes(image.id) ? (
                                <div className="position-absolute top-0 end-0 p-1">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleRestoreExistingImage(image.id)}
                                    title="Restore image"
                                  >
                                    <i className="bi bi-arrow-clockwise"></i>
                                  </button>
                                </div>
                              ) : (
                                <div className="position-absolute top-0 end-0 p-1">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleRemoveExistingImage(image.id)}
                                    title="Mark for deletion"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              )}
                              {deletedImageIds.includes(image.id) && (
                                <div className="position-absolute top-50 start-50 translate-middle">
                                  <span className="badge bg-danger">Will be deleted</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* New Images Preview */}
                  {newImages.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-muted">New Images to Upload:</h6>
                      <div className="row g-2">
                        {newImages.map(imageObj => (
                          <div key={imageObj.id} className="col-md-3 col-sm-4 col-6">
                            <div className="position-relative">
                              <img
                                src={imageObj.preview}
                                alt="Preview"
                                className="img-thumbnail w-100"
                                style={{ height: '120px', objectFit: 'cover' }}
                              />
                              <div className="position-absolute top-0 end-0 p-1">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRemoveNewImage(imageObj.id)}
                                  title="Remove image"
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              </div>
                              <div className="position-absolute bottom-0 start-0 end-0 p-1">
                                <span className="badge bg-success w-100">New</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* No Images Message */}
                  {getTotalImageCount() === 0 && (
                    <div className="text-center py-3 border rounded bg-light">
                      <i className="bi bi-images" style={{ fontSize: '2rem', color: '#ccc' }}></i>
                      <p className="text-muted mt-2 mb-0">No images selected</p>
                      <small className="text-muted">Add some images to showcase your item</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                {getSubmitButtonText()}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;