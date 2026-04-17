import React from 'react';
import { PageHeader, PageShell } from '../shared/ui';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * Thin compatibility shim. New pages should import PageShell / PageHeader
 * directly from shared/ui. This component keeps legacy pages working while
 * the migration lands page by page.
 */
export const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => (
  <PageShell width="wide">
    {title && (
      <div className="mb-8">
        <PageHeader title={title} />
      </div>
    )}
    <div className="space-y-12">{children}</div>
  </PageShell>
);
