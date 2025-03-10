"use client";

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logger } from '../lib/logger';
import { ROLE_PERMISSIONS } from '../types/roles';
import { Shield } from '@phosphor-icons/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('super_admin');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const auth = useAuth() as {
    user: any;
    loading: boolean;
    signUp: (data: { email: string; password: string; name: string }) => Promise<void>;
    login: (data: { email: string; password: string }) => Promise<void>;
    resetPassword: (data: { email: string }) => Promise<void>;
  };
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isSignUpMode) {
        if (!auth.signUp) {
          throw new Error('Sign up is not available');
        }
        await auth.signUp({ email, password, name });
        logger.info('Signup successful', {
          context: { email, name },
          source: 'LoginPage'
        });
        // Automatically log in after successful signup
        if (!auth.login) {
          throw new Error('Login is not available');
        }
        await auth.login({ email, password });
      } else {
        if (!auth.login) {
          throw new Error('Login is not available');
        }
        await auth.login({ email, password }); 
        logger.info('Login successful', {
          context: { email, role: selectedRole },
          source: 'LoginPage'
        });
      }
      navigate(from);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in. Please check your credentials and try again.';
      setError(message);
      logger.error(isSignUpMode ? 'Signup failed' : 'Login failed', {
        context: { error: err },
        source: 'LoginPage'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!auth.resetPassword) {
        throw new Error('Password reset is not available');
      }
      await auth.resetPassword({ email });
      setError('Password reset email sent. Please check your inbox.');
      logger.info('Password reset email sent', {
        context: { email },
        source: 'LoginPage'
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email.';
      setError(message);
      logger.error('Password reset failed', {
        context: { error: err },
        source: 'LoginPage'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800">Super Admin Account</h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>Email: varungoti@gmail.com</p>
            <p>Password: *************</p>
          </div>
        </div>

        <div>
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUpMode ? 'Create an account' : 'Sign in to your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={isResetMode ? handleResetPassword : handleSubmit} noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
            {isSignUpMode && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${!isSignUpMode && !isResetMode ? 'rounded-t-md' : ''} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed`}
                disabled={loading}
                placeholder="Email address"
              />
            </div>
            {!isResetMode && (
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUpMode ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={loading}
                  placeholder={isSignUpMode ? 'Create Password' : 'Password'}
                />
              </div>
            )}
          </div>
          
          {!isSignUpMode && !isResetMode && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Login As
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                aria-label="Select role"
              >
                {Object.entries(ROLE_PERMISSIONS).map(([role, details]) => (
                  <option key={role} value={role}>
                    {details.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4 animate-shake">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (isResetMode) {
                  setIsResetMode(false);
                } else {
                  setIsSignUpMode(!isSignUpMode);
                }
                setError(null);
              }}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isResetMode ? 'Back to login' : isSignUpMode ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
            {!isSignUpMode && (
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(!isResetMode);
                  setError(null);
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                {isResetMode ? 'Back to login' : 'Forgot your password?'}
              </button>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {loading ? (
                  <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              {loading ? 'Processing...' : isResetMode ? 'Reset Password' : isSignUpMode ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;