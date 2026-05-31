import api from './api';

/**
 * Auth Service - Maneja login y registro
 */

export const authService = {
  /**
   * Login - Autentica un usuario con email/nombre de usuario y contraseña
   * @param {string} identificador - Email o nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<{usuario: {id, nombre, correo_electronico}}>}
   */
  login: async (identificador, password) => {
    try {
      const response = await api.post('/auth/login', {
        identificador,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register - Crea un nuevo usuario
   * @param {string} nombre - Nombre del usuario
   * @param {string} correo_electronico - Email
   * @param {string} password - Contraseña
   * @param {string} codigo_moneda - Código de moneda (ej: MXN, USD)
   * @returns {Promise<{id, nombre, correo_electronico, moneda_codigo}>}
   */
  register: async (nombre, correo_electronico, password, codigo_moneda = 'MXN') => {
    try {
      const response = await api.post('/users/create', {
        nombre,
        correo_electronico,
        password,
        codigo_moneda,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
