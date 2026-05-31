import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { Input } from '../../components';

/**
 * LoginPage Component
 * User login page with email and password
 */
const LoginPage = ({ onLoginSuccess = null, onNavigateToRegister = null }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Login attempt:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onLoginSuccess) {
        onLoginSuccess(formData);
      }
    } catch (error) {
      console.error('Login error:', error);
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

            {/* Login Button */}
            <button
              type="submit"
              className={styles.login_button}
              disabled={isLoading}
            >
              <span>Iniciar Sesión</span>
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
          <button
            className={styles.register_link_button}
            onClick={onNavigateToRegister}
          >
            Crear Cuenta
          </button>
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
