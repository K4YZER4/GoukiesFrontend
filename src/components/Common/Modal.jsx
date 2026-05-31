import React from "react";
import styles from "./Modal.module.css";

/**
 * Modal Component
 * Generic modal/dialog component
 */
const Modal = ({ isOpen, onClose, title, children, size = "medium", closeOnBackdropClick = true }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`${styles.modal_backdrop} ${isOpen ? styles.modal_open : ""}`} onClick={handleBackdropClick}>
      <div className={`${styles.modal_content} ${styles[`modal_${size}`]}`}>
        <div className={styles.modal_header}>
          <h2 className={styles.modal_title}>{title}</h2>
          <button
            className={styles.modal_close_btn}
            onClick={onClose}
            type="button"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className={styles.modal_body}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
