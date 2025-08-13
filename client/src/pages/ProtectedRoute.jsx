import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// This component checks if a user is authenticated
// If they are, it renders the child components (Outlet)
// Otherwise, it redirects them to the login page

const ProtectedRoute = () => {
  // Check for the token in localStorage
  const token = localStorage.getItem('token');

  // If a token exists, the user is considered authenticated
  // The <Outlet /> component will render the nested route's element
  // For example, <ProtectedRoute><Dashboard /></ProtectedRoute> would render <Dashboard />
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
