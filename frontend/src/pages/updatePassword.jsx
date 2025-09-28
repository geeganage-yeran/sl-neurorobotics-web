import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, Shield } from 'lucide-react';

export default function UpdatePasswordForm() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Very Weak', color: 'text-red-600' };
      case 2: return { text: 'Weak', color: 'text-orange-600' };
      case 3: return { text: 'Fair', color: 'text-yellow-600' };
      case 4: return { text: 'Good', color: 'text-blue-600' };
      case 5: return { text: 'Strong', color: 'text-green-600' };
      default: return { text: '', color: '' };
    }
  };

  const getStrengthBarColor = (strength) => {
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsUpdating(true);

    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      setIsUpdated(true);
    }, 2000);
  };

  const handleBack = () => {
    setIsUpdated(false);
    setFormData({ newPassword: '', confirmPassword: '' });
    setErrors({});
    setPasswordStrength(0);
  };

  if (isUpdated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Password Updated!
            </h2>
            
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Your password has been successfully updated. You can now use your new password to sign in.
            </p>
            
            <button
              onClick={handleBack}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg text-lg transform hover:scale-[1.02]"
            >
              Continue to Sign In
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
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Update Password
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Choose a strong password to secure your account
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-10">
          <div className="space-y-6">
            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative shadow-lg">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg shadow-md ${
                    errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                  placeholder="Enter new password"
                  disabled={isUpdating}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                >
                  {showPassword.new ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Password Strength:</span>
                    <span className={`text-sm font-medium ${getStrengthText(passwordStrength).color}`}>
                      {getStrengthText(passwordStrength).text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor(passwordStrength)}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <div className="grid grid-cols-2 gap-2">
                      <div className={formData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                        ✓ At least 8 characters
                      </div>
                      <div className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                        ✓ Uppercase letter
                      </div>
                      <div className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                        ✓ Lowercase letter
                      </div>
                      <div className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                        ✓ Number
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {errors.newPassword && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.newPassword}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative shadow-lg">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg shadow-md ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 
                    formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'
                  }`}
                  placeholder="Confirm new password"
                  disabled={isUpdating}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                >
                  {showPassword.confirm ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  {formData.newPassword === formData.confirmPassword ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
              
              {errors.confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isUpdating || !formData.newPassword || !formData.confirmPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg text-lg"
            >
              {isUpdating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating Password...
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300 flex items-center justify-center gap-2 mx-auto text-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Sign In
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