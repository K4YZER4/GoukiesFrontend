/**
 * Master Data Service
 * Obtiene datos globales que no dependen del usuario:
 * - Marcas (brands)
 * - Tipos (product types)
 * - Unidades (measurement units)
 * - Ingredientes (ingredients - también globales para selection)
 * 
 * Usa el endpoint /ingredients/obtain-all con id_usuario = null o sin parámetro
 */

import api from './api';

export const masterDataService = {
  /**
   * Obtiene todos los datos maestros (marcas, tipos, unidades, ingredientes)
   * Endpoint: POST /ingredients/obtain-all (sin id_usuario o con null)
   * @returns {Promise<Object>} { marca, tipo, unidad, ingredientes, producto }
   */
  getAllMasterData: async () => {
    try {
      // Llamar sin id_usuario para obtener solo datos globales
      const response = await api.post('/ingredients/obtain-all', {});
      return response.data;
    } catch (error) {
      console.error('Error fetching master data:', error);
      throw error;
    }
  },

  /**
   * Obtiene solo las marcas disponibles
   * @returns {Promise<Array>} Array de { id, nombre }
   */
  getMarcas: async () => {
    try {
      const data = await masterDataService.getAllMasterData();
      return data.marca || [];
    } catch (error) {
      console.error('Error fetching marcas:', error);
      return [];
    }
  },

  /**
   * Obtiene solo los tipos disponibles
   * @returns {Promise<Array>} Array de { id, nombre }
   */
  getTipos: async () => {
    try {
      const data = await masterDataService.getAllMasterData();
      return data.tipo || [];
    } catch (error) {
      console.error('Error fetching tipos:', error);
      return [];
    }
  },

  /**
   * Obtiene solo las unidades disponibles
   * @returns {Promise<Array>} Array de { id, nombre, cantidad_gramos }
   */
  getUnidades: async () => {
    try {
      const data = await masterDataService.getAllMasterData();
      return data.unidad || [];
    } catch (error) {
      console.error('Error fetching unidades:', error);
      return [];
    }
  },

  /**
   * Obtiene todos los ingredientes disponibles para selection
   * @returns {Promise<Array>} Array de { id, nombre }
   */
  getIngredientes: async () => {
    try {
      const data = await masterDataService.getAllMasterData();
      return data.ingredientes || [];
    } catch (error) {
      console.error('Error fetching ingredientes:', error);
      return [];
    }
  },
};

export default masterDataService;
