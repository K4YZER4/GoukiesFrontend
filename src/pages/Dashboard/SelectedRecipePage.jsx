import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Navigation, MobileBottomNav } from '../../components/Layout';
import { LoadingSpinner } from '../../components/Common';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import recipeService from '../../services/recipeService';
import { recipeStorage } from '../../utils/localStorage';
import styles from './SelectedRecipePage.module.css';

/**
 * SelectedRecipePage Component
 * Displays detailed view of a single recipe
 * Allows editing and deletion of recipes
 */
const SelectedRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('recipes');

  // Load recipe on mount
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setIsLoading(true);

        // Try to get from cache first
        const cachedRecipes = recipeStorage.getAll();
        const cachedRecipe = cachedRecipes?.find(r => r.id === id);
        
        if (cachedRecipe) {
          setRecipe(cachedRecipe);
        }

        // Fetch fresh data from API
        if (user?.id && id) {
          const data = await recipeService.getRecipeById(id, user.id);
          if (data) {
            setRecipe(data);
            showToast('Receta cargada', 'success');
          }
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
        showToast('Error al cargar la receta', 'error');
        
        if (!recipe) {
          navigate('/recetas');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [id, user?.id, showToast, navigate, recipe]);

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      try {
        await recipeService.deleteRecipe(id);
        showToast('Receta eliminada', 'success');
        navigate('/recetas');
      } catch (error) {
        showToast('Error al eliminar la receta', 'error');
      }
    }
  };

  const handleEdit = () => {
    // Navigate to edit page (not yet implemented)
    navigate(`/recetas/${id}/editar`);
  };

  const handleBack = () => {
    navigate('/recetas');
  };

  // Show loading spinner
  if (isLoading || !recipe) {
    return (
      <div className={styles.selected_recipe_page}>
        <Header />
        <Navigation />
        <div className={styles.recipe_loading}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.selected_recipe_page}>
      {/* Header */}
      <Header />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className={styles.recipe_main}>
        <div className={styles.recipe_container}>
          {/* Back Button */}
          <button className={styles.recipe_back_btn} onClick={handleBack}>
            <span className="material-symbols-outlined">arrow_back</span>
            Volver a Recetas
          </button>

          {/* Recipe Header */}
          <section className={styles.recipe_header}>
            <div className={styles.recipe_image_container}>
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className={styles.recipe_image}
                />
              )}
            </div>

            <div className={styles.recipe_info}>
              <h1 className={styles.recipe_title}>{recipe.title}</h1>
              <p className={styles.recipe_description}>{recipe.descripcion}</p>

              <div className={styles.recipe_meta}>
                {recipe.tiempo && (
                  <div className={styles.meta_item}>
                    <span className="material-symbols-outlined">schedule</span>
                    <span>{recipe.tiempo} min</span>
                  </div>
                )}
                {recipe.dificultad && (
                  <div className={styles.meta_item}>
                    <span className="material-symbols-outlined">difficulty</span>
                    <span>{recipe.dificultad}</span>
                  </div>
                )}
                {recipe.rating && (
                  <div className={styles.meta_item}>
                    <span className="material-symbols-outlined">star</span>
                    <span>{recipe.rating}/5</span>
                  </div>
                )}
              </div>

              <div className={styles.recipe_actions}>
                <button 
                  className={styles.recipe_btn_edit}
                  onClick={handleEdit}
                >
                  <span className="material-symbols-outlined">edit</span>
                  Editar
                </button>
                <button 
                  className={styles.recipe_btn_delete}
                  onClick={handleDelete}
                >
                  <span className="material-symbols-outlined">delete</span>
                  Eliminar
                </button>
              </div>
            </div>
          </section>

          {/* Recipe Content */}
          <section className={styles.recipe_content}>
            {recipe.ingredientes && (
              <div className={styles.recipe_section}>
                <h2 className={styles.recipe_section_title}>Ingredientes</h2>
                <ul className={styles.recipe_ingredients_list}>
                  {recipe.ingredientes.map((ingredient, idx) => (
                    <li key={idx} className={styles.ingredient_item}>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recipe.instrucciones && (
              <div className={styles.recipe_section}>
                <h2 className={styles.recipe_section_title}>Instrucciones</h2>
                <ol className={styles.recipe_instructions_list}>
                  {recipe.instrucciones.map((instruction, idx) => (
                    <li key={idx} className={styles.instruction_item}>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {recipe.notas && (
              <div className={styles.recipe_section}>
                <h2 className={styles.recipe_section_title}>Notas</h2>
                <p className={styles.recipe_notes}>{recipe.notas}</p>
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

export default SelectedRecipePage;
