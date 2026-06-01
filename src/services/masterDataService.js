/**
 * Master Data Service
 * Obtiene datos globales que no dependen del usuario:
 * - Marcas (brands)
 * - Tipos (product types)
 * - Unidades (measurement units)
 * - Ingredientes (ingredients - también globales para selection)
 * 
 * Usa el endpoint /ingredients/obtain-all CON un id_usuario válido
 * (la API devuelve los mismos datos globales para cualquier usuario)
 */

import api from './api';

export const masterDataService = {
  /**
   * Obtiene todos los datos maestros (marcas, tipos, unidades, ingredientes)
   * Endpoint: POST /ingredients/obtain-all (requiere id_usuario en el body)
   * @param {string} id_usuario - ID de usuario (requerido por el endpoint, aunque devuelve datos globales)
   * @returns {Promise<Object>} { marca, tipo, unidad, ingredientes, producto }
   */
  getAllMasterData: async (id_usuario) => {
    try {
      if (!id_usuario) {
        throw new Error('id_usuario es requerido para obtener datos maestros');
      }
      
      // Llamar CON id_usuario (requerido por el endpoint)
      const response = await api.post('/ingredients/obtain-all', { id_usuario });
      return response.data;
    } catch (error) {
      console.error('Error fetching master data:', error);
      throw error;
    }
  },

  /**
   * Obtiene solo las marcas disponibles
   * @param {string} id_usuario - ID de usuario
   * @returns {Promise<Array>} Array de { id, nombre }
   */
  getMarcas: async (id_usuario) => {
    try {
      const data = await masterDataService.getAllMasterData(id_usuario);
      return data.marca || [];
    } catch (error) {
      console.error('Error fetching marcas:', error);
      return [];
    }
  },

  /**
   * Obtiene solo los tipos disponibles
   * @param {string} id_usuario - ID de usuario
   * @returns {Promise<Array>} Array de { id, nombre }
   */
  getTipos: async (id_usuario) => {
    try {
      const data = await masterDataService.getAllMasterData(id_usuario);
      return data.tipo || [];
    } catch (error) {
      console.error('Error fetching tipos:', error);
      return [];
    }
  },

  /**
   * Obtiene solo las unidades disponibles
   * @param {string} id_usuario - ID de usuario
   * @returns {Promise<Array>} Array de { id, nombre, cantidad_gramos }
   */
  getUnidades: async (id_usuario) => {
    try {
      const data = await masterDataService.getAllMasterData(id_usuario);
      return data.unidad || [];
    } catch (error) {
      console.error('Error fetching unidades:', error);
      return [];
    }
  },

  /**
   * Obtiene todos los ingredientes disponibles para selection
   * @param {string} id_usuario - ID de usuario
   * @returns {Promise<Array>} Array de { id, nombre }
   */
  getIngredientes: async (id_usuario) => {
    try {
      const data = await masterDataService.getAllMasterData(id_usuario);
      return data.ingredientes || [];
    } catch (error) {
      console.error('Error fetching ingredientes:', error);
      return [];
    }
  },
};

export default masterDataService;
