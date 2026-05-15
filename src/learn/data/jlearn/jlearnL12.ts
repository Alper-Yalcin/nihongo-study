import { JLearnLevel } from './jlearnTypes';

export const jlearnLevel12: JLearnLevel = {
  id: 'JL12',
  title: 'Requests',
  theme: 'Make polite requests and give instructions using てください and ないでください.',
  location: 'Classroom',
  jlptAlignment: 'N5',
  genkiChapters: [6],
  checkpointUnitId: 'L12-U2',
  badge: { id: 'badge-diplomat', name: 'Diplomat', description: 'You can ask for things politely and set boundaries with grace.' },
  storyHook: {
    type: 'invitation-tease',
    speaker: 'Teacher',
    teaser: "First day of Japanese class as an actual student. The teacher uses only Japanese.",
    japanese: 'では、始めましょう。静かにしてください。',
    translation: "Let's begin. Please be quiet."
  },
  units: [
    {
      id: 'L12-U1',
      title: 'てください — Please do',
      summary: 'Make polite requests using te-form + ください.',
      steps: [
        {
          id: 'L12-U1-M1',
          title: 'Teacher instructions',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: "The teacher gives instructions to the class using てください.",
          goal: 'Understand and form requests with てください.',
          vocabulary: [
            { id: 'v12-kudasai', japanese: 'ください', romaji: 'kudasai', english: 'please (do)', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v12-mite', japanese: 'みてください', romaji: 'mite kudasai', english: 'please look', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v12-kiite', japanese: 'きいてください', romaji: 'kiite kudasai', english: 'please listen', partOfSpeech: 'expression', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g12-te-kudasai',
            pattern: '[te-form] + ください',
            explanation: 'てください makes a polite request or instruction. Te-form + ください = please do [action].',
            structure: '[verb te-form] + ください',
            examples: ['みてください。', 'きいてください。', 'かいてください。', 'たってください。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex12-1-1', japanese: 'こちらをみてください。', romaji: 'Kochira o mite kudasai.', english: 'Please look this way.', vocabIds: ['v12-mite', 'v12-kudasai'], grammarIds: ['g12-te-kudasai'] },
            { id: 'ex12-1-2', japanese: 'よくきいてください。', romaji: 'Yoku kiite kudasai.', english: 'Please listen carefully.', vocabIds: ['v12-kiite', 'v12-kudasai'], grammarIds: ['g12-te-kudasai'] },
            { id: 'ex12-1-3', japanese: 'なまえをかいてください。', romaji: 'Namae o kaite kudasai.', english: 'Please write your name.', vocabIds: ['v12-kudasai'], grammarIds: ['g12-te-kudasai'] },
          ],
          branchingChoice: {
            prompt: "The teacher wants everyone to sit down. She says:",
            options: [
              { id: 'a', label: 'すわってください', outcome: 'correct', reaction: 'Everyone sits. Perfect command.' },
              { id: 'b', label: 'すわるください', outcome: 'wrong', reaction: 'Need te-form: すわって + ください.' },
              { id: 'c', label: 'すわりください', outcome: 'wrong', reaction: 'Te-form of すわります: すわって. Then + ください.' },
            ]
          },
          dialogueChains: [{ id: 'dl12-1-1', turns: [
            { speaker: 'Teacher', line: 'みなさん、こちらをみてください。', isLearnerTurn: false, translation: 'Everyone, please look this way.' },
            { speaker: 'You', expectedAnswer: 'はい、せんせい', acceptedAnswers: ['はい', 'はい、せんせい。'], isLearnerTurn: true, translation: 'Yes, teacher.' },
            { speaker: 'Teacher', line: 'ありがとう。では、なまえをかいてください。', isLearnerTurn: false, translation: 'Thank you. Now, please write your name.' },
          ]}],
          questions: [
            { id: 'q12-1-1', type: 'translation-en-jp', prompt: '"Please listen carefully."', correctAnswer: 'よくきいてください', acceptedAnswers: ['よくきいてください。'] },
            { id: 'q12-1-2', type: 'fill-in-blank', prompt: '「なまえをかい___ください。」', correctAnswer: 'て' },
            { id: 'q12-1-3', type: 'multiple-choice', prompt: '"Please look this way." — correct:', options: ['こちらをみてください', 'こちらをみるください', 'こちらをみませんください', 'こちらみてください'], correctAnswer: 'こちらをみてください' },
          ],
          successMessage: 'First lesson done. てください is your new tool.',
          emotionalFeedback: {
            perfect: '「よくできました！」 Teacher smiles.',
            good: 'Request form used correctly.',
            struggle: 'Te-form + ください. The same te-form from Level 11, new ending.',
          }
        },
        {
          id: 'L12-U1-M2',
          title: 'Asking for help',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "You need help with the worksheet. Ask Yuki using てください.",
          goal: 'Make personal requests in everyday situations.',
          vocabulary: [
            { id: 'v12-oshiete', japanese: 'おしえてください', romaji: 'oshiete kudasai', english: 'please teach / tell me', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v12-matte', japanese: 'まってください', romaji: 'matte kudasai', english: 'please wait', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v12-yukkuri', japanese: 'ゆっくり', romaji: 'yukkuri', english: 'slowly', partOfSpeech: 'adverb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g12-request-everyday',
            pattern: 'ゆっくり / もういちど + てください',
            explanation: 'Add adverbs like ゆっくり (slowly) or もういちど (once more) before てください for nuanced requests.',
            structure: '[adverb] + [verb te-form] + ください',
            examples: ['ゆっくりはなしてください。', 'もういちどいってください。', 'おしえてください。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex12-2-1', japanese: 'ゆっくりはなしてください。', romaji: 'Yukkuri hanashite kudasai.', english: 'Please speak slowly.', vocabIds: ['v12-yukkuri'], grammarIds: ['g12-request-everyday'] },
            { id: 'ex12-2-2', japanese: 'もういちどいってください。', romaji: 'Mou ichido itte kudasai.', english: 'Please say that again.', vocabIds: ['v12-kudasai'], grammarIds: ['g12-request-everyday'] },
            { id: 'ex12-2-3', japanese: 'おしえてください。', romaji: 'Oshiete kudasai.', english: 'Please teach / tell me.', vocabIds: ['v12-oshiete'], grammarIds: ['g12-request-everyday'] },
          ],
          branchingChoice: {
            prompt: "The teacher spoke too fast. You want her to speak slowly:",
            options: [
              { id: 'a', label: 'ゆっくりはなしてください', outcome: 'correct', reaction: '「もちろん。ゆっくりいいます。」 The teacher slows down.' },
              { id: 'b', label: 'ゆっくりはなしますください', outcome: 'wrong', reaction: 'Te-form is needed: はなして + ください.' },
              { id: 'c', label: 'ゆっくりはなしてくださいません', outcome: 'wrong', reaction: 'ください doesn\'t conjugate negatively — just ゆっくりはなしてください.' },
            ]
          },
          dialogueChains: [{ id: 'dl12-1-2', turns: [
            { speaker: 'You', expectedAnswer: 'もういちどいってください', acceptedAnswers: ['もういちどいってください。', 'ゆっくりはなしてください'], isLearnerTurn: true, translation: 'Please say that again.' },
            { speaker: 'Teacher', line: 'もちろん。もういちどいいます。', isLearnerTurn: false, translation: "Of course. I'll say it again." },
            { speaker: 'You', expectedAnswer: 'ありがとうございます', acceptedAnswers: ['ありがとうございます。', 'ありがとう'], isLearnerTurn: true, translation: 'Thank you.' },
          ]}],
          questions: [
            { id: 'q12-2-1', type: 'translation-en-jp', prompt: '"Please speak slowly."', correctAnswer: 'ゆっくりはなしてください', acceptedAnswers: ['ゆっくりはなしてください。'] },
            { id: 'q12-2-2', type: 'fill-in-blank', prompt: '「もういちどい___ください。」', correctAnswer: 'って' },
            { id: 'q12-2-3', type: 'multiple-choice', prompt: '"Please teach me." — correct:', options: ['おしえてください', 'おしえるください', 'おしえますください', 'おしえてくださいません'], correctAnswer: 'おしえてください' },
          ],
          successMessage: 'Helpful requests made politely. Class flowing better.',
          emotionalFeedback: {
            perfect: '「上手に頼めた！」',
            good: 'Requests clear and polite.',
            struggle: 'ゆっくり is your lifeline in Japan. Practice that phrase.',
          }
        },
        {
          id: 'L12-U1-M3',
          title: 'Asking others to do things',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "You're student leader today. Give instructions to the group.",
          goal: 'Confidently give instructions to others using てください.',
          vocabulary: [
            { id: 'v12-akete', japanese: 'あけてください', romaji: 'akete kudasai', english: 'please open', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v12-shimete', japanese: 'しめてください', romaji: 'shimete kudasai', english: 'please close', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v12-doa', japanese: 'ドア', romaji: 'doa', english: 'door', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g12-give-instructions',
            pattern: 'Classroom instruction verbs + てください',
            explanation: 'Common classroom verbs with てください: あけて (open), しめて (close), たって (stand), すわって (sit).',
            structure: '[action verb te-form] + ください',
            examples: ['ドアをあけてください。', 'まどをしめてください。', 'たってください。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex12-3-1', japanese: 'ドアをあけてください。', romaji: 'Doa o akete kudasai.', english: 'Please open the door.', vocabIds: ['v12-akete', 'v12-doa'], grammarIds: ['g12-give-instructions'] },
            { id: 'ex12-3-2', japanese: 'まどをしめてください。', romaji: 'Mado o shimete kudasai.', english: 'Please close the window.', vocabIds: ['v12-shimete'], grammarIds: ['g12-give-instructions'] },
            { id: 'ex12-3-3', japanese: 'たってください。', romaji: 'Tatte kudasai.', english: 'Please stand up.', vocabIds: ['v12-kudasai'], grammarIds: ['g12-give-instructions'] },
          ],
          branchingChoice: {
            prompt: "It's hot in class. You ask someone to open the window:",
            options: [
              { id: 'a', label: 'まどをあけてください', outcome: 'correct', reaction: '「はい！」 A classmate opens it right away.' },
              { id: 'b', label: 'まどをしめてください', outcome: 'wrong', reaction: 'しめて = close. You wanted to open: あけてください.' },
              { id: 'c', label: 'まどのあけてください', outcome: 'wrong', reaction: 'の is possessive. Use を with verbs: まどを あけてください.' },
            ]
          },
          dialogueChains: [{ id: 'dl12-1-3', turns: [
            { speaker: 'You', expectedAnswer: 'ドアをあけてください', acceptedAnswers: ['ドアをあけてください。', 'まどをあけてください'], isLearnerTurn: true, translation: 'Please open the door.' },
            { speaker: 'Classmate', line: 'はい、わかりました。', isLearnerTurn: false, translation: 'Yes, understood.' },
            { speaker: 'You', expectedAnswer: 'ありがとうございます', acceptedAnswers: ['ありがとう', 'ありがとうございます。'], isLearnerTurn: true, translation: 'Thank you.' },
          ]}],
          questions: [
            { id: 'q12-3-1', type: 'translation-en-jp', prompt: '"Please open the door."', correctAnswer: 'ドアをあけてください', acceptedAnswers: ['ドアをあけてください。'] },
            { id: 'q12-3-2', type: 'fill-in-blank', prompt: '「まどをしめ___ください。」', correctAnswer: 'て' },
            { id: 'q12-3-3', type: 'multiple-choice', prompt: '"Please stand up." — correct:', options: ['たってください', 'たつください', 'たちてください', 'たてください'], correctAnswer: 'たってください' },
          ],
          successMessage: 'Student leader mode: activated. Group follows your instructions.',
          emotionalFeedback: {
            perfect: '「リーダーシップがある！」',
            good: 'Instructions clear and correct.',
            struggle: 'Each verb gets its own te-form. Build confidence one verb at a time.',
          }
        },
        {
          id: 'L12-U1-M4',
          title: 'てください review',
          kind: 'review',
          estimatedMinutes: 1,
          scenario: "End-of-lesson review. Teacher gives a mix of instructions.",
          goal: 'Respond quickly to various てください instructions.',
          vocabulary: [
            { id: 'v12-yonde', japanese: 'よんでください', romaji: 'yonde kudasai', english: 'please read', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v12-kaite', japanese: 'かいてください', romaji: 'kaite kudasai', english: 'please write', partOfSpeech: 'expression', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g12-review-kudasai',
            pattern: 'Varied てください',
            explanation: 'Consolidate all classroom instruction forms: read, write, listen, speak, stand, sit, open, close.',
            structure: '[verb te-form] + ください',
            examples: ['よんでください。', 'かいてください。', 'きいてください。', 'はなしてください。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex12-4-1', japanese: 'もういちどよんでください。', romaji: 'Mou ichido yonde kudasai.', english: 'Please read it one more time.', vocabIds: ['v12-yonde'], grammarIds: ['g12-review-kudasai'] },
            { id: 'ex12-4-2', japanese: 'こたえをかいてください。', romaji: 'Kotae o kaite kudasai.', english: 'Please write the answer.', vocabIds: ['v12-kaite'], grammarIds: ['g12-review-kudasai'] },
          ],
          branchingChoice: {
            prompt: "Teacher says 「こたえをかいてください」. You:",
            options: [
              { id: 'a', label: 'こたえをかきます', outcome: 'correct', reaction: '「よくできました！」' },
              { id: 'b', label: 'こたえをよみます', outcome: 'wrong', reaction: 'She said かいて (write), not よんで (read).' },
              { id: 'c', label: 'こたえをきいてください', outcome: 'wrong', reaction: 'That\'s a new request — she asked you to write the answer.' },
            ]
          },
          dialogueChains: [{ id: 'dl12-1-4', turns: [
            { speaker: 'Teacher', line: 'では、もういちどよんでください。', isLearnerTurn: false, translation: 'Now, please read it one more time.' },
            { speaker: 'You', expectedAnswer: 'はい、よみます', acceptedAnswers: ['はい', 'はい、よみます。', 'わかりました'], isLearnerTurn: true, translation: 'Yes, I will read.' },
            { speaker: 'Teacher', line: 'じょうずですね！', isLearnerTurn: false, translation: "You are good!" },
          ]}],
          questions: [
            { id: 'q12-4-1', type: 'translation-en-jp', prompt: '"Please write the answer."', correctAnswer: 'こたえをかいてください', acceptedAnswers: ['こたえをかいてください。'] },
            { id: 'q12-4-2', type: 'fill-in-blank', prompt: '「もういちどよん___ください。」', correctAnswer: 'で' },
            { id: 'q12-4-3', type: 'multiple-choice', prompt: '"Please listen carefully." — correct:', options: ['よくきいてください', 'よくきくください', 'よくきいてくださいます', 'きいてよくください'], correctAnswer: 'よくきいてください' },
          ],
          successMessage: 'All classroom instructions handled. Teacher is pleased.',
          emotionalFeedback: {
            perfect: '「完璧！優等生！」',
            good: 'Instructions followed and given.',
            struggle: 'Each instruction is te-form + ください. Solid.',
          }
        },
      ]
    },
    {
      id: 'L12-U2',
      title: 'ないでください — Please don\'t',
      summary: 'Use negative requests to politely ask someone not to do something.',
      steps: [
        {
          id: 'L12-U2-M1',
          title: 'Please don\'t',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: "The library has rules. You need to tell someone what not to do.",
          goal: 'Use ないでください for negative requests.',
          vocabulary: [
            { id: 'v12-naide', japanese: 'ないでください', romaji: 'naide kudasai', english: 'please don\'t', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v12-hanasanaide', japanese: 'はなさないでください', romaji: 'hanasanaide kudasai', english: 'please don\'t speak', partOfSpeech: 'expression', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g12-naide-kudasai',
            pattern: '[verb negative stem] + ないでください',
            explanation: 'Negative request: take the plain negative form (ない) and add でください. はなす → はなさない → はなさないでください.',
            structure: '[verb-ない form] + でください',
            examples: ['はなさないでください。', 'たべないでください。', 'はしらないでください。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex12-5-1', japanese: 'ここではなさないでください。', romaji: 'Koko de hanasanaide kudasai.', english: 'Please do not speak here.', vocabIds: ['v12-hanasanaide', 'v12-naide'], grammarIds: ['g12-naide-kudasai'] },
            { id: 'ex12-5-2', japanese: 'ここでたべないでください。', romaji: 'Koko de tabenaide kudasai.', english: 'Please do not eat here.', vocabIds: ['v12-naide'], grammarIds: ['g12-naide-kudasai'] },
            { id: 'ex12-5-3', japanese: 'しゃしんをとらないでください。', romaji: 'Shashin o toranaide kudasai.', english: 'Please do not take photos.', vocabIds: ['v12-naide'], grammarIds: ['g12-naide-kudasai'] },
          ],
          branchingChoice: {
            prompt: "A sign says no eating in the library. You tell a friend:",
            options: [
              { id: 'a', label: 'ここでたべないでください', outcome: 'correct', reaction: '「あ、ごめんなさい！」 They put the snack away.' },
              { id: 'b', label: 'ここでたべてください', outcome: 'wrong', reaction: 'てください = please do. You want ないでください = please don\'t.' },
              { id: 'c', label: 'ここでたべないください', outcome: 'wrong', reaction: 'ないで connects to ください: たべないでください.' },
            ]
          },
          dialogueChains: [{ id: 'dl12-2-1', turns: [
            { speaker: 'Librarian', line: 'ここではなさないでください。', isLearnerTurn: false, translation: 'Please do not speak here.' },
            { speaker: 'You', expectedAnswer: 'すみません、わかりました', acceptedAnswers: ['すみません', 'はい、わかりました', 'ごめんなさい'], isLearnerTurn: true, translation: "Sorry, I understand." },
            { speaker: 'Librarian', line: 'ありがとうございます。', isLearnerTurn: false, translation: 'Thank you.' },
          ]}],
          questions: [
            { id: 'q12-5-1', type: 'translation-en-jp', prompt: '"Please do not eat here."', correctAnswer: 'ここでたべないでください', acceptedAnswers: ['ここでたべないでください。'] },
            { id: 'q12-5-2', type: 'fill-in-blank', prompt: '「はなさ___でください。」(please don\'t speak)', correctAnswer: 'ない' },
            { id: 'q12-5-3', type: 'multiple-choice', prompt: '"Please do not take photos." — correct:', options: ['しゃしんをとらないでください', 'しゃしんをとってください', 'しゃしんをとないでください', 'しゃしんをとらなくください'], correctAnswer: 'しゃしんをとらないでください' },
          ],
          successMessage: 'Negative request: ないでください. A vital social skill.',
          emotionalFeedback: {
            perfect: '「マナーもバッチリ！」',
            good: 'Negative request polite and correct.',
            struggle: 'Plain negative (ない) + でください. Two pieces together.',
          }
        },
        {
          id: 'L12-U2-M2',
          title: 'Library and temple rules',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "You visit a temple with Mrs. Tanaka. Many things to know.",
          goal: 'Use ないでください in cultural settings.',
          vocabulary: [
            { id: 'v12-sawaru', japanese: 'さわらないでください', romaji: 'sawaranaide kudasai', english: 'please don\'t touch', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v12-hashiru', japanese: 'はしらないでください', romaji: 'hashiranaide kudasai', english: 'please don\'t run', partOfSpeech: 'expression', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g12-rules',
            pattern: 'Cultural rule pairs: してください / しないでください',
            explanation: 'Rules come in pairs: what to do (てください) and what not to do (ないでください).',
            structure: '[positive rule] + てください / [negative rule] + ないでください',
            examples: ['しずかにしてください。', 'はしらないでください。', 'さわらないでください。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex12-6-1', japanese: 'はしらないでください。', romaji: 'Hashiranaide kudasai.', english: 'Please do not run.', vocabIds: ['v12-hashiru'], grammarIds: ['g12-rules'] },
            { id: 'ex12-6-2', japanese: 'さわらないでください。', romaji: 'Sawaranaide kudasai.', english: 'Please do not touch.', vocabIds: ['v12-sawaru'], grammarIds: ['g12-rules'] },
            { id: 'ex12-6-3', japanese: 'しずかにしてください。', romaji: 'Shizuka ni shite kudasai.', english: 'Please be quiet.', vocabIds: ['v12-kudasai'], grammarIds: ['g12-rules'] },
          ],
          branchingChoice: {
            prompt: "A child is running in the temple. You politely tell them to stop:",
            options: [
              { id: 'a', label: 'はしらないでください', outcome: 'correct', reaction: 'The child stops. 「ごめんなさい！」' },
              { id: 'b', label: 'はしってください', outcome: 'wrong', reaction: 'That tells them to run! Negative: はしらないでください.' },
              { id: 'c', label: 'はしらないください', outcome: 'wrong', reaction: 'でをわすれないで：はしらない + でください.' },
            ]
          },
          dialogueChains: [{ id: 'dl12-2-2', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'ここではしゃしんをとらないでください。', 2: 'ここで写真撮らないでね。' }, isLearnerTurn: false, translation: 'Please do not take photos here.' },
            { speaker: 'You', expectedAnswer: 'はい、わかりました', acceptedAnswers: ['はい', 'わかりました', 'はい、わかりました。'], isLearnerTurn: true, translation: 'Yes, understood.' },
            { speaker: 'Mrs. Tanaka', line: { 0: 'ありがとう。しずかにしてください。', 2: 'ありがとう。静かにしてね。' }, isLearnerTurn: false, translation: 'Thank you. Please be quiet.' },
          ]}],
          questions: [
            { id: 'q12-6-1', type: 'translation-en-jp', prompt: '"Please do not run."', correctAnswer: 'はしらないでください', acceptedAnswers: ['はしらないでください。'] },
            { id: 'q12-6-2', type: 'fill-in-blank', prompt: '「さわら___でください。」(please don\'t touch)', correctAnswer: 'ない' },
            { id: 'q12-6-3', type: 'multiple-choice', prompt: '"Please be quiet." — correct:', options: ['しずかにしてください', 'しずかにしないでください', 'しずかをしてください', 'しずかてください'], correctAnswer: 'しずかにしてください' },
          ],
          successMessage: 'Temple rules respected. Cultural manners: solid.',
          emotionalFeedback: {
            perfect: '「礼儀正しい！」 Mrs. Tanaka is proud.',
            good: 'Rules delivered correctly.',
            struggle: 'さわらない + でください. Two parts, one clear rule.',
          }
        },
        {
          id: 'L12-U2-M3',
          title: 'Positive and negative pairs',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "You're writing the class rules board. Mix positive and negative instructions.",
          goal: 'Produce both てください and ないでください fluently.',
          vocabulary: [
            { id: 'v12-chikoku', japanese: 'ちこくしないでください', romaji: 'chikoku shinaide kudasai', english: 'please don\'t be late', partOfSpeech: 'expression', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g12-pairs',
            pattern: 'Rule pairs in classroom / public settings',
            explanation: 'Balance positive rules (do this) and negative rules (don\'t do this) using both forms.',
            structure: '[positive] てください。[negative] ないでください。',
            examples: ['よくきいてください。ほかのひとのはなしをさえぎらないでください。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex12-7-1', japanese: 'じゅぎょうにちこくしないでください。', romaji: 'Jugyou ni chikoku shinaide kudasai.', english: 'Please do not be late for class.', vocabIds: ['v12-chikoku'], grammarIds: ['g12-pairs'] },
            { id: 'ex12-7-2', japanese: 'よくきいて、かいてください。', romaji: 'Yoku kiite, kaite kudasai.', english: 'Please listen carefully and write.', vocabIds: ['v12-kudasai'], grammarIds: ['g12-pairs'] },
          ],
          branchingChoice: {
            prompt: "Write rule #1: students must not be late. You write:",
            options: [
              { id: 'a', label: 'ちこくしないでください', outcome: 'correct', reaction: 'The rule board looks great.' },
              { id: 'b', label: 'ちこくしてください', outcome: 'wrong', reaction: 'That\'s telling them to be late! Use ないでください.' },
              { id: 'c', label: 'ちこくしないください', outcome: 'wrong', reaction: 'でをわすれないで: しない + でください.' },
            ]
          },
          dialogueChains: [{ id: 'dl12-2-3', turns: [
            { speaker: 'Teacher', line: 'クラスのルールをつくってください。', isLearnerTurn: false, translation: 'Please create the class rules.' },
            { speaker: 'You', expectedAnswer: 'よくきいてください。はなさないでください', acceptedAnswers: ['よくきいてください', 'はなさないでください', 'ちこくしないでください'], isLearnerTurn: true, translation: 'Please listen well. Please do not talk.' },
            { speaker: 'Teacher', line: 'いいルールですね！', isLearnerTurn: false, translation: 'Great rules!' },
          ]}],
          questions: [
            { id: 'q12-7-1', type: 'translation-en-jp', prompt: '"Please do not be late for class."', correctAnswer: 'じゅぎょうにちこくしないでください', acceptedAnswers: ['ちこくしないでください'] },
            { id: 'q12-7-2', type: 'fill-in-blank', prompt: '「はなさ___でください。」(please don\'t talk)', correctAnswer: 'ない' },
            { id: 'q12-7-3', type: 'multiple-choice', prompt: 'Which is a negative request?', options: ['たべないでください', 'たべてください', 'たべますください', 'たべません'], correctAnswer: 'たべないでください' },
          ],
          successMessage: 'Both forms mastered. You can run a classroom now.',
          emotionalFeedback: {
            perfect: '「先生みたい！」',
            good: 'Both forms delivered correctly.',
            struggle: 'てください = do. ないでください = don\'t. Two forms, clear pair.',
          }
        },
        {
          id: 'L12-U2-M4',
          title: 'Level 12 Checkpoint',
          kind: 'checkpoint',
          estimatedMinutes: 2,
          isCheckpoint: true,
          minPassScore: 80,
          scenario: "Final test: てください and ないでください across classroom, library, and public settings.",
          goal: 'Demonstrate full command of Level 12 requests.',
          vocabulary: [],
          grammar: [],
          examples: [],
          branchingChoice: {
            prompt: "You need to tell someone not to touch an exhibit:",
            options: [
              { id: 'a', label: 'さわらないでください', outcome: 'correct', reaction: 'They step back. Rule respected.' },
              { id: 'b', label: 'さわってください', outcome: 'wrong', reaction: 'That tells them to touch it. Use ないでください.' },
              { id: 'c', label: 'さわらないくださいません', outcome: 'wrong', reaction: 'Simply: さわらないでください.' },
            ]
          },
          dialogueChains: [{ id: 'dl12-2-4', turns: [
            { speaker: 'Teacher', line: 'リクエストのテストです！', isLearnerTurn: false, translation: 'Request test!' },
            { speaker: 'You', expectedAnswer: 'ゆっくりはなしてください', acceptedAnswers: ['ゆっくりはなしてください。', 'もういちどいってください'], isLearnerTurn: true, translation: 'Please speak slowly.' },
            { speaker: 'Teacher', line: '合格！リクエスト上手！', isLearnerTurn: false, translation: 'Pass! Great requests!' },
          ]}],
          questions: [
            { id: 'q12-cp-1', type: 'translation-en-jp', prompt: '"Please listen carefully."', correctAnswer: 'よくきいてください', acceptedAnswers: ['よくきいてください。'] },
            { id: 'q12-cp-2', type: 'translation-en-jp', prompt: '"Please do not eat here."', correctAnswer: 'ここでたべないでください', acceptedAnswers: ['ここでたべないでください。'] },
            { id: 'q12-cp-3', type: 'fill-in-blank', prompt: '「はしら___でください。」(please don\'t run)', correctAnswer: 'ない' },
            { id: 'q12-cp-4', type: 'sentence-build', prompt: 'Build: "Please speak slowly."', correctAnswer: 'ゆっくりはなしてください' },
            { id: 'q12-cp-5', type: 'translation-jp-en', prompt: '「さわらないでください」', correctAnswer: 'Please do not touch', acceptedAnswers: ['Please do not touch it.'] },
            { id: 'q12-cp-6', type: 'multiple-choice', prompt: '"Please open the door." — correct:', options: ['ドアをあけてください', 'ドアをあけないでください', 'ドアをあけるください', 'ドアをあけますください'], correctAnswer: 'ドアをあけてください' },
          ],
          successMessage: 'Level 12 complete. You can navigate any rule-based environment in Japan.',
          emotionalFeedback: {
            perfect: '「礼儀と指示の達人！」',
            good: 'Request mastery achieved.',
            struggle: 'You cleared it. Both forms are yours now.',
          }
        },
      ]
    }
  ],
  challengeMission: {
    id: 'JL12-challenge',
    title: 'Class President Challenge',
    kind: 'checkpoint',
    estimatedMinutes: 2,
    scenario: "You've been elected class president for a day. Write and deliver all the rules for the class trip — positive and negative requests — without a single mistake.",
    vocabulary: [],
    grammar: [],
    examples: [],
    questions: [
      { id: 'q12-ch-1', type: 'translation-en-jp', prompt: '"Please listen carefully."', correctAnswer: 'よくきいてください', acceptedAnswers: ['よくきいてください。'] },
      { id: 'q12-ch-2', type: 'translation-en-jp', prompt: '"Please do not run."', correctAnswer: 'はしらないでください', acceptedAnswers: ['はしらないでください。'] },
      { id: 'q12-ch-3', type: 'fill-in-blank', prompt: '「なまえをかい___ください。」(please write)', correctAnswer: 'て' },
      { id: 'q12-ch-4', type: 'translation-en-jp', prompt: '"Please speak slowly."', correctAnswer: 'ゆっくりはなしてください', acceptedAnswers: ['ゆっくりはなしてください。'] },
      { id: 'q12-ch-5', type: 'multiple-choice', prompt: '"Please do not take photos." — correct:', options: ['しゃしんをとらないでください', 'しゃしんをとってください', 'しゃしんをとないでください', 'しゃしんをとらなくください'], correctAnswer: 'しゃしんをとらないでください' },
      { id: 'q12-ch-6', type: 'sentence-build', prompt: 'Build: "Please open the door."', correctAnswer: 'ドアをあけてください' },
      { id: 'q12-ch-7', type: 'translation-jp-en', prompt: '「ここではなさないでください」', correctAnswer: 'Please do not speak here', acceptedAnswers: ['Please do not talk here.'] },
      { id: 'q12-ch-8', type: 'fill-in-blank', prompt: '「たべ___でください。」(please don\'t eat)', correctAnswer: 'ない' },
      { id: 'q12-ch-9', type: 'translation-en-jp', prompt: '"Please do not touch."', correctAnswer: 'さわらないでください', acceptedAnswers: ['さわらないでください。'] },
      { id: 'q12-ch-10', type: 'multiple-choice', prompt: '"Please be quiet." — correct:', options: ['しずかにしてください', 'しずかにしないでください', 'しずかをしてください', 'しずかてください'], correctAnswer: 'しずかにしてください' },
      { id: 'q12-ch-11', type: 'sentence-build', prompt: 'Build: "Please say that again."', correctAnswer: 'もういちどいってください' },
      { id: 'q12-ch-12', type: 'fill-in-blank', prompt: '「はしら___でください。」(please don\'t run)', correctAnswer: 'ない' },
      { id: 'q12-ch-13', type: 'translation-en-jp', prompt: '"Please write the answer."', correctAnswer: 'こたえをかいてください', acceptedAnswers: ['こたえをかいてください。'] },
      { id: 'q12-ch-14', type: 'translation-jp-en', prompt: '「ちこくしないでください」', correctAnswer: 'Please do not be late', acceptedAnswers: ['Please do not be late for class.'] },
      { id: 'q12-ch-15', type: 'multiple-choice', prompt: '"Please do not eat here." — correct:', options: ['ここでたべないでください', 'ここでたべてください', 'ここでたべないください', 'ここでたべません'], correctAnswer: 'ここでたべないでください' },
    ],
  }
};
