import React, { useState } from 'react';
import api from '../../services/api';

const ReviewModal = ({ show, onHide, item, currentUser, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Please enter a comment for your review');
      return;
    }

    if (!currentUser || !currentUser.id) {
      setError('You must be logged in to submit a review');
      return;
    }

    if (!item || !item.seller_id) {
      setError('Item seller information is missing');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        rating: parseInt(rating),
        comment: comment.trim(),
        reviewer_id: currentUser.id,
        reviewee_id: item.seller_id,
        date: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
      };

      await api.review.createReview(reviewData);
      
      // Reset form
      setRating(5);
      setComment('');
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      // Close modal
      onHide();
      
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(5);
    setComment('');
    setError('');
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Review Product: {item.title}</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <select 
                  className="form-select" 
                  value={rating} 
                  onChange={(e) => setRating(e.target.value)}
                  required
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Good</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  required
                  maxLength={500}
                />
                <div className="form-text">{comment.length}/500 characters</div>
              </div>
              
              <div className="alert alert-info">
                <small>
                  <strong>Note:</strong> This review will be associated with the seller of this item.
                </small>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading || !currentUser?.id || !item?.seller_id}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;