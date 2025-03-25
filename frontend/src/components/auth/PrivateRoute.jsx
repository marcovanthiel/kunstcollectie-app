// PrivateRoute component voor beveiligde routes
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Toon niets tijdens het laden
  if (loading) {
    return null;
  }

  // Controleer of de gebruiker is ingelogd
  if (!isAuthenticated) {
    // Redirect naar login met de huidige locatie als 'from' state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Controleer of de gebruiker admin rechten heeft indien nodig
  if (adminOnly && !isAdmin) {
    // Redirect naar dashboard als de gebruiker geen admin is
    return <Navigate to="/dashboard" replace />;
  }

  // Render de beveiligde component
  return children;
};

export default PrivateRoute;
