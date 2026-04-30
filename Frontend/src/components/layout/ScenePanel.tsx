import React from 'react';

interface ScenePanelProps {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'article' | 'div';
}

export const ScenePanel: React.FC<ScenePanelProps> = ({
  children,
  className = '',
  as: As = 'section'
}) => (
  <As
    className={`relative overflow-hidden rounded-[1.75rem] border border-[color:var(--kt-brand)]/15 p-5 backdrop-blur-md md:p-7 ${className}`}
    style={{
      background:
        'linear-gradient(135deg, color-mix(in srgb, var(--kt-surface) 72%, transparent), color-mix(in srgb, var(--kt-brand-soft) 50%, transparent)), var(--kt-washi-bg)',
      boxShadow: '0 18px 46px rgba(132, 82, 62, 0.10)'
    }}
  >
    {children}
  </As>
);
