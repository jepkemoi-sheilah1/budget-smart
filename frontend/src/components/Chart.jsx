import React from 'react';

const Chart = () => {
  return (
    <div style={{
      width: 120,
      height: 120,
      borderRadius: '50%',
      border: '10px solid #ddd',
      borderTop: '10px solid #888',
      margin: '0 auto',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 14,
        color: '#555'
      }}>
        Monthly Overview
      </div>
    </div>
  );
};

export default Chart;
