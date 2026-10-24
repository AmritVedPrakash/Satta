import React from 'react';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary | gold | secondary | danger
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  icon = null,
}) => {
  const variantClass = {
    primary: 'btn-primary',
    gold: 'btn-gold',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  }[variant] || 'btn-primary';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn ${variantClass} ${fullWidth ? 'btn-block' : ''} ${className}`}
    >
      {loading ? (
        <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;

