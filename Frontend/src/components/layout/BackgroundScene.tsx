import React from 'react';

export const BackgroundScene: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_38%,rgba(240,232,228,0.52)_100%)] [.theme-dark_&]:opacity-0" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_46%_36%_at_50%_42%,rgba(253,250,248,0.45)_0%,transparent_100%)] [.theme-dark_&]:opacity-0" />
    <div className="absolute inset-0 bg-white/18 [.theme-dark_&]:bg-slate-950/35" />
  </div>
);
