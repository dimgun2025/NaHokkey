import React from 'react';
import clsx from 'clsx';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'btn hover-lift',
          `btn-${variant}`,
          `btn-${size}`,
          fullWidth && 'btn-full-width',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
