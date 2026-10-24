import React from 'react';

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  maxLength,
  icon = null,
  required = false,
  className = '',
  autoComplete = 'off',
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span style={{ color: 'var(--accent-red)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span style={{ position: 'absolute', left: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className="form-input"
          style={{
            paddingLeft: icon ? 34 : 12,
            borderColor: error ? 'var(--accent-red)' : undefined,
          }}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default Input;

