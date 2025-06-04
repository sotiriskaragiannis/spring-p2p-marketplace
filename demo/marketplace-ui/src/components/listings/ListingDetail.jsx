import React from 'react';

const ListingDetail = ({ listing }) => {
  if (!listing) {
    return <div>No listing found.</div>;
  }

  return (
    <div className="listing-detail">
      <h2>{listing.title}</h2>
      <img src={listing.image} alt={listing.title} />
      <p>{listing.description}</p>
      <p>Price: ${listing.price}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ListingDetail;