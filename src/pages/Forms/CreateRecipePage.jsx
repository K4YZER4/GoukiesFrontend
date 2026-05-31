import React, { useState } from "react";
import styles from "./CreateRecipePage.module.css";
import { Header, Navigation } from "../../components/Layout";
import { Input, Select, IngredientModal } from "../../components";

/**
 * CreateRecipePage Component
 * Form for creating a new recipe with ingredients and instructions
 */
const CreateRecipePage = () => {
  const [activeTab, setActiveTab] = useState("nueva-receta");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIngredientIndex, setModalIngredientIndex] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "facil",
    servings: "",
    prepTime: "",
    cookTime: "",
    image: null,
    ingredients: [{ name: "", quantity: "", unit: "gramos", id: null }],
    instructions: [{ step: 1, description: "" }],
  });

  // Mock inventory data
  const mockInventory = [
    {
      id: 1,
      name: "Harina de Trigo",
      category: "dry",
      categoryLabel: "Ingredientes Secos",
      quantity: 2500,
      quantityInv: 2000,
      unit: "g",
    },
    {
      id: 2,
      name: "Azúcar Granulada",
      category: "dry",
      categoryLabel: "Ingredientes Secos",
      quantity: 1800,
      quantityInv: 1500,
      unit: "g",
    },
    {
      id: 3,
      name: "Mantequilla",
      category: "dairy",
      categoryLabel: "Lácteos",
      quantity: 800,
      quantityInv: 500,
      unit: "g",
    },
    {
      id: 4,
      name: "Chispas de Chocolate",
      category: "extras",
      categoryLabel: "Extras",
      quantity: 150,
      quantityInv: 100,
      unit: "g",
    },
    {
      id: 5,
      name: "Extracto de Vainilla",
      category: "flavoring",
      categoryLabel: "Saborizantes",
      quantity: 100,
      quantityInv: 80,
      unit: "ml",
    },
    {
      id: 6,
      name: "Huevos",
      category: "dairy",
      categoryLabel: "Lácteos",
      quantity: 12,
      quantityInv: 6,
      unit: "uds",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddIngredient = (index) => {
    setModalIngredientIndex(index);
    setIsModalOpen(true);
  };

  const handleSelectIngredient = (ingredient) => {
    const index = modalIngredientIndex;
    setFormData((prev) => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = {
        name: ingredient.name,
        quantity: "",
        unit: ingredient.unit,
        id: ingredient.id,
      };
      return { ...prev, ingredients: newIngredients };
    });
    setIsModalOpen(false);
    setModalIngredientIndex(null);
  };

  const handleAddIngredientRow = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "", unit: "gramos", id: null }],
    }));
  };

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData((prev) => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index][field] = value;
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleAddInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { step: prev.instructions.length + 1, description: "" },
      ],
    }));
  };

  const handleRemoveInstruction = (index) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions
        .filter((_, i) => i !== index)
        .map((instruction, i) => ({ ...instruction, step: i + 1 })),
    }));
  };

  const handleInstructionChange = (index, value) => {
    setFormData((prev) => {
      const newInstructions = [...prev.instructions];
      newInstructions[index].description = value;
      return { ...prev, instructions: newInstructions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className={styles.create_recipe_page}>
      {/* Header */}
      <Header profileInitials="JD" />

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className={styles.main_content}>
        {/* Page Header */}
        <div className={styles.page_header}>
          <h2 className={styles.page_title}>Crear Nueva Receta</h2>
          <p className={styles.page_subtitle}>
            Rellena los detalles para tu nueva creación.
          </p>
        </div>

        {/* Content Grid */}
        <div className={styles.content_grid}>
          {/* Form Column */}
          <div className={styles.form_column}>
            {/* Basic Information Card */}
            <section className={styles.form_card}>
              <div className={styles.card_header}>
                <span className="material-symbols-outlined">info</span>
                <h3 className={styles.card_title}>Información Básica</h3>
              </div>

              <div className={styles.form_space}>
                <div className={styles.form_group}>
                  <label className={styles.form_label}>Nombre de la Receta</label>
                  <Input
                    name="title"
                    placeholder="p. ej., Galletas de Chispas de Chocolate"
                    value={formData.title}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </div>

                <div className={styles.form_group}>
                  <label className={styles.form_label}>Descripción</label>
                  <textarea
                    name="description"
                    placeholder="Describe tu receta..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows="3"
                  />
                </div>

                <div className={styles.form_grid}>
                  <div className={styles.form_group}>
                    <label className={styles.form_label}>Porciones</label>
                    <Input
                      name="servings"
                      placeholder="p. ej., 24"
                      type="number"
                      value={formData.servings}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </div>
                  <div className={styles.form_group}>
                    <label className={styles.form_label}>Tiempo de Prep (min)</label>
                    <Input
                      name="prepTime"
                      placeholder="p. ej., 15"
                      type="number"
                      value={formData.prepTime}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </div>
                  <div className={styles.form_group}>
                    <label className={styles.form_label}>Tiempo de Cocción (min)</label>
                    <Input
                      name="cookTime"
                      placeholder="p. ej., 20"
                      type="number"
                      value={formData.cookTime}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Ingredients Card */}
            <section className={styles.form_card}>
              <div className={styles.card_header_with_btn}>
                <div className={styles.card_header}>
                  <span className="material-symbols-outlined">kitchen</span>
                  <h3 className={styles.card_title}>Ingredientes</h3>
                </div>
                <button
                  className={styles.add_btn}
                  type="button"
                  onClick={handleAddIngredientRow}
                >
                  <span className="material-symbols-outlined">add</span>
                  Añadir
                </button>
              </div>

              <div className={styles.ingredients_list}>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className={styles.ingredient_row}>
                    <div className={styles.ingredient_input_group}>
                      <button
                        type="button"
                        className={styles.ingredient_select_btn}
                        onClick={() => handleAddIngredient(index)}
                      >
                        {ingredient.name || "Seleccionar ingrediente..."}
                        <span className="material-symbols-outlined">search</span>
                      </button>
                    </div>
                    <div className={styles.ingredient_quantity}>
                      <Input
                        placeholder="Cant."
                        type="number"
                        step="0.1"
                        value={ingredient.quantity}
                        onChange={(e) =>
                          handleIngredientChange(index, "quantity", e.target.value)
                        }
                        fullWidth
                      />
                    </div>
                    <div className={styles.ingredient_unit}>
                      <Select
                        value={ingredient.unit}
                        onChange={(e) =>
                          handleIngredientChange(index, "unit", e.target.value)
                        }
                        options={[
                          { value: "gramos", label: "gramos" },
                          { value: "tazas", label: "tazas" },
                          { value: "unidades", label: "unidades" },
                          { value: "ml", label: "ml" },
                        ]}
                      />
                    </div>
                    {formData.ingredients.length > 1 && (
                      <button
                        className={styles.remove_btn}
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Instructions Card */}
            <section className={styles.form_card}>
              <div className={styles.card_header_with_btn}>
                <div className={styles.card_header}>
                  <span className="material-symbols-outlined">description</span>
                  <h3 className={styles.card_title}>Instrucciones</h3>
                </div>
                <button
                  className={styles.add_btn}
                  type="button"
                  onClick={handleAddInstruction}
                >
                  <span className="material-symbols-outlined">add</span>
                  Añadir
                </button>
              </div>

              <div className={styles.instructions_list}>
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className={styles.instruction_row}>
                    <div className={styles.instruction_step}>
                      <span>{instruction.step}</span>
                    </div>
                    <div className={styles.instruction_input}>
                      <textarea
                        placeholder="Describe este paso..."
                        value={instruction.description}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        className={styles.instruction_textarea}
                        rows="3"
                      />
                    </div>
                    {formData.instructions.length > 1 && (
                      <button
                        className={styles.remove_btn}
                        type="button"
                        onClick={() => handleRemoveInstruction(index)}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Submit Button */}
            <div className={styles.form_actions}>
              <button
                className={styles.cancel_btn}
                type="button"
              >
                Cancelar
              </button>
              <button
                className={styles.submit_btn}
                type="submit"
                onClick={handleSubmit}
              >
                <span className="material-symbols-outlined">check</span>
                Guardar Receta
              </button>
            </div>
          </div>

          {/* Preview Column */}
          <div className={styles.preview_column}>
            <div className={styles.preview_card}>
              <div className={styles.preview_image_placeholder}>
                <span className="material-symbols-outlined">image</span>
              </div>
              <h4 className={styles.preview_title}>{formData.title || "Nombre de la Receta"}</h4>
              <p className={styles.preview_description}>
                {formData.description || "Aquí aparecerá la descripción de tu receta..."}
              </p>
              <div className={styles.preview_meta}>
                <div className={styles.preview_meta_item}>
                  <span className="material-symbols-outlined">schedule</span>
                  <span>{formData.prepTime ? formData.prepTime + " min" : "- min"}</span>
                </div>
                <div className={styles.preview_meta_item}>
                  <span className="material-symbols-outlined">restaurant</span>
                  <span>{formData.servings || "- porciones"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Ingredient Modal */}
      <IngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectIngredient={handleSelectIngredient}
        ingredients={mockInventory}
      />
    </div>
  );
};

export default CreateRecipePage;
