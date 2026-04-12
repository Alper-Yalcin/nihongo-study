import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { SectionCard } from '../components/SectionCard';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes } from '../data/appShellContent';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { localSessionRepository } from '../features/kana/session/localSessionRepository';

interface KanaSessionPageProps {
  language: AppLanguage;
}

const getFlowRoute = (script: 'hiragana' | 'katakana', type: string) => {
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

export const KanaSessionPage: React.FC<KanaSessionPageProps> = ({ language }) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { activeSession } = useKanaProgressStore();
  const session = sessionId ? localSessionRepository.get(sessionId) : activeSession;

  if (!session) {
    return <Navigate to={appShellRoutes.home} replace />;
  }

  const flowRoute = getFlowRoute(session.script, session.type);
  const overviewRoute = session.script === 'hiragana' ? appShellRoutes.hiraganaOverview : appShellRoutes.katakanaOverview;

  return (
    <PageContainer>
      <div className="space-y-6">
        <Link to={overviewRoute} className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} className="mr-2" />
          {language === 'tr' ? 'Overview sayfasina don' : 'Back to overview'}
        </Link>

        <SectionCard
          title={language === 'tr' ? 'Kayitli session bulundu' : 'Saved session found'}
          description={language === 'tr' ? 'Bu session ilgili akis icinde resume banner ile devam ettirilebilir.' : 'This session can be resumed from the matching flow via the resume banner.'}
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Script</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{session.script}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Type</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{session.type}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Status</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{session.status}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Items</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{session.itemIds.length}</div>
              </div>
            </div>

            <Link to={flowRoute} className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
              <Play size={16} className="mr-2" />
              {language === 'tr' ? 'Ilgili akisa git' : 'Open matching flow'}
            </Link>
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
};
