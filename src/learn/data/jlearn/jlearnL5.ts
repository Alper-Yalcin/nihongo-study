import { JLearnLevel } from './jlearnTypes';

export const jlearnLevel5: JLearnLevel = {
  id: 'JL5',
  title: 'Possession',
  theme: 'Express ownership and family relationships using の.',
  location: 'Tanaka House',
  jlptAlignment: 'N5',
  genkiChapters: [2],
  checkpointUnitId: 'L5-U2',
  badge: { id: 'badge-connector', name: 'Connector', description: 'You can link people to their belongings and family.' },
  storyHook: {
    type: 'invitation-tease',
    speaker: 'Mrs. Tanaka',
    teaser: "Mrs. Tanaka gestures around her living room, pointing at photos on the shelf.",
    japanese: 'これは私の家族の写真です。',
    translation: 'These are photos of my family.'
  },
  units: [
    {
      id: 'L5-U1',
      title: 'の — Possession',
      summary: "Use の to show ownership: 'X's Y'.",
      steps: [
        {
          id: 'L5-U1-M1',
          title: "Whose bag?",
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: "A bag is left at the door. Mrs. Tanaka asks if it's yours.",
          goal: 'Use の to express possession.',
          vocabulary: [
            { id: 'v5-no', japanese: 'の', romaji: 'no', english: 'possessive particle (X\'s)', partOfSpeech: 'particle', jlptLevel: 'N5' },
            { id: 'v5-kaban', japanese: 'かばん', romaji: 'kaban', english: 'bag', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v5-watashi', japanese: 'わたし', romaji: 'watashi', english: 'I / me', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v5-dare', japanese: 'だれ', romaji: 'dare', english: 'who', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g5-no-possession',
            pattern: 'X の Y',
            explanation: "の links a possessor (X) to what they own (Y). Like 's in English.",
            structure: '[owner] の [owned noun]',
            examples: ['わたしのかばんです。', 'だれのかばんですか。', 'たなかさんのいえです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex5-1-1', japanese: 'わたしのかばんです。', romaji: 'Watashi no kaban desu.', english: "It's my bag.", vocabIds: ['v5-watashi', 'v5-no', 'v5-kaban'], grammarIds: ['g5-no-possession'] },
            { id: 'ex5-1-2', japanese: 'だれのかばんですか。', romaji: 'Dare no kaban desu ka.', english: "Whose bag is it?", vocabIds: ['v5-dare', 'v5-no', 'v5-kaban'], grammarIds: ['g5-no-possession'] },
            { id: 'ex5-1-3', japanese: 'たなかさんのかばんです。', romaji: 'Tanaka-san no kaban desu.', english: "It's Mrs. Tanaka's bag.", vocabIds: ['v5-no', 'v5-kaban'], grammarIds: ['g5-no-possession'] },
          ],
          branchingChoice: {
            prompt: "Mrs. Tanaka holds up a book. She asks whose it is. You say it's yours:",
            options: [
              { id: 'a', label: 'わたしのほんです', outcome: 'correct', reaction: '「あ、そうですか。」 She places it on the table for you.' },
              { id: 'b', label: 'ほんはわたしです', outcome: 'wrong', reaction: 'の is missing — the possessive particle is essential here.' },
              { id: 'c', label: 'わたしはほんです', outcome: 'wrong', reaction: 'This says "I am a book." Use の between owner and item.' },
            ]
          },
          dialogueChains: [{ id: 'dl5-1-1', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'これはだれのかばんですか？', 2: 'このかばん、だれの？' }, isLearnerTurn: false, translation: "Whose bag is this?" },
            { speaker: 'You', expectedAnswer: 'わたしのかばんです', acceptedAnswers: ['わたしのかばんです。', 'わたしのです'], isLearnerTurn: true, translation: "It's my bag." },
            { speaker: 'Mrs. Tanaka', line: { 0: 'あ、そうですか。どうぞ。', 2: 'あ、そう！はい。' }, isLearnerTurn: false, translation: "Oh, I see. Here you go." },
          ]}],
          questions: [
            { id: 'q5-1-1', type: 'multiple-choice', prompt: '"Whose bag?" — correct form:', options: ['だれのかばん', 'かばんのだれ', 'だれかばん', 'のだれかばん'], correctAnswer: 'だれのかばん' },
            { id: 'q5-1-2', type: 'translation-en-jp', prompt: '"It\'s my bag."', correctAnswer: 'わたしのかばんです', acceptedAnswers: ['わたしのかばんです。'] },
            { id: 'q5-1-3', type: 'fill-in-blank', prompt: '「たなかさん___かばんです。」', correctAnswer: 'の' },
          ],
          successMessage: 'Mrs. Tanaka nods. の makes ownership clear.',
          emotionalFeedback: {
            perfect: '「上手！」 Mrs. Tanaka smiles warmly.',
            good: 'Ownership expressed correctly.',
            struggle: 'の links people to things. You are getting there.',
          }
        },
        {
          id: 'L5-U1-M2',
          title: 'Family words',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: 'Mrs. Tanaka shows you photos of her family.',
          goal: 'Learn family vocabulary and use の to link them.',
          vocabulary: [
            { id: 'v5-okaasan', japanese: 'おかあさん', romaji: 'okaasan', english: 'mother (polite)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v5-otoosan', japanese: 'おとうさん', romaji: 'otousan', english: 'father (polite)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v5-imouto', japanese: 'いもうと', romaji: 'imouto', english: 'younger sister (own)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v5-oniisan', japanese: 'おにいさん', romaji: 'oniisan', english: 'older brother (polite)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v5-kazoku', japanese: 'かぞく', romaji: 'kazoku', english: 'family', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g5-family-no',
            pattern: 'X の おかあさん',
            explanation: "Use の between a name/pronoun and a family member to show relationship.",
            structure: '[name/pronoun] の [family member]',
            examples: ['わたしのおかあさんです。', 'たなかさんのおにいさんです。', 'ゆきのいもうとです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex5-2-1', japanese: 'わたしのおかあさんです。', romaji: 'Watashi no okaasan desu.', english: "That's my mother.", vocabIds: ['v5-watashi', 'v5-no', 'v5-okaasan'], grammarIds: ['g5-family-no'] },
            { id: 'ex5-2-2', japanese: 'たなかさんのおにいさんです。', romaji: 'Tanaka-san no oniisan desu.', english: "That's Mrs. Tanaka's older brother.", vocabIds: ['v5-no', 'v5-oniisan'], grammarIds: ['g5-family-no'] },
            { id: 'ex5-2-3', japanese: 'これはかぞくのしゃしんです。', romaji: 'Kore wa kazoku no shashin desu.', english: "This is a family photo.", vocabIds: ['v5-kazoku', 'v5-no'], grammarIds: ['g5-family-no'] },
          ],
          branchingChoice: {
            prompt: "Mrs. Tanaka points at a photo. You want to say 'This is Yuki's older brother':",
            options: [
              { id: 'a', label: 'これはゆきのおにいさんです', outcome: 'correct', reaction: '「そうですよ！よく知ってますね。」' },
              { id: 'b', label: 'ゆきはおにいさんです', outcome: 'wrong', reaction: 'This says Yuki is an older brother. Use の to link.' },
              { id: 'c', label: 'これはおにいさんのゆきです', outcome: 'wrong', reaction: "の goes the other way: possessor の owned. Say ゆきの おにいさん." },
            ]
          },
          dialogueChains: [{ id: 'dl5-1-2', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'これはわたしのかぞくのしゃしんです。', 2: 'これ、うちの家族の写真。' }, isLearnerTurn: false, translation: "This is a photo of my family." },
            { speaker: 'You', expectedAnswer: 'これはたなかさんのおかあさんですか', acceptedAnswers: ['たなかさんのおかあさんですか。', 'おかあさんですか'], isLearnerTurn: true, translation: "Is this your mother?" },
            { speaker: 'Mrs. Tanaka', line: { 0: 'はい、そうです。やさしいですよ。', 2: 'そう！やさしい人でしょ？' }, isLearnerTurn: false, translation: "Yes, that's right. She's kind." },
          ]}],
          questions: [
            { id: 'q5-2-1', type: 'translation-en-jp', prompt: '"That\'s my younger sister."', correctAnswer: 'わたしのいもうとです', acceptedAnswers: ['わたしのいもうとです。'] },
            { id: 'q5-2-2', type: 'multiple-choice', prompt: "Yuki's mother — correct Japanese:", options: ['ゆきのおかあさん', 'おかあさんのゆき', 'ゆきがおかあさん', 'おかあさんゆき'], correctAnswer: 'ゆきのおかあさん' },
            { id: 'q5-2-3', type: 'fill-in-blank', prompt: '「たなかさん___いもうとさんです。」', correctAnswer: 'の' },
          ],
          successMessage: 'Family vocab in the bank. の makes it flow.',
          emotionalFeedback: {
            perfect: '「家族みたいに話せますね！」',
            good: 'Clean and correct. Well done.',
            struggle: 'Family words take repetition. Keep at it.',
          }
        },
        {
          id: 'L5-U1-M3',
          title: "That's mine",
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: 'Multiple items on the table. Claim yours and ask about others.',
          goal: 'Use の independently (without the noun) to say "mine".',
          vocabulary: [
            { id: 'v5-watashino', japanese: 'わたしの', romaji: 'watashi no', english: 'mine', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v5-anata', japanese: 'あなた', romaji: 'anata', english: 'you', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g5-no-standalone',
            pattern: 'これはわたしのです',
            explanation: "の can stand alone after a possessor to replace a noun. わたしの = mine, あなたの = yours.",
            structure: '[demonstrative] は [owner] の です',
            examples: ['これはわたしのです。', 'それはあなたのですか。', 'このかばんはだれのですか。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex5-3-1', japanese: 'これはわたしのです。', romaji: 'Kore wa watashi no desu.', english: "This is mine.", vocabIds: ['v5-watashino'], grammarIds: ['g5-no-standalone'] },
            { id: 'ex5-3-2', japanese: 'それはあなたのですか。', romaji: 'Sore wa anata no desu ka.', english: "Is that yours?", vocabIds: ['v5-anata'], grammarIds: ['g5-no-standalone'] },
            { id: 'ex5-3-3', japanese: 'どれがあなたのですか。', romaji: 'Dore ga anata no desu ka.', english: "Which one is yours?", vocabIds: ['v5-anata'], grammarIds: ['g5-no-standalone'] },
          ],
          branchingChoice: {
            prompt: "Mrs. Tanaka holds up two pens. You want to say one of them is yours:",
            options: [
              { id: 'a', label: 'そのペンはわたしのです', outcome: 'correct', reaction: '「あ、ごめんなさい！」 She hands it over.' },
              { id: 'b', label: 'そのペンはわたしです', outcome: 'wrong', reaction: 'Missing の — without it you\'re saying "I am that pen."' },
              { id: 'c', label: 'わたしのペンはそれです', outcome: 'partial', reaction: 'Understood, but the first form is more natural here.' },
            ]
          },
          dialogueChains: [{ id: 'dl5-1-3', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'これはだれのですか？', 2: 'これ、だれのだろう？' }, isLearnerTurn: false, translation: "Whose is this?" },
            { speaker: 'You', expectedAnswer: 'わたしのです', acceptedAnswers: ['それはわたしのです', 'わたしのです。'], isLearnerTurn: true, translation: "It's mine." },
            { speaker: 'Mrs. Tanaka', line: { 0: 'そうですか。どうぞ。', 2: 'はい、どうぞ！' }, isLearnerTurn: false, translation: "I see. Here you go." },
          ]}],
          questions: [
            { id: 'q5-3-1', type: 'translation-en-jp', prompt: '"Is this yours?"', correctAnswer: 'これはあなたのですか', acceptedAnswers: ['これはあなたのですか？'] },
            { id: 'q5-3-2', type: 'fill-in-blank', prompt: '「これはわたし___です。」(standalone mine)', correctAnswer: 'の' },
            { id: 'q5-3-3', type: 'multiple-choice', prompt: '"Which one is mine?" — best Japanese:', options: ['どれがわたしのですか', 'わたしのどれですか', 'どれはわたしのです', 'わたしはどれですか'], correctAnswer: 'どれがわたしのですか' },
          ],
          successMessage: 'Ownership claimed. の stands strong on its own.',
          emotionalFeedback: {
            perfect: '「正確です！」 Mrs. Tanaka is impressed.',
            good: 'Clear and correct.',
            struggle: 'の alone takes getting used to. You are managing.',
          }
        },
        {
          id: 'L5-U1-M4',
          title: 'Possession review',
          kind: 'review',
          estimatedMinutes: 1,
          scenario: "Wrap up Unit 1: ownership, family, and standalone の.",
          goal: 'Solidify all forms of の possession.',
          vocabulary: [
            { id: 'v5-tomodachi', japanese: 'ともだち', romaji: 'tomodachi', english: 'friend', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v5-sensei', japanese: 'せんせい', romaji: 'sensei', english: 'teacher', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g5-no-review',
            pattern: 'X の Y / X の (standalone)',
            explanation: "の works for any possessor: people, names, pronouns — followed by a noun or alone.",
            structure: '[possessor] の ([noun])',
            examples: ['ともだちのほんです。', 'せんせいのかばんですか？', 'わたしのです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex5-4-1', japanese: 'ともだちのほんです。', romaji: 'Tomodachi no hon desu.', english: "It's my friend's book.", vocabIds: ['v5-tomodachi', 'v5-no'], grammarIds: ['g5-no-review'] },
            { id: 'ex5-4-2', japanese: 'せんせいのかばんですか。', romaji: 'Sensei no kaban desu ka.', english: "Is it the teacher's bag?", vocabIds: ['v5-sensei', 'v5-no'], grammarIds: ['g5-no-review'] },
          ],
          branchingChoice: {
            prompt: "Someone asks if the book on the table is your friend's. You confirm:",
            options: [
              { id: 'a', label: 'ともだちのほんです', outcome: 'correct', reaction: '「なるほど！」 Understood immediately.' },
              { id: 'b', label: 'ともだちほんです', outcome: 'wrong', reaction: 'の is missing. Without it, the sentence breaks.' },
              { id: 'c', label: 'ともだちのです', outcome: 'partial', reaction: 'Correct with standalone の, though adding ほん makes it clearer.' },
            ]
          },
          dialogueChains: [{ id: 'dl5-1-4', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'このほんはせんせいのですか？', 2: 'このほん、先生の？' }, isLearnerTurn: false, translation: "Is this book the teacher's?" },
            { speaker: 'You', expectedAnswer: 'いいえ、わたしのともだちのほんです', acceptedAnswers: ['いいえ、ともだちのほんです', 'ともだちのです'], isLearnerTurn: true, translation: "No, it's my friend's book." },
            { speaker: 'Mrs. Tanaka', line: { 0: 'そうですか。わかりました。', 2: 'あ、そっか。' }, isLearnerTurn: false, translation: "I see. Got it." },
          ]}],
          questions: [
            { id: 'q5-4-1', type: 'translation-en-jp', prompt: '"It\'s the teacher\'s bag."', correctAnswer: 'せんせいのかばんです', acceptedAnswers: ['せんせいのかばんです。'] },
            { id: 'q5-4-2', type: 'sentence-build', prompt: "Build: \"That is my friend's book.\"", correctAnswer: 'それはともだちのほんです' },
            { id: 'q5-4-3', type: 'multiple-choice', prompt: 'Most natural: "It\'s the teacher\'s":', options: ['せんせいのです', 'せんせいです', 'せんせいはのです', 'せんせいのは'], correctAnswer: 'せんせいのです' },
          ],
          successMessage: 'の possession is second nature now.',
          emotionalFeedback: {
            perfect: '「完璧！」 Mrs. Tanaka serves tea.',
            good: 'Well handled.',
            struggle: 'の is simple once you lock it in.',
          }
        },
      ]
    },
    {
      id: 'L5-U2',
      title: 'の in Real Life',
      summary: 'Combine possession with demonstratives, family, and context-rich questions.',
      steps: [
        {
          id: 'L5-U2-M1',
          title: 'Family photos',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "Mrs. Tanaka shows you a full family photo album.",
          goal: 'Use の with multiple family members in connected sentences.',
          vocabulary: [
            { id: 'v5-oneechan', japanese: 'おねえさん', romaji: 'oneesan', english: 'older sister (polite)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v5-otouto', japanese: 'おとうと', romaji: 'otouto', english: 'younger brother (own)', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v5-photo', japanese: 'しゃしん', romaji: 'shashin', english: 'photo / picture', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g5-chain-no',
            pattern: 'X の Y の Z',
            explanation: "の can chain: わたしの おかあさんの しゃしん = a photo of my mother.",
            structure: '[person1] の [relation] の [item]',
            examples: ['わたしのおかあさんのしゃしんです。', 'たなかさんのおとうとのほんです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex5-5-1', japanese: 'わたしのおかあさんのしゃしんです。', romaji: 'Watashi no okaasan no shashin desu.', english: "It's a photo of my mother.", vocabIds: ['v5-okaasan', 'v5-no', 'v5-photo'], grammarIds: ['g5-chain-no'] },
            { id: 'ex5-5-2', japanese: 'これはたなかさんのおとうとですか。', romaji: 'Kore wa Tanaka-san no otouto desu ka.', english: "Is this Mrs. Tanaka's younger brother?", vocabIds: ['v5-otouto', 'v5-no'], grammarIds: ['g5-chain-no'] },
          ],
          branchingChoice: {
            prompt: "Mrs. Tanaka shows a photo. You want to ask if it's her older sister:",
            options: [
              { id: 'a', label: 'これはたなかさんのおねえさんですか', outcome: 'correct', reaction: '「そうです！よく知ってますね。」' },
              { id: 'b', label: 'たなかさんはおねえさんですか', outcome: 'wrong', reaction: 'This asks if Mrs. Tanaka herself is an older sister.' },
              { id: 'c', label: 'これはおねえさんのたなかさんですか', outcome: 'wrong', reaction: 'の goes possessor → possessed, not the other way.' },
            ]
          },
          dialogueChains: [{ id: 'dl5-2-1', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'これはわたしのおかあさんのしゃしんです。', 2: 'これ、お母さんの写真。' }, isLearnerTurn: false, translation: "This is a photo of my mother." },
            { speaker: 'You', expectedAnswer: 'きれいなかたですね', acceptedAnswers: ['きれいです', 'おきれいですね', 'きれいなかたですね。'], isLearnerTurn: true, translation: "She's a beautiful person." },
            { speaker: 'Mrs. Tanaka', line: { 0: 'ありがとう！よろこびます。', 2: 'ありがとう、よろこぶよ！' }, isLearnerTurn: false, translation: "Thank you! She'll be pleased." },
          ]}],
          questions: [
            { id: 'q5-5-1', type: 'translation-en-jp', prompt: '"This is a photo of Mrs. Tanaka\'s older sister."', correctAnswer: 'これはたなかさんのおねえさんのしゃしんです', acceptedAnswers: ['たなかさんのおねえさんのしゃしんです'] },
            { id: 'q5-5-2', type: 'multiple-choice', prompt: '"My younger brother" — correct form:', options: ['わたしのおとうと', 'おとうとのわたし', 'わたしはおとうと', 'おとうとはわたしの'], correctAnswer: 'わたしのおとうと' },
            { id: 'q5-5-3', type: 'fill-in-blank', prompt: '「これはたなかさん___おねえさんです。」', correctAnswer: 'の' },
          ],
          successMessage: 'Family tree navigated smoothly with の.',
          emotionalFeedback: {
            perfect: '「すごい！かぞくをもう知ってる！」',
            good: 'You followed every link in the chain.',
            struggle: 'Chaining の is a big step. You are on track.',
          }
        },
        {
          id: 'L5-U2-M2',
          title: "What's in your room?",
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Mrs. Tanaka shows you the guest room. You describe things around you.",
          goal: 'Describe possessions in a room using の combinations.',
          vocabulary: [
            { id: 'v5-heya', japanese: 'へや', romaji: 'heya', english: 'room', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v5-tsukue', japanese: 'つくえ', romaji: 'tsukue', english: 'desk', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v5-hon', japanese: 'ほん', romaji: 'hon', english: 'book', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g5-room-possession',
            pattern: 'わたしのへやのつくえです',
            explanation: "Chain の to place a possessed item in a location: my room's desk.",
            structure: '[owner] の [location] の [item]',
            examples: ['わたしのへやのつくえです。', 'たなかさんのへやのほんです。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex5-6-1', japanese: 'これはわたしのへやのつくえです。', romaji: 'Kore wa watashi no heya no tsukue desu.', english: "This is the desk in my room.", vocabIds: ['v5-heya', 'v5-tsukue', 'v5-no'], grammarIds: ['g5-room-possession'] },
            { id: 'ex5-6-2', japanese: 'あそこにわたしのほんがあります。', romaji: 'Asoko ni watashi no hon ga arimasu.', english: "My book is over there.", vocabIds: ['v5-hon', 'v5-no'], grammarIds: [] },
          ],
          branchingChoice: {
            prompt: "Mrs. Tanaka asks whose desk is by the window. You say it's yours:",
            options: [
              { id: 'a', label: 'わたしのつくえです', outcome: 'correct', reaction: '「あ、そうですか。どうぞ使ってください。」' },
              { id: 'b', label: 'つくえはわたしです', outcome: 'wrong', reaction: 'の is needed: わたしの つくえ.' },
              { id: 'c', label: 'わたしつくえです', outcome: 'wrong', reaction: 'Particle の is missing between owner and noun.' },
            ]
          },
          dialogueChains: [{ id: 'dl5-2-2', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'これはだれのへやですか？', 2: 'この部屋、だれが使う？' }, isLearnerTurn: false, translation: "Whose room is this?" },
            { speaker: 'You', expectedAnswer: 'わたしのへやですか', acceptedAnswers: ['わたしのへやですか？', 'わたしのですか'], isLearnerTurn: true, translation: "Is it my room?" },
            { speaker: 'Mrs. Tanaka', line: { 0: 'そうです！どうぞ。', 2: 'そうよ！どうぞ。' }, isLearnerTurn: false, translation: "That's right! Please go ahead." },
          ]}],
          questions: [
            { id: 'q5-6-1', type: 'translation-en-jp', prompt: '"That is my desk."', correctAnswer: 'それはわたしのつくえです', acceptedAnswers: ['それはわたしのつくえです。'] },
            { id: 'q5-6-2', type: 'fill-in-blank', prompt: '「これはたなかさん___へやです。」', correctAnswer: 'の' },
            { id: 'q5-6-3', type: 'multiple-choice', prompt: '"My book" — correct form:', options: ['わたしのほん', 'ほんのわたし', 'わたしほん', 'わたしがほん'], correctAnswer: 'わたしのほん' },
          ],
          successMessage: "Room vocabulary secured. の chains holding strong.",
          emotionalFeedback: {
            perfect: '「完璧に話せますね！」',
            good: 'Every possession linked correctly.',
            struggle: 'Keep chaining. It gets natural fast.',
          }
        },
        {
          id: 'L5-U2-M3',
          title: "Asking 'whose'",
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Items get mixed up after dinner. You and Mrs. Tanaka sort them out.",
          goal: 'Ask and answer ownership questions fluently using だれの.',
          vocabulary: [
            { id: 'v5-keitai', japanese: 'けいたい', romaji: 'keitai', english: 'mobile phone', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v5-megane', japanese: 'めがね', romaji: 'megane', english: 'glasses', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g5-dareno',
            pattern: 'これはだれのですか → ～のです',
            explanation: "Full Q&A pattern for ownership: ask with だれの, answer with [owner]の.",
            structure: 'これ/それ/あれ は だれの ですか → [owner] の です',
            examples: ['これはだれのけいたいですか。', 'わたしのです。', 'たなかさんのめがねです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex5-7-1', japanese: 'これはだれのけいたいですか。', romaji: 'Kore wa dare no keitai desu ka.', english: "Whose phone is this?", vocabIds: ['v5-dare', 'v5-no', 'v5-keitai'], grammarIds: ['g5-dareno'] },
            { id: 'ex5-7-2', japanese: 'ゆきのけいたいです。', romaji: 'Yuki no keitai desu.', english: "It's Yuki's phone.", vocabIds: ['v5-keitai', 'v5-no'], grammarIds: ['g5-dareno'] },
            { id: 'ex5-7-3', japanese: 'このめがねはだれのですか。', romaji: 'Kono megane wa dare no desu ka.', english: "Whose glasses are these?", vocabIds: ['v5-megane', 'v5-dare', 'v5-no'], grammarIds: ['g5-dareno'] },
          ],
          branchingChoice: {
            prompt: "A phone is on the table. Mrs. Tanaka asks whose it is. You say it's Yuki's:",
            options: [
              { id: 'a', label: 'ゆきのけいたいです', outcome: 'correct', reaction: '「あ、そうですか！ゆきちゃんに聞きましょう。」' },
              { id: 'b', label: 'けいたいはゆきです', outcome: 'wrong', reaction: 'Missing の: ゆきのけいたい.' },
              { id: 'c', label: 'ゆきのです', outcome: 'partial', reaction: 'Correct with standalone の — more specific with けいたい though.' },
            ]
          },
          dialogueChains: [{ id: 'dl5-2-3', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'このめがねはだれのですか？', 2: 'このめがね、だれの？' }, isLearnerTurn: false, translation: "Whose glasses are these?" },
            { speaker: 'You', expectedAnswer: 'たなかさんのめがねですか', acceptedAnswers: ['たなかさんのですか', 'たなかさんのめがねですか？'], isLearnerTurn: true, translation: "Are these your glasses?" },
            { speaker: 'Mrs. Tanaka', line: { 0: 'そうです！よかった、みつかりました。', 2: 'そう！よかった！' }, isLearnerTurn: false, translation: "Yes! Good, found them." },
          ]}],
          questions: [
            { id: 'q5-7-1', type: 'translation-en-jp', prompt: '"Whose phone is this?"', correctAnswer: 'これはだれのけいたいですか', acceptedAnswers: ['これはだれのけいたいですか？'] },
            { id: 'q5-7-2', type: 'fill-in-blank', prompt: '「これはゆき___けいたいです。」', correctAnswer: 'の' },
            { id: 'q5-7-3', type: 'multiple-choice', prompt: '"It\'s Mrs. Tanaka\'s glasses." — best answer:', options: ['たなかさんのめがねです', 'めがねたなかさんです', 'たなかさんはめがねです', 'めがねのたなかさん'], correctAnswer: 'たなかさんのめがねです' },
          ],
          successMessage: 'Every item returned to its rightful owner.',
          emotionalFeedback: {
            perfect: '「探偵みたい！」 Mrs. Tanaka laughs.',
            good: 'Sorted out in record time.',
            struggle: 'だれの is a great pattern. You are using it.',
          }
        },
        {
          id: 'L5-U2-M4',
          title: 'Level 5 Checkpoint',
          kind: 'checkpoint',
          estimatedMinutes: 2,
          isCheckpoint: true,
          minPassScore: 80,
          scenario: "Final test: possession, family vocabulary, standalone の, and chained の.",
          goal: 'Demonstrate full command of Level 5 の possession.',
          vocabulary: [],
          grammar: [],
          examples: [],
          branchingChoice: {
            prompt: "You find a book. You want to ask if it belongs to Mrs. Tanaka:",
            options: [
              { id: 'a', label: 'これはたなかさんのほんですか', outcome: 'correct', reaction: '「あ！わたしのです。ありがとう！」' },
              { id: 'b', label: 'これはほんのたなかさんですか', outcome: 'wrong', reaction: 'の goes possessor → thing owned, not the reverse.' },
              { id: 'c', label: 'たなかさんはこれのほんですか', outcome: 'wrong', reaction: 'Keep the structure: [person]の[item].' },
            ]
          },
          dialogueChains: [{ id: 'dl5-2-4', turns: [
            { speaker: 'Mrs. Tanaka', line: 'さあ、テストです！', isLearnerTurn: false, translation: "Now, a test!" },
            { speaker: 'You', expectedAnswer: 'わたしのかばんはここにあります', acceptedAnswers: ['わたしのかばんです', 'これはわたしのです'], isLearnerTurn: true, translation: "My bag is here." },
            { speaker: 'Mrs. Tanaka', line: { 0: 'よくできました！', 2: 'よくできた！' }, isLearnerTurn: false, translation: "Well done!" },
          ]}],
          questions: [
            { id: 'q5-cp-1', type: 'multiple-choice', prompt: '"Yuki\'s bag" — correct form:', options: ['ゆきのかばん', 'かばんのゆき', 'ゆきかばん', 'かばんゆきの'], correctAnswer: 'ゆきのかばん' },
            { id: 'q5-cp-2', type: 'translation-en-jp', prompt: '"Is this Mrs. Tanaka\'s book?"', correctAnswer: 'これはたなかさんのほんですか', acceptedAnswers: ['これはたなかさんのほんですか？'] },
            { id: 'q5-cp-3', type: 'fill-in-blank', prompt: '「これはだれ___ですか。」(whose is it)', correctAnswer: 'の' },
            { id: 'q5-cp-4', type: 'sentence-build', prompt: "Build: \"It's my friend's book.\"", correctAnswer: 'ともだちのほんです' },
            { id: 'q5-cp-5', type: 'translation-jp-en', prompt: '「わたしのおかあさんのしゃしんです」', correctAnswer: "It's a photo of my mother", acceptedAnswers: ["It's my mother's photo."] },
            { id: 'q5-cp-6', type: 'multiple-choice', prompt: '"Mine" — standalone の form:', options: ['わたしのです', 'わたしのはです', 'わたしです', 'わたしのがです'], correctAnswer: 'わたしのです' },
          ],
          successMessage: 'Level 5 complete. Possession and family vocabulary mastered.',
          emotionalFeedback: {
            perfect: 'Mrs. Tanaka serves tea. 「本当に上手ですね。」',
            good: 'Solid grasp of の. Well done.',
            struggle: 'You cleared it. の is settling in.',
          }
        },
      ]
    }
  ],
  challengeMission: {
    id: 'JL5-challenge',
    title: 'Lost & Found Challenge',
    kind: 'checkpoint',
    estimatedMinutes: 2,
    scenario: "A pile of lost items has appeared at the Tanaka house. Who owns what? Mrs. Tanaka quizzes you on every possession.",
    vocabulary: [],
    grammar: [],
    examples: [],
    questions: [
      { id: 'q5-ch-1', type: 'translation-en-jp', prompt: '"Whose bag is this?"', correctAnswer: 'これはだれのかばんですか', acceptedAnswers: ['これはだれのかばんですか？'] },
      { id: 'q5-ch-2', type: 'multiple-choice', prompt: '"Yuki\'s phone" — correct form:', options: ['ゆきのけいたい', 'けいたいのゆき', 'ゆきけいたい', 'のゆきけいたい'], correctAnswer: 'ゆきのけいたい' },
      { id: 'q5-ch-3', type: 'fill-in-blank', prompt: '「これはわたし___ほんです。」', correctAnswer: 'の' },
      { id: 'q5-ch-4', type: 'translation-en-jp', prompt: '"It\'s my mother\'s photo."', correctAnswer: 'わたしのおかあさんのしゃしんです', acceptedAnswers: ['わたしのおかあさんのしゃしんです。'] },
      { id: 'q5-ch-5', type: 'multiple-choice', prompt: '"That is mine." — correct:', options: ['それはわたしのです', 'それはわたしです', 'わたしのそれです', 'それわたしのです'], correctAnswer: 'それはわたしのです' },
      { id: 'q5-ch-6', type: 'sentence-build', prompt: "Build: \"Is this the teacher's book?\"", correctAnswer: 'これはせんせいのほんですか' },
      { id: 'q5-ch-7', type: 'translation-jp-en', prompt: '「だれのかばんですか」', correctAnswer: "Whose bag is it?", acceptedAnswers: ["Whose bag is this?"] },
      { id: 'q5-ch-8', type: 'fill-in-blank', prompt: '「これはゆき___いもうとです。」', correctAnswer: 'の' },
      { id: 'q5-ch-9', type: 'multiple-choice', prompt: '"My younger sister" — correct:', options: ['わたしのいもうと', 'いもうとのわたし', 'わたしいもうと', 'いもうとわたしの'], correctAnswer: 'わたしのいもうと' },
      { id: 'q5-ch-10', type: 'translation-en-jp', prompt: '"It\'s my friend\'s desk."', correctAnswer: 'ともだちのつくえです', acceptedAnswers: ['ともだちのつくえです。'] },
      { id: 'q5-ch-11', type: 'multiple-choice', prompt: '"Whose glasses are these?" — correct:', options: ['このめがねはだれのですか', 'だれのはめがねですか', 'このめがねだれですか', 'めがねはのだれですか'], correctAnswer: 'このめがねはだれのですか' },
      { id: 'q5-ch-12', type: 'fill-in-blank', prompt: '「たなかさん___へやのほんです。」', correctAnswer: 'の' },
      { id: 'q5-ch-13', type: 'sentence-build', prompt: "Build: \"It's Yuki's older brother.\"", correctAnswer: 'ゆきのおにいさんです' },
      { id: 'q5-ch-14', type: 'translation-jp-en', prompt: '「わたしのともだちのほんです」', correctAnswer: "It's my friend's book", acceptedAnswers: ["It is my friend's book."] },
      { id: 'q5-ch-15', type: 'multiple-choice', prompt: '"Is it yours?" — best form:', options: ['それはあなたのですか', 'あなたのそれですか', 'それはあなたですか', 'あなたはのですか'], correctAnswer: 'それはあなたのですか' },
    ],
  }
};
