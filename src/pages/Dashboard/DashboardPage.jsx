import React, { useState } from 'react';
import styles from './DashboardPage.module.css';
import { Header, Navigation, MobileBottomNav } from '../../components/Layout';
import { StatCard, RecipeCard } from '../../components/Cards';
import { mockStats, mockRecentRecipes, mockInventory } from './mockData';

/**
 * DashboardPage Component
 * Main dashboard showing stats, recent recipes, and inventory overview
 */
const DashboardPage = ({ userName = 'Chef' }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeMobileTab, setActiveMobileTab] = useState('dashboard');

  return (
    <div className={styles.dashboard_page}>
      {/* Header */}
      <Header profileInitials="JD" />

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className={styles.dashboard_main}>
        <div className={styles.dashboard_container}>
          {/* Welcome Section */}
          <section className={styles.dashboard_welcome}>
            <h2 className={styles.dashboard_welcome_title}>
              ¡Bienvenido de nuevo, {userName}! 🍪
            </h2>
            <p className={styles.dashboard_welcome_subtitle}>
              Esto es lo que está pasando con tus deliciosas recetas hoy. ¡Es un buen día para hornear!
            </p>
          </section>

          {/* Stats Grid */}
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

          {/* Featured Recipe Hero */}
          <section className={styles.dashboard_featured}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFk2clhnPJhCuCaAtlLhxMd5DkqknmVS29idSUSp-WXVFK89I__8Wauynz0V5QPF1iN51gWdRtbpainEpge1bb0l-feb9bUpZ8iY07Y-I31UgYnZ9QNmWWnraAKErAPL8O0M6S7QVHwr15H4YCreYFUlGgGsL0TjtVL-MqHtqG3xl5vzw0GQppGGssBJhUUlWgjqKRwFQOvyd8FFS_j5jGQMlANOpo__SR_2RhorbQqLmr8BzE96FPSL06V6_zUCGFjKQbtThyS1KF"
              alt="Receta destacada"
              className={styles.dashboard_featured_image}
            />
            <div className={styles.dashboard_featured_overlay}></div>
            <div className={styles.dashboard_featured_content}>
              <span className={styles.dashboard_featured_badge}>Receta de la Semana</span>
              <h3 className={styles.dashboard_featured_title}>
                Chispas de Chocolate Clásicas
              </h3>
              <p className={styles.dashboard_featured_description}>
                La perfección dorada con bordes crujientes y un centro suave que se derrite en tu boca.
                Una receta infalible para cualquier ocasión.
              </p>
            </div>
          </section>

          {/* Recent Recipes Section */}
          <section className={styles.dashboard_recipes_section}>
            <div className={styles.dashboard_section_header}>
              <h3 className={styles.dashboard_section_title}>Recetas Recientes</h3>
              <button className={styles.dashboard_view_all_btn}>
                Ver todas
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className={styles.dashboard_recipes_grid}>
              {mockRecentRecipes.map((recipe) => (
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
              ))}
            </div>
          </section>

          {/* Inventory Preview */}
          <section className={styles.dashboard_inventory_section}>
            <div className={styles.dashboard_section_header}>
              <h3 className={styles.dashboard_section_title}>Inventario de Ingredientes</h3>
              <button className={styles.dashboard_add_ingredient_btn}>
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
                  {mockInventory.map((item) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeMobileTab} onTabChange={setActiveMobileTab} />
    </div>
  );
};

export default DashboardPage;
