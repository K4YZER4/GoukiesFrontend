import React from 'react';
import styles from './ProductCard.module.css';

/**
 * ProductCard Component
 * Displays a product/ingredient card
 */
const ProductCard = ({
  name,
  brand = '',
  category = '',
  quantity = '',
  unit = '',
  status = 'Suficiente',
  image = null,
  onEdit = null,
  onDelete = null,
}) => {
  return (
    <div className={styles.product_card}>
      {/* Header with name */}
      <div className={styles.product_card_header}>
        <h3 className={styles.product_card_title}>{name}</h3>
      </div>

      {/* Content */}
      <div className={styles.product_card_content}>
        {brand && (
          <div className={styles.product_card_row}>
            <span className={styles.product_card_label}>Marca:</span>
            <span className={styles.product_card_value}>{brand}</span>
          </div>
        )}

        {category && (
          <div className={styles.product_card_row}>
            <span className={styles.product_card_label}>Categoría:</span>
            <span className={styles.product_card_badge}>{category}</span>
          </div>
        )}

        {quantity && (
          <div className={styles.product_card_row}>
            <span className={styles.product_card_label}>Cantidad:</span>
            <span className={styles.product_card_value}>
              {quantity} {unit}
            </span>
          </div>
        )}

        {status && (
          <div className={styles.product_card_row}>
            <span className={styles.product_card_label}>Estado:</span>
            <span className={`${styles.product_card_status} ${styles[`product_card_status--${status.toLowerCase().replace(' ', '-')}`]}`}>
              <span className={styles.product_card_status_dot}></span>
              {status}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className={styles.product_card_actions}>
          {onEdit && (
            <button
              className={styles.product_card_action_btn}
              onClick={onEdit}
              title="Editar"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
          )}
          {onDelete && (
            <button
              className={`${styles.product_card_action_btn} ${styles.product_card_action_btn_delete}`}
              onClick={onDelete}
              title="Eliminar"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
