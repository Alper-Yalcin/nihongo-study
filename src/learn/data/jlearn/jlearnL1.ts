import { JLearnLevel, VocabItem, GrammarPoint } from './jlearnTypes';

// ---------- Shared vocab (Level 1 canonical items) ----------

const v = {
  ojamaShimasu: {
    id: 'v-ojama-shimasu',
    japanese: 'おじゃまします',
    romaji: 'ojama shimasu',
    english: "Excuse my intrusion (entering someone's home)",
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  konbanwa: {
    id: 'v-konbanwa',
    japanese: 'こんばんは',
    romaji: 'konbanwa',
    english: 'Good evening',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  arigatouGozaimasu: {
    id: 'v-arigatou-gozaimasu',
    japanese: 'ありがとうございます',
    romaji: 'arigatou gozaimasu',
    english: 'Thank you (formal)',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  itadakimasu: {
    id: 'v-itadakimasu',
    japanese: 'いただきます',
    romaji: 'itadakimasu',
    english: 'Ritual phrase said before eating',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  gochisousamaDeshita: {
    id: 'v-gochisousama-deshita',
    japanese: 'ごちそうさまでした',
    romaji: 'gochisousama deshita',
    english: 'Thank you for the meal (after eating)',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  oyasuminasai: {
    id: 'v-oyasuminasai',
    japanese: 'おやすみなさい',
    romaji: 'oyasuminasai',
    english: 'Good night (formal)',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  oyasumi: {
    id: 'v-oyasumi',
    japanese: 'おやすみ',
    romaji: 'oyasumi',
    english: 'Good night (casual)',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  ohayouGozaimasu: {
    id: 'v-ohayou-gozaimasu',
    japanese: 'おはようございます',
    romaji: 'ohayou gozaimasu',
    english: 'Good morning (formal)',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  ohayou: {
    id: 'v-ohayou',
    japanese: 'おはよう',
    romaji: 'ohayou',
    english: 'Good morning (casual)',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  konnichiwa: {
    id: 'v-konnichiwa',
    japanese: 'こんにちは',
    romaji: 'konnichiwa',
    english: 'Hello / Good afternoon',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  sayounara: {
    id: 'v-sayounara',
    japanese: 'さようなら',
    romaji: 'sayounara',
    english: 'Goodbye (formal)',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  yoroshiku: {
    id: 'v-yoroshiku',
    japanese: 'よろしくおねがいします',
    romaji: 'yoroshiku onegai shimasu',
    english: 'Nice to meet you / Please take care of me',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  jaaNe: {
    id: 'v-jaa-ne',
    japanese: 'じゃあね',
    romaji: 'jaa ne',
    english: 'See you (casual)',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  mataNe: {
    id: 'v-mata-ne',
    japanese: 'またね',
    romaji: 'mata ne',
    english: 'See you later (casual)',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  mataAshita: {
    id: 'v-mata-ashita',
    japanese: 'またあした',
    romaji: 'mata ashita',
    english: 'See you tomorrow',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  sumimasen: {
    id: 'v-sumimasen',
    japanese: 'すみません',
    romaji: 'sumimasen',
    english: "Excuse me / I'm sorry (mild)",
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  gomennasai: {
    id: 'v-gomennasai',
    japanese: 'ごめんなさい',
    romaji: 'gomennasai',
    english: "I'm sorry (sincere)",
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  arigatou: {
    id: 'v-arigatou',
    japanese: 'ありがとう',
    romaji: 'arigatou',
    english: 'Thank you (casual)',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  douItashimashite: {
    id: 'v-dou-itashimashite',
    japanese: 'どういたしまして',
    romaji: 'dou itashimashite',
    english: "You're welcome",
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  }
} satisfies Record<string, VocabItem>;

// ---------- Grammar (embedded, plain-English) ----------

const g = {
  enteringHome: {
    id: 'g-entering-home',
    pattern: 'おじゃまします',
    explanation: "When you enter someone's home, say おじゃまします — it acknowledges you are stepping into their space.",
    structure: '[enter home] → おじゃまします',
    examples: ['おじゃまします。'],
    source: 'custom',
    jlptLevel: 'N5'
  },
  mealRituals: {
    id: 'g-meal-rituals',
    pattern: 'いただきます / ごちそうさまでした',
    explanation: 'Before eating say いただきます. After eating say ごちそうさまでした. They are performed, not translated.',
    structure: '[before meal] → いただきます ; [after meal] → ごちそうさまでした',
    examples: ['いただきます。', 'ごちそうさまでした。'],
    source: 'custom',
    jlptLevel: 'N5'
  },
  formalCasualFarewell: {
    id: 'g-formal-casual-farewell',
    pattern: 'おやすみ(なさい) / さようなら vs またね',
    explanation: 'Longer forms are formal (おやすみなさい・さようなら). Shorter forms are casual (おやすみ・またね).',
    structure: 'formal ← + なさい / ございます ; casual ← short form',
    examples: ['おやすみなさい。', 'またね！'],
    source: 'taekim',
    jlptLevel: 'N5'
  },
  morningGreeting: {
    id: 'g-morning-greeting',
    pattern: 'おはよう(ございます)',
    explanation: 'Use おはようございます with teachers and strangers. Use おはよう with close friends.',
    structure: 'formal → おはようございます ; casual → おはよう',
    examples: ['おはようございます。', 'おはよう！'],
    source: 'genki1',
    jlptLevel: 'N5'
  },
  thanksSorry: {
    id: 'g-thanks-sorry',
    pattern: 'すみません / ごめんなさい / ありがとう',
    explanation: 'すみません covers small accidents and getting attention. ごめんなさい is a sincere apology. ありがとう thanks (casual); ありがとうございます thanks (formal).',
    structure: '[small bump / call attention] → すみません ; [real apology] → ごめんなさい ; [thanks] → ありがとう(ございます)',
    examples: ['すみません！', 'ありがとう。', 'ごめんなさい。'],
    source: 'genki1',
    jlptLevel: 'N5'
  }
} satisfies Record<string, GrammarPoint>;

// ---------- LEVEL 1 ----------

export const jlearnLevel1: JLearnLevel = {
  id: 'JL1',
  title: 'Greetings',
  theme: 'First day in Japan — Tanaka family & first school morning',
  location: 'Tanaka family home + school gate',
  jlptAlignment: 'N5',
  genkiChapters: [1],
  checkpointUnitId: 'L1-U3',
  badge: {
    id: 'badge-social-starter',
    name: 'Social Starter',
    description: 'You can handle everyday social moments in Japan.'
  },
  storyHook: {
    type: 'cliffhanger',
    speaker: 'Mrs. Tanaka',
    teaser: 'Mrs. Tanaka puts a notebook on your desk. First real school day starts tomorrow.',
    japanese: 'あした、がっこうで がんばって！',
    translation: 'Tomorrow, do your best at school!'
  },
  units: [
    // ---------------- UNIT 1-1 ----------------
    {
      id: 'L1-U1',
      title: 'First Contact — Arrival Night',
      summary: "You arrive at the Tanaka house late. First words, first meal, first night in Japan.",
      steps: [
        // ---- Mission 1: Enter the house ----
        {
          id: 'L1-U1-M1',
          title: 'Enter the house',
          kind: 'introduce',
          estimatedMinutes: 1,
          difficulty: {
            level: 1,
            inputSupport: 'full',
            outputMode: 'recognition',
            timePressure: 'none'
          },
          adaptiveTags: ['arrival', 'home-entry', 'politeness', 'ritual-phrase'],
          unlockRules: [{ type: 'previous-mission-complete' }],
          srsTargets: [
            { targetType: 'vocab', targetId: v.ojamaShimasu.id, skills: ['meaning', 'production', 'listening'], weight: 1 },
            { targetType: 'vocab', targetId: v.konbanwa.id, skills: ['meaning', 'recognition'], weight: 0.6 },
            { targetType: 'grammar', targetId: g.enteringHome.id, skills: ['meaning', 'production'], weight: 1 }
          ],
          scenario: 'Mrs. Tanaka opens the door: 「いらっしゃい！」You step inside a Japanese home for the first time.',
          goal: 'Respond politely when entering a Japanese home.',
          vocabulary: [v.ojamaShimasu, v.konbanwa, v.arigatouGozaimasu],
          grammar: [g.enteringHome],
          examples: [
            {
              id: 'ex-L1-U1-M1-1',
              japanese: 'こんばんは。',
              romaji: 'Konbanwa.',
              english: 'Good evening.',
              vocabIds: [v.konbanwa.id],
              grammarIds: []
            },
            {
              id: 'ex-L1-U1-M1-2',
              japanese: 'おじゃまします。',
              romaji: 'Ojama shimasu.',
              english: "Excuse my intrusion (entering home).",
              vocabIds: [v.ojamaShimasu.id],
              grammarIds: [g.enteringHome.id]
            },
            {
              id: 'ex-L1-U1-M1-3',
              japanese: 'ありがとうございます。',
              romaji: 'Arigatou gozaimasu.',
              english: 'Thank you (formal).',
              vocabIds: [v.arigatouGozaimasu.id],
              grammarIds: []
            }
          ],
          tasks: [
            {
              id: 'task-L1-U1-M1-context',
              type: 'context-choice',
              prompt: 'You step into a Japanese home. Pick the expected phrase.',
              options: [v.konbanwa.japanese, v.ojamaShimasu.japanese, v.sayounara.japanese],
              answer: v.ojamaShimasu.japanese,
              targetIds: [v.ojamaShimasu.id, g.enteringHome.id],
              feedback: {
                correct: 'Good. That phrase belongs to entering a home.',
                incorrect: 'This is a home-entry ritual, not a generic greeting.'
              }
            },
            {
              id: 'task-L1-U1-M1-build',
              type: 'sentence-building',
              prompt: 'Build the home-entry phrase.',
              options: ['ojama', 'shimasu', 'konbanwa'],
              answer: ['ojama', 'shimasu'],
              targetIds: [v.ojamaShimasu.id],
              feedback: {
                correct: 'Clean entry phrase.',
                incorrect: 'Keep the two chunks together: ojama + shimasu.'
              }
            }
          ],
          branchingChoice: {
            prompt: 'You step through the doorway. What do you say?',
            options: [
              { id: 'a', label: '(Stay silent)', outcome: 'wrong', reaction: 'Mrs. Tanaka pauses and waits patiently.' },
              { id: 'b', label: 'こんばんは', outcome: 'partial', reaction: 'She smiles, but lingers — you greeted her, but missed the cultural phrase.', explanation: 'When entering a Japanese home, おじゃまします is the expected ritual phrase.' },
              { id: 'c', label: 'おじゃまします', outcome: 'correct', reaction: 'Mrs. Tanaka beams: 「どうぞ、あがってください！」' }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L1-U1-M1-door',
              turns: [
                {
                  speaker: 'Mrs. Tanaka',
                  line: {
                    0: 'こんばんは！',
                    2: 'こんばんは、おかえり！'
                  },
                  translation: 'Good evening!',
                  isLearnerTurn: false
                },
                { speaker: 'You', expectedAnswer: 'こんばんは！', acceptedAnswers: ['こんばんは', 'おじゃまします', 'こんばんは。おじゃまします。'], isLearnerTurn: true },
                {
                  speaker: 'Mrs. Tanaka',
                  line: {
                    0: 'どうぞ、あがってください！',
                    2: 'どうぞ、あがってあがって！'
                  },
                  translation: 'Please, come in!',
                  isLearnerTurn: false
                },
                { speaker: 'You', expectedAnswer: 'ありがとうございます。', acceptedAnswers: ['ありがとうございます', 'ありがとう'], isLearnerTurn: true }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L1-U1-M1-1',
              type: 'sentence-build',
              prompt: 'Build the phrase you say when entering a Japanese home.',
              correctAnswer: 'おじゃま します',
              targetVocabId: v.ojamaShimasu.id
            },
            {
              id: 'q-L1-U1-M1-2',
              type: 'multiple-choice',
              prompt: 'Which phrase means "Good evening"?',
              options: ['おはようございます', 'こんにちは', 'こんばんは', 'おやすみなさい'],
              correctAnswer: 'こんばんは',
              targetVocabId: v.konbanwa.id
            },
            {
              id: 'q-L1-U1-M1-3',
              type: 'translation-en-jp',
              prompt: 'Translate: "Thank you (formal)."',
              correctAnswer: 'ありがとうございます',
              targetVocabId: v.arigatouGozaimasu.id
            },
            {
              id: 'q-L1-U1-M1-4',
              type: 'context-select',
              prompt: "Mrs. Tanaka opens her front door for you. You step in. What do you say?",
              options: ['こんにちは', 'おじゃまします', 'さようなら'],
              correctAnswer: 'おじゃまします'
            },
            {
              id: 'q-L1-U1-M1-5',
              type: 'dialogue-complete',
              prompt: 'Mrs. Tanaka: どうぞ、あがってください！ → You: ___',
              correctAnswer: 'ありがとうございます',
              acceptedAnswers: ['ありがとうございます。', 'ありがとう']
            }
          ],
          successMessage: 'You can enter a Japanese home politely.',
          emotionalFeedback: {
            perfect: 'Mrs. Tanaka beams — you already sound like part of the family.',
            good: 'Mrs. Tanaka looks relieved — you handled your first moment in Japan.',
            struggle: 'Mrs. Tanaka smiles gently — day one, and you got through the door.'
          }
        },
        // ---- Mission 2: Dinner time ----
        {
          id: 'L1-U1-M2',
          title: 'Dinner time',
          kind: 'expand',
          estimatedMinutes: 1,
          difficulty: {
            level: 2,
            inputSupport: 'reduced',
            outputMode: 'guided-production',
            timePressure: 'none'
          },
          adaptiveTags: ['meal-ritual', 'politeness', 'before-after'],
          unlockRules: [{ type: 'previous-mission-complete', targetId: 'L1-U1-M1' }],
          srsTargets: [
            { targetType: 'vocab', targetId: v.itadakimasu.id, skills: ['meaning', 'production', 'listening'], weight: 1 },
            { targetType: 'vocab', targetId: v.gochisousamaDeshita.id, skills: ['meaning', 'production'], weight: 1 },
            { targetType: 'grammar', targetId: g.mealRituals.id, skills: ['meaning', 'production'], weight: 1 }
          ],
          scenario: "You sit at the table. Mr. Tanaka puts his hands together: 「いただきます。」Everyone follows. You freeze.",
          goal: 'Respond correctly before and after the meal.',
          vocabulary: [v.itadakimasu, v.gochisousamaDeshita],
          grammar: [g.mealRituals],
          examples: [
            {
              id: 'ex-L1-U1-M2-1',
              japanese: 'いただきます。',
              romaji: 'Itadakimasu.',
              english: '(Before eating.)',
              vocabIds: [v.itadakimasu.id],
              grammarIds: [g.mealRituals.id]
            },
            {
              id: 'ex-L1-U1-M2-2',
              japanese: 'ごちそうさまでした。',
              romaji: 'Gochisousama deshita.',
              english: 'Thank you for the meal.',
              vocabIds: [v.gochisousamaDeshita.id],
              grammarIds: [g.mealRituals.id]
            }
          ],
          tasks: [
            {
              id: 'task-L1-U1-M2-listen-before',
              type: 'listening-response',
              prompt: 'Listen before the meal and choose the phrase.',
              promptJapanese: v.itadakimasu.japanese,
              options: [v.itadakimasu.japanese, v.gochisousamaDeshita.japanese],
              answer: v.itadakimasu.japanese,
              targetIds: [v.itadakimasu.id, g.mealRituals.id],
              feedback: {
                correct: 'Before eating: itadakimasu.',
                incorrect: 'Before eating uses itadakimasu; after eating uses gochisousama deshita.'
              }
            },
            {
              id: 'task-L1-U1-M2-context-after',
              type: 'context-choice',
              prompt: 'You just finished dinner. What do you say?',
              options: [v.itadakimasu.japanese, v.gochisousamaDeshita.japanese, v.ojamaShimasu.japanese],
              answer: v.gochisousamaDeshita.japanese,
              targetIds: [v.gochisousamaDeshita.id, g.mealRituals.id],
              feedback: {
                correct: 'After eating: gochisousama deshita.',
                incorrect: 'Use the after-meal phrase here.'
              }
            }
          ],
          branchingChoice: {
            prompt: 'Before eating — what do you say?',
            options: [
              { id: 'a', label: '(Say nothing)', outcome: 'wrong', reaction: 'The family glances at each other. Mrs. Tanaka gently models it: 「いただきます…」' },
              { id: 'b', label: 'ありがとうございます', outcome: 'partial', reaction: 'Mrs. Tanaka nods politely — but ありがとう is for gifts. いただきます is for meals.', explanation: 'いただきます is the specific ritual phrase said before eating.' },
              { id: 'c', label: 'いただきます', outcome: 'correct', reaction: 'Everyone smiles. Mr. Tanaka nods. The meal begins.' }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L1-U1-M2-meal',
              turns: [
                { speaker: 'Mr. Tanaka', line: 'いただきます！', isLearnerTurn: false },
                { speaker: 'You', expectedAnswer: 'いただきます', acceptedAnswers: ['いただきます！', 'いただきます。'], isLearnerTurn: true },
                { speaker: 'Mrs. Tanaka', line: 'ごちそうさまでした！', translation: '(After the meal.)', isLearnerTurn: false },
                { speaker: 'You', expectedAnswer: 'ごちそうさまでした', acceptedAnswers: ['ごちそうさまでした。', 'ごちそうさま'], isLearnerTurn: true }
              ]
            }
          ],
          questions: [
            { id: 'q-L1-U1-M2-1', type: 'sentence-build', prompt: 'Build the phrase said before eating.', correctAnswer: 'いただき ます' },
            { id: 'q-L1-U1-M2-2', type: 'sentence-build', prompt: 'Build the phrase said after a meal.', correctAnswer: 'ごちそうさま でした' },
            { id: 'q-L1-U1-M2-3', type: 'translation-jp-en', prompt: 'What does いただきます mean?', options: ['Good evening', 'Thank you for the meal', 'Ritual phrase said before eating', 'Excuse my intrusion'], correctAnswer: 'Ritual phrase said before eating' },
            { id: 'q-L1-U1-M2-4', type: 'context-select', prompt: 'You just finished dinner. What do you say?', options: ['いただきます', 'ごちそうさまでした', 'おじゃまします'], correctAnswer: 'ごちそうさまでした' },
            { id: 'q-L1-U1-M2-5', type: 'dialogue-complete', prompt: 'Mr. Tanaka: いただきます！ → You: ___', correctAnswer: 'いただきます' }
          ],
          successMessage: 'You understand Japanese meal rituals.',
          emotionalFeedback: {
            perfect: 'Mrs. Tanaka refills your tea without asking. You belong at this table.',
            good: 'You feel like part of the family.',
            struggle: 'The food is warm. You got there, and the Tanakas noticed.'
          }
        },
        // ---- Mission 3: Saying goodnight ----
        {
          id: 'L1-U1-M3',
          title: 'Saying goodnight',
          kind: 'review',
          estimatedMinutes: 1,
          difficulty: {
            level: 2,
            inputSupport: 'reduced',
            outputMode: 'mixed',
            timePressure: 'none'
          },
          adaptiveTags: ['farewell', 'formality', 'host-family'],
          unlockRules: [{ type: 'previous-mission-complete', targetId: 'L1-U1-M2' }],
          srsTargets: [
            { targetType: 'vocab', targetId: v.oyasuminasai.id, skills: ['meaning', 'production', 'listening'], weight: 1 },
            { targetType: 'vocab', targetId: v.oyasumi.id, skills: ['meaning', 'recognition'], weight: 0.7 },
            { targetType: 'grammar', targetId: g.formalCasualFarewell.id, skills: ['meaning', 'production'], weight: 1 }
          ],
          scenario: "It's late. Mrs. Tanaka walks you to your room: 「おやすみなさい。」",
          goal: 'Match formality to the situation and say goodnight.',
          vocabulary: [v.oyasuminasai, v.oyasumi],
          grammar: [g.formalCasualFarewell],
          examples: [
            { id: 'ex-L1-U1-M3-1', japanese: 'おやすみなさい。', romaji: 'Oyasuminasai.', english: 'Good night (formal).', vocabIds: [v.oyasuminasai.id], grammarIds: [g.formalCasualFarewell.id] },
            { id: 'ex-L1-U1-M3-2', japanese: 'おやすみ。', romaji: 'Oyasumi.', english: 'Night (casual).', vocabIds: [v.oyasumi.id], grammarIds: [g.formalCasualFarewell.id] }
          ],
          tasks: [
            {
              id: 'task-L1-U1-M3-formal-choice',
              type: 'context-choice',
              prompt: 'Say goodnight to your host mother.',
              options: [v.oyasumi.japanese, v.oyasuminasai.japanese, v.konbanwa.japanese],
              answer: v.oyasuminasai.japanese,
              targetIds: [v.oyasuminasai.id, g.formalCasualFarewell.id],
              feedback: {
                correct: 'Formal goodnight fits the host-family context.',
                incorrect: 'Use the longer formal form with your host mother.'
              }
            },
            {
              id: 'task-L1-U1-M3-casual-choice',
              type: 'context-choice',
              prompt: 'Say goodnight to a close friend.',
              options: [v.oyasumi.japanese, v.oyasuminasai.japanese, v.sayounara.japanese],
              answer: v.oyasumi.japanese,
              targetIds: [v.oyasumi.id, g.formalCasualFarewell.id],
              feedback: {
                correct: 'Short form fits a close friend.',
                incorrect: 'Close friends can use the shorter casual form.'
              }
            }
          ],
          branchingChoice: {
            prompt: 'Mrs. Tanaka says おやすみなさい — what do you reply with?',
            options: [
              { id: 'a', label: 'こんばんは', outcome: 'wrong', reaction: 'Mrs. Tanaka blinks — that is a greeting, not a farewell.' },
              { id: 'b', label: 'おやすみ', outcome: 'partial', reaction: 'She smiles warmly but adds: 「おやすみなさい、ね。」', explanation: 'おやすみ is casual — reserve it for close friends.' },
              { id: 'c', label: 'おやすみなさい', outcome: 'correct', reaction: 'Mrs. Tanaka smiles gently and turns off the light.' }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L1-U1-M3-night',
              turns: [
                {
                  speaker: 'Mrs. Tanaka',
                  line: {
                    0: 'おやすみなさい。ゆっくりやすんでね。',
                    2: 'おやすみ。ゆっくりやすんでね。'
                  },
                  translation: 'Good night. Rest well.',
                  isLearnerTurn: false
                },
                { speaker: 'You', expectedAnswer: 'おやすみなさい', acceptedAnswers: ['おやすみなさい。'], isLearnerTurn: true }
              ]
            }
          ],
          questions: [
            { id: 'q-L1-U1-M3-1', type: 'multiple-choice', prompt: 'Which is the formal goodnight?', options: ['おやすみ', 'おやすみなさい', 'こんばんは', 'さようなら'], correctAnswer: 'おやすみなさい' },
            { id: 'q-L1-U1-M3-2', type: 'context-select', prompt: 'Saying goodnight to your host mother. What do you use?', options: ['おやすみ', 'おやすみなさい', 'さようなら'], correctAnswer: 'おやすみなさい' },
            { id: 'q-L1-U1-M3-3', type: 'context-select', prompt: 'Saying goodnight to a close friend. What fits?', options: ['おやすみなさい', 'おやすみ', 'ありがとうございます'], correctAnswer: 'おやすみ' },
            { id: 'q-L1-U1-M3-4', type: 'translation-jp-en', prompt: 'What does おやすみなさい mean?', options: ['Good morning', 'Good night (formal)', 'Thank you'], correctAnswer: 'Good night (formal)' },
            { id: 'q-L1-U1-M3-5', type: 'dialogue-complete', prompt: 'Mrs. Tanaka: おやすみなさい。→ You: ___', correctAnswer: 'おやすみなさい' }
          ],
          successMessage: 'You can end the day politely in Japanese.',
          emotionalFeedback: {
            perfect: 'You close your eyes. Day one — nailed.',
            good: 'You close your eyes. Day one in Japan — done.',
            struggle: 'The room is quiet. You made it. Sleep now.'
          }
        }
      ]
    },

    // ---------------- UNIT 1-2 ----------------
    {
      id: 'L1-U2',
      title: 'First Morning — School',
      summary: 'Breakfast, walk to school, meet your teacher, and spot a girl waving. Real school life begins.',
      prerequisiteUnitIds: ['L1-U1'],
      steps: [
        // ---- Mission 4: Greeting your teacher ----
        {
          id: 'L1-U2-M4',
          title: 'Greeting your teacher',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: 'Tanaka-sensei spots you at the school gate: 「おはようございます。」',
          goal: 'Use the right morning greeting for a formal situation.',
          vocabulary: [v.ohayouGozaimasu, v.ohayou],
          grammar: [g.morningGreeting],
          examples: [
            { id: 'ex-L1-U2-M4-1', japanese: 'おはようございます。', romaji: 'Ohayou gozaimasu.', english: 'Good morning (formal).', vocabIds: [v.ohayouGozaimasu.id], grammarIds: [g.morningGreeting.id] },
            { id: 'ex-L1-U2-M4-2', japanese: 'きょうもがんばりましょう。', romaji: 'Kyou mo ganbarimashou.', english: "Let's do our best today!", vocabIds: [], grammarIds: [] }
          ],
          branchingChoice: {
            prompt: "It's 8 AM. Tanaka-sensei sees you. What do you say?",
            options: [
              { id: 'a', label: 'こんにちは', outcome: 'wrong', reaction: 'Tanaka-sensei raises an eyebrow — こんにちは is for afternoon.' },
              { id: 'b', label: 'おはよう', outcome: 'partial', reaction: 'Tanaka-sensei nods neutrally — a little too casual for a teacher.', explanation: 'With teachers, use the full おはようございます.' },
              { id: 'c', label: 'おはようございます', outcome: 'correct', reaction: 'Tanaka-sensei gives a firm approving nod.' }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L1-U2-M4-gate',
              turns: [
                { speaker: 'Tanaka-sensei', line: 'おはようございます！', isLearnerTurn: false },
                { speaker: 'You', expectedAnswer: 'おはようございます', acceptedAnswers: ['おはようございます！', 'おはようございます。'], isLearnerTurn: true },
                { speaker: 'Tanaka-sensei', line: 'きょうもがんばりましょう。', translation: "Let's do our best today.", isLearnerTurn: false },
                { speaker: 'You', expectedAnswer: 'はい！よろしくおねがいします', acceptedAnswers: ['はい、よろしくおねがいします', 'よろしくおねがいします'], isLearnerTurn: true }
              ]
            }
          ],
          questions: [
            { id: 'q-L1-U2-M4-1', type: 'sentence-build', prompt: 'Build the formal morning greeting.', correctAnswer: 'おはよう ございます' },
            { id: 'q-L1-U2-M4-2', type: 'context-select', prompt: 'You greet your teacher at 8 AM.', options: ['おはよう', 'おはようございます', 'こんにちは'], correctAnswer: 'おはようございます' },
            { id: 'q-L1-U2-M4-3', type: 'context-select', prompt: 'You greet a close friend at 8 AM.', options: ['おはよう', 'おはようございます', 'さようなら'], correctAnswer: 'おはよう' },
            { id: 'q-L1-U2-M4-4', type: 'translation-en-jp', prompt: 'Translate: "Good morning (formal)."', correctAnswer: 'おはようございます' },
            { id: 'q-L1-U2-M4-5', type: 'dialogue-complete', prompt: 'Tanaka-sensei: きょうもがんばりましょう。→ You: ___', correctAnswer: 'はい！よろしくおねがいします', acceptedAnswers: ['よろしくおねがいします', 'はい、よろしくおねがいします'] }
          ],
          successMessage: 'You can greet a teacher correctly in Japanese.',
          emotionalFeedback: {
            perfect: 'Tanaka-sensei gives the firmest nod of approval. You nailed it.',
            good: 'Tanaka-sensei nods with approval. First impression: good.',
            struggle: 'A quiet nod. That counts as a pass from her.'
          }
        },
        // ---- Mission 5: Meet Yuki ----
        {
          id: 'L1-U2-M5',
          title: 'Meet Yuki',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: 'A girl runs up before class: 「おはよう！」She smiles like she has known you forever. This is Yuki.',
          goal: 'Match the energy of a friendly peer with casual speech.',
          vocabulary: [v.konnichiwa, v.sayounara, v.yoroshiku],
          grammar: [g.morningGreeting],
          examples: [
            { id: 'ex-L1-U2-M5-1', japanese: 'おはよう！', romaji: 'Ohayou!', english: 'Morning! (casual)', vocabIds: [v.ohayou.id], grammarIds: [g.morningGreeting.id] },
            { id: 'ex-L1-U2-M5-2', japanese: 'よろしくおねがいします。', romaji: 'Yoroshiku onegai shimasu.', english: 'Please take care of me / Nice to meet you.', vocabIds: [v.yoroshiku.id], grammarIds: [] }
          ],
          branchingChoice: {
            prompt: 'Yuki just said おはよう！with a huge smile. How do you reply?',
            options: [
              { id: 'a', label: 'おはようございます', outcome: 'partial', reaction: 'Yuki tilts her head and laughs: 「まじめだね〜！」(So formal!)', explanation: 'With a new friend, おはよう matches her energy.' },
              { id: 'b', label: 'おはよう', outcome: 'correct', reaction: "Yuki's face lights up." },
              { id: 'c', label: 'さようなら', outcome: 'wrong', reaction: 'Yuki blinks, confused. That is goodbye, not hello.' }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L1-U2-M5-yuki',
              turns: [
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'おはよう！',
                    2: 'おはよ！'
                  },
                  isLearnerTurn: false
                },
                { speaker: 'You', expectedAnswer: 'おはよう', acceptedAnswers: ['おはよう！'], isLearnerTurn: true },
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'きょう、たのしみだね！',
                    2: 'きょう、めっちゃたのしみ！'
                  },
                  translation: "I'm excited for today!",
                  isLearnerTurn: false
                },
                { speaker: 'You', expectedAnswer: 'うん！', acceptedAnswers: ['うん', 'はい！'], isLearnerTurn: true },
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'よろしくね！',
                    2: 'よろしくー！'
                  },
                  isLearnerTurn: false
                },
                { speaker: 'You', expectedAnswer: 'よろしくおねがいします', acceptedAnswers: ['よろしく！', 'よろしくおねがいします。'], isLearnerTurn: true }
              ]
            }
          ],
          questions: [
            { id: 'q-L1-U2-M5-1', type: 'sentence-build', prompt: 'Build the polite "nice to meet you" phrase.', correctAnswer: 'よろしく おねがいします' },
            { id: 'q-L1-U2-M5-2', type: 'context-select', prompt: 'Yuki, your new friend, says おはよう！ Your best reply:', options: ['おはようございます', 'おはよう', 'さようなら'], correctAnswer: 'おはよう' },
            { id: 'q-L1-U2-M5-3', type: 'translation-jp-en', prompt: 'What does こんにちは mean?', options: ['Good morning', 'Hello / Good afternoon', 'Good night'], correctAnswer: 'Hello / Good afternoon' },
            { id: 'q-L1-U2-M5-4', type: 'translation-en-jp', prompt: 'Translate: "Goodbye (formal)."', correctAnswer: 'さようなら' },
            { id: 'q-L1-U2-M5-5', type: 'dialogue-complete', prompt: 'Yuki: よろしくね！→ You: ___', correctAnswer: 'よろしくおねがいします', acceptedAnswers: ['よろしく', 'よろしく！'] }
          ],
          successMessage: 'You can adjust your tone between formal and casual — and make a friend.',
          emotionalFeedback: {
            perfect: "Yuki grabs your arm excitedly — you've made your first friend in Japan.",
            good: 'Yuki laughs warmly. You clicked.',
            struggle: "Yuki shrugs, laughs: we'll figure you out. She still thinks you're cool."
          }
        }
      ]
    },

    // ---------------- UNIT 1-3 ----------------
    {
      id: 'L1-U3',
      title: 'Social Survival',
      summary: 'Goodbyes, thanks, apologies — survive the rest of the day, then prove it all in the checkpoint.',
      prerequisiteUnitIds: ['L1-U2'],
      steps: [
        // ---- Mission 6: Saying goodbye after school ----
        {
          id: 'L1-U3-M6',
          title: 'Saying goodbye after school',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: 'The bell rings. You say goodbye to Tanaka-sensei at the gate — then turn to Yuki.',
          goal: 'Pick the right farewell for each relationship.',
          vocabulary: [v.sayounara, v.jaaNe, v.mataNe, v.mataAshita],
          grammar: [g.formalCasualFarewell],
          examples: [
            { id: 'ex-L1-U3-M6-1', japanese: 'さようなら！', romaji: 'Sayounara!', english: 'Goodbye (formal).', vocabIds: [v.sayounara.id], grammarIds: [g.formalCasualFarewell.id] },
            { id: 'ex-L1-U3-M6-2', japanese: 'またね！', romaji: 'Mata ne!', english: 'See you!', vocabIds: [v.mataNe.id], grammarIds: [] },
            { id: 'ex-L1-U3-M6-3', japanese: 'またあした！', romaji: 'Mata ashita!', english: 'See you tomorrow!', vocabIds: [v.mataAshita.id], grammarIds: [] }
          ],
          branchingChoice: {
            prompt: 'You say goodbye to Tanaka-sensei at the gate.',
            options: [
              { id: 'a', label: 'またね！', outcome: 'partial', reaction: 'Tanaka-sensei pauses — too casual for a teacher.', explanation: 'Teachers get さようなら, not またね.' },
              { id: 'b', label: 'じゃあね！', outcome: 'partial', reaction: 'Same — too casual for a teacher.' },
              { id: 'c', label: 'さようなら！', outcome: 'correct', reaction: 'Tanaka-sensei gives a firm nod.' }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L1-U3-M6-sensei',
              turns: [
                { speaker: 'Tanaka-sensei', line: 'さようなら！またあした！', isLearnerTurn: false },
                { speaker: 'You', expectedAnswer: 'さようなら', acceptedAnswers: ['さようなら！', 'さようなら。'], isLearnerTurn: true }
              ]
            },
            {
              id: 'dlg-L1-U3-M6-yuki',
              turns: [
                { speaker: 'Yuki', line: 'じゃあね！またね！', isLearnerTurn: false },
                { speaker: 'You', expectedAnswer: 'またね', acceptedAnswers: ['じゃあね', 'じゃあね！', 'またあした', 'またね！'], isLearnerTurn: true }
              ]
            }
          ],
          questions: [
            { id: 'q-L1-U3-M6-1', type: 'multiple-choice', prompt: 'Which is the formal goodbye?', options: ['じゃあね', 'またね', 'さようなら', 'おやすみ'], correctAnswer: 'さようなら' },
            { id: 'q-L1-U3-M6-2', type: 'context-select', prompt: 'Saying goodbye to Yuki. What fits?', options: ['さようなら', 'またね', 'おじゃまします'], correctAnswer: 'またね' },
            { id: 'q-L1-U3-M6-3', type: 'translation-en-jp', prompt: 'Translate: "See you tomorrow."', correctAnswer: 'またあした' },
            { id: 'q-L1-U3-M6-4', type: 'translation-jp-en', prompt: 'What does じゃあね mean?', options: ['Good night', 'See you (casual)', 'Thank you'], correctAnswer: 'See you (casual)' },
            { id: 'q-L1-U3-M6-5', type: 'dialogue-complete', prompt: 'Yuki: じゃあね！→ You: ___', correctAnswer: 'またね', acceptedAnswers: ['じゃあね', 'またあした', 'じゃあね！'] }
          ],
          successMessage: 'You understand formal vs. casual farewells in Japanese.',
          emotionalFeedback: {
            perfect: 'You wave at Yuki as she runs off. Two perfect goodbyes, two very different people.',
            good: 'You handled both — teacher and friend — without missing a beat.',
            struggle: 'You got there. Yuki is already waving back.'
          }
        },
        // ---- Mission 7: Thank & apologize ----
        {
          id: 'L1-U3-M7',
          title: 'Thank & apologize',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: 'You bump into a stranger. Then Yuki lends you an eraser. Two micro-scenes, back to back.',
          goal: 'Use すみません and ありがとう correctly in context.',
          vocabulary: [v.sumimasen, v.gomennasai, v.arigatou, v.douItashimashite],
          grammar: [g.thanksSorry],
          examples: [
            { id: 'ex-L1-U3-M7-1', japanese: 'すみません！', romaji: 'Sumimasen!', english: 'Excuse me / Sorry!', vocabIds: [v.sumimasen.id], grammarIds: [g.thanksSorry.id] },
            { id: 'ex-L1-U3-M7-2', japanese: 'ありがとう。', romaji: 'Arigatou.', english: 'Thanks.', vocabIds: [v.arigatou.id], grammarIds: [g.thanksSorry.id] },
            { id: 'ex-L1-U3-M7-3', japanese: 'どういたしまして。', romaji: 'Dou itashimashite.', english: "You're welcome.", vocabIds: [v.douItashimashite.id], grammarIds: [] }
          ],
          branchingChoice: {
            prompt: 'You bump into a stranger in the hallway. What do you say?',
            options: [
              { id: 'a', label: 'ありがとう', outcome: 'wrong', reaction: 'The stranger stares. You just thanked them for the bump.' },
              { id: 'b', label: 'すみません', outcome: 'correct', reaction: 'The stranger accepts the apology and walks on.' },
              { id: 'c', label: 'おはようございます', outcome: 'wrong', reaction: "It's afternoon — and that's a greeting, not an apology." }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L1-U3-M7-stranger',
              turns: [
                { speaker: 'Stranger', line: 'あっ！', isLearnerTurn: false },
                { speaker: 'You', expectedAnswer: 'すみません', acceptedAnswers: ['すみません！', 'ごめんなさい'], isLearnerTurn: true },
                { speaker: 'Stranger', line: 'だいじょうぶですよ。', translation: "It's okay.", isLearnerTurn: false },
                { speaker: 'You', expectedAnswer: 'ありがとうございます', acceptedAnswers: ['ありがとう', 'ありがとうございます。'], isLearnerTurn: true }
              ]
            },
            {
              id: 'dlg-L1-U3-M7-yuki',
              turns: [
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'はい、どうぞ！',
                    2: 'はい、どうぞー！'
                  },
                  translation: '(hands you an eraser)',
                  isLearnerTurn: false
                },
                { speaker: 'You', expectedAnswer: 'ありがとう', acceptedAnswers: ['ありがとう！', 'ありがとうございます'], isLearnerTurn: true },
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'どういたしまして！',
                    2: 'いいよいいよ！'
                  },
                  isLearnerTurn: false
                }
              ]
            }
          ],
          questions: [
            { id: 'q-L1-U3-M7-1', type: 'context-select', prompt: "You bumped into someone.", options: ['ありがとう', 'すみません', 'おはよう'], correctAnswer: 'すみません' },
            { id: 'q-L1-U3-M7-2', type: 'context-select', prompt: 'A friend hands you an eraser. Casual thanks:', options: ['ありがとうございます', 'ありがとう', 'ごめんなさい'], correctAnswer: 'ありがとう' },
            { id: 'q-L1-U3-M7-3', type: 'translation-jp-en', prompt: 'What does ごめんなさい mean?', options: ['Thank you', "I'm sorry (sincere)", "You're welcome"], correctAnswer: "I'm sorry (sincere)" },
            { id: 'q-L1-U3-M7-4', type: 'translation-en-jp', prompt: 'Translate: "You\'re welcome."', correctAnswer: 'どういたしまして' },
            { id: 'q-L1-U3-M7-5', type: 'fill-in-blank', prompt: 'Complete: "___ ！" (Excuse me / Sorry — mild)', correctAnswer: 'すみません' },
            { id: 'q-L1-U3-M7-6', type: 'dialogue-complete', prompt: 'Stranger: だいじょうぶですよ。→ You: ___', correctAnswer: 'ありがとうございます', acceptedAnswers: ['ありがとう', 'ありがとうございます。'] }
          ],
          successMessage: 'You can handle real social situations — apologies and thanks — in Japanese.',
          emotionalFeedback: {
            perfect: 'Two clean recoveries. No one else even noticed anything happened.',
            good: "The stranger walks away without a scene. Yuki smiles. You're getting this.",
            struggle: 'You got through both moments. It was bumpy — and real.'
          }
        },
        // ---- Mission 8: Final Day Checkpoint ----
        {
          id: 'L1-U3-M8',
          title: 'Final Day Checkpoint',
          kind: 'checkpoint',
          isCheckpoint: true,
          minPassScore: 80,
          estimatedMinutes: 2,
          scenario: 'One full day in Japan — start to finish. No hints. No vocab panel. Just you.',
          goal: 'Prove you can handle every Level 1 situation.',
          vocabulary: [],
          grammar: [],
          examples: [],
          questions: [
            { id: 'q-L1-U3-M8-1', type: 'context-select', prompt: 'Stepping into Mrs. Tanaka\'s home.', options: ['こんばんは', 'おじゃまします', 'さようなら'], correctAnswer: 'おじゃまします' },
            { id: 'q-L1-U3-M8-2', type: 'context-select', prompt: 'Sitting down to dinner.', options: ['ごちそうさまでした', 'いただきます', 'ありがとう'], correctAnswer: 'いただきます' },
            { id: 'q-L1-U3-M8-3', type: 'context-select', prompt: 'Saying goodbye to Tanaka-sensei.', options: ['またね', 'じゃあね', 'さようなら'], correctAnswer: 'さようなら' },
            { id: 'q-L1-U3-M8-4', type: 'context-select', prompt: "It's 8 AM. Greeting your teacher.", options: ['こんにちは', 'おはようございます', 'こんばんは'], correctAnswer: 'おはようございます' },
            { id: 'q-L1-U3-M8-5', type: 'context-select', prompt: "It's 9 PM. Greeting Mrs. Tanaka.", options: ['おはようございます', 'こんにちは', 'こんばんは'], correctAnswer: 'こんばんは' },
            { id: 'q-L1-U3-M8-6', type: 'context-select', prompt: 'Winding down for bed, formal.', options: ['おやすみ', 'おやすみなさい', 'さようなら'], correctAnswer: 'おやすみなさい' },
            { id: 'q-L1-U3-M8-7', type: 'dialogue-complete', prompt: 'Tanaka-sensei: きょうもがんばりましょう。→ You: ___', correctAnswer: 'はい！よろしくおねがいします', acceptedAnswers: ['よろしくおねがいします', 'はい、よろしくおねがいします'] },
            { id: 'q-L1-U3-M8-8', type: 'dialogue-complete', prompt: 'Yuki: よろしくね！→ You: ___', correctAnswer: 'よろしくおねがいします', acceptedAnswers: ['よろしく', 'よろしく！'] },
            { id: 'q-L1-U3-M8-9', type: 'sentence-build', prompt: 'Build: "Thank you for the meal."', correctAnswer: 'ごちそうさま でした' },
            { id: 'q-L1-U3-M8-10', type: 'sentence-build', prompt: 'Build: "Excuse my intrusion."', correctAnswer: 'おじゃま します' },
            { id: 'q-L1-U3-M8-11', type: 'translation-en-jp', prompt: 'Translate: "Thank you (formal)."', correctAnswer: 'ありがとうございます' },
            { id: 'q-L1-U3-M8-12', type: 'translation-jp-en', prompt: 'What does いただきます mean?', options: ['Thank you for the meal', 'Ritual phrase said before eating', 'Goodnight'], correctAnswer: 'Ritual phrase said before eating' }
          ],
          dialogueChains: [
            {
              id: 'dlg-L1-U3-M8-dinner',
              title: 'Dinner with Mrs. Tanaka',
              turns: [
                {
                  speaker: 'Mrs. Tanaka',
                  line: {
                    0: 'いただきます！',
                    2: 'いただきます、さあ食べよ！'
                  },
                  isLearnerTurn: false
                },
                { speaker: 'You', expectedAnswer: 'いただきます', acceptedAnswers: ['いただきます！'], isLearnerTurn: true },
                {
                  speaker: 'Mrs. Tanaka',
                  line: {
                    0: 'ごちそうさまでした。',
                    2: 'ごちそうさま。'
                  },
                  isLearnerTurn: false
                },
                { speaker: 'You', expectedAnswer: 'ごちそうさまでした', acceptedAnswers: ['ごちそうさま'], isLearnerTurn: true },
                {
                  speaker: 'Mrs. Tanaka',
                  line: {
                    0: 'おやすみなさい。',
                    2: 'おやすみ。'
                  },
                  isLearnerTurn: false
                },
                { speaker: 'You', expectedAnswer: 'おやすみなさい', acceptedAnswers: ['おやすみなさい。'], isLearnerTurn: true }
              ]
            }
          ],
          successMessage: "Level 1 COMPLETE — you've landed in Japan socially.",
          emotionalFeedback: {
            perfect: 'You made it through every moment without missing a beat. Mrs. Tanaka puts tea on the table without being asked.',
            good: 'You made it through the day. Mrs. Tanaka puts tea on the table without being asked.',
            struggle: 'The house is quiet. You survived day one in Japan — and that matters more than any score.'
          }
        }
      ]
    }
  ],
  challengeMission: {
    id: 'JL1-challenge',
    title: 'Social Starter Challenge',
    kind: 'checkpoint',
    estimatedMinutes: 2,
    scenario: "You forgot your key. Mrs. Tanaka's neighbor — a retired teacher — opens the door and wants to make sure you really belong here. She tests you with rapid-fire social Japanese.",
    goal: 'Prove your Level 1 social Japanese under pressure. No hints. No second chances.',
    vocabulary: [],
    grammar: [],
    examples: [],
    successMessage: "The neighbor nods slowly. 'この子は大丈夫ですね.' You can hear Mrs. Tanaka laugh from inside.",
    emotionalFeedback: {
      perfect: "Perfect score. The neighbor actually smiles — and hands you a spare key.",
      good: "You held your own. The neighbor lets you in with a quiet nod.",
      struggle: "A tough one. Mrs. Tanaka reassures the neighbor and waves you inside."
    },
    questions: [
      {
        id: 'JL1-ch-q1',
        type: 'multiple-choice',
        prompt: 'You step into the neighbor\'s genkan. What do you say?',
        options: ['おじゃまします', 'いただきます', 'ごちそうさまでした', 'おやすみなさい'],
        correctAnswer: 'おじゃまします',
        explanation: 'おじゃまします is the polite phrase for entering someone\'s home.'
      },
      {
        id: 'JL1-ch-q2',
        type: 'translation-en-jp',
        prompt: 'Translate: "Good evening."',
        correctAnswer: 'こんばんは',
        acceptedAnswers: ['こんばんは。', 'konbanwa'],
        explanation: 'こんばんは is the standard evening greeting.'
      },
      {
        id: 'JL1-ch-q3',
        type: 'fill-in-blank',
        prompt: 'Before eating, you say: ___',
        correctAnswer: 'いただきます',
        acceptedAnswers: ['いただきます。'],
        explanation: 'いただきます is the ritual phrase said before starting a meal.'
      },
      {
        id: 'JL1-ch-q4',
        type: 'multiple-choice',
        prompt: 'The neighbor offers tea. You accept politely. Which phrase fits best?',
        options: ['ありがとうございます', 'すみません', 'おやすみなさい', 'じゃあね'],
        correctAnswer: 'ありがとうございます',
        explanation: 'ありがとうございます is the formal thank you for receiving something.'
      },
      {
        id: 'JL1-ch-q5',
        type: 'sentence-build',
        prompt: 'Build: "Good night, Mrs. Tanaka." (formal)',
        correctAnswer: 'おやすみなさい',
        explanation: 'おやすみなさい is the formal good-night phrase.'
      },
      {
        id: 'JL1-ch-q6',
        type: 'translation-jp-en',
        prompt: 'What does ごちそうさまでした mean?',
        correctAnswer: 'Thank you for the meal',
        acceptedAnswers: ['Thank you for the food', 'That was delicious, thank you'],
        explanation: 'Said after finishing a meal to express gratitude.'
      },
      {
        id: 'JL1-ch-q7',
        type: 'multiple-choice',
        prompt: 'The neighbor asks your name. You say: 「___　ケンジです。」',
        options: ['わたしは', 'あなたは', 'これは', 'それは'],
        correctAnswer: 'わたしは',
        explanation: 'わたしは means "I am" — the standard self-introduction opener.'
      },
      {
        id: 'JL1-ch-q8',
        type: 'translation-en-jp',
        prompt: 'Translate: "Nice to meet you."',
        correctAnswer: 'よろしくおねがいします',
        acceptedAnswers: ['よろしくおねがいします。', 'はじめまして', 'はじめまして。よろしくおねがいします。'],
        explanation: 'よろしくおねがいします is the standard phrase for first meetings.'
      },
      {
        id: 'JL1-ch-q9',
        type: 'multiple-choice',
        prompt: 'You bump into the neighbor in the hallway. She looks surprised. You say:',
        options: ['すみません', 'おはようございます', 'こんにちは', 'いただきます'],
        correctAnswer: 'すみません',
        explanation: 'すみません is the polite apology/excuse-me for small social mishaps.'
      },
      {
        id: 'JL1-ch-q10',
        type: 'fill-in-blank',
        prompt: 'You are leaving. You say: 「___ ください。」 (Please take care / goodbye for now)',
        correctAnswer: 'おげんきで',
        acceptedAnswers: ['おげんきで', 'お元気で'],
        explanation: 'おげんきで means "please stay well" — a polite parting phrase.'
      },
      {
        id: 'JL1-ch-q11',
        type: 'translation-jp-en',
        prompt: 'What does すみません mean in this context: accidentally blocking someone\'s path?',
        correctAnswer: 'Excuse me',
        acceptedAnswers: ['Sorry', 'I\'m sorry', 'Pardon me'],
        explanation: 'すみません covers both excuse me and light apologies.'
      },
      {
        id: 'JL1-ch-q12',
        type: 'multiple-choice',
        prompt: 'The neighbor says 「おかえり」. What is the correct response?',
        options: ['ただいま', 'いってきます', 'おはようございます', 'おやすみ'],
        correctAnswer: 'ただいま',
        explanation: 'ただいま ("I\'m home") is the reply when someone says おかえり (welcome back).'
      },
      {
        id: 'JL1-ch-q13',
        type: 'translation-en-jp',
        prompt: 'Translate: "I\'m going now." (leaving home phrase)',
        correctAnswer: 'いってきます',
        acceptedAnswers: ['いってきます。'],
        explanation: 'いってきます is said when leaving home, meaning "I\'m going and coming back."'
      },
      {
        id: 'JL1-ch-q14',
        type: 'sentence-build',
        prompt: 'Build: "Thank you very much."',
        correctAnswer: 'ありがとうございます',
        explanation: 'The formal expression of gratitude.'
      },
      {
        id: 'JL1-ch-q15',
        type: 'multiple-choice',
        prompt: 'You finish the tea the neighbor gave you. What do you say?',
        options: ['ごちそうさまでした', 'いただきます', 'おじゃまします', 'ただいま'],
        correctAnswer: 'ごちそうさまでした',
        explanation: 'ごちそうさまでした is said after finishing a meal or drink to thank the host.'
      }
    ]
  }
};
