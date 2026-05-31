import React, { useState, useMemo } from "react";
import styles from "./IngredientModal.module.css";
import Modal from "./Modal";

/**
 * IngredientModal Component
 * Modal to select ingredients from inventory
 */
const IngredientModal = ({ isOpen, onClose, onSelectIngredient, ingredients = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique categories from ingredients
  const categories = useMemo(() => {
    const cats = new Set(ingredients.map(ing => ing.category || "general"));
    return [{ id: "all", label: "Todos", count: ingredients.length }, ...Array.from(cats).map(cat => ({
      id: cat,
      label: cat,
      count: ingredients.filter(ing => ing.category === cat).length
    }))];
  }, [ingredients]);

  // Filter ingredients based on search and category
  const filteredIngredients = useMemo(() => {
    return ingredients.filter(ing => {
      const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ing.categoryLabel && ing.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || ing.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [ingredients, searchTerm, selectedCategory]);

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
