import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const SetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { setPassword, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Simulate API call to validate token
        // Uncomment and configure when backend is available
        /*
        const response = await fetch(`/api/validate-token/${token}`);
        if (!response.ok) {
          throw new Error('Invalid or expired token');
        }
        */
        // Simulate successful token validation for UI testing
        setIsValidating(false);
      } catch (err) {
        // Use type guard to handle error type
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        setIsValidating(false);
      }
    };
    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      // Simulate password setting
      // Uncomment and configure when backend is available
      /*
      await setPassword(token!, password);
      */
      console.log('Simulated password set for token:', token);

      // Log in the user after setting password
      await login({ username: email, password });

      setSuccess(true);
setTimeout(() => {
  navigate('/login');
}, 3000);
    } catch (err) {
      // Use type guard to handle error type
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  if (isValidating) {
    return <div>Loading...</div>;
  }

  if (error && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
            <p className="text-red-600">{error}</p>
            <div className="mt-6">
              <Button variant="primary" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {success ? 'Password Set Successfully' : 'Set Your Password'}
          </h2>
          {success ? (
            <div>
              <p className="text-green-600">
                Your password has been set. You will be redirected to the login page shortly.
              </p>
              <div className="mt-6">
                <Button variant="primary" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                name="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                id="password"
                name="password"
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex justify-end">
                <Button variant="primary" type="submit">
                  Set Password
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPasswordPage;
