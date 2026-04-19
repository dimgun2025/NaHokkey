import React from 'react';

interface ScreenProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function Screen({ title, subtitle, children, actions }: ScreenProps) {
  return (
    <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '100dvh', padding: '16px', paddingBottom: '140px' }}>
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>
        <div style={{ 
          marginBottom: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          ...(actions ? { '@media (min-width: 768px)': { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' } } : {})
        }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--text-main)', margin: 0 }}>
              {title}
            </h1>
            {subtitle && (
              <div style={{ marginTop: '4px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {subtitle}
              </div>
            )}
          </div>
          {actions && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {actions}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
