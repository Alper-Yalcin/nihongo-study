import { JLearnLevel } from './jlearnTypes';

export const jlearnLevel4: JLearnLevel = {
  id: 'JL4',
  title: 'Demonstratives',
  theme: 'Point at, identify, and compare objects at the convenience store.',
  location: 'Convenience Store',
  jlptAlignment: 'N5',
  genkiChapters: [2],
  checkpointUnitId: 'L4-U2',
  badge: { id: 'badge-pointer', name: 'Pointer', description: 'You can identify any object in your environment.' },
  storyHook: {
    type: 'invitation-tease',
    speaker: 'Yuki',
    teaser: "Yuki points to a poster in the back of the konbini. She wants to show you something.",
    japanese: 'あれ、すごくない？',
    translation: "That over there — isn't it amazing?"
  },
  units: [
    {
      id: 'L4-U1',
      title: 'これ・それ・あれ',
      summary: 'Identify objects near you, near others, or far from everyone.',
      steps: [
        {
          id: 'L4-U1-M1',
          title: 'What is this?',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: "Yuki picks up something unfamiliar. You don't know what it is.",
          goal: 'Use これ/それ/あれ to ask what something is.',
          vocabulary: [
            { id: 'v4-kore', japanese: 'これ', romaji: 'kore', english: 'this (near speaker)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v4-sore', japanese: 'それ', romaji: 'sore', english: 'that (near listener)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v4-are', japanese: 'あれ', romaji: 'are', english: 'that over there (far from both)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v4-nan', japanese: 'なん', romaji: 'nan', english: 'what (before desu/ka)', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g4-kore-nan',
            pattern: 'これ / それ / あれ は なんですか',
            explanation: 'Use これ (near you), それ (near them), あれ (far from both) to ask what something is.',
            structure: '[demonstrative] は なんですか',
            examples: ['これはなんですか。', 'それはおにぎりです。', 'あれはコンビニです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex4-1-1', japanese: 'これはなんですか。', romaji: 'Kore wa nan desu ka.', english: 'What is this?', vocabIds: ['v4-kore'], grammarIds: ['g4-kore-nan'] },
            { id: 'ex4-1-2', japanese: 'それはおにぎりです。', romaji: 'Sore wa onigiri desu.', english: 'That is a rice ball.', vocabIds: ['v4-sore'], grammarIds: [] },
            { id: 'ex4-1-3', japanese: 'あれはコンビニですか。', romaji: 'Are wa konbini desu ka.', english: 'Is that a convenience store?', vocabIds: ['v4-are'], grammarIds: ['g4-kore-nan'] },
          ],
          branchingChoice: {
            prompt: "Yuki holds a snack close to her. You ask what it is:",
            options: [
              { id: 'a', label: 'それはなんですか？', outcome: 'correct', reaction: '「そうそう！」 それ is right — it\'s near her.' },
              { id: 'b', label: 'これはなんですか？', outcome: 'partial', reaction: 'これ means it\'s near you. Better to use それ here.' },
              { id: 'c', label: 'あれはなんですか？', outcome: 'wrong', reaction: 'あれ is for things far from both of you.' },
            ]
          },
          dialogueChains: [{ id: 'dl4-1-1', turns: [
            { speaker: 'Yuki', line: { 0: 'これはなんですか？', 2: 'ねえ、これなに？' }, isLearnerTurn: false, translation: 'What is this?' },
            { speaker: 'You', expectedAnswer: 'おにぎりです', acceptedAnswers: ['おにぎりです。'], isLearnerTurn: true, translation: "It's a rice ball." },
            { speaker: 'Yuki', line: { 0: 'そうです！おいしいですよ。', 2: 'そう！めっちゃおいしい！' }, isLearnerTurn: false, translation: "That's right! It's delicious." },
          ]}],
          questions: [
            { id: 'q4-1-1', type: 'multiple-choice', prompt: "It's near you. Which demonstrative?", options: ['これ', 'それ', 'あれ', 'どれ'], correctAnswer: 'これ', explanation: 'これ = near the speaker.' },
            { id: 'q4-1-2', type: 'translation-en-jp', prompt: '"What is that?" (near the listener)', correctAnswer: 'それはなんですか', acceptedAnswers: ['それはなんですか？'] },
            { id: 'q4-1-3', type: 'fill-in-blank', prompt: 'Far from both: 「___はコンビニです。」', correctAnswer: 'あれ' },
          ],
          successMessage: "You identified the right things. Yuki approves.",
          emotionalFeedback: {
            perfect: '「日本語上手！」 Yuki hands you the onigiri.',
            good: 'Solid start. Yuki watches you scan the shelf.',
            struggle: 'These take practice. Yuki points again slowly.',
          }
        },
        {
          id: 'L4-U1-M2',
          title: 'This bread, please',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: 'You want a specific item. Use この/その/あの before the noun.',
          goal: 'Use この/その/あの + noun to specify items.',
          vocabulary: [
            { id: 'v4-kono', japanese: 'この', romaji: 'kono', english: 'this + noun', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v4-sono', japanese: 'その', romaji: 'sono', english: 'that + noun (near listener)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v4-ano', japanese: 'あの', romaji: 'ano', english: 'that + noun (far from both)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v4-pan', japanese: 'パン', romaji: 'pan', english: 'bread', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v4-onigiri', japanese: 'おにぎり', romaji: 'onigiri', english: 'rice ball', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g4-kono-noun',
            pattern: 'この/その/あの + Noun + をください',
            explanation: 'Noun modifiers — これ changes to この, それ→その, あれ→あの before a noun.',
            structure: '[demonstrative-no] [noun] を ください',
            examples: ['このパンをください。', 'そのおにぎりはいくらですか。', 'あのお店はどこですか。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex4-2-1', japanese: 'このパンをください。', romaji: 'Kono pan o kudasai.', english: 'This bread, please.', vocabIds: ['v4-kono', 'v4-pan'], grammarIds: ['g4-kono-noun'] },
            { id: 'ex4-2-2', japanese: 'そのおにぎりはいくらですか。', romaji: 'Sono onigiri wa ikura desu ka.', english: 'How much is that rice ball?', vocabIds: ['v4-sono', 'v4-onigiri'], grammarIds: [] },
            { id: 'ex4-2-3', japanese: 'あのパンをひとつください。', romaji: 'Ano pan o hitotsu kudasai.', english: 'One of that bread over there, please.', vocabIds: ['v4-ano', 'v4-pan'], grammarIds: ['g4-kono-noun'] },
          ],
          branchingChoice: {
            prompt: "The clerk holds a bread roll. You want it. You say:",
            options: [
              { id: 'a', label: 'そのパンをください', outcome: 'correct', reaction: '「はい、どうぞ！」 The clerk hands it right over.' },
              { id: 'b', label: 'このパンをください', outcome: 'partial', reaction: 'Understood, but その is better — the bread is near her.' },
              { id: 'c', label: 'あのパンをください', outcome: 'wrong', reaction: 'あの is for things far from both of you.' },
            ]
          },
          dialogueChains: [{ id: 'dl4-1-2', turns: [
            { speaker: 'Clerk', line: 'いらっしゃいませ！', isLearnerTurn: false, translation: 'Welcome!' },
            { speaker: 'You', expectedAnswer: 'このパンをください', acceptedAnswers: ['このパンをください。', 'このパンをひとつください'], isLearnerTurn: true, translation: 'This bread, please.' },
            { speaker: 'Clerk', line: '140えんです。', isLearnerTurn: false, translation: "That's 140 yen." },
          ]}],
          questions: [
            { id: 'q4-2-1', type: 'sentence-build', prompt: 'Build: "That rice ball, please." (near listener)', correctAnswer: 'そのおにぎりをください' },
            { id: 'q4-2-2', type: 'translation-en-jp', prompt: '"This bread" (modifier form)', correctAnswer: 'このパン', acceptedAnswers: ['このパン'] },
            { id: 'q4-2-3', type: 'multiple-choice', prompt: 'Item is far from everyone. You say:', options: ['あのパンをください', 'このパンをください', 'そのパンをください', 'どのパンをください'], correctAnswer: 'あのパンをください' },
          ],
          successMessage: 'You ordered exactly what you wanted.',
          emotionalFeedback: {
            perfect: '「ちゃんと言えたね！」 Yuki nods in satisfaction.',
            good: 'The clerk understood. Mission success.',
            struggle: 'この/その/あの takes repetition. You\'re getting it.',
          }
        },
        {
          id: 'L4-U1-M3',
          title: 'Which one?',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: 'Yuki asks you to choose. Use どれ / どの.',
          goal: 'Ask "which one?" using どれ and どの + noun.',
          vocabulary: [
            { id: 'v4-dore', japanese: 'どれ', romaji: 'dore', english: 'which one (of many)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v4-dono', japanese: 'どの', romaji: 'dono', english: 'which + noun', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v4-aji', japanese: 'あじ', romaji: 'aji', english: 'flavor / taste', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g4-dore',
            pattern: 'どれ / どの + Noun + がいいですか',
            explanation: 'どれ asks "which one?" independently; どの precedes a noun.',
            structure: '[どれ / どの noun] が いいですか',
            examples: ['どれがいいですか。', 'どのあじにしますか。', 'どれがおすすめですか。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex4-3-1', japanese: 'どれがいいですか。', romaji: 'Dore ga ii desu ka.', english: 'Which one is good?', vocabIds: ['v4-dore'], grammarIds: ['g4-dore'] },
            { id: 'ex4-3-2', japanese: 'どのあじにしますか。', romaji: 'Dono aji ni shimasu ka.', english: 'Which flavor will you have?', vocabIds: ['v4-dono', 'v4-aji'], grammarIds: ['g4-dore'] },
            { id: 'ex4-3-3', japanese: 'どれがおすすめですか。', romaji: 'Dore ga osusume desu ka.', english: 'Which do you recommend?', vocabIds: ['v4-dore'], grammarIds: [] },
          ],
          branchingChoice: {
            prompt: "Yuki holds up three juice bottles. You want to ask which is sweet:",
            options: [
              { id: 'a', label: 'どれがあまいですか？', outcome: 'correct', reaction: 'Yuki points to the middle one. 「これ！」' },
              { id: 'b', label: 'どのジュースですか？', outcome: 'partial', reaction: 'Close — but どれ is more natural when choosing from a shown set.' },
              { id: 'c', label: 'これがあまいですか？', outcome: 'wrong', reaction: "これ points at one specific thing — you wanted to ask which of several." },
            ]
          },
          dialogueChains: [{ id: 'dl4-1-3', turns: [
            { speaker: 'Yuki', line: { 0: 'どれがいいですか？', 2: 'どれにする？' }, isLearnerTurn: false, translation: 'Which one would you like?' },
            { speaker: 'You', expectedAnswer: 'どのあじがいいですか', acceptedAnswers: ['どれがいいですか', 'どのあじですか'], isLearnerTurn: true, translation: 'Which flavor is good?' },
            { speaker: 'Yuki', line: { 0: 'このいちごがおすすめです！', 2: 'いちご！絶対これ！' }, isLearnerTurn: false, translation: 'I recommend the strawberry!' },
          ]}],
          questions: [
            { id: 'q4-3-1', type: 'multiple-choice', prompt: '"Which flavor?" — correct form:', options: ['どのあじ', 'このあじ', 'そのあじ', 'あのあじ'], correctAnswer: 'どのあじ' },
            { id: 'q4-3-2', type: 'translation-en-jp', prompt: '"Which one is good?"', correctAnswer: 'どれがいいですか', acceptedAnswers: ['どれがいいですか？'] },
            { id: 'q4-3-3', type: 'fill-in-blank', prompt: '「___がおすすめですか。」', correctAnswer: 'どれ' },
          ],
          successMessage: 'Yuki hands you the strawberry juice. Good choice.',
          emotionalFeedback: {
            perfect: '「やっぱり！わかってるじゃない！」',
            good: 'You made your choice clearly.',
            struggle: 'どれ vs どの is the tricky one. Keep practicing.',
          }
        },
        {
          id: 'L4-U1-M4',
          title: 'Price check',
          kind: 'review',
          estimatedMinutes: 1,
          scenario: 'Quick price checks across the store before heading to the register.',
          goal: 'Combine demonstratives with いくら price questions.',
          vocabulary: [
            { id: 'v4-ikura', japanese: 'いくら', romaji: 'ikura', english: 'how much (price)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v4-yasui', japanese: 'やすい', romaji: 'yasui', english: 'cheap / inexpensive', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v4-takai', japanese: 'たかい', romaji: 'takai', english: 'expensive', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g4-ikura',
            pattern: 'この～はいくらですか',
            explanation: 'Ask the price using a demonstrative + noun + はいくらですか.',
            structure: '[demonstrative] [noun] は いくらですか',
            examples: ['このパンはいくらですか。', 'それはいくらですか。', 'どれがいちばんやすいですか。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex4-4-1', japanese: 'このジュースはいくらですか。', romaji: 'Kono juusu wa ikura desu ka.', english: 'How much is this juice?', vocabIds: ['v4-kono', 'v4-ikura'], grammarIds: ['g4-ikura'] },
            { id: 'ex4-4-2', japanese: 'やすいですね！', romaji: 'Yasui desu ne!', english: "That's cheap!", vocabIds: ['v4-yasui'], grammarIds: [] },
            { id: 'ex4-4-3', japanese: 'あのパンはたかいですか。', romaji: 'Ano pan wa takai desu ka.', english: 'Is that bread expensive?', vocabIds: ['v4-ano', 'v4-takai'], grammarIds: ['g4-ikura'] },
          ],
          branchingChoice: {
            prompt: "A bento is in the clerk's hand. You want the price. You say:",
            options: [
              { id: 'a', label: 'そのべんとうはいくらですか', outcome: 'correct', reaction: '「580えんです。」 The clerk answers directly.' },
              { id: 'b', label: 'このべんとうはいくらですか', outcome: 'partial', reaction: 'Understood — but その fits better since it\'s near her.' },
              { id: 'c', label: 'べんとうはいくらですか', outcome: 'partial', reaction: 'The clerk understands, but a demonstrative clarifies which bento.' },
            ]
          },
          dialogueChains: [{ id: 'dl4-1-4', turns: [
            { speaker: 'Clerk', line: 'おさがしものはありますか？', isLearnerTurn: false, translation: 'Are you looking for something?' },
            { speaker: 'You', expectedAnswer: 'このおにぎりはいくらですか', acceptedAnswers: ['このおにぎりはいくらですか？'], isLearnerTurn: true, translation: 'How much is this rice ball?' },
            { speaker: 'Clerk', line: '120えんです。', isLearnerTurn: false, translation: "It's 120 yen." },
          ]}],
          questions: [
            { id: 'q4-4-1', type: 'translation-en-jp', prompt: '"How much is this juice?"', correctAnswer: 'このジュースはいくらですか', acceptedAnswers: ['このジュースはいくらですか？'] },
            { id: 'q4-4-2', type: 'multiple-choice', prompt: 'You want to know which is cheapest:', options: ['どれがいちばんやすいですか', 'これがいちばんやすいですか', 'それはいくらですか', 'あのはいくらですか'], correctAnswer: 'どれがいちばんやすいですか' },
            { id: 'q4-4-3', type: 'fill-in-blank', prompt: 'Item is near the clerk: 「___パンはいくらですか。」', correctAnswer: 'その' },
          ],
          successMessage: 'Yuki heads to the register. Shopping vocab secured.',
          emotionalFeedback: {
            perfect: '「コンビニマスター！」',
            good: 'Smooth price-check run.',
            struggle: 'Demonstratives are settling in. Keep going.',
          }
        },
      ]
    },
    {
      id: 'L4-U2',
      title: 'Shopping in Context',
      summary: 'Compare items, confirm prices, and complete a full konbini transaction.',
      steps: [
        {
          id: 'L4-U2-M1',
          title: 'That store over there',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "You're walking past a new shop. Yuki spots it.",
          goal: 'Use あれ/あの for things far from both speakers.',
          vocabulary: [
            { id: 'v4-mise', japanese: 'お店', romaji: 'o-mise', english: 'store / shop', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v4-atarashii', japanese: 'あたらしい', romaji: 'atarashii', english: 'new', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g4-are-shop',
            pattern: 'あれはなんのお店ですか',
            explanation: 'Use あれ/あの for landmarks or stores far from both you and your companion.',
            structure: 'あの [noun] は なんですか / ～です',
            examples: ['あのお店はなんですか。', 'あれはあたらしいコンビニです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex4-5-1', japanese: 'あのお店はなんですか。', romaji: 'Ano o-mise wa nan desu ka.', english: 'What is that store over there?', vocabIds: ['v4-ano', 'v4-mise'], grammarIds: ['g4-are-shop'] },
            { id: 'ex4-5-2', japanese: 'あれはあたらしいコンビニです。', romaji: 'Are wa atarashii konbini desu.', english: "That's a new convenience store.", vocabIds: ['v4-are', 'v4-atarashii'], grammarIds: ['g4-are-shop'] },
          ],
          branchingChoice: {
            prompt: "Yuki spots a new shop far down the street. She asks you to describe it:",
            options: [
              { id: 'a', label: 'あのお店はコンビニです', outcome: 'correct', reaction: '「かも！行ってみよ！」 Perfect use of あの.' },
              { id: 'b', label: 'このお店はコンビニです', outcome: 'wrong', reaction: 'この means the shop is right next to you.' },
              { id: 'c', label: 'そのお店はコンビニです', outcome: 'wrong', reaction: 'その means near Yuki — she\'s standing next to you.' },
            ]
          },
          dialogueChains: [{ id: 'dl4-2-1', turns: [
            { speaker: 'Yuki', line: { 0: 'あのお店、なんですか？', 2: 'あのお店、何だろう？' }, isLearnerTurn: false, translation: 'What is that store over there?' },
            { speaker: 'You', expectedAnswer: 'あのお店はコンビニです', acceptedAnswers: ['あれはコンビニです', 'あのお店はコンビニです。'], isLearnerTurn: true, translation: "That store is a convenience store." },
            { speaker: 'Yuki', line: { 0: '行ってみましょう！', 2: '行こう！' }, isLearnerTurn: false, translation: "Let's go check it out!" },
          ]}],
          questions: [
            { id: 'q4-5-1', type: 'multiple-choice', prompt: 'Shop is far from both of you. Which demonstrative?', options: ['あの', 'この', 'その', 'どの'], correctAnswer: 'あの' },
            { id: 'q4-5-2', type: 'translation-en-jp', prompt: '"That new store over there"', correctAnswer: 'あのあたらしいお店', acceptedAnswers: ['あのあたらしいお店'] },
            { id: 'q4-5-3', type: 'fill-in-blank', prompt: '「___はあたらしいコンビニです。」(far from both)', correctAnswer: 'あれ' },
          ],
          successMessage: 'Yuki jogs toward the new store. Level 4 vocab on point.',
          emotionalFeedback: {
            perfect: '「上手だね〜！」 Yuki breaks into a jog.',
            good: 'You described the store clearly.',
            struggle: 'あの vs その is the hardest distinction. Keep practicing.',
          }
        },
        {
          id: 'L4-U2-M2',
          title: 'Comparing prices',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: 'Two similar items, different prices. Compare them.',
          goal: 'Compare items using demonstratives and より (than).',
          vocabulary: [
            { id: 'v4-motto', japanese: 'もっと', romaji: 'motto', english: 'more', partOfSpeech: 'adverb', jlptLevel: 'N5' },
            { id: 'v4-yori', japanese: 'より', romaji: 'yori', english: 'than (comparison)', partOfSpeech: 'particle', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g4-yori',
            pattern: 'AはBより～です',
            explanation: 'Use より to compare two things: A is more [adjective] than B.',
            structure: '[A] は [B] より [adjective] です',
            examples: ['このパンはそのパンよりやすいです。', 'そのジュースはこれよりたかいです。', 'もっとやすいものはありますか。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex4-6-1', japanese: 'このパンはそのパンよりやすいです。', romaji: 'Kono pan wa sono pan yori yasui desu.', english: 'This bread is cheaper than that bread.', vocabIds: ['v4-kono', 'v4-sono'], grammarIds: ['g4-yori'] },
            { id: 'ex4-6-2', japanese: 'もっとやすいものはありますか。', romaji: 'Motto yasui mono wa arimasu ka.', english: 'Is there something cheaper?', vocabIds: ['v4-motto'], grammarIds: [] },
          ],
          branchingChoice: {
            prompt: "You hold one onigiri (near you), Yuki holds another (near her). Yuki's is cheaper. You say:",
            options: [
              { id: 'a', label: 'そのおにぎりはこれよりやすいですね', outcome: 'correct', reaction: '「そう！おとく！」 Perfect use of その vs これ.' },
              { id: 'b', label: 'このおにぎりはそれよりやすいですね', outcome: 'wrong', reaction: 'Wait — the cheaper one is near Yuki (その), not you (この).' },
              { id: 'c', label: 'おにぎりはやすいですね', outcome: 'partial', reaction: 'Correct sentiment, but no demonstrative to clarify which.' },
            ]
          },
          dialogueChains: [{ id: 'dl4-2-2', turns: [
            { speaker: 'Yuki', line: { 0: 'どちらがやすいですか？', 2: 'どっちが安い？' }, isLearnerTurn: false, translation: 'Which is cheaper?' },
            { speaker: 'You', expectedAnswer: 'そのおにぎりがやすいです', acceptedAnswers: ['そのほうがやすいです', 'それがやすいです'], isLearnerTurn: true, translation: 'That rice ball is cheaper.' },
            { speaker: 'Yuki', line: { 0: 'じゃあ、それにしましょう！', 2: 'じゃそっちにしよ！' }, isLearnerTurn: false, translation: "Then let's get that one!" },
          ]}],
          questions: [
            { id: 'q4-6-1', type: 'translation-en-jp', prompt: '"This bread is more expensive than that bread."', correctAnswer: 'このパンはそのパンよりたかいです', acceptedAnswers: ['このパンはそのパンよりたかいです。'] },
            { id: 'q4-6-2', type: 'fill-in-blank', prompt: '「___やすいものはありますか。」(even more cheap)', correctAnswer: 'もっと' },
            { id: 'q4-6-3', type: 'multiple-choice', prompt: 'Cheaper item is near the listener. You say:', options: ['そのほうがやすい', 'このほうがやすい', 'あのほうがやすい', 'どのほうがやすい'], correctAnswer: 'そのほうがやすい' },
          ],
          successMessage: 'Yuki chooses the cheaper one. Good comparison skills.',
          emotionalFeedback: {
            perfect: '「完璧！」 Yuki pays for both as a treat.',
            good: 'You compared correctly. Yuki is pleased.',
            struggle: 'Comparison patterns take time. You are building.',
          }
        },
        {
          id: 'L4-U2-M3',
          title: 'Full konbini run',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: 'From entering to paying — a full convenience store interaction.',
          goal: 'Complete a konbini transaction using all Level 4 demonstratives.',
          vocabulary: [
            { id: 'v4-onegaishimasu', japanese: 'おねがいします', romaji: 'onegai shimasu', english: 'please (requesting)', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v4-arigatogozaimashita', japanese: 'ありがとうございました', romaji: 'arigatou gozaimashita', english: 'thank you very much (past)', partOfSpeech: 'expression', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g4-konbini-full',
            pattern: 'このXをおねがいします',
            explanation: 'Full shopping pattern: point with demonstrative, request with おねがいします.',
            structure: '[demonstrative] [noun] を おねがいします',
            examples: ['このジュースをひとつおねがいします。', 'そのパンをください。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex4-7-1', japanese: 'このジュースをひとつおねがいします。', romaji: 'Kono juusu o hitotsu onegai shimasu.', english: 'One of this juice, please.', vocabIds: ['v4-kono', 'v4-onegaishimasu'], grammarIds: ['g4-konbini-full'] },
            { id: 'ex4-7-2', japanese: 'ありがとうございました。', romaji: 'Arigatou gozaimashita.', english: 'Thank you very much.', vocabIds: ['v4-arigatogozaimashita'], grammarIds: [] },
          ],
          branchingChoice: {
            prompt: "The clerk asks: 「こちらでよろしいですか？」 (Is this OK?) You confirm:",
            options: [
              { id: 'a', label: 'はい、おねがいします', outcome: 'correct', reaction: '「ありがとうございます！」 She rings it up.' },
              { id: 'b', label: 'これでいくらですか', outcome: 'partial', reaction: 'She expected a confirmation, not a price question — but she answers anyway.' },
              { id: 'c', label: 'いいえ、ちがいます', outcome: 'wrong', reaction: 'The clerk removes an item. That was not your intention.' },
            ]
          },
          dialogueChains: [{ id: 'dl4-2-3', turns: [
            { speaker: 'Clerk', line: 'おにぎりとジュースで360えんです。', isLearnerTurn: false, translation: 'Rice ball and juice come to 360 yen.' },
            { speaker: 'You', expectedAnswer: 'はい、おねがいします', acceptedAnswers: ['はい。', 'はい、それでおねがいします'], isLearnerTurn: true, translation: 'Yes, please.' },
            { speaker: 'Clerk', line: 'ありがとうございました！', isLearnerTurn: false, translation: 'Thank you very much!' },
          ]}],
          questions: [
            { id: 'q4-7-1', type: 'sentence-build', prompt: 'Build: "One of this juice, please."', correctAnswer: 'このジュースをひとつおねがいします' },
            { id: 'q4-7-2', type: 'translation-en-jp', prompt: '"Thank you very much" (after a transaction)', correctAnswer: 'ありがとうございました', acceptedAnswers: ['ありがとうございました。'] },
            { id: 'q4-7-3', type: 'multiple-choice', prompt: 'Most natural way to confirm an order:', options: ['はい、おねがいします', 'これでいいです', 'そうです', 'わかりました'], correctAnswer: 'はい、おねがいします' },
          ],
          successMessage: 'Your first solo konbini run complete.',
          emotionalFeedback: {
            perfect: '「一人でできたね！」 Yuki claps outside.',
            good: 'A smooth transaction.',
            struggle: 'You got through it. Next time will be easier.',
          }
        },
        {
          id: 'L4-U2-M4',
          title: 'Level 4 Checkpoint',
          kind: 'checkpoint',
          estimatedMinutes: 2,
          isCheckpoint: true,
          minPassScore: 80,
          scenario: 'Final test: point at, specify, compare, and request items at the convenience store.',
          goal: 'Demonstrate full command of Level 4 demonstratives.',
          vocabulary: [],
          grammar: [],
          examples: [],
          branchingChoice: {
            prompt: "The clerk holds up two drinks. You want to know which is sweeter:",
            options: [
              { id: 'a', label: 'どれがあまいですか', outcome: 'correct', reaction: '「こちらです！」 The clerk points to the left.' },
              { id: 'b', label: 'これはあまいですか', outcome: 'partial', reaction: "You're pointing at one already — use どれ to ask about both." },
              { id: 'c', label: 'あれはあまいですか', outcome: 'wrong', reaction: 'あれ refers to something far away from both of you.' },
            ]
          },
          dialogueChains: [{ id: 'dl4-2-4', turns: [
            { speaker: 'Yuki', line: 'コンビニテストだよ。全部使ってみて！', isLearnerTurn: false, translation: 'Konbini test — use everything you know!' },
            { speaker: 'You', expectedAnswer: 'このジュースはいくらですか', acceptedAnswers: ['このジュースはいくらですか？', 'そのジュースはいくらですか'], isLearnerTurn: true, translation: 'How much is this juice?' },
            { speaker: 'Yuki', line: '合格！よくできました！', isLearnerTurn: false, translation: 'Pass! Well done!' },
          ]}],
          questions: [
            { id: 'q4-cp-1', type: 'multiple-choice', prompt: 'Item near listener:', options: ['そのパンをください', 'このパンをください', 'あのパンをください', 'どのパンをください'], correctAnswer: 'そのパンをください' },
            { id: 'q4-cp-2', type: 'translation-en-jp', prompt: '"Which one is cheap?"', correctAnswer: 'どれがやすいですか', acceptedAnswers: ['どれがやすいですか？'] },
            { id: 'q4-cp-3', type: 'fill-in-blank', prompt: '「___パンはそのパンよりやすいです。」(near speaker)', correctAnswer: 'この' },
            { id: 'q4-cp-4', type: 'sentence-build', prompt: 'Build: "That bread over there, please."', correctAnswer: 'あのパンをください' },
            { id: 'q4-cp-5', type: 'translation-jp-en', prompt: '「このジュースはあれよりたかいです」', correctAnswer: 'This juice is more expensive than that one', acceptedAnswers: ['This juice is more expensive than that.'] },
            { id: 'q4-cp-6', type: 'multiple-choice', prompt: 'Far from both of you. You say:', options: ['あれをください', 'これをください', 'それをください', 'どれをください'], correctAnswer: 'あれをください' },
          ],
          successMessage: 'Level 4 complete. You can navigate any convenience store in Japan.',
          emotionalFeedback: {
            perfect: 'Yuki takes a selfie outside: 「覚えておいて！」',
            good: 'Demonstratives mastered. Yuki approves.',
            struggle: 'You made it through. The patterns are settling.',
          }
        },
      ]
    }
  ]
};
