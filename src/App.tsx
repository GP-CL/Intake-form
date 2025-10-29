import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import PatientIntakeForm from "./components/PatientIntakeForm";
import LoginPopup from "./components/Login_popup";
import PGxIntakeForm from "./components/intake_form_pgx";
import Dashboard from "./components/home";
import AIGPGxIntakeForm from "./components/intake_form_pgx_aig";
import PatientIntakeFormAIG from "./components/intake_form_total_aig";
import Dashboard_Guest from "./components/guest_intake_forms";

const ProtectedRoute: React.FC<{ children: React.ReactNode; isAuthenticated: boolean }> = ({ 
  children, 
  isAuthenticated 
}) => {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<boolean>(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPopup setAuth={setAuth} />} />
        <Route
          path="/"
          element={
        <ProtectedRoute isAuthenticated={auth}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <Dashboard />
          </div>
        </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard_guest"
          element={
        <ProtectedRoute isAuthenticated={auth}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <Dashboard_Guest />
          </div>
        </ProtectedRoute>
          }
        />
        <Route
          path="/total_intake"
          element={
        <ProtectedRoute isAuthenticated={auth}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <PatientIntakeForm />
          </div>
        </ProtectedRoute>
          }
        />
         <Route
          path="/total_intake_aig"
          element={
        <ProtectedRoute isAuthenticated={auth}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <PatientIntakeFormAIG />
          </div>
        </ProtectedRoute>
          }
        />
        <Route
          path="/aig_pgx_intake"
          element={
        <ProtectedRoute isAuthenticated={auth}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <AIGPGxIntakeForm />
          </div>
        </ProtectedRoute>
          }
        />
        <Route
          path="/pgx_intake"
          element={
        <ProtectedRoute isAuthenticated={auth}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <PGxIntakeForm />
          </div>
        </ProtectedRoute>
          }
        />
        <Route 
          path="*" 
          element={<Navigate to={auth ? "/" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
};
export default App;
