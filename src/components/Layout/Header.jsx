import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/Header.css';

/**
 * Header Component
 * Top navigation bar with logo, search, and profile
 */
const Header = ({ onSearch = null }) => {
  const [searchValue, setSearchValue] = useState('');
  const { user } = useAuth();

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  // Get initials from user name or email
  const getInitials = () => {
    if (user?.nombre) {
      return user.nombre
        .split(' ')
        .slice(0, 2)
        .map(word => word[0])
        .join('')
        .toUpperCase();
    }
    if (user?.correo_electronico) {
      return user.correo_electronico.substring(0, 2).toUpperCase();
    }
    return 'GU'; // Default for Goukies User
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo/Brand */}
        <div className="header__brand">
          <h1 className="header__logo">Goukies</h1>
        </div>

        {/* Search Bar */}
        <div className="header__search">
          <div className="header__search-wrapper">
            <span className="material-symbols-outlined header__search-icon">
              search
            </span>
            <input
              type="text"
              className="header__search-input"
              placeholder="Buscar recetas, ingredientes..."
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Profile */}
        <div className="header__profile">
          <div className="header__avatar" title={user?.nombre || 'Usuario'}>
            {getInitials()}
          </div>
          <div className="header__user-info">
            <p className="header__user-name">{user?.nombre || 'Usuario'}</p>
            <p className="header__user-email">{user?.correo_electronico || ''}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
