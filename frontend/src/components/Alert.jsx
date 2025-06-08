import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Alert = ({ 
  open, 
  onClose, 
  message, 
  type = 'success', 
  position = 'top-right',
  autoHideDuration = 6000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 50);
      
      if (autoHideDuration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoHideDuration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [open, autoHideDuration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90',
          border: 'border-emerald-400/50',
          shadow: 'shadow-emerald-500/25'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500/90 to-rose-500/90',
          border: 'border-red-400/50',
          shadow: 'shadow-red-500/25'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-500/90 to-orange-500/90',
          border: 'border-amber-400/50',
          shadow: 'shadow-amber-500/25'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-500/90 to-cyan-500/90',
          border: 'border-blue-400/50',
          shadow: 'shadow-blue-500/25'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90',
          border: 'border-emerald-400/50',
          shadow: 'shadow-emerald-500/25'
        };
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 drop-shadow-sm";
    switch (type) {
      case 'success':
        return <CheckCircle className={iconClass} />;
      case 'error':
        return <AlertCircle className={iconClass} />;
      case 'warning':
        return <AlertTriangle className={iconClass} />;
      case 'info':
        return <Info className={iconClass} />;
      default:
        return <CheckCircle className={iconClass} />;
    }
  };

  const getPositionStyles = () => {
    const slideDirection = {
      'top-left': isAnimating ? 'translate-x-0 translate-y-0' : '-translate-x-full -translate-y-2',
      'top-right': isAnimating ? 'translate-x-0 translate-y-0' : 'translate-x-full -translate-y-2',
      'bottom-left': isAnimating ? 'translate-x-0 translate-y-0' : '-translate-x-full translate-y-2',
      'bottom-right': isAnimating ? 'translate-x-0 translate-y-0' : 'translate-x-full translate-y-2',
      'top-center': isAnimating ? 'translate-x-0 translate-y-0' : 'translate-x-0 -translate-y-8',
      'bottom-center': isAnimating ? 'translate-x-0 translate-y-0' : 'translate-x-0 translate-y-8'
    };

    const positions = {
      'top-left': 'top-6 left-6',
      'top-right': 'top-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'bottom-right': 'bottom-6 right-6',
      'top-center': 'top-6 left-1/2 -translate-x-1/2',
      'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2'
    };

    return `${positions[position]} ${slideDirection[position]}`;
  };

  if (!isVisible) return null;

  const typeStyles = getTypeStyles();

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ease-out ${getPositionStyles()}`}
    >
      <div className={`
        ${typeStyles.bg} ${typeStyles.border} 
        backdrop-blur-xl border rounded-xl shadow-2xl ${typeStyles.shadow}
        p-4 min-w-80 max-w-96 
        transform transition-all duration-300
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm leading-relaxed drop-shadow-sm">
              {message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 p-1.5 rounded-full hover:bg-white/20 transition-all duration-200 group"
          >
            <X className="w-4 h-4 text-white/80 group-hover:text-white drop-shadow-sm" />
          </button>
        </div>
        
        {/* Progress bar */}
        {autoHideDuration > 0 && (
          <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/40 rounded-full transition-all ease-linear"
              style={{
                animation: `shrink ${autoHideDuration}ms linear forwards`,
                width: '100%'
              }}
            />
          </div>
        )}
      </div>
      
      <style >{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Alert;