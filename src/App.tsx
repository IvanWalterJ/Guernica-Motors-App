/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import PublicLayout from "./components/public/PublicLayout";
import Home from "./components/public/Home";
import VehicleList from "./components/public/VehicleList";
import VehicleDetail from "./components/public/VehicleDetail";
import VehicleSourcing from "./components/public/VehicleSourcing";
import Financing from "./components/public/Financing";
import Contact from "./components/public/Contact";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./components/admin/AdminLogin";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Dashboard from "./components/admin/Dashboard";
import Inventory from "./components/admin/Inventory";
import Leads from "./components/admin/Leads";
import AdminRequests from "./components/admin/AdminRequests";
import Appointments from "./components/admin/Appointments";
import Finances from "./components/admin/Finances";
import Settings from "./components/admin/Settings";

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="vehiculos" element={<VehicleList />} />
                <Route path="vehiculos/:id" element={<VehicleDetail />} />
                <Route path="pedidos" element={<VehicleSourcing />} />
                <Route path="financiacion" element={<Financing />} />
                <Route path="contacto" element={<Contact />} />
              </Route>

              {/* Admin Login (public) */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Routes (protected) */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="inventario" element={<Inventory />} />
                  <Route path="leads" element={<Leads />} />
                  <Route path="pedidos" element={<AdminRequests />} />
                  <Route path="citas" element={<Appointments />} />
                  <Route path="finanzas" element={<Finances />} />
                  <Route path="configuracion" element={<Settings />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
