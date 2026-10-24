import React from 'react';

export const Loader = ({ message = 'Loading...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        gap: 12,
        color: 'var(--text-secondary)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: '3px solid #cbd5e1',
          borderTopColor: 'var(--primary-color)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{message}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;

