import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AllRecipesPage.module.css';
import { Header, Navigation, MobileBottomNav } from '../../components/Layout';
import { RecipeCard } from '../../components/Cards';
import { LoadingSpinner } from '../../components/Common';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import recipeService from '../../services/recipeService';
import { recipeStorage } from '../../utils/localStorage';

/**
 * AllRecipesPage Component
 * Displays a list of all recipes for the authenticated user
 * Supports filtering and search functionality
 */
const AllRecipesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMobileTab, setActiveMobileTab] = useState('recipes');

  // Load recipes on mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setIsLoading(true);

        // Check cached data first
        const cachedRecipes = recipeStorage.getAll();
        if (cachedRecipes && cachedRecipes.length > 0) {
          setRecipes(cachedRecipes);
          setFilteredRecipes(cachedRecipes);
        }

        // Fetch fresh data from API
        if (user?.id) {
          const data = await recipeService.getAllRecipes(user.id);
          
          if (data && Array.isArray(data)) {
            setRecipes(data);
            setFilteredRecipes(data);
            recipeStorage.setAll(data); // Cache the recipes
            showToast('Recetas actualizado', 'success');
          }
        }
      } catch (error) {
        console.error('Error loading recipes:', error);
        showToast('Error al cargar las recetas', 'error');
        
        // Use cached data if available
        const cachedRecipes = recipeStorage.getAll();
        if (cachedRecipes && cachedRecipes.length > 0) {
          setRecipes(cachedRecipes);
          setFilteredRecipes(cachedRecipes);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, [user?.id, showToast]);

  // Handle search/filter
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRecipes(recipes);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = recipes.filter(
        recipe =>
          recipe.title?.toLowerCase().includes(term) ||
          recipe.descripcion?.toLowerCase().includes(term)
      );
      setFilteredRecipes(filtered);
    }
  }, [searchTerm, recipes]);

  const handleCreateRecipe = () => {
    navigate('/nueva-receta');
  };

  const handleRecipeClick = (id) => {
    navigate(`/recetas/${id}`);
  };

  // Show loading spinner
  if (isLoading && recipes.length === 0) {
    return (
      <div className={styles.all_recipes_page}>
        <Header />
        <Navigation />
        <div className={styles.recipes_loading}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.all_recipes_page}>
      {/* Header */}
      <Header onSearch={setSearchTerm} />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className={styles.recipes_main}>
        <div className={styles.recipes_container}>
          {/* Header Section */}
          <section className={styles.recipes_header}>
            <div className={styles.recipes_header_content}>
              <h1 className={styles.recipes_title}>Todas mis Recetas</h1>
              <p className={styles.recipes_subtitle}>
                Tienes {recipes.length} receta{recipes.length !== 1 ? 's' : ''} guardada{recipes.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button 
              className={styles.recipes_create_btn}
              onClick={handleCreateRecipe}
            >
              <span className="material-symbols-outlined">add_circle</span>
              Nueva Receta
            </button>
          </section>

          {/* Recipes Grid */}
          <section className={styles.recipes_section}>
            {filteredRecipes.length > 0 ? (
              <div className={styles.recipes_grid}>
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => handleRecipeClick(recipe.id)}
                    className={styles.recipe_card_wrapper}
                  >
                    <RecipeCard
                      id={recipe.id}
                      image={recipe.image}
                      title={recipe.title}
                      description={recipe.descripcion}
                      rating={recipe.rating}
                      difficulty={recipe.dificultad}
                      time={recipe.tiempo}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.recipes_empty}>
                <div className={styles.recipes_empty_icon}>
                  <span className="material-symbols-outlined">
                    menu_book
                  </span>
                </div>
                <h3 className={styles.recipes_empty_title}>
                  {searchTerm ? 'No se encontraron recetas' : 'No hay recetas aún'}
                </h3>
                <p className={styles.recipes_empty_subtitle}>
                  {searchTerm
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Crea una nueva receta para comenzar'}
                </p>
                {!searchTerm && (
                  <button 
                    className={styles.recipes_empty_btn}
                    onClick={handleCreateRecipe}
                  >
                    + Crear Primera Receta
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeMobileTab} onTabChange={setActiveMobileTab} />
    </div>
  );
};

export default AllRecipesPage;
