import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Shield,
  Lock,
  AlertCircle,
} from "lucide-react";

export default function Custom403Page() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/", { replace: true });
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#051923" }}
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="mb-8 relative">
          <div className="relative">
            <Shield className="w-24 h-24 md:w-32 md:h-32 text-red-500 animate-pulse" />
            <Lock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 text-red-600" />
            <AlertCircle className="absolute -top-2 -right-2 w-8 h-8 text-orange-500 animate-bounce" />
          </div>
        </div>

        <div className="text-center mb-7">
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 animate-pulse leading-none">
            403
          </h1>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Access Forbidden
            </h2>
          </div>
        </div>

        {/* Security notice */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-7 backdrop-blur-sm max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-semibold">
              Access Restricted
            </span>
          </div>
          <p className="text-gray-300 text-sm">
            This resource requires special permissions for access.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button className="group flex items-center gap-3 " onClick={handleClick}>
            <Home className="w-5 h-5 group-hover:animate-bounce" />
            Go Home
          </Button>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
