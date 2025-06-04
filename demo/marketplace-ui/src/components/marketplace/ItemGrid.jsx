import React from 'react';
import ItemCard from './ItemCard';

const ItemGrid = ({ 
  items, 
  sellerDetails, 
  currentUser, 
  onSelectItem, 
  selectedItemId, 
  isMyItem,
  getImageUrl
}) => {
  return (
    <div className="row">
      {items.length > 0 ? (
        items.map(item => (
          <div key={item.id} className="col-md-4 col-sm-6 mb-4">
            <ItemCard 
              item={item}
              sellerUsername={sellerDetails[item.seller_id]?.username || 'Unknown'}
              isSelected={selectedItemId === item.id}
              isOwnedByUser={isMyItem(item)}
              onClick={() => onSelectItem(item)}
              getImageUrl={getImageUrl}
            />
          </div>
        ))
      ) : (
        <div className="col-12 text-center">
          <p>No items match your search. Try adjusting your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ItemGrid;