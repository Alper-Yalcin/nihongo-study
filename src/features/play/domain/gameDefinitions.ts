import { GameDefinition } from './playTypes';

export const playGameDefinitions: GameDefinition[] = [
  {
    id: 'kana-match',
    title: 'Kana Match',
    description: 'Show a kana and choose the correct reading.',
    contentType: ['hiragana', 'katakana', 'mixed'],
    difficultyLevels: ['easy', 'normal', 'hard'],
    scoringRules: {
      baseCorrectPoints: 100,
      comboStep: 0.2,
      maxComboMultiplier: 2,
      wrongPenalty: 30,
      fastAnswerBonusMs: 1400,
      fastAnswerBonus: 25
    },
    timeLimit: 90,
    enabled: true
  },
  {
    id: 'meaning-match',
    title: 'Meaning Match',
    description: 'Read the word and choose the correct meaning.',
    contentType: ['hiragana', 'katakana', 'basic_words', 'kanji', 'mixed'],
    difficultyLevels: ['easy', 'normal', 'hard'],
    scoringRules: {
      baseCorrectPoints: 110,
      comboStep: 0.2,
      maxComboMultiplier: 2.2,
      wrongPenalty: 35,
      fastAnswerBonusMs: 1800,
      fastAnswerBonus: 20
    },
    timeLimit: 100,
    enabled: true
  },
  {
    id: 'speed-tap',
    title: 'Speed Tap',
    description: 'Tap matching items as fast as possible.',
    contentType: ['hiragana', 'katakana', 'mixed'],
    difficultyLevels: ['easy', 'normal', 'hard'],
    scoringRules: {
      baseCorrectPoints: 90,
      comboStep: 0.22,
      maxComboMultiplier: 2.4,
      wrongPenalty: 40,
      fastAnswerBonusMs: 1200,
      fastAnswerBonus: 30
    },
    timeLimit: 75,
    enabled: false
  },
  {
    id: 'memory-flip',
    title: 'Memory Flip',
    description: 'Flip and match cards from linked concepts.',
    contentType: ['hiragana', 'katakana', 'basic_words', 'kanji', 'mixed'],
    difficultyLevels: ['easy', 'normal', 'hard'],
    scoringRules: {
      baseCorrectPoints: 120,
      comboStep: 0.16,
      maxComboMultiplier: 1.8,
      wrongPenalty: 25,
      fastAnswerBonusMs: 2400,
      fastAnswerBonus: 15
    },
    timeLimit: 120,
    enabled: false
  }
];

export const playGameDefinitionMap = Object.fromEntries(
  playGameDefinitions.map((definition) => [definition.id, definition])
);
