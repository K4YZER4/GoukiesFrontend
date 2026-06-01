/**
 * Image Upload Service
 * Maneja la carga de imágenes a Cloudinary (sin servidor backend)
 * Devuelve URLs públicas para usar en la app
 */

const CLOUDINARY_UPLOAD_PRESET = 'goukies_recipes'; // Preset configurado en Cloudinary
const CLOUDINARY_CLOUD_NAME = 'dl90iju4b'; // Cloud name de Cloudinary

export const imageUploadService = {
  /**
   * Sube una imagen a Cloudinary y devuelve la URL
   * @param {File} file - Archivo de imagen
   * @returns {Promise<string>} URL de la imagen subida
   */
  uploadImage: async (file) => {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen (JPG, PNG, GIF, WebP)');
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('La imagen debe pesar menos de 5MB');
      }

      // Crear FormData para Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      // Llamar a Cloudinary (sin autenticación necesaria con upload_preset)
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400 && errorData.error?.message?.includes('Upload preset')) {
          throw new Error('El upload preset "goukies_recipes" no existe. Créalo en Cloudinary → Settings → Upload → Upload presets (modo Unsigned)');
        }
        throw new Error(`Error al subir la imagen a Cloudinary: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      // Devolver URL optimizada
      return data.secure_url || data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  },

  /**
   * Valida si el archivo es una imagen válida
   * @param {File} file - Archivo a validar
   * @returns {Object} { isValid: boolean, error: string | null }
   */
  validateImage: (file) => {
    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'File must be an image' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'Image must be less than 5MB' };
    }

    return { isValid: true, error: null };
  },
};

export default imageUploadService;
