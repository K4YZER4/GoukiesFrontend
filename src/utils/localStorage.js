/**
 * localStorage Utilities
 * Funciones auxiliares para guardar y recuperar datos del localStorage
 */

const KEYS = {
  USER: 'goukies_user',
  RECIPES: 'goukies_recipes',
  INGREDIENTS: 'goukies_ingredients',
  INGREDIENTS_META: 'goukies_ingredients_meta', // marcas, tipos, unidades
  SELECTED_RECIPE: 'goukies_selected_recipe',
  SELECTED_INGREDIENT: 'goukies_selected_ingredient',
  DASHBOARD: 'goukies_dashboard',
};

/**
 * Guardar datos en localStorage
 */
export const setLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error guardando en localStorage (${key}):`, error);
  }
};

/**
 * Obtener datos de localStorage
 */
export const getLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error leyendo localStorage (${key}):`, error);
    return null;
  }
};

/**
 * Eliminar un item de localStorage
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error eliminando localStorage (${key}):`, error);
  }
};

/**
 * Limpiar localStorage completamente
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
};

/**
 * Métodos específicos para la app
 */

export const authStorage = {
  setUser: (user) => setLocalStorage(KEYS.USER, user),
  getUser: () => getLocalStorage(KEYS.USER),
  clearUser: () => removeLocalStorage(KEYS.USER),
  isLoggedIn: () => !!getLocalStorage(KEYS.USER),
};

export const recipeStorage = {
  setRecipes: (recipes) => setLocalStorage(KEYS.RECIPES, recipes),
  getRecipes: () => getLocalStorage(KEYS.RECIPES),
  setSelectedRecipe: (recipe) => setLocalStorage(KEYS.SELECTED_RECIPE, recipe),
  getSelectedRecipe: () => getLocalStorage(KEYS.SELECTED_RECIPE),
  clearRecipes: () => removeLocalStorage(KEYS.RECIPES),
};

export const ingredientStorage = {
  setIngredients: (ingredients) => setLocalStorage(KEYS.INGREDIENTS, ingredients),
  getIngredients: () => getLocalStorage(KEYS.INGREDIENTS),
  setIngredientsMetadata: (metadata) => setLocalStorage(KEYS.INGREDIENTS_META, metadata),
  getIngredientsMetadata: () => getLocalStorage(KEYS.INGREDIENTS_META),
  clearIngredients: () => removeLocalStorage(KEYS.INGREDIENTS),
};

export const dashboardStorage = {
  setDashboard: (data) => setLocalStorage(KEYS.DASHBOARD, data),
  getDashboard: () => getLocalStorage(KEYS.DASHBOARD),
  clearDashboard: () => removeLocalStorage(KEYS.DASHBOARD),
};

export default {
  KEYS,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  authStorage,
  recipeStorage,
  ingredientStorage,
  dashboardStorage,
};
