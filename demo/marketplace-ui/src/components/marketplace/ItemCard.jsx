import React from 'react';

const ItemCard = ({ 
  item, 
  sellerUsername, 
  isSelected, 
  isOwnedByUser, 
  onClick,
  getImageUrl 
}) => {
  return (
    <div 
      className={`card h-100 ${isSelected ? 'border-primary' : ''} ${
        isOwnedByUser ? 'border-success' : ''
      }`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {isOwnedByUser && (
        <div className="position-absolute top-0 end-0 p-2">
          <span className="badge bg-success">Your Item</span>
        </div>
      )}
      
      {item.images && item.images.length > 0 ? (
        <img
          src={getImageUrl(item.images[0].id)}
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
          Seller: {sellerUsername}
        </small>
        <span className={`badge ${item.sold ? 'bg-danger' : 'bg-success'}`}>
          {item.sold ? 'Sold' : 'Available'}
        </span>
      </div>
    </div>
  );
};

export default ItemCard;