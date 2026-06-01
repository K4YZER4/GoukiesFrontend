import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateRecipePage.module.css";
import { Header, Navigation } from "../../components/Layout";
import { LoadingSpinner } from "../../components/Common";
import { Input, Select, IngredientModal } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import recipeService from "../../services/recipeService";
import ingredientService from "../../services/ingredientService";
import imageUploadService from "../../services/imageUploadService";
import { recipeStorage } from "../../utils/localStorage";

/**
 * CreateRecipePage Component
 * Form for creating a new recipe with ingredients and instructions
 */
const CreateRecipePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIngredientIndex, setModalIngredientIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    descripcion: "",
    dificultad: "facil",
    porciones: "",
    tiempo: "",
    imagen: null,
    imagenUrl: null, // Para guardar la URL de Cloudinary
    ingredientes: [{ nombre: "", cantidad: "", unidad: "gramos", id: null }],
    instrucciones: [{ paso: 1, descripcion: "" }],
  });

  // Load inventory data on mount
  useEffect(() => {
    const loadInventory = async () => {
      try {
        setIsLoadingInventory(true);
        if (user?.id) {
          const data = await ingredientService.getAllIngredients(user.id);
          if (data && data.ingredientes) {
            setInventoryData(data.ingredientes);
          }
        }
      } catch (error) {
        console.error('Error loading inventory:', error);
        // Try to load from cache
        const cached = ingredientStorage.getIngredientsMetadata();
        if (cached?.ingredientes) {
          setInventoryData(cached.ingredientes);
        }
        // Don't show toast for inventory load errors - not critical
      } finally {
        setIsLoadingInventory(false);
      }
    };

    loadInventory();
  }, [user?.id]);

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
      const newIngredientes = [...prev.ingredientes];
      newIngredientes[index] = {
        nombre: ingredient.nombre,
        cantidad: "",
        unidad: ingredient.unidad,
        id: ingredient.id,
      };
      return { ...prev, ingredientes: newIngredientes };
    });
    setIsModalOpen(false);
    setModalIngredientIndex(null);
  };

  const handleAddIngredientRow = () => {
    setFormData((prev) => ({
      ...prev,
      ingredientes: [...prev.ingredientes, { nombre: "", cantidad: "", unidad: "gramos", id: null }],
    }));
  };

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData((prev) => {
      const newIngredientes = [...prev.ingredientes];
      newIngredientes[index][field] = value;
      return { ...prev, ingredientes: newIngredientes };
    });
  };

  const handleAddInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instrucciones: [
        ...prev.instrucciones,
        { paso: prev.instrucciones.length + 1, descripcion: "" },
      ],
    }));
  };

  const handleRemoveInstruction = (index) => {
    setFormData((prev) => ({
      ...prev,
      instrucciones: prev.instrucciones
        .filter((_, i) => i !== index)
        .map((instruction, i) => ({ ...instruction, paso: i + 1 })),
    }));
  };

  const handleInstructionChange = (index, value) => {
    setFormData((prev) => {
      const newInstrucciones = [...prev.instrucciones];
      newInstrucciones[index].descripcion = value;
      return { ...prev, instrucciones: newInstrucciones };
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validar imagen
      const validation = imageUploadService.validateImage(file);
      if (!validation.isValid) {
        showToast(validation.error, 'error');
        return;
      }

      setIsUploadingImage(true);

      // Subir a Cloudinary
      const imageUrl = await imageUploadService.uploadImage(file);

      // Guardar URL en formData
      setFormData((prev) => ({
        ...prev,
        imagen: file,
        imagenUrl: imageUrl,
      }));

      showToast('¡Imagen subida exitosamente!', 'success');
    } catch (error) {
      console.error('Image upload error:', error);
      showToast(error.message || 'Error al subir la imagen', 'error');
    } finally {
      setIsUploadingImage(false);
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      showToast('El nombre de la receta es requerido', 'error');
      return;
    }

    if (formData.ingredientes.every(ing => !ing.nombre)) {
      showToast('Añade al menos un ingrediente', 'error');
      return;
    }

    if (formData.instrucciones.every(inst => !inst.descripcion)) {
      showToast('Añade al menos una instrucción', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare data for API - formato correcto según la API de NestJS
      const recipeData = {
        nombre: formData.title,
        descripcion: formData.descripcion,
        profit: parseInt(formData.porciones) || 0,
        porcionesTotales: parseInt(formData.porciones) || 0,
        idUsuario: user.id,
        ingredientes: formData.ingredientes
          .filter(ing => ing.nombre && ing.id)
          .map(ing => ({
            id_producto: ing.id,
          })),
        pasos: formData.instrucciones
          .filter(inst => inst.descripcion)
          .map((inst, index) => ({
            paso: inst.descripcion,
            orden: index + 1,
          })),
      };

      // Call API to create recipe
      const response = await recipeService.createRecipe(recipeData);

      if (response) {
        showToast('¡Receta creada exitosamente!', 'success');
        
        // Update local cache
        const cachedRecipes = recipeStorage.getAll() || [];
        recipeStorage.setAll([...cachedRecipes, response]);

        // Redirect to recipes page
        navigate('/recetas');
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear la receta';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('¿Descartar cambios?')) {
      navigate('/recetas');
    }
  };

  if (isLoadingInventory) {
    return (
      <div className={styles.create_recipe_page}>
        <Header />
        <Navigation />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '50vh' }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.create_recipe_page}>
      {/* Header */}
      <Header />

      {/* Navigation */}
      <Navigation />

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
                    name="descripcion"
                    placeholder="Describe tu receta..."
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows="3"
                  />
                </div>

                <div className={styles.form_grid}>
                  <div className={styles.form_group}>
                    <label className={styles.form_label}>Porciones</label>
                    <Input
                      name="porciones"
                      placeholder="p. ej., 24"
                      type="number"
                      value={formData.porciones}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </div>
                  <div className={styles.form_group}>
                    <label className={styles.form_label}>Tiempo Total (min)</label>
                    <Input
                      name="tiempo"
                      placeholder="p. ej., 35"
                      type="number"
                      value={formData.tiempo}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </div>
                  <div className={styles.form_group}>
                    <label className={styles.form_label}>Dificultad</label>
                    <Select
                      name="dificultad"
                      value={formData.dificultad}
                      onChange={handleInputChange}
                      options={[
                        { value: "facil", label: "Fácil" },
                        { value: "medio", label: "Medio" },
                        { value: "dificil", label: "Difícil" },
                      ]}
                      fullWidth
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Ingredients Card */}
            <section className={styles.form_card}>
              <div className={styles.card_header}>
                <span className="material-symbols-outlined">shopping_cart</span>
                <h3 className={styles.card_title}>Ingredientes</h3>
              </div>

              <div className={styles.form_space}>
                {formData.ingredientes.map((ingredient, index) => (
                  <div key={index} className={styles.ingredient_row}>
                    <Input
                      placeholder="Nombre del ingrediente..."
                      value={ingredient.nombre}
                      onChange={(e) => handleIngredientChange(index, "nombre", e.target.value)}
                      fullWidth
                      readOnly
                      onClick={() => handleAddIngredient(index)}
                      style={{ cursor: 'pointer' }}
                    />
                    <Input
                      placeholder="Cantidad"
                      type="number"
                      value={ingredient.cantidad}
                      onChange={(e) => handleIngredientChange(index, "cantidad", e.target.value)}
                      style={{ maxWidth: "100px" }}
                    />
                    <Select
                      value={ingredient.unidad}
                      onChange={(e) => handleIngredientChange(index, "unidad", e.target.value)}
                      options={[
                        { value: "gramos", label: "g" },
                        { value: "mililitros", label: "ml" },
                        { value: "unidades", label: "ud" },
                        { value: "cucharadas", label: "cda" },
                        { value: "tazas", label: "taza" },
                      ]}
                      style={{ maxWidth: "80px" }}
                    />
                    {formData.ingredientes.length > 1 && (
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

                <button
                  className={styles.add_btn}
                  type="button"
                  onClick={handleAddIngredientRow}
                >
                  <span className="material-symbols-outlined">add</span>
                  Añadir Ingrediente
                </button>
              </div>
            </section>

            {/* Instructions Card */}
            <section className={styles.form_card}>
              <div className={styles.card_header}>
                <span className="material-symbols-outlined">checklist</span>
                <h3 className={styles.card_title}>Instrucciones</h3>
              </div>

              <div className={styles.form_space}>
                {formData.instrucciones.map((instruction, index) => (
                  <div key={index} className={styles.instruction_row}>
                    <div className={styles.instruction_number}>
                      <span>{instruction.paso}</span>
                    </div>
                    <div className={styles.instruction_input}>
                      <textarea
                        placeholder="Describe este paso..."
                        value={instruction.descripcion}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        className={styles.instruction_textarea}
                        rows="3"
                      />
                    </div>
                    {formData.instrucciones.length > 1 && (
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

                <button
                  className={styles.add_btn}
                  type="button"
                  onClick={handleAddInstruction}
                >
                  <span className="material-symbols-outlined">add</span>
                  Añadir Paso
                </button>
              </div>
            </section>

            {/* Submit Button */}
            <div className={styles.form_actions}>
              <button
                className={styles.cancel_btn}
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                className={styles.submit_btn}
                type="submit"
                onClick={handleSubmit}
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
                    Guardar Receta
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Column */}
          <div className={styles.preview_column}>
            <div className={styles.preview_card}>
              {/* Clickable Image Area */}
              <div 
                className={styles.preview_image_placeholder}
                onClick={handleImageClick}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                {formData.imagenUrl ? (
                  <>
                    <img 
                      src={formData.imagenUrl} 
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 'inherit',
                      }}
                    />
                    {!isUploadingImage && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'inherit',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        ':hover': { opacity: 1 }
                      }}>
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '2rem' }}>
                          edit
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {isUploadingImage ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <LoadingSpinner />
                      </div>
                    ) : (
                      <span className="material-symbols-outlined">image</span>
                    )}
                  </>
                )}
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              <h4 className={styles.preview_title}>{formData.title || "Nombre de la Receta"}</h4>
              <p className={styles.preview_description}>
                {formData.descripcion || "Aquí aparecerá la descripción de tu receta..."}
              </p>
              <div className={styles.preview_meta}>
                <div className={styles.preview_meta_item}>
                  <span className="material-symbols-outlined">schedule</span>
                  <span>{formData.tiempo ? formData.tiempo + " min" : "- min"}</span>
                </div>
                <div className={styles.preview_meta_item}>
                  <span className="material-symbols-outlined">restaurant</span>
                  <span>{formData.porciones || "- porciones"}</span>
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
        ingredients={inventoryData}
      />
    </div>
  );
};

export default CreateRecipePage;
