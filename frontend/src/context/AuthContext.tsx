import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User, LoginCredentials, UserRole } from '../types';

const DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: [
    'menu.read', 'menu.write',
    'booking.read', 'booking.write',
    'staff.read', 'staff.write',
    'logs.read',
    'pos.read', 'pos.write',
    'order.read', 'order.write',
    'sales.read',
    'users.read', 'users.write',
    'settings.read', 'settings.write'
  ],
  MANAGER: [
    'menu.read', 'menu.write',
    'booking.read', 'booking.write',
    'staff.read',
    'logs.read'
  ],
  CASHIER: [
    'pos.read', 'pos.write',
    'order.read', 'order.write',
    'sales.read'
  ]
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  viewingAs: UserRole | null;
  setViewingAs: (role: UserRole | null) => void;
  activeRole: UserRole | null;
  hasPermission: (permission: string) => boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewingAs, setViewingAsState] = useState<UserRole | null>(() => {
    return (localStorage.getItem('viewingAs') as UserRole) || null;
  });

  const setViewingAs = (role: UserRole | null) => {
    setViewingAsState(role);
    if (role) {
      localStorage.setItem('viewingAs', role);
    } else {
      localStorage.removeItem('viewingAs');
    }
  };

  const activeRole = user ? (viewingAs || user.role) : null;

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admin always passes all checks unless simulating a restricted role
    const checkingRole = viewingAs || user.role;
    if (checkingRole === 'ADMIN') return true;

    if (viewingAs) {
      return DEFAULT_PERMISSIONS[viewingAs]?.includes(permission) || false;
    }

    return user.permissions?.includes(permission) || false;
  };

  // Perform initial session check on mount
  const checkSession = async () => {
    try {
      setLoading(true);
      const response = await authService.getMe();
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
        setViewingAs(null);
      }
    } catch (error) {
      setUser(null);
      setViewingAs(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await authService.login(credentials);
      const loggedUser = response.data.user;
      setUser(loggedUser);
      setViewingAs(null); // Reset simulation context on new login
      return loggedUser;
    } catch (error) {
      setUser(null);
      setViewingAs(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
      setViewingAs(null);
      // Wait for local state reset, then redirect
      window.location.href = '/dashboard';
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    viewingAs,
    setViewingAs,
    activeRole,
    hasPermission,
    login,
    logout,
    checkSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
