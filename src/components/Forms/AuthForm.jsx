import React, { useState } from 'react';
import styles from './AuthForm.module.css';
import { Input, Button } from '../Common';

/**
 * AuthForm Component
 * Reusable form for login and registration
 */
const AuthForm = ({
  type = 'login', // 'login' or 'register'
  onSubmit = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const isLoginForm = type === 'login';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLoginForm && !formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (!isLoginForm && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form className={styles.auth_form} onSubmit={handleSubmit}>
      {/* Full Name - Solo en registro */}
      {!isLoginForm && (
        <Input
          type="text"
          name="fullName"
          label="Nombre Completo"
          placeholder="Tu nombre"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          icon={<span className="material-symbols-outlined">person</span>}
        />
      )}

      {/* Email */}
      <Input
        type="email"
        name="email"
        label="Correo Electrónico"
        placeholder="ejemplo@correo.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={<span className="material-symbols-outlined">mail</span>}
      />

      {/* Password */}
      <Input
        type="password"
        name="password"
        label="Contraseña"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        icon={<span className="material-symbols-outlined">lock</span>}
      />

      {/* Confirm Password - Solo en registro */}
      {!isLoginForm && (
        <Input
          type="password"
          name="confirmPassword"
          label="Confirmar Contraseña"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={<span className="material-symbols-outlined">verified_user</span>}
        />
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        disabled={isLoading}
        icon={<span className="material-symbols-outlined">arrow_forward</span>}
        iconPosition="right"
      >
        {isLoading ? 'Procesando...' : isLoginForm ? 'Iniciar Sesión' : 'Registrarse'}
      </Button>
    </form>
  );
};

export default AuthForm;
