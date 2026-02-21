

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import MedicalDashboard from "./pages/MedicalDashboard"; // 🆕 Phase 5
import "./App.css";
import LandingPage from "./pages/LandingPage";

// ─── Protected Route Component ───
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner"></div>
        <p className="app-loading-text">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    const redirectPath =
      user?.role === "medical" ? "/medical/dashboard" : "/donor/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// ─── Public Route ───
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner"></div>
        <p className="app-loading-text">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    const redirectPath =
      user.role === "medical" ? "/medical/dashboard" : "/donor/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// ─── Main App ───
function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner"></div>
        <p className="app-loading-text">🩸 LifeLink Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected: Donor */}
      <Route
        path="/donor/dashboard"
        element={
          <ProtectedRoute allowedRole="donor">
            <DonorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected: Medical — Phase 5 🆕 */}
      <Route
        path="/medical/dashboard"
        element={
          <ProtectedRoute allowedRole="medical">
            <MedicalDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;