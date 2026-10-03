import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ExplorePage from '../../pages/ExplorePage';
import SavedPage from '../../pages/SavedPage';
import ComparePage from '../../pages/ComparePage';
import ConciergePage from '../../pages/ConciergePage';
import CarDetailPage from '../../pages/CarDetailPage';
import LoginPage from '../../pages/LoginPage';
import SignupPage from '../../pages/SignupPage';
import AdminDashboardPage from '../../pages/admin/AdminDashboardPage';
import AdminInventoryPage from '../../pages/admin/AdminInventoryPage';
import AdminAddCarPage from '../../pages/admin/AdminAddCarPage';
import AdminFeaturedPage from '../../pages/admin/AdminFeaturedPage';
import AdminFinancePage from '../../pages/admin/AdminFinancePage';
import AdminCustomersPage from '../../pages/admin/AdminCustomersPage';
import { useAuth } from '../../context/AuthContext';

function RequireAdmin({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function HomeRoute() {
  const { isAdmin } = useAuth();
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return <ExplorePage />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/explore" element={<HomeRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/test-drives" element={<Navigate to="/" replace />} />
      <Route path="/contact" element={<ConciergePage />} />
      <Route path="/concierge" element={<Navigate to="/contact" replace />} />
      <Route path="/car/:id" element={<CarDetailPage />} />
      
      {/* Structured Admin Section */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboardPage />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/inventory"
        element={
          <RequireAdmin>
            <AdminInventoryPage />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/new"
        element={
          <RequireAdmin>
            <AdminAddCarPage />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <RequireAdmin>
            <AdminCustomersPage />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/featured"
        element={<Navigate to="/admin/inventory" replace />}
      />
      <Route
        path="/admin/finance"
        element={
          <RequireAdmin>
            <AdminFinancePage />
          </RequireAdmin>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
