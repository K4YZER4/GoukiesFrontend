import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
 * 
 * Routes:
 * - /login - Login page
 * - /register - Registration page
 * - /dashboard - Main dashboard (home)
 * - /recetas - All recipes page
 * - /recetas/:id - Single recipe page
 * - /nueva-receta - Create recipe page
 * - /inventario - Products/inventory page
 * - /nuevo-ingrediente - Create product page
 * - / - Redirect to dashboard
 */
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard & Main Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Recipes Routes */}
        <Route path="/recetas" element={<AllRecipesPage />} />
        <Route path="/recetas/:id" element={<SelectedRecipePage />} />
        <Route path="/nueva-receta" element={<CreateRecipePage />} />

        {/* Inventory/Products Routes */}
        <Route path="/inventario" element={<AllProductsPage />} />
        <Route path="/nuevo-ingrediente" element={<CreateProductPage />} />

        {/* 404 - Not Found (redirect to dashboard) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
