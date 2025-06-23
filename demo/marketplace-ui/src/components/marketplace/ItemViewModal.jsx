import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ItemViewModal = ({ 
  show, 
  onHide, 
  item, 
  categories,
  sellerDetails,
  currentUser,
  onEdit,
  onDelete,
  onReview,
  onFavoriteToggle,
  isFavorited,
  favoriteLoading
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when item changes or modal opens
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [item, show]);

  if (!show || !item) return null;

  const getSellerInfo = (sellerId) => {
    return sellerDetails[sellerId] || { username: 'Unknown', full_name: 'Unknown' };
  };

  const getCategoryName = (categoryId) => {
    return categories[categoryId]?.name || 'Uncategorized';
  };

  const isMyItem = () => {
    return currentUser && item.seller_id === currentUser.id;
  };

  // Image cycling functions
  const nextImage = () => {
    if (item.images && item.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item.images && item.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
    }
  };

  const setImageIndex = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Item Details</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              <div className="col-md-5">
                {item.images && item.images.length > 0 ? (
                  <div className="item-gallery">
                    {/* Main Image Display */}
                    <div className="position-relative">
                      <img
                        src={api.image.getImageUrl(item.images[currentImageIndex].id)}
                        className="img-fluid rounded"
                        alt={item.title}
                        style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                      />
                      
                      {/* Navigation arrows (only show if more than 1 image) */}
                      {item.images.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="btn btn-dark btn-sm position-absolute top-50 start-0 translate-middle-y"
                            onClick={prevImage}
                            style={{ marginLeft: '10px', opacity: 0.8 }}
                            onMouseEnter={(e) => e.target.style.opacity = 1}
                            onMouseLeave={(e) => e.target.style.opacity = 0.8}
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-dark btn-sm position-absolute top-50 end-0 translate-middle-y"
                            onClick={nextImage}
                            style={{ marginRight: '10px', opacity: 0.8 }}
                            onMouseEnter={(e) => e.target.style.opacity = 1}
                            onMouseLeave={(e) => e.target.style.opacity = 0.8}
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </>
                      )}
                      
                      {/* Image counter */}
                      {item.images.length > 1 && (
                        <div className="position-absolute top-0 end-0 m-2">
                          <span className="badge bg-dark text-white">
                            {currentImageIndex + 1} / {item.images.length}
                          </span>
                        </div>
                      )}
                      
                      {/* Status badges overlay */}
                      <div className="position-absolute top-0 start-0 m-2">
                        <span className={`badge ${item.sold ? 'bg-danger' : 'bg-success'} me-1`}>
                          {item.sold ? 'SOLD' : 'AVAILABLE'}
                        </span>
                        {item.itemCondition && (
                          <span className="badge bg-secondary">{item.itemCondition}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Thumbnail navigation (only show if more than 1 image) */}
                    {item.images.length > 1 && (
                      <div className="mt-3">
                        <div className="d-flex flex-wrap justify-content-start" style={{ gap: '8px' }}>
                          {item.images.map((image, index) => (
                            <button
                              key={image.id}
                              type="button"
                              className={`btn p-0 border ${index === currentImageIndex ? 'border-primary' : 'border-secondary'}`}
                              onClick={() => setImageIndex(index)}
                              style={{ 
                                width: '60px', 
                                height: '60px',
                                overflow: 'hidden',
                                opacity: index === currentImageIndex ? 1 : 0.7
                              }}
                              onMouseEnter={(e) => e.target.style.opacity = 1}
                              onMouseLeave={(e) => e.target.style.opacity = index === currentImageIndex ? 1 : 0.7}
                            >
                              <img
                                src={api.image.getImageUrl(image.id)}
                                alt={`Thumbnail ${index + 1}`}
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover'
                                }}
                              />
                            </button>
                          ))}
                        </div>
                        
                        {/* Thumbnail navigation hint */}
                        <small className="text-muted d-block mt-2">
                          <i className="bi bi-info-circle me-1"></i>
                          Click thumbnails to view different images
                        </small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-light text-center p-5 rounded">
                    <i className="bi bi-image" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                    <p className="mt-2 text-muted">No Images Available</p>
                  </div>
                )}
              </div>
              
              <div className="col-md-7">
                <h2>
                  {item.title}
                  {isMyItem() && (
                    <span className="badge bg-success ms-2">Your Item</span>
                  )}
                </h2>
                <p className="lead text-primary fw-bold">${item.price}</p>
                
                <div className="mb-3">
                  <h5>Description:</h5>
                  <div className="bg-light p-3 rounded">
                    <p className="mb-0">
                      {item.description || 'No description provided'}
                    </p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <strong>Category:</strong> 
                  <span className="ms-2 badge bg-light text-dark border">
                    <i className="bi bi-tag me-1"></i>
                    {getCategoryName(item.category_id)}
                  </span>
                </div>
                
                {/* Seller Information Card */}
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <i className="bi bi-person me-2"></i>
                    Seller Information
                  </div>
                  <div className="card-body">
                    {isMyItem() ? (
                      <div className="text-center py-2">
                        <i className="bi bi-person-circle text-success" style={{ fontSize: '2.5rem' }}></i>
                        <h6 className="mt-2 mb-0">You (This is your item)</h6>
                        <small className="text-muted">You are the seller of this item</small>
                      </div>
                    ) : (
                      <>
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-person-circle text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
                          <div>
                            <h6 className="mb-0">{getSellerInfo(item.seller_id).full_name}</h6>
                            <small className="text-muted">@{getSellerInfo(item.seller_id).username}</small>
                          </div>
                        </div>
                        {getSellerInfo(item.seller_id).city && getSellerInfo(item.seller_id).country && (
                          <p className="mb-0 small">
                            <i className="bi bi-geo-alt text-danger me-1"></i>
                            {getSellerInfo(item.seller_id).city}, {getSellerInfo(item.seller_id).country}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Quick Actions (if not sold and not own item) */}
                {!item.sold && !isMyItem() && currentUser && (
                  <div className="mt-3">
                    <div className="alert alert-info d-flex align-items-center">
                      <i className="bi bi-info-circle me-2"></i>
                      <div>
                        <strong>Interested in this item?</strong>
                        <small className="d-block">You can add it to your favorites or review the seller.</small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              <i className="bi bi-x-circle me-1"></i>
              Close
            </button>
            
            {!item.sold && !isMyItem() && currentUser && (
              <>
                <button 
                  className="btn btn-primary" 
                  onClick={onReview}
                >
                  <i className="bi bi-star me-1"></i>
                  Review Seller
                </button>
                <button 
                  className={`btn ${isFavorited ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={onFavoriteToggle}
                  disabled={favoriteLoading}
                >
                  {favoriteLoading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className={`bi ${isFavorited ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
                  )}
                  {favoriteLoading ? 'Loading...' : (isFavorited ? 'Remove from Favorites' : 'Add to Favorites')}
                </button>
              </>
            )}
            
            {isMyItem() && (
              <>
                <button 
                  className="btn btn-warning" 
                  onClick={onEdit}
                >
                  <i className="bi bi-pencil me-1"></i>
                  Edit Item
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={onDelete}
                >
                  <i className="bi bi-trash me-1"></i>
                  Delete Item
                </button>
              </>
            )}
            
            {!currentUser && (
              <div className="text-muted small d-flex align-items-center">
                <i className="bi bi-info-circle me-1"></i>
                Please log in to interact with this listing
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemViewModal;