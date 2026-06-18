import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute() {
  const { session } = useApp();

  // If no session exists, redirect to login page
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes (e.g., AdminLayout)
  return <Outlet />;
}
