import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';

export default function Custom500Page() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{backgroundColor: '#051923'}}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Error icon */}
        <div className="mb-8">
          <div className="relative">
            <AlertTriangle className="w-24 h-24 md:w-32 md:h-32 text-red-500 animate-pulse" />
            <div className="absolute inset-0">
              <AlertTriangle className="w-24 h-24 md:w-32 md:h-32 text-red-400/30 animate-ping" />
            </div>
          </div>
        </div>

        {/* 500 Number with error effect */}
        <div className="text-center mb-8">
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 animate-pulse leading-none">
            500
          </h1>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-bounce">
              Internal Server Error
            </h2>
            <div className="absolute inset-0 text-3xl md:text-4xl lg:text-5xl font-bold text-red-400/20 animate-ping">
              Internal Server Error
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-12 max-w-2xl">
          <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
            Something went wrong on our end. We're working to fix the issue.
          </p>
          <p className="text-md text-gray-400">
            Please try again in a few moments or contact support if the problem persists.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button className="group flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <Home className="w-5 h-5 group-hover:animate-bounce" />
            Go Home
          </button>
          
          <button className="group flex items-center gap-3 bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5 group-hover:animate-bounce" />
            Go Back
          </button>

          <button className="group flex items-center gap-3 bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 backdrop-blur-sm">
            <RefreshCw className="w-5 h-5 group-hover:animate-spin" />
            Try Again
          </button>
        </div>

        {/* Status indicator */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-semibold">Server Status</span>
          </div>
          <p className="text-gray-300 text-sm">
            Our team has been notified and is investigating the issue.
          </p>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}