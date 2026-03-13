import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { ScriptStudyLayout } from '../components/ScriptStudyLayout';
import { hiraganaSections } from '../data/kana';
import { hiraganaDictionaryWords } from '../data/words';

export const Hiragana: React.FC = () => {
  return (
    <PageContainer title="Hiragana">
      <ScriptStudyLayout 
        title="Hiragana" 
        kanaSections={hiraganaSections} 
        dictionaryWords={hiraganaDictionaryWords} 
      />
    </PageContainer>
  );
};
