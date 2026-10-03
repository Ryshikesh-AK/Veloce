import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ExplorePage from '../../pages/ExplorePage';
import SavedPage from '../../pages/SavedPage';
import ComparePage from '../../pages/ComparePage';
import TestDrivesPage from '../../pages/TestDrivesPage';
import ConciergePage from '../../pages/ConciergePage';
import CarDetailPage from '../../pages/CarDetailPage';
import TestDriveRequestPage from '../../pages/TestDriveRequestPage';
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
      <Route path="/test-drives" element={<TestDrivesPage />} />
      <Route path="/test-drive/request" element={<TestDriveRequestPage />} />
      <Route path="/test-drive/request/:id" element={<TestDriveRequestPage />} />
      <Route path="/concierge" element={<ConciergePage />} />
      <Route path="/car/:id" element={<CarDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
