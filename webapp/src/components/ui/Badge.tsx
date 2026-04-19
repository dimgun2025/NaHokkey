import React from 'react';
import clsx from 'clsx';
import './Badge.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'game' | 'training' | 'confirmed' | 'risk' | 'urgent' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', className, children, ...props }) => {
  return (
    <span className={clsx('badge', `badge-${variant}`, className)} {...props}>
      {children}
    </span>
  );
};
