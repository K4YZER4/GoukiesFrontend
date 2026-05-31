import React, { useState } from 'react';
import styles from './AllRecipesPage.module.css';
import { Header, Navigation, MobileBottomNav } from '../../components/Layout';
import { RecipeCard } from '../../components/Cards';
import { Button, Badge } from '../../components';
import { mockAllRecipes } from '../Dashboard/mockRecipes';

/**
 * AllRecipesPage Component
 * Displays all recipes in a grid layout with filtering and view options
 */
const AllRecipesPage = () => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [activeMobileTab, setActiveMobileTab] = useState('recipes');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'chocolate', 'frutas', 'saludables', 'sin-gluten'];

  const filteredRecipes =
    selectedCategory === 'all'
      ? mockAllRecipes
      : mockAllRecipes.filter((recipe) =>
          recipe.id % 2 === 0 ? selectedCategory === 'chocolate' : selectedCategory !== 'chocolate'
        );

  return (
    <div className={styles.all_recipes_page}>
      {/* Header */}
      <Header profileInitials="JD" />

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className={styles.all_recipes_main}>
        <div className={styles.all_recipes_container}>
          {/* Page Header */}
          <section className={styles.all_recipes_header}>
            <div className={styles.all_recipes_title_section}>
              <h2 className={styles.all_recipes_title}>Mis Recetas</h2>
              <p className={styles.all_recipes_subtitle}>
                {filteredRecipes.length} deliciosas recetas de galletas
              </p>
            </div>

            {/* View Controls */}
            <div className={styles.all_recipes_controls}>
              {/* View Mode Toggle */}
              <div className={styles.view_mode_toggle}>
                <button
                  className={`${styles.view_mode_btn} ${
                    viewMode === 'grid' ? styles.view_mode_btn_active : ''
                  }`}
                  onClick={() => setViewMode('grid')}
                  title="Vista de diseño"
                >
                  <span className="material-symbols-outlined">grid_view</span>
                  <span className={styles.view_mode_label}>Vista Diseño</span>
                </button>
                <button
                  className={`${styles.view_mode_btn} ${
                    viewMode === 'list' ? styles.view_mode_btn_active : ''
                  }`}
                  onClick={() => setViewMode('list')}
                  title="Vista de edición"
                >
                  <span className="material-symbols-outlined">list</span>
                  <span className={styles.view_mode_label}>Edición</span>
                </button>
              </div>

              {/* New Recipe Button */}
              <Button variant="primary" size="md">
                <span className="material-symbols-outlined">add</span>
                Nueva Receta
              </Button>
            </div>
          </section>

          {/* Recipes Grid */}
          <section className={styles.all_recipes_content}>
            {/* Filter Badges */}
            <div className={styles.all_recipes_filters}>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${styles.filter_badge} ${
                    selectedCategory === category ? styles.filter_badge_active : ''
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all'
                    ? 'Todas'
                    : category === 'chocolate'
                    ? 'Chocolate'
                    : category === 'frutas'
                    ? 'Frutas'
                    : category === 'saludables'
                    ? 'Saludables'
                    : 'Sin Gluten'}
                </button>
              ))}
            </div>

            {/* Recipes Grid */}
            <div className={styles.all_recipes_grid}>
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  image={recipe.image}
                  title={recipe.title}
                  description={recipe.description}
                  rating={recipe.rating}
                />
              ))}

              {/* New Recipe Card - Placeholder */}
              <div className={styles.new_recipe_card}>
                <div className={styles.new_recipe_icon_container}>
                  <span className="material-symbols-outlined">add_circle</span>
                </div>
                <h3 className={styles.new_recipe_title}>¿Tienes una nueva idea?</h3>
                <p className={styles.new_recipe_description}>
                  Haz clic aquí para empezar a escribir tu próxima obra maestra horneada.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeMobileTab} onTabChange={setActiveMobileTab} />
    </div>
  );
};

export default AllRecipesPage;
