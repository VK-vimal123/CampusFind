import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredUser } from '../data/mockItems';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const user = getStoredUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
