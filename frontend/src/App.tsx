import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, RequireRole } from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import ReservationPage from "./pages/ReservationPage";
import NotFound from "./pages/NotFound";
import NotAuthorized from "./pages/NotAuthorized";
import LoginPage from "./pages/LoginPage";

import AdminHome from "./pages/dashboard/AdminHome";
import ManagerHome from "./pages/dashboard/ManagerHome";
import CashierHome from "./pages/dashboard/CashierHome";
import UserManagement from "./pages/dashboard/UserManagement";
import OperationalLogs from "./pages/dashboard/OperationalLogs";
import TableManagement from "./pages/dashboard/TableManagement";
import MenuManagement from "./pages/dashboard/MenuManagement";
import ActiveOrders from "./pages/dashboard/ActiveOrders";
import AllOrders from "./pages/dashboard/AllOrders";
import SalesLedger from "./pages/dashboard/SalesLedger";
import StaffList from "./pages/dashboard/StaffList";
import SystemSettings from "./pages/dashboard/SystemSettings";
import CustomerOrdering from "./pages/CustomerOrdering";
import BillDetails from "./pages/BillDetails";

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
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/orders/:slug" element={<CustomerOrdering />} />
              <Route path="/billdetails/:slug" element={<BillDetails />} />

              <Route path="/dashboard" element={<LoginPage />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard/admin" element={<RequireRole allowedRoles={["ADMIN"]}><AdminHome /></RequireRole>} />
                  <Route path="/dashboard/admin/users" element={<RequireRole allowedRoles={["ADMIN"]}><UserManagement /></RequireRole>} />
                  <Route path="/dashboard/admin/tables" element={<RequireRole allowedRoles={["ADMIN"]}><TableManagement /></RequireRole>} />
                  <Route path="/dashboard/admin/menu" element={<RequireRole allowedRoles={["ADMIN"]}><MenuManagement /></RequireRole>} />
                  <Route path="/dashboard/admin/settings" element={<RequireRole allowedRoles={["ADMIN"]}><SystemSettings /></RequireRole>} />

                  <Route path="/dashboard/manager" element={<RequireRole allowedRoles={["MANAGER", "ADMIN"]}><ManagerHome /></RequireRole>} />
                  <Route path="/dashboard/manager/menu" element={<RequireRole allowedRoles={["MANAGER", "ADMIN"]}><MenuManagement /></RequireRole>} />
                  <Route path="/dashboard/manager/staff" element={<RequireRole allowedRoles={["MANAGER", "ADMIN"]}><StaffList /></RequireRole>} />
                  <Route path="/dashboard/manager/logs" element={<RequireRole allowedRoles={["MANAGER", "ADMIN"]}><OperationalLogs /></RequireRole>} />

                  <Route path="/dashboard/cashier" element={<RequireRole allowedRoles={["CASHIER", "ADMIN"]}><CashierHome /></RequireRole>} />
                  <Route path="/dashboard/pos" element={<RequireRole allowedRoles={["CASHIER", "ADMIN"]}><CashierHome /></RequireRole>} />
                  <Route path="/dashboard/cashier/orders" element={<RequireRole allowedRoles={["CASHIER", "ADMIN"]}><ActiveOrders /></RequireRole>} />
                  <Route path="/dashboard/cashier/all-orders" element={<RequireRole allowedRoles={["CASHIER", "ADMIN"]}><AllOrders /></RequireRole>} />
                  <Route path="/dashboard/cashier/ledger" element={<RequireRole allowedRoles={["CASHIER", "ADMIN"]}><SalesLedger /></RequireRole>} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
