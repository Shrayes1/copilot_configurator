import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  BarChart3, 
  KeyRound, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-900 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <span className="mr-3 text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const ServiceSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { authState, logout } = useAuth();
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-20 m-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:static lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Close button (mobile only) */}
          <div className="lg:hidden absolute right-2 top-2">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              <X size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white">
                <KeyRound size={20} />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">Copilot Services</h1>
                <p className="text-xs text-gray-500">
                  Service Provider
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <NavItem
              to="/service/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              isActive={location.pathname === '/service/dashboard'}
              onClick={closeSidebar}
            />
            
            <NavItem
              to="/service/organizations"
              icon={<Building2 size={18} />}
              label="Client Organizations"
              isActive={location.pathname === '/service/organizations' || location.pathname.startsWith('/service/organizations/')}
              onClick={closeSidebar}
            />
            
            <NavItem
              to="/service/licenses"
              icon={<KeyRound size={18} />}
              label="Licenses"
              isActive={location.pathname === '/service/licenses'}
              onClick={closeSidebar}
            />
            
            <NavItem
              to="/service/analytics"
              icon={<BarChart3 size={18} />}
              label="Analytics"
              isActive={location.pathname === '/service/analytics'}
              onClick={closeSidebar}
            />

          
            
            
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              {authState.user?.avatar ? (
                <img
                  src={authState.user.avatar}
                  alt={authState.user.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-800 font-medium">
                    {authState.user?.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()}
                  </span>
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {authState.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {authState.user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                logout();
                closeSidebar();
              }}
              className="mt-3 w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ServiceSidebar;