import React, { createContext, useContext, useState } from 'react';

export interface Organization {
  id: string;
  name: string;
  type?: 'service_provider' | 'customer';
  serviceProviderId: string;
  plan: 'basic' | 'professional' | 'growth';
  licenses: {
    total: number;
    used: number;
    modules: {
      [key: string]: {
        total: number;
        used: number;
      };
    };
  };
  adminContact: {
    name: string;
    email: string;
    phone: string;
  };
  settings: {
    autoRecordMeetings: boolean;
    emailTemplates: boolean;
    agendaTemplates: boolean;
  };
  logoUrl?: string;
  createdAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; email: string; name: string; organizationId: string; role: string } | null;
  organization: Organization | undefined;
}

interface AuthContextType {
  authState: AuthState;
  login: (credentials: { email: string; password: string; token?: string; role?: string; organization?: Organization; id?: string }) => Promise<void>;
  logout: () => void;
  setPassword: (email: string, token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    organization: undefined,
  });

  const login = async (credentials: { email: string; password: string; token?: string; role?: string; organization?: Organization; id?: string }) => {
    let user = null;
    let organization = credentials.organization;

    try {
      if (!credentials.token) {
        console.log('No token provided, falling back to /signin');
        const authResponse = await fetch('https://6291-14-143-149-238.ngrok-free.app/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            username: credentials.email,
            password: credentials.password,
          }),
        });

        if (!authResponse.ok) {
          const errorData = await authResponse.json();
          throw new Error(errorData.message || 'Invalid email or password');
        }

        const authData = await authResponse.json();
        if (authData.msg !== 'User authenticated successfully') {
          throw new Error('Unexpected response from server');
        }
      }

      // Set user data with role and id from credentials
      user = {
        id: credentials.id || '', // Use provided id or fallback to empty string
        email: credentials.email,
        name: '',
        organizationId: credentials.organization?.id || '',
        role: credentials.role || '',
      };

      console.log('Setting auth state with:', {
        isAuthenticated: true,
        user,
        organization,
      });
      setAuthState({
        isAuthenticated: true,
        user,
        organization,
      });
    } catch (err) {
      console.error('Error in login function:', err);
      throw err;
    }
  };

  const logout = () => {
    console.log('Logging out, resetting auth state');
    setAuthState({
      isAuthenticated: false,
      user: null,
      organization: undefined,
    });
  };

  const setPassword = async (email: string, token: string, password: string) => {
    console.log('Setting password with token:', token, 'for email:', email);

    const setPasswordResponse = await fetch('https://6291-14-143-149-238.ngrok-free.app/set-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        pw: password,
      }),
    });

    if (!setPasswordResponse.ok) {
      const errorData = await setPasswordResponse.json();
      throw new Error(errorData.message || 'Failed to set password');
    }

    const setPasswordData = await setPasswordResponse.json();
    if (setPasswordData.msg !== 'Password set successfully') {
      throw new Error('Unexpected response from server');
    }

    console.log('Updating last active for user:', email);
    await fetch(`https://6291-14-143-149-238.ngrok-free.app/user/${encodeURIComponent(email)}/update-last-active`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        lastActive: new Date().toISOString(),
      }),
    });
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