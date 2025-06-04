import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ItemGrid from '../components/marketplace/ItemGrid';
import SearchBar from '../components/marketplace/SearchBar';
import ItemDetail from '../components/marketplace/ItemDetail';
import CreateItemForm from '../components/marketplace/CreateItemForm';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorDisplay from '../components/common/ErrorDisplay';

const Listing = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [sellerDetails, setSellerDetails] = useState({});
  const [categories, setCategories] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    // Get current user from localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
    
    fetchItems();
  }, []);

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

  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setTimeout(() => {
      const detailsElement = document.getElementById('itemDetails');
      if (detailsElement) {
        detailsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  // Check if an item belongs to the current user
  const isMyItem = (item) => {
    return currentUser && item.seller_id === currentUser.id;
  };

  const handleCreateSuccess = (newItem) => {
    fetchItems();
    setShowCreateForm(false);
    setSelectedItem(newItem);
  };

  const handleUpdateItem = () => {
    fetchItems();
  };

  const handleDeleteItem = () => {
    setSelectedItem(null);
    fetchItems();
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

      {showCreateForm && (
        <CreateItemForm
          categories={categories}
          currentUser={currentUser}
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <SearchBar 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery('')}
      />
      
      {loading && <LoadingIndicator />}
      {error && <ErrorDisplay message={error} />}
      
      {!loading && !error && (
        <>
          <p>{filteredItems.length} items found</p>
          <ItemGrid 
            items={filteredItems}
            sellerDetails={sellerDetails}
            currentUser={currentUser}
            onSelectItem={handleItemSelect}
            selectedItemId={selectedItem?.id}
            isMyItem={isMyItem}
            getImageUrl={api.image.getImageUrl}
          />
        </>
      )}
      
      {selectedItem && filteredItems.some(item => item.id === selectedItem.id) && (
        <ItemDetail 
          item={selectedItem}
          categories={categories}
          sellerDetails={sellerDetails}
          isMyItem={isMyItem(selectedItem)}
          currentUser={currentUser}
          onUpdate={handleUpdateItem}
          onDelete={handleDeleteItem}
          getImageUrl={api.image.getImageUrl}
        />
      )}
    </div>
  );
};

export default Listing;