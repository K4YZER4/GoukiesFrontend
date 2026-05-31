import React from 'react';
import styles from './RecipeCard.module.css';

/**
 * RecipeCard Component
 * Displays a recipe with image, title, and description
 */
const RecipeCard = ({
  id,
  image,
  title,
  description,
  rating = 4.9,
  difficulty = 'Fácil',
  time = '15 min',
  category = '',
  onClick = null,
}) => {
  return (
    <article className={styles.recipe_card} onClick={onClick}>
      {/* Image Container */}
      <div className={styles.recipe_card_image}>
        <img src={image} alt={title} className={styles.recipe_card_img} />
        {rating && (
          <div className={styles.recipe_card_rating}>
            <span className="material-symbols-outlined recipe-icon-star">
              star
            </span>
            <span className={styles.recipe_card_rating_text}>{rating}</span>
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

      {/* Meta Info */}
      {(time || difficulty) && (
        <div className={styles.recipe_card_footer}>
          {time && (
            <div className={styles.recipe_card_meta}>
              <span className="material-symbols-outlined">timer</span>
              <span>{time}</span>
            </div>
          )}
          {difficulty && (
            <div className={styles.recipe_card_meta}>
              <span className="material-symbols-outlined">equalizer</span>
              <span>{difficulty}</span>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default RecipeCard;
