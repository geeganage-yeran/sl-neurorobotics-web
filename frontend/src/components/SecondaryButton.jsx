import React, { useState } from 'react';

const SecondaryButton = ({ 
  variant = 'filled', 
  color = '#003554', 
  hoverColor = '#1E3039',
  text = 'Button', 
  className = '',
  icon=null,
  py = 'py-1', 
  px = 'px-4',
  onClick,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseClasses = `cursor-pointer flex text-sm font-medium rounded-md transition-all duration-200 ${py} ${px} ${className}`;
  
  const buttonStyle = variant === 'outline' 
    ? {
        borderColor: isHovered ? hoverColor : color,
        color: isHovered ? hoverColor : color,
        borderWidth: '1px',
        borderStyle: 'solid',
        backgroundColor: 'transparent'
      }
    : {
        backgroundColor: isHovered ? hoverColor : color,
        color: 'white'
      };

  return (
    <button 
      className={baseClasses}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      {icon}{text}
    </button>
  );
};

export default SecondaryButton;