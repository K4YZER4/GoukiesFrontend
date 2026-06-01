import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateProductPage.module.css';
import { Header, Navigation } from '../../components/Layout';
import { Input, Select } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import ingredientService from '../../services/ingredientService';
import { ingredientStorage } from '../../utils/localStorage';

/**
 * CreateProductPage Component
 * Form to add new products/ingredients to inventory
 */
const CreateProductPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    tipo: '',
    cantidad: '',
    unidad: 'gramos',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const tipos = [
    'Ingredientes Secos',
    'Lácteos',
    'Extras',
    'Saborizantes',
    'Levadura',
    'Otros',
  ];

  const unidades = [
    { value: 'gramos', label: 'Gramos (g)' },
    { value: 'kilogramos', label: 'Kilogramos (kg)' },
    { value: 'mililitros', label: 'Mililitros (ml)' },
    { value: 'litros', label: 'Litros (l)' },
    { value: 'unidades', label: 'Unidades (ud)' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.nombre.trim()) {
      showToast('El nombre del ingrediente es requerido', 'error');
      return;
    }

    if (!formData.tipo) {
      showToast('Selecciona un tipo de ingrediente', 'error');
      return;
    }

    if (!formData.cantidad || isNaN(formData.cantidad)) {
      showToast('La cantidad debe ser un número válido', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare data for API
      const ingredientData = {
        id_usuario: user.id,
        nombre: formData.nombre,
        marca: formData.marca || null,
        tipo: formData.tipo,
        cantidad: parseFloat(formData.cantidad),
        unidad: formData.unidad,
      };

      // Call API to create ingredient
      const response = await ingredientService.createIngredient(ingredientData);

      if (response) {
        showToast('¡Ingrediente añadido exitosamente!', 'success');
        
        // Update local cache
        const cachedIngredients = ingredientStorage.getAll() || [];
        ingredientStorage.setAll([...cachedIngredients, response]);

        // Reset form and redirect
        setFormData({
          nombre: '',
          marca: '',
          tipo: '',
          cantidad: '',
          unidad: 'gramos',
        });

        // Redirect to inventory page
        setTimeout(() => {
          navigate('/inventario');
        }, 1000);
      }
    } catch (error) {
      console.error('Error creating ingredient:', error);
      
      // Detailed error handling for different scenarios
      let errorMessage = 'Error al añadir el ingrediente';
      
      if (error.response?.status === 400) {
        // Bad request - validation or missing data
        const data = error.response.data;
        if (data?.message?.includes('marca')) {
          errorMessage = 'Por favor proporciona una marca o usa "Sin marca"';
        } else if (data?.message?.includes('tipo')) {
          errorMessage = 'El tipo de ingrediente es requerido';
        } else if (data?.message?.includes('cantidad')) {
          errorMessage = 'La cantidad debe ser un número válido';
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.response?.status === 404) {
        // Not found - likely missing marca or tipo
        errorMessage = 'No se encontró la marca o tipo especificado. Verifica los datos.';
      } else if (error.response?.status === 409) {
        // Conflict - likely duplicate
        errorMessage = 'Este ingrediente ya existe en tu inventario';
      } else if (error.response?.status === 500) {
        // Server error
        errorMessage = 'Error del servidor. Intenta más tarde.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.nombre || formData.marca || formData.tipo || formData.cantidad) {
      if (confirm('¿Descartar cambios?')) {
        navigate('/inventario');
      }
    } else {
      navigate('/inventario');
    }
  };

  return (
    <div className={styles.create_product_page}>
      {/* Header */}
      <Header />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className={styles.main_content}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <button 
            className={styles.breadcrumb_link}
            onClick={() => navigate('/inventario')}
          >
            Inventario
          </button>
          <span className={styles.breadcrumb_separator}>
            <span className="material-symbols-outlined">chevron_right</span>
          </span>
          <span className={styles.breadcrumb_current}>Añadir Ingrediente</span>
        </div>

        {/* Page Header */}
        <div className={styles.page_header}>
          <h2 className={styles.page_title}>Nuevos Sabores</h2>
          <p className={styles.page_subtitle}>
            Añade los suministros frescos para tus próximas creaciones horneadas. 
            Cada ingrediente es una pieza clave de la magia.
          </p>
        </div>

        {/* Form Card */}
        <div className={styles.form_card}>
          {/* Decorative element */}
          <div className={styles.decorative_bg}></div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.form_grid}>
              {/* Ingredient Name */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="nombre">
                  Nombre del Ingrediente
                </label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="p. ej., Harina de Trigo"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  fullWidth
                />
              </div>

              {/* Brand */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="marca">
                  Marca (Opcional)
                </label>
                <Input
                  id="marca"
                  name="marca"
                  placeholder="p. ej., La Copetera"
                  value={formData.marca}
                  onChange={handleInputChange}
                  fullWidth
                />
              </div>

              {/* Type */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="tipo">
                  Tipo de Ingrediente
                </label>
                <Select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Selecciona un tipo' },
                    ...tipos.map(tipo => ({ value: tipo, label: tipo })),
                  ]}
                  fullWidth
                />
              </div>

              {/* Quantity */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="cantidad">
                  Cantidad
                </label>
                <div className={styles.input_with_icon}>
                  <Input
                    id="cantidad"
                    name="cantidad"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.cantidad}
                    onChange={handleInputChange}
                  />
                  <span className={`${styles.input_icon} material-symbols-outlined`}>
                    scale
                  </span>
                </div>
              </div>

              {/* Unit */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="unidad">
                  Unidad de Medida
                </label>
                <Select
                  id="unidad"
                  name="unidad"
                  value={formData.unidad}
                  onChange={handleInputChange}
                  options={unidades}
                />
              </div>
            </div>

            {/* Actions */}
            <div className={styles.form_actions}>
              <button
                type="button"
                className={styles.cancel_btn}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.submit_btn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined">hourglass_empty</span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">check</span>
                    Guardar Ingrediente
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProductPage;
