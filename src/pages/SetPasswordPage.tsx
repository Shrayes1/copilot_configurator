import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const SetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  // Password strength states
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  // Replace with your current ngrok URL
  const BASE_URL = 'https://5066-14-143-149-238.ngrok-free.app';

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        if (!token) {
          throw new Error('No token provided');
        }

        const response = await fetch(`${BASE_URL}/validate-token/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Invalid or expired token');
        }

        const { email } = await response.json(); // Assume API returns associated email
        setEmail(email);
        setIsValidating(false);
      } catch (err) {
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

  // Real-time password strength validation
  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setHasNumber(/\d/.test(password));
    setHasSpecialChar(/[@$!%*?&]/.test(password));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
      return;
    }

    try {
      // Call the API to set the password
      const response = await fetch(`${BASE_URL}/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          pw: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to set password');
      }

      const data = await response.json();
      if (data.msg !== 'Password set successfully') {
        throw new Error('Unexpected response from server');
      }

      // Log in the user after setting password
      if (email) {
        await login({ email: email, password });
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Fallback: Redirect to login page without auto-login
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
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
                Your password has been set. Redirecting to login page...
              </p>
              <div className="mt-6">
                <Button variant="primary" onClick={() => navigate('/login')}>
                  Go to Login
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="password"
                name="password"
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {/* Password Strength Feedback */}
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Password Requirements:</p>
                <ul className="list-disc list-inside">
                  <li className={hasMinLength ? 'text-green-600' : 'text-red-600'}>
                    At least 8 characters {hasMinLength ? '✓' : '✗'}
                  </li>
                  <li className={hasUppercase ? 'text-green-600' : 'text-red-600'}>
                    At least one uppercase letter {hasUppercase ? '✓' : '✗'}
                  </li>
                  <li className={hasLowercase ? 'text-green-600' : 'text-red-600'}>
                    At least one lowercase letter {hasLowercase ? '✓' : '✗'}
                  </li>
                  <li className={hasNumber ? 'text-green-600' : 'text-red-600'}>
                    At least one number {hasNumber ? '✓' : '✗'}
                  </li>
                  <li className={hasSpecialChar ? 'text-green-600' : 'text-red-600'}>
                    At least one special character (@$!%*?&) {hasSpecialChar ? '✓' : '✗'}
                  </li>
                </ul>
              </div>
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