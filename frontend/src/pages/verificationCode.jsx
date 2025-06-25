import React, { useState, useRef, useEffect } from 'react';
import { Shield, ArrowLeft, CheckCircle, AlertCircle, RefreshCw, Clock } from 'lucide-react';

export default function OTPInterface() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [canResend, setCanResend] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const inputRefs = useRef([]);
    const email = "user@example.com"; // This would come from props or context

    // Timer effect
    useEffect(() => {
        if (timeLeft > 0 && !isVerified) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setCanResend(true);
        }
    }, [timeLeft, isVerified]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        setError('');
        const newOtp = [...otp];

        // Handle paste
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split('');
            for (let i = 0; i < 6; i++) {
                newOtp[i] = pastedCode[i] || '';
            }
            setOtp(newOtp);

            // Focus on the last filled input or the first empty one
            const lastFilledIndex = newOtp.findLastIndex(digit => digit !== '');
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusIndex]?.focus();
            return;
        }

        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // If current input is empty, go to previous and clear it
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === 'Enter') {
            handleVerify();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);

            // Simulate success/failure (for demo, we'll make '123456' the correct code)
            if (otpCode === '123456') {
                setIsVerified(true);
            } else {
                setError('Invalid OTP code. Please try again.');
                // Clear the OTP inputs
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        }, 2000);
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setIsLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setTimeLeft(300); // Reset timer
            setCanResend(false);
            setResendCooldown(30); // 30 second cooldown
            setOtp(['', '', '', '', '', '']); // Clear inputs
            inputRefs.current[0]?.focus();
        }, 1500);
    };

    const clearOTP = () => {
        setOtp(['', '', '', '', '', '']);
        setError('');
        inputRefs.current[0]?.focus();
    };

    if (isVerified) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Successful!</h1>
                        <p className="text-gray-600 mb-8">
                            Your account has been verified successfully. You can now continue.
                        </p>

                        <button
                            onClick={() => alert('Continue to dashboard')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-200"
                        >
                            Continue
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
                            <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h1>
                        <p className="text-gray-600">
                            We've sent a 6-digit verification code to
                            <span className="font-semibold text-gray-900 block mt-1">{email}</span>
                        </p>
                    </div>

                    {/* OTP Input */}
                    <div className="mb-6">
                        <div className="flex justify-center space-x-3 mb-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-0 ${error
                                            ? 'border-red-300 focus:border-red-500 bg-red-50'
                                            : digit
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                                        }`}
                                    disabled={isLoading}
                                />
                            ))}
                        </div>

                        {error && (
                            <div className="flex items-center justify-center text-red-600 text-sm mb-4">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Timer */}
                    <div className="text-center mb-6">
                        {timeLeft > 0 ? (
                            <div className="flex items-center justify-center text-gray-600 text-sm">
                                <Clock className="w-4 h-4 mr-2" />
                                Code expires in {formatTime(timeLeft)}
                            </div>
                        ) : (
                            <div className="text-red-600 text-sm">
                                Code expired. Please request a new one.
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={handleVerify}
                            disabled={isLoading || otp.join('').length !== 6}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Verifying...
                                </div>
                            ) : (
                                'Verify Code'
                            )}
                        </button>

                        <div className="flex space-x-3">
                            <button
                                onClick={handleResend}
                                disabled={resendCooldown > 0 || isLoading}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-gray-200"
                            >
                                {resendCooldown > 0 ? (
                                    <div className="flex items-center justify-center">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Resend ({resendCooldown}s)
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Resend Code
                                    </div>
                                )}
                            </button>

                            <button
                                onClick={clearOTP}
                                disabled={isLoading}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-gray-200"
                            >
                                Clear
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}