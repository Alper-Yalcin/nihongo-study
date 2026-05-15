import React from 'react';

interface GamePageShellProps {
  children: React.ReactNode;
  className?: string;
}

export const GamePageShell: React.FC<GamePageShellProps> = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-[1180px] pb-10 pt-2 ${className}`}>
    {children}
  </div>
);
