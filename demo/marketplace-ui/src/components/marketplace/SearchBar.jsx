import React from 'react';

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="mb-4">
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search for items..."
          value={value}
          onChange={onChange}
        />
        {value && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;