import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Settings, 
  LogOut, 
  Menu as MenuIcon, 
  X, 
  ChefHat, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  ShoppingBag,
  BellRing,
  QrCode
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, logout, viewingAs, setViewingAs, activeRole } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return null;

  // Determine sidebar navigation links depending on role
  const getNavLinks = () => {
    if (!activeRole) return [];
    
    const common = [{ name: 'Overview', href: `/dashboard/${activeRole.toLowerCase()}`, icon: TrendingUp }];

    switch (activeRole) {
      case 'ADMIN':
        return [
          ...common,
          { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
          { name: 'Table Management', href: '/dashboard/admin/tables', icon: QrCode },
          { name: 'Menu Inventory', href: '/dashboard/admin/menu', icon: ChefHat },
          { name: 'Staff List', href: '/dashboard/manager/staff', icon: Users },
          { name: 'POS / Billing', href: '/dashboard/pos', icon: DollarSign },
          { name: 'Active Orders', href: '/dashboard/cashier/orders', icon: ShoppingBag },
          { name: 'All Orders', href: '/dashboard/cashier/all-orders', icon: FileText },
          { name: 'Sales Ledger', href: '/dashboard/cashier/ledger', icon: FileText },
          { name: 'Operational Logs', href: '/dashboard/manager/logs', icon: FileText },
          { name: 'System Settings', href: '/dashboard/admin/settings', icon: Settings },
        ];
      case 'MANAGER':
        return [
          ...common,
          { name: 'Menu Inventory', href: '/dashboard/manager/menu', icon: ChefHat },
          { name: 'Staff List', href: '/dashboard/manager/staff', icon: Users },
          { name: 'Operational Logs', href: '/dashboard/manager/logs', icon: FileText },
        ];
      case 'CASHIER':
        return [
          { name: 'POS / Billing', href: '/dashboard/pos', icon: DollarSign },
          { name: 'Active Orders', href: '/dashboard/cashier/orders', icon: ShoppingBag },
          { name: 'All Orders', href: '/dashboard/cashier/all-orders', icon: FileText },
          { name: 'Sales Ledger', href: '/dashboard/cashier/ledger', icon: FileText },
        ];
      default:
        return common;
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen flex bg-forest-950 text-foreground dashboard-view">
      {/* 1. SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-forest-900 border-r border-gold-300/10 shrink-0">
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center px-6 border-b border-gold-300/10 gap-2.5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
            <ChefHat className="h-4.5 w-4.5" />
          </div>
          <span className="font-playfair font-bold text-sm tracking-wider uppercase text-foreground">
            Forest<span className="text-primary">Hub</span>
          </span>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-forest-800/40'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gold-300/10 bg-forest-950/40">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-bold text-primary text-xs uppercase">
              {user.name.slice(0, 2)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold truncate">{user.name}</h4>
              <span className="text-[10px] text-primary font-mono tracking-wider block mt-0.5">
                {viewingAs ? `${viewingAs} (Simulated)` : user.role}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-forest-900 border-r border-gold-300/10 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gold-300/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
              <ChefHat className="h-4.5 w-4.5" />
            </div>
            <span className="font-playfair font-bold text-sm tracking-wider uppercase">
              Forest<span className="text-primary">Hub</span>
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-forest-800/40'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gold-300/10 bg-forest-950/40">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-bold text-primary text-xs">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="text-xs font-semibold">{user.name}</h4>
              <span className="text-[10px] text-primary font-mono tracking-wider">
                {viewingAs ? `${viewingAs} (Simulated)` : user.role}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* 3. CONTENT AREA CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* VIEW AS SIMULATION BANNER */}
        {viewingAs && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-amber-400 font-medium tracking-wide animate-fade-in shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>You are viewing the system as <span className="font-bold text-amber-300 uppercase">{viewingAs.toLowerCase()}</span></span>
            </div>
            <button
              onClick={() => {
                setViewingAs(null);
                window.location.href = '/dashboard/admin';
              }}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500 hover:text-black rounded-lg border border-amber-500/30 font-semibold uppercase tracking-wider text-[10px] transition-all duration-200"
            >
              Return to Admin
            </button>
          </div>
        )}

        {/* TOP NAVBAR */}
        <header className="h-16 flex items-center justify-between px-6 bg-forest-900/60 border-b border-gold-300/10 backdrop-blur-md shrink-0">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-forest-800/40 rounded-xl border border-gold-300/10 transition-colors"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          {/* Quick Info / Search Bar area */}
          <div className="hidden sm:flex items-center text-xs text-muted-foreground">
            Welcome back to the Sanctuary Management Panel.
          </div>

          {/* Topbar Right Utilities */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications */}
            <button className="p-2 text-muted-foreground hover:text-foreground relative rounded-full hover:bg-forest-800/40 transition-all border border-transparent hover:border-gold-300/10">
              <BellRing className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-forest-900"></span>
            </button>

            {/* Profile Menu Indicator */}
            <div className="flex items-center gap-2.5 border-l border-gold-300/10 pl-4">
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold">{user.name}</p>
                <span className="text-[10px] text-muted-foreground capitalize font-medium">
                  {viewingAs ? `${viewingAs.toLowerCase()} (simulated)` : user.role.toLowerCase()}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gold-300/10 border border-gold-300/20 flex items-center justify-center font-bold text-primary text-xs">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* CENTRAL CONTENT VIEW */}
        <main className="flex-grow p-6 overflow-y-auto bg-forest-950/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
