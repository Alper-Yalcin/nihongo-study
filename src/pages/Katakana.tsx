import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { ScriptStudyLayout } from '../components/ScriptStudyLayout';
import { katakanaSections } from '../data/kana';
import { katakanaDictionaryWords } from '../data/words';

export const Katakana: React.FC = () => {
  return (
    <PageContainer title="Katakana">
      <ScriptStudyLayout 
        title="Katakana" 
        kanaSections={katakanaSections} 
        dictionaryWords={katakanaDictionaryWords} 
      />
    </PageContainer>
  );
};
