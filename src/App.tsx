import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ServicePage from './pages/service/ServicePage';
import ServiceDashboard from './pages/service/ServiceDashboard';
import OrganizationsPage from './pages/service/OrganizationsPage';
import OrganizationDetailPage from './pages/service/OrganizationDetailPage';
import LicensesPage from './pages/service/LicensesPage';
import CustomerPage from './pages/customer/CustomerPage';
import CustomerUsersPage from './pages/customer/UsersPage';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
import SetPasswordPage from './pages/SetPasswordPage';

// Protected route component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}> = ({ children, requiredRole }) => {
  const { authState } = useAuth();
  
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && authState.user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

// Route selector based on organization type
const OrgTypeRoute: React.FC = () => {
  const { authState } = useAuth();
  
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (authState.organization?.type === 'service_provider') {
    return <Navigate to="/service/dashboard" />;
  } else {
    return <Navigate to="/customer/dashboard" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/set-password/:token" element={<SetPasswordPage />} />
          
          {/* Set root path to login page */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Optional: Keep dashboard route for OrgTypeRoute */}
          <Route path="/dashboard" element={<OrgTypeRoute />} />
          
          {/* Service Provider routes */}
          <Route 
            path="/service" 
            element={
              <ProtectedRoute>
                <ServicePage />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ServiceDashboard />} />
            <Route path="organizations" element={<OrganizationsPage />} />
            <Route path="organizations/:id" element={<OrganizationDetailPage />} />
            <Route path="licenses" element={<LicensesPage />} />
          </Route>
          
          {/* Customer Organization routes */}
          <Route 
            path="/customer" 
            element={
              <ProtectedRoute>
                <CustomerPage />
              </ProtectedRoute>
            }
          >
            <Route path="settings" element={<SettingsPage />} />
            <Route path="licenses" element={<LicensesPage />} />
            <Route path="organizations" element={<OrganizationsPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<CustomerUsersPage />} />

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;