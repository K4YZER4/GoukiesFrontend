import React from 'react';
import styles from './LoadingSpinner.module.css';

/**
 * LoadingSpinner - Galletita animada que gira y se va comiendo
 * Uso: <LoadingSpinner /> o <LoadingSpinner text="Cargando..." />
 */

const LoadingSpinner = ({ text = 'Cargando...' }) => {
  return (
    <div className={styles.spinner_overlay}>
      <div className={styles.spinner_content}>
        <div className={styles.cookie_container}>
          <svg
            className={styles.cookie}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cuerpo de la galletita */}
            <circle cx="50" cy="50" r="45" className={styles.cookie_body} />

            {/* Chips de chocolate */}
            <circle cx="35" cy="35" r="6" className={styles.chip} />
            <circle cx="55" cy="40" r="5" className={styles.chip} />
            <circle cx="65" cy="55" r="6" className={styles.chip} />
            <circle cx="50" cy="65" r="5" className={styles.chip} />
            <circle cx="35" cy="60" r="5" className={styles.chip} />

            {/* Efecto de muerde */}
            <path
              className={styles.bite}
              d="M 95 50 Q 100 50 100 55 Q 95 60 85 55 Q 90 50 95 50"
            />
          </svg>
        </div>
        {text && <p className={styles.spinner_text}>{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
