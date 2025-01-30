import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label 
          className="text-sm font-medium text-gray-700"
          htmlFor={props.id}
        >
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 
          border border-gray-300 
          rounded-lg 
          focus:outline-none 
          focus:ring-2 
          focus:ring-primary 
          focus:border-transparent
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
