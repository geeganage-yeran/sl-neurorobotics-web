import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';

export default function NotFoundPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#051923' }}>
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Main content */}
            <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* 404 Number with glitch effect */}
                <div className="text-center mb-8">
                    <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-pulse leading-none">
                        404
                    </h1>
                    <div className="relative">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-bounce">
                            Page Not Found
                        </h2>
                        <div className="absolute inset-0 text-3xl md:text-4xl lg:text-5xl font-bold text-purple-400/20 animate-ping">
                            Page Not Found
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="text-center mb-12 max-w-2xl">
                    <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <button className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                        <Home className="w-5 h-5 group-hover:animate-bounce" />
                        Go Home
                    </button>

                    <button className="group flex items-center gap-3 bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 backdrop-blur-sm">
                        <ArrowLeft className="w-5 h-5 group-hover:animate-bounce" />
                        Go Back
                    </button>

                    <button className="group flex items-center gap-3 bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 backdrop-blur-sm">
                        <RefreshCw className="w-5 h-5 group-hover:animate-spin" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
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