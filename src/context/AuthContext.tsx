import React, { createContext, useContext, useState } from 'react';
import { mockUsers, mockOrganizations } from '../data/mockData';
import { User, Organization } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  organization: Organization | undefined;
}

interface AuthContextType {
  authState: AuthState;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  setPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulate password storage (replace with backend in production)
const simulatedPasswords: { [email: string]: string } = {
  'john@copilotservices.com': 'password', // Default for demo
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    organization: undefined,
  });

  const login = async (credentials: { username: string; password: string }) => {
    const user = mockUsers.find((u) => u.email === credentials.username);
    if (!user) {
      throw new Error('Email not found');
    }

    // Simulate password check (replace with backend validation)
    const storedPassword = simulatedPasswords[credentials.username] || 'password';
    if (credentials.password !== storedPassword) {
      throw new Error('Incorrect password');
    }

    const organization = mockOrganizations.find((org) => org.id === user.organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }

    setAuthState({
      isAuthenticated: true,
      user,
      organization,
    });
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      organization: undefined,
    });
  };

  const setPassword = async (token: string, password: string) => {
    // Simulate token validation (replace with /api/validate-token/:token)
    const user = mockUsers.find((u) => u.email === 'jane@testorg.com'); // Hardcoded for demo
    if (!user) {
      throw new Error('Invalid or expired token');
    }

    // Simulate password update
    simulatedPasswords[user.email] = password;
    user.lastActive = new Date().toISOString();
    console.log('Simulated password set for user:', user.email);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, setPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
