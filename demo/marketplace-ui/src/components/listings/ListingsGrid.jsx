import React from 'react';
import ListingCard from './ListingCard';

const ListingsGrid = ({ listings }) => {
  return (
    <div className="row">
      {listings.map((listing) => (
        <div className="col-md-4" key={listing.id}>
          <ListingCard listing={listing} />
        </div>
      ))}
    </div>
  );
};

export default ListingsGrid;