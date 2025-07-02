import React, { useEffect, useState } from 'react';

const WelcomeAlert = ({ username }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000); // Hide after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 10000,
      fontFamily: 'Arial, sans-serif',
      fontWeight: '600',
      fontSize: '16px',
    }}>
      Welcome, {username}!
    </div>
  );
};

export default WelcomeAlert;
