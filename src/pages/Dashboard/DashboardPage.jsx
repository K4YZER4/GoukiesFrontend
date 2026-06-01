import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import { Header, Navigation, MobileBottomNav } from '../../components/Layout';
import { StatCard, RecipeCard } from '../../components/Cards';
import { LoadingSpinner } from '../../components/Common';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import dashboardService from '../../services/dashboardService';
import { dashboardStorage } from '../../utils/localStorage';
import { mockStats, mockRecentRecipes, mockInventory } from './mockData';

/**
 * DashboardPage Component
 * Main dashboard showing stats, recent recipes, and inventory overview
 * Loads data from API with caching strategy
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState('dashboard');

  // Load dashboard data on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // Check if we have cached data
        const cachedData = dashboardStorage.get();
        if (cachedData) {
          setDashboardData(cachedData);
        }

        // Fetch fresh data from API
        if (user?.id) {
          const data = await dashboardService.getPrincipalDashboard(
            user.id,
            5, // cantidad_ingredientes
            5  // cantidad_recetas
          );

          if (data) {
            setDashboardData(data);
            dashboardStorage.set(data); // Cache the data
            showToast('Dashboard actualizado', 'success');
          }
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Error al cargar el dashboard', 'error');
        
        // Fallback to cached data if available
        const cachedData = dashboardStorage.get();
        if (cachedData) {
          setDashboardData(cachedData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id, showToast]);

  const handleViewAllRecipes = () => {
    navigate('/recetas');
  };

  const handleAddIngredient = () => {
    navigate('/nuevo-ingrediente');
  };

  // Show loading spinner while fetching data
  if (isLoading && !dashboardData) {
    return (
      <div className={styles.dashboard_page}>
        <Header />
        <Navigation />
        <div className={styles.dashboard_loading}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Use API data - no fallback to mock data
  const recentRecipes = dashboardData?.recetas || [];
  const inventory = dashboardData?.ingredientes || [];
  const hasData = (recentRecipes && recentRecipes.length > 0) || (inventory && inventory.length > 0);

  return (
    <div className={styles.dashboard_page}>
      {/* Header */}
      <Header />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className={styles.dashboard_main}>
        <div className={styles.dashboard_container}>
          {/* Welcome Section */}
          <section className={styles.dashboard_welcome}>
            <h2 className={styles.dashboard_welcome_title}>
              ¡Bienvenido de nuevo, {user?.nombre || 'Chef'}! 🍪
            </h2>
            <p className={styles.dashboard_welcome_subtitle}>
              {hasData 
                ? 'Esto es lo que está pasando con tus deliciosas recetas hoy. ¡Es un buen día para hornear!'
                : '¡Bienvenido a Goukies! Para empezar, puedes añadir ingredientes y recetas para tener información en esta pantalla.'}
            </p>
          </section>

          {/* Empty State - Show when no data */}
          {!hasData && (
            <section className={styles.dashboard_empty_state}>
              <div className={styles.empty_state_content}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>
                  shopping_cart
                </span>
                <h3 className={styles.empty_state_title}>¡Comencemos! 🎉</h3>
                <p className={styles.empty_state_description}>
                  Aún no tienes ingredientes ni recetas. Crea tu primera receta o añade ingredientes para comenzar a gestionar tu cocina.
                </p>
                <div className={styles.empty_state_ctas}>
                  <button 
                    className={styles.primary_cta_btn}
                    onClick={() => navigate('/nueva-receta')}
                  >
                    <span className="material-symbols-outlined">add</span>
                    Crear Nueva Receta
                  </button>
                  <button 
                    className={styles.secondary_cta_btn}
                    onClick={handleAddIngredient}
                  >
                    <span className="material-symbols-outlined">inventory_2</span>
                    Añadir Ingrediente
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Stats Grid - Show when there's data */}
          {hasData && (
            <section className={styles.dashboard_stats}>
              {mockStats.map((stat) => (
                <StatCard
                  key={stat.id}
                  icon={stat.icon}
                  title={stat.title}
                  value={stat.value}
                  variant={stat.variant}
                />
              ))}
            </section>
          )}

          {/* Recent Recipes Section */}
          {hasData && (
            <section className={styles.dashboard_recipes_section}>
              <div className={styles.dashboard_section_header}>
                <h3 className={styles.dashboard_section_title}>Recetas Recientes</h3>
                <button 
                  className={styles.dashboard_view_all_btn}
                  onClick={handleViewAllRecipes}
                >
                  Ver todas
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
              <div className={styles.dashboard_recipes_grid}>
                {recentRecipes && recentRecipes.length > 0 ? (
                  recentRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      id={recipe.id}
                      image={recipe.image}
                      title={recipe.title}
                      description={recipe.description}
                      rating={recipe.rating}
                      difficulty={recipe.difficulty}
                      time={recipe.time}
                    />
                  ))
                ) : (
                  <p className={styles.empty_message}>No hay recetas aún. ¡Crea una nueva!</p>
                )}
              </div>
            </section>
          )}

          {/* Inventory Preview */}
          {hasData && (
            <section className={styles.dashboard_inventory_section}>
              <div className={styles.dashboard_section_header}>
                <h3 className={styles.dashboard_section_title}>Inventario de Ingredientes</h3>
                <button 
                  className={styles.dashboard_add_ingredient_btn}
                  onClick={handleAddIngredient}
                >
                  + Añadir Ingrediente
                </button>
              </div>

              <div className={styles.dashboard_inventory_table}>
                <table>
                  <thead>
                    <tr>
                      <th>Ingrediente</th>
                      <th>Categoría</th>
                      <th>Stock</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory && inventory.length > 0 ? (
                      inventory.map((item) => (
                        <tr key={item.id}>
                          <td className={styles.inventory_name}>{item.name}</td>
                          <td>
                            <span className={styles.inventory_badge}>{item.category}</span>
                          </td>
                          <td className={styles.inventory_quantity}>
                            {item.quantity} {item.unit}
                          </td>
                          <td>
                            <div className={styles.inventory_status}>
                              <span
                                className={`${styles.inventory_status_dot} ${
                                  item.status === 'Suficiente'
                                    ? styles.status_success
                                    : styles.status_warning
                                }`}
                              ></span>
                              <span>{item.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className={styles.empty_message}>
                          No hay ingredientes. ¡Añade uno para comenzar!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeMobileTab} onTabChange={setActiveMobileTab} />
    </div>
  );
};

export default DashboardPage;
