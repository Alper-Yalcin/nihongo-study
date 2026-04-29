import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button } from '../ui';
import { EvaluatedChallenge } from '../../features/play/challenges/challengeEngine';
import { QuestCard } from '../quests/QuestCard';

interface DailyQuestsCardProps {
  title: string;
  items: EvaluatedChallenge[];
  href: string;
}

export const DailyQuestsCard: React.FC<DailyQuestsCardProps> = ({ title, items, href }) => (
  <section className="rounded-[1.8rem] border border-[var(--kt-border-subtle)] bg-[linear-gradient(180deg,var(--kt-surface-raised),var(--kt-surface))] p-5 shadow-[var(--kt-shadow-sm)]">
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-xl font-black text-[var(--kt-ink-strong)]">{title}</h3>
      <Link
        to={href}
        className="text-xs font-black uppercase tracking-[0.12em] text-[var(--kt-accent-info)]"
      >
        Tumunu goster
      </Link>
    </div>
    <div className="mt-4 space-y-3">
      {items.slice(0, 2).map((item, index) => (
        <QuestCard
          key={item.challenge.id}
          title={item.challenge.title}
          progress={item.progress.progress}
          goal={item.challenge.goalValue}
          reward={`${item.challenge.rewardValue} ${item.challenge.rewardType.toUpperCase()}`}
          completed={item.progress.completed}
          accent={index === 0 ? 'warning' : 'info'}
        />
      ))}
      {items.length === 0 && (
        <div className="rounded-[1.2rem] border border-dashed border-[var(--kt-border-subtle)] px-4 py-5 text-sm text-[var(--kt-ink-muted)]">
          Bugun icin yeni gorev yok.
        </div>
      )}
    </div>
    <div className="mt-4">
      <Button as="link" to={href} variant="secondary" size="sm" iconEnd={<ArrowRight size={14} />}>
        Gorevlere git
      </Button>
    </div>
  </section>
);
