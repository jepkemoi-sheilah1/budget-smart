import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        &copy; {new Date().getFullYear()} Budget Smart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
