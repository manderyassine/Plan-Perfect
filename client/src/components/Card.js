import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  elevation = 'soft', 
  ...props 
}) => {
  const elevationStyles = {
    soft: 'shadow-soft',
    medium: 'shadow-medium',
    none: 'shadow-none'
  };

  return (
    <div 
      className={`bg-white rounded-xl p-6 ${elevationStyles[elevation]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
