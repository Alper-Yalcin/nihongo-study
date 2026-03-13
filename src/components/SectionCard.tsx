import React from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, description, children }) => {
  return (
    <section className="section-card bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="section-card-header px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <div className="p-4">
        {children}
      </div>
    </section>
  );
};
