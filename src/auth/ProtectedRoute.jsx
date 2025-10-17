import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (!profile?.approved) return <Navigate to="/" replace />;
  if (requiredRole && profile?.role !== requiredRole) return <Navigate to="/" replace />;

  return children;
}
