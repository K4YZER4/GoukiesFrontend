import React from 'react';
import '../../styles/MobileBottomNav.css';

/**
 * MobileBottomNav Component
 * Bottom navigation bar for mobile devices
 */
const MobileBottomNav = ({ activeTab = 'dashboard', onTabChange = null }) => {
  const tabs = [
    { id: 'dashboard', label: 'Panel', icon: 'dashboard' },
    { id: 'recipes', label: 'Recetas', icon: 'menu_book' },
    { id: 'create-recipe', label: 'Crear', icon: 'add' },
    { id: 'inventory', label: 'Stock', icon: 'inventory_2' },
    { id: 'profile', label: 'Perfil', icon: 'person' },
  ];

  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-bottom-nav__container">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`mobile-bottom-nav__link ${
              activeTab === tab.id ? 'mobile-bottom-nav__link--active' : ''
            } ${tab.id === 'create-recipe' ? 'mobile-bottom-nav__link--fab' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            title={tab.label}
          >
            <span className="material-symbols-outlined mobile-bottom-nav__icon">
              {tab.icon}
            </span>
            {tab.id !== 'create-recipe' && (
              <span className="mobile-bottom-nav__label">{tab.label}</span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
