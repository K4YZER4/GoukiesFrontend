import React from 'react';
import styles from './Card.module.css';

/**
 * Card Component
 * Generic container for content with consistent styling
 */
const Card = ({
  children,
  className = '',
  variant = 'default',
  shadow = true,
  border = true,
  padding = 'md',
  ...props
}) => {
  const cardClass = [
    styles.card,
    styles[`card--${variant}`],
    shadow && styles.card_shadow,
    border && styles.card_border,
    styles[`card--padding-${padding}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

export default Card;
