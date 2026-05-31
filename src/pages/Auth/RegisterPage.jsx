import React, { useState } from 'react';
import styles from './RegisterPage.module.css';
import { Input } from '../../components';

/**
 * RegisterPage Component
 * User registration page
 */
const RegisterPage = ({ onRegisterSuccess = null, onNavigateToLogin = null }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Register attempt:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onRegisterSuccess) {
        onRegisterSuccess(formData);
      }
    } catch (error) {
      console.error('Register error:', error);
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
                name="fullName"
                icon="person"
                placeholder="Tu nombre"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </div>

            {/* Email Field */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>Correo Electrónico</label>
              <Input
                type="email"
                name="email"
                icon="mail"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
              />
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
            </div>

            {/* Confirm Password Field */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>Confirmar Contraseña</label>
              <Input
                type="password"
                name="confirmPassword"
                icon="verified_user"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className={styles.register_button}
              disabled={isLoading}
            >
              <span>Registrarse</span>
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
          <button
            className={styles.login_link_button}
            onClick={onNavigateToLogin}
          >
            Iniciar Sesión
          </button>
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
