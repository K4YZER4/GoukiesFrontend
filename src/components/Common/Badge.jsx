import React from 'react';
import styles from './Badge.module.css';

/**
 * Badge Component
 * Small label for tags, categories, status indicators
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon = null,
  ...props
}) => {
  const badgeClass = [
    styles.badge,
    styles[`badge--${variant}`],
    styles[`badge--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={badgeClass} {...props}>
      {icon && <span className={styles.badge_icon}>{icon}</span>}
      <span className={styles.badge_text}>{children}</span>
    </span>
  );
};

export default Badge;
