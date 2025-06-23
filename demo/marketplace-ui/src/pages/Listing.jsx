import React, { useState, useEffect } from 'react';
import ItemGrid from '../components/marketplace/ItemGrid';
import SearchBar from '../components/marketplace/SearchBar';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ItemModal from '../components/marketplace/ItemModal';
import ItemViewModal from '../components/marketplace/ItemViewModal';
import DeleteConfirmation from '../components/marketplace/DeleteConfirmation';
import ReviewModal from '../components/marketplace/ReviewModal';
import api from '../services/api';

const Listing = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [sellerDetails, setSellerDetails] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }

    fetchItems();
    fetchCategories();
  }, []);

  // Check if selected item is favorited when it changes
  useEffect(() => {
    if (selectedItem && currentUser) {
      checkIfFavorited();
    }
  }, [selectedItem, currentUser]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await api.category.getAllCategories();
      const categoriesMap = {};
      categoriesData.forEach(category => {
        categoriesMap[category.id] = category;
      });
      setCategories(categoriesMap);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const itemsData = await api.item.getAllItems();
      setItems(itemsData);
      
      // Extract unique seller IDs and fetch their details
      const sellerIds = [...new Set(itemsData.map(item => item.seller_id))];
      
      try {
        const sellerDetailsMap = {};
        await Promise.all(sellerIds.map(async (sellerId) => {
          try {
            const sellerData = await api.user.getProfile(sellerId);
            sellerDetailsMap[sellerId] = sellerData;
          } catch (sellerErr) {
            console.error(`Error fetching seller ${sellerId}:`, sellerErr);
            sellerDetailsMap[sellerId] = { 
              username: 'Unknown', 
              full_name: 'Unknown User',
              city: '',
              country: ''
            };
          }
        }));
        setSellerDetails(sellerDetailsMap);
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

  const checkIfFavorited = async () => {
    try {
      const favorites = await api.user.getFavorites(currentUser.id);
      const isInFavorites = favorites.some(fav => fav.id === selectedItem.id);
      setIsFavorited(isInFavorites);
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };
  
  // Check if an item belongs to the current user
  const isMyItem = (item) => {
    return currentUser && item.seller_id === currentUser.id;
  };

  const handleCreateSuccess = (newItem) => {
    fetchItems();
    setShowCreateModal(false);
    // Optionally open the view modal for the newly created item
    setSelectedItem(newItem);
    setShowViewModal(true);
  };

  const handleEditSuccess = (updatedItem) => {
    fetchItems();
    setShowEditModal(false);
    // Update selected item with new data and stay in view modal
    setSelectedItem(updatedItem);
    setShowViewModal(true);
  };

  const handleDeleteSuccess = () => {
    fetchItems();
    setShowDeleteConfirm(false);
    setShowViewModal(false);
    setSelectedItem(null);
  };

  const handleAddToFavorites = async () => {
    if (!currentUser) {
      alert('Please log in to add items to favorites');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        await api.user.removeFromFavorites(currentUser.id, selectedItem.id);
        setIsFavorited(false);
      } else {
        await api.user.addToFavorites(currentUser.id, selectedItem.id);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('Failed to update favorites. Please try again.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleReview = () => {
    if (!currentUser) {
      alert('Please log in to review');
      return;
    }
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    console.log('Review submitted successfully');
  };

  const handleViewModalClose = () => {
    setShowViewModal(false);
    setSelectedItem(null);
  };

  const handleEditFromView = () => {
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const handleDeleteFromView = () => {
    setShowViewModal(false);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="listing-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Marketplace Items</h1>
        {currentUser && (
          <button 
            className="btn btn-primary" 
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-plus me-1"></i>
            Create New Item
          </button>
        )}
      </div>

      <SearchBar 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery('')}
      />
      
      {loading && <LoadingIndicator />}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {!loading && !error && (
        <ItemGrid 
          items={filteredItems}
          sellerDetails={sellerDetails}
          currentUser={currentUser}
          onSelectItem={handleItemSelect}
          selectedItemId={selectedItem?.id}
          isMyItem={isMyItem}
          getImageUrl={api.image.getImageUrl}
        />
      )}

      {/* Create Item Modal */}
      <ItemModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        mode="create"
        categories={categories}
        currentUser={currentUser}
        onSuccess={handleCreateSuccess}
      />

      {/* Item View Modal */}
      <ItemViewModal
        show={showViewModal}
        onHide={handleViewModalClose}
        item={selectedItem}
        categories={categories}
        sellerDetails={sellerDetails}
        currentUser={currentUser}
        onEdit={handleEditFromView}
        onDelete={handleDeleteFromView}
        onReview={handleReview}
        onFavoriteToggle={handleAddToFavorites}
        isFavorited={isFavorited}
        favoriteLoading={favoriteLoading}
      />

      {/* Edit Item Modal */}
      <ItemModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        mode="edit"
        item={selectedItem}
        categories={categories}
        currentUser={currentUser}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedItem && (
        <DeleteConfirmation
          item={selectedItem}
          onConfirm={handleDeleteSuccess}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        item={selectedItem}
        currentUser={currentUser}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default Listing;