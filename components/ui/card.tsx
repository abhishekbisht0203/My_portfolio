import React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode };

export const Card: React.FC<Props> = ({ children, className = '', ...props }) => (
  <div className={`rounded-md border bg-white ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<Props> = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-b ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<Props> = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<Props> = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<Props> = ({ children, className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<Props> = ({ children, className = '', ...props }) => (
  <div className={`p-3 border-t ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
