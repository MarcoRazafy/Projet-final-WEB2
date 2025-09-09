import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Shell from "./components/Shell";

// Pages protégées
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Expenses from "./pages/Expenses";

// Pages publiques
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App(){
  return (
    <AuthProvider>
      <Routes>
        {/* Public (sans Shell/Navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protégé (avec Shell/Navbar) */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Shell>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Shell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
