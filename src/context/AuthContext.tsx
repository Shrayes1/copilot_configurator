import React, { createContext, useContext, useState, useEffect } from 'react';

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


const getInitialAuthState = (): AuthState => {
  try {
    const storedAuth = localStorage.getItem('authState');
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      if (parsedAuth && typeof parsedAuth.isAuthenticated === 'boolean' && (!parsedAuth.user || typeof parsedAuth.user === 'object')) {
        return parsedAuth;
      }
    }
  } catch (error) {
    console.error('Failed to parse authState from localStorage:', error);
    localStorage.removeItem('authState');
  }
  return {
    isAuthenticated: false,
    user: null,
    organization: undefined,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState);


  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem('authState', JSON.stringify(authState));
    } else {
      localStorage.removeItem('authState');
    }
  }, [authState]);

  const login = async (credentials: { email: string; password: string; token?: string; role?: string; organization?: Organization; id?: string }) => {
    let user: AuthState['user'] = null;
    let organization = credentials.organization;

    try {
      if (!credentials.token) {
        console.log('No token provided, falling back to /signin');
        const authResponse = await fetch('https://19a7-14-143-149-238.ngrok-free.app/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({
            username: credentials.email,
            password: credentials.password,
          }),
        });

        if (!authResponse.ok) {
          const errorData: { message?: string } = await authResponse.json();
          throw new Error(errorData.message || 'Invalid email or password');
        }

        const authData: { msg: string } = await authResponse.json();
        if (authData.msg !== 'User authenticated successfully') {
          throw new Error('Unexpected response from server');
        }
      }

      user = {
        id: credentials.id || '',
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
    localStorage.removeItem('authState');
  };

  const setPassword = async (email: string, token: string, password: string) => {
    console.log('Setting password with token:', token, 'for email:', email);

    const setPasswordResponse = await fetch('https://19a7-14-143-149-238.ngrok-free.app/set_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({
        token: token,
        pw: password,
      }),
    });

    if (!setPasswordResponse.ok) {
      const errorData: { message?: string } = await setPasswordResponse.json();
      throw new Error(errorData.message || 'Failed to set password');
    }

    const setPasswordData: { msg: string } = await setPasswordResponse.json();
    if (setPasswordData.msg !== 'Password set successfully') {
      throw new Error('Unexpected response from server');
    }

    console.log('Updating last active for user:', email);
    try {
      const response = await fetch(`https://19a7-14-143-149-238.ngrok-free.app/user/${encodeURIComponent(email)}/update-last-active`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          lastActive: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData: { message?: string } = await response.json();
        throw new Error(errorData.message || 'Failed to update last active');
      }
    } catch (err) {
      console.error('Error updating last active:', err);
      throw err;
    }
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