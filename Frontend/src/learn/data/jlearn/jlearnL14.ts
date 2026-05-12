import { JLearnLevel } from './jlearnTypes';

export const jlearnLevel14: JLearnLevel = {
  id: 'JL14',
  title: 'N5 Final Review',
  theme: 'Bring together everything from N5 — one year of Japanese in one final session.',
  location: 'Tanaka House — One Year Later',
  jlptAlignment: 'N5',
  genkiChapters: [1, 2, 3, 4, 5, 6, 7, 9],
  checkpointUnitId: 'L14-U2',
  badge: { id: 'badge-n5-ready', name: 'N5 Ready', description: 'You have completed the full N5 curriculum. You are ready.' },
  storyHook: {
    type: 'invitation-tease',
    speaker: 'Mrs. Tanaka',
    teaser: "One year later. You sit in the same living room where it all started. Mrs. Tanaka sets down tea and smiles.",
    japanese: 'もう一年ですね。本当に上手になりましたよ。',
    translation: 'It has already been a year. You have really improved.'
  },
  units: [
    {
      id: 'L14-U1',
      title: 'Review: Foundations',
      summary: 'Levels 1–7: greetings, demonstratives, possession, location, existence, and basic verbs.',
      steps: [
        {
          id: 'L14-U1-M1',
          title: 'Greetings & Identity (L1–L2)',
          kind: 'review',
          estimatedMinutes: 2,
          scenario: "A new exchange student arrives. You introduce yourself and help them settle in.",
          goal: 'Review greetings, self-introduction, and basic desu/wa sentences.',
          vocabulary: [
            { id: 'v14-hajimemashite', japanese: 'はじめまして', romaji: 'hajimemashite', english: 'Nice to meet you', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v14-yoroshiku', japanese: 'よろしくおねがいします', romaji: 'yoroshiku onegai shimasu', english: 'Please treat me well', partOfSpeech: 'expression', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g14-intro-review',
            pattern: 'Self-introduction: わたしは～です。～からきました。',
            explanation: 'Full introduction: name, origin, occupation or role. Core L1-L2 patterns.',
            structure: 'はじめまして。わたしは [name] です。[country] からきました。よろしくおねがいします。',
            examples: ['はじめまして。わたしはゆきです。にほんからきました。よろしくおねがいします。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex14-1-1', japanese: 'はじめまして。わたしはマリアです。スペインからきました。', romaji: 'Hajimemashite. Watashi wa Maria desu. Supein kara kimashita.', english: "Nice to meet you. I'm Maria. I came from Spain.", vocabIds: ['v14-hajimemashite'], grammarIds: ['g14-intro-review'] },
            { id: 'ex14-1-2', japanese: 'よろしくおねがいします。', romaji: 'Yoroshiku onegai shimasu.', english: 'Please treat me well.', vocabIds: ['v14-yoroshiku'], grammarIds: ['g14-intro-review'] },
          ],
          branchingChoice: {
            prompt: "The new student asks where you are from. You're from Turkey:",
            options: [
              { id: 'a', label: 'トルコからきました', outcome: 'correct', reaction: '「わあ、はじめてのトルコじんです！」 Yuki is excited.' },
              { id: 'b', label: 'トルコにいます', outcome: 'partial', reaction: 'にいます = am in Turkey. からきました = came from Turkey.' },
              { id: 'c', label: 'トルコがきました', outcome: 'wrong', reaction: 'Use から for origin: トルコから きました.' },
            ]
          },
          dialogueChains: [{ id: 'dl14-1-1', turns: [
            { speaker: 'New Student', line: 'はじめまして！わたしはケンタです。よろしく！', isLearnerTurn: false, translation: "Nice to meet you! I'm Kenta. Nice to meet you!" },
            { speaker: 'You', expectedAnswer: 'はじめまして。わたしは[name]です。よろしくおねがいします', acceptedAnswers: ['はじめまして', 'よろしくおねがいします', 'はじめまして。よろしくおねがいします'], isLearnerTurn: true, translation: "Nice to meet you. I'm [name]. Please treat me well." },
            { speaker: 'Mrs. Tanaka', line: 'なかよくしてくださいね！', isLearnerTurn: false, translation: 'Please get along well!' },
          ]}],
          questions: [
            { id: 'q14-1-1', type: 'translation-en-jp', prompt: '"Nice to meet you."', correctAnswer: 'はじめまして', acceptedAnswers: ['はじめまして。'] },
            { id: 'q14-1-2', type: 'translation-en-jp', prompt: '"I came from Turkey."', correctAnswer: 'トルコからきました', acceptedAnswers: ['トルコからきました。'] },
            { id: 'q14-1-3', type: 'fill-in-blank', prompt: '「よろしく___します。」', correctAnswer: 'おねがい' },
            { id: 'q14-1-4', type: 'multiple-choice', prompt: '"What time is it?" — correct:', options: ['いまなんじですか', 'いまなんぷんですか', 'いまなんですか', 'いまじですか'], correctAnswer: 'いまなんじですか' },
            { id: 'q14-1-5', type: 'translation-en-jp', prompt: '"It\'s 7:30."', correctAnswer: 'しちじはんです', acceptedAnswers: ['しちじはんです。'] },
          ],
          successMessage: 'Foundations refreshed. L1-L2 patterns: solid.',
          emotionalFeedback: {
            perfect: '「はじめた頃からずっと成長してる！」',
            good: 'Foundations strong.',
            struggle: 'The basics are always worth revisiting.',
          }
        },
        {
          id: 'L14-U1-M2',
          title: 'Demonstratives, Possession & Location (L4–L6)',
          kind: 'review',
          estimatedMinutes: 2,
          scenario: "Kenta needs help navigating the house. You guide him using everything from L4-L6.",
          goal: 'Review demonstratives (これ/この), possession (の), and location (います/あります/に).',
          vocabulary: [],
          grammar: [{
            id: 'g14-mid-review',
            pattern: 'Demonstratives + possession + location combined',
            explanation: 'Combine all three systems: point at things, show ownership, describe location.',
            structure: '[demonstrative] + [possession] + [location verb]',
            examples: ['これはわたしのです。', 'たなかさんのへやはにかいにあります。', 'ねこはいすのしたにいます。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex14-2-1', japanese: 'これはわたしのかばんです。', romaji: 'Kore wa watashi no kaban desu.', english: "This is my bag.", vocabIds: [], grammarIds: ['g14-mid-review'] },
            { id: 'ex14-2-2', japanese: 'たなかさんのへやはにかいにあります。', romaji: "Tanaka-san no heya wa nikai ni arimasu.", english: "Mrs. Tanaka's room is on the second floor.", vocabIds: [], grammarIds: ['g14-mid-review'] },
          ],
          branchingChoice: {
            prompt: "Kenta asks where the bathroom is. It's on the second floor:",
            options: [
              { id: 'a', label: 'トイレはにかいにあります', outcome: 'correct', reaction: '「ありがとうございます！」 Kenta rushes upstairs.' },
              { id: 'b', label: 'トイレはにかいにいます', outcome: 'wrong', reaction: 'Bathroom is a non-living thing: あります.' },
              { id: 'c', label: 'トイレがにかいです', outcome: 'partial', reaction: 'Understood — but にあります makes the location explicit.' },
            ]
          },
          dialogueChains: [{ id: 'dl14-1-2', turns: [
            { speaker: 'Kenta', line: 'ここはだれのへやですか？', isLearnerTurn: false, translation: "Whose room is this?" },
            { speaker: 'You', expectedAnswer: 'これはたなかさんのへやです', acceptedAnswers: ['たなかさんのへやです', 'これはたなかさんのへやです。'], isLearnerTurn: true, translation: "This is Mrs. Tanaka's room." },
            { speaker: 'Kenta', line: 'そうですか！ありがとうございます。', isLearnerTurn: false, translation: 'I see! Thank you.' },
          ]}],
          questions: [
            { id: 'q14-2-1', type: 'translation-en-jp', prompt: '"This is my bag."', correctAnswer: 'これはわたしのかばんです', acceptedAnswers: ['これはわたしのかばんです。'] },
            { id: 'q14-2-2', type: 'multiple-choice', prompt: '"The cat is under the chair." — correct:', options: ['いすのしたにねこがいます', 'いすのうえにねこがあります', 'いすのしたにねこがあります', 'ねこはいすがいます'], correctAnswer: 'いすのしたにねこがいます' },
            { id: 'q14-2-3', type: 'fill-in-blank', prompt: '「トイレはにかい___あります。」', correctAnswer: 'に' },
            { id: 'q14-2-4', type: 'translation-en-jp', prompt: '"Whose book is this?"', correctAnswer: 'これはだれのほんですか', acceptedAnswers: ['これはだれのほんですか？'] },
            { id: 'q14-2-5', type: 'multiple-choice', prompt: '"That bread, please." (near listener):', options: ['そのパンをください', 'このパンをください', 'あのパンをください', 'どのパンをください'], correctAnswer: 'そのパンをください' },
          ],
          successMessage: 'Mid-level foundations solid. The house is mapped.',
          emotionalFeedback: {
            perfect: '「住んでる人みたいに案内できる！」',
            good: 'Location and possession clear.',
            struggle: 'Keep reviewing L4-L6. They are the backbone.',
          }
        },
        {
          id: 'L14-U1-M3',
          title: 'Verbs & Time (L7–L8)',
          kind: 'review',
          estimatedMinutes: 2,
          scenario: "Planning tomorrow's schedule with Kenta. Verbs and time expressions in full use.",
          goal: 'Review ます-form verbs, motion verbs, time + に, and から/まで.',
          vocabulary: [],
          grammar: [{
            id: 'g14-verb-time-review',
            pattern: 'Verb-ます + time に + から/まで',
            explanation: 'Chain time expressions and verb forms to describe a full schedule.',
            structure: '[time]に[verb] / [time]から[time]まで[verb]',
            examples: ['はちじにがっこうにいきます。', 'くじからさんじまでべんきょうします。', 'にくをたべません。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex14-3-1', japanese: 'はちじにがっこうにいきます。', romaji: 'Hachi-ji ni gakkou ni ikimasu.', english: 'I go to school at eight.', vocabIds: [], grammarIds: ['g14-verb-time-review'] },
            { id: 'ex14-3-2', japanese: 'くじからさんじまでべんきょうします。', romaji: 'Ku-ji kara san-ji made benkyou shimasu.', english: 'I study from nine to three.', vocabIds: [], grammarIds: ['g14-verb-time-review'] },
          ],
          branchingChoice: {
            prompt: "Kenta asks what time school ends. It ends at 3:30:",
            options: [
              { id: 'a', label: 'さんじはんにおわります', outcome: 'correct', reaction: '「わかりました！」' },
              { id: 'b', label: 'さんじはんでおわります', outcome: 'wrong', reaction: 'Time + に, not で.' },
              { id: 'c', label: 'さんじはんからおわります', outcome: 'wrong', reaction: 'から = from. Use に for when something ends.' },
            ]
          },
          dialogueChains: [{ id: 'dl14-1-3', turns: [
            { speaker: 'Kenta', line: 'まいにちなんじにおきますか？', isLearnerTurn: false, translation: 'What time do you wake up every day?' },
            { speaker: 'You', expectedAnswer: 'しちじにおきます', acceptedAnswers: ['しちじにおきます。', 'はちじにおきます'], isLearnerTurn: true, translation: 'I wake up at seven.' },
            { speaker: 'Kenta', line: 'そうですか！わたしもです！', isLearnerTurn: false, translation: 'Is that so! Me too!' },
          ]}],
          questions: [
            { id: 'q14-3-1', type: 'translation-en-jp', prompt: '"I go to school at eight."', correctAnswer: 'はちじにがっこうにいきます', acceptedAnswers: ['はちじにがっこうにいきます。'] },
            { id: 'q14-3-2', type: 'translation-en-jp', prompt: '"I do not eat meat."', correctAnswer: 'にくをたべません', acceptedAnswers: ['にくはたべません', 'にくをたべません。'] },
            { id: 'q14-3-3', type: 'fill-in-blank', prompt: '「くじ___さんじまでべんきょうします。」', correctAnswer: 'から' },
            { id: 'q14-3-4', type: 'translation-en-jp', prompt: '"Won\'t you study together?"', correctAnswer: 'いっしょにべんきょうしませんか', acceptedAnswers: ['いっしょにべんきょうしませんか？'] },
            { id: 'q14-3-5', type: 'multiple-choice', prompt: '"I return home." — correct:', options: ['うちにかえります', 'うちをかえります', 'うちがかえります', 'うちでかえります'], correctAnswer: 'うちにかえります' },
          ],
          successMessage: 'Verbs and time: sharp. Schedule-making at native level.',
          emotionalFeedback: {
            perfect: '「スケジュール帳いらず！」',
            good: 'Verbs and time solid.',
            struggle: 'に for time. から for start. まで for end. Three anchors.',
          }
        },
        {
          id: 'L14-U1-M4',
          title: 'Adjectives & Descriptions (L9)',
          kind: 'review',
          estimatedMinutes: 2,
          scenario: "Everyone is describing the year's memories. い-adjectives and な-adjectives in full use.",
          goal: 'Review い-adj and な-adj positive, negative, and noun-modifying forms.',
          vocabulary: [],
          grammar: [{
            id: 'g14-adj-review',
            pattern: 'い-adj: い/くない/くて + noun; な-adj: な/ではない/で + noun',
            explanation: 'All adjective forms: predicate, negative, and noun-modifier for both types.',
            structure: '[adj-type specific forms]',
            examples: ['おもしろいえいが。', 'たかくないです。', 'しずかなへや。', 'にほんごがすきです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex14-4-1', japanese: 'おもしろいえいがをみました。', romaji: 'Omoshiroi eiga o mimashita.', english: 'I watched an interesting movie.', vocabIds: [], grammarIds: ['g14-adj-review'] },
            { id: 'ex14-4-2', japanese: 'このかばんはたかくないです。', romaji: 'Kono kaban wa takaku nai desu.', english: "This bag isn't expensive.", vocabIds: [], grammarIds: ['g14-adj-review'] },
            { id: 'ex14-4-3', japanese: 'しずかなへやがすきです。', romaji: 'Shizuka na heya ga suki desu.', english: 'I like quiet rooms.', vocabIds: [], grammarIds: ['g14-adj-review'] },
          ],
          branchingChoice: {
            prompt: "Kenta describes the food as not good (いい). You help:",
            options: [
              { id: 'a', label: 'よくないです', outcome: 'correct', reaction: '「そう言いたかった！」 Kenta learns the irregular.' },
              { id: 'b', label: 'いいくないです', outcome: 'wrong', reaction: 'いい is irregular: negative is よくない, not いいくない.' },
              { id: 'c', label: 'いくないです', outcome: 'wrong', reaction: 'Irregular: いい → よくない. One of only a few exceptions.' },
            ]
          },
          dialogueChains: [{ id: 'dl14-1-4', turns: [
            { speaker: 'Kenta', line: 'たなかさんのりょうりはどうですか？', isLearnerTurn: false, translation: "What is Mrs. Tanaka's cooking like?" },
            { speaker: 'You', expectedAnswer: 'とてもおいしいです。だいすきです', acceptedAnswers: ['おいしいです', 'とてもおいしくてだいすきです', 'とてもおいしいです。'], isLearnerTurn: true, translation: "It's very delicious. I love it." },
            { speaker: 'Mrs. Tanaka', line: 'ありがとう！うれしいわ。', isLearnerTurn: false, translation: "Thank you! That makes me happy." },
          ]}],
          questions: [
            { id: 'q14-4-1', type: 'translation-en-jp', prompt: '"This movie is interesting."', correctAnswer: 'このえいがはおもしろいです', acceptedAnswers: ['このえいがはおもしろいです。'] },
            { id: 'q14-4-2', type: 'translation-en-jp', prompt: '"It\'s not expensive."', correctAnswer: 'たかくないです', acceptedAnswers: ['たかくないです。'] },
            { id: 'q14-4-3', type: 'fill-in-blank', prompt: '「しずか___へやがすきです。」', correctAnswer: 'な' },
            { id: 'q14-4-4', type: 'multiple-choice', prompt: '"It\'s not good." (irregular):', options: ['よくないです', 'いくないです', 'いいくないです', 'よないです'], correctAnswer: 'よくないです' },
            { id: 'q14-4-5', type: 'translation-en-jp', prompt: '"I like Japanese."', correctAnswer: 'にほんごがすきです', acceptedAnswers: ['にほんごがすきです。'] },
          ],
          successMessage: 'Adjective review: every form covered.',
          emotionalFeedback: {
            perfect: '「形容詞コンプリート！」',
            good: 'Both adjective types handled.',
            struggle: 'Two types, same position rules. Keep the patterns clear.',
          }
        },
      ]
    },
    {
      id: 'L14-U2',
      title: 'Review: Advanced Patterns',
      summary: 'Levels 10–13: past tense, te-form, requests, and reasons.',
      steps: [
        {
          id: 'L14-U2-M1',
          title: 'Past Tense Stories (L10)',
          kind: 'review',
          estimatedMinutes: 2,
          scenario: "Sharing memories from the year with Mrs. Tanaka, Yuki, and Kenta.",
          goal: 'Review ました, ませんでした, past adjectives, and experience patterns.',
          vocabulary: [],
          grammar: [{
            id: 'g14-past-review',
            pattern: 'ました / ませんでした / かった / koto ga arimasu',
            explanation: 'Past tense: verb past, negative past, adjective past, and the experience pattern.',
            structure: '[verb]ました / [verb]ませんでした / [adj-stem]かったです / [verb-た]+ことがあります',
            examples: ['えいがをみました。', 'べんきょうしませんでした。', 'たのしかったです。', 'すしをたべたことがあります。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex14-5-1', japanese: 'きのうえいがをみました。', romaji: 'Kinou eiga o mimashita.', english: 'I watched a movie yesterday.', vocabIds: [], grammarIds: ['g14-past-review'] },
            { id: 'ex14-5-2', japanese: 'たのしかったです。', romaji: 'Tanoshikatta desu.', english: 'It was fun.', vocabIds: [], grammarIds: ['g14-past-review'] },
            { id: 'ex14-5-3', japanese: 'すしをたべたことがあります。', romaji: 'Sushi o tabeta koto ga arimasu.', english: 'I have eaten sushi before.', vocabIds: [], grammarIds: ['g14-past-review'] },
          ],
          branchingChoice: {
            prompt: "Kenta asks how this year was. It was amazing:",
            options: [
              { id: 'a', label: 'すごかったです', outcome: 'correct', reaction: '「よかった！」 Everyone agrees.' },
              { id: 'b', label: 'すごいでした', outcome: 'wrong', reaction: 'い-adj past: い → かった. すごかったです.' },
              { id: 'c', label: 'すごかったでした', outcome: 'wrong', reaction: 'Just すごかったです — no extra でした.' },
            ]
          },
          dialogueChains: [{ id: 'dl14-2-1', turns: [
            { speaker: 'Mrs. Tanaka', line: 'ことしはどうでしたか？', isLearnerTurn: false, translation: 'How was this year?' },
            { speaker: 'You', expectedAnswer: 'たのしくて、すごかったです。いろいろたべたことがあります', acceptedAnswers: ['たのしかったです', 'すごかったです', 'たのしくてすごかったです'], isLearnerTurn: true, translation: 'It was fun and amazing. I experienced many things.' },
            { speaker: 'Mrs. Tanaka', line: 'わたしもうれしかったです。', isLearnerTurn: false, translation: 'I was happy too.' },
          ]}],
          questions: [
            { id: 'q14-5-1', type: 'translation-en-jp', prompt: '"I watched a movie yesterday."', correctAnswer: 'きのうえいがをみました', acceptedAnswers: ['きのうえいがをみました。'] },
            { id: 'q14-5-2', type: 'translation-en-jp', prompt: '"I didn\'t study."', correctAnswer: 'べんきょうしませんでした', acceptedAnswers: ['べんきょうしませんでした。'] },
            { id: 'q14-5-3', type: 'fill-in-blank', prompt: '「たのし___です。」(was fun)', correctAnswer: 'かった' },
            { id: 'q14-5-4', type: 'translation-en-jp', prompt: '"I have eaten sushi before."', correctAnswer: 'すしをたべたことがあります', acceptedAnswers: ['すしをたべたことがあります。'] },
            { id: 'q14-5-5', type: 'multiple-choice', prompt: '"It was quiet." — な-adj past:', options: ['しずかでした', 'しずかかったです', 'しずかいでした', 'しずかだったです'], correctAnswer: 'しずかでした' },
          ],
          successMessage: 'Past tense review: all forms recalled.',
          emotionalFeedback: {
            perfect: '「一年分の記憶が言葉になった！」',
            good: 'Past tense fully reviewed.',
            struggle: 'Past is the key to telling any story. Keep at it.',
          }
        },
        {
          id: 'L14-U2-M2',
          title: 'Te-form & Requests (L11–L12)',
          kind: 'review',
          estimatedMinutes: 2,
          scenario: "Helping Kenta set up his room. Instructions, chains, and ongoing actions.",
          goal: 'Review te-form chaining, ています, てください, and ないでください.',
          vocabulary: [],
          grammar: [{
            id: 'g14-te-review',
            pattern: 'Te-form: chain / ています / てください / ないでください',
            explanation: 'All four te-form uses in context.',
            structure: '[te] / [te]+います / [te]+ください / [negative stem]+ないでください',
            examples: ['たべて、いきます。', 'べんきょうしています。', 'きいてください。', 'さわらないでください。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex14-6-1', japanese: 'たべて、がっこうにいきます。', romaji: 'Tabete, gakkou ni ikimasu.', english: 'I eat and go to school.', vocabIds: [], grammarIds: ['g14-te-review'] },
            { id: 'ex14-6-2', japanese: 'にほんごをべんきょうしています。', romaji: 'Nihongo o benkyou shite imasu.', english: 'I am studying Japanese.', vocabIds: [], grammarIds: ['g14-te-review'] },
            { id: 'ex14-6-3', japanese: 'さわらないでください。', romaji: 'Sawaranaide kudasai.', english: 'Please do not touch.', vocabIds: [], grammarIds: ['g14-te-review'] },
          ],
          branchingChoice: {
            prompt: "Kenta is about to touch Mrs. Tanaka's valuable pottery. You say:",
            options: [
              { id: 'a', label: 'さわらないでください', outcome: 'correct', reaction: '「あぶなかった！」 Mrs. Tanaka sighs with relief.' },
              { id: 'b', label: 'さわってください', outcome: 'wrong', reaction: 'That invites him to touch it. Use ないでください.' },
              { id: 'c', label: 'さわらないください', outcome: 'wrong', reaction: 'ないでください: さわらない + でください.' },
            ]
          },
          dialogueChains: [{ id: 'dl14-2-2', turns: [
            { speaker: 'Kenta', line: 'いまなにをしていますか？', isLearnerTurn: false, translation: 'What are you doing now?' },
            { speaker: 'You', expectedAnswer: 'にほんごをべんきょうしています', acceptedAnswers: ['にほんごをべんきょうしています。', 'えをかいています'], isLearnerTurn: true, translation: 'I am studying Japanese.' },
            { speaker: 'Kenta', line: 'すごいですね！わたしもやります！', isLearnerTurn: false, translation: 'Amazing! I will do it too!' },
          ]}],
          questions: [
            { id: 'q14-6-1', type: 'translation-en-jp', prompt: '"I am studying Japanese."', correctAnswer: 'にほんごをべんきょうしています', acceptedAnswers: ['にほんごをべんきょうしています。'] },
            { id: 'q14-6-2', type: 'translation-en-jp', prompt: '"Please speak slowly."', correctAnswer: 'ゆっくりはなしてください', acceptedAnswers: ['ゆっくりはなしてください。'] },
            { id: 'q14-6-3', type: 'fill-in-blank', prompt: '「はしら___でください。」(please don\'t run)', correctAnswer: 'ない' },
            { id: 'q14-6-4', type: 'translation-en-jp', prompt: '"I wake up, eat, and go to school."', correctAnswer: 'おきて、たべて、がっこうにいきます', acceptedAnswers: ['おきてたべてがっこうにいきます'] },
            { id: 'q14-6-5', type: 'multiple-choice', prompt: 'Te-form of よみます:', options: ['よんで', 'よみて', 'よいて', 'よって'], correctAnswer: 'よんで' },
          ],
          successMessage: 'Te-form review: all four uses strong.',
          emotionalFeedback: {
            perfect: '「て形の全用法マスター！」',
            good: 'All te-form uses recalled.',
            struggle: 'Chain / ongoing / request positive / request negative. All from one form.',
          }
        },
        {
          id: 'L14-U2-M3',
          title: 'Reasons & Connections (L13)',
          kind: 'review',
          estimatedMinutes: 2,
          scenario: "Year-end reflection. Everyone gives reasons for their choices.",
          goal: 'Review から, ので, and どうして Q&A patterns.',
          vocabulary: [],
          grammar: [{
            id: 'g14-reason-review',
            pattern: 'から / ので / どうして～からです',
            explanation: 'から = casual/direct reason. ので = polite/explanatory. どうして + reason + からです = full Q&A.',
            structure: '[reason] + から/ので + [result]',
            examples: ['にほんごがすきだから、べんきょうします。', 'びょうきなので、かえります。', 'どうして？　たかいからです。'],
            source: 'genki2', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex14-7-1', japanese: 'にほんごがすきだから、べんきょうしています。', romaji: 'Nihongo ga suki da kara, benkyou shite imasu.', english: 'Because I like Japanese, I am studying it.', vocabIds: [], grammarIds: ['g14-reason-review'] },
            { id: 'ex14-7-2', japanese: 'びょうきなので、はやくかえります。', romaji: 'Byouki na node, hayaku kaerimasu.', english: "Because I'm sick, I'll go home early.", vocabIds: [], grammarIds: ['g14-reason-review'] },
          ],
          branchingChoice: {
            prompt: "Mrs. Tanaka: 「どうしてにほんにきましたか？」 You answer 'Because I like Japanese':",
            options: [
              { id: 'a', label: 'にほんごがすきだからです', outcome: 'correct', reaction: '「それはうれしいです！」 Mrs. Tanaka smiles warmly.' },
              { id: 'b', label: 'にほんごがすきからです', outcome: 'wrong', reaction: 'すき is a な-adj. Need だ before から: すきだから.' },
              { id: 'c', label: 'にほんごがすきだので', outcome: 'partial', reaction: 'ので also works — but からです is the standard answer form.' },
            ]
          },
          dialogueChains: [{ id: 'dl14-2-3', turns: [
            { speaker: 'Kenta', line: 'どうしてにほんごをべんきょうしているんですか？', isLearnerTurn: false, translation: 'Why are you studying Japanese?' },
            { speaker: 'You', expectedAnswer: 'にほんごがすきだから、べんきょうしています', acceptedAnswers: ['すきだからです', 'にほんがすきだから'], isLearnerTurn: true, translation: 'Because I like Japanese, I am studying it.' },
            { speaker: 'Kenta', line: 'わかります！わたしも！', isLearnerTurn: false, translation: 'I understand! Me too!' },
          ]}],
          questions: [
            { id: 'q14-7-1', type: 'translation-en-jp', prompt: '"Because it\'s expensive, I won\'t buy it."', correctAnswer: 'たかいから、かいません', acceptedAnswers: ['たかいからかいません'] },
            { id: 'q14-7-2', type: 'translation-en-jp', prompt: '"Because I have class, excuse me." (polite)', correctAnswer: 'じゅぎょうがあるので、しつれいします', acceptedAnswers: ['じゅぎょうがあるのでしつれいします'] },
            { id: 'q14-7-3', type: 'fill-in-blank', prompt: '「いそがしい___、いけません。」', correctAnswer: 'から' },
            { id: 'q14-7-4', type: 'multiple-choice', prompt: '"Because I was sick." — answer form:', options: ['びょうきだったからです', 'びょうきですから', 'びょうきなので', 'びょうきだからです'], correctAnswer: 'びょうきだったからです' },
            { id: 'q14-7-5', type: 'multiple-choice', prompt: 'Polite reason connector for teacher:', options: ['ので', 'から', 'だから', 'なので'], correctAnswer: 'ので' },
          ],
          successMessage: 'Reasons: every form reviewed. The why is always with you now.',
          emotionalFeedback: {
            perfect: '「理由も感情も全部言える！」',
            good: 'Reason patterns recalled.',
            struggle: 'から casual. ので polite. Two forms, one job.',
          }
        },
        {
          id: 'L14-U2-M4',
          title: 'N5 Final Checkpoint',
          kind: 'checkpoint',
          estimatedMinutes: 2,
          isCheckpoint: true,
          minPassScore: 80,
          scenario: "One year after arriving at the Tanaka house. The full N5 curriculum tested in one final session. Prove you are ready.",
          goal: 'Demonstrate mastery of the complete N5 curriculum.',
          vocabulary: [],
          grammar: [],
          examples: [],
          branchingChoice: {
            prompt: "Mrs. Tanaka asks why you came to Japan. Answer politely:",
            options: [
              { id: 'a', label: 'にほんごがすきなので、にほんにきました', outcome: 'correct', reaction: '「本当にうれしいです！」 Mrs. Tanaka\'s eyes fill with warmth.' },
              { id: 'b', label: 'にほんごがすきから、にほんにきました', outcome: 'partial', reaction: 'ので is more appropriate in this formal emotional context.' },
              { id: 'c', label: 'にほんごがすきなので、にほんがきました', outcome: 'wrong', reaction: 'Motion verb takes に: にほんに きました.' },
            ]
          },
          dialogueChains: [{ id: 'dl14-2-4', turns: [
            { speaker: 'Mrs. Tanaka', line: 'もう一年です。本当に上手になりましたね。最後のテストです！', isLearnerTurn: false, translation: 'It has been a year already. You have truly improved. Final test!' },
            { speaker: 'You', expectedAnswer: 'ありがとうございます。いちねんかんおせわになりました', acceptedAnswers: ['ありがとうございます', 'よろしくおねがいします', 'いちねんかん、ありがとうございました'], isLearnerTurn: true, translation: 'Thank you. You have looked after me for a year.' },
            { speaker: 'Mrs. Tanaka', line: 'こちらこそ！またいつでもきてください。', isLearnerTurn: false, translation: 'It is I who should thank you! Please come back anytime.' },
          ]}],
          questions: [
            { id: 'q14-cp-1', type: 'translation-en-jp', prompt: '"Nice to meet you."', correctAnswer: 'はじめまして', acceptedAnswers: ['はじめまして。'] },
            { id: 'q14-cp-2', type: 'multiple-choice', prompt: '"The cat is under the chair." — correct:', options: ['いすのしたにねこがいます', 'いすのうえにねこがあります', 'いすのしたにねこがあります', 'ねこのいすのしたがいます'], correctAnswer: 'いすのしたにねこがいます' },
            { id: 'q14-cp-3', type: 'fill-in-blank', prompt: '「くじ___さんじまでべんきょうします。」', correctAnswer: 'から' },
            { id: 'q14-cp-4', type: 'translation-en-jp', prompt: '"I watched a movie yesterday."', correctAnswer: 'きのうえいがをみました', acceptedAnswers: ['きのうえいがをみました。'] },
            { id: 'q14-cp-5', type: 'translation-en-jp', prompt: '"I am studying Japanese."', correctAnswer: 'にほんごをべんきょうしています', acceptedAnswers: ['にほんごをべんきょうしています。'] },
            { id: 'q14-cp-6', type: 'translation-en-jp', prompt: '"Please do not run."', correctAnswer: 'はしらないでください', acceptedAnswers: ['はしらないでください。'] },
            { id: 'q14-cp-7', type: 'fill-in-blank', prompt: '「にほんごがすきだ___、べんきょうします。」', correctAnswer: 'から' },
            { id: 'q14-cp-8', type: 'translation-jp-en', prompt: '「たのしかったです」', correctAnswer: 'It was fun', acceptedAnswers: ['It was enjoyable.'] },
          ],
          successMessage: 'N5 Final Checkpoint complete. You are ready.',
          emotionalFeedback: {
            perfect: '「N5合格！おめでとうございます！」 The whole Tanaka household cheers.',
            good: 'N5 curriculum mastered. Well done.',
            struggle: 'You completed the full course. That is the achievement.',
          }
        },
      ]
    }
  ],
  challengeMission: {
    id: 'JL14-challenge',
    title: 'N5 Grand Finale Challenge',
    kind: 'checkpoint',
    estimatedMinutes: 2,
    scenario: "One year in Japan — one final comprehensive challenge. Mrs. Tanaka, Yuki, and Kenta are all watching. Prove you have mastered N5 Japanese.",
    vocabulary: [],
    grammar: [],
    examples: [],
    questions: [
      { id: 'q14-ch-1', type: 'translation-en-jp', prompt: '"Nice to meet you. I\'m [name]. Please treat me well."', correctAnswer: 'はじめまして。よろしくおねがいします', acceptedAnswers: ['はじめまして。よろしくおねがいします。'] },
      { id: 'q14-ch-2', type: 'multiple-choice', prompt: '"That bread, please." (near listener):', options: ['そのパンをください', 'このパンをください', 'あのパンをください', 'どのパンをください'], correctAnswer: 'そのパンをください' },
      { id: 'q14-ch-3', type: 'translation-en-jp', prompt: '"Whose bag is this?"', correctAnswer: 'これはだれのかばんですか', acceptedAnswers: ['これはだれのかばんですか？'] },
      { id: 'q14-ch-4', type: 'multiple-choice', prompt: '"The cat is under the chair." — correct:', options: ['いすのしたにねこがいます', 'いすのうえにねこがあります', 'いすのしたにねこがあります', 'ねこはいすがいます'], correctAnswer: 'いすのしたにねこがいます' },
      { id: 'q14-ch-5', type: 'translation-en-jp', prompt: '"I go to school at eight."', correctAnswer: 'はちじにがっこうにいきます', acceptedAnswers: ['はちじにがっこうにいきます。'] },
      { id: 'q14-ch-6', type: 'translation-en-jp', prompt: '"I do not eat meat."', correctAnswer: 'にくをたべません', acceptedAnswers: ['にくはたべません', 'にくをたべません。'] },
      { id: 'q14-ch-7', type: 'fill-in-blank', prompt: '「しずか___へやがすきです。」', correctAnswer: 'な' },
      { id: 'q14-ch-8', type: 'translation-en-jp', prompt: '"I watched a movie yesterday."', correctAnswer: 'きのうえいがをみました', acceptedAnswers: ['きのうえいがをみました。'] },
      { id: 'q14-ch-9', type: 'translation-en-jp', prompt: '"It was fun."', correctAnswer: 'たのしかったです', acceptedAnswers: ['たのしかったです。'] },
      { id: 'q14-ch-10', type: 'translation-en-jp', prompt: '"I have eaten sushi before."', correctAnswer: 'すしをたべたことがあります', acceptedAnswers: ['すしをたべたことがあります。'] },
      { id: 'q14-ch-11', type: 'translation-en-jp', prompt: '"I am studying Japanese."', correctAnswer: 'にほんごをべんきょうしています', acceptedAnswers: ['にほんごをべんきょうしています。'] },
      { id: 'q14-ch-12', type: 'translation-en-jp', prompt: '"I wake up, eat, and go to school."', correctAnswer: 'おきて、たべて、がっこうにいきます', acceptedAnswers: ['おきてたべてがっこうにいきます'] },
      { id: 'q14-ch-13', type: 'translation-en-jp', prompt: '"Please speak slowly."', correctAnswer: 'ゆっくりはなしてください', acceptedAnswers: ['ゆっくりはなしてください。'] },
      { id: 'q14-ch-14', type: 'translation-en-jp', prompt: '"Please do not run."', correctAnswer: 'はしらないでください', acceptedAnswers: ['はしらないでください。'] },
      { id: 'q14-ch-15', type: 'translation-en-jp', prompt: '"Because I like Japanese, I study it."', correctAnswer: 'にほんごがすきだから、べんきょうします', acceptedAnswers: ['にほんごがすきだからべんきょうします'] },
    ],
  }
};
