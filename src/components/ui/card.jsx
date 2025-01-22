import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`border rounded shadow p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-2 ${className}`} {...props}>
      {children}
    </div>
  );
};
