import { JLearnLevel } from './jlearnTypes';

export const jlearnLevel9: JLearnLevel = {
  id: 'JL9',
  title: 'Adjectives',
  theme: 'Describe the world around you using い-adjectives and な-adjectives.',
  location: 'School Cultural Festival',
  jlptAlignment: 'N5',
  genkiChapters: [5],
  checkpointUnitId: 'L9-U2',
  badge: { id: 'badge-describer', name: 'Describer', description: 'You can paint pictures with Japanese adjectives.' },
  storyHook: {
    type: 'invitation-tease',
    speaker: 'Yuki',
    teaser: "The cultural festival has transformed the school. Yuki is bursting with opinions about everything.",
    japanese: 'この食べ物、すごくおいしい！',
    translation: 'This food is incredibly delicious!'
  },
  units: [
    {
      id: 'L9-U1',
      title: 'い-Adjectives',
      summary: 'Describe things using adjectives ending in い.',
      steps: [
        {
          id: 'L9-U1-M1',
          title: 'It\'s delicious!',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: "The festival food stalls are open. Everything looks and tastes amazing.",
          goal: 'Use common い-adjectives with です.',
          vocabulary: [
            { id: 'v9-oishii', japanese: 'おいしい', romaji: 'oishii', english: 'delicious', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-kawaii', japanese: 'かわいい', romaji: 'kawaii', english: 'cute', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-omoshiroi', japanese: 'おもしろい', romaji: 'omoshiroi', english: 'interesting / funny', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-ii', japanese: 'いい', romaji: 'ii', english: 'good', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g9-i-adj-desu',
            pattern: '[noun] は [い-adj] です',
            explanation: 'い-adjectives describe nouns directly. Add です for polite speech.',
            structure: '[noun] は [い-adjective] です',
            examples: ['このりょうりはおいしいです。', 'このいぬはかわいいです。', 'このえいがはおもしろいです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex9-1-1', japanese: 'このりょうりはおいしいです。', romaji: 'Kono ryouri wa oishii desu.', english: 'This dish is delicious.', vocabIds: ['v9-oishii'], grammarIds: ['g9-i-adj-desu'] },
            { id: 'ex9-1-2', japanese: 'このいぬはかわいいです。', romaji: 'Kono inu wa kawaii desu.', english: 'This dog is cute.', vocabIds: ['v9-kawaii'], grammarIds: ['g9-i-adj-desu'] },
            { id: 'ex9-1-3', japanese: 'このえいがはおもしろいです。', romaji: 'Kono eiga wa omoshiroi desu.', english: 'This movie is interesting.', vocabIds: ['v9-omoshiroi'], grammarIds: ['g9-i-adj-desu'] },
          ],
          branchingChoice: {
            prompt: "You taste the takoyaki at the festival. It's delicious. You say:",
            options: [
              { id: 'a', label: 'このたこやきはおいしいです', outcome: 'correct', reaction: '「でしょう！うちのひみつのレシピです！」' },
              { id: 'b', label: 'このたこやきはおいしです', outcome: 'wrong', reaction: 'い-adjectives keep their い: おいしい, not おいし.' },
              { id: 'c', label: 'このたこやきがおいしいです', outcome: 'partial', reaction: 'Understood — は is more natural for general description here.' },
            ]
          },
          dialogueChains: [{ id: 'dl9-1-1', turns: [
            { speaker: 'Yuki', line: { 0: 'このたこやきはどうですか？', 2: 'たこやき、どう？' }, isLearnerTurn: false, translation: 'How is the takoyaki?' },
            { speaker: 'You', expectedAnswer: 'おいしいです', acceptedAnswers: ['おいしいです。', 'とてもおいしいです', 'すごくおいしいです'], isLearnerTurn: true, translation: "It's delicious." },
            { speaker: 'Yuki', line: { 0: 'よかった！もっとたべてください！', 2: 'やった！もっと食べて！' }, isLearnerTurn: false, translation: 'Great! Please eat more!' },
          ]}],
          questions: [
            { id: 'q9-1-1', type: 'translation-en-jp', prompt: '"This movie is interesting."', correctAnswer: 'このえいがはおもしろいです', acceptedAnswers: ['このえいがはおもしろいです。'] },
            { id: 'q9-1-2', type: 'fill-in-blank', prompt: '「このいぬはかわ___です。」', correctAnswer: 'いい' },
            { id: 'q9-1-3', type: 'multiple-choice', prompt: '"This dish is delicious." — correct:', options: ['このりょうりはおいしいです', 'このりょうりがおいしです', 'このりょうりはおいしです', 'このりょうりはおいしいた'], correctAnswer: 'このりょうりはおいしいです' },
          ],
          successMessage: 'い-adjectives flowing. The festival crowd agrees.',
          emotionalFeedback: {
            perfect: '「正直な感想！」',
            good: 'Adjective used correctly.',
            struggle: 'Keep the い at the end. おいしい, not おいし.',
          }
        },
        {
          id: 'L9-U1-M2',
          title: 'Before a noun',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "You're describing festival stalls to someone who hasn't arrived yet.",
          goal: 'Place い-adjectives directly before nouns.',
          vocabulary: [
            { id: 'v9-ookii', japanese: 'おおきい', romaji: 'ookii', english: 'big', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-chiisai', japanese: 'ちいさい', romaji: 'chiisai', english: 'small', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-atarashii', japanese: 'あたらしい', romaji: 'atarashii', english: 'new', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-furui', japanese: 'ふるい', romaji: 'furui', english: 'old (things)', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g9-i-adj-noun',
            pattern: '[い-adj] + [noun]',
            explanation: 'い-adjectives can directly precede the noun they describe: おおきい いぬ = big dog.',
            structure: '[い-adjective] [noun]',
            examples: ['おおきいいぬ', 'ちいさいにく', 'あたらしいほん', 'おいしいりょうり'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex9-2-1', japanese: 'おおきいいぬがいます。', romaji: 'Ookii inu ga imasu.', english: 'There is a big dog.', vocabIds: ['v9-ookii'], grammarIds: ['g9-i-adj-noun'] },
            { id: 'ex9-2-2', japanese: 'あたらしいほんをかいました。', romaji: 'Atarashii hon o kaimashita.', english: 'I bought a new book.', vocabIds: ['v9-atarashii'], grammarIds: ['g9-i-adj-noun'] },
            { id: 'ex9-2-3', japanese: 'ちいさいおみやげがかわいいです。', romaji: 'Chiisai omiyage ga kawaii desu.', english: 'The small souvenir is cute.', vocabIds: ['v9-chiisai', 'v9-kawaii'], grammarIds: ['g9-i-adj-noun'] },
          ],
          branchingChoice: {
            prompt: "You spot a big stuffed bear at a game booth. You say:",
            options: [
              { id: 'a', label: 'おおきいくまですね', outcome: 'correct', reaction: '「かわいい！とってみて！」 Yuki wants you to win it.' },
              { id: 'b', label: 'くまはおおきいですね', outcome: 'partial', reaction: 'Correct meaning — but you can also put the adjective before the noun.' },
              { id: 'c', label: 'おおきくまですね', outcome: 'wrong', reaction: 'Don\'t drop い: おおきいくま, not おおきくま.' },
            ]
          },
          dialogueChains: [{ id: 'dl9-1-2', turns: [
            { speaker: 'Yuki', line: { 0: 'あのおみやげ、どうですか？', 2: 'あのお土産どう思う？' }, isLearnerTurn: false, translation: 'What do you think of that souvenir?' },
            { speaker: 'You', expectedAnswer: 'ちいさくてかわいいですね', acceptedAnswers: ['かわいいですね', 'ちいさいですね', 'ちいさくてかわいいですね。'], isLearnerTurn: true, translation: "It's small and cute." },
            { speaker: 'Yuki', line: { 0: 'そうですね！かいましょう！', 2: 'そうだね！買おう！' }, isLearnerTurn: false, translation: "That's right! Let's buy it!" },
          ]}],
          questions: [
            { id: 'q9-2-1', type: 'translation-en-jp', prompt: '"a big book"', correctAnswer: 'おおきいほん', acceptedAnswers: ['おおきいほん'] },
            { id: 'q9-2-2', type: 'fill-in-blank', prompt: '「___いぬがいます。」(big)', correctAnswer: 'おおきい' },
            { id: 'q9-2-3', type: 'multiple-choice', prompt: '"a new book" — correct:', options: ['あたらしいほん', 'ほんあたらしい', 'あたらしほん', 'ほんのあたらしい'], correctAnswer: 'あたらしいほん' },
          ],
          successMessage: 'Adjectives placed before nouns — smooth and natural.',
          emotionalFeedback: {
            perfect: '「説明上手！」',
            good: 'Adjectives in position.',
            struggle: 'い-adj goes right before the noun. おおきい + いぬ = おおきいいぬ.',
          }
        },
        {
          id: 'L9-U1-M3',
          title: 'Negative い-adjectives',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Not everything at the festival is great. You share honest opinions.",
          goal: 'Negate い-adjectives: い → くない.',
          vocabulary: [
            { id: 'v9-takai', japanese: 'たかい', romaji: 'takai', english: 'expensive / tall', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-yasui', japanese: 'やすい', romaji: 'yasui', english: 'cheap', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-muzukashii', japanese: 'むずかしい', romaji: 'muzukashii', english: 'difficult', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g9-i-adj-negative',
            pattern: '[い-adj] → [stem] + くないです',
            explanation: 'Negate い-adjectives by dropping い and adding くないです. Exception: いい → よくないです.',
            structure: '[adj-stem] + くないです',
            examples: ['たかくないです。', 'おいしくないです。', 'むずかしくないです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex9-3-1', japanese: 'このゲームはむずかしくないです。', romaji: 'Kono geemu wa muzukashiku nai desu.', english: "This game isn't difficult.", vocabIds: ['v9-muzukashii'], grammarIds: ['g9-i-adj-negative'] },
            { id: 'ex9-3-2', japanese: 'このりょうりはおいしくないです。', romaji: 'Kono ryouri wa oishiku nai desu.', english: "This dish isn't delicious.", vocabIds: ['v9-oishii'], grammarIds: ['g9-i-adj-negative'] },
            { id: 'ex9-3-3', japanese: 'このかばんはたかくないです。', romaji: 'Kono kaban wa takaku nai desu.', english: "This bag isn't expensive.", vocabIds: ['v9-takai'], grammarIds: ['g9-i-adj-negative'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks if the game is difficult. It's not:",
            options: [
              { id: 'a', label: 'むずかしくないです', outcome: 'correct', reaction: '「じゃ、やってみよう！」 Yuki gets in line.' },
              { id: 'b', label: 'むずかしないです', outcome: 'wrong', reaction: 'Negative form: drop い, add くない. むずかし → むずかしくない.' },
              { id: 'c', label: 'むずかしくですない', outcome: 'wrong', reaction: 'くない stays together: むずかしくないです.' },
            ]
          },
          dialogueChains: [{ id: 'dl9-1-3', turns: [
            { speaker: 'Yuki', line: { 0: 'このゲームはむずかしいですか？', 2: 'このゲーム難しい？' }, isLearnerTurn: false, translation: 'Is this game difficult?' },
            { speaker: 'You', expectedAnswer: 'むずかしくないですよ', acceptedAnswers: ['むずかしくないです', 'いいえ、むずかしくないです。'], isLearnerTurn: true, translation: "It's not difficult." },
            { speaker: 'Yuki', line: { 0: 'やった！いっしょにやりましょう！', 2: 'やった！一緒にやろう！' }, isLearnerTurn: false, translation: 'Yes! Let\'s play together!' },
          ]}],
          questions: [
            { id: 'q9-3-1', type: 'translation-en-jp', prompt: '"This bag isn\'t expensive."', correctAnswer: 'このかばんはたかくないです', acceptedAnswers: ['このかばんはたかくないです。'] },
            { id: 'q9-3-2', type: 'fill-in-blank', prompt: '「おいし___です。」(not delicious)', correctAnswer: 'くない' },
            { id: 'q9-3-3', type: 'multiple-choice', prompt: '"It\'s not good." (いい → ?)', options: ['よくないです', 'いくないです', 'いいくないです', 'よないです'], correctAnswer: 'よくないです' },
          ],
          successMessage: 'Negative adjectives handled. Honesty in Japanese — achieved.',
          emotionalFeedback: {
            perfect: '「正直な意見！」',
            good: 'Negation clean and correct.',
            struggle: 'Drop い, add くない. And いい becomes よくない — special case.',
          }
        },
        {
          id: 'L9-U1-M4',
          title: 'い-adjective sprint',
          kind: 'review',
          estimatedMinutes: 1,
          scenario: "Rapid-fire adjective quiz between festival activities.",
          goal: 'Mix positive, negative, and noun-modifying forms of い-adjectives.',
          vocabulary: [
            { id: 'v9-samui', japanese: 'さむい', romaji: 'samui', english: 'cold (weather)', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-atsui', japanese: 'あつい', romaji: 'atsui', english: 'hot', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-hayai', japanese: 'はやい', romaji: 'hayai', english: 'fast / early', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g9-i-adj-all',
            pattern: 'い-adj positive / negative / pre-noun',
            explanation: 'Three forms to master: [adj]です (positive), [stem]くないです (negative), [adj][noun] (pre-noun).',
            structure: '[adj]です / [stem]くないです / [adj][noun]',
            examples: ['さむいです。', 'さむくないです。', 'さむいひです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex9-4-1', japanese: 'きょうはあついです。', romaji: 'Kyou wa atsui desu.', english: "Today is hot.", vocabIds: ['v9-atsui'], grammarIds: ['g9-i-adj-all'] },
            { id: 'ex9-4-2', japanese: 'さむくないです。', romaji: 'Samuku nai desu.', english: "It's not cold.", vocabIds: ['v9-samui'], grammarIds: ['g9-i-adj-all'] },
            { id: 'ex9-4-3', japanese: 'はやいバスにのります。', romaji: 'Hayai basu ni norimasu.', english: 'I take the fast bus.', vocabIds: ['v9-hayai'], grammarIds: ['g9-i-adj-all'] },
          ],
          branchingChoice: {
            prompt: "Yuki says: 「きょうはさむいですか？」 It's not cold today:",
            options: [
              { id: 'a', label: 'いいえ、さむくないです', outcome: 'correct', reaction: '「そうですね！あたたかいですね。」' },
              { id: 'b', label: 'いいえ、さむいではないです', outcome: 'wrong', reaction: 'Incorrect negation. Drop い and add くない: さむくない.' },
              { id: 'c', label: 'はい、さむいです', outcome: 'partial', reaction: 'You agreed it\'s cold — but it\'s actually warm today.' },
            ]
          },
          dialogueChains: [{ id: 'dl9-1-4', turns: [
            { speaker: 'Yuki', line: { 0: 'きょうのおまつりはどうですか？', 2: '今日のお祭りどう？' }, isLearnerTurn: false, translation: "What do you think of today's festival?" },
            { speaker: 'You', expectedAnswer: 'とてもたのしいです', acceptedAnswers: ['たのしいです', 'すごくたのしいです', 'とてもたのしいです。'], isLearnerTurn: true, translation: 'It is very fun.' },
            { speaker: 'Yuki', line: { 0: 'よかった！わたしもです！', 2: 'よかった！私も！' }, isLearnerTurn: false, translation: 'Great! Me too!' },
          ]}],
          questions: [
            { id: 'q9-4-1', type: 'translation-en-jp', prompt: '"Today is hot."', correctAnswer: 'きょうはあついです', acceptedAnswers: ['きょうはあついです。'] },
            { id: 'q9-4-2', type: 'translation-en-jp', prompt: '"It\'s not cold."', correctAnswer: 'さむくないです', acceptedAnswers: ['さむくないです。'] },
            { id: 'q9-4-3', type: 'multiple-choice', prompt: '"the fast bus" — correct:', options: ['はやいバス', 'バスははやい', 'はやくバス', 'バスはやいです'], correctAnswer: 'はやいバス' },
          ],
          successMessage: 'い-adjective triple threat: positive, negative, noun-mod. All there.',
          emotionalFeedback: {
            perfect: '「形容詞マスター！」',
            good: 'All three forms handled.',
            struggle: 'You\'re getting all three. Keep building.',
          }
        },
      ]
    },
    {
      id: 'L9-U2',
      title: 'な-Adjectives',
      summary: 'Use な-adjectives and combine both types in richer descriptions.',
      steps: [
        {
          id: 'L9-U2-M1',
          title: 'Quiet or lively?',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: "The festival has different zones — some quiet, some energetic.",
          goal: 'Use な-adjectives with です and before nouns using な.',
          vocabulary: [
            { id: 'v9-shizuka', japanese: 'しずかな', romaji: 'shizuka na', english: 'quiet', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-nigiyaka', japanese: 'にぎやかな', romaji: 'nigiyaka na', english: 'lively / bustling', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-kirei', japanese: 'きれいな', romaji: 'kirei na', english: 'beautiful / clean', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-suki', japanese: 'すきな', romaji: 'suki na', english: 'liked / favorite', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g9-na-adj',
            pattern: '[noun] は [な-adj stem] です / [な-adj stem] な [noun]',
            explanation: 'な-adjectives: use the stem + です for predicates. Add な before a noun.',
            structure: '[noun] は [な-adj] です / [な-adj] な [noun]',
            examples: ['このへやはしずかです。', 'にぎやかなおまつりです。', 'きれいなはなです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex9-5-1', japanese: 'このへやはしずかです。', romaji: 'Kono heya wa shizuka desu.', english: 'This room is quiet.', vocabIds: ['v9-shizuka'], grammarIds: ['g9-na-adj'] },
            { id: 'ex9-5-2', japanese: 'にぎやかなおまつりですね。', romaji: 'Nigiyaka na omatsuri desu ne.', english: 'It\'s a lively festival, isn\'t it.', vocabIds: ['v9-nigiyaka'], grammarIds: ['g9-na-adj'] },
            { id: 'ex9-5-3', japanese: 'きれいなはなですね。', romaji: 'Kirei na hana desu ne.', english: 'What a beautiful flower.', vocabIds: ['v9-kirei'], grammarIds: ['g9-na-adj'] },
          ],
          branchingChoice: {
            prompt: "You want to say 'a quiet room' — which form?",
            options: [
              { id: 'a', label: 'しずかなへや', outcome: 'correct', reaction: 'Perfect! な goes between the adjective and the noun.' },
              { id: 'b', label: 'しずかいへや', outcome: 'wrong', reaction: 'な-adjectives use な before a noun, not い.' },
              { id: 'c', label: 'しずかへや', outcome: 'wrong', reaction: 'な is required: しずかなへや.' },
            ]
          },
          dialogueChains: [{ id: 'dl9-2-1', turns: [
            { speaker: 'Yuki', line: { 0: 'このおまつりはどうですか？', 2: 'お祭り、どう？' }, isLearnerTurn: false, translation: "What do you think of the festival?" },
            { speaker: 'You', expectedAnswer: 'にぎやかですね', acceptedAnswers: ['にぎやかです', 'にぎやかですね。', 'とてもにぎやかです'], isLearnerTurn: true, translation: "It's lively, isn't it." },
            { speaker: 'Yuki', line: { 0: 'そうですね！まいとし、こんなかんじです。', 2: 'そうだね！毎年こんな感じ！' }, isLearnerTurn: false, translation: "That's right! It's like this every year." },
          ]}],
          questions: [
            { id: 'q9-5-1', type: 'multiple-choice', prompt: '"a lively festival" — correct:', options: ['にぎやかなおまつり', 'にぎやかいおまつり', 'にぎやかおまつり', 'おまつりはにぎやか'], correctAnswer: 'にぎやかなおまつり' },
            { id: 'q9-5-2', type: 'translation-en-jp', prompt: '"This room is quiet."', correctAnswer: 'このへやはしずかです', acceptedAnswers: ['このへやはしずかです。'] },
            { id: 'q9-5-3', type: 'fill-in-blank', prompt: '「きれい___はなです。」', correctAnswer: 'な' },
          ],
          successMessage: 'な-adjective structure locked. な before nouns, plain form after です.',
          emotionalFeedback: {
            perfect: '「な形容詞マスター！」',
            good: 'na used correctly every time.',
            struggle: 'い-adj: keep い before noun. な-adj: add な before noun.',
          }
        },
        {
          id: 'L9-U2-M2',
          title: 'Likes and dislikes',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "Festival favorites — you and Yuki share what you like.",
          goal: 'Use すき and きらい to express preferences.',
          vocabulary: [
            { id: 'v9-kirai', japanese: 'きらいな', romaji: 'kirai na', english: 'disliked', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-totemo', japanese: 'とても', romaji: 'totemo', english: 'very', partOfSpeech: 'adverb', jlptLevel: 'N5' },
            { id: 'v9-daisuki', japanese: 'だいすき', romaji: 'daisuki', english: 'love / like a lot', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g9-suki-kirai',
            pattern: '[noun] が すきです / きらいです',
            explanation: 'Preferences use が: [item]がすきです = I like [item]. [item]がきらいです = I dislike [item].',
            structure: '[noun] が すきです / だいすきです / きらいです',
            examples: ['にほんごがすきです。', 'さかながきらいです。', 'おまつりがだいすきです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex9-6-1', japanese: 'にほんごがすきです。', romaji: 'Nihongo ga suki desu.', english: 'I like Japanese.', vocabIds: ['v9-suki'], grammarIds: ['g9-suki-kirai'] },
            { id: 'ex9-6-2', japanese: 'さかながきらいです。', romaji: 'Sakana ga kirai desu.', english: 'I dislike fish.', vocabIds: ['v9-kirai'], grammarIds: ['g9-suki-kirai'] },
            { id: 'ex9-6-3', japanese: 'おまつりがだいすきです。', romaji: 'Omatsuri ga daisuki desu.', english: 'I love festivals!', vocabIds: ['v9-daisuki'], grammarIds: ['g9-suki-kirai'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks if you like Japanese festivals:",
            options: [
              { id: 'a', label: 'はい、おまつりがだいすきです', outcome: 'correct', reaction: '「わあ、うれしい！」 Yuki beams.' },
              { id: 'b', label: 'はい、おまつりをだいすきです', outcome: 'wrong', reaction: 'Preferences take が: おまつりが すきです.' },
              { id: 'c', label: 'はい、おまつりはすきです', outcome: 'partial', reaction: 'Understood — but が is more natural for preference.' },
            ]
          },
          dialogueChains: [{ id: 'dl9-2-2', turns: [
            { speaker: 'Yuki', line: { 0: 'なにがすきですか？', 2: '何が好き？' }, isLearnerTurn: false, translation: 'What do you like?' },
            { speaker: 'You', expectedAnswer: 'にほんごとおまつりがすきです', acceptedAnswers: ['にほんごがすきです', 'おまつりがだいすきです', 'にほんごとおまつりがすきです。'], isLearnerTurn: true, translation: 'I like Japanese and festivals.' },
            { speaker: 'Yuki', line: { 0: 'わたしも！よかった！', 2: '私も！' }, isLearnerTurn: false, translation: 'Me too! Great!' },
          ]}],
          questions: [
            { id: 'q9-6-1', type: 'translation-en-jp', prompt: '"I like Japanese."', correctAnswer: 'にほんごがすきです', acceptedAnswers: ['にほんごがすきです。'] },
            { id: 'q9-6-2', type: 'fill-in-blank', prompt: '「さかな___きらいです。」', correctAnswer: 'が' },
            { id: 'q9-6-3', type: 'multiple-choice', prompt: '"I love festivals!" — most expressive:', options: ['おまつりがだいすきです', 'おまつりがすきです', 'おまつりがきらいです', 'おまつりをすきです'], correctAnswer: 'おまつりがだいすきです' },
          ],
          successMessage: 'Preferences expressed. Your likes are known.',
          emotionalFeedback: {
            perfect: '「趣味が合いますね！」',
            good: 'Likes and dislikes clear.',
            struggle: 'Preference: noun + が + すき/きらい. That が is key.',
          }
        },
        {
          id: 'L9-U2-M3',
          title: 'Describing people',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "You meet more people at the festival. Describe them to Yuki.",
          goal: 'Combine い and な adjectives to describe people.',
          vocabulary: [
            { id: 'v9-yasashii', japanese: 'やさしい', romaji: 'yasashii', english: 'kind / gentle', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-genki', japanese: 'げんきな', romaji: 'genki na', english: 'energetic / healthy', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v9-hansamu', japanese: 'ハンサムな', romaji: 'hansamu na', english: 'handsome', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g9-person-desc',
            pattern: '[person] は [adj] で、[adj] です',
            explanation: 'Combine adjectives: use で after い-adj (dropping い → くて) or after な-adj (adding で).',
            structure: '[い-adj stem]くて / [な-adj]で + [next adj]',
            examples: ['このひとはやさしくて、きれいです。', 'たなかさんはげんきで、やさしいです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex9-7-1', japanese: 'このひとはやさしくて、きれいです。', romaji: 'Kono hito wa yasashikute, kirei desu.', english: 'This person is kind and beautiful.', vocabIds: ['v9-yasashii', 'v9-kirei'], grammarIds: ['g9-person-desc'] },
            { id: 'ex9-7-2', japanese: 'たなかさんはげんきで、やさしいです。', romaji: 'Tanaka-san wa genki de, yasashii desu.', english: 'Mrs. Tanaka is energetic and kind.', vocabIds: ['v9-genki', 'v9-yasashii'], grammarIds: ['g9-person-desc'] },
          ],
          branchingChoice: {
            prompt: "You want to describe Yuki as energetic and kind:",
            options: [
              { id: 'a', label: 'ゆきさんはげんきで、やさしいです', outcome: 'correct', reaction: '「えー！ありがとう！はずかしい！」 Yuki blushes.' },
              { id: 'b', label: 'ゆきさんはげんきと、やさしいです', outcome: 'wrong', reaction: 'Use で to connect adjectives, not と.' },
              { id: 'c', label: 'ゆきさんはげんきくて、やさしいです', outcome: 'wrong', reaction: 'げんき is a な-adjective. Connect with で, not くて.' },
            ]
          },
          dialogueChains: [{ id: 'dl9-2-3', turns: [
            { speaker: 'Yuki', line: { 0: 'たなかさんはどんなひとですか？', 2: '田中さんってどんな人？' }, isLearnerTurn: false, translation: 'What kind of person is Mrs. Tanaka?' },
            { speaker: 'You', expectedAnswer: 'やさしくて、げんきなひとです', acceptedAnswers: ['やさしいひとです', 'げんきで、やさしいです', 'やさしくて、げんきなひとです。'], isLearnerTurn: true, translation: 'She is a kind and energetic person.' },
            { speaker: 'Yuki', line: { 0: 'そうですね！だいすき！', 2: 'そう！大好き！' }, isLearnerTurn: false, translation: "That's right! I love her!" },
          ]}],
          questions: [
            { id: 'q9-7-1', type: 'translation-en-jp', prompt: '"Mrs. Tanaka is kind and beautiful."', correctAnswer: 'たなかさんはやさしくて、きれいです', acceptedAnswers: ['たなかさんはやさしくてきれいです'] },
            { id: 'q9-7-2', type: 'fill-in-blank', prompt: '「このひとはげんき___、やさしいです。」', correctAnswer: 'で' },
            { id: 'q9-7-3', type: 'multiple-choice', prompt: '"kind and energetic" — correct connection:', options: ['やさしくて、げんきです', 'やさしいと、げんきです', 'やさしくで、げんきです', 'やさしく、げんきです'], correctAnswer: 'やさしくて、げんきです' },
          ],
          successMessage: 'Multi-adjective descriptions flowing naturally.',
          emotionalFeedback: {
            perfect: '「詩人みたい！」',
            good: 'People described beautifully.',
            struggle: 'い-adj → くて. な-adj → で. Two connectors, clear rule.',
          }
        },
        {
          id: 'L9-U2-M4',
          title: 'Level 9 Checkpoint',
          kind: 'checkpoint',
          estimatedMinutes: 2,
          isCheckpoint: true,
          minPassScore: 80,
          scenario: "Final test: い-adjectives, な-adjectives, negation, pre-noun forms, and preferences.",
          goal: 'Demonstrate full command of Level 9 adjectives.',
          vocabulary: [],
          grammar: [],
          examples: [],
          branchingChoice: {
            prompt: "Describe the festival: it's lively and fun:",
            options: [
              { id: 'a', label: 'にぎやかで、たのしいです', outcome: 'correct', reaction: '「まさにそれ！」' },
              { id: 'b', label: 'にぎやかいで、たのしいです', outcome: 'wrong', reaction: 'にぎやか is a な-adjective — no い.' },
              { id: 'c', label: 'にぎやかで、たのしくないです', outcome: 'wrong', reaction: 'You said it\'s not fun. Use たのしいです.' },
            ]
          },
          dialogueChains: [{ id: 'dl9-2-4', turns: [
            { speaker: 'Yuki', line: 'けいようしテストです！', isLearnerTurn: false, translation: 'Adjective test!' },
            { speaker: 'You', expectedAnswer: 'にほんごがすきです', acceptedAnswers: ['にほんごがすきです。', 'おまつりがすきです'], isLearnerTurn: true, translation: 'I like Japanese.' },
            { speaker: 'Yuki', line: '合格！やったね！', isLearnerTurn: false, translation: 'Pass! You did it!' },
          ]}],
          questions: [
            { id: 'q9-cp-1', type: 'translation-en-jp', prompt: '"This movie is interesting."', correctAnswer: 'このえいがはおもしろいです', acceptedAnswers: ['このえいがはおもしろいです。'] },
            { id: 'q9-cp-2', type: 'translation-en-jp', prompt: '"It\'s not expensive."', correctAnswer: 'たかくないです', acceptedAnswers: ['たかくないです。'] },
            { id: 'q9-cp-3', type: 'fill-in-blank', prompt: '「きれい___はなです。」', correctAnswer: 'な' },
            { id: 'q9-cp-4', type: 'sentence-build', prompt: 'Build: "I like festivals."', correctAnswer: 'おまつりがすきです' },
            { id: 'q9-cp-5', type: 'translation-jp-en', prompt: '「このへやはしずかです」', correctAnswer: 'This room is quiet', acceptedAnswers: ['This room is quiet.'] },
            { id: 'q9-cp-6', type: 'multiple-choice', prompt: '"a beautiful flower" — correct:', options: ['きれいなはな', 'きれいはな', 'きれいいはな', 'はなはきれい'], correctAnswer: 'きれいなはな' },
          ],
          successMessage: 'Level 9 complete. You can describe anything in Japanese.',
          emotionalFeedback: {
            perfect: '「言葉の達人！」',
            good: 'Adjective mastery achieved.',
            struggle: 'You cleared it. Adjectives are your new tools.',
          }
        },
      ]
    }
  ],
  challengeMission: {
    id: 'JL9-challenge',
    title: 'Festival Critic Challenge',
    kind: 'checkpoint',
    estimatedMinutes: 2,
    scenario: "The school newspaper wants festival reviews. Prove you can describe everything at the festival with precision.",
    vocabulary: [],
    grammar: [],
    examples: [],
    questions: [
      { id: 'q9-ch-1', type: 'translation-en-jp', prompt: '"This dish is delicious."', correctAnswer: 'このりょうりはおいしいです', acceptedAnswers: ['このりょうりはおいしいです。'] },
      { id: 'q9-ch-2', type: 'multiple-choice', prompt: '"It\'s not expensive." — correct:', options: ['たかくないです', 'たかいないです', 'たかないです', 'たかくです'], correctAnswer: 'たかくないです' },
      { id: 'q9-ch-3', type: 'fill-in-blank', prompt: '「にぎやか___おまつりです。」', correctAnswer: 'な' },
      { id: 'q9-ch-4', type: 'translation-en-jp', prompt: '"I like Japanese."', correctAnswer: 'にほんごがすきです', acceptedAnswers: ['にほんごがすきです。'] },
      { id: 'q9-ch-5', type: 'multiple-choice', prompt: '"a lively festival" — correct:', options: ['にぎやかなおまつり', 'にぎやかいおまつり', 'にぎやかおまつり', 'おまつりはにぎやか'], correctAnswer: 'にぎやかなおまつり' },
      { id: 'q9-ch-6', type: 'sentence-build', prompt: 'Build: "I love festivals."', correctAnswer: 'おまつりがだいすきです' },
      { id: 'q9-ch-7', type: 'translation-jp-en', prompt: '「このへやはしずかです」', correctAnswer: 'This room is quiet', acceptedAnswers: ['This room is quiet.'] },
      { id: 'q9-ch-8', type: 'fill-in-blank', prompt: '「おいし___ないです。」(not delicious)', correctAnswer: 'く' },
      { id: 'q9-ch-9', type: 'multiple-choice', prompt: '"It\'s not good." (いい negative):', options: ['よくないです', 'いくないです', 'いいくないです', 'よないです'], correctAnswer: 'よくないです' },
      { id: 'q9-ch-10', type: 'translation-en-jp', prompt: '"a big dog"', correctAnswer: 'おおきいいぬ', acceptedAnswers: ['おおきいいぬ'] },
      { id: 'q9-ch-11', type: 'sentence-build', prompt: 'Build: "Mrs. Tanaka is kind and energetic."', correctAnswer: 'たなかさんはやさしくて、げんきです' },
      { id: 'q9-ch-12', type: 'fill-in-blank', prompt: '「さかな___きらいです。」', correctAnswer: 'が' },
      { id: 'q9-ch-13', type: 'translation-en-jp', prompt: '"This movie is not interesting."', correctAnswer: 'このえいがはおもしろくないです', acceptedAnswers: ['このえいがはおもしろくないです。'] },
      { id: 'q9-ch-14', type: 'multiple-choice', prompt: '"a beautiful flower" — correct:', options: ['きれいなはな', 'きれいはな', 'きれいいはな', 'はなはきれいな'], correctAnswer: 'きれいなはな' },
      { id: 'q9-ch-15', type: 'translation-jp-en', prompt: '「にほんごがだいすきです」', correctAnswer: 'I love Japanese', acceptedAnswers: ['I really like Japanese.'] },
    ],
  }
};
