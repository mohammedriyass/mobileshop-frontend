import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

import HomePage from "./pages/customer/HomePage";
import MobileDetailPage from "./pages/customer/MobileDetailPage";
import OrderPage from "./pages/customer/OrderPage";

import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import MobilesPage from "./pages/admin/MobilesPage";
import SellersPage from "./pages/admin/SellersPage";
import OrdersPage from "./pages/admin/OrdersPage";
import LedgerPage from "./pages/admin/LedgerPage";
import InvoicesPage from "./pages/admin/InvoicesPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#141414",
              color: "#C9A96E",
              border: "1px solid #222",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mobile/:id" element={<MobileDetailPage />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/admin/mobiles" element={
            <ProtectedRoute><MobilesPage /></ProtectedRoute>
          } />
          <Route path="/admin/sellers" element={
            <ProtectedRoute><SellersPage /></ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute><OrdersPage /></ProtectedRoute>
          } />
          <Route path="/admin/ledger" element={
            <ProtectedRoute><LedgerPage /></ProtectedRoute>
          } />
          <Route path="/admin/invoices" element={
            <ProtectedRoute><InvoicesPage /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;