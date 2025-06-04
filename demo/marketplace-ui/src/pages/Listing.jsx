import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Listing = () => {
  // Existing state variables
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [sellerDetails, setSellerDetails] = useState({});
  const [categories, setCategories] = useState({});
  
  // New state variables for item creation
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItemData, setNewItemData] = useState({
    title: '',
    price: '',
    description: '',
    category_id: '',
    itemCondition: 'NEW',
    sold: false  // Add this line
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // New state variables for item editing and deletion
  const [editMode, setEditMode] = useState(false);
  const [editItemData, setEditItemData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  useEffect(() => {
    // Get current user from localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
    
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        // Fetch categories first
        const categoriesData = await api.category.getAllCategories();
        const categoriesMap = {};
        categoriesData.forEach(category => {
          categoriesMap[category.id] = category;
        });
        setCategories(categoriesMap);
        
        // Then fetch items
        const data = await api.item.getAllItems();
        setItems(data);
        
        // Fetch seller details for all unique seller IDs
        const uniqueSellerIds = [...new Set(data.map(item => item.seller_id))];
        const sellerPromises = uniqueSellerIds.map(id => api.user.getProfile(id));
        
        try {
          const sellersData = await Promise.all(sellerPromises);
          const sellersMap = {};
          sellersData.forEach(seller => {
            if (seller && seller.id) {
              sellersMap[seller.id] = seller;
            }
          });
          setSellerDetails(sellersMap);
        } catch (sellerErr) {
          console.error('Error fetching seller details:', sellerErr);
        }
        
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, []);
  
  // Handle new item form change
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItemData({
      ...newItemData,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Create new item
  const handleCreateItem = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setCreateError('You must be logged in to create an item');
      return;
    }
    
    setCreateLoading(true);
    setCreateError(null);
    
    try {
      // Create the item first
      const itemData = {
        ...newItemData,
        seller_id: currentUser.id
      };
      
      const createdItem = await api.item.createItem(itemData);
      
      // If there's an image, upload it
      if (imageFile && createdItem.id) {
        await api.item.uploadImage(createdItem.id, imageFile);
      }
      
      // Refresh the items list
      const updatedItems = await api.item.getAllItems();
      setItems(updatedItems);
      
      // Reset form and close it
      setNewItemData({
        title: '',
        price: '',
        description: '',
        category_id: '',
        itemCondition: 'NEW',
        sold: false   // Add this line
      });
      setImageFile(null);
      setShowCreateForm(false);
      
      // Select the newly created item
      const newlyCreated = updatedItems.find(item => item.id === createdItem.id);
      if (newlyCreated) {
        setSelectedItem(newlyCreated);
        setTimeout(() => {
          document.getElementById('itemDetails').scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      
    } catch (err) {
      console.error('Error creating item:', err);
      setCreateError('Failed to create item. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Start editing an item
  const handleStartEdit = () => {
    // Pre-fill the form with current item data
    setEditItemData({
      title: selectedItem.title,
      price: selectedItem.price,
      description: selectedItem.description,
      category_id: selectedItem.category_id,
      itemCondition: selectedItem.itemCondition,
      sold: selectedItem.sold || false
    });
    setEditMode(true);
  };

  // Handle changes in edit form
  const handleEditItemChange = (e) => {
    const { name, value } = e.target;
    setEditItemData({
      ...editItemData,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    });
  };

  // Save edited item
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    
    try {
      // Update the item
      await api.item.updateItem(selectedItem.id, {
        ...editItemData,
      });
      
      // Refresh the items list
      const updatedItems = await api.item.getAllItems();
      setItems(updatedItems);
      
      // Select the updated item
      const updatedItem = updatedItems.find(item => item.id === selectedItem.id);
      setSelectedItem(updatedItem);
      
      // Exit edit mode
      setEditMode(false);
      setEditItemData(null);
      
    } catch (err) {
      console.error('Error updating item:', err);
      setEditError('Failed to update item. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditItemData(null);
    setEditError(null);
  };

  // Delete item
  const handleDeleteItem = async () => {
    setDeleteLoading(true);
    
    try {
      // Delete the item
      await api.item.deleteItem(selectedItem.id);
      
      // Refresh the items list
      const updatedItems = await api.item.getAllItems();
      setItems(updatedItems);
      
      // Clear selected item and cancel delete confirmation
      setSelectedItem(null);
      setDeleteConfirm(false);
      
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedItem(item);
    // Scroll to item details
    document.getElementById('itemDetails').scrollIntoView({ behavior: 'smooth' });
  };
  
  // Check if an item belongs to the current user
  const isMyItem = (item) => {
    return currentUser && item.seller_id === currentUser.id;
  };
  
  // Get seller info for an item
  const getSellerInfo = (sellerId) => {
    return sellerDetails[sellerId] || { username: 'Unknown', full_name: 'Unknown' };
  };
  
  // Get category name for an item
  const getCategoryName = (categoryId) => {
    return categories[categoryId]?.name || 'Uncategorized';
  };
  
  return (
    <div className="listing-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Marketplace Items</h1>
        {currentUser && (
          <button 
            className="btn btn-primary" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create New Item'}
          </button>
        )}
      </div>

      {/* Create Item Form */}
      {showCreateForm && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Create New Item</h5>
          </div>
          <div className="card-body">
            {createError && <div className="alert alert-danger">{createError}</div>}
            
            <form onSubmit={handleCreateItem}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="title" className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={newItemData.title}
                    onChange={handleNewItemChange}
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
                    value={newItemData.price}
                    onChange={handleNewItemChange}
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="category_id" className="form-label">Category *</label>
                  <select
                    className="form-select"
                    id="category_id"
                    name="category_id"
                    value={newItemData.category_id}
                    onChange={handleNewItemChange}
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
                    value={newItemData.itemCondition}
                    onChange={handleNewItemChange}
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
                    value={newItemData.description}
                    onChange={handleNewItemChange}
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
              
              <div className="d-grid gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={createLoading}
                >
                  {createLoading ? 'Creating...' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Form */}
      {editMode && selectedItem && (
        <div className="card mb-4">
          <div className="card-header bg-warning text-white">
            <h5 className="mb-0">Edit Item</h5>
          </div>
          <div className="card-body">
            {editError && <div className="alert alert-danger">{editError}</div>}
            
            <form onSubmit={handleSaveEdit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="titleEdit" className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="titleEdit"
                    name="title"
                    value={editItemData.title}
                    onChange={handleEditItemChange}
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="priceEdit" className="form-label">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    id="priceEdit"
                    name="price"
                    value={editItemData.price}
                    onChange={handleEditItemChange}
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="category_idEdit" className="form-label">Category *</label>
                  <select
                    className="form-select"
                    id="category_idEdit"
                    name="category_id"
                    value={editItemData.category_id}
                    onChange={handleEditItemChange}
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
                  <label htmlFor="itemConditionEdit" className="form-label">Condition *</label>
                  <select
                    className="form-select"
                    id="itemConditionEdit"
                    name="itemCondition"
                    value={editItemData.itemCondition}
                    onChange={handleEditItemChange}
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
                  <label htmlFor="descriptionEdit" className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    id="descriptionEdit"
                    name="description"
                    value={editItemData.description}
                    onChange={handleEditItemChange}
                    rows="4"
                    required
                  />
                </div>
                
                <div className="col-12 mb-3">
                  <label htmlFor="imageEdit" className="form-label">Item Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="imageEdit"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small className="text-muted">Optional: Upload a new image for your item</small>
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <button 
                  type="submit" 
                  className="btn btn-warning" 
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && selectedItem && (
        <div className="alert alert-danger mb-4">
          <h5 className="alert-heading">Confirm Deletion</h5>
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="d-flex justify-content-end">
            <button 
              className="btn btn-danger me-2"
              onClick={handleDeleteItem}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Item'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setDeleteConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      {/* Loading and Error States */}
      {loading && <div className="text-center my-5"><div className="spinner-border"></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Items Grid */}
      {!loading && !error && (
        <>
          <p>{filteredItems.length} items found</p>
          
          <div className="row">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div key={item.id} className="col-md-4 col-sm-6 mb-4">
                  <div 
                    className={`card h-100 ${selectedItem?.id === item.id ? 'border-primary' : ''} ${
                      isMyItem(item) ? 'border-success' : ''
                    }`}
                    onClick={() => handleItemSelect(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isMyItem(item) && (
                      <div className="position-absolute top-0 end-0 p-2">
                        <span className="badge bg-success">Your Item</span>
                      </div>
                    )}
                    
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={api.image.getImageUrl(item.images[0].id)}
                        className="card-img-top"
                        alt={item.title}
                        style={{ height: '180px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="bg-light text-center p-5">No Image</div>
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">${item.price}</h6>
                      <p className="card-text small text-truncate">{item.description}</p>
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Seller: {getSellerInfo(item.seller_id).username}
                      </small>
                      <span className={`badge ${item.sold ? 'bg-danger' : 'bg-success'}`}>
                        {item.sold ? 'Sold' : 'Available'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) :(
              <div className="col-12 text-center">
                <p>No items match your search. Try adjusting your criteria.</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Item Details Section */}
      {selectedItem && filteredItems.length > 0 && filteredItems.some(item => item.id === selectedItem.id) && (
        <div id="itemDetails" className="mt-5">
          <div className="card">
            <div className="card-header">
              <h3>Item Details</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-5">
                  {selectedItem.images && selectedItem.images.length > 0 ? (
                    <div className="item-gallery">
                      <img
                        src={api.image.getImageUrl(selectedItem.images[0].id)}
                        className="img-fluid rounded"
                        alt={selectedItem.title}
                      />
                      {selectedItem.images.length > 1 && (
                        <div className="row mt-2">
                          {selectedItem.images.slice(0, 4).map(image => (
                            <div key={image.id} className="col-3">
                              <img
                                src={api.image.getImageUrl(image.id)}
                                className="img-thumbnail"
                                alt="Item thumbnail"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-light text-center p-5 rounded">No Images Available</div>
                  )}
                </div>
                
                <div className="col-md-7">
                  <h2>
                    {selectedItem.title}
                    {isMyItem(selectedItem) && (
                      <span className="badge bg-success ms-2">Your Item</span>
                    )}
                  </h2>
                  <p className="lead">${selectedItem.price}</p>
                  
                  <div className="mb-3">
                    <span className={`badge ${selectedItem.sold ? 'bg-danger' : 'bg-success'} me-2`}>
                      {selectedItem.sold ? 'Sold' : 'Available'}
                    </span>
                    {selectedItem.itemCondition && (
                      <span className="badge bg-secondary">{selectedItem.itemCondition}</span>
                    )}
                  </div>
                  
                  <h5>Description:</h5>
                  <p>{selectedItem.description || 'No description provided'}</p>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <strong>Category:</strong> {getCategoryName(selectedItem.category_id)}
                    </div>
                  </div>
                  
                  <div className="card mb-3">
                    <div className="card-header">
                      Seller Information
                    </div>
                    <div className="card-body">
                      {isMyItem(selectedItem) ? (
                        <h6>You (This is your item)</h6>
                      ) : (
                        <>
                          <h6>{getSellerInfo(selectedItem.seller_id).full_name}</h6>
                          <p className="mb-1">@{getSellerInfo(selectedItem.seller_id).username}</p>
                          {getSellerInfo(selectedItem.seller_id).city && getSellerInfo(selectedItem.seller_id).country && (
                            <p className="mb-1">
                              Location: {getSellerInfo(selectedItem.seller_id).city}, 
                              {getSellerInfo(selectedItem.seller_id).country}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {!selectedItem.sold && !isMyItem(selectedItem) && (
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary">Contact Seller</button>
                      <button className="btn btn-outline-primary">Add to Favorites</button>
                    </div>
                  )}
                  {isMyItem(selectedItem) && !editMode && (
                    <div className="d-grid gap-2">
                      <button className="btn btn-warning" onClick={handleStartEdit}>
                        Edit Item
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => setDeleteConfirm(true)}
                      >
                        Delete Item
                      </button>
                    </div>
                  )}

                  {/* Edit Form */}
                  {editMode && (
                    <div className="card mt-3">
                      <div className="card-header bg-warning">
                        <h5 className="mb-0">Edit Item</h5>
                      </div>
                      <div className="card-body">
                        {editError && <div className="alert alert-danger">{editError}</div>}
                        
                        <form onSubmit={handleSaveEdit}>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="edit-title" className="form-label">Title *</label>
                              <input
                                type="text"
                                className="form-control"
                                id="edit-title"
                                name="title"
                                value={editItemData.title}
                                onChange={handleEditItemChange}
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
                                value={editItemData.price}
                                onChange={handleEditItemChange}
                                required
                              />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                              <label htmlFor="edit-category" className="form-label">Category *</label>
                              <select
                                className="form-select"
                                id="edit-category"
                                name="category_id"
                                value={editItemData.category_id}
                                onChange={handleEditItemChange}
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
                                value={editItemData.itemCondition}
                                onChange={handleEditItemChange}
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
                                value={editItemData.sold.toString()}
                                onChange={(e) => setEditItemData({...editItemData, sold: e.target.value === 'true'})}
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
                                value={editItemData.description}
                                onChange={handleEditItemChange}
                                rows="4"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="d-flex gap-2 justify-content-end">
                            <button 
                              type="button" 
                              className="btn btn-secondary" 
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              className="btn btn-primary" 
                              disabled={editLoading}
                            >
                              {editLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Delete Confirmation Dialog */}
                  {deleteConfirm && (
                    <div className="card mt-3 border-danger">
                      <div className="card-header bg-danger text-white">
                        <h5 className="mb-0">Confirm Deletion</h5>
                      </div>
                      <div className="card-body">
                        <p>Are you sure you want to delete <strong>{selectedItem.title}</strong>?</p>
                        <p className="text-danger">This action cannot be undone!</p>
                        
                        <div className="d-flex gap-2 justify-content-end">
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => setDeleteConfirm(false)}
                            disabled={deleteLoading}
                          >
                            Cancel
                          </button>
                          <button 
                            className="btn btn-danger" 
                            onClick={handleDeleteItem}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? 'Deleting...' : 'Yes, Delete Item'}
                          </button>
                        </div>
                      </div>
                    </div>
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

export default Listing;