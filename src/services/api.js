import axios from 'axios';

/**
 * API Client - Cliente HTTP centralizado para todas las requests
 * Configura base URL, headers por defecto, y manejo de errores
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // para enviar cookies si las usamos después
});

/**
 * Interceptor de respuestas - maneja errores comunes
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log para debug
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      data: error.response?.data,
    });

    // Devolvemos el error original para que lo maneje el componente
    return Promise.reject(error);
  }
);

export default api;
