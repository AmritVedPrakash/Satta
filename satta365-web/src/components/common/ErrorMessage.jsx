import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div
      style={{
        margin: '12px 14px',
        padding: '10px 14px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        color: '#b91c1c',
        fontSize: '0.85rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <AlertCircle size={18} />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            background: 'none',
            border: 'none',
            color: '#b91c1c',
            fontWeight: 700,
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

