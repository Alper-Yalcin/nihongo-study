import React from 'react';
import { AppLanguage } from '../../data/appPreferences';
import { ListeningItem, ListeningMode, RunStats } from '../../types';
import { ListeningRecognitionPanel } from './ListeningRecognitionPanel';
import { ListeningTypingPanel } from './ListeningTypingPanel';
import { ListeningWritingPanel } from './ListeningWritingPanel';

interface Props {
  language: AppLanguage;
  items: ListeningItem[];
  sourceItems: ListeningItem[];
  mode: ListeningMode;
  onFinish: (stats: RunStats) => void;
  onCancel: () => void;
}

export const ListeningStudyPanel: React.FC<Props> = ({
  language,
  items,
  sourceItems,
  mode,
  onFinish,
  onCancel
}) => {
  if (mode === 'recognition') {
    return (
      <ListeningRecognitionPanel
        language={language}
        items={items}
        sourceItems={sourceItems}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    );
  }

  if (mode === 'typing') {
    return (
      <ListeningTypingPanel
        language={language}
        items={items}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    );
  }

  return (
    <ListeningWritingPanel
      language={language}
      items={items}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
};
