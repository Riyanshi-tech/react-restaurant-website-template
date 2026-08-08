import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // 1. Render premium loading state matching the luxury dark green theme
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-forest-950 text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            {/* Pulsing circular luxury spinner */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary animate-spin"></div>
          </div>
          <span className="font-playfair text-gold-300 text-sm tracking-widest uppercase animate-pulse">
            Verifying Credentials
          </span>
        </div>
      </div>
    );
  }

  // 2. Redirect to Login Gateway if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Redirect to Not Authorized if role does not match
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // 4. Render outlet containing sub-routes
  return <Outlet />;
};

export default ProtectedRoute;
