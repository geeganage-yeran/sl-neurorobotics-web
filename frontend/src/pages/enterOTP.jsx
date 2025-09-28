import React, { useState, useRef, useEffect } from 'react';
import { Shield, ArrowLeft, CheckCircle, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../services/api";

export default function OTPVerificationForm() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email from navigation state, fallback to empty string
  const email = location.state?.email || '';

  // Redirect to forgot password page if no email is provided
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const pastedOtp = text.replace(/\D/g, '').slice(0, 6).split('');
        const newOtp = [...otp];
        pastedOtp.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        const nextEmptyIndex = newOtp.findIndex(digit => !digit);
        if (nextEmptyIndex === -1 && newOtp.every(digit => digit)) {
          inputRefs.current[5]?.focus();
        } else if (nextEmptyIndex !== -1) {
          inputRefs.current[nextEmptyIndex]?.focus();
        }
      });
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const sanitizedData = {
        email: email.trim().toLowerCase(),
        otp: otpValue
      };

      const response = await api.post("/auth/verify-otp", sanitizedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (data.success && data.codeMatched) {
        setIsVerified(true);
      } else {
        if (data.codeExpired) {
          setError('Verification code has expired. Please request a new code.');
        } else if (!data.codeMatched) {
          setError('Invalid verification code. Please try again.');
        } else {
          setError(data.message || 'Verification failed. Please try again.');
        }
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      
      // Handle API error responses
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Verification failed. Please try again.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
      
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    
    try {
      const sanitizedData = {
        email: email.trim().toLowerCase()
      };

      const response = await api.post("/auth/resend-otp", sanitizedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (data.success) {
        setResendTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        // Show success message briefly
        const originalError = error;
        setError('New verification code sent!');
        setTimeout(() => setError(originalError), 3000);
      } else {
        setError(data.message || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      
      // Handle API error responses
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Failed to resend code. Please try again.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    navigate("/forgot-password");
  };

  // Don't render the component if there's no email
  if (!email) {
    return null;
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg animate-pulse">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Verification Successful!
            </h2>
            
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Your account has been verified successfully. You can now proceed with password reset.
            </p>
            
            <button
              onClick={() => navigate('/reset-password', { state: { email } })}
              className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg text-lg transform hover:scale-[1.02]"
            >
              Continue to Password Reset
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Verify Your Account
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-2">
            We've sent a 6-digit verification code to:
          </p>
          <p className="text-blue-600 font-semibold text-xl">
            {email}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-10">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter 6-digit verification code
              </label>
              
              {/* OTP Input Fields */}
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                  <div key={index} className="shadow-lg">
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-md ${
                        error && !error.includes('sent')
                          ? 'border-red-300 bg-red-50'
                          : digit
                          ? 'border-green-400 bg-green-50 text-green-700'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                      disabled={isVerifying || isResending}
                    />
                  </div>
                ))}
              </div>

              {error && (
                <div className={`flex items-center justify-center gap-2 text-sm mb-4 ${
                  error.includes('sent') ? 'text-green-600' : 'text-red-600'
                }`}>
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isVerifying || otp.join('').length !== 6 || isResending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg text-lg"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Code'
              )}
            </button>

            {/* Resend Section */}
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Didn't receive the code?
              </p>
              
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={isResending || isVerifying}
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Resend Code
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  Resend in {resendTimer}s
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleBack}
              className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300 flex items-center justify-center gap-2 mx-auto text-lg"
              disabled={isVerifying || isResending}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Forgot Password
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-lg text-gray-600">
            Need help?{' '}
            <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 underline decoration-2 underline-offset-4">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}