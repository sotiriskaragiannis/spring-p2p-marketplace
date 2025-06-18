import React, { useState } from 'react';
import EditItemForm from './EditItemForm';
import DeleteConfirmation from './DeleteConfirmation';
import ReviewModal from './ReviewModal';
import api from '../../services/api';

const ItemDetail = ({ 
  item, 
  categories, 
  sellerDetails,
  isMyItem,
  currentUser,
  onUpdate,
  onDelete,
  getImageUrl
}) => {
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Check if item is in user's favorites
  React.useEffect(() => {
    if (currentUser && currentUser.id) {
      checkIfFavorited();
    }
  }, [currentUser, item]);

  const checkIfFavorited = async () => {
    try {
      const favorites = await api.user.getFavorites(currentUser.id);
      const isInFavorites = favorites.some(fav => fav.id === item.id);
      setIsFavorited(isInFavorites);
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const handleAddToFavorites = async () => {
    if (!currentUser) {
      alert('Please log in to add items to favorites');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        await api.user.removeFromFavorites(currentUser.id, item.id);
        setIsFavorited(false);
      } else {
        await api.user.addToFavorites(currentUser.id, item.id);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('Failed to update favorites. Please try again.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleReviewProduct = () => {
    if (!currentUser) {
      alert('Please log in to review products');
      return;
    }
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    // Optionally refresh data or show success message
    console.log('Review submitted successfully');
  };

  const getSellerInfo = (sellerId) => {
    return sellerDetails[sellerId] || { username: 'Unknown', full_name: 'Unknown' };
  };

  const getCategoryName = (categoryId) => {
    return categories[categoryId]?.name || 'Uncategorized';
  };

  return (
    <div id="itemDetails" className="mt-5">
      <div className="card">
        <div className="card-header">
          <h3>Item Details</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-5">
              {item.images && item.images.length > 0 ? (
                <div className="item-gallery">
                  <img
                    src={getImageUrl(item.images[0].id)}
                    className="img-fluid rounded"
                    alt={item.title}
                  />
                  {item.images.length > 1 && (
                    <div className="row mt-2">
                      {item.images.slice(0, 4).map(image => (
                        <div key={image.id} className="col-3">
                          <img
                            src={getImageUrl(image.id)}
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
                {item.title}
                {isMyItem && (
                  <span className="badge bg-success ms-2">Your Item</span>
                )}
              </h2>
              <p className="lead">${item.price}</p>
              
              <div className="mb-3">
                <span className={`badge ${item.sold ? 'bg-danger' : 'bg-success'} me-2`}>
                  {item.sold ? 'Sold' : 'Available'}
                </span>
                {item.itemCondition && (
                  <span className="badge bg-secondary">{item.itemCondition}</span>
                )}
              </div>
              
              <h5>Description:</h5>
              <p>{item.description || 'No description provided'}</p>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <strong>Category:</strong> {getCategoryName(item.category_id)}
                </div>
              </div>
              
              <div className="card mb-3">
                <div className="card-header">
                  Seller Information
                </div>
                <div className="card-body">
                  {isMyItem ? (
                    <h6>You (This is your item)</h6>
                  ) : (
                    <>
                      <h6>{getSellerInfo(item.seller_id).full_name}</h6>
                      <p className="mb-1">@{getSellerInfo(item.seller_id).username}</p>
                      {getSellerInfo(item.seller_id).city && getSellerInfo(item.seller_id).country && (
                        <p className="mb-1">
                          Location: {getSellerInfo(item.seller_id).city}, 
                          {getSellerInfo(item.seller_id).country}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {!item.sold && !isMyItem && (
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleReviewProduct}
                    disabled={!currentUser}
                  >
                    Review Product
                  </button>
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={handleAddToFavorites}
                    disabled={!currentUser || favoriteLoading}
                  >
                    {favoriteLoading ? 'Loading...' : (isFavorited ? 'Remove from Favorites' : 'Add to Favorites')}
                  </button>
                </div>
              )}
              
              {isMyItem && !editMode && (
                <div className="d-grid gap-2">
                  <button className="btn btn-warning" onClick={() => setEditMode(true)}>
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

              {editMode && (
                <EditItemForm
                  item={item}
                  categories={categories}
                  onSave={() => {
                    setEditMode(false);
                    onUpdate();
                  }}
                  onCancel={() => setEditMode(false)}
                />
              )}

              {deleteConfirm && (
                <DeleteConfirmation
                  item={item}
                  onConfirm={() => {
                    setDeleteConfirm(false);
                    onDelete();
                  }}
                  onCancel={() => setDeleteConfirm(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Form */}
      {editMode && (
        <EditItemForm
          item={item}
          categories={categories}
          onUpdate={onUpdate}
          onCancel={() => setEditMode(false)}
        />
      )}
      
      {/* Delete Confirmation */}
      {deleteConfirm && (
        <DeleteConfirmation
          item={item}
          onConfirm={onDelete}
          onCancel={() => setDeleteConfirm(false)}
        />
      )}
      
      {/* Review Modal */}
      <ReviewModal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        item={item}
        currentUser={currentUser}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default ItemDetail;