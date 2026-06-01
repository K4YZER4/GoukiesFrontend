import api from './api';

/**
 * Ingredient Service - Gestiona todas las operaciones de ingredientes
 * Interactúa con POST /ingredients/obtain-all y POST /ingredients/create
 */

const ingredientService = {
  /**
   * Obtiene todos los ingredientes del usuario
   * @param {string} id_usuario - ID del usuario autenticado
   * @returns {Promise<Object>} Objeto con arrays: { producto, ingredientes, marca, tipo, unidad }
   */
  getAllIngredients: async (id_usuario) => {
    try {
      const response = await api.post('/ingredients/obtain-all', { id_usuario });
      return response.data;
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo ingrediente
   * @param {Object} ingredientData - Datos del ingrediente
   * @returns {Promise<Object>} Ingrediente creado con ID
   */
  createIngredient: async (ingredientData) => {
    try {
      const response = await api.post('/ingredients/createOrUpdate', ingredientData);
      return response.data;
    } catch (error) {
      console.error('Error creating ingredient:', error);
      throw error;
    }
  },

  /**
   * Actualiza un ingrediente existente
   * @param {string} id - ID del ingrediente
   * @param {Object} ingredientData - Datos actualizados
   * @returns {Promise<Object>} Ingrediente actualizado
   */
  updateIngredient: async (id, ingredientData) => {
    try {
      const response = await api.patch(`/ingredients/createOrUpdate/${id}`, ingredientData);
      return response.data;
    } catch (error) {
      console.error('Error updating ingredient:', error);
      throw error;
    }
  },

  /**
   * Elimina un ingrediente
   * @param {string} id - ID del ingrediente a eliminar
   * @returns {Promise<Object>} Respuesta del servidor
   */
  deleteIngredient: async (id) => {
    try {
      const response = await api.post('/ingredients/delete', { id });
      return response.data;
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      throw error;
    }
  },
};

export default ingredientService;
