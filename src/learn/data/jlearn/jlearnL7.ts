import { JLearnLevel } from './jlearnTypes';

export const jlearnLevel7: JLearnLevel = {
  id: 'JL7',
  title: 'Basic Verbs',
  theme: 'Express actions using polite ます-form verbs.',
  location: 'School Cafeteria',
  jlptAlignment: 'N5',
  genkiChapters: [3],
  checkpointUnitId: 'L7-U2',
  badge: { id: 'badge-actor', name: 'Actor', description: 'You can express what anyone does, eats, or goes.' },
  storyHook: {
    type: 'invitation-tease',
    speaker: 'Yuki',
    teaser: "It's lunchtime. Yuki slides her tray next to yours in the cafeteria.",
    japanese: '毎日ここでたべますか？',
    translation: 'Do you eat here every day?'
  },
  units: [
    {
      id: 'L7-U1',
      title: 'ます-form Basics',
      summary: 'Build the polite present/future form for common verbs.',
      steps: [
        {
          id: 'L7-U1-M1',
          title: 'What do you do?',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: "Yuki asks about your daily actions at school.",
          goal: 'Introduce the polite ます-form and use taberu, nomu, miru.',
          vocabulary: [
            { id: 'v7-tabemasu', japanese: 'たべます', romaji: 'tabemasu', english: 'eat (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v7-nomimasu', japanese: 'のみます', romaji: 'nomimasu', english: 'drink (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v7-mimasu', japanese: 'みます', romaji: 'mimasu', english: 'see / watch (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v7-hirugohan', japanese: 'ひるごはん', romaji: 'hirugohan', english: 'lunch', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g7-masu-form',
            pattern: 'Verb-ます (polite present / future)',
            explanation: 'ます-form is the polite dictionary form for present and future actions. Negate with ません.',
            structure: '[verb stem] + ます / ません',
            examples: ['ひるごはんをたべます。', 'みずをのみます。', 'テレビをみます。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex7-1-1', japanese: 'ひるごはんをたべます。', romaji: 'Hirugohan o tabemasu.', english: 'I eat lunch.', vocabIds: ['v7-hirugohan', 'v7-tabemasu'], grammarIds: ['g7-masu-form'] },
            { id: 'ex7-1-2', japanese: 'みずをのみます。', romaji: 'Mizu o nomimasu.', english: 'I drink water.', vocabIds: ['v7-nomimasu'], grammarIds: ['g7-masu-form'] },
            { id: 'ex7-1-3', japanese: 'テレビをみます。', romaji: 'Terebi o mimasu.', english: 'I watch TV.', vocabIds: ['v7-mimasu'], grammarIds: ['g7-masu-form'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks what you drink at lunch. You say water:",
            options: [
              { id: 'a', label: 'みずをのみます', outcome: 'correct', reaction: '「えー、ジュースじゃなくて？」 Yuki is surprised.' },
              { id: 'b', label: 'みずをのみます', outcome: 'correct', reaction: '「健康的！」' },
              { id: 'c', label: 'みずがのみます', outcome: 'wrong', reaction: 'を marks the object of the verb. Use みずを のみます.' },
            ]
          },
          dialogueChains: [{ id: 'dl7-1-1', turns: [
            { speaker: 'Yuki', line: { 0: 'ひるごはんにいつもなにをたべますか？', 2: 'いつもランチは何食べてる？' }, isLearnerTurn: false, translation: 'What do you usually eat for lunch?' },
            { speaker: 'You', expectedAnswer: 'おにぎりをたべます', acceptedAnswers: ['おにぎりをたべます。', 'パンをたべます', 'べんとうをたべます'], isLearnerTurn: true, translation: 'I eat rice balls.' },
            { speaker: 'Yuki', line: { 0: 'おいしいですね！', 2: 'いいね！' }, isLearnerTurn: false, translation: 'That sounds good!' },
          ]}],
          questions: [
            { id: 'q7-1-1', type: 'multiple-choice', prompt: '"I drink water." — correct:', options: ['みずをのみます', 'みずがのみます', 'みずにのみます', 'みずはのみます'], correctAnswer: 'みずをのみます' },
            { id: 'q7-1-2', type: 'translation-en-jp', prompt: '"I watch TV."', correctAnswer: 'テレビをみます', acceptedAnswers: ['テレビをみます。'] },
            { id: 'q7-1-3', type: 'fill-in-blank', prompt: '「ひるごはんを___。」(eat)', correctAnswer: 'たべます' },
          ],
          successMessage: 'ます-form activated. You can express actions now.',
          emotionalFeedback: {
            perfect: '「日本語で話せるじゃない！」',
            good: 'Action verbs flowing naturally.',
            struggle: 'を + verb is the key pattern. Keep going.',
          }
        },
        {
          id: 'L7-U1-M2',
          title: 'Go, come, return',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "After lunch, plans are made. Where is everyone going?",
          goal: 'Use ikimasu, kimasu, kaerimasu with に for destination.',
          vocabulary: [
            { id: 'v7-ikimasu', japanese: 'いきます', romaji: 'ikimasu', english: 'go (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v7-kimasu', japanese: 'きます', romaji: 'kimasu', english: 'come (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v7-kaerimasu', japanese: 'かえります', romaji: 'kaerimasu', english: 'return / go home (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v7-gakkou', japanese: 'がっこう', romaji: 'gakkou', english: 'school', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v7-uchi', japanese: 'うち', romaji: 'uchi', english: 'home / house', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g7-motion-verbs',
            pattern: '[destination] に いきます / きます / かえります',
            explanation: 'に marks the destination for motion verbs: いきます, きます, かえります.',
            structure: '[destination] に [motion verb]',
            examples: ['がっこうにいきます。', 'ここにきます。', 'うちにかえります。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex7-2-1', japanese: 'がっこうにいきます。', romaji: 'Gakkou ni ikimasu.', english: 'I go to school.', vocabIds: ['v7-gakkou', 'v7-ikimasu'], grammarIds: ['g7-motion-verbs'] },
            { id: 'ex7-2-2', japanese: 'うちにかえります。', romaji: 'Uchi ni kaerimasu.', english: 'I return home.', vocabIds: ['v7-uchi', 'v7-kaerimasu'], grammarIds: ['g7-motion-verbs'] },
            { id: 'ex7-2-3', japanese: 'ここにきますか。', romaji: 'Koko ni kimasu ka.', english: 'Are you coming here?', vocabIds: ['v7-kimasu'], grammarIds: ['g7-motion-verbs'] },
          ],
          branchingChoice: {
            prompt: "After school, Yuki asks if you're going home. You say yes:",
            options: [
              { id: 'a', label: 'うちにかえります', outcome: 'correct', reaction: '「じゃあね！またあした！」' },
              { id: 'b', label: 'うちをかえります', outcome: 'wrong', reaction: 'Motion verbs take に for destination, not を.' },
              { id: 'c', label: 'うちがかえります', outcome: 'wrong', reaction: 'に marks the destination: うちに かえります.' },
            ]
          },
          dialogueChains: [{ id: 'dl7-1-2', turns: [
            { speaker: 'Yuki', line: { 0: 'あとでどこにいきますか？', 2: 'このあとどこ行く？' }, isLearnerTurn: false, translation: 'Where are you going later?' },
            { speaker: 'You', expectedAnswer: 'としょかんにいきます', acceptedAnswers: ['としょかんにいきます。', 'うちにかえります', 'コンビニにいきます'], isLearnerTurn: true, translation: 'I am going to the library.' },
            { speaker: 'Yuki', line: { 0: 'そうですか。じゃあまたあした！', 2: 'そっか。またね！' }, isLearnerTurn: false, translation: "I see. See you tomorrow!" },
          ]}],
          questions: [
            { id: 'q7-2-1', type: 'translation-en-jp', prompt: '"I go to school."', correctAnswer: 'がっこうにいきます', acceptedAnswers: ['がっこうにいきます。'] },
            { id: 'q7-2-2', type: 'fill-in-blank', prompt: '「うち___かえります。」', correctAnswer: 'に' },
            { id: 'q7-2-3', type: 'multiple-choice', prompt: '"I return home." — correct:', options: ['うちにかえります', 'うちにいきます', 'うちをかえります', 'うちがかえります'], correctAnswer: 'うちにかえります' },
          ],
          successMessage: 'Motion verbs mastered. You can go anywhere now.',
          emotionalFeedback: {
            perfect: '「どこでもいけるね！」',
            good: 'Destinations marked correctly.',
            struggle: 'Destination + に + motion verb. Locked in.',
          }
        },
        {
          id: 'L7-U1-M3',
          title: "I don't eat that",
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "The cafeteria has a dish you don't eat. You politely decline.",
          goal: 'Use the negative ません form.',
          vocabulary: [
            { id: 'v7-tabemasen', japanese: 'たべません', romaji: 'tabemasen', english: 'do not eat (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v7-niku', japanese: 'にく', romaji: 'niku', english: 'meat', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v7-sakana', japanese: 'さかな', romaji: 'sakana', english: 'fish', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g7-masen',
            pattern: 'Verb-ません (polite negative)',
            explanation: 'Replace ます with ません to negate: たべます → たべません.',
            structure: '[verb stem] + ません',
            examples: ['にくをたべません。', 'さかなをたべません。', 'ここにきません。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex7-3-1', japanese: 'にくをたべません。', romaji: 'Niku o tabemasen.', english: 'I do not eat meat.', vocabIds: ['v7-niku', 'v7-tabemasen'], grammarIds: ['g7-masen'] },
            { id: 'ex7-3-2', japanese: 'さかなはたべません。', romaji: 'Sakana wa tabemasen.', english: 'I do not eat fish.', vocabIds: ['v7-sakana', 'v7-tabemasen'], grammarIds: ['g7-masen'] },
            { id: 'ex7-3-3', japanese: 'きょうはいきません。', romaji: 'Kyou wa ikimasen.', english: 'I am not going today.', vocabIds: [], grammarIds: ['g7-masen'] },
          ],
          branchingChoice: {
            prompt: "Yuki offers you fish. You don't eat fish:",
            options: [
              { id: 'a', label: 'さかなはたべません', outcome: 'correct', reaction: '「あ、ごめんね！じゃあこれは？」 She reaches for something else.' },
              { id: 'b', label: 'さかながたべません', outcome: 'wrong', reaction: 'は or を marks the thing you don\'t eat. さかなは or さかなを.' },
              { id: 'c', label: 'さかなをたべますん', outcome: 'wrong', reaction: 'Incorrect — the negative form is たべません, not たべますん.' },
            ]
          },
          dialogueChains: [{ id: 'dl7-1-3', turns: [
            { speaker: 'Yuki', line: { 0: 'これ、たべますか？にくです。', 2: 'これ食べる？肉だよ。' }, isLearnerTurn: false, translation: 'Do you eat this? It is meat.' },
            { speaker: 'You', expectedAnswer: 'いいえ、にくはたべません', acceptedAnswers: ['にくはたべません', 'いいえ、たべません'], isLearnerTurn: true, translation: 'No, I do not eat meat.' },
            { speaker: 'Yuki', line: { 0: 'そうですか！じゃあ、これは？', 2: 'そっか！じゃこっちは？' }, isLearnerTurn: false, translation: 'I see! Then how about this?' },
          ]}],
          questions: [
            { id: 'q7-3-1', type: 'translation-en-jp', prompt: '"I do not eat fish."', correctAnswer: 'さかなをたべません', acceptedAnswers: ['さかなはたべません', 'さかなをたべません。'] },
            { id: 'q7-3-2', type: 'fill-in-blank', prompt: '「きょうはがっこうに___。」(not going)', correctAnswer: 'いきません' },
            { id: 'q7-3-3', type: 'multiple-choice', prompt: '"I do not drink water." — correct:', options: ['みずをのみません', 'みずがのみません', 'みずをのみますん', 'みずはのみます'], correctAnswer: 'みずをのみません' },
          ],
          successMessage: 'Polite refusal secured. ません is powerful.',
          emotionalFeedback: {
            perfect: '「ちゃんと断れる！」',
            good: 'Declined gracefully.',
            struggle: 'ます → ません. Simple swap. You are doing it.',
          }
        },
        {
          id: 'L7-U1-M4',
          title: 'Verb review sprint',
          kind: 'review',
          estimatedMinutes: 1,
          scenario: "Quiz time in the cafeteria. Yuki tests your verbs.",
          goal: 'Mix positive and negative forms across multiple verbs.',
          vocabulary: [
            { id: 'v7-kakimasu', japanese: 'かきます', romaji: 'kakimasu', english: 'write (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v7-kikimasu', japanese: 'ききます', romaji: 'kikimasu', english: 'listen (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v7-hanashimasu', japanese: 'はなします', romaji: 'hanashimasu', english: 'speak (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g7-verb-review',
            pattern: 'を + ます / ません',
            explanation: 'Review: object particle を + polite verb. Affirmative: ます. Negative: ません.',
            structure: '[object] を [verb]-ます / [verb]-ません',
            examples: ['にほんごをはなします。', 'おんがくをききます。', 'てがみをかきません。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex7-4-1', japanese: 'にほんごをはなします。', romaji: 'Nihongo o hanashimasu.', english: 'I speak Japanese.', vocabIds: ['v7-hanashimasu'], grammarIds: ['g7-verb-review'] },
            { id: 'ex7-4-2', japanese: 'おんがくをききます。', romaji: 'Ongaku o kikimasu.', english: 'I listen to music.', vocabIds: ['v7-kikimasu'], grammarIds: ['g7-verb-review'] },
            { id: 'ex7-4-3', japanese: 'てがみをかきません。', romaji: 'Tegami o kakimasen.', english: 'I do not write letters.', vocabIds: ['v7-kakimasu'], grammarIds: ['g7-verb-review'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks if you speak Japanese. You say yes:",
            options: [
              { id: 'a', label: 'はい、にほんごをはなします', outcome: 'correct', reaction: '「すごい！」 Yuki high-fives you.' },
              { id: 'b', label: 'はい、にほんごがはなします', outcome: 'wrong', reaction: 'を marks the language you speak, not が.' },
              { id: 'c', label: 'はい、はなしますにほんご', outcome: 'wrong', reaction: 'Word order: [object]を [verb]. にほんごを はなします.' },
            ]
          },
          dialogueChains: [{ id: 'dl7-1-4', turns: [
            { speaker: 'Yuki', line: { 0: 'にほんごをはなしますか？', 2: '日本語、話せる？' }, isLearnerTurn: false, translation: 'Do you speak Japanese?' },
            { speaker: 'You', expectedAnswer: 'はい、すこしはなします', acceptedAnswers: ['はい、にほんごをはなします', 'すこしはなします', 'はい、はなします'], isLearnerTurn: true, translation: 'Yes, a little.' },
            { speaker: 'Yuki', line: { 0: 'すごい！もっとおしえてください！', 2: 'すごい！もっと教えて！' }, isLearnerTurn: false, translation: 'Amazing! Please teach me more!' },
          ]}],
          questions: [
            { id: 'q7-4-1', type: 'translation-en-jp', prompt: '"I listen to music."', correctAnswer: 'おんがくをききます', acceptedAnswers: ['おんがくをききます。'] },
            { id: 'q7-4-2', type: 'translation-en-jp', prompt: '"I do not write letters."', correctAnswer: 'てがみをかきません', acceptedAnswers: ['てがみをかきません。'] },
            { id: 'q7-4-3', type: 'multiple-choice', prompt: '"I speak Japanese." — correct:', options: ['にほんごをはなします', 'にほんごがはなします', 'にほんごにはなします', 'にほんごではなします'], correctAnswer: 'にほんごをはなします' },
          ],
          successMessage: 'Verb set locked in. Action vocabulary growing.',
          emotionalFeedback: {
            perfect: '「動詞マスター！」',
            good: 'Smooth and accurate.',
            struggle: 'One verb at a time. You are making progress.',
          }
        },
      ]
    },
    {
      id: 'L7-U2',
      title: 'Verbs in Context',
      summary: 'Use verbs to discuss plans, habits, and routines.',
      steps: [
        {
          id: 'L7-U2-M1',
          title: 'What do you do on weekends?',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "Yuki asks about your weekend habits.",
          goal: 'Use frequency adverbs with ます-form verbs.',
          vocabulary: [
            { id: 'v7-mainichi', japanese: 'まいにち', romaji: 'mainichi', english: 'every day', partOfSpeech: 'adverb', jlptLevel: 'N5' },
            { id: 'v7-tokidoki', japanese: 'ときどき', romaji: 'tokidoki', english: 'sometimes', partOfSpeech: 'adverb', jlptLevel: 'N5' },
            { id: 'v7-amari', japanese: 'あまり', romaji: 'amari', english: 'not much (+ negative)', partOfSpeech: 'adverb', jlptLevel: 'N5' },
            { id: 'v7-zenzen', japanese: 'ぜんぜん', romaji: 'zenzen', english: 'not at all (+ negative)', partOfSpeech: 'adverb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g7-frequency',
            pattern: 'まいにち / ときどき / あまり～ません / ぜんぜん～ません',
            explanation: 'Frequency adverbs come before the verb. あまり and ぜんぜん always pair with negative ません.',
            structure: '[frequency] + [verb]-ます / [verb]-ません',
            examples: ['まいにちにほんごをべんきょうします。', 'ときどきえいがをみます。', 'あまりにくをたべません。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex7-5-1', japanese: 'まいにちにほんごをべんきょうします。', romaji: 'Mainichi nihongo o benkyou shimasu.', english: 'I study Japanese every day.', vocabIds: ['v7-mainichi'], grammarIds: ['g7-frequency'] },
            { id: 'ex7-5-2', japanese: 'ときどきえいがをみます。', romaji: 'Tokidoki eiga o mimasu.', english: 'I sometimes watch movies.', vocabIds: ['v7-tokidoki', 'v7-mimasu'], grammarIds: ['g7-frequency'] },
            { id: 'ex7-5-3', japanese: 'あまりにくをたべません。', romaji: 'Amari niku o tabemasen.', english: "I don't eat much meat.", vocabIds: ['v7-amari', 'v7-niku', 'v7-tabemasen'], grammarIds: ['g7-frequency'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks if you study Japanese a lot. You study a little but not much:",
            options: [
              { id: 'a', label: 'あまりべんきょうしません', outcome: 'correct', reaction: '「えー、もっとやってよ！」 Yuki pouts.' },
              { id: 'b', label: 'あまりべんきょうします', outcome: 'wrong', reaction: 'あまり must pair with a negative verb: ません.' },
              { id: 'c', label: 'ぜんぜんべんきょうします', outcome: 'wrong', reaction: 'ぜんぜん also needs ません: "not at all."' },
            ]
          },
          dialogueChains: [{ id: 'dl7-2-1', turns: [
            { speaker: 'Yuki', line: { 0: 'しゅうまつになにをしますか？', 2: '週末、何してる？' }, isLearnerTurn: false, translation: 'What do you do on weekends?' },
            { speaker: 'You', expectedAnswer: 'ときどきえいがをみます', acceptedAnswers: ['まいにちべんきょうします', 'ときどきおんがくをききます', 'ときどきえいがをみます。'], isLearnerTurn: true, translation: 'I sometimes watch movies.' },
            { speaker: 'Yuki', line: { 0: 'いいですね！わたしもすきです。', 2: 'いいね！私も好き！' }, isLearnerTurn: false, translation: 'Nice! I like that too.' },
          ]}],
          questions: [
            { id: 'q7-5-1', type: 'translation-en-jp', prompt: '"I study Japanese every day."', correctAnswer: 'まいにちにほんごをべんきょうします', acceptedAnswers: ['まいにちにほんごをべんきょうします。'] },
            { id: 'q7-5-2', type: 'fill-in-blank', prompt: '「___にくをたべません。」(not much)', correctAnswer: 'あまり' },
            { id: 'q7-5-3', type: 'multiple-choice', prompt: '"I don\'t watch TV at all." — correct:', options: ['ぜんぜんテレビをみません', 'ぜんぜんテレビをみます', 'あまりテレビをみません', 'まいにちテレビをみません'], correctAnswer: 'ぜんぜんテレビをみません' },
          ],
          successMessage: 'Frequency expressions added to your verb toolkit.',
          emotionalFeedback: {
            perfect: '「生活が見えてきた！」',
            good: 'Habits expressed clearly.',
            struggle: 'あまり and ぜんぜん always need ません. Remember that.',
          }
        },
        {
          id: 'L7-U2-M2',
          title: "Let's go together",
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "After school, you and Yuki make plans.",
          goal: 'Use いっしょに and make invitations with ませんか.',
          vocabulary: [
            { id: 'v7-issho', japanese: 'いっしょに', romaji: 'issho ni', english: 'together', partOfSpeech: 'adverb', jlptLevel: 'N5' },
            { id: 'v7-masenka', japanese: 'ませんか', romaji: 'masen ka', english: 'Won\'t you...? (invitation)', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v7-toshokan', japanese: 'としょかん', romaji: 'toshokan', english: 'library', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g7-masenka',
            pattern: '～ませんか (invitation)',
            explanation: 'Replace ます with ませんか to make a polite invitation: "Won\'t you...?"',
            structure: '[verb stem] + ませんか',
            examples: ['いっしょにいきませんか。', 'としょかんにいきませんか。', 'いっしょにたべませんか。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex7-6-1', japanese: 'いっしょにいきませんか。', romaji: 'Issho ni ikimasen ka.', english: "Won't you come with me?", vocabIds: ['v7-issho', 'v7-masenka'], grammarIds: ['g7-masenka'] },
            { id: 'ex7-6-2', japanese: 'としょかんにいきませんか。', romaji: 'Toshokan ni ikimasen ka.', english: "Won't you go to the library?", vocabIds: ['v7-toshokan', 'v7-masenka'], grammarIds: ['g7-masenka'] },
            { id: 'ex7-6-3', japanese: 'いっしょにひるごはんをたべませんか。', romaji: 'Issho ni hirugohan o tabemasen ka.', english: "Won't you have lunch together?", vocabIds: ['v7-issho', 'v7-hirugohan', 'v7-masenka'], grammarIds: ['g7-masenka'] },
          ],
          branchingChoice: {
            prompt: "You want to invite Yuki to the library. You say:",
            options: [
              { id: 'a', label: 'いっしょにとしょかんにいきませんか', outcome: 'correct', reaction: '「いいですね！いきましょう！」 Yuki grabs her bag.' },
              { id: 'b', label: 'いっしょにとしょかんにいきますか', outcome: 'partial', reaction: 'ますか is a question, but ませんか is the warmer invitation form.' },
              { id: 'c', label: 'としょかんにいきません', outcome: 'wrong', reaction: 'That says "I\'m not going." Add か to make it an invitation.' },
            ]
          },
          dialogueChains: [{ id: 'dl7-2-2', turns: [
            { speaker: 'You', expectedAnswer: 'いっしょにたべませんか', acceptedAnswers: ['いっしょにひるごはんをたべませんか', 'いっしょにたべませんか？'], isLearnerTurn: true, translation: "Won't you eat together?" },
            { speaker: 'Yuki', line: { 0: 'はい！いきましょう！', 2: 'うん！行こう！' }, isLearnerTurn: false, translation: 'Yes! Let\'s go!' },
            { speaker: 'You', expectedAnswer: 'よかったです', acceptedAnswers: ['よかった！', 'やった！', 'よかったです。'], isLearnerTurn: true, translation: 'Great!' },
          ]}],
          questions: [
            { id: 'q7-6-1', type: 'translation-en-jp', prompt: '"Won\'t you go to the library together?"', correctAnswer: 'いっしょにとしょかんにいきませんか', acceptedAnswers: ['いっしょにとしょかんにいきませんか？'] },
            { id: 'q7-6-2', type: 'fill-in-blank', prompt: '「いっしょにたべ___か。」(invitation)', correctAnswer: 'ません' },
            { id: 'q7-6-3', type: 'multiple-choice', prompt: 'Invitation form of いきます:', options: ['いきませんか', 'いきますか', 'いきません', 'いきましょう'], correctAnswer: 'いきませんか' },
          ],
          successMessage: 'Invitation made. Yuki said yes.',
          emotionalFeedback: {
            perfect: '「ちゃんと誘えるじゃない！」',
            good: 'Polite and clear invitation.',
            struggle: 'ませんか = invitation. ますか = question. Know the difference.',
          }
        },
        {
          id: 'L7-U2-M3',
          title: 'School life Q&A',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Yuki asks you many questions about your school life.",
          goal: 'Answer varied verb questions fluently using ます and ません.',
          vocabulary: [
            { id: 'v7-benkyou', japanese: 'べんきょうします', romaji: 'benkyou shimasu', english: 'study (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v7-asobimasu', japanese: 'あそびます', romaji: 'asobimasu', english: 'play / hang out (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g7-qa-verbs',
            pattern: '～ますか → はい、～ます / いいえ、～ません',
            explanation: 'Full Q&A pattern with polite verbs. はい + ます or いいえ + ません.',
            structure: '[subject] は [object] を [verb]-ますか → はい、～ます / いいえ、～ません',
            examples: ['にほんごをはなしますか。はい、はなします。', 'まいにちべんきょうしますか。いいえ、あまりしません。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex7-7-1', japanese: 'にほんごをはなしますか。はい、すこしはなします。', romaji: 'Nihongo o hanashimasu ka. Hai, sukoshi hanashimasu.', english: 'Do you speak Japanese? Yes, a little.', vocabIds: ['v7-hanashimasu'], grammarIds: ['g7-qa-verbs'] },
            { id: 'ex7-7-2', japanese: 'まいにちべんきょうしますか。いいえ、あまりしません。', romaji: 'Mainichi benkyou shimasu ka. Iie, amari shimasen.', english: 'Do you study every day? No, not much.', vocabIds: ['v7-benkyou', 'v7-amari'], grammarIds: ['g7-qa-verbs'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks: 「まいにちべんきょうしますか？」 You study sometimes:",
            options: [
              { id: 'a', label: 'ときどきべんきょうします', outcome: 'correct', reaction: '「そうですか。いっしょにべんきょうしましょう！」' },
              { id: 'b', label: 'ぜんぜんべんきょうします', outcome: 'wrong', reaction: 'ぜんぜん must pair with ません. It means "not at all."' },
              { id: 'c', label: 'まいにちべんきょうしません', outcome: 'wrong', reaction: 'That says you never study every day — contradictory. Use ときどき.' },
            ]
          },
          dialogueChains: [{ id: 'dl7-2-3', turns: [
            { speaker: 'Yuki', line: { 0: 'しゅうまつはなにをしますか？', 2: '週末なにしてる？' }, isLearnerTurn: false, translation: 'What do you do on weekends?' },
            { speaker: 'You', expectedAnswer: 'ともだちとあそびます', acceptedAnswers: ['ともだちとあそびます。', 'おんがくをききます', 'えいがをみます'], isLearnerTurn: true, translation: 'I hang out with friends.' },
            { speaker: 'Yuki', line: { 0: 'いいですね！わたしもいきたいです！', 2: 'いいな！私も行きたい！' }, isLearnerTurn: false, translation: 'Nice! I want to go too!' },
          ]}],
          questions: [
            { id: 'q7-7-1', type: 'translation-en-jp', prompt: '"Do you speak Japanese?"', correctAnswer: 'にほんごをはなしますか', acceptedAnswers: ['にほんごをはなしますか？'] },
            { id: 'q7-7-2', type: 'multiple-choice', prompt: 'Answer to "do you study every day?" — not much:', options: ['いいえ、あまりしません', 'いいえ、ぜんぜんします', 'はい、あまりします', 'いいえ、まいにちします'], correctAnswer: 'いいえ、あまりしません' },
            { id: 'q7-7-3', type: 'fill-in-blank', prompt: '「ともだちとあそび___。」(do play)', correctAnswer: 'ます' },
          ],
          successMessage: 'Q&A fluency growing. Yuki looks impressed.',
          emotionalFeedback: {
            perfect: '「もう日本人みたい！」',
            good: 'Every answer landed.',
            struggle: 'Q&A with ます takes practice. You are in it.',
          }
        },
        {
          id: 'L7-U2-M4',
          title: 'Level 7 Checkpoint',
          kind: 'checkpoint',
          estimatedMinutes: 2,
          isCheckpoint: true,
          minPassScore: 80,
          scenario: "Final test: ます-form verbs, negative ません, motion verbs, frequency words, and invitations.",
          goal: 'Demonstrate full command of Level 7 verbs.',
          vocabulary: [],
          grammar: [],
          examples: [],
          branchingChoice: {
            prompt: "You want to invite Yuki to eat lunch together:",
            options: [
              { id: 'a', label: 'いっしょにたべませんか', outcome: 'correct', reaction: '「もちろん！」' },
              { id: 'b', label: 'いっしょにたべますか', outcome: 'partial', reaction: 'Understood — but ませんか is the proper invitation form.' },
              { id: 'c', label: 'いっしょにたべません', outcome: 'wrong', reaction: 'That says "we won\'t eat together." Add か for an invitation.' },
            ]
          },
          dialogueChains: [{ id: 'dl7-2-4', turns: [
            { speaker: 'Yuki', line: 'さあ、動詞テストです！', isLearnerTurn: false, translation: "Now — verb test!" },
            { speaker: 'You', expectedAnswer: 'まいにちにほんごをべんきょうします', acceptedAnswers: ['まいにちべんきょうします', 'まいにちにほんごをべんきょうします。'], isLearnerTurn: true, translation: 'I study Japanese every day.' },
            { speaker: 'Yuki', line: '合格！すごい！', isLearnerTurn: false, translation: 'Pass! Amazing!' },
          ]}],
          questions: [
            { id: 'q7-cp-1', type: 'translation-en-jp', prompt: '"I go to school."', correctAnswer: 'がっこうにいきます', acceptedAnswers: ['がっこうにいきます。'] },
            { id: 'q7-cp-2', type: 'translation-en-jp', prompt: '"I do not eat meat."', correctAnswer: 'にくをたべません', acceptedAnswers: ['にくはたべません', 'にくをたべません。'] },
            { id: 'q7-cp-3', type: 'fill-in-blank', prompt: '「___テレビをみません。」(not at all)', correctAnswer: 'ぜんぜん' },
            { id: 'q7-cp-4', type: 'sentence-build', prompt: '"Won\'t you go to the library together?"', correctAnswer: 'いっしょにとしょかんにいきませんか' },
            { id: 'q7-cp-5', type: 'translation-jp-en', prompt: '「ときどきえいがをみます」', correctAnswer: 'I sometimes watch movies', acceptedAnswers: ['Sometimes I watch movies.'] },
            { id: 'q7-cp-6', type: 'multiple-choice', prompt: '"I return home." — correct:', options: ['うちにかえります', 'うちをかえります', 'うちにいきます', 'うちがかえります'], correctAnswer: 'うちにかえります' },
          ],
          successMessage: 'Level 7 complete. Verbs are your new superpower.',
          emotionalFeedback: {
            perfect: '「行動を表現できる！」 Yuki cheers.',
            good: 'Verb mastery achieved.',
            struggle: 'You cleared it. ます-form is yours.',
          }
        },
      ]
    }
  ],
  challengeMission: {
    id: 'JL7-challenge',
    title: 'Cafeteria Quiz Challenge',
    kind: 'checkpoint',
    estimatedMinutes: 2,
    scenario: "The school quiz club has set up a booth in the cafeteria. Prove your verb mastery to earn a stamp.",
    vocabulary: [],
    grammar: [],
    examples: [],
    questions: [
      { id: 'q7-ch-1', type: 'translation-en-jp', prompt: '"I eat lunch."', correctAnswer: 'ひるごはんをたべます', acceptedAnswers: ['ひるごはんをたべます。'] },
      { id: 'q7-ch-2', type: 'multiple-choice', prompt: '"I return home." — correct:', options: ['うちにかえります', 'うちをかえります', 'うちがかえります', 'うちでかえります'], correctAnswer: 'うちにかえります' },
      { id: 'q7-ch-3', type: 'fill-in-blank', prompt: '「___テレビをみません。」(not at all)', correctAnswer: 'ぜんぜん' },
      { id: 'q7-ch-4', type: 'translation-en-jp', prompt: '"I do not eat fish."', correctAnswer: 'さかなをたべません', acceptedAnswers: ['さかなはたべません', 'さかなをたべません。'] },
      { id: 'q7-ch-5', type: 'multiple-choice', prompt: '"Won\'t you come with me?" — correct:', options: ['いっしょにいきませんか', 'いっしょにいきますか', 'いっしょにいきます', 'いっしょにいきません'], correctAnswer: 'いっしょにいきませんか' },
      { id: 'q7-ch-6', type: 'sentence-build', prompt: 'Build: "I go to school every day."', correctAnswer: 'まいにちがっこうにいきます' },
      { id: 'q7-ch-7', type: 'translation-jp-en', prompt: '「ときどきおんがくをききます」', correctAnswer: 'I sometimes listen to music', acceptedAnswers: ['Sometimes I listen to music.'] },
      { id: 'q7-ch-8', type: 'fill-in-blank', prompt: '「にほんごをはなし___か。」(do you speak)', correctAnswer: 'ます' },
      { id: 'q7-ch-9', type: 'multiple-choice', prompt: '"I don\'t eat much meat." — correct:', options: ['あまりにくをたべません', 'あまりにくをたべます', 'ぜんぜんにくをたべません', 'まいにちにくをたべません'], correctAnswer: 'あまりにくをたべません' },
      { id: 'q7-ch-10', type: 'translation-en-jp', prompt: '"I listen to music."', correctAnswer: 'おんがくをききます', acceptedAnswers: ['おんがくをききます。'] },
      { id: 'q7-ch-11', type: 'multiple-choice', prompt: '"I write letters." — correct:', options: ['てがみをかきます', 'てがみがかきます', 'てがみにかきます', 'てがみをかきません'], correctAnswer: 'てがみをかきます' },
      { id: 'q7-ch-12', type: 'fill-in-blank', prompt: '「がっこう___いきます。」', correctAnswer: 'に' },
      { id: 'q7-ch-13', type: 'sentence-build', prompt: 'Build: "Won\'t you go to the library together?"', correctAnswer: 'いっしょにとしょかんにいきませんか' },
      { id: 'q7-ch-14', type: 'translation-jp-en', prompt: '「まいにちにほんごをべんきょうします」', correctAnswer: 'I study Japanese every day', acceptedAnswers: ['Every day I study Japanese.'] },
      { id: 'q7-ch-15', type: 'multiple-choice', prompt: '"I speak Japanese." — correct:', options: ['にほんごをはなします', 'にほんごがはなします', 'にほんごにはなします', 'にほんごではなします'], correctAnswer: 'にほんごをはなします' },
    ],
  }
};
