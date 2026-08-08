import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const PremiumSpinner: React.FC = () => (
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

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated, activeRole } = useAuth();

  if (loading) {
    return <PremiumSpinner />;
  }

  // Redirect to Login Gateway if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect to Not Authorized if role does not match (using simulated activeRole)
  const roleToCheck = activeRole || user?.role;
  if (allowedRoles && roleToCheck && !allowedRoles.includes(roleToCheck)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Render outlet containing sub-routes
  return <Outlet />;
};

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated, activeRole } = useAuth();

  if (loading) {
    return <PremiumSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const roleToCheck = activeRole || user?.role;
  if (roleToCheck && !allowedRoles.includes(roleToCheck)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

interface PermissionRouteProps {
  permission: string;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({ permission }) => {
  const { loading, isAuthenticated, hasPermission } = useAuth();

  if (loading) {
    return <PremiumSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
