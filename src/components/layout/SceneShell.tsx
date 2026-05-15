import React from 'react';

type SceneShellVariant = 'centered' | 'wide' | 'session';

interface SceneShellProps {
  children: React.ReactNode;
  className?: string;
  variant?: SceneShellVariant;
}

const widthClass: Record<SceneShellVariant, string> = {
  centered: 'max-w-[1120px]',
  wide: 'max-w-[1280px]',
  session: 'max-w-[980px]'
};

export const SceneShell: React.FC<SceneShellProps> = ({
  children,
  className = '',
  variant = 'wide'
}) => (
  <main className={`mx-auto w-full ${widthClass[variant]} px-3 pb-10 pt-3 sm:px-5 ${className}`}>
    {children}
  </main>
);
