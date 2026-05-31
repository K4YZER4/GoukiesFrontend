import React, { useState } from 'react';
import styles from './AllProductsPage.module.css';
import { Header, Navigation } from '../../components/Layout';

/**
 * AllProductsPage Component
 * Displays all inventory/products in a table format
 */
const AllProductsPage = () => {
  const [activeTab, setActiveTab] = useState('inventario');
  const [selectedCategory, setSelectedCategory] = useState('todo');

  // Mock products data
  const allProducts = [
    {
      id: 1,
      name: 'Harina de Trigo',
      category: 'dry',
      categoryLabel: 'Ingredientes Secos',
      quantity: 2500,
      quantityInv: 2000,
      unit: 'g',
    },
    {
      id: 2,
      name: 'Azúcar Granulada',
      category: 'dry',
      categoryLabel: 'Ingredientes Secos',
      quantity: 1800,
      quantityInv: 1500,
      unit: 'g',
    },
    {
      id: 3,
      name: 'Mantequilla',
      category: 'dairy',
      categoryLabel: 'Lácteos',
      quantity: 800,
      quantityInv: 500,
      unit: 'g',
    },
    {
      id: 4,
      name: 'Chispas de Chocolate',
      category: 'extras',
      categoryLabel: 'Extras',
      quantity: 150,
      quantityInv: 100,
      unit: 'g',
    },
    {
      id: 5,
      name: 'Extracto de Vainilla',
      category: 'flavoring',
      categoryLabel: 'Saborizantes',
      quantity: 100,
      quantityInv: 80,
      unit: 'ml',
    },
    {
      id: 6,
      name: 'Huevos',
      category: 'dairy',
      categoryLabel: 'Lácteos',
      quantity: 12,
      quantityInv: 6,
      unit: 'uds',
    },
  ];

  const categories = [
    { id: 'todo', label: 'Todo' },
    { id: 'dry', label: 'Ingredientes Secos' },
    { id: 'dairy', label: 'Lácteos' },
    { id: 'extras', label: 'Extras' },
    { id: 'flavoring', label: 'Saborizantes' },
    { id: 'yeast', label: 'Levadura' },
  ];

  const filteredProducts =
    selectedCategory === 'todo'
      ? allProducts
      : allProducts.filter((product) => product.category === selectedCategory);

  return (
    <div className={styles.all_products_page}>
      {/* Header */}
      <Header profileInitials="JD" />

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className={styles.main_content}>
        {/* Page Header */}
        <div className={styles.page_header}>
          <div className={styles.header_left}>
            <h2 className={styles.page_title}>Inventario de Ingredientes</h2>
            <p className={styles.page_subtitle}>
              {filteredProducts.length} ingredientes en stock para tus horneados
            </p>
          </div>
          <button className={styles.add_ingredient_btn}>
            <span className="material-symbols-outlined">add</span>
            Agregar Ingrediente
          </button>
        </div>

        {/* Category Filters */}
        <div className={styles.filters_container}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.filter_btn} ${
                selectedCategory === category.id ? styles.filter_btn_active : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Inventory Table */}
        <div className={styles.table_container}>
          <table className={styles.inventory_table}>
            <thead className={styles.table_head}>
              <tr>
                <th className={styles.table_header}>Ingrediente</th>
                <th className={styles.table_header}>MARCA</th>
                <th className={`${styles.table_header} ${styles.text_right}`}>
                  Cantidad
                </th>
                <th className={`${styles.table_header} ${styles.text_right}`}>
                  CANTIDAD INV.
                </th>
                <th className={styles.table_header}>Unidad</th>
                <th className={`${styles.table_header} ${styles.text_right}`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              {filteredProducts.map((product) => (
                <tr key={product.id} className={styles.table_row}>
                  <td className={styles.table_cell_name}>{product.name}</td>
                  <td className={styles.table_cell}>
                    <span className={styles.category_badge}>{product.categoryLabel}</span>
                  </td>
                  <td className={`${styles.table_cell} ${styles.text_right}`}>
                    {product.quantity}
                  </td>
                  <td className={`${styles.table_cell} ${styles.text_right}`}>
                    {product.quantityInv}
                  </td>
                  <td className={styles.table_cell}>{product.unit}</td>
                  <td className={`${styles.table_cell} ${styles.text_right}`}>
                    <div className={styles.action_buttons}>
                      <button className={styles.edit_btn} title="Editar">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className={styles.delete_btn} title="Eliminar">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AllProductsPage;
