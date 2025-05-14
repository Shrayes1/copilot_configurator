import React, { useState, useEffect } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const SetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setHasNumber(/\d/.test(password));
    setHasSpecialChar(/[@$!%*?&]/.test(password));
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must meet strength requirements');
      return;
    }

    // Success – you can do something else here later
    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {success ? 'Password Set Successfully' : 'Set Your Password'}
          </h2>

          {success ? (
            <p className="text-green-600">Password saved (frontend-only demo).</p>
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
                <Button type="submit" variant="primary">
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
