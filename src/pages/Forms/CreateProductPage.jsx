import React, { useState, useEffect } from 'react';
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

  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [isLoadingGlobalData, setIsLoadingGlobalData] = useState(true);

  const [formData, setFormData] = useState({
    id_ingrediente: '',
    id_marca: '',
    id_tipo: '',
    id_unidad: '',
    pzas: '',
    precio_medio: '',
    cantidad_inventario: '',
    cantidad_unitario: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load global data (marcas, tipos, unidades) on mount
  useEffect(() => {
    const loadGlobalData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoadingGlobalData(true);
        const data = await ingredientService.getAllIngredients(user.id);
        
        if (data) {
          setMarcas(data.marca || []);
          setTipos(data.tipo || []);
          setUnidades(data.unidad || []);
          setIngredientes(data.ingredientes || []);
          
          // Save to localStorage for caching
          ingredientStorage.setIngredientsMetadata({
            marca: data.marca,
            tipo: data.tipo,
            unidad: data.unidad,
            ingredientes: data.ingredientes,
          });
        }
      } catch (error) {
        console.error('Error loading global data:', error);
        
        // Try to load from cache
        const cached = ingredientStorage.getIngredientsMetadata();
        if (cached) {
          setMarcas(cached.marca || []);
          setTipos(cached.tipo || []);
          setUnidades(cached.unidad || []);
          setIngredientes(cached.ingredientes || []);
        }
      } finally {
        setIsLoadingGlobalData(false);
      }
    };

    loadGlobalData();
  }, [user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_ingrediente) {
      showToast('Selecciona un ingrediente', 'error');
      return;
    }

    if (!formData.id_marca) {
      showToast('Selecciona una marca', 'error');
      return;
    }

    if (!formData.id_tipo) {
      showToast('Selecciona un tipo de ingrediente', 'error');
      return;
    }

    if (!formData.id_unidad) {
      showToast('Selecciona una unidad de medida', 'error');
      return;
    }

    if (!formData.cantidad_inventario || isNaN(formData.cantidad_inventario)) {
      showToast('La cantidad en inventario debe ser un número válido', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const ingredientData = {
        id_usuario: user.id,
        id_ingrediente: parseInt(formData.id_ingrediente),
        id_marca: parseInt(formData.id_marca),
        id_tipo: parseInt(formData.id_tipo),
        id_unidad: parseInt(formData.id_unidad),
        pzas: parseInt(formData.pzas) || 1,
        precio_medio: parseFloat(formData.precio_medio) || 0,
        cantidad_inventario: parseFloat(formData.cantidad_inventario) || 0,
        cantidad_unitario: parseInt(formData.cantidad_unitario) || 1,
      };

      // Call API to create ingredient
      const response = await ingredientService.createIngredient(ingredientData);

      if (response) {
        showToast('¡Ingrediente añadido exitosamente!', 'success');
        
        // No actualizamos caché aquí porque el response tiene field names distintos
        // El inventario cargará los datos frescos via API al navegar a /inventario

        // Reset form and redirect
        setFormData({
          id_ingrediente: '',
          id_marca: '',
          id_tipo: '',
          id_unidad: '',
          pzas: '',
          precio_medio: '',
          cantidad_inventario: '',
          cantidad_unitario: '',
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
    const hasChanges = Object.values(formData).some(v => v !== '');
    if (hasChanges) {
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
                <label className={styles.form_label} htmlFor="id_ingrediente">
                  Ingrediente
                </label>
                <Select
                  id="id_ingrediente"
                  name="id_ingrediente"
                  value={formData.id_ingrediente}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Selecciona un ingrediente' },
                    ...ingredientes.map(i => ({ value: i.id.toString(), label: i.nombre })),
                  ]}
                  fullWidth
                />
              </div>

               {/* Brand */}
               <div className={styles.form_group}>
                  <label className={styles.form_label} htmlFor="id_marca">
                    Marca
                  </label>
                  <Select
                    id="id_marca"
                    name="id_marca"
                    value={formData.id_marca}
                    onChange={handleInputChange}
                    options={[
                      { value: '', label: 'Selecciona una marca' },
                      ...marcas.map(marca => ({ value: marca.id.toString(), label: marca.nombre })),
                    ]}
                    fullWidth
                  />
               </div>

               {/* Type */}
               <div className={styles.form_group}>
                  <label className={styles.form_label} htmlFor="id_tipo">
                    Tipo de Ingrediente
                  </label>
                  <Select
                    id="id_tipo"
                    name="id_tipo"
                    value={formData.id_tipo}
                    onChange={handleInputChange}
                    options={[
                      { value: '', label: 'Selecciona un tipo' },
                      ...tipos.map(tipo => ({ value: tipo.id.toString(), label: tipo.nombre })),
                    ]}
                    fullWidth
                  />
               </div>

               {/* Unit */}
               <div className={styles.form_group}>
                  <label className={styles.form_label} htmlFor="id_unidad">
                    Unidad de Medida
                  </label>
                  <Select
                    id="id_unidad"
                    name="id_unidad"
                    value={formData.id_unidad}
                    onChange={handleInputChange}
                    options={[
                      { value: '', label: 'Selecciona una unidad' },
                      ...unidades.map(unidad => ({ value: unidad.id.toString(), label: unidad.nombre })),
                    ]}
                    fullWidth
                  />
               </div>

              {/* Pieces */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="pzas">
                  Piezas
                </label>
                <Input
                  id="pzas"
                  name="pzas"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.pzas}
                  onChange={handleInputChange}
                />
              </div>

              {/* Precio Medio */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="precio_medio">
                  Precio Medio
                </label>
                <div className={styles.input_with_icon}>
                  <Input
                    id="precio_medio"
                    name="precio_medio"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.precio_medio}
                    onChange={handleInputChange}
                  />
                  <span className={`${styles.input_icon} material-symbols-outlined`}>
                    attach_money
                  </span>
                </div>
              </div>

              {/* Cantidad en inventario */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="cantidad_inventario">
                  Cantidad en Inventario
                </label>
                <div className={styles.input_with_icon}>
                  <Input
                    id="cantidad_inventario"
                    name="cantidad_inventario"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.cantidad_inventario}
                    onChange={handleInputChange}
                  />
                  <span className={`${styles.input_icon} material-symbols-outlined`}>
                    scale
                  </span>
                </div>
              </div>

              {/* Cantidad unitario */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="cantidad_unitario">
                  Cantidad Unitaria
                </label>
                <Input
                  id="cantidad_unitario"
                  name="cantidad_unitario"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.cantidad_unitario}
                  onChange={handleInputChange}
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
