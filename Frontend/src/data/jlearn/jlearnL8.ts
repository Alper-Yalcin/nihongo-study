import { JLearnLevel } from './jlearnTypes';

export const jlearnLevel8: JLearnLevel = {
  id: 'JL8',
  title: 'Daily Routines',
  theme: 'Talk about time and describe your daily schedule.',
  location: 'Tanaka House — Morning',
  jlptAlignment: 'N5',
  genkiChapters: [3],
  checkpointUnitId: 'L8-U2',
  badge: { id: 'badge-scheduler', name: 'Scheduler', description: 'You can describe your daily schedule from wake-up to sleep.' },
  storyHook: {
    type: 'invitation-tease',
    speaker: 'Mrs. Tanaka',
    teaser: "You wake up to the smell of breakfast. Mrs. Tanaka is already in the kitchen.",
    japanese: 'もう七時ですよ！',
    translation: "It's already seven o'clock!"
  },
  units: [
    {
      id: 'L8-U1',
      title: 'Telling Time',
      summary: 'Say the time using じ (hour) and ふん/ぷん (minutes).',
      steps: [
        {
          id: 'L8-U1-M1',
          title: 'What time is it?',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: "Mrs. Tanaka calls from the kitchen. You need to know the time.",
          goal: 'Read and say the time using じ for hours.',
          vocabulary: [
            { id: 'v8-ji', japanese: '〜じ', romaji: '~ji', english: 'o\'clock (hours)', partOfSpeech: 'suffix', jlptLevel: 'N5' },
            { id: 'v8-nanji', japanese: 'なんじ', romaji: 'nanji', english: 'what time', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v8-ima', japanese: 'いま', romaji: 'ima', english: 'now', partOfSpeech: 'adverb', jlptLevel: 'N5' },
            { id: 'v8-shichiji', japanese: 'しちじ', romaji: 'shichi-ji', english: 'seven o\'clock', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g8-time-ji',
            pattern: 'いまなんじですか → ～じです',
            explanation: 'Ask the time with いまなんじですか. Answer with number + じ. Note: 4 = よじ, 7 = しちじ, 9 = くじ.',
            structure: 'いま [number] じ です',
            examples: ['いまなんじですか。', 'しちじです。', 'くじはんです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex8-1-1', japanese: 'いまなんじですか。', romaji: 'Ima nanji desu ka.', english: 'What time is it now?', vocabIds: ['v8-ima', 'v8-nanji'], grammarIds: ['g8-time-ji'] },
            { id: 'ex8-1-2', japanese: 'しちじです。', romaji: 'Shichi-ji desu.', english: "It's seven o'clock.", vocabIds: ['v8-shichiji', 'v8-ji'], grammarIds: ['g8-time-ji'] },
            { id: 'ex8-1-3', japanese: 'くじはんです。', romaji: 'Ku-ji han desu.', english: "It's nine thirty.", vocabIds: ['v8-ji'], grammarIds: ['g8-time-ji'] },
          ],
          branchingChoice: {
            prompt: "Mrs. Tanaka asks what time it is. The clock shows 8:00:",
            options: [
              { id: 'a', label: 'はちじです', outcome: 'correct', reaction: '「そうですね！はやくたべてください！」' },
              { id: 'b', label: 'はちぷんです', outcome: 'wrong', reaction: 'じ = hour, ふん/ぷん = minute. はちじ for 8 o\'clock.' },
              { id: 'c', label: 'はちです', outcome: 'partial', reaction: 'Understood, but adding じ makes it unambiguous: はちじ.' },
            ]
          },
          dialogueChains: [{ id: 'dl8-1-1', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'いまなんじですか？', 2: '今、何時？' }, isLearnerTurn: false, translation: 'What time is it now?' },
            { speaker: 'You', expectedAnswer: 'しちじです', acceptedAnswers: ['しちじです。', 'しちじはんです'], isLearnerTurn: true, translation: "It's seven o'clock." },
            { speaker: 'Mrs. Tanaka', line: { 0: 'あさごはんができましたよ！', 2: '朝ごはんできたよ！' }, isLearnerTurn: false, translation: 'Breakfast is ready!' },
          ]}],
          questions: [
            { id: 'q8-1-1', type: 'multiple-choice', prompt: '"What time is it?" — correct:', options: ['いまなんじですか', 'いまなんぷんですか', 'いまなんですか', 'いまじですか'], correctAnswer: 'いまなんじですか' },
            { id: 'q8-1-2', type: 'translation-en-jp', prompt: '"It\'s seven o\'clock."', correctAnswer: 'しちじです', acceptedAnswers: ['しちじです。'] },
            { id: 'q8-1-3', type: 'fill-in-blank', prompt: '「いまく___です。」(9 o\'clock)', correctAnswer: 'じ' },
          ],
          successMessage: "You read the clock. Time vocab: check.",
          emotionalFeedback: {
            perfect: '「時計が読めるね！」',
            good: 'Time expressed correctly.',
            struggle: 'じ for hours. Irregular ones: よじ, しちじ, くじ. Learn those.',
          }
        },
        {
          id: 'L8-U1-M2',
          title: 'Minutes and half past',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "You need to be somewhere at a specific time. Minutes matter now.",
          goal: 'Express minutes using ふん/ぷん and はん (half past).',
          vocabulary: [
            { id: 'v8-fun', japanese: '〜ふん・ぷん', romaji: '~fun / ~pun', english: 'minutes', partOfSpeech: 'suffix', jlptLevel: 'N5' },
            { id: 'v8-han', japanese: 'はん', romaji: 'han', english: 'half past', partOfSpeech: 'suffix', jlptLevel: 'N5' },
            { id: 'v8-nanpun', japanese: 'なんぷん', romaji: 'nanpun', english: 'how many minutes', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g8-time-fun',
            pattern: '～じ ～ふん / ～じはん',
            explanation: 'Minutes: most use ふん, but 1, 3, 4, 6, 8, 10 use ぷん. はん = :30.',
            structure: '[hour] じ [minute] ふん/ぷん または [hour] じはん',
            examples: ['しちじじゅうごふんです。', 'はちじはんです。', 'くじさんじゅっぷんです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex8-2-1', japanese: 'しちじじゅうごふんです。', romaji: 'Shichi-ji juu-go-fun desu.', english: "It's 7:15.", vocabIds: ['v8-shichiji', 'v8-fun'], grammarIds: ['g8-time-fun'] },
            { id: 'ex8-2-2', japanese: 'はちじはんです。', romaji: 'Hachi-ji han desu.', english: "It's 8:30.", vocabIds: ['v8-han', 'v8-ji'], grammarIds: ['g8-time-fun'] },
            { id: 'ex8-2-3', japanese: 'くじさんじゅっぷんです。', romaji: 'Ku-ji sanjuppun desu.', english: "It's 9:30.", vocabIds: ['v8-fun', 'v8-ji'], grammarIds: ['g8-time-fun'] },
          ],
          branchingChoice: {
            prompt: "The bus is at 8:30. You tell Mrs. Tanaka:",
            options: [
              { id: 'a', label: 'はちじはんにバスがあります', outcome: 'correct', reaction: '「わかりました！はやく！」' },
              { id: 'b', label: 'はちじさんじゅうがあります', outcome: 'partial', reaction: 'Correct time — but はん is more natural for :30.' },
              { id: 'c', label: 'はちさんじゅっぷんです', outcome: 'wrong', reaction: 'Hour first then じ: はちじ さんじゅっぷん.' },
            ]
          },
          dialogueChains: [{ id: 'dl8-1-2', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'バスはなんじですか？', 2: 'バス、何時？' }, isLearnerTurn: false, translation: 'What time is the bus?' },
            { speaker: 'You', expectedAnswer: 'はちじはんです', acceptedAnswers: ['はちじはんです。', 'はちじさんじゅっぷんです'], isLearnerTurn: true, translation: "It's 8:30." },
            { speaker: 'Mrs. Tanaka', line: { 0: 'じゃ、いそいでください！', 2: 'じゃ、急いで！' }, isLearnerTurn: false, translation: 'Then hurry up!' },
          ]}],
          questions: [
            { id: 'q8-2-1', type: 'translation-en-jp', prompt: '"It\'s 7:15."', correctAnswer: 'しちじじゅうごふんです', acceptedAnswers: ['しちじじゅうごふんです。'] },
            { id: 'q8-2-2', type: 'fill-in-blank', prompt: '「はちじ___です。」(half past)', correctAnswer: 'はん' },
            { id: 'q8-2-3', type: 'multiple-choice', prompt: '"It\'s 9:30." — most natural:', options: ['くじはんです', 'くじさんです', 'くじじゅうです', 'くじごじゅっぷんです'], correctAnswer: 'くじはんです' },
          ],
          successMessage: 'Minutes and half past: handled.',
          emotionalFeedback: {
            perfect: '「時間に正確！」',
            good: 'Right on time.',
            struggle: 'はん = :30. じゅうごふん = :15. Build from there.',
          }
        },
        {
          id: 'L8-U1-M3',
          title: 'Time + に',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "School starts at a specific time. Plans depend on it.",
          goal: 'Use に after a time expression to say when something happens.',
          vocabulary: [
            { id: 'v8-hajimaru', japanese: 'はじまります', romaji: 'hajimarimasu', english: 'begins / starts', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v8-owaru', japanese: 'おわります', romaji: 'owarimasu', english: 'ends / finishes', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v8-jyugyo', japanese: 'じゅぎょう', romaji: 'jugyou', english: 'class / lesson', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g8-time-ni',
            pattern: '[time] に [verb]',
            explanation: 'に after a time marks when something happens: 「しちじにおきます」= I wake up at seven.',
            structure: '[time] に [verb]-ます',
            examples: ['はちじにがっこうがはじまります。', 'さんじにじゅぎょうがおわります。', 'ろくじにうちにかえります。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex8-3-1', japanese: 'はちじにがっこうがはじまります。', romaji: 'Hachi-ji ni gakkou ga hajimarimasu.', english: 'School starts at eight.', vocabIds: ['v8-hajimaru', 'v8-ji'], grammarIds: ['g8-time-ni'] },
            { id: 'ex8-3-2', japanese: 'さんじにじゅぎょうがおわります。', romaji: 'San-ji ni jugyou ga owarimasu.', english: 'Class ends at three.', vocabIds: ['v8-owaru', 'v8-jyugyo'], grammarIds: ['g8-time-ni'] },
            { id: 'ex8-3-3', japanese: 'ろくじにうちにかえります。', romaji: 'Roku-ji ni uchi ni kaerimasu.', english: 'I return home at six.', vocabIds: ['v8-ji'], grammarIds: ['g8-time-ni'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks what time school starts. It starts at 8:30:",
            options: [
              { id: 'a', label: 'はちじはんにはじまります', outcome: 'correct', reaction: '「じゃあ、いそごう！」 Yuki grabs her bag.' },
              { id: 'b', label: 'はちじはんではじまります', outcome: 'wrong', reaction: 'Time gets に, not で. で is for means or location of action.' },
              { id: 'c', label: 'はちじはんのはじまります', outcome: 'wrong', reaction: 'Use に for time: はちじはんに はじまります.' },
            ]
          },
          dialogueChains: [{ id: 'dl8-1-3', turns: [
            { speaker: 'Yuki', line: { 0: 'じゅぎょうはなんじにおわりますか？', 2: '授業、何時に終わる？' }, isLearnerTurn: false, translation: 'What time does class end?' },
            { speaker: 'You', expectedAnswer: 'さんじにおわります', acceptedAnswers: ['さんじにおわります。', 'さんじはんにおわります'], isLearnerTurn: true, translation: 'It ends at three.' },
            { speaker: 'Yuki', line: { 0: 'じゃあ、さんじにあいましょう！', 2: 'じゃ、三時に会おう！' }, isLearnerTurn: false, translation: "Then let's meet at three!" },
          ]}],
          questions: [
            { id: 'q8-3-1', type: 'translation-en-jp', prompt: '"School starts at eight."', correctAnswer: 'はちじにがっこうがはじまります', acceptedAnswers: ['はちじにがっこうはじまります'] },
            { id: 'q8-3-2', type: 'fill-in-blank', prompt: '「さんじ___じゅぎょうがおわります。」', correctAnswer: 'に' },
            { id: 'q8-3-3', type: 'multiple-choice', prompt: '"I return home at six." — correct:', options: ['ろくじにうちにかえります', 'ろくじうちにかえります', 'ろくじでうちにかえります', 'うちにろくじかえります'], correctAnswer: 'ろくじにうちにかえります' },
          ],
          successMessage: 'Time + に: the most useful scheduling pattern in Japanese.',
          emotionalFeedback: {
            perfect: '「スケジュール管理できるね！」',
            good: 'Every appointment set precisely.',
            struggle: 'Time + に + verb. That triple is everything.',
          }
        },
        {
          id: 'L8-U1-M4',
          title: 'Time expressions review',
          kind: 'review',
          estimatedMinutes: 1,
          scenario: "Run through morning schedule with Mrs. Tanaka.",
          goal: 'Combine じ, ふん, はん, and に in full sentences.',
          vocabulary: [
            { id: 'v8-asagohan', japanese: 'あさごはん', romaji: 'asagohan', english: 'breakfast', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v8-okimasu', japanese: 'おきます', romaji: 'okimasu', english: 'wake up (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g8-schedule',
            pattern: '[time]に[routine verb]',
            explanation: 'Chain time expressions with に to describe a full daily schedule.',
            structure: '[time] に [action verb]-ます',
            examples: ['しちじにおきます。', 'しちじはんにあさごはんをたべます。', 'はちじにがっこうにいきます。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex8-4-1', japanese: 'しちじにおきます。', romaji: 'Shichi-ji ni okimasu.', english: 'I wake up at seven.', vocabIds: ['v8-okimasu', 'v8-shichiji'], grammarIds: ['g8-schedule'] },
            { id: 'ex8-4-2', japanese: 'しちじはんにあさごはんをたべます。', romaji: 'Shichi-ji han ni asagohan o tabemasu.', english: 'I eat breakfast at 7:30.', vocabIds: ['v8-asagohan', 'v8-han'], grammarIds: ['g8-schedule'] },
            { id: 'ex8-4-3', japanese: 'はちじにがっこうにいきます。', romaji: 'Hachi-ji ni gakkou ni ikimasu.', english: 'I go to school at eight.', vocabIds: ['v8-ji'], grammarIds: ['g8-schedule'] },
          ],
          branchingChoice: {
            prompt: "Mrs. Tanaka asks when you wake up. You wake at 7:00:",
            options: [
              { id: 'a', label: 'しちじにおきます', outcome: 'correct', reaction: '「えらい！はやいですね。」' },
              { id: 'b', label: 'しちじはおきます', outcome: 'wrong', reaction: 'Time gets に, not は.' },
              { id: 'c', label: 'しちにおきます', outcome: 'wrong', reaction: 'Missing じ: しちじ = seven o\'clock.' },
            ]
          },
          dialogueChains: [{ id: 'dl8-1-4', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'まいにちなんじにおきますか？', 2: '毎日何時に起きる？' }, isLearnerTurn: false, translation: 'What time do you wake up every day?' },
            { speaker: 'You', expectedAnswer: 'しちじにおきます', acceptedAnswers: ['しちじにおきます。', 'はちじにおきます', 'ろくじにおきます'], isLearnerTurn: true, translation: 'I wake up at seven.' },
            { speaker: 'Mrs. Tanaka', line: { 0: 'そうですか！わたしはもっとはやいですよ。', 2: 'そっか！私はもっと早いよ。' }, isLearnerTurn: false, translation: 'Is that so! I wake up earlier.' },
          ]}],
          questions: [
            { id: 'q8-4-1', type: 'translation-en-jp', prompt: '"I wake up at seven."', correctAnswer: 'しちじにおきます', acceptedAnswers: ['しちじにおきます。'] },
            { id: 'q8-4-2', type: 'sentence-build', prompt: 'Build: "I eat breakfast at 7:30."', correctAnswer: 'しちじはんにあさごはんをたべます' },
            { id: 'q8-4-3', type: 'multiple-choice', prompt: '"I go to school at eight." — correct:', options: ['はちじにがっこうにいきます', 'はちじがっこうにいきます', 'がっこうはちじにいきます', 'はちじでがっこうにいきます'], correctAnswer: 'はちじにがっこうにいきます' },
          ],
          successMessage: 'Morning routine complete. Time + action = schedule.',
          emotionalFeedback: {
            perfect: '「完璧なスケジュール！」',
            good: 'Routine expressed clearly.',
            struggle: 'しちじに おきます. Two に in a row is fine in Japanese.',
          }
        },
      ]
    },
    {
      id: 'L8-U2',
      title: 'Your Full Day',
      summary: 'Describe a complete day from morning to night.',
      steps: [
        {
          id: 'L8-U2-M1',
          title: 'Morning schedule',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "You describe your morning routine to Mrs. Tanaka over breakfast.",
          goal: 'Chain morning actions using time + に.',
          vocabulary: [
            { id: 'v8-nemasu', japanese: 'ねます', romaji: 'nemasu', english: 'sleep / go to bed (polite)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v8-shower', japanese: 'シャワー', romaji: 'shawa', english: 'shower', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v8-abimasu', japanese: 'あびます', romaji: 'abimasu', english: 'take (a shower / bath)', partOfSpeech: 'verb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g8-morning',
            pattern: 'Morning chain: おきます → あびます → たべます → いきます',
            explanation: 'Describe a sequence of morning actions each anchored with a time + に.',
            structure: '[time] に [verb], [time] に [verb] ...',
            examples: ['しちじにおきます。それからシャワーをあびます。しちじはんにあさごはんをたべます。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex8-5-1', japanese: 'しちじにおきます。それからシャワーをあびます。', romaji: 'Shichi-ji ni okimasu. Sorekara shawa o abimasu.', english: 'I wake at seven. Then I take a shower.', vocabIds: ['v8-okimasu', 'v8-shower', 'v8-abimasu'], grammarIds: ['g8-morning'] },
            { id: 'ex8-5-2', japanese: 'じゅういちじにねます。', romaji: 'Juuichi-ji ni nemasu.', english: 'I go to bed at eleven.', vocabIds: ['v8-nemasu'], grammarIds: ['g8-morning'] },
          ],
          branchingChoice: {
            prompt: "Mrs. Tanaka asks: 「なんじにシャワーをあびますか？」 You shower at 7:15:",
            options: [
              { id: 'a', label: 'しちじじゅうごふんにあびます', outcome: 'correct', reaction: '「きれいですね！」 Mrs. Tanaka nods approvingly.' },
              { id: 'b', label: 'しちじじゅうごふんであびます', outcome: 'wrong', reaction: 'Time + に, not で. で marks the means or place of action.' },
              { id: 'c', label: 'しちじゅうごふんにあびます', outcome: 'wrong', reaction: 'Missing じ: しちじ じゅうごふん.' },
            ]
          },
          dialogueChains: [{ id: 'dl8-2-1', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'まいあさなんじにおきますか？', 2: '毎朝何時に起きる？' }, isLearnerTurn: false, translation: 'What time do you wake up every morning?' },
            { speaker: 'You', expectedAnswer: 'しちじにおきます。それからシャワーをあびます', acceptedAnswers: ['しちじにおきます', 'しちじにおきてシャワーをあびます'], isLearnerTurn: true, translation: 'I wake up at seven. Then I take a shower.' },
            { speaker: 'Mrs. Tanaka', line: { 0: 'そうですか！ちゃんとしてますね。', 2: 'そっか！えらい！' }, isLearnerTurn: false, translation: 'I see! You are well-organized.' },
          ]}],
          questions: [
            { id: 'q8-5-1', type: 'translation-en-jp', prompt: '"I take a shower at 7:15."', correctAnswer: 'しちじじゅうごふんにシャワーをあびます', acceptedAnswers: ['しちじじゅうごふんにシャワーをあびます。'] },
            { id: 'q8-5-2', type: 'fill-in-blank', prompt: '「じゅういちじ___ねます。」', correctAnswer: 'に' },
            { id: 'q8-5-3', type: 'multiple-choice', prompt: '"I go to bed at eleven." — correct:', options: ['じゅういちじにねます', 'じゅういちじでねます', 'じゅういちじにおきます', 'じゅういちじはねます'], correctAnswer: 'じゅういちじにねます' },
          ],
          successMessage: 'Morning routine described. Mrs. Tanaka is impressed.',
          emotionalFeedback: {
            perfect: '「朝から完璧！」',
            good: 'Schedule mapped out perfectly.',
            struggle: 'Each action gets its own time + に. Build the chain.',
          }
        },
        {
          id: 'L8-U2-M2',
          title: 'From and to',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Yuki asks when events start and end.",
          goal: 'Use から (from) and まで (until/to) with time expressions.',
          vocabulary: [
            { id: 'v8-kara', japanese: 'から', romaji: 'kara', english: 'from (time/place)', partOfSpeech: 'particle', jlptLevel: 'N5' },
            { id: 'v8-made', japanese: 'まで', romaji: 'made', english: 'until / to', partOfSpeech: 'particle', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g8-kara-made',
            pattern: '[time]から[time]まで',
            explanation: 'から = from, まで = until. Together they express a time range.',
            structure: '[start time] から [end time] まで',
            examples: ['くじからさんじまでべんきょうします。', 'はちじからごじまでしごとです。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex8-6-1', japanese: 'くじからさんじまでべんきょうします。', romaji: 'Ku-ji kara san-ji made benkyou shimasu.', english: 'I study from nine to three.', vocabIds: ['v8-kara', 'v8-made'], grammarIds: ['g8-kara-made'] },
            { id: 'ex8-6-2', japanese: 'はちじからごじまでがっこうです。', romaji: 'Hachi-ji kara go-ji made gakkou desu.', english: 'School is from eight to five.', vocabIds: ['v8-kara', 'v8-made'], grammarIds: ['g8-kara-made'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks when you study. You study from 4pm to 6pm:",
            options: [
              { id: 'a', label: 'よじからろくじまでべんきょうします', outcome: 'correct', reaction: '「まじめ！」 Yuki gives a thumbs up.' },
              { id: 'b', label: 'よじにろくじまでべんきょうします', outcome: 'wrong', reaction: 'から marks the start: よじ から. Not に.' },
              { id: 'c', label: 'よじからろくじにべんきょうします', outcome: 'wrong', reaction: 'まで marks the end: ろくじ まで. Not に.' },
            ]
          },
          dialogueChains: [{ id: 'dl8-2-2', turns: [
            { speaker: 'Yuki', line: { 0: 'じゅぎょうはなんじからなんじまでですか？', 2: '授業、何時から何時まで？' }, isLearnerTurn: false, translation: 'What time is class from and to?' },
            { speaker: 'You', expectedAnswer: 'はちじからさんじまでです', acceptedAnswers: ['はちじからさんじまでです。', 'はちじはんからさんじまでです'], isLearnerTurn: true, translation: 'It is from eight to three.' },
            { speaker: 'Yuki', line: { 0: 'なが〜い！', 2: 'なが！' }, isLearnerTurn: false, translation: 'That is loooong!' },
          ]}],
          questions: [
            { id: 'q8-6-1', type: 'translation-en-jp', prompt: '"I study from nine to three."', correctAnswer: 'くじからさんじまでべんきょうします', acceptedAnswers: ['くじからさんじまでべんきょうします。'] },
            { id: 'q8-6-2', type: 'fill-in-blank', prompt: '「はちじ___ごじまでです。」', correctAnswer: 'から' },
            { id: 'q8-6-3', type: 'multiple-choice', prompt: '"School is from eight to five." — correct:', options: ['はちじからごじまでがっこうです', 'はちじにごじまでがっこうです', 'はちじからごじにがっこうです', 'はちじまでごじからがっこうです'], correctAnswer: 'はちじからごじまでがっこうです' },
          ],
          successMessage: 'Time ranges mastered. から and まで are powerful together.',
          emotionalFeedback: {
            perfect: '「時間のプロ！」',
            good: 'Range expressed perfectly.',
            struggle: 'から = from, まで = until. Two particles, one time range.',
          }
        },
        {
          id: 'L8-U2-M3',
          title: 'Full day schedule',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Mrs. Tanaka asks about your full day. From wake-up to bedtime.",
          goal: 'Describe a full day schedule using all time expressions learned.',
          vocabulary: [
            { id: 'v8-yorugohan', japanese: 'よるごはん', romaji: 'yorugohan', english: 'dinner', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v8-ofuro', japanese: 'おふろ', romaji: 'ofuro', english: 'bath', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g8-fullday',
            pattern: 'Full day chain with time + に',
            explanation: 'Link a full day of activities with precise times using に.',
            structure: '[morning activities] ... [afternoon activities] ... [evening activities]',
            examples: ['しちじにおきます。はちじにがっこうにいきます。さんじにかえります。ろくじによるごはんをたべます。じゅうじにねます。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex8-7-1', japanese: 'ろくじによるごはんをたべます。', romaji: 'Roku-ji ni yorugohan o tabemasu.', english: 'I eat dinner at six.', vocabIds: ['v8-yorugohan', 'v8-ji'], grammarIds: ['g8-fullday'] },
            { id: 'ex8-7-2', japanese: 'くじにおふろにはいります。', romaji: 'Ku-ji ni ofuro ni hairimasu.', english: 'I take a bath at nine.', vocabIds: ['v8-ofuro', 'v8-ji'], grammarIds: ['g8-fullday'] },
          ],
          branchingChoice: {
            prompt: "Mrs. Tanaka asks what time you have dinner. You eat at 6:30:",
            options: [
              { id: 'a', label: 'ろくじはんによるごはんをたべます', outcome: 'correct', reaction: '「うちとおなじです！」 Same as the Tanaka household.' },
              { id: 'b', label: 'ろくじはんによるごはんをたべません', outcome: 'wrong', reaction: 'You said you don\'t eat dinner at 6:30. Use たべます.' },
              { id: 'c', label: 'ろくじはんでよるごはんをたべます', outcome: 'wrong', reaction: 'Time + に, not で. で marks location or means.' },
            ]
          },
          dialogueChains: [{ id: 'dl8-2-3', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'いちにちのスケジュールをおしえてください。', 2: '一日のスケジュール教えて！' }, isLearnerTurn: false, translation: 'Please tell me your daily schedule.' },
            { speaker: 'You', expectedAnswer: 'しちじにおきます。はちじにがっこうにいきます。ろくじによるごはんをたべます', acceptedAnswers: ['しちじにおきます', 'ろくじによるごはんをたべます', 'はちじにがっこうにいきます'], isLearnerTurn: true, translation: 'I wake at 7, go to school at 8, eat dinner at 6.' },
            { speaker: 'Mrs. Tanaka', line: { 0: 'いいですね！きちんとしてますね。', 2: 'いいね！ちゃんとしてる！' }, isLearnerTurn: false, translation: 'Very nice! You are well-organized.' },
          ]}],
          questions: [
            { id: 'q8-7-1', type: 'translation-en-jp', prompt: '"I eat dinner at six."', correctAnswer: 'ろくじによるごはんをたべます', acceptedAnswers: ['ろくじによるごはんをたべます。'] },
            { id: 'q8-7-2', type: 'fill-in-blank', prompt: '「じゅうじ___ねます。」', correctAnswer: 'に' },
            { id: 'q8-7-3', type: 'sentence-build', prompt: 'Build: "I go to school at eight."', correctAnswer: 'はちじにがっこうにいきます' },
          ],
          successMessage: 'Full day described. You have the schedule of a local.',
          emotionalFeedback: {
            perfect: '「一日ちゃんと話せる！」',
            good: 'Full schedule delivered perfectly.',
            struggle: 'Keep chaining. Every action has a time.',
          }
        },
        {
          id: 'L8-U2-M4',
          title: 'Level 8 Checkpoint',
          kind: 'checkpoint',
          estimatedMinutes: 2,
          isCheckpoint: true,
          minPassScore: 80,
          scenario: "Final test: time expressions, から・まで, time + に, and daily routine verbs.",
          goal: 'Demonstrate full command of Level 8 time and routines.',
          vocabulary: [],
          grammar: [],
          examples: [],
          branchingChoice: {
            prompt: "Mrs. Tanaka asks when you go to bed. You go at 11pm:",
            options: [
              { id: 'a', label: 'じゅういちじにねます', outcome: 'correct', reaction: '「おそいですね！」 She looks concerned.' },
              { id: 'b', label: 'じゅういちじでねます', outcome: 'wrong', reaction: 'Time + に, not で.' },
              { id: 'c', label: 'じゅういちじはねます', outcome: 'wrong', reaction: 'Use に for time, not は.' },
            ]
          },
          dialogueChains: [{ id: 'dl8-2-4', turns: [
            { speaker: 'Mrs. Tanaka', line: 'さあ、じかんのテストです！', isLearnerTurn: false, translation: "Now — time test!" },
            { speaker: 'You', expectedAnswer: 'しちじからさんじまでべんきょうします', acceptedAnswers: ['くじからさんじまでべんきょうします', 'しちじからさんじまでべんきょうします。'], isLearnerTurn: true, translation: 'I study from seven to three.' },
            { speaker: 'Mrs. Tanaka', line: '合格！よくできました！', isLearnerTurn: false, translation: 'Pass! Well done!' },
          ]}],
          questions: [
            { id: 'q8-cp-1', type: 'translation-en-jp', prompt: '"What time is it now?"', correctAnswer: 'いまなんじですか', acceptedAnswers: ['いまなんじですか？'] },
            { id: 'q8-cp-2', type: 'translation-en-jp', prompt: '"It\'s 7:30."', correctAnswer: 'しちじはんです', acceptedAnswers: ['しちじはんです。'] },
            { id: 'q8-cp-3', type: 'fill-in-blank', prompt: '「はちじ___がっこうにいきます。」', correctAnswer: 'に' },
            { id: 'q8-cp-4', type: 'sentence-build', prompt: 'Build: "I study from nine to three."', correctAnswer: 'くじからさんじまでべんきょうします' },
            { id: 'q8-cp-5', type: 'translation-jp-en', prompt: '「じゅういちじにねます」', correctAnswer: 'I go to bed at eleven', acceptedAnswers: ['I sleep at eleven.'] },
            { id: 'q8-cp-6', type: 'multiple-choice', prompt: '"School is from eight to five." — correct:', options: ['はちじからごじまでがっこうです', 'はちじにごじまでがっこうです', 'はちじからごじにがっこうです', 'ごじからはちじまでがっこうです'], correctAnswer: 'はちじからごじまでがっこうです' },
          ],
          successMessage: 'Level 8 complete. You can schedule anything in Japanese.',
          emotionalFeedback: {
            perfect: '「時間の達人！」',
            good: 'Routines and time mastered.',
            struggle: 'You cleared it. Time in Japanese is yours now.',
          }
        },
      ]
    }
  ],
  challengeMission: {
    id: 'JL8-challenge',
    title: 'Morning Rush Challenge',
    kind: 'checkpoint',
    estimatedMinutes: 2,
    scenario: "The whole Tanaka family is rushing this morning. Coordinate schedules using every time expression you know.",
    vocabulary: [],
    grammar: [],
    examples: [],
    questions: [
      { id: 'q8-ch-1', type: 'translation-en-jp', prompt: '"What time is it now?"', correctAnswer: 'いまなんじですか', acceptedAnswers: ['いまなんじですか？'] },
      { id: 'q8-ch-2', type: 'multiple-choice', prompt: '"It\'s 7:30." — most natural:', options: ['しちじはんです', 'しちじさんじゅっぷんです', 'しちさんじゅうです', 'しちじさんじゅうふんです'], correctAnswer: 'しちじはんです' },
      { id: 'q8-ch-3', type: 'fill-in-blank', prompt: '「はちじ___がっこうにいきます。」', correctAnswer: 'に' },
      { id: 'q8-ch-4', type: 'translation-en-jp', prompt: '"I wake up at seven."', correctAnswer: 'しちじにおきます', acceptedAnswers: ['しちじにおきます。'] },
      { id: 'q8-ch-5', type: 'sentence-build', prompt: 'Build: "I study from nine to three."', correctAnswer: 'くじからさんじまでべんきょうします' },
      { id: 'q8-ch-6', type: 'multiple-choice', prompt: '"I go to bed at eleven." — correct:', options: ['じゅういちじにねます', 'じゅういちじでねます', 'じゅういちじにおきます', 'じゅういちじはねます'], correctAnswer: 'じゅういちじにねます' },
      { id: 'q8-ch-7', type: 'translation-jp-en', prompt: '「はちじからごじまでがっこうです」', correctAnswer: 'School is from eight to five', acceptedAnswers: ['School runs from eight to five.'] },
      { id: 'q8-ch-8', type: 'fill-in-blank', prompt: '「くじ___さんじまでべんきょうします。」', correctAnswer: 'から' },
      { id: 'q8-ch-9', type: 'translation-en-jp', prompt: '"It\'s 9:15."', correctAnswer: 'くじじゅうごふんです', acceptedAnswers: ['くじじゅうごふんです。'] },
      { id: 'q8-ch-10', type: 'multiple-choice', prompt: '"School starts at eight." — correct:', options: ['はちじにがっこうがはじまります', 'はちじでがっこうがはじまります', 'はちじはがっこうがはじまります', 'はちじにがっこうをはじまります'], correctAnswer: 'はちじにがっこうがはじまります' },
      { id: 'q8-ch-11', type: 'sentence-build', prompt: 'Build: "I eat breakfast at 7:30."', correctAnswer: 'しちじはんにあさごはんをたべます' },
      { id: 'q8-ch-12', type: 'fill-in-blank', prompt: '「くじからさんじ___べんきょうします。」', correctAnswer: 'まで' },
      { id: 'q8-ch-13', type: 'translation-en-jp', prompt: '"I return home at three."', correctAnswer: 'さんじにうちにかえります', acceptedAnswers: ['さんじにかえります', 'さんじにうちにかえります。'] },
      { id: 'q8-ch-14', type: 'translation-jp-en', prompt: '「しちじにおきます」', correctAnswer: 'I wake up at seven', acceptedAnswers: ['I get up at seven.'] },
      { id: 'q8-ch-15', type: 'multiple-choice', prompt: '"I eat dinner at six." — correct:', options: ['ろくじによるごはんをたべます', 'ろくじでよるごはんをたべます', 'ろくじはよるごはんをたべます', 'よるごはんろくじをたべます'], correctAnswer: 'ろくじによるごはんをたべます' },
    ],
  }
};
