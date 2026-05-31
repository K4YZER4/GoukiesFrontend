import React from 'react';
import '../../styles/Navigation.css';

/**
 * Navigation Component
 * Horizontal navigation bar with tabs
 * Used in main app after header
 */
const Navigation = ({ activeTab = 'dashboard', onTabChange = null }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'recipes', label: 'Recetas', icon: 'menu_book' },
    { id: 'create-recipe', label: 'Nueva Receta', icon: 'add_circle' },
    { id: 'inventory', label: 'Inventario', icon: 'inventory_2' },
  ];

  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <nav className="navigation">
      <div className="navigation__container">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href="#"
            className={`navigation__link ${
              activeTab === tab.id ? 'navigation__link--active' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick(tab.id);
            }}
          >
            <span className="material-symbols-outlined navigation__icon">
              {tab.icon}
            </span>
            <span className="navigation__label">{tab.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
