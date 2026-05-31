import api from './api';

/**
 * Recipe Service - Gestiona todas las operaciones de recetas
 * Interactúa con POST /recipes/obtain-all y POST /recipes/create
 */

const recipeService = {
  /**
   * Obtiene todas las recetas del usuario
   * @param {string} id_usuario - ID del usuario autenticado
   * @returns {Promise<Array>} Lista de recetas
   */
  getAllRecipes: async (id_usuario) => {
    try {
      const response = await api.post('/recipes/obtain-all', { id_usuario });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  },

  /**
   * Obtiene una receta específica por ID
   * @param {string} id - ID de la receta
   * @param {string} id_usuario - ID del usuario autenticado
   * @returns {Promise<Object>} Datos de la receta
   */
  getRecipeById: async (id, id_usuario) => {
    try {
      const response = await api.post('/recipes/obtain-by-id', { 
        id, 
        id_usuario 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva receta
   * @param {Object} recipeData - Datos de la receta
   * @returns {Promise<Object>} Receta creada con ID
   */
  createRecipe: async (recipeData) => {
    try {
      const response = await api.post('/recipes/create', recipeData);
      return response.data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  },

  /**
   * Actualiza una receta existente
   * @param {string} id - ID de la receta
   * @param {Object} recipeData - Datos actualizados
   * @returns {Promise<Object>} Receta actualizada
   */
  updateRecipe: async (id, recipeData) => {
    try {
      const response = await api.post(`/recipes/update/${id}`, recipeData);
      return response.data;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  },

  /**
   * Elimina una receta
   * @param {string} id - ID de la receta a eliminar
   * @returns {Promise<Object>} Respuesta del servidor
   */
  deleteRecipe: async (id) => {
    try {
      const response = await api.post(`/recipes/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  },
};

export default recipeService;
