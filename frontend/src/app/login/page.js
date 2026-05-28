'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { User, Lock, Activity, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, error: authError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!email) {
      setValidationError('Please enter your email address.');
      return;
    }
    
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email format.');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setValidationError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-12 px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold text-3xl">
          <Activity className="h-8 w-8" />
          HAQMS
        </Link>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-base text-gray-600">
          Or use one of the pre-seeded credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {(validationError || authError) && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded">
                {validationError || authError}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="admin@haqms.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-500 mb-3">Seeded Demo Credentials</h4>
            <div className="flex flex-col gap-2 text-sm">
              <button
                type="button"
                onClick={() => { setEmail('admin@haqms.com'); setPassword('password123'); }}
                className="text-left p-2 rounded bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-700"
              >
                <strong>Admin:</strong> admin@haqms.com
              </button>
              <button
                type="button"
                onClick={() => { setEmail('reception1@haqms.com'); setPassword('password123'); }}
                className="text-left p-2 rounded bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-700"
              >
                <strong>Receptionist:</strong> reception1@haqms.com
              </button>
              <button
                type="button"
                onClick={() => { setEmail('doctor1@haqms.com'); setPassword('password123'); }}
                className="text-left p-2 rounded bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-700"
              >
                <strong>Doctor:</strong> doctor1@haqms.com
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
