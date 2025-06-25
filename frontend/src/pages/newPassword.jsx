import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, Shield } from 'lucide-react';

export default function NewPasswordInterface() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Password strength calculation
    useEffect(() => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(strength);
    }, [password]);

    const getStrengthColor = () => {
        if (passwordStrength <= 1) return 'bg-red-500';
        if (passwordStrength <= 2) return 'bg-orange-500';
        if (passwordStrength <= 3) return 'bg-yellow-500';
        if (passwordStrength <= 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getStrengthText = () => {
        if (passwordStrength <= 1) return 'Very Weak';
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 3) return 'Fair';
        if (passwordStrength <= 4) return 'Good';
        return 'Strong';
    };

    const validatePassword = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        } else if (!/(?=.*[a-z])/.test(password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*[0-9])/.test(password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validatePassword()) return;

        setIsLoading(true);
        setErrors({});

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
        }, 2000);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: '' }));
        }
    };

    const handleConfirmPasswordChange = (value) => {
        setConfirmPassword(value);
        if (errors.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Password Updated!</h1>
                        <p className="text-gray-600 mb-8">
                            Your password has been successfully updated. You can now use your new password to sign in.
                        </p>

                        <button
                            onClick={() => alert('Navigate to login')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-200"
                        >
                            Continue to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h1>
                        <p className="text-gray-600">
                            Please create a strong password for your account security.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* New Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    placeholder="Enter your new password"
                                    className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-colors focus:outline-none focus:ring-0 ${errors.password
                                        ? 'border-red-300 focus:border-red-500'
                                        : password
                                            ? 'border-blue-500 focus:border-blue-600'
                                            : 'border-gray-200 focus:border-blue-500'
                                        }`}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                                    <span className={`text-sm font-medium ${passwordStrength <= 2 ? 'text-red-600' :
                                        passwordStrength <= 3 ? 'text-yellow-600' :
                                            passwordStrength <= 4 ? 'text-blue-600' : 'text-green-600'
                                        }`}>
                                        {getStrengthText()}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`${getStrengthColor()} h-2 rounded-full transition-all duration-300`}
                                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}


                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                    placeholder="Confirm your new password"
                                    className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-colors focus:outline-none focus:ring-0 ${errors.confirmPassword
                                        ? 'border-red-300 focus:border-red-500'
                                        : confirmPassword && password === confirmPassword
                                            ? 'border-green-500 focus:border-green-600'
                                            : 'border-gray-200 focus:border-blue-500'
                                        }`}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                            {confirmPassword && password === confirmPassword && !errors.confirmPassword && (
                                <p className="mt-2 text-sm text-green-600 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Passwords match
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 pt-2">
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading || !password || !confirmPassword || passwordStrength < 3}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Updating Password...
                                    </div>
                                ) : (
                                    'Update Password'
                                )}
                            </button>

                            <button
                                onClick={() => alert('Navigate back')}
                                disabled={isLoading}
                                className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Previous Step
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}