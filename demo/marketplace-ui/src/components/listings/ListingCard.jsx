import React from 'react';
import PropTypes from 'prop-types';

const ListingCard = ({ title, description, price, imageUrl }) => {
  return (
    <div className="card">
      <img src={imageUrl} alt={title} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text"><strong>${price}</strong></p>
        <a href="#" className="btn btn-primary">View Listing</a>
      </div>
    </div>
  );
};

ListingCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default ListingCard;