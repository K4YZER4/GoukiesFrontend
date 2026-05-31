import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/Navigation.css';

/**
 * Navigation Component
 * Horizontal navigation bar with tabs and logout button
 * Used in main app after header - connects to React Router and Auth
 */
const Navigation = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: 'recipes', label: 'Recetas', icon: 'menu_book', path: '/recetas' },
    { id: 'create-recipe', label: 'Nueva Receta', icon: 'add_circle', path: '/nueva-receta' },
    { id: 'inventory', label: 'Inventario', icon: 'inventory_2', path: '/inventario' },
  ];

  const getActiveTab = () => {
    return tabs.find(tab => location.pathname === tab.path)?.id || 'dashboard';
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const activeTab = getActiveTab();

  return (
    <nav className="navigation">
      <div className="navigation__container">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.path}
            className={`navigation__link ${
              activeTab === tab.id ? 'navigation__link--active' : ''
            }`}
          >
            <span className="material-symbols-outlined navigation__icon">
              {tab.icon}
            </span>
            <span className="navigation__label">{tab.label}</span>
          </Link>
        ))}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="navigation__logout"
          title="Cerrar sesión"
        >
          <span className="material-symbols-outlined navigation__icon">
            logout
          </span>
          <span className="navigation__label">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
