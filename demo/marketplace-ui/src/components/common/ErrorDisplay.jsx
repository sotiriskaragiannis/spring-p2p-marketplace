import React from 'react';

const ErrorDisplay = ({ message }) => (
  <div className="alert alert-danger">
    {message}
  </div>
);

export default ErrorDisplay;