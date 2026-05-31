import React, { useState } from 'react';
import styles from './SelectedRecipePage.module.css';
import { Header, Navigation } from '../../components/Layout';

/**
 * SelectedRecipePage Component
 * Displays detailed view of a single recipe with ingredients and instructions
 */
const SelectedRecipePage = () => {
  const [activeTab, setActiveTab] = useState('recetas');

  // Mock recipe data
  const recipe = {
    id: 1,
    title: 'Pépitas de Chocolate Clásicas',
    badge: 'TOP RATED',
    description:
      '"The golden perfection with crispy edges and a gooey center that melts in your mouth. A foolproof recipe for any occasion."',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAu-bjNfQlyd258G5vwXf2AP6_Q3LbWJfjCjZ3QoLhRRvxMjjvAnhKEES5td0scq9i6bw8BpWB4_p8jUIqlnb7fD1BfrFu9eSM0YuuhmMDt15ijCdxfXrIPRgw90JdDS0d-_ohTXJOGj_v_aBGvCK7_dj7ld3mFgdgzn_evb5TqyrzbFqvnzqvuGXBwMQt91OThZ2PC9WdF_xUyeBpn7dVzDX_ouG2aqvzOaaEq0pS9DsuqtSEwqtd4HzXoYt2b84G57XrXZHkKRzeG',
    prepTime: 15,
    cookTime: 20,
    servings: 24,
    rating: 4.8,
    reviews: 24,
    ingredients: [
      { name: '250g Harina de Trigo', quantity: '250', unit: 'g' },
      { name: '150g Chispas de Chocolate', quantity: '150', unit: 'g' },
      { name: '100g Mantequilla (Softened)', quantity: '100', unit: 'g' },
      { name: '1 Huevo Grande', quantity: '1', unit: 'piezas' },
      { name: '100g Brown Sugar', quantity: '100', unit: 'g' },
      { name: '5g Vanilla Extract', quantity: '5', unit: 'g' },
    ],
    instructions: [
      {
        step: 1,
        description:
          'Preheat your oven to 180°C (350°F). Line two large baking sheets with parchment paper to ensure no sticking and even browning of the cookie bottoms.',
      },
      {
        step: 2,
        description:
          'In a large bowl, beat the softened butter, brown sugar, and granulated sugar together until the mixture is light, fluffy, and perfectly creamy. This creates the "chewy" base we love.',
      },
      {
        step: 3,
        description:
          'Gradually fold in the flour and a pinch of salt. Once just combined, pour in the star of the show: the chocolate chips. Mix gently to ensure chocolate in every bite!',
      },
      {
        step: 4,
        description:
          'Scoop rounded tablespoons of dough onto your sheets. Bake for 10-12 minutes until edges are golden but the center remains soft. Let them cool slightly—if you can wait!',
      },
    ],
  };

  const [checkedIngredients, setCheckedIngredients] = useState({});

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className={styles.selected_recipe_page}>
      {/* Header */}
      <Header profileInitials="JD" />

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className={styles.main_content}>
        {/* Hero Section */}
        <section className={styles.hero_section}>
          <div className={styles.hero_image_container}>
            <div className={styles.hero_glow}></div>
            <img src={recipe.image} alt={recipe.title} className={styles.hero_image} />
          </div>

          <div className={styles.hero_content}>
            <div className={styles.recipe_badge}>{recipe.badge}</div>
            <h1 className={styles.recipe_title}>{recipe.title}</h1>

            <div className={styles.recipe_description_box}>
              <p className={styles.recipe_description}>{recipe.description}</p>
            </div>
          </div>
        </section>

        {/* Recipe Meta Info */}
        <section className={styles.recipe_meta}>
          <div className={styles.meta_item}>
            <span className="material-symbols-outlined">schedule</span>
            <div className={styles.meta_content}>
              <p className={styles.meta_label}>PREP TIME</p>
              <p className={styles.meta_value}>{recipe.prepTime} min</p>
            </div>
          </div>

          <div className={styles.meta_item}>
            <span className="material-symbols-outlined">local_fire_department</span>
            <div className={styles.meta_content}>
              <p className={styles.meta_label}>COOK TIME</p>
              <p className={styles.meta_value}>{recipe.cookTime} min</p>
            </div>
          </div>

          <div className={styles.meta_item}>
            <span className="material-symbols-outlined">group</span>
            <div className={styles.meta_content}>
              <p className={styles.meta_label}>SERVINGS</p>
              <p className={styles.meta_value}>{recipe.servings}</p>
            </div>
          </div>

          <div className={styles.meta_item}>
            <span className="material-symbols-outlined">star</span>
            <div className={styles.meta_content}>
              <p className={styles.meta_label}>RATING</p>
              <p className={styles.meta_value}>
                {recipe.rating}★ ({recipe.reviews})
              </p>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className={styles.content_grid}>
          {/* Ingredients Sidebar */}
          <aside className={styles.ingredients_sidebar}>
            <div className={styles.ingredients_card}>
              <div className={styles.ingredients_header}>
                <span className="material-symbols-outlined">shopping_basket</span>
                <h2 className={styles.section_title}>Ingredients</h2>
              </div>

              <ul className={styles.ingredients_list}>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className={styles.ingredient_item}>
                    <label className={styles.ingredient_checkbox_label}>
                      <input
                        type="checkbox"
                        className={styles.ingredient_checkbox}
                        checked={checkedIngredients[index] || false}
                        onChange={() => toggleIngredient(index)}
                      />
                      <div className={styles.checkbox_visual}>
                        {checkedIngredients[index] && (
                          <span className="material-symbols-outlined">check</span>
                        )}
                      </div>
                      <span
                        className={`${styles.ingredient_name} ${
                          checkedIngredients[index] ? styles.ingredient_checked : ''
                        }`}
                      >
                        {ingredient.name}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Instructions Section */}
          <section className={styles.instructions_section}>
            <div className={styles.instructions_header}>
              <span className="material-symbols-outlined">restaurant</span>
              <h2 className={styles.section_title}>Preparation Steps</h2>
            </div>

            <div className={styles.instructions_list}>
              {recipe.instructions.map((instruction) => (
                <div key={instruction.step} className={styles.instruction_item}>
                  <div className={styles.instruction_badge}>{instruction.step}</div>
                  <div className={styles.instruction_content}>
                    <p className={styles.instruction_text}>{instruction.description}</p>
                    {instruction.step === recipe.instructions.length && (
                      <div className={styles.progress_bar}>
                        <div className={styles.progress_fill}></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SelectedRecipePage;
