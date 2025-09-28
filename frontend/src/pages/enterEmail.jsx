import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const sanitizedData = {
        email: email.trim().toLowerCase()
      };
      
      const response = await api.post("/auth/reset-password", sanitizedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setIsSubmitted(true);
      } else {
        setError(response.data.message || 'Failed to send reset code');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to send reset code';
        setError(errorMessage);
      } else if (error.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleSignInClick = () => {
    navigate("/login");
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setEmail('');
    setError('');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 mb-2">
              We've sent a password reset code to:
            </p>
            
            <p className="text-blue-600 font-medium mb-6">
              {email}
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Next steps:</strong>
                <br />
                1. Check your email for the 6-digit code
                <br />
                2. Enter the code on the next page
                <br />
                3. Create your new password
              </p>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Didn't receive the email? Check your spam folder or try again with a different email address.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/verify-reset-code', { state: { email } })}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Enter Reset Code
              </button>
              
              <button
                onClick={handleTryAgain}
                className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Try Different Email
              </button>
              
              <button
                onClick={handleBackToLogin}
                className="cursor-pointer w-full text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600">
            No worries! Enter your email address and we'll send you a code to reset your password.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending Reset Code...
                </div>
              ) : (
                'Send Reset Code'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleBackToLogin}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Remember your password?{' '}
            <button 
              onClick={handleSignInClick}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}