import React from 'react';
import styles from './RecipeCard.module.css';

/**
 * RecipeCard Component
 * Displays a recipe with image, title, and description
 */
const CLOUDINARY_URL = 'https://res.cloudinary.com/dl90iju4b/';

const isValidImage = (url) => url && url.startsWith(CLOUDINARY_URL);

const RecipeCard = ({
  id,
  image,
  title,
  description,
  onClick = null,
}) => {
  const showImage = isValidImage(image);
  return (
    <article className={styles.recipe_card} onClick={onClick}>
      {/* Image Container */}
      <div className={styles.recipe_card_image}>
        {showImage ? (
          <img src={image} alt={title} className={styles.recipe_card_img} />
        ) : (
          <div className={styles.recipe_card_placeholder}>
            <span className="material-symbols-outlined">image_not_supported</span>
            <span>Imagen no proporcionada</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.recipe_card_content}>
        <h3 className={styles.recipe_card_title}>{title}</h3>
        {description && (
          <p className={styles.recipe_card_description}>{description}</p>
        )}
      </div>
    </article>
  );
};

export default RecipeCard;
