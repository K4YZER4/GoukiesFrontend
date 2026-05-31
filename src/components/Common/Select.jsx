import React from 'react';
import styles from './Select.module.css';

/**
 * Select Component
 * Reusable dropdown select input
 */
const Select = React.forwardRef(({
  label = '',
  options = [],
  value,
  onChange,
  placeholder = 'Selecciona una opción',
  error = '',
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`${styles.select_wrapper} ${className}`}>
      {label && (
        <label className={styles.select_label}>
          {label}
        </label>
      )}
      <div className={styles.select_container}>
        <select
          ref={ref}
          className={`${styles.select} ${error ? styles.select_error : ''}`}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span className={styles.select_error_text}>
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
