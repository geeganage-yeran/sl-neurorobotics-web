import React from 'react';

const Button = ({
  onClick,
  children,
  variant = 'primary',    
  size = 'medium',    
  disabled = false,       
  className = '',         
  px,                     
  py,                  
  padding,             
}) => {
  const baseStyles = "rounded-lg font-semibold transition-colors cursor-pointer";
  

  const variantStyles = {
    primary: "bg-[#006494] hover:bg-[#003554] text-white transition-all duration-300 ease-in-out",
    secondary: "border-2 border-[#006494] hover:border-[#003554] text-[#006494] hover:text-[#003554] transition-all duration-300 ease-in-out",
  };

  const sizeStyles = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const defaultPadding = {
    small: "px-4 py-2",
    medium: "px-8 py-3",
    large: "px-12 py-4",
  };

  let paddingClasses = '';
  if (padding) {
    paddingClasses = padding;
  } else if (px || py) {
    paddingClasses = `${px || 'px-8'} ${py || 'py-3'}`;
  } else {
    paddingClasses = defaultPadding[size];
  }

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