import React from 'react';

// Define the Button component
const Button = ({
  onClick,
  children,
  variant = 'primary',  // Default to 'primary' variant
  size = 'medium',      // Default size
  disabled = false,     // Default state is enabled
  className = ''        // Allow additional custom classes
}) => {
  // Base styles for the button
  const baseStyles = "px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer";

  // Variant-specific styles
  const variantStyles = {
    primary: "bg-[#006494] hover:bg-[#003554] text-white transition-all duration-300 ease-in-out",  // Primary button
    secondary: "border-2 border-[#006494] hover:border-[#003554] text-[#006494] hover:text-[#003554] transition-all duration-300 ease-in-out", // Secondary button
    // Add more variants below
    // success: "bg-green-500 hover:bg-green-600 text-white",
    // danger: "bg-red-500 hover:bg-red-600 text-white",
    // outline: "border-2 border-gray-500 text-gray-500 hover:text-gray-600 hover:border-gray-600",
  };

  // Size-specific styles
  const sizeStyles = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  // Combine base, variant, size, and any additional custom classes
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <button 
      onClick={onClick} 
      className={buttonStyles} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
