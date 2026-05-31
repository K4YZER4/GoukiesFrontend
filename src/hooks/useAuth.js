import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * useAuth - Custom hook para acceder al contexto de autenticación
 * Uso: const { user, login, logout, isAuthenticated } = useAuth();
 */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};

export default useAuth;
