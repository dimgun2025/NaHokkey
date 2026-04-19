import React from 'react';
import clsx from 'clsx';
import './Pill.css';

export interface TonePillProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function TonePill({ children, className, ...props }: TonePillProps) {
  return (
    <div className={clsx('tone-pill-component', className)} {...props}>
      {children}
    </div>
  );
}
