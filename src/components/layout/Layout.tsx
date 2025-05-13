import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const Layout: React.FC = () => {
  const { authState } = useAuth();

  // If not authenticated, redirect to login
  if (!authState.isLoading && !authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      {/* Reduced padding from p-6/lg:p-8 to p-4/lg:p-6 and removed top padding */}
      <main className="flex-1 overflow-y-auto">

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
