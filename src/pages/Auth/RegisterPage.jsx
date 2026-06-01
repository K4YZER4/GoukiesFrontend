import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import { Input } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import authService from '../../services/authService';

/**
 * RegisterPage Component
 * User registration page
 * Conecta a POST /users/create y auto-login después
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    correo_electronico: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Validaciones básicas
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.correo_electronico.trim()) {
      newErrors.correo_electronico = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Validar antes de enviar
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Llamar a la API para crear usuario
      const response = await authService.register(
        formData.nombre,
        formData.correo_electronico,
        formData.password,
        'MXN' // moneda por defecto
      );

      // El backend devuelve el usuario creado
      // Auto-login: convertir la respuesta al formato que espera login
      const userData = {
        id: response.id,
        nombre: response.nombre,
        correo_electronico: response.correo_electronico,
      };

      login(userData);

      // Mostrar toast de éxito
      success(`¡Bienvenido ${userData.nombre}! Tu cuenta ha sido creada.`);

      // Redirigir a dashboard (en lugar de login)
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Register error:', err);

      // Mostrar error específico
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error al crear la cuenta. Intenta de nuevo.';

      error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.register_page}>
      {/* Background decoration */}
      <div className={styles.register_background}></div>

      {/* Content */}
      <div className={styles.register_content}>
        {/* Header with logo */}
        <header className={styles.register_header}>
          <div className={styles.register_logo_container}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3AXcO2sTuOfT4DgC1XBwxm1u4IaBFvTcXu6G0YuhRm4__wv9cPQjw9_VxzQsK1E1QzWfPVr7vMq05TLbtQajI3cnRdF476FgvTObUAJif4cVuf6guZxdx1zu0ls1UEjCrdiOfU-E74QaAaQbr8UAMI_hTl2K8pwVLsV7jCGaBbB0bY6qpi1R7AtosXHWhhShVZ02x6YZ1PWBSYmnKDds_l7E0WOviNHJsAbL8xF_T9Ky4NLmmxJLAIG1YjyKwYVvHXrda9msE5Wfo"
              alt="Goukie Logo"
              className={styles.register_logo}
            />
          </div>
          <h1 className={styles.register_title}>Goukies</h1>
        </header>

        {/* Main card */}
        <main className={styles.register_card}>
          {/* Title section */}
          <div className={styles.register_card_header}>
            <h2 className={styles.register_card_title}>Registrarse</h2>
            <p className={styles.register_card_subtitle}>
              Crea tu cuenta para empezar a hornear
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegisterSubmit} className={styles.register_form}>
            {/* Full Name Field */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>Nombre Completo</label>
              <Input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                fullWidth
              />
              {errors.nombre && (
                <span className={styles.error_message}>{errors.nombre}</span>
              )}
            </div>

            {/* Email Field */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>Correo Electrónico</label>
              <Input
                type="email"
                name="correo_electronico"
                placeholder="correo@ejemplo.com"
                value={formData.correo_electronico}
                onChange={handleInputChange}
                required
                fullWidth
              />
              {errors.correo_electronico && (
                <span className={styles.error_message}>{errors.correo_electronico}</span>
              )}
            </div>

            {/* Password Field */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>Contraseña</label>
              <Input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                required
                fullWidth
              />
              {errors.password && (
                <span className={styles.error_message}>{errors.password}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>Confirmar Contraseña</label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                fullWidth
              />
              {errors.confirmPassword && (
                <span className={styles.error_message}>{errors.confirmPassword}</span>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className={styles.register_button}
              disabled={isLoading}
            >
              <span>{isLoading ? 'Creando cuenta...' : 'Registrarse'}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className={styles.register_divider}>
            <div className={styles.register_divider_line}></div>
            <span className={styles.register_divider_text}>o si ya tienes cuenta</span>
            <div className={styles.register_divider_line}></div>
          </div>

          {/* Login button */}
          <Link to="/login" className={styles.login_link_button}>
            Iniciar Sesión
          </Link>
        </main>

        {/* Footer */}
        <footer className={styles.register_footer}>
          <div className={styles.register_footer_links}>
            <a href="#" className={styles.register_footer_link}>
              Ayuda
            </a>
            <a href="#" className={styles.register_footer_link}>
              Términos
            </a>
            <a href="#" className={styles.register_footer_link}>
              Privacidad
            </a>
          </div>
          <p className={styles.register_footer_copyright}>
            © 2024 Goukies Recipe Manager. Horneado con amor.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default RegisterPage;
