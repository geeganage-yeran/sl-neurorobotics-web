import React from 'react';

// Define the Button component
const Button = ({
  onClick,
  children,
  variant = 'primary',    // Default to 'primary' variant
  size = 'medium',        // Default size
  disabled = false,       // Default state is enabled
  className = '',         // Allow additional custom classes
  px,                     // Custom horizontal padding
  py,                     // Custom vertical padding
  padding,                // Custom padding (overrides px/py if provided)
}) => {
  // Base styles for the button (without default padding)
  const baseStyles = "rounded-lg font-semibold transition-colors cursor-pointer";
  
  // Variant-specific styles
  const variantStyles = {
    primary: "bg-[#006494] hover:bg-[#003554] text-white transition-all duration-300 ease-in-out",
    secondary: "border-2 border-[#006494] hover:border-[#003554] text-[#006494] hover:text-[#003554] transition-all duration-300 ease-in-out",
    // Add more variants below
    // success: "bg-green-500 hover:bg-green-600 text-white",
    // danger: "bg-red-500 hover:bg-red-600 text-white",
    // outline: "border-2 border-gray-500 text-gray-500 hover:text-gray-600 hover:border-gray-600",
  };

  // Size-specific styles (now only affects text size)
  const sizeStyles = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  // Default padding based on size (used when no custom padding is provided)
  const defaultPadding = {
    small: "px-4 py-2",
    medium: "px-8 py-3",
    large: "px-12 py-4",
  };

  // Determine padding to use
  let paddingClasses = '';
  if (padding) {
    // If custom padding is provided, use it directly
    paddingClasses = padding;
  } else if (px || py) {
    // If custom px or py is provided, use them
    paddingClasses = `${px || 'px-8'} ${py || 'py-3'}`;
  } else {
    // Use default padding based on size
    paddingClasses = defaultPadding[size];
  }

  // Combine base, variant, size, padding, and any additional custom classes
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${paddingClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

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