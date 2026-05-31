import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authStorage } from '../utils/localStorage';

/**
 * AuthContext - Contexto global para autenticación
 * Maneja login, logout, y estado del usuario
 */

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar, recuperar usuario de localStorage
  useEffect(() => {
    const storedUser = authStorage.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // Login: guardar usuario en estado y localStorage
  const login = useCallback((userData) => {
    setUser(userData);
    authStorage.setUser(userData);
  }, []);

  // Logout: limpiar estado y localStorage
  const logout = useCallback(() => {
    setUser(null);
    authStorage.clearUser();
  }, []);

  // Helper: verificar si está autenticado
  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
