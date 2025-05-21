import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState<{ to: string; state?: any } | null>(null);
  const { authState, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://19a7-14-143-149-238.ngrok-free.app/signin', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          //'ngrok-skip-browser-warning': 'true', 
        },
        body: JSON.stringify({
          email: email,
          pw: password,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error('Server returned an unexpected response. Please try again or contact support.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid email or password');
      }

      const data = await response.json();
      console.log('Signin response:', data);

      if (data.msg !== 'Login successful') {
        throw new Error('Unauthorized response from server: ' + JSON.stringify(data));
      }

      
      const roleMapping: { [key: string]: string } = {
        adm: 'cognicor_admin', 
        org_admin: 'org_admin',
      };

      const mappedRole = roleMapping[data.role];
      const validRoles = ['cognicor_admin', 'org_admin'];
      if (!mappedRole || !validRoles.includes(mappedRole)) {
        console.error('Invalid or missing role in response:', data.role);
        throw new Error('Invalid user role. Please contact support.');
      }

      try {
        await login({
          email: email,
          password: password,
          token: data.token || undefined,
          role: mappedRole, 
          organization: data.organization || undefined,
          id: data.id || '',
        });
        console.log('Login function completed successfully');

        if (mappedRole === 'cognicor_admin') {
          setRedirect({ to: '/service/dashboard' });
        } else if (mappedRole === 'org_admin') {
          // if (!data.organization) {
          //   throw new Error('Organization data required for org_admin role');
          // }
          setRedirect({
            to: '/customer/dashboard',
            state: { organization: data.organization },
          });
        }
      } catch (loginErr) {
        console.error('Login function error:', loginErr);
        throw new Error('Failed to update auth state: ' + (loginErr instanceof Error ? loginErr.message : 'Unknown error'));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
     
      const friendlyError = errorMessage.includes('Invalid email or password')
        ? 'Incorrect email or password. Please try again.'
        : errorMessage.includes('Invalid user role')
        ? 'Your account role is not supported. Please contact support.'
        : errorMessage;
      setError(friendlyError);
      console.error('Login error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Current authState:', authState);
  }, [authState]);

  if (redirect) {
    console.log('Redirecting to:', redirect.to);
    return <Navigate to={redirect.to} state={redirect.state} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-lg font-medium">Signing in...</p>
          </div>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <KeyRound className="w-8 h-8 text-white" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          CoPilot Configurator
        </h1>
        <h4 className="mt-6 text-center text-1xl font-extrabold text-gray-900">
          Sign in to your account
        </h4>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;