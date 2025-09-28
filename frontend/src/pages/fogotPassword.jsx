import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import api from "../services/api";

export default function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email from navigation state
  const email = location.state?.email;
  
  useEffect(() => {
    // If no email is provided, redirect back to forgot password
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async () => {
    // Validate password match
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Validate password strength (optional)
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setIsLoading(true);

    try {
      // Send password change request to backend
      const response = await api.post('/auth/change-password', {
        email: email,
        newPassword: newPassword
      });

      if (response.status === 200) {
        alert('Password changed successfully!');
        // Navigate to login page
        navigate('/login');
      } else {
        const data = response.data;
        alert(data.message || 'Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      
      // Handle error response
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Failed to change password. Please try again.');
      } else {
        alert('An error occurred while changing password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Change Password
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your new password for <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="space-y-6">
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="Enter your new password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="Confirm your new password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Change Password Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !newPassword || !confirmPassword}
              className="cursor-pointer w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
              style={{ backgroundColor: '#00152f' }}
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <button 
              onClick={handleBackToLogin}
              disabled={isLoading}
              className="cursor-pointer inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}