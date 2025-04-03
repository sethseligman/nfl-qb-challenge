import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();

  // Only protect routes that require authentication
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 