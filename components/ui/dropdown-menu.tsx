"use client";
import React from 'react';

type DivProps = React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode };
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode };

export const DropdownMenu: React.FC<DivProps> = ({ children, className = '', ...props }) => (
  <div className={`relative inline-block ${className}`} {...props}>
    {children}
  </div>
);

export const DropdownMenuTrigger: React.FC<ButtonProps> = ({ children, className = '', ...props }) => (
  <button type="button" className={className} {...props}>
    {children}
  </button>
);

export const DropdownMenuContent: React.FC<DivProps> = ({ children, className = '', ...props }) => (
  <div className={`absolute z-10 mt-2 min-w-[10rem] bg-white border rounded ${className}`} {...props}>
    {children}
  </div>
);

export const DropdownMenuItem: React.FC<ButtonProps> = ({ children, className = '', ...props }) => (
  <button className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${className}`} {...props}>
    {children}
  </button>
);

export default DropdownMenu;
