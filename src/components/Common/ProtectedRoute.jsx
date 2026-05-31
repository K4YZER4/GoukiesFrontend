import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute - Wrapper para rutas que requieren autenticación
 * Si no está autenticado, redirige a /login
 * Si está cargando, muestra LoadingSpinner
 */

const ProtectedRoute = ({ element }) => {
  const { user, isLoading } = useAuth();

  // Mientras carga, mostrar spinner
  if (isLoading) {
    return <LoadingSpinner text="Iniciando..." />;
  }

  // Si no tiene usuario, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el componente
  return element;
};

export default ProtectedRoute;
