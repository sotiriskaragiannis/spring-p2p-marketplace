import React, { useState } from 'react';
import api from '../../services/api';

const DeleteConfirmation = ({ item, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      await api.item.deleteItem(item.id);
      onConfirm();
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="card mt-3 border-danger">
      <div className="card-header bg-danger text-white">
        <h5 className="mb-0">Confirm Deletion</h5>
      </div>
      <div className="card-body">
        <p>Are you sure you want to delete <strong>{item.title}</strong>?</p>
        <p className="text-danger">This action cannot be undone!</p>
        
        <div className="d-flex gap-2 justify-content-end">
          <button 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;