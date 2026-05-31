import React, { useState } from 'react';
import styles from './CreateProductPage.module.css';
import { Header, Navigation } from '../../components/Layout';
import { Button, Input, Select } from '../../components/Common';

/**
 * CreateProductPage Component
 * Form to add new products/ingredients to inventory
 */
const CreateProductPage = () => {
  const [activeTab, setActiveTab] = useState('inventario');
  const [formData, setFormData] = useState({
    ingredient: '',
    brand: '',
    category: '',
    quantity: '',
    unit: 'g',
    pieces: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const ingredients = [
    'Harina de Trigo',
    'Mantequilla sin Sal',
    'Azúcar Mascabado',
    'Chispas de Chocolate',
    'Extracto de Vainilla',
  ];

  const brands = [
    'Lala',
    'Los Pinos',
    'Selecta',
    'Hershey\'s',
    'McCormick',
  ];

  const categories = [
    'Ingredientes Secos',
    'Lácteos',
    'Extras',
    'Saborizantes',
    'Levadura',
  ];

  const units = ['g', 'kg', 'ml', 'l', 'uds'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('saving');

    // Simulate API call
    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({
        ingredient: '',
        brand: '',
        category: '',
        quantity: '',
        unit: 'g',
        pieces: '',
      });

      // Reset status after 2 seconds
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitStatus(null);
      }, 2000);
    }, 1000);
  };

  return (
    <div className={styles.create_product_page}>
      {/* Header */}
      <Header profileInitials="JD" />

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className={styles.main_content}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <a href="#" className={styles.breadcrumb_link}>Inventario</a>
          <span className={styles.breadcrumb_separator}>
            <span className="material-symbols-outlined">chevron_right</span>
          </span>
          <span className={styles.breadcrumb_current}>Agregar Ingrediente</span>
        </div>

        {/* Page Header */}
        <div className={styles.page_header}>
          <h2 className={styles.page_title}>Nuevos Sabores</h2>
          <p className={styles.page_subtitle}>
            Añade los suministros frescos para tus próximas creaciones
            horneadas. Cada ingrediente es una pieza clave de la magia.
          </p>
        </div>

        {/* Form Card */}
        <div className={styles.form_card}>
          {/* Decorative element */}
          <div className={styles.decorative_bg}></div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.form_grid}>
              {/* Ingredient */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="ingredient">
                  Ingrediente
                </label>
                <Select
                  id="ingredient"
                  name="ingredient"
                  value={formData.ingredient}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Selecciona un ingrediente' },
                    ...ingredients.map(ing => ({ value: ing, label: ing })),
                  ]}
                />
              </div>

              {/* Brand */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="brand">
                  Marca
                </label>
                <Select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Selecciona una marca' },
                    ...brands.map(brand => ({ value: brand, label: brand })),
                  ]}
                />
              </div>

              {/* Category */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="category">
                  Categoría
                </label>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Selecciona una categoría' },
                    ...categories.map(cat => ({ value: cat, label: cat })),
                  ]}
                />
              </div>

              {/* Quantity */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="quantity">
                  Cantidad
                </label>
                <div className={styles.input_with_icon}>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />
                  <span className={`${styles.input_icon} material-symbols-outlined`}>
                    scale
                  </span>
                </div>
              </div>

              {/* Unit */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="unit">
                  Unidad
                </label>
                <Select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  options={units.map(u => ({ value: u, label: u }))}
                />
              </div>

              {/* Pieces */}
              <div className={styles.form_group}>
                <label className={styles.form_label} htmlFor="pieces">
                  Piezas
                </label>
                <div className={styles.input_with_icon}>
                  <Input
                    id="pieces"
                    name="pieces"
                    type="number"
                    placeholder="0"
                    value={formData.pieces}
                    onChange={handleInputChange}
                  />
                  <span className={`${styles.input_icon} material-symbols-outlined`}>
                    numbers
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.form_actions}>
              <Button
                type="button"
                variant="secondary"
                className={styles.cancel_btn}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                className={styles.submit_btn}
                disabled={isSubmitting}
              >
                {isSubmitting && submitStatus === 'saving' ? (
                  <>
                    <span className={`material-symbols-outlined ${styles.spin}`}>
                      autorenew
                    </span>
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>¡Guardado!</span>
                  </>
                ) : (
                  <>
                    <span>Guardar Ingrediente</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Baker's Tip Card */}
        <div className={styles.tip_card}>
          <div className={styles.tip_icon}>
            <span className="material-symbols-outlined">lightbulb</span>
          </div>
          <div className={styles.tip_content}>
            <h4 className={styles.tip_title}>Consejo del Panadero</h4>
            <p className={styles.tip_text}>
              Mantener tu inventario al día asegura que nunca te falte ese toque
              especial a mitad de un horneado. ¡La organización es el primer
              paso para una galleta perfecta!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateProductPage;
