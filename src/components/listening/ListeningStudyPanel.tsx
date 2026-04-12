import React from 'react';
import { AppLanguage } from '../../data/appPreferences';
import { ListeningItem, ListeningMode, RunStats } from '../../types';
import { ListeningRecognitionPanel } from './ListeningRecognitionPanel';
import { ListeningTypingPanel } from './ListeningTypingPanel';
import { ListeningWritingPanel } from './ListeningWritingPanel';

interface Props {
  script: 'hiragana' | 'katakana';
  datasetType: 'character' | 'word';
  language: AppLanguage;
  items: ListeningItem[];
  sourceItems: ListeningItem[];
  mode: ListeningMode;
  onFinish: (stats: RunStats) => void;
  onCancel: () => void;
}

export const ListeningStudyPanel: React.FC<Props> = ({
  script,
  datasetType,
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
        script={script}
        datasetType={datasetType}
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
        script={script}
        datasetType={datasetType}
        language={language}
        items={items}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    );
  }

  return (
    <ListeningWritingPanel
      script={script}
      datasetType={datasetType}
      language={language}
      items={items}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
};
