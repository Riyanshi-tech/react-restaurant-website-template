import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Context & Route Protection
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, RoleRoute } from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import ReservationPage from "./pages/ReservationPage";
import NotFound from "./pages/NotFound";
import NotAuthorized from "./pages/NotAuthorized";
import LoginPage from "./pages/LoginPage";

// Protected Dashboard Pages
import AdminHome from "./pages/dashboard/AdminHome";
import ManagerHome from "./pages/dashboard/ManagerHome";
import CashierHome from "./pages/dashboard/CashierHome";
import UserManagement from "./pages/dashboard/UserManagement";
import OperationalLogs from "./pages/dashboard/OperationalLogs";
import TableManagement from "./pages/dashboard/TableManagement";
import CustomerOrdering from "./pages/CustomerOrdering";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" theme="dark" closeButton richColors />
          <BrowserRouter>
            <Routes>
              {/* 1. PUBLIC ROUTES */}
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/orders/:slug" element={<CustomerOrdering />} />
              
              {/* Login Gateway / Dashboard Redirection Gateway */}
              <Route path="/dashboard" element={<LoginPage />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />

              {/* 2. PROTECTED ROUTE LAYOUTS */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  {/* ADMIN ONLY ROUTES */}
                  <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                    <Route path="/dashboard/admin" element={<AdminHome />} />
                    <Route path="/dashboard/admin/users" element={<UserManagement />} />
                    <Route path="/dashboard/admin/tables" element={<TableManagement />} />
                    <Route path="/dashboard/admin/menu" element={<div className="p-4 bg-forest-900/40 rounded-2xl border border-gold-300/10">Menu Inventory Editor (Phase 3)</div>} />
                    <Route path="/dashboard/admin/bookings" element={<div className="p-4 bg-forest-900/40 rounded-2xl border border-gold-300/10">Reservations Master Ledger (Phase 3)</div>} />
                    <Route path="/dashboard/admin/settings" element={<div className="p-4 bg-forest-900/40 rounded-2xl border border-gold-300/10">System Settings Management (Phase 3)</div>} />
                  </Route>

                  {/* MANAGER ONLY ROUTES */}
                  <Route element={<RoleRoute allowedRoles={["MANAGER", "ADMIN"]} />}>
                    <Route path="/dashboard/manager" element={<ManagerHome />} />
                    <Route path="/dashboard/manager/menu" element={<div className="p-4 bg-forest-900/40 rounded-2xl border border-gold-300/10">Operations Menu Viewer (Phase 4)</div>} />
                    <Route path="/dashboard/manager/bookings" element={<div className="p-4 bg-forest-900/40 rounded-2xl border border-gold-300/10">Reservations Approvals (Phase 4)</div>} />
                    <Route path="/dashboard/manager/staff" element={<div className="p-4 bg-forest-900/40 rounded-2xl border border-gold-300/10">Staff Shifts List (Phase 4)</div>} />
                    <Route path="/dashboard/manager/logs" element={<OperationalLogs />} />
                  </Route>

                  {/* CASHIER ONLY ROUTES */}
                  <Route element={<RoleRoute allowedRoles={["CASHIER", "ADMIN"]} />}>
                    <Route path="/dashboard/cashier" element={<CashierHome />} />
                    <Route path="/dashboard/pos" element={<CashierHome />} />
                    <Route path="/dashboard/cashier/orders" element={<div className="p-4 bg-forest-900/40 rounded-2xl border border-gold-300/10">POS Order Ticket Queue (Phase 5)</div>} />
                    <Route path="/dashboard/cashier/ledger" element={<div className="p-4 bg-forest-900/40 rounded-2xl border border-gold-300/10">Sales Ledger & Cash Audit (Phase 5)</div>} />
                  </Route>
                </Route>
              </Route>

              {/* 3. CATCH-ALL ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
