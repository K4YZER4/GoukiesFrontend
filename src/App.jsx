import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer, ProtectedRoute } from './components/Common';

// Import pages
import { LoginPage, RegisterPage } from './pages/Auth';
import { DashboardPage } from './pages/Dashboard';
import AllRecipesPage from './pages/Dashboard/AllRecipesPage';
import AllProductsPage from './pages/Dashboard/AllProductsPage';
import SelectedRecipePage from './pages/Dashboard/SelectedRecipePage';
import { CreateRecipePage } from './pages/Forms';
import { CreateProductPage } from './pages/Forms';

/**
 * App Component
 * Main application component with React Router setup
 * Wrapped with AuthProvider and ToastProvider for global state
 * 
 * Routes:
 * - /login - Login page (público)
 * - /register - Registration page (público)
 * - /dashboard - Main dashboard (protegido)
 * - /recetas - All recipes page (protegido)
 * - /recetas/:id - Single recipe page (protegido)
 * - /nueva-receta - Create recipe page (protegido)
 * - /inventario - Products/inventory page (protegido)
 * - /nuevo-ingrediente - Create product page (protegido)
 * - / - Redirect to dashboard
 */
const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ToastContainer />
          <Routes>
            {/* Authentication Routes - Públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard & Main Routes - Protegidas */}
            <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Recipes Routes - Protegidas */}
            <Route path="/recetas" element={<ProtectedRoute element={<AllRecipesPage />} />} />
            <Route path="/recetas/:id" element={<ProtectedRoute element={<SelectedRecipePage />} />} />
            <Route path="/nueva-receta" element={<ProtectedRoute element={<CreateRecipePage />} />} />

            {/* Inventory/Products Routes - Protegidas */}
            <Route path="/inventario" element={<ProtectedRoute element={<AllProductsPage />} />} />
            <Route path="/nuevo-ingrediente" element={<ProtectedRoute element={<CreateProductPage />} />} />

            {/* 404 - Not Found (redirect to dashboard) */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
