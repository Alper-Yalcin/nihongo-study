import React, { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  fallbackTitle: string;
  fallbackPath: string;
}

export const OverviewDemoFrame: React.FC<Props> = ({
  src,
  alt,
  fallbackTitle,
  fallbackPath
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="group flex-1 w-full max-w-[600px] min-h-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-sm transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-xl flex items-center justify-center">
      {hasError ? (
        <div className="text-slate-400 text-center p-8">
          <p className="mb-2 font-medium">{fallbackTitle}</p>
          <p className="text-xs font-mono">{fallbackPath}</p>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-xl border border-slate-200 shadow-sm transition-transform duration-500 ease-out will-change-transform group-hover:scale-110"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};
