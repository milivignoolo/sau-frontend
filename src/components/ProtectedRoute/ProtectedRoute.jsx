import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, rol }) => {
  const { isAuthenticated, loading, userRole } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si especificaron un rol para la ruta, verificarlo
  if (rol && userRole !== rol) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
