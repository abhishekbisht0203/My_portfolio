import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'default'; size?: 'sm' | 'md' };

export const Button: React.FC<ButtonProps> = ({ children, variant = 'default', size = 'md', className = '', ...props }) => {
  const variantClass = variant === 'outline' ? 'border bg-transparent' : 'bg-primary text-white';
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-sm' : 'px-3 py-2';
  return (
    <button className={`${variantClass} ${sizeClass} rounded ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
