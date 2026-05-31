import api from './api';

/**
 * Dashboard Service - Gestiona datos del dashboard principal
 * Interactúa con POST /dashboards/principalDashboard
 */

const dashboardService = {
  /**
   * Obtiene datos del dashboard principal
   * @param {string} id_usuario - ID del usuario autenticado
   * @param {number} cantidad_ingredientes - Cantidad de ingredientes a mostrar
   * @param {number} cantidad_recetas - Cantidad de recetas a mostrar
   * @returns {Promise<Object>} Datos del dashboard con estadísticas y listados
   */
  getPrincipalDashboard: async (id_usuario, cantidad_ingredientes = 5, cantidad_recetas = 5) => {
    try {
      const response = await api.post('/dashboards/principalDashboard', {
        id_usuario,
        cantidad_ingredientes,
        cantidad_recetas,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  },

  /**
   * Obtiene estadísticas generales del usuario
   * @param {string} id_usuario - ID del usuario autenticado
   * @returns {Promise<Object>} Estadísticas (total recetas, total ingredientes, etc.)
   */
  getStats: async (id_usuario) => {
    try {
      const response = await api.post('/dashboards/stats', { id_usuario });
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },
};

export default dashboardService;
