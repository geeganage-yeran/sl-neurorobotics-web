import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Lock, Shield, ArrowRight } from 'lucide-react';

export default function PasswordSuccessInterface() {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleContinue = () => {
        // Handle continue action
        console.log('Continue to dashboard');
    };

    if (!isVisible) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-500 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}>
                {/* Header */}
                <div className="relative p-6 text-center">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Success Icon */}
                    <div className="mb-4 flex justify-center">
                        <div className="relative">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="absolute inset-0 w-16 h-16 bg-green-200 rounded-full animate-ping opacity-20"></div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Password Updated Successfully!
                    </h2>

                    {/* Subtitle */}
                    <p className="text-gray-600 mb-6">
                        Your password has been changed and your account is now more secure.
                    </p>
                </div>


                {/* Actions */}
                <div className="px-6 pb-6">
                    <div className="space-y-3">
                        <button
                            onClick={handleContinue}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center group"
                        >
                            Continue to Dashboard
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>


                    </div>
                </div>

            </div>
        </div>
    );
}