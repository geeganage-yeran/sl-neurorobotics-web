import React, { useState, useEffect } from 'react';
import { XCircle, X, AlertTriangle, RefreshCw, ArrowLeft, Shield } from 'lucide-react';

export default function PasswordErrorInterface() {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleRetry = async () => {
        setIsRetrying(true);
        // Simulate retry delay
        setTimeout(() => {
            setIsRetrying(false);
            console.log('Retry password change');
        }, 2000);
    };

    const handleGoBack = () => {
        console.log('Go back to password form');
    };

    const handleContactSupport = () => {
        console.log('Contact support');
    };

    if (!isVisible) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-500 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}>
                {/* Header */}
                <div className="relative p-6 text-center">


                    {/* Error Icon */}
                    <div className="mb-4 flex justify-center">
                        <div className="relative">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <div className="absolute inset-0 w-16 h-16 bg-red-200 rounded-full animate-ping opacity-20"></div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Password Change Failed
                    </h2>

                    {/* Subtitle */}
                    <p className="text-gray-600 mb-6">
                        Something went wrong while updating your password. Please try again.
                    </p>
                </div>



                {/* Security Notice */}
                <div className="px-6 pb-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Security Notice
                        </h4>
                        <p className="text-sm text-amber-700">
                            Your current password remains active and secure. No changes have been made to your account.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6">
                    <div className="space-y-3">
                        <button
                            onClick={handleRetry}
                            disabled={isRetrying}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl font-medium hover:from-red-700 hover:to-red-800 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isRetrying ? (
                                <>
                                    <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
                                    Retrying...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                                    Try Again
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleGoBack}
                            className="w-full bg-gray-100 ext-blue-600 hover:text-blue-700  py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Go Back to Form
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}