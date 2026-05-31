import React, { useState } from 'react';
import '../../styles/Header.css';

/**
 * Header Component
 * Top navigation bar with logo, search, and profile
 */
const Header = ({ onSearch = null, profileInitials = 'JD' }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
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
          <div className="header__avatar" title={profileInitials}>
            {profileInitials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
