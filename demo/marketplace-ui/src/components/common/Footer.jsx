import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p className="text-center">© {new Date().getFullYear()} P2P Marketplace. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;