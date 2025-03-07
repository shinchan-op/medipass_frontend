import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import MedicalRecords from './pages/MedicalRecords';
import Appointments from './pages/Appointments';
import DataSharing from './pages/DataSharing';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// This is a placeholder component for routes that are not yet implemented
const UnderConstruction: React.FC<{ pageName: string }> = ({ pageName }) => (
  <div style={{ textAlign: 'center', padding: '50px 0' }}>
    <h2>{pageName} Page</h2>
    <p>This page is currently under construction.</p>
  </div>
);

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/records"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MedicalRecords />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/records/upload"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MedicalRecords />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Appointments />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Appointments />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sharing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DataSharing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UnderConstruction pageName="Profile" />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/emergency"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UnderConstruction pageName="Emergency Information" />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UnderConstruction pageName="Notifications" />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/qr-scanner"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UnderConstruction pageName="QR Scanner" />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
