import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { Input } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import authService from '../../services/authService';

/**
 * LoginPage Component
 * User login page with email/username and password
 * Conecta a POST /auth/login
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({ identificador: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Validaciones básicas
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.identificador.trim()) {
      newErrors.identificador = 'El email o usuario es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Validar antes de enviar
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Llamar a la API
      const response = await authService.login(
        formData.identificador,
        formData.password
      );

      // El backend ahora devuelve { mensaje, usuario: { id, nombre, correo_electronico } }
      const userData = response.usuario;

      // Guardar en contexto (que a su vez guarda en localStorage)
      login(userData);

      // Mostrar toast de éxito
      success(`¡Bienvenido ${userData.nombre}!`);

      // Redirigir a dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);

      // Mostrar error específico
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error al iniciar sesión. Verifica tus credenciales.';

      error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.login_page}>
      {/* Background decoration */}
      <div className={styles.login_background}></div>

      {/* Content */}
      <div className={styles.login_content}>
        {/* Header with logo */}
        <header className={styles.login_header}>
          <div className={styles.login_logo_container}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3AXcO2sTuOfT4DgC1XBwxm1u4IaBFvTcXu6G0YuhRm4__wv9cPQjw9_VxzQsK1E1QzWfPVr7vMq05TLbtQajI3cnRdF476FgvTObUAJif4cVuf6guZxdx1zu0ls1UEjCrdiOfU-E74QaAaQbr8UAMI_hTl2K8pwVLsV7jCGaBbB0bY6qpi1R7AtosXHWhhShVZ02x6YZ1PWBSYmnKDds_l7E0WOviNHJsAbL8xF_T9Ky4NLmmxJLAIG1YjyKwYVvHXrda9msE5Wfo"
              alt="Goukie Logo"
              className={styles.login_logo}
            />
          </div>
          <h1 className={styles.login_title}>Goukies</h1>
        </header>

        {/* Main card */}
        <main className={styles.login_card}>
          {/* Title section */}
          <div className={styles.login_card_header}>
            <h2 className={styles.login_card_title}>Iniciar Sesión</h2>
            <p className={styles.login_card_subtitle}>
              Accede a tu cuenta para continuar horneando
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className={styles.login_form}>
            {/* Email/Usuario Field */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>Correo o Usuario</label>
              <Input
                type="text"
                name="identificador"
                icon="mail"
                placeholder="usuario@correo.com o tu_usuario"
                value={formData.identificador}
                onChange={handleInputChange}
                required
                fullWidth
              />
              {errors.identificador && (
                <span className={styles.error_message}>{errors.identificador}</span>
              )}
            </div>

            {/* Password Field */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>Contraseña</label>
              <Input
                type="password"
                name="password"
                icon="lock"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
                fullWidth
              />
              {errors.password && (
                <span className={styles.error_message}>{errors.password}</span>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={styles.login_button}
              disabled={isLoading}
            >
              <span>{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className={styles.login_divider}>
            <div className={styles.login_divider_line}></div>
            <span className={styles.login_divider_text}>o si no tienes cuenta</span>
            <div className={styles.login_divider_line}></div>
          </div>

          {/* Register button */}
          <Link to="/register" className={styles.register_link_button}>
            Crear Cuenta
          </Link>
        </main>

        {/* Footer */}
        <footer className={styles.login_footer}>
          <div className={styles.login_footer_links}>
            <a href="#" className={styles.login_footer_link}>
              Ayuda
            </a>
            <a href="#" className={styles.login_footer_link}>
              Términos
            </a>
            <a href="#" className={styles.login_footer_link}>
              Privacidad
            </a>
          </div>
          <p className={styles.login_footer_copyright}>
            © 2024 Goukies Recipe Manager. Horneado con amor.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
