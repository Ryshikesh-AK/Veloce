import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ExplorePage from '../../pages/ExplorePage';
import SavedPage from '../../pages/SavedPage';
import ComparePage from '../../pages/ComparePage';
import ConciergePage from '../../pages/ConciergePage';
import CarDetailPage from '../../pages/CarDetailPage';
import LoginPage from '../../pages/LoginPage';
import SignupPage from '../../pages/SignupPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<ExplorePage />} />
      <Route path="/explore" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/test-drives" element={<Navigate to="/" replace />} />
      <Route path="/contact" element={<ConciergePage />} />
      <Route path="/concierge" element={<Navigate to="/contact" replace />} />
      <Route path="/car/:id" element={<CarDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
