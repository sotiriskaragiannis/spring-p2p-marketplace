import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ReviewModal = ({ 
  show, 
  onHide, 
  item, 
  currentUser, 
  onReviewSubmitted, 
  reviewToEdit = null, 
  mode = 'create',
  sellerInfo = null // New prop to pass seller information
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seller, setSeller] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(false);

  // Fetch seller information for create mode
  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (mode === 'create' && item?.seller_id && !sellerInfo) {
        setSellerLoading(true);
        try {
          const sellerData = await api.user.getProfile(item.seller_id);
          setSeller(sellerData);
        } catch (error) {
          console.error('Error fetching seller info:', error);
          setSeller({ 
            username: 'Unknown', 
            full_name: 'Unknown User',
            city: null,
            country: null,
            bio: null
          });
        } finally {
          setSellerLoading(false);
        }
      } else if (sellerInfo) {
        setSeller(sellerInfo);
      } else if (mode === 'edit' && reviewToEdit?.reviewee_id) {
        // For edit mode, fetch the reviewee information
        setSellerLoading(true);
        try {
          const sellerData = await api.user.getProfile(reviewToEdit.reviewee_id);
          setSeller(sellerData);
        } catch (error) {
          console.error('Error fetching reviewee info:', error);
          setSeller({ 
            username: 'Unknown', 
            full_name: 'Unknown User',
            city: null,
            country: null,
            bio: null
          });
        } finally {
          setSellerLoading(false);
        }
      }
    };

    fetchSellerInfo();
  }, [item, mode, sellerInfo, reviewToEdit]);

  // Initialize form with existing review data when editing
  useEffect(() => {
    if (reviewToEdit && mode === 'edit') {
      setRating(reviewToEdit.rating);
      setComment(reviewToEdit.comment);
    } else {
      setRating(5);
      setComment('');
    }
    setError('');
  }, [reviewToEdit, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'delete') {
      handleDelete();
      return;
    }

    if (!comment.trim()) {
      setError('Please enter a comment for your review');
      return;
    }

    if (!currentUser || !currentUser.id) {
      setError('You must be logged in to submit a review');
      return;
    }

    // For create mode, we need item seller info
    if (mode === 'create' && (!item || !item.seller_id)) {
      setError('Seller information is missing');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        rating: parseInt(rating),
        comment: comment.trim(),
        reviewer_id: currentUser.id,
        reviewee_id: mode === 'create' ? item.seller_id : reviewToEdit.reviewee_id,
        date: new Date().toISOString().split('T')[0]
      };

      if (mode === 'create') {
        await api.review.createReview(reviewData);
      } else if (mode === 'edit') {
        await api.review.updateReview(reviewToEdit.id, reviewData);
      }
      
      // Reset form
      setRating(5);
      setComment('');
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      // Close modal
      onHide();
      
      alert(mode === 'create' ? 'Review submitted successfully!' : 'Review updated successfully!');
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'submitting' : 'updating'} review:`, error);
      setError(error.message || `Failed to ${mode === 'create' ? 'submit' : 'update'} review. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!reviewToEdit) return;

    setLoading(true);
    setError('');

    try {
      await api.review.deleteReview(reviewToEdit.id);
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      // Close modal
      onHide();
      
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      setError(error.message || 'Failed to delete review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(5);
    setComment('');
    setError('');
    setSeller(null);
    onHide();
  };

  if (!show) return null;

  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return 'Write a Review';
      case 'edit':
        return 'Edit Your Review';
      case 'delete':
        return 'Delete Review';
      default:
        return 'Review';
    }
  };

  const getSubmitButtonText = () => {
    if (loading) {
      switch (mode) {
        case 'create':
          return 'Submitting...';
        case 'edit':
          return 'Updating...';
        case 'delete':
          return 'Deleting...';
        default:
          return 'Loading...';
      }
    }
    
    switch (mode) {
      case 'create':
        return 'Submit Review';
      case 'edit':
        return 'Update Review';
      case 'delete':
        return 'Delete Review';
      default:
        return 'Submit';
    }
  };

  const renderSellerInfo = () => {
    if (sellerLoading) {
      return (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm me-2"></div>
          Loading seller information...
        </div>
      );
    }

    if (!seller) {
      return (
        <div className="text-center py-3 text-muted">
          <i className="bi bi-person-x me-2"></i>
          Seller information unavailable
        </div>
      );
    }

    return (
      <div className="d-flex align-items-start">
        <div className="me-3">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
               style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
            <i className="bi bi-person-fill"></i>
          </div>
        </div>
        <div className="flex-grow-1">
          <h5 className="mb-1">
            {seller.full_name}
            <span className="text-muted ms-2">(@{seller.username})</span>
          </h5>
          
          {seller.city && seller.country && (
            <p className="mb-1 text-muted">
              <i className="bi bi-geo-alt me-1"></i>
              {seller.city}, {seller.country}
            </p>
          )}
          
          {seller.phone_number && (
            <p className="mb-1 text-muted">
              <i className="bi bi-telephone me-1"></i>
              {seller.phone_number}
            </p>
          )}
          
          {seller.email && (
            <p className="mb-1 text-muted">
              <i className="bi bi-envelope me-1"></i>
              {seller.email}
            </p>
          )}
          
          {seller.bio && (
            <div className="mt-2">
              <small className="text-muted d-block mb-1">About this seller:</small>
              <p className="mb-0 small bg-light p-2 rounded" style={{ fontStyle: 'italic' }}>
                "{seller.bio}"
              </p>
            </div>
          )}
        </div>
      </div>
    );
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
              
              {/* Enhanced Seller Information Card */}
              {(mode === 'create' || mode === 'edit') && (
                <div className="card mb-4 border-primary">
                  <div className="card-header bg-primary text-white">
                    <h6 className="mb-0">
                      <i className="bi bi-person-circle me-2"></i>
                      {mode === 'create' ? 'You are reviewing this seller:' : 'You reviewed this person:'}
                    </h6>
                  </div>
                  <div className="card-body">
                    {renderSellerInfo()}
                  </div>
                </div>
              )}
              
              {/* Show context information for item */}
              {mode === 'create' && item && (
                <div className="card mb-3 bg-light">
                  <div className="card-body">
                    <h6 className="card-title mb-2">
                      <i className="bi bi-tag me-2"></i>
                      Item Being Reviewed
                    </h6>
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <p className="mb-1"><strong>Title:</strong> {item.title}</p>
                        <p className="mb-1"><strong>Price:</strong> ${item.price}</p>
                        <p className="mb-0"><strong>Condition:</strong> {item.itemCondition}</p>
                      </div>
                      <div className="col-md-4 text-end">
                        <span className={`badge ${item.sold ? 'bg-success' : 'bg-warning'} fs-6`}>
                          {item.sold ? 'SOLD' : 'AVAILABLE'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {mode === 'delete' ? (
                <div className="alert alert-warning">
                  <h6 className="mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Are you sure you want to delete this review?
                  </h6>
                  
                  {/* Show who the review was for */}
                  <div className="card mb-3">
                    <div className="card-header">
                      <strong>Review for:</strong>
                    </div>
                    <div className="card-body">
                      {renderSellerInfo()}
                    </div>
                  </div>
                  
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <span className="badge bg-primary me-2" style={{fontSize: '0.9rem'}}>
                          {reviewToEdit?.rating} ★
                        </span>
                        <strong>Your Rating</strong>
                      </div>
                      <div className="mb-2">
                        <strong>Your Comment:</strong>
                      </div>
                      <p className="mb-0 p-2 bg-light rounded" style={{fontStyle: 'italic'}}>
                        "{reviewToEdit?.comment}"
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-danger bg-opacity-10 rounded">
                    <p className="mb-0 text-danger">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      <strong>Warning:</strong> This action cannot be undone!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="form-label">
                      <i className="bi bi-star me-2"></i>
                      <strong>Your Rating</strong>
                    </label>
                    <select 
                      className="form-select form-select-lg" 
                      value={rating} 
                      onChange={(e) => setRating(e.target.value)}
                      required
                    >
                      <option value={5}>★★★★★ - Excellent (5/5)</option>
                      <option value={4}>★★★★☆ - Very Good (4/5)</option>
                      <option value={3}>★★★☆☆ - Good (3/5)</option>
                      <option value={2}>★★☆☆☆ - Fair (2/5)</option>
                      <option value={1}>★☆☆☆☆ - Poor (1/5)</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-chat-text me-2"></i>
                      <strong>Your Review</strong>
                    </label>
                    <textarea 
                      className="form-control" 
                      rows="5" 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={mode === 'create' 
                        ? `Share your experience with ${seller?.full_name || 'this seller'}. How was the communication, item condition, delivery, etc.?`
                        : "Update your review..."
                      }
                      required
                      maxLength={500}
                    />
                    <div className="form-text d-flex justify-content-between">
                      <span>{comment.length}/500 characters</span>
                      <span className="text-muted">
                        <i className="bi bi-lightbulb me-1"></i>
                        Be honest and helpful to other buyers
                      </span>
                    </div>
                  </div>
                  
                  {mode === 'create' && (
                    <div className="alert alert-info border-0">
                      <div className="d-flex">
                        <i className="bi bi-info-circle me-2 mt-1"></i>
                        <div>
                          <strong>About Seller Reviews:</strong>
                          <ul className="mb-0 mt-1 ps-3">
                            <li>Your review helps other buyers make informed decisions</li>
                            <li>Focus on seller communication, item accuracy, and delivery</li>
                            <li>Be respectful and constructive in your feedback</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                <i className="bi bi-x-circle me-1"></i>
                Cancel
              </button>
              <button 
                type="submit" 
                className={`btn ${mode === 'delete' ? 'btn-danger' : 'btn-primary'}`}
                disabled={loading || sellerLoading || (mode === 'create' && (!currentUser?.id || !item?.seller_id))}
              >
                {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                {mode === 'delete' ? (
                  <><i className="bi bi-trash me-1"></i>{getSubmitButtonText()}</>
                ) : (
                  <><i className="bi bi-check-circle me-1"></i>{getSubmitButtonText()}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;