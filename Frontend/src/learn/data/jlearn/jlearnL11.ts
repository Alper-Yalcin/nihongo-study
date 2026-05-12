import { JLearnLevel } from './jlearnTypes';

export const jlearnLevel11: JLearnLevel = {
  id: 'JL11',
  title: 'Te-form',
  theme: 'Connect actions, describe ongoing states, and make requests using the te-form.',
  location: 'After-School Clubs',
  jlptAlignment: 'N5',
  genkiChapters: [6, 7],
  checkpointUnitId: 'L11-U2',
  badge: { id: 'badge-connector-pro', name: 'Connector Pro', description: 'You can chain actions and describe ongoing states fluently.' },
  storyHook: {
    type: 'invitation-tease',
    speaker: 'Yuki',
    teaser: "After school, the club room is buzzing. Yuki waves you over from the art club booth.",
    japanese: 'こっちで絵をかいています！',
    translation: "I'm painting a picture over here!"
  },
  units: [
    {
      id: 'L11-U1',
      title: 'Building the Te-form',
      summary: 'Learn to construct the te-form for different verb groups.',
      steps: [
        {
          id: 'L11-U1-M1',
          title: 'What is the te-form?',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: "Yuki explains club activities. You need the te-form to connect actions.",
          goal: 'Understand and build the te-form for る-verbs.',
          vocabulary: [
            { id: 'v11-te', japanese: '〜て', romaji: '~te', english: 'te-form connector', partOfSpeech: 'suffix', jlptLevel: 'N5' },
            { id: 'v11-tabete', japanese: 'たべて', romaji: 'tabete', english: 'eat (te-form)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v11-mite', japanese: 'みて', romaji: 'mite', english: 'see/watch (te-form)', partOfSpeech: 'verb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g11-te-form-ru',
            pattern: 'る-verb: drop る, add て',
            explanation: 'For る-verbs (ichidan), remove る and add て: たべる → たべて, みる → みて.',
            structure: '[verb-stem] + て',
            examples: ['たべて、みて、おきて'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex11-1-1', japanese: 'ごはんをたべて、テレビをみます。', romaji: 'Gohan o tabete, terebi o mimasu.', english: 'I eat, then watch TV.', vocabIds: ['v11-tabete', 'v11-mite'], grammarIds: ['g11-te-form-ru'] },
            { id: 'ex11-1-2', japanese: 'おきて、シャワーをあびます。', romaji: 'Okite, shawa o abimasu.', english: 'I wake up and take a shower.', vocabIds: ['v11-te'], grammarIds: ['g11-te-form-ru'] },
            { id: 'ex11-1-3', japanese: 'かいてください。', romaji: 'Kaite kudasai.', english: 'Please write.', vocabIds: ['v11-te'], grammarIds: ['g11-te-form-ru'] },
          ],
          branchingChoice: {
            prompt: "You want to say 'I eat and then study'. Which te-form connects them?",
            options: [
              { id: 'a', label: 'たべて、べんきょうします', outcome: 'correct', reaction: '「そうです！て connects the actions!」' },
              { id: 'b', label: 'たべます、べんきょうします', outcome: 'partial', reaction: 'Grammatical — but て creates a smoother sequential chain.' },
              { id: 'c', label: 'たべた、べんきょうします', outcome: 'wrong', reaction: 'たべた is plain past. Use て-form: たべて.' },
            ]
          },
          dialogueChains: [{ id: 'dl11-1-1', turns: [
            { speaker: 'Yuki', line: { 0: 'クラブのあとでなにをしますか？', 2: 'クラブの後何する？' }, isLearnerTurn: false, translation: 'What do you do after club?' },
            { speaker: 'You', expectedAnswer: 'うちにかえって、べんきょうします', acceptedAnswers: ['かえって、べんきょうします', 'うちにかえってべんきょうします'], isLearnerTurn: true, translation: 'I return home and study.' },
            { speaker: 'Yuki', line: { 0: 'まじめですね！', 2: 'まじめ！' }, isLearnerTurn: false, translation: "You're dedicated!" },
          ]}],
          questions: [
            { id: 'q11-1-1', type: 'multiple-choice', prompt: 'Te-form of たべます:', options: ['たべて', 'たべって', 'たべた', 'たべで'], correctAnswer: 'たべて' },
            { id: 'q11-1-2', type: 'translation-en-jp', prompt: '"I eat and watch TV."', correctAnswer: 'たべて、テレビをみます', acceptedAnswers: ['ごはんをたべてテレビをみます'] },
            { id: 'q11-1-3', type: 'fill-in-blank', prompt: '「おき___、シャワーをあびます。」', correctAnswer: 'て' },
          ],
          successMessage: 'Te-form introduced. Actions now link seamlessly.',
          emotionalFeedback: {
            perfect: '「て形マスター！」',
            good: 'Te-form applied correctly.',
            struggle: 'る-verbs: drop る, add て. たべる → たべて.',
          }
        },
        {
          id: 'L11-U1-M2',
          title: 'U-verb te-forms',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "More club members join. Their verbs are u-verbs with trickier te-forms.",
          goal: 'Learn u-verb (godan) te-form patterns.',
          vocabulary: [
            { id: 'v11-kaite', japanese: 'かいて', romaji: 'kaite', english: 'write (te-form)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v11-kiite', japanese: 'きいて', romaji: 'kiite', english: 'listen (te-form)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v11-yonde', japanese: 'よんで', romaji: 'yonde', english: 'read (te-form)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v11-nonde', japanese: 'のんで', romaji: 'nonde', english: 'drink (te-form)', partOfSpeech: 'verb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g11-te-form-u',
            pattern: 'U-verb te-form patterns',
            explanation: 'く → いて (かく→かいて), ぐ → いで, む/ぬ/ぶ → んで (のむ→のんで), う/つ/る → って (かう→かって), す → して',
            structure: '[verb-ending change] + て/で',
            examples: ['かいて (かく)', 'きいて (きく)', 'よんで (よむ)', 'のんで (のむ)', 'かって (かう)'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex11-2-1', japanese: 'ほんをよんで、おんがくをきいています。', romaji: 'Hon o yonde, ongaku o kiite imasu.', english: 'I am reading a book and listening to music.', vocabIds: ['v11-yonde', 'v11-kiite'], grammarIds: ['g11-te-form-u'] },
            { id: 'ex11-2-2', japanese: 'なまえをかいてください。', romaji: 'Namae o kaite kudasai.', english: 'Please write your name.', vocabIds: ['v11-kaite'], grammarIds: ['g11-te-form-u'] },
            { id: 'ex11-2-3', japanese: 'みずをのんで、やすみます。', romaji: 'Mizu o nonde, yasumimasu.', english: 'I drink water and rest.', vocabIds: ['v11-nonde'], grammarIds: ['g11-te-form-u'] },
          ],
          branchingChoice: {
            prompt: "Club rule says to listen and write. You tell a new member:",
            options: [
              { id: 'a', label: 'きいて、かいてください', outcome: 'correct', reaction: '「わかりました！」 They nod and get to work.' },
              { id: 'b', label: 'きいた、かいてください', outcome: 'wrong', reaction: 'きいた is past plain. Use te-form: きいて.' },
              { id: 'c', label: 'きいて、かきてください', outcome: 'wrong', reaction: 'かく te-form: かいて, not かきて.' },
            ]
          },
          dialogueChains: [{ id: 'dl11-1-2', turns: [
            { speaker: 'Yuki', line: { 0: 'まずほんをよんで、なまえをかいてください。', 2: 'まず本読んで名前書いてね。' }, isLearnerTurn: false, translation: 'First read the book and write your name.' },
            { speaker: 'You', expectedAnswer: 'はい、よんで、かきます', acceptedAnswers: ['はい、わかりました', 'はい、よんでかきます。'], isLearnerTurn: true, translation: 'Yes, I will read and write.' },
            { speaker: 'Yuki', line: { 0: 'ありがとう！がんばってください！', 2: 'ありがとう！頑張って！' }, isLearnerTurn: false, translation: 'Thank you! Do your best!' },
          ]}],
          questions: [
            { id: 'q11-2-1', type: 'multiple-choice', prompt: 'Te-form of よみます:', options: ['よんで', 'よみて', 'よいて', 'よって'], correctAnswer: 'よんで' },
            { id: 'q11-2-2', type: 'fill-in-blank', prompt: '「なまえをかい___ください。」', correctAnswer: 'て' },
            { id: 'q11-2-3', type: 'multiple-choice', prompt: 'Te-form of のみます:', options: ['のんで', 'のみて', 'のいて', 'のって'], correctAnswer: 'のんで' },
          ],
          successMessage: 'U-verb te-forms: multiple patterns absorbed.',
          emotionalFeedback: {
            perfect: '「全パターン覚えた！」',
            good: 'U-verb te-forms handled.',
            struggle: 'む/ぬ/ぶ → んで. く → いて. Practice the patterns.',
          }
        },
        {
          id: 'L11-U1-M3',
          title: '〜ています (ongoing actions)',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "The art club is in full swing. Describe what everyone is doing right now.",
          goal: 'Use ています to describe ongoing or habitual actions.',
          vocabulary: [
            { id: 'v11-teimasu', japanese: 'ています', romaji: 'te imasu', english: 'is doing / currently doing', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v11-kakiteiru', japanese: 'かいています', romaji: 'kaite imasu', english: 'is writing / drawing', partOfSpeech: 'verb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g11-te-imasu',
            pattern: '[te-form] + います (ongoing action)',
            explanation: 'Te-form + います describes what is happening now or a habitual state.',
            structure: '[verb te-form] + います',
            examples: ['えをかいています。', 'おんがくをきいています。', 'にほんごをべんきょうしています。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex11-3-1', japanese: 'えをかいています。', romaji: 'E o kaite imasu.', english: 'I am drawing a picture.', vocabIds: ['v11-kakiteiru', 'v11-teimasu'], grammarIds: ['g11-te-imasu'] },
            { id: 'ex11-3-2', japanese: 'おんがくをきいています。', romaji: 'Ongaku o kiite imasu.', english: 'I am listening to music.', vocabIds: ['v11-kiite', 'v11-teimasu'], grammarIds: ['g11-te-imasu'] },
            { id: 'ex11-3-3', japanese: 'にほんごをべんきょうしています。', romaji: 'Nihongo o benkyou shite imasu.', english: 'I am studying Japanese.', vocabIds: ['v11-teimasu'], grammarIds: ['g11-te-imasu'] },
          ],
          branchingChoice: {
            prompt: "Someone asks what Yuki is doing. She's listening to music:",
            options: [
              { id: 'a', label: 'ゆきさんはおんがくをきいています', outcome: 'correct', reaction: '「そうです！」 You nailed it.' },
              { id: 'b', label: 'ゆきさんはおんがくをきいます', outcome: 'partial', reaction: 'きいます = will listen / listens. ています shows ongoing action.' },
              { id: 'c', label: 'ゆきさんはおんがくをきいていません', outcome: 'wrong', reaction: 'ていません is the negative — she is listening.' },
            ]
          },
          dialogueChains: [{ id: 'dl11-1-3', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'ゆきはいまなにをしていますか？', 2: 'ゆき、今何してる？' }, isLearnerTurn: false, translation: 'What is Yuki doing now?' },
            { speaker: 'You', expectedAnswer: 'えをかいています', acceptedAnswers: ['えをかいています。', 'おんがくをきいています'], isLearnerTurn: true, translation: 'She is drawing a picture.' },
            { speaker: 'Mrs. Tanaka', line: { 0: 'そうですか！じょうずですね。', 2: 'そう！上手だね。' }, isLearnerTurn: false, translation: "Is that so! She's good." },
          ]}],
          questions: [
            { id: 'q11-3-1', type: 'translation-en-jp', prompt: '"I am studying Japanese."', correctAnswer: 'にほんごをべんきょうしています', acceptedAnswers: ['にほんごをべんきょうしています。'] },
            { id: 'q11-3-2', type: 'fill-in-blank', prompt: '「えをかい___います。」', correctAnswer: 'て' },
            { id: 'q11-3-3', type: 'multiple-choice', prompt: '"She is listening to music." — correct:', options: ['おんがくをきいています', 'おんがくをきいます', 'おんがくをきいていません', 'おんがくをきいた'], correctAnswer: 'おんがくをきいています' },
          ],
          successMessage: 'Ongoing actions described. The present is alive.',
          emotionalFeedback: {
            perfect: '「今この瞬間を語れる！」',
            good: 'Ongoing state expressed correctly.',
            struggle: 'Te-form + います = what is happening right now.',
          }
        },
        {
          id: 'L11-U1-M4',
          title: 'Te-form review sprint',
          kind: 'review',
          estimatedMinutes: 1,
          scenario: "Club wrap-up — rapid practice of all te-form uses.",
          goal: 'Apply te-form for chaining, ongoing actions, and requests.',
          vocabulary: [
            { id: 'v11-hanashite', japanese: 'はなして', romaji: 'hanashite', english: 'speak (te-form)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v11-itte', japanese: 'いって', romaji: 'itte', english: 'go (te-form)', partOfSpeech: 'verb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g11-te-review',
            pattern: 'Te-form: chain / ています / ください',
            explanation: 'Three uses: A-て B (chain), て+います (ongoing), て+ください (request).',
            structure: '[te-form] + [B] / います / ください',
            examples: ['たべて、いきます。', 'はなしています。', 'きいてください。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex11-4-1', japanese: 'たべて、がっこうにいきます。', romaji: 'Tabete, gakkou ni ikimasu.', english: 'I eat and then go to school.', vocabIds: ['v11-itte'], grammarIds: ['g11-te-review'] },
            { id: 'ex11-4-2', japanese: 'にほんごではなしています。', romaji: 'Nihongo de hanashite imasu.', english: 'I am speaking in Japanese.', vocabIds: ['v11-hanashite', 'v11-teimasu'], grammarIds: ['g11-te-review'] },
            { id: 'ex11-4-3', japanese: 'もうすこしはなしてください。', romaji: 'Mou sukoshi hanashite kudasai.', english: 'Please speak a little more.', vocabIds: ['v11-hanashite'], grammarIds: ['g11-te-review'] },
          ],
          branchingChoice: {
            prompt: "A club member asks what you're doing. You're speaking Japanese:",
            options: [
              { id: 'a', label: 'にほんごではなしています', outcome: 'correct', reaction: '「すごい！」 Everyone is impressed.' },
              { id: 'b', label: 'にほんごではなします', outcome: 'partial', reaction: 'はなします = habitual. ています = right now.' },
              { id: 'c', label: 'にほんごではなしていません', outcome: 'wrong', reaction: 'ていません is the negative — you are speaking.' },
            ]
          },
          dialogueChains: [{ id: 'dl11-1-4', turns: [
            { speaker: 'Yuki', line: { 0: 'いまなにをしていますか？', 2: '今何してる？' }, isLearnerTurn: false, translation: 'What are you doing now?' },
            { speaker: 'You', expectedAnswer: 'にほんごをべんきょうしています', acceptedAnswers: ['にほんごをべんきょうしています。', 'えをかいています', 'おんがくをきいています'], isLearnerTurn: true, translation: 'I am studying Japanese.' },
            { speaker: 'Yuki', line: { 0: 'えらい！わたしもいっしょにします！', 2: 'えらい！私も一緒にする！' }, isLearnerTurn: false, translation: "Great! I'll join you!" },
          ]}],
          questions: [
            { id: 'q11-4-1', type: 'translation-en-jp', prompt: '"Please speak."', correctAnswer: 'はなしてください', acceptedAnswers: ['はなしてください。'] },
            { id: 'q11-4-2', type: 'translation-en-jp', prompt: '"I eat and then go to school."', correctAnswer: 'たべて、がっこうにいきます', acceptedAnswers: ['たべてがっこうにいきます'] },
            { id: 'q11-4-3', type: 'fill-in-blank', prompt: '「にほんごではなし___います。」', correctAnswer: 'て' },
          ],
          successMessage: 'Te-form: three uses, all mastered.',
          emotionalFeedback: {
            perfect: '「て形の達人！」',
            good: 'All three uses handled.',
            struggle: 'Chain / ongoing / request. Three uses, one form.',
          }
        },
      ]
    },
    {
      id: 'L11-U2',
      title: 'Te-form in Daily Life',
      summary: 'Use te-form to describe habits, states, and connected events.',
      steps: [
        {
          id: 'L11-U2-M1',
          title: 'What are you wearing?',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "Festival dress code — describe what you and others are wearing using ています.",
          goal: 'Use ています for states of being (wearing, married, known).',
          vocabulary: [
            { id: 'v11-kite', japanese: 'きています', romaji: 'kite imasu', english: 'is wearing (clothes)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v11-shiroteishatu', japanese: 'しろいシャツ', romaji: 'shiroi shatsu', english: 'white shirt', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v11-megane', japanese: 'めがね', romaji: 'megane', english: 'glasses', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g11-state-imasu',
            pattern: '[te-form] + います for states',
            explanation: 'ています also expresses resulting states: きています = is wearing (the result of putting on clothes).',
            structure: '[state verb te-form] + います',
            examples: ['しろいシャツをきています。', 'めがねをかけています。', 'けっこんしています。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex11-5-1', japanese: 'しろいシャツをきています。', romaji: 'Shiroi shatsu o kite imasu.', english: 'She is wearing a white shirt.', vocabIds: ['v11-kite', 'v11-shiroteishatu'], grammarIds: ['g11-state-imasu'] },
            { id: 'ex11-5-2', japanese: 'めがねをかけています。', romaji: 'Megane o kakete imasu.', english: 'She is wearing glasses.', vocabIds: ['v11-megane'], grammarIds: ['g11-state-imasu'] },
            { id: 'ex11-5-3', japanese: 'ゆきさんはあおいドレスをきています。', romaji: 'Yuki-san wa aoi doresu o kite imasu.', english: 'Yuki is wearing a blue dress.', vocabIds: ['v11-kite'], grammarIds: ['g11-state-imasu'] },
          ],
          branchingChoice: {
            prompt: "You need to describe Yuki to someone who doesn't know her. She's wearing a blue dress:",
            options: [
              { id: 'a', label: 'あおいドレスをきています', outcome: 'correct', reaction: '「あ、わかりました！」 They find Yuki immediately.' },
              { id: 'b', label: 'あおいドレスをきます', outcome: 'wrong', reaction: 'きます = will wear. ています = currently wearing.' },
              { id: 'c', label: 'あおいドレスをきていません', outcome: 'wrong', reaction: 'ていません is negative — she is wearing it.' },
            ]
          },
          dialogueChains: [{ id: 'dl11-2-1', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'ゆきはなにをきていますか？', 2: 'ゆき、何着てる？' }, isLearnerTurn: false, translation: 'What is Yuki wearing?' },
            { speaker: 'You', expectedAnswer: 'あおいドレスをきています', acceptedAnswers: ['あおいドレスをきています。', 'しろいシャツをきています'], isLearnerTurn: true, translation: 'She is wearing a blue dress.' },
            { speaker: 'Mrs. Tanaka', line: { 0: 'かわいいですね！', 2: 'かわいい！' }, isLearnerTurn: false, translation: 'How cute!' },
          ]}],
          questions: [
            { id: 'q11-5-1', type: 'translation-en-jp', prompt: '"Yuki is wearing a blue dress."', correctAnswer: 'ゆきさんはあおいドレスをきています', acceptedAnswers: ['ゆきはあおいドレスをきています。'] },
            { id: 'q11-5-2', type: 'fill-in-blank', prompt: '「めがねをかけ___います。」', correctAnswer: 'て' },
            { id: 'q11-5-3', type: 'multiple-choice', prompt: '"She is wearing a white shirt." — correct:', options: ['しろいシャツをきています', 'しろいシャツをきます', 'しろいシャツをきていません', 'しろいシャツきて'], correctAnswer: 'しろいシャツをきています' },
          ],
          successMessage: 'State descriptions with ています: unlocked.',
          emotionalFeedback: {
            perfect: '「服装も完璧に表現できる！」',
            good: 'State expressed correctly.',
            struggle: 'Wearing = きています. The state result of putting on clothes.',
          }
        },
        {
          id: 'L11-U2-M2',
          title: 'Sequential actions',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Yuki teaches you the club routine. Learn to chain multiple te-forms.",
          goal: 'Chain three or more actions using the te-form.',
          vocabulary: [
            { id: 'v11-shite', japanese: 'して', romaji: 'shite', english: 'do (te-form of します)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v11-kaette', japanese: 'かえって', romaji: 'kaette', english: 'return (te-form)', partOfSpeech: 'verb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g11-chain',
            pattern: 'A-て B-て C-ます',
            explanation: 'Chain multiple te-form verbs to list sequential actions, ending with the final action in ます.',
            structure: '[verb1-te] [verb2-te] [verb3-ます]',
            examples: ['おきて、たべて、がっこうにいきます。', 'クラブをして、かえって、ねます。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex11-6-1', japanese: 'おきて、たべて、がっこうにいきます。', romaji: 'Okite, tabete, gakkou ni ikimasu.', english: 'I wake up, eat, and go to school.', vocabIds: ['v11-te', 'v11-shite'], grammarIds: ['g11-chain'] },
            { id: 'ex11-6-2', japanese: 'クラブをして、かえって、ねます。', romaji: 'Kurabu o shite, kaette, nemasu.', english: 'I do club, return home, and sleep.', vocabIds: ['v11-shite', 'v11-kaette'], grammarIds: ['g11-chain'] },
          ],
          branchingChoice: {
            prompt: "Describe your after-club routine: you go to the club, return home, and study:",
            options: [
              { id: 'a', label: 'クラブをして、かえって、べんきょうします', outcome: 'correct', reaction: '「よくできました！」 The chain is perfect.' },
              { id: 'b', label: 'クラブをした、かえった、べんきょうします', outcome: 'wrong', reaction: 'Those are plain past forms. Te-form connects sequential actions: して、かえって.' },
              { id: 'c', label: 'クラブをします。かえります。べんきょうします', outcome: 'partial', reaction: 'Correct meaning but separate sentences. Chaining with て is more fluent.' },
            ]
          },
          dialogueChains: [{ id: 'dl11-2-2', turns: [
            { speaker: 'Yuki', line: { 0: 'クラブのあとなにをしますか？', 2: 'クラブの後は？' }, isLearnerTurn: false, translation: 'What do you do after club?' },
            { speaker: 'You', expectedAnswer: 'かえって、べんきょうして、ねます', acceptedAnswers: ['うちにかえって、べんきょうします', 'かえって、たべて、ねます'], isLearnerTurn: true, translation: 'I return home, study, and sleep.' },
            { speaker: 'Yuki', line: { 0: 'えらい！', 2: 'えらい！' }, isLearnerTurn: false, translation: "That's admirable!" },
          ]}],
          questions: [
            { id: 'q11-6-1', type: 'translation-en-jp', prompt: '"I wake up, eat, and go to school."', correctAnswer: 'おきて、たべて、がっこうにいきます', acceptedAnswers: ['おきてたべてがっこうにいきます'] },
            { id: 'q11-6-2', type: 'fill-in-blank', prompt: '「クラブをし___、かえって、ねます。」', correctAnswer: 'て' },
            { id: 'q11-6-3', type: 'multiple-choice', prompt: '"I do club, return, and sleep." — correct chain:', options: ['クラブをして、かえって、ねます', 'クラブをした、かえった、ねます', 'クラブをします、かえります、ねます', 'クラブして、かえる、ねます'], correctAnswer: 'クラブをして、かえって、ねます' },
          ],
          successMessage: 'Three-action chain: flawless. Your routine is a story.',
          emotionalFeedback: {
            perfect: '「流れるように話せる！」',
            good: 'Chain delivered perfectly.',
            struggle: 'Each te-form leads to the next. The last verb ends in ます.',
          }
        },
        {
          id: 'L11-U2-M3',
          title: 'Living abroad',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "You describe your life in Japan using ています for ongoing states and habits.",
          goal: 'Use ています for habitual actions and ongoing states.',
          vocabulary: [
            { id: 'v11-sunde', japanese: 'すんでいます', romaji: 'sunde imasu', english: 'is living (in a place)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v11-hataraite', japanese: 'はたらいています', romaji: 'hataraite imasu', english: 'is working', partOfSpeech: 'verb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g11-habitual',
            pattern: 'ています for habits and states',
            explanation: 'ています expresses habitual ongoing actions (I work at X) and permanent states (I live in Y).',
            structure: '[verb te-form] + います',
            examples: ['にほんにすんでいます。', 'まいにちにほんごをべんきょうしています。', 'コンビニではたらいています。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex11-7-1', japanese: 'にほんにすんでいます。', romaji: 'Nihon ni sunde imasu.', english: 'I live in Japan.', vocabIds: ['v11-sunde'], grammarIds: ['g11-habitual'] },
            { id: 'ex11-7-2', japanese: 'まいにちにほんごをべんきょうしています。', romaji: 'Mainichi nihongo o benkyou shite imasu.', english: 'I study Japanese every day.', vocabIds: ['v11-teimasu'], grammarIds: ['g11-habitual'] },
            { id: 'ex11-7-3', japanese: 'コンビニではたらいています。', romaji: 'Konbini de hataraite imasu.', english: 'I work at a convenience store.', vocabIds: ['v11-hataraite'], grammarIds: ['g11-habitual'] },
          ],
          branchingChoice: {
            prompt: "Someone asks where you live. You live in Tokyo:",
            options: [
              { id: 'a', label: 'とうきょうにすんでいます', outcome: 'correct', reaction: '「わあ、いいですね！」' },
              { id: 'b', label: 'とうきょうにすみます', outcome: 'wrong', reaction: 'すみます = will live. すんでいます = currently living.' },
              { id: 'c', label: 'とうきょうですんでいます', outcome: 'wrong', reaction: 'Location of existence: に, not で.' },
            ]
          },
          dialogueChains: [{ id: 'dl11-2-3', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'いまどこにすんでいますか？', 2: '今どこに住んでる？' }, isLearnerTurn: false, translation: 'Where are you living now?' },
            { speaker: 'You', expectedAnswer: 'たなかさんのうちにすんでいます', acceptedAnswers: ['たなかさんのいえにすんでいます', 'ここにすんでいます', 'たなかさんのうちにすんでいます。'], isLearnerTurn: true, translation: "I am living in the Tanaka house." },
            { speaker: 'Mrs. Tanaka', line: { 0: 'そうですよ！いつまでもいてください。', 2: 'そうよ！いつまでもいてね。' }, isLearnerTurn: false, translation: 'That is right! Stay as long as you like.' },
          ]}],
          questions: [
            { id: 'q11-7-1', type: 'translation-en-jp', prompt: '"I live in Japan."', correctAnswer: 'にほんにすんでいます', acceptedAnswers: ['にほんにすんでいます。'] },
            { id: 'q11-7-2', type: 'fill-in-blank', prompt: '「コンビニではたらい___います。」', correctAnswer: 'て' },
            { id: 'q11-7-3', type: 'multiple-choice', prompt: '"I study Japanese every day." — ています form:', options: ['まいにちにほんごをべんきょうしています', 'まいにちにほんごをべんきょうします', 'まいにちにほんごをべんきょうしました', 'まいにちにほんごをべんきょうしていません'], correctAnswer: 'まいにちにほんごをべんきょうしています' },
          ],
          successMessage: 'Habitual ています: your ongoing life described perfectly.',
          emotionalFeedback: {
            perfect: '「生活が語れる！」',
            good: 'Ongoing states expressed naturally.',
            struggle: 'ています for habits and states. Not just right now.',
          }
        },
        {
          id: 'L11-U2-M4',
          title: 'Level 11 Checkpoint',
          kind: 'checkpoint',
          estimatedMinutes: 2,
          isCheckpoint: true,
          minPassScore: 80,
          scenario: "Final test: te-form construction, chaining, ています for action and state.",
          goal: 'Demonstrate full command of Level 11 te-form.',
          vocabulary: [],
          grammar: [],
          examples: [],
          branchingChoice: {
            prompt: "Yuki asks what you're doing right now. You're studying Japanese:",
            options: [
              { id: 'a', label: 'にほんごをべんきょうしています', outcome: 'correct', reaction: '「すごい！」' },
              { id: 'b', label: 'にほんごをべんきょうします', outcome: 'partial', reaction: 'します = habitual/future. ています = right now.' },
              { id: 'c', label: 'にほんごをべんきょうしていません', outcome: 'wrong', reaction: 'ていません is negative — you are studying.' },
            ]
          },
          dialogueChains: [{ id: 'dl11-2-4', turns: [
            { speaker: 'Yuki', line: 'て形のテストです！', isLearnerTurn: false, translation: 'Te-form test!' },
            { speaker: 'You', expectedAnswer: 'おきて、たべて、がっこうにいきます', acceptedAnswers: ['おきてたべてがっこうにいきます', 'おきて、たべて、がっこうにいきます。'], isLearnerTurn: true, translation: 'I wake up, eat, and go to school.' },
            { speaker: 'Yuki', line: '合格！て形バッチリ！', isLearnerTurn: false, translation: 'Pass! Te-form is perfect!' },
          ]}],
          questions: [
            { id: 'q11-cp-1', type: 'multiple-choice', prompt: 'Te-form of たべます:', options: ['たべて', 'たべった', 'たべた', 'たべで'], correctAnswer: 'たべて' },
            { id: 'q11-cp-2', type: 'translation-en-jp', prompt: '"I am studying Japanese."', correctAnswer: 'にほんごをべんきょうしています', acceptedAnswers: ['にほんごをべんきょうしています。'] },
            { id: 'q11-cp-3', type: 'fill-in-blank', prompt: '「はなし___ください。」(please speak)', correctAnswer: 'て' },
            { id: 'q11-cp-4', type: 'sentence-build', prompt: 'Build: "I wake up, eat, and go to school."', correctAnswer: 'おきて、たべて、がっこうにいきます' },
            { id: 'q11-cp-5', type: 'translation-jp-en', prompt: '「にほんにすんでいます」', correctAnswer: 'I live in Japan', acceptedAnswers: ['I am living in Japan.'] },
            { id: 'q11-cp-6', type: 'multiple-choice', prompt: 'Te-form of よみます:', options: ['よんで', 'よみて', 'よいて', 'よって'], correctAnswer: 'よんで' },
          ],
          successMessage: 'Level 11 complete. Te-form is now a natural part of your Japanese.',
          emotionalFeedback: {
            perfect: '「て形の達人！」',
            good: 'Te-form mastery confirmed.',
            struggle: 'You cleared it. Te-form: three powerful uses, one simple form.',
          }
        },
      ]
    }
  ],
  challengeMission: {
    id: 'JL11-challenge',
    title: 'Club Day Challenge',
    kind: 'checkpoint',
    estimatedMinutes: 2,
    scenario: "The school is evaluating all the clubs. Show the judges you can describe ongoing activities, chain actions, and express states perfectly.",
    vocabulary: [],
    grammar: [],
    examples: [],
    questions: [
      { id: 'q11-ch-1', type: 'multiple-choice', prompt: 'Te-form of たべます:', options: ['たべて', 'たべった', 'たべた', 'たべで'], correctAnswer: 'たべて' },
      { id: 'q11-ch-2', type: 'translation-en-jp', prompt: '"I am studying Japanese."', correctAnswer: 'にほんごをべんきょうしています', acceptedAnswers: ['にほんごをべんきょうしています。'] },
      { id: 'q11-ch-3', type: 'fill-in-blank', prompt: '「はなし___ください。」', correctAnswer: 'て' },
      { id: 'q11-ch-4', type: 'sentence-build', prompt: 'Build: "I wake up, eat, and go to school."', correctAnswer: 'おきて、たべて、がっこうにいきます' },
      { id: 'q11-ch-5', type: 'translation-en-jp', prompt: '"I live in Japan."', correctAnswer: 'にほんにすんでいます', acceptedAnswers: ['にほんにすんでいます。'] },
      { id: 'q11-ch-6', type: 'multiple-choice', prompt: 'Te-form of よみます:', options: ['よんで', 'よみて', 'よいて', 'よって'], correctAnswer: 'よんで' },
      { id: 'q11-ch-7', type: 'translation-jp-en', prompt: '「えをかいています」', correctAnswer: 'I am drawing a picture', acceptedAnswers: ['She is drawing a picture.'] },
      { id: 'q11-ch-8', type: 'fill-in-blank', prompt: '「クラブをし___、かえって、ねます。」', correctAnswer: 'て' },
      { id: 'q11-ch-9', type: 'translation-en-jp', prompt: '"Please write your name."', correctAnswer: 'なまえをかいてください', acceptedAnswers: ['なまえをかいてください。'] },
      { id: 'q11-ch-10', type: 'multiple-choice', prompt: '"She is wearing a blue dress." — correct:', options: ['あおいドレスをきています', 'あおいドレスをきます', 'あおいドレスをきていません', 'あおいドレスきて'], correctAnswer: 'あおいドレスをきています' },
      { id: 'q11-ch-11', type: 'sentence-build', prompt: 'Build: "I do club, return home, and sleep."', correctAnswer: 'クラブをして、かえって、ねます' },
      { id: 'q11-ch-12', type: 'fill-in-blank', prompt: '「おんがくをきい___います。」', correctAnswer: 'て' },
      { id: 'q11-ch-13', type: 'translation-en-jp', prompt: '"I work at a convenience store."', correctAnswer: 'コンビニではたらいています', acceptedAnswers: ['コンビニではたらいています。'] },
      { id: 'q11-ch-14', type: 'translation-jp-en', prompt: '「めがねをかけています」', correctAnswer: 'She is wearing glasses', acceptedAnswers: ['He is wearing glasses.'] },
      { id: 'q11-ch-15', type: 'multiple-choice', prompt: '"I eat and then study." — correct:', options: ['たべて、べんきょうします', 'たべた、べんきょうします', 'たべます、べんきょうします', 'たべで、べんきょうします'], correctAnswer: 'たべて、べんきょうします' },
    ],
  }
};
