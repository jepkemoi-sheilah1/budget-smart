import React from 'react';

const Navbar = () => {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      borderTop: '1px solid #ccc',
      backgroundColor: '#fff',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      fontSize: 24
    }}>
      <div role="img" aria-label="home" style={{ cursor: 'pointer' }}>🏠</div>
      <div role="img" aria-label="add" style={{ cursor: 'pointer' }}>➕</div>
      <div role="img" aria-label="clock" style={{ cursor: 'pointer' }}>⏰</div>
      <div role="img" aria-label="settings" style={{ cursor: 'pointer' }}>⚙️</div>
    </nav>
  );
};

export default Navbar;
