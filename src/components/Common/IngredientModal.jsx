import React, { useState, useMemo } from "react";
import styles from "./IngredientModal.module.css";
import Modal from "./Modal";

/**
 * IngredientModal Component
 * Modal to select ingredients from inventory
 * Handles both API format (nombre) and legacy format (name)
 */
const IngredientModal = ({ isOpen, onClose, onSelectIngredient, ingredients = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Normalize ingredients to handle both API format (nombre) and legacy format (name)
  const normalizedIngredients = useMemo(() => {
    return (ingredients || []).map(ing => ({
      ...ing,
      name: ing.name || ing.nombre || ing.ingrediente || 'Sin nombre',
      category: ing.category || ing.tipo || 'general',
      categoryLabel: ing.categoryLabel || ing.tipo || 'General',
      quantityInv: ing.quantityInv || ing.cantidad_inventario || 0,
      unit: ing.unit || ing.unidad || 'ud',
    }));
  }, [ingredients]);

  // Get unique categories from ingredients
  const categories = useMemo(() => {
    const cats = new Set(normalizedIngredients.map(ing => ing.category || "general"));
    return [{ id: "all", label: "Todos", count: normalizedIngredients.length }, ...Array.from(cats).map(cat => ({
      id: cat,
      label: cat,
      count: normalizedIngredients.filter(ing => ing.category === cat).length
    }))];
  }, [normalizedIngredients]);

  // Filter ingredients based on search and category
  const filteredIngredients = useMemo(() => {
    return normalizedIngredients.filter(ing => {
      const name = (ing.name || '').toLowerCase();
      const catLabel = (ing.categoryLabel || '').toLowerCase();
      const search = (searchTerm || '').toLowerCase();
      const matchesSearch = name.includes(search) || catLabel.includes(search);
      const matchesCategory = selectedCategory === "all" || ing.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [normalizedIngredients, searchTerm, selectedCategory]);

  const handleSelectIngredient = (ingredient) => {
    onSelectIngredient(ingredient);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Seleccionar Ingrediente" size="large">
      <div className={styles.ingredient_modal_content}>
        {/* Search */}
        <div className={styles.search_section}>
          <div className={styles.search_input_wrapper}>
            <span className={`${styles.search_icon} material-symbols-outlined`}>search</span>
            <input
              type="text"
              className={styles.search_input}
              placeholder="Buscar ingrediente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Categories Filter */}
        <div className={styles.categories_section}>
          <div className={styles.categories_scroll}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`${styles.category_filter} ${selectedCategory === cat.id ? styles.category_filter_active : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
                <span className={styles.category_count}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients List */}
        <div className={styles.ingredients_list}>
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map(ingredient => (
              <button
                key={ingredient.id}
                className={styles.ingredient_item}
                onClick={() => handleSelectIngredient(ingredient)}
              >
                <div className={styles.ingredient_info}>
                  <div className={styles.ingredient_name}>{ingredient.name}</div>
                  <div className={styles.ingredient_details}>
                    <span className={styles.ingredient_category}>{ingredient.categoryLabel}</span>
                    <span className={styles.ingredient_quantity}>
                      {ingredient.quantityInv} {ingredient.unit}
                    </span>
                  </div>
                </div>
                <span className={`${styles.ingredient_arrow} material-symbols-outlined`}>
                  arrow_forward
                </span>
              </button>
            ))
          ) : (
            <div className={styles.no_results}>
              <span className="material-symbols-outlined">search_off</span>
              <p>No se encontraron ingredientes</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default IngredientModal;
