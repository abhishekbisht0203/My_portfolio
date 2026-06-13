import React from 'react';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary';
  size?: 'xs' | 'sm' | 'md';
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md', className = '', ...props }) => {
  const sizeClass = size === 'xs' ? 'text-xs px-1 py-0.5' : size === 'sm' ? 'text-sm px-2 py-0.5' : 'text-sm px-2 py-1';
  const variantClass = variant === 'secondary' ? 'bg-gray-100 text-gray-800' : 'bg-primary text-white';
  return (
    <span className={`rounded ${sizeClass} ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
