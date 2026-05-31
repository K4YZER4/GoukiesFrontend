import React from 'react';
import styles from './StatCard.module.css';

/**
 * StatCard Component
 * Displays a statistic with icon and value
 */
const StatCard = ({
  icon,
  title,
  value,
  subtitle = '',
  variant = 'default',
  onClick = null,
}) => {
  return (
    <div className={`${styles.stat_card} ${styles[`stat_card--${variant}`]}`} onClick={onClick}>
      {icon && (
        <div className={styles.stat_card_icon}>
          {icon}
        </div>
      )}
      <div className={styles.stat_card_content}>
        <p className={styles.stat_card_value}>{value}</p>
        <p className={styles.stat_card_title}>{title}</p>
        {subtitle && (
          <p className={styles.stat_card_subtitle}>{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
