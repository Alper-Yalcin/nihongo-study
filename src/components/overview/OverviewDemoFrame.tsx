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
    <div className="flex-1 w-full max-w-[600px] bg-slate-100 rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-center min-h-[300px]">
      {hasError ? (
        <div className="text-slate-400 text-center p-8">
          <p className="mb-2 font-medium">{fallbackTitle}</p>
          <p className="text-xs font-mono">{fallbackPath}</p>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="rounded-xl w-full h-auto shadow-sm border border-slate-200"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};
