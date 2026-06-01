import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AllProductsPage.module.css';
import { Header, Navigation, MobileBottomNav } from '../../components/Layout';
import { LoadingSpinner } from '../../components/Common';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import ingredientService from '../../services/ingredientService';
import { ingredientStorage } from '../../utils/localStorage';

/**
 * AllProductsPage Component
 * Displays inventory/ingredients list for the authenticated user
 * Supports filtering, search, and CRUD operations
 */
const AllProductsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState(''); // For filtering by type
  const [activeMobileTab, setActiveMobileTab] = useState('inventory');
  const [ingredientTypes, setIngredientTypes] = useState([]);

  // Load ingredients on mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setIsLoading(true);

        // Check cached data first
        const cachedIngredients = ingredientStorage.getAll();
        if (cachedIngredients && cachedIngredients.length > 0) {
          setIngredients(cachedIngredients);
          setFilteredIngredients(cachedIngredients);
          // Extract unique types
          const types = [...new Set(cachedIngredients.map(ing => ing.tipo))];
          setIngredientTypes(types);
        }

        // Fetch fresh data from API
        if (user?.id) {
          const data = await ingredientService.getAllIngredients(user.id);
          
          if (data) {
            // El API devuelve data.producto con los ingredientes del usuario
            const ingredientsList = data.producto || [];
            setIngredients(ingredientsList);
            setFilteredIngredients(ingredientsList);
            ingredientStorage.setAll(ingredientsList); // Cache the ingredients
            
            // Extract unique types for filter
            const types = [...new Set(ingredientsList.map(ing => ing.tipo))];
            setIngredientTypes(types);
          }
        }
      } catch (error) {
        console.error('Error loading ingredients:', error);
        
        // Use cached data if available
        const cachedIngredients = ingredientStorage.getAll();
        if (cachedIngredients && cachedIngredients.length > 0) {
          setIngredients(cachedIngredients);
          setFilteredIngredients(cachedIngredients);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadIngredients();
  }, [user?.id]);

  // Handle search/filter
  useEffect(() => {
    let filtered = ingredients;

    // Apply search term filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        ingredient =>
          ingredient.ingrediente?.toLowerCase().includes(term) ||
          ingredient.marca?.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (filterType !== '') {
      filtered = filtered.filter(ingredient => ingredient.tipo === filterType);
    }

    setFilteredIngredients(filtered);
  }, [searchTerm, filterType, ingredients]);

  const handleCreateIngredient = () => {
    navigate('/nuevo-ingrediente');
  };

  const handleDeleteIngredient = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este ingrediente?')) {
      try {
        await ingredientService.deleteIngredient(id);
        const updated = ingredients.filter(ing => ing.id !== id);
        setIngredients(updated);
        ingredientStorage.setAll(updated);
        showToast('Ingrediente eliminado', 'success');
      } catch (error) {
        showToast('Error al eliminar el ingrediente', 'error');
      }
    }
  };

  const handleEditIngredient = (id) => {
    // Navigate to edit page (not yet implemented)
    navigate(`/inventario/${id}/editar`);
  };

  // Show loading spinner
  if (isLoading && ingredients.length === 0) {
    return (
      <div className={styles.all_products_page}>
        <Header />
        <Navigation />
        <div className={styles.products_loading}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.all_products_page}>
      {/* Header */}
      <Header onSearch={setSearchTerm} />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className={styles.products_main}>
        <div className={styles.products_container}>
          {/* Header Section */}
          <section className={styles.products_header}>
            <div className={styles.products_header_content}>
              <h1 className={styles.products_title}>Mi Inventario</h1>
              <p className={styles.products_subtitle}>
                Tienes {ingredients.length} ingrediente{ingredients.length !== 1 ? 's' : ''} en tu inventario
              </p>
            </div>
            <button 
              className={styles.products_create_btn}
              onClick={handleCreateIngredient}
            >
              <span className="material-symbols-outlined">add_circle</span>
              Nuevo Ingrediente
            </button>
          </section>

          {/* Filter Section */}
          {ingredientTypes.length > 0 && (
            <section className={styles.products_filters}>
              <label className={styles.filter_label}>Filtrar por tipo:</label>
              <select 
                className={styles.filter_select}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {ingredientTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </section>
          )}

          {/* Products Table */}
          <section className={styles.products_section}>
            {filteredIngredients.length > 0 ? (
              <div className={styles.products_table_wrapper}>
                <table className={styles.products_table}>
                  <thead>
                    <tr>
                      <th>Ingrediente</th>
                      <th>Marca</th>
                      <th>Tipo</th>
                      <th>Stock</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIngredients.map((ingredient) => (
                      <tr key={ingredient.id}>
                        <td className={styles.ingredient_name}>
                          {ingredient.ingrediente}
                        </td>
                        <td>
                          <span className={styles.ingredient_badge}>
                            {ingredient.marca || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className={styles.ingredient_type}>
                            {ingredient.tipo}
                          </span>
                        </td>
                        <td className={styles.ingredient_quantity}>
                          {ingredient.cantidad_inventario} {ingredient.unidad}
                        </td>
                        <td className={styles.ingredient_price}>
                          ${ingredient.precio_medio || '0'}
                        </td>
                        <td className={styles.ingredient_actions}>
                          <button
                            className={styles.action_btn_edit}
                            onClick={() => handleEditIngredient(ingredient.id)}
                            title="Editar"
                          >
                            <span className="material-symbols-outlined">
                              edit
                            </span>
                          </button>
                          <button
                            className={styles.action_btn_delete}
                            onClick={() => handleDeleteIngredient(ingredient.id)}
                            title="Eliminar"
                          >
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.products_empty}>
                <div className={styles.products_empty_icon}>
                  <span className="material-symbols-outlined">
                    inventory_2
                  </span>
                </div>
                <h3 className={styles.products_empty_title}>
                  {searchTerm || filterType ? 'No se encontraron ingredientes' : 'Tu inventario está vacío'}
                </h3>
                <p className={styles.products_empty_subtitle}>
                  {searchTerm || filterType
                    ? 'Intenta con otros términos de búsqueda o filtros'
                    : 'Añade un ingrediente para comenzar'}
                </p>
                {!searchTerm && !filterType && (
                  <button 
                    className={styles.products_empty_btn}
                    onClick={handleCreateIngredient}
                  >
                    + Añadir Primer Ingrediente
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

export default AllProductsPage;
