/**
 * normalizeRecipe - Normaliza datos de receta de la API al formato usado por los componentes
 * 
 * API devuelve: { nombre, imagen_url, descripcion, porciones_totales, profit, pasos, ingredientes }
 * Componentes esperan: { title, image, descripcion, porciones, ingredientes: [...strings], instrucciones: [...strings] }
 */
export const normalizeRecipe = (data) => {
  if (!data) return null;

  // Formatear ingredientes como strings legibles
  const ingredientes = Array.isArray(data.ingredientes)
    ? data.ingredientes.map(ing => {
        const nombre = ing.ingrediente_nombre || ing.nombre || 'Ingrediente';
        const marca = ing.marca_nombre || ing.marca || '';
        const cantidad = ing.cantidad || '';
        return `${cantidad} ${marca ? `(${marca})` : ''} ${nombre}`.trim();
      })
    : [];

  // Extraer textos de pasos
  const instrucciones = Array.isArray(data.pasos)
    ? data.pasos.map(p => p.paso || p.descripcion || '')
    : [];

  return {
    id: data.id,
    nombre: data.nombre || data.title || '',
    title: data.nombre || data.title || '',
    descripcion: data.descripcion || '',
    imagen_url: data.imagen_url || data.image || null,
    image: data.imagen_url || data.image || null,
    imagenURL: data.imagen_url || data.image || null,
    porciones_totales: data.porciones_totales || data.porciones || 0,
    porciones: data.porciones_totales || data.porciones || 0,
    porcionesTotales: data.porciones_totales || data.porciones || 0,
    profit: parseFloat(data.profit) || 0,
    pasos: Array.isArray(data.pasos) ? data.pasos : [],
    ingredientes,
    instrucciones,
  };
};

/**
 * normalizeRecipes - Normaliza un array de recetas
 */
export const normalizeRecipes = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeRecipe);
};

export default normalizeRecipe;
