import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const SetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  const BASE_URL = 'https://long-tables-show.loca.lt';

  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setHasNumber(/\d/.test(password));
    setHasSpecialChar(/[@$!%*?&]/.test(password));
  }, [password]);

  useEffect(() => {
    if (success) {
      const timeoutId = setTimeout(() => {
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [success, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!token) {
      setError('No token provided in the URL');
      console.error('Token missing in URL');
      setIsLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    if (!passwordRegex.test(password)) {
      setError('Password must meet strength requirements');
      setIsLoading(false);
      return;
    }

    const requestBody = {
      pw: password, // Fixed field name to match backend expectation
      token: token,
    };

    try {
      console.log('Sending POST request to:', `${BASE_URL}/set_password`);
      console.log('Payload:', JSON.stringify(requestBody));

      const response = await fetch(`${BASE_URL}/set_password`, {
        method: 'POST',
        headers: {
          'bypass-tunnel-reminder': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('set_password status:', response.status);
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error('Server did not return JSON. Check the endpoint or server logs.');
      }

      const data = await response.json();
      console.log('set_password response:', data);

      if (!response.ok) {
        if (response.status === 400 && data.message.includes('token')) {
          throw new Error('Invalid or expired token. Please request a new password reset link.');
        }
        throw new Error(data.message || 'Failed to set password');
      }

      if (!['Password set successfully', 'Password updated'].includes(data.msg)) {
        throw new Error(data.msg || 'Unexpected response from server');
      }

      console.log('Password set successfully, setting success state');
      setSuccess(true);
    } catch (err) {
      let errorMessage = 'An unexpected error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error('Error in POST request:', err.message);
        if (err.message.includes('Token')) {
          errorMessage = 'Invalid or expired token. Please request a new password reset link.';
        }
      } else {
        console.error('Unexpected error in POST request:', err);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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

              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Password Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li className={hasMinLength ? 'text-green-600' : 'text-red-600'}>
                    Min 8 characters
                  </li>
                  <li className={hasUppercase ? 'text-green-600' : 'text-red-600'}>
                    Uppercase letter
                  </li>
                  <li className={hasLowercase ? 'text-green-600' : 'text-red-600'}>
                    Lowercase letter
                  </li>
                  <li className={hasNumber ? 'text-green-600' : 'text-red-600'}>
                    Number
                  </li>
                  <li className={hasSpecialChar ? 'text-green-600' : 'text-red-600'}>
                    Special character (@$!%*?&)
                  </li>
                </ul>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? 'Setting Password...' : 'Set Password'}
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