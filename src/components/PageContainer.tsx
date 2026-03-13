import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {title && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
        </div>
      )}
      <div className="space-y-12">
        {children}
      </div>
    </div>
  );
};
