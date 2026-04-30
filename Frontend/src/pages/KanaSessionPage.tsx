import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes, getKanaEntryRoute, KanaAppScope } from '../data/appShellContent';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import {
  Button,
  StatCard
} from '../components/ui';

interface KanaSessionPageProps {
  language: AppLanguage;
  scope?: KanaAppScope;
}

const getFlowRoute = (
  script: 'hiragana' | 'katakana',
  type: string,
  scope: KanaAppScope
) => {
  if (scope === 'play') {
    return getKanaEntryRoute(script, 'play');
  }

  if (script === 'hiragana') {
    if (type === 'review') return appShellRoutes.hiraganaReview;
    if (type === 'weak_drill') return appShellRoutes.hiraganaWeak;
    if (type === 'confusable_drill') return appShellRoutes.hiraganaConfusable;
    return appShellRoutes.hiraganaLearn;
  }

  if (type === 'review') return appShellRoutes.katakanaReview;
  if (type === 'weak_drill') return appShellRoutes.katakanaWeak;
  if (type === 'confusable_drill') return appShellRoutes.katakanaConfusable;
  return appShellRoutes.katakanaLearn;
};

export const KanaSessionPage: React.FC<KanaSessionPageProps> = ({
  language,
  scope = 'study' as KanaAppScope
}) => {
  const resolvedScope: KanaAppScope = scope;
  const { sessionId } = useParams<{ sessionId: string }>();
  const { activeSession, getSession } = useKanaProgressStore();
  const session = sessionId ? getSession(sessionId) : activeSession;

  if (!session) {
    return <Navigate to={appShellRoutes.home} replace />;
  }

  const flowRoute = getFlowRoute(session.script, session.type, resolvedScope);
  const overviewRoute = getKanaEntryRoute(session.script, resolvedScope);

  return (
    <div className="space-y-8 pb-8">
      <section className="rounded-[2rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-7 shadow-[var(--kt-shadow-lg)]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
              {language === 'tr' ? 'Kayitli oturum' : 'Saved session'}
            </div>
            <h1 className="mt-3 text-4xl font-black text-white">
              {language === 'tr' ? 'Devam etmeye hazir' : 'Ready to resume'}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--kt-ink-muted)]">
              {language === 'tr'
                ? 'Bu oturum ilgili akis icinde tekrar acilabilir. Shell artik bu kayitlari da kendi panel diline tasiyor.'
                : 'This session can be reopened inside the matching flow. The shell now surfaces saved runs with the same visual language.'}
            </p>
          </div>
          <Button as="link" to={overviewRoute} variant="secondary" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            {language === 'tr' ? 'Overview sayfasina don' : 'Back to overview'}
          </Button>
        </div>
      </section>

      <section>
        <div className="rounded-[var(--kt-radius-md)] border border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_82%,transparent)] p-8 text-[var(--kt-ink)] shadow-[var(--kt-shadow-sm)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-[var(--kt-ink-strong)]">
                {language === 'tr' ? 'Session ozeti' : 'Session summary'}
              </h3>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Script" value={session.script} />
            <StatCard label="Type" value={session.type} />
            <StatCard label="Status" value={session.status} />
            <StatCard label="Items" value={session.itemIds.length} />
          </div>

          <div className="mt-6">
            <Button as="link" to={flowRoute} variant="primary" size="md">
              <Play size={16} className="mr-2" />
              {language === 'tr' ? 'Ilgili akisa git' : 'Open matching flow'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
