import React from 'react';
import { useToast } from '../../hooks/useToast';
import styles from './Toast.module.css';

/**
 * Toast Container - Renderiza todos los toasts activos
 * Se coloca una sola vez en la app (App.jsx)
 */

const Toast = ({ id, message, type }) => {
  const { removeToast } = useToast();

  const handleClose = () => {
    removeToast(id);
  };

  const iconMap = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  return (
    <div className={`${styles.toast} ${styles[`toast_${type}`]}`}>
      <div className={styles.toast_content}>
        <span className={`${styles.toast_icon} material-symbols-outlined`}>
          {iconMap[type]}
        </span>
        <span className={styles.toast_message}>{message}</span>
      </div>
      <button
        className={styles.toast_close}
        onClick={handleClose}
        aria-label="Cerrar notificación"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
};

/**
 * ToastContainer - Renderiza el contenedor de todos los toasts
 */

export const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className={styles.toast_container}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
        />
      ))}
    </div>
  );
};

export default Toast;
