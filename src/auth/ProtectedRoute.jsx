import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { isFallbackAdmin } from './adminFallback';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  const fallbackAdmin = isFallbackAdmin(user?.email);
  const isApproved = profile?.approved || fallbackAdmin;
  const role = profile?.role || (fallbackAdmin ? 'admin' : undefined);

  if (!isApproved) return <Navigate to="/pending-approval" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;

  return children;
}
