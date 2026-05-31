import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext.jsx';

/**
 * useToast - Custom hook para acceder al contexto de toasts
 * Uso: const { success, error, warning } = useToast();
 */

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }

  return context;
};

export default useToast;
