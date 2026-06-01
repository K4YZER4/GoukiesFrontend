import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Navigation, MobileBottomNav } from '../../components/Layout';
import { LoadingSpinner } from '../../components/Common';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import recipeService from '../../services/recipeService';
import { recipeStorage } from '../../utils/localStorage';
import { normalizeRecipe } from '../../utils/normalizeRecipe';
import styles from './SelectedRecipePage.module.css';

/**
 * SelectedRecipePage Component
 * Displays detailed view of a single recipe
 * Allows editing and deletion of recipes
 */
const CLOUDINARY_URL = 'https://res.cloudinary.com/dl90iju4b/';

const isValidImage = (url) => url && url.startsWith(CLOUDINARY_URL);

const SelectedRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
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
          setRecipe(normalizeRecipe(cachedRecipe));
        }

        // Fetch fresh data from API
        if (user?.id && id) {
          const data = await recipeService.getRecipeById(id, user.id);
          if (data) {
            setRecipe(normalizeRecipe(data));
          }
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
        
        if (!recipe) {
          setLoadError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [id, user?.id]);

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
  if (isLoading && !loadError) {
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

  // Show error/safe state when no recipe available
  if (!recipe) {
    return (
      <div className={styles.selected_recipe_page}>
        <Header />
        <Navigation />
        <main className={styles.recipe_main}>
          <div className={styles.recipe_container}>
            <div className={styles.recipe_error_state}>
              <span className="material-symbols-outlined" style={{ fontSize: '4rem', opacity: 0.4 }}>error</span>
              <h2>Receta no encontrada</h2>
              <p>No se pudo cargar la receta. Puede que haya sido eliminada o que tengas problemas de conexión.</p>
              <button className={styles.recipe_back_btn} onClick={handleBack} style={{ alignSelf: 'center' }}>
                <span className="material-symbols-outlined">arrow_back</span>
                Volver a Recetas
              </button>
            </div>
          </div>
        </main>
        <MobileBottomNav activeTab={activeMobileTab} onTabChange={setActiveMobileTab} />
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
              {isValidImage(recipe.image) ? (
                <img
                  src={recipe.image}
                  alt={recipe.title || recipe.nombre}
                  className={styles.recipe_image}
                />
              ) : (
                <div className={styles.recipe_image_placeholder}>
                  <span className="material-symbols-outlined">image_not_supported</span>
                  <span>Imagen no proporcionada</span>
                </div>
              )}
            </div>

            <div className={styles.recipe_info}>
              <h1 className={styles.recipe_title}>{recipe.title || recipe.nombre}</h1>
              <p className={styles.recipe_description}>{recipe.descripcion}</p>

              <div className={styles.recipe_meta}>
                {recipe.porcionesTotales && (
                  <div className={styles.meta_item}>
                    <span className="material-symbols-outlined">restaurant</span>
                    <span>{recipe.porcionesTotales} porciones</span>
                  </div>
                )}
                {recipe.profit && (
                  <div className={styles.meta_item}>
                    <span className="material-symbols-outlined">trending_up</span>
                    <span>Profit: {recipe.profit}</span>
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
