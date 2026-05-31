import React from 'react';
import styles from './Input.module.css';

/**
 * Input Component
 * Reusable text input with optional icon
 * Supports: text, email, password, number types
 */
const Input = React.forwardRef(({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onFocus,
  onBlur,
  label = '',
  icon = null,
  error = '',
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`${styles.input_wrapper} ${className}`}>
      {label && (
        <label className={styles.input_label}>
          {label}
        </label>
      )}
      <div className={styles.input_container}>
        {icon && (
          <span className={styles.input_icon}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={`${styles.input} ${error ? styles.input_error : ''} ${icon ? styles.input_with_icon : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && (
        <span className={styles.input_error_text}>
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
