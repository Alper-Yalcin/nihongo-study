import { JLearnLevel } from './jlearnTypes';

export const jlearnLevel10: JLearnLevel = {
  id: 'JL10',
  title: 'Past Tense',
  theme: 'Talk about what happened using past-tense verbs and adjectives.',
  location: 'School & Weekend Outing',
  jlptAlignment: 'N5',
  genkiChapters: [4, 5],
  checkpointUnitId: 'L10-U2',
  badge: { id: 'badge-storyteller', name: 'Storyteller', description: 'You can recount events that have already happened.' },
  storyHook: {
    type: 'invitation-tease',
    speaker: 'Yuki',
    teaser: "Monday morning. Yuki slides up to you, bursting to tell you about her weekend.",
    japanese: '昨日、すごかったよ！',
    translation: 'Yesterday was amazing!'
  },
  units: [
    {
      id: 'L10-U1',
      title: 'Past Tense Verbs',
      summary: 'Convert ます-form verbs to ました (past affirmative) and ませんでした (past negative).',
      steps: [
        {
          id: 'L10-U1-M1',
          title: 'What did you do?',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: "Monday: Yuki asks about your weekend. Past tense needed.",
          goal: 'Use ました for past affirmative verbs.',
          vocabulary: [
            { id: 'v10-mashita', japanese: '〜ました', romaji: '~mashita', english: 'did (past polite)', partOfSpeech: 'suffix', jlptLevel: 'N5' },
            { id: 'v10-kinou', japanese: 'きのう', romaji: 'kinou', english: 'yesterday', partOfSpeech: 'adverb', jlptLevel: 'N5' },
            { id: 'v10-senshuu', japanese: 'せんしゅう', romaji: 'senshuu', english: 'last week', partOfSpeech: 'adverb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g10-mashita',
            pattern: 'Verb-ます → Verb-ました (past)',
            explanation: 'Replace ます with ました to form the past tense: たべます → たべました.',
            structure: '[verb stem] + ました',
            examples: ['きのうえいがをみました。', 'せんしゅうがっこうにいきました。', 'あさごはんをたべました。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex10-1-1', japanese: 'きのうえいがをみました。', romaji: 'Kinou eiga o mimashita.', english: 'I watched a movie yesterday.', vocabIds: ['v10-kinou', 'v10-mashita'], grammarIds: ['g10-mashita'] },
            { id: 'ex10-1-2', japanese: 'せんしゅうがっこうにいきました。', romaji: 'Senshuu gakkou ni ikimashita.', english: 'I went to school last week.', vocabIds: ['v10-senshuu', 'v10-mashita'], grammarIds: ['g10-mashita'] },
            { id: 'ex10-1-3', japanese: 'あさごはんをたべました。', romaji: 'Asagohan o tabemashita.', english: 'I ate breakfast.', vocabIds: ['v10-mashita'], grammarIds: ['g10-mashita'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks what you did yesterday. You watched a movie:",
            options: [
              { id: 'a', label: 'きのうえいがをみました', outcome: 'correct', reaction: '「えー！なに見たの？」 Yuki wants details.' },
              { id: 'b', label: 'きのうえいがをみます', outcome: 'wrong', reaction: 'みます is present. Past tense: みました.' },
              { id: 'c', label: 'きのうえいがみました', outcome: 'partial', reaction: 'を is needed: えいがをみました.' },
            ]
          },
          dialogueChains: [{ id: 'dl10-1-1', turns: [
            { speaker: 'Yuki', line: { 0: 'しゅうまつになにをしましたか？', 2: '週末何してた？' }, isLearnerTurn: false, translation: 'What did you do on the weekend?' },
            { speaker: 'You', expectedAnswer: 'えいがをみました', acceptedAnswers: ['えいがをみました。', 'ともだちとあそびました', 'べんきょうしました'], isLearnerTurn: true, translation: 'I watched a movie.' },
            { speaker: 'Yuki', line: { 0: 'いいですね！わたしはおまつりにいきました！', 2: 'いいね！私はお祭り行ったよ！' }, isLearnerTurn: false, translation: 'Nice! I went to a festival!' },
          ]}],
          questions: [
            { id: 'q10-1-1', type: 'translation-en-jp', prompt: '"I watched a movie yesterday."', correctAnswer: 'きのうえいがをみました', acceptedAnswers: ['きのうえいがをみました。'] },
            { id: 'q10-1-2', type: 'fill-in-blank', prompt: '「あさごはんをたべ___。」(past)', correctAnswer: 'ました' },
            { id: 'q10-1-3', type: 'multiple-choice', prompt: 'Past form of いきます:', options: ['いきました', 'いきます', 'いきませんでした', 'いきましょう'], correctAnswer: 'いきました' },
          ],
          successMessage: 'ました: past tense activated.',
          emotionalFeedback: {
            perfect: '「昨日を語れる！」',
            good: 'Past tense correct.',
            struggle: 'ます → ました. Simple swap, big impact.',
          }
        },
        {
          id: 'L10-U1-M2',
          title: "I didn't do it",
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "Yuki teases you about things you probably didn't do last weekend.",
          goal: 'Use ませんでした for past negative verbs.',
          vocabulary: [
            { id: 'v10-masendeshita', japanese: '〜ませんでした', romaji: '~masen deshita', english: 'did not (past negative)', partOfSpeech: 'suffix', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g10-masendeshita',
            pattern: 'Verb-ます → Verb-ませんでした (past negative)',
            explanation: 'Replace ます with ませんでした to say something did NOT happen.',
            structure: '[verb stem] + ませんでした',
            examples: ['きのうべんきょうしませんでした。', 'あさごはんをたべませんでした。', 'がっこうにいきませんでした。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex10-2-1', japanese: 'きのうべんきょうしませんでした。', romaji: 'Kinou benkyou shimasen deshita.', english: "I didn't study yesterday.", vocabIds: ['v10-kinou', 'v10-masendeshita'], grammarIds: ['g10-masendeshita'] },
            { id: 'ex10-2-2', japanese: 'あさごはんをたべませんでした。', romaji: 'Asagohan o tabemasen deshita.', english: "I didn't eat breakfast.", vocabIds: ['v10-masendeshita'], grammarIds: ['g10-masendeshita'] },
            { id: 'ex10-2-3', japanese: 'えいがはみませんでした。', romaji: 'Eiga wa mimasen deshita.', english: "I didn't watch the movie.", vocabIds: ['v10-masendeshita'], grammarIds: ['g10-masendeshita'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks if you studied last weekend. You didn't:",
            options: [
              { id: 'a', label: 'べんきょうしませんでした', outcome: 'correct', reaction: '「やっぱり！」 Yuki laughs.' },
              { id: 'b', label: 'べんきょうしませんです', outcome: 'wrong', reaction: 'Past negative: ませんでした, not ませんです.' },
              { id: 'c', label: 'べんきょうしませんだ', outcome: 'wrong', reaction: 'でした is the past of です: ませんでした.' },
            ]
          },
          dialogueChains: [{ id: 'dl10-1-2', turns: [
            { speaker: 'Yuki', line: { 0: 'きのうべんきょうしましたか？', 2: '昨日勉強した？' }, isLearnerTurn: false, translation: 'Did you study yesterday?' },
            { speaker: 'You', expectedAnswer: 'いいえ、べんきょうしませんでした', acceptedAnswers: ['べんきょうしませんでした', 'いいえ、しませんでした'], isLearnerTurn: true, translation: "No, I didn't study." },
            { speaker: 'Yuki', line: { 0: 'えー！だいじょうぶ？', 2: 'えー！大丈夫？' }, isLearnerTurn: false, translation: 'What? Are you okay?' },
          ]}],
          questions: [
            { id: 'q10-2-1', type: 'translation-en-jp', prompt: '"I didn\'t eat breakfast."', correctAnswer: 'あさごはんをたべませんでした', acceptedAnswers: ['あさごはんをたべませんでした。'] },
            { id: 'q10-2-2', type: 'fill-in-blank', prompt: '「えいがをみ___でした。」(past neg)', correctAnswer: 'ません' },
            { id: 'q10-2-3', type: 'multiple-choice', prompt: 'Past negative of いきます:', options: ['いきませんでした', 'いきませんです', 'いきませんだ', 'いきました'], correctAnswer: 'いきませんでした' },
          ],
          successMessage: 'Past negative: ませんでした. Both directions of past covered.',
          emotionalFeedback: {
            perfect: '「正直に言えた！」',
            good: 'Negated past correctly.',
            struggle: 'ません + でした = ませんでした. One combined form.',
          }
        },
        {
          id: 'L10-U1-M3',
          title: 'Past adjectives',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Yuki asks your opinion about last weekend's events. Adjectives need past tense too.",
          goal: 'Form past-tense adjectives: い-adj → かった / な-adj → でした.',
          vocabulary: [
            { id: 'v10-tanoshikatta', japanese: 'たのしかった', romaji: 'tanoshikatta', english: 'was fun (past)', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v10-yokatta', japanese: 'よかった', romaji: 'yokatta', english: 'was good (past)', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g10-adj-past',
            pattern: 'い-adj: い → かった / な-adj: + でした',
            explanation: 'Past adjectives: い-adj drop い add かった. な-adj add でした. Negative: くなかった / ではありませんでした.',
            structure: '[い-adj stem] + かったです / [な-adj] + でした',
            examples: ['たのしかったです。', 'おいしかったです。', 'しずかでした。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex10-3-1', japanese: 'たのしかったです。', romaji: 'Tanoshikatta desu.', english: 'It was fun.', vocabIds: ['v10-tanoshikatta'], grammarIds: ['g10-adj-past'] },
            { id: 'ex10-3-2', japanese: 'おいしかったです。', romaji: 'Oishikatta desu.', english: 'It was delicious.', vocabIds: [], grammarIds: ['g10-adj-past'] },
            { id: 'ex10-3-3', japanese: 'このへやはしずかでした。', romaji: 'Kono heya wa shizuka deshita.', english: 'This room was quiet.', vocabIds: [], grammarIds: ['g10-adj-past'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks if the movie was good. It was good:",
            options: [
              { id: 'a', label: 'よかったです', outcome: 'correct', reaction: '「それはよかった！わたしも見たい！」' },
              { id: 'b', label: 'いかったです', outcome: 'wrong', reaction: 'いい is irregular: いい → よかった, not いかった.' },
              { id: 'c', label: 'よいでした', outcome: 'wrong', reaction: 'Use the irregular past form: よかったです.' },
            ]
          },
          dialogueChains: [{ id: 'dl10-1-3', turns: [
            { speaker: 'Yuki', line: { 0: 'えいがはどうでしたか？', 2: '映画どうだった？' }, isLearnerTurn: false, translation: 'How was the movie?' },
            { speaker: 'You', expectedAnswer: 'たのしかったです', acceptedAnswers: ['たのしかったです。', 'おもしろかったです', 'よかったです'], isLearnerTurn: true, translation: 'It was fun.' },
            { speaker: 'Yuki', line: { 0: 'それはよかったですね！', 2: 'それはよかった！' }, isLearnerTurn: false, translation: 'That is great!' },
          ]}],
          questions: [
            { id: 'q10-3-1', type: 'translation-en-jp', prompt: '"It was delicious."', correctAnswer: 'おいしかったです', acceptedAnswers: ['おいしかったです。'] },
            { id: 'q10-3-2', type: 'fill-in-blank', prompt: '「たのし___です。」(was fun)', correctAnswer: 'かった' },
            { id: 'q10-3-3', type: 'multiple-choice', prompt: '"It was quiet." (な-adj past):', options: ['しずかでした', 'しずかかったです', 'しずかいでした', 'しずかでしたです'], correctAnswer: 'しずかでした' },
          ],
          successMessage: 'Past adjectives: both い and な types handled.',
          emotionalFeedback: {
            perfect: '「過去形マスター！」',
            good: 'Past adjectives solid.',
            struggle: 'い-adj: い→かった. な-adj: +でした. Both needed.',
          }
        },
        {
          id: 'L10-U1-M4',
          title: 'Weekend story',
          kind: 'review',
          estimatedMinutes: 1,
          scenario: "Tell Yuki the full story of your weekend using past tense.",
          goal: 'Chain ました, ませんでした, and past adjectives into a cohesive story.',
          vocabulary: [
            { id: 'v10-sorekara', japanese: 'それから', romaji: 'sorekara', english: 'then / after that', partOfSpeech: 'adverb', jlptLevel: 'N5' },
            { id: 'v10-demo', japanese: 'でも', romaji: 'demo', english: 'but / however', partOfSpeech: 'particle', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g10-story',
            pattern: 'Chaining past events with それから and でも',
            explanation: 'Use それから to link events in sequence. Use でも to contrast. Both bridge past-tense sentences.',
            structure: '[past event]. それから [past event]. でも [contrasting event].',
            examples: ['えいがをみました。それからごはんをたべました。でも、あまりおいしくなかったです。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex10-4-1', japanese: 'えいがをみました。それからごはんをたべました。', romaji: 'Eiga o mimashita. Sorekara gohan o tabemashita.', english: 'I watched a movie. Then I ate.', vocabIds: ['v10-sorekara'], grammarIds: ['g10-story'] },
            { id: 'ex10-4-2', japanese: 'たのしかったです。でも、つかれました。', romaji: 'Tanoshikatta desu. Demo, tsukaremashita.', english: 'It was fun. But I got tired.', vocabIds: ['v10-demo'], grammarIds: ['g10-story'] },
          ],
          branchingChoice: {
            prompt: "You want to tell a story: you went to the festival, then ate ramen. Which link word?",
            options: [
              { id: 'a', label: 'おまつりにいきました。それからラーメンをたべました', outcome: 'correct', reaction: '「いいですね！」 Yuki hangs on every word.' },
              { id: 'b', label: 'おまつりにいきました。でもラーメンをたべました', outcome: 'partial', reaction: 'でも = but. It implies contrast. それから fits a smooth sequence better.' },
              { id: 'c', label: 'おまつりにいきます。それからラーメンをたべます', outcome: 'wrong', reaction: 'Past tense: いきました and たべました.' },
            ]
          },
          dialogueChains: [{ id: 'dl10-1-4', turns: [
            { speaker: 'Yuki', line: { 0: 'しゅうまつのはなしをきかせてください！', 2: '週末の話、聞かせて！' }, isLearnerTurn: false, translation: 'Tell me about your weekend!' },
            { speaker: 'You', expectedAnswer: 'えいがをみました。それからともだちとたべました', acceptedAnswers: ['えいがをみました', 'ともだちとあそびました。それからたべました'], isLearnerTurn: true, translation: 'I watched a movie, then ate with a friend.' },
            { speaker: 'Yuki', line: { 0: 'たのしそう！こんどさそってください！', 2: '楽しそう！今度誘って！' }, isLearnerTurn: false, translation: 'Sounds fun! Invite me next time!' },
          ]}],
          questions: [
            { id: 'q10-4-1', type: 'translation-en-jp', prompt: '"I watched a movie. Then I ate."', correctAnswer: 'えいがをみました。それからたべました', acceptedAnswers: ['えいがをみました。それからごはんをたべました'] },
            { id: 'q10-4-2', type: 'fill-in-blank', prompt: '「たのしかったです。___、つかれました。」(but)', correctAnswer: 'でも' },
            { id: 'q10-4-3', type: 'multiple-choice', prompt: 'Link two sequential past events:', options: ['それから', 'でも', 'それに', 'だから'], correctAnswer: 'それから' },
          ],
          successMessage: 'Weekend story told. Past tense storytelling: unlocked.',
          emotionalFeedback: {
            perfect: '「作家みたい！」',
            good: 'Story flowed naturally.',
            struggle: 'それから links what came next. でも introduces contrast.',
          }
        },
      ]
    },
    {
      id: 'L10-U2',
      title: 'Recounting Experiences',
      summary: 'Tell longer stories, ask about others\' experiences, and narrate events in full.',
      steps: [
        {
          id: 'L10-U2-M1',
          title: 'Have you ever...?',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "Yuki asks if you've experienced various things in Japan.",
          goal: 'Ask and answer about past experiences.',
          vocabulary: [
            { id: 'v10-koto', japanese: 'ことがあります', romaji: 'koto ga arimasu', english: 'have (done something) before', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v10-hontou', japanese: 'ほんとうに', romaji: 'hontou ni', english: 'really / truly', partOfSpeech: 'adverb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g10-koto-ga-aru',
            pattern: '[verb past plain] + ことがあります',
            explanation: '〜たことがあります expresses past experience: "I have done X before." Plain past form + こと.',
            structure: '[verb-た form] + ことがあります',
            examples: ['すしをたべたことがあります。', 'にほんにいったことがあります。', 'ふじさんをみたことがあります。'],
            source: 'genki2', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex10-5-1', japanese: 'すしをたべたことがあります。', romaji: 'Sushi o tabeta koto ga arimasu.', english: 'I have eaten sushi before.', vocabIds: ['v10-koto'], grammarIds: ['g10-koto-ga-aru'] },
            { id: 'ex10-5-2', japanese: 'にほんにいったことがあります。', romaji: 'Nihon ni itta koto ga arimasu.', english: 'I have been to Japan before.', vocabIds: ['v10-koto'], grammarIds: ['g10-koto-ga-aru'] },
            { id: 'ex10-5-3', japanese: 'にほんごをべんきょうしたことがあります。', romaji: 'Nihongo o benkyou shita koto ga arimasu.', english: 'I have studied Japanese before.', vocabIds: ['v10-koto'], grammarIds: ['g10-koto-ga-aru'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks if you've eaten sushi before:",
            options: [
              { id: 'a', label: 'はい、たべたことがあります', outcome: 'correct', reaction: '「わあ、どこで食べましたか？」' },
              { id: 'b', label: 'はい、たべることがあります', outcome: 'wrong', reaction: 'Experience uses the た-form: たべた + ことがあります.' },
              { id: 'c', label: 'はい、たべましたことがあります', outcome: 'wrong', reaction: 'Use plain past (た form) before こと: たべたことがあります.' },
            ]
          },
          dialogueChains: [{ id: 'dl10-2-1', turns: [
            { speaker: 'Yuki', line: { 0: 'にほんのりょうりをたべたことがありますか？', 2: '日本料理、食べたことある？' }, isLearnerTurn: false, translation: 'Have you eaten Japanese food before?' },
            { speaker: 'You', expectedAnswer: 'はい、すしをたべたことがあります', acceptedAnswers: ['はい、たべたことがあります', 'はい、すしをたべたことがあります。'], isLearnerTurn: true, translation: 'Yes, I have eaten sushi.' },
            { speaker: 'Yuki', line: { 0: 'すごい！おいしかったですか？', 2: 'すごい！おいしかった？' }, isLearnerTurn: false, translation: 'Amazing! Was it delicious?' },
          ]}],
          questions: [
            { id: 'q10-5-1', type: 'translation-en-jp', prompt: '"I have eaten sushi before."', correctAnswer: 'すしをたべたことがあります', acceptedAnswers: ['すしをたべたことがあります。'] },
            { id: 'q10-5-2', type: 'fill-in-blank', prompt: '「にほんにいった___があります。」', correctAnswer: 'こと' },
            { id: 'q10-5-3', type: 'multiple-choice', prompt: '"I have studied Japanese." — correct:', options: ['にほんごをべんきょうしたことがあります', 'にほんごをべんきょうすることがあります', 'にほんごをべんきょうしましたことがあります', 'にほんごべんきょうたことがあります'], correctAnswer: 'にほんごをべんきょうしたことがあります' },
          ],
          successMessage: 'Past experience expressed. You have a history now.',
          emotionalFeedback: {
            perfect: '「経験豊か！」',
            good: 'Experience pattern nailed.',
            struggle: 'Plain past + ことがあります. たべた + こと. Keep practicing.',
          }
        },
        {
          id: 'L10-U2-M2',
          title: 'What was it like?',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Yuki wants details. You describe a past experience with past adjectives.",
          goal: 'Combine past-tense verbs and past adjectives in a description.',
          vocabulary: [
            { id: 'v10-sugokatta', japanese: 'すごかった', romaji: 'sugokatta', english: 'was amazing', partOfSpeech: 'adjective', jlptLevel: 'N5' },
            { id: 'v10-muzukashikatta', japanese: 'むずかしかった', romaji: 'muzukashikatta', english: 'was difficult', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g10-describe-past',
            pattern: 'Past verb + past adjective combination',
            explanation: 'Combine a past action verb with a past adjective to fully describe an experience.',
            structure: '[past verb]. [subject] は [past adj] でした。',
            examples: ['にほんにいきました。すごかったです。', 'えいがをみました。おもしろかったです。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex10-6-1', japanese: 'にほんにいきました。すごかったです！', romaji: 'Nihon ni ikimashita. Sugokatta desu!', english: 'I went to Japan. It was amazing!', vocabIds: ['v10-sugokatta'], grammarIds: ['g10-describe-past'] },
            { id: 'ex10-6-2', japanese: 'テストをうけました。むずかしかったです。', romaji: 'Tesuto o ukemashita. Muzukashikatta desu.', english: 'I took the test. It was difficult.', vocabIds: ['v10-muzukashikatta'], grammarIds: ['g10-describe-past'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks how the sushi was. It was delicious:",
            options: [
              { id: 'a', label: 'おいしかったです', outcome: 'correct', reaction: '「よかった！また食べようよ！」' },
              { id: 'b', label: 'おいしいでした', outcome: 'wrong', reaction: 'Past い-adjective: い → かった. おいしかったです.' },
              { id: 'c', label: 'おいしかったでした', outcome: 'wrong', reaction: 'One form only: おいしかったです, not かったでした.' },
            ]
          },
          dialogueChains: [{ id: 'dl10-2-2', turns: [
            { speaker: 'Yuki', line: { 0: 'そのえいがはどうでしたか？', 2: 'その映画どうだった？' }, isLearnerTurn: false, translation: 'How was that movie?' },
            { speaker: 'You', expectedAnswer: 'おもしろかったです', acceptedAnswers: ['おもしろかったです。', 'たのしかったです', 'すごかったです'], isLearnerTurn: true, translation: 'It was interesting.' },
            { speaker: 'Yuki', line: { 0: 'そうですか！わたしも見たいです！', 2: 'そっか！私も見たい！' }, isLearnerTurn: false, translation: "Is that so! I want to see it too!" },
          ]}],
          questions: [
            { id: 'q10-6-1', type: 'translation-en-jp', prompt: '"It was amazing."', correctAnswer: 'すごかったです', acceptedAnswers: ['すごかったです。'] },
            { id: 'q10-6-2', type: 'fill-in-blank', prompt: '「むずかし___です。」(was difficult)', correctAnswer: 'かった' },
            { id: 'q10-6-3', type: 'multiple-choice', prompt: '"It was quiet." (な-adj past):', options: ['しずかでした', 'しずかかったです', 'しずかいでした', 'しずかでしたです'], correctAnswer: 'しずかでした' },
          ],
          successMessage: 'Past descriptions flowing. Experiences coming alive.',
          emotionalFeedback: {
            perfect: '「もっと聞きたい！」 Yuki leans in.',
            good: 'Past description delivered.',
            struggle: 'い → かった. な → でした. Two tracks for past adj.',
          }
        },
        {
          id: 'L10-U2-M3',
          title: 'Last week vs. this week',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Compare what happened last week with what is happening now.",
          goal: 'Contrast past and present using time words and verb tenses.',
          vocabulary: [
            { id: 'v10-konshu', japanese: 'こんしゅう', romaji: 'konshuu', english: 'this week', partOfSpeech: 'adverb', jlptLevel: 'N5' },
            { id: 'v10-kyounen', japanese: 'きょねん', romaji: 'kyonen', english: 'last year', partOfSpeech: 'adverb', jlptLevel: 'N5' },
            { id: 'v10-kotoshi', japanese: 'ことし', romaji: 'kotoshi', english: 'this year', partOfSpeech: 'adverb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g10-time-contrast',
            pattern: 'せんしゅうは～ました。こんしゅうは～ます。',
            explanation: 'Use past and present tense with different time words to contrast.',
            structure: '[past time] は [ました]. [present time] は [ます].',
            examples: ['せんしゅうはべんきょうしませんでした。こんしゅうはまいにちべんきょうします。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex10-7-1', japanese: 'せんしゅうはべんきょうしませんでした。こんしゅうはがんばります。', romaji: 'Senshuu wa benkyou shimasen deshita. Konshuu wa ganbarimasu.', english: "Last week I didn't study. This week I will try hard.", vocabIds: ['v10-senshuu', 'v10-konshu'], grammarIds: ['g10-time-contrast'] },
            { id: 'ex10-7-2', japanese: 'きょねんにほんごをべんきょうしました。ことしはかんじをべんきょうします。', romaji: 'Kyonen nihongo o benkyou shimashita. Kotoshi wa kanji o benkyou shimasu.', english: 'Last year I studied Japanese. This year I study kanji.', vocabIds: ['v10-kyounen', 'v10-kotoshi'], grammarIds: ['g10-time-contrast'] },
          ],
          branchingChoice: {
            prompt: "Last week you didn't go to school, but this week you are going. You say:",
            options: [
              { id: 'a', label: 'せんしゅうはいきませんでした。こんしゅうはいきます', outcome: 'correct', reaction: '「えらい！がんばって！」 Yuki cheers you on.' },
              { id: 'b', label: 'せんしゅうはいきません。こんしゅうはいきました', outcome: 'wrong', reaction: 'Tenses reversed: last week needs past, this week needs present.' },
              { id: 'c', label: 'せんしゅうはいきませんでした。こんしゅうはいきました', outcome: 'wrong', reaction: 'This week is still ongoing — use present いきます.' },
            ]
          },
          dialogueChains: [{ id: 'dl10-2-3', turns: [
            { speaker: 'Yuki', line: { 0: 'せんしゅうはなにをしましたか？', 2: '先週何してた？' }, isLearnerTurn: false, translation: 'What did you do last week?' },
            { speaker: 'You', expectedAnswer: 'せんしゅうはえいがをみました。こんしゅうはべんきょうします', acceptedAnswers: ['えいがをみました', 'せんしゅうはべんきょうしませんでした'], isLearnerTurn: true, translation: 'Last week I watched a movie. This week I study.' },
            { speaker: 'Yuki', line: { 0: 'いいバランスですね！', 2: 'いいバランス！' }, isLearnerTurn: false, translation: 'Good balance!' },
          ]}],
          questions: [
            { id: 'q10-7-1', type: 'translation-en-jp', prompt: '"Last week I didn\'t study."', correctAnswer: 'せんしゅうはべんきょうしませんでした', acceptedAnswers: ['せんしゅうはべんきょうしませんでした。'] },
            { id: 'q10-7-2', type: 'fill-in-blank', prompt: '「こんしゅうはがっこうに___。」(going this week)', correctAnswer: 'いきます' },
            { id: 'q10-7-3', type: 'multiple-choice', prompt: '"Last year I studied Japanese." — correct:', options: ['きょねんにほんごをべんきょうしました', 'きょねんにほんごをべんきょうします', 'ことしにほんごをべんきょうしました', 'きょねんにほんごをべんきょうしませんでした'], correctAnswer: 'きょねんにほんごをべんきょうしました' },
          ],
          successMessage: 'Past and present: contrasted and clear.',
          emotionalFeedback: {
            perfect: '「時制を自由に使える！」',
            good: 'Both tenses handled correctly.',
            struggle: 'Last week = past. This week = present. Tense follows time.',
          }
        },
        {
          id: 'L10-U2-M4',
          title: 'Level 10 Checkpoint',
          kind: 'checkpoint',
          estimatedMinutes: 2,
          isCheckpoint: true,
          minPassScore: 80,
          scenario: "Final test: ました, ませんでした, past adjectives, experience pattern, and time contrasts.",
          goal: 'Demonstrate full command of Level 10 past tense.',
          vocabulary: [],
          grammar: [],
          examples: [],
          branchingChoice: {
            prompt: "Yuki asks how the festival was. It was fun:",
            options: [
              { id: 'a', label: 'たのしかったです', outcome: 'correct', reaction: '「よかったですね！」' },
              { id: 'b', label: 'たのしいでした', outcome: 'wrong', reaction: 'Past い-adj: drop い, add かった: たのしかった.' },
              { id: 'c', label: 'たのしかったでした', outcome: 'wrong', reaction: 'Just たのしかったです — no extra でした.' },
            ]
          },
          dialogueChains: [{ id: 'dl10-2-4', turns: [
            { speaker: 'Yuki', line: 'じかんをさかのぼるテストです！', isLearnerTurn: false, translation: 'Time travel test!' },
            { speaker: 'You', expectedAnswer: 'きのうえいがをみました', acceptedAnswers: ['きのうえいがをみました。', 'えいがをみました'], isLearnerTurn: true, translation: 'I watched a movie yesterday.' },
            { speaker: 'Yuki', line: '合格！過去形バッチリ！', isLearnerTurn: false, translation: 'Pass! Past tense is perfect!' },
          ]}],
          questions: [
            { id: 'q10-cp-1', type: 'translation-en-jp', prompt: '"I watched a movie yesterday."', correctAnswer: 'きのうえいがをみました', acceptedAnswers: ['きのうえいがをみました。'] },
            { id: 'q10-cp-2', type: 'translation-en-jp', prompt: '"I didn\'t eat breakfast."', correctAnswer: 'あさごはんをたべませんでした', acceptedAnswers: ['あさごはんをたべませんでした。'] },
            { id: 'q10-cp-3', type: 'fill-in-blank', prompt: '「おいし___です。」(was delicious)', correctAnswer: 'かった' },
            { id: 'q10-cp-4', type: 'sentence-build', prompt: 'Build: "I have eaten sushi before."', correctAnswer: 'すしをたべたことがあります' },
            { id: 'q10-cp-5', type: 'translation-jp-en', prompt: '「せんしゅうはべんきょうしませんでした」', correctAnswer: "I didn't study last week", acceptedAnswers: ["Last week I didn't study."] },
            { id: 'q10-cp-6', type: 'multiple-choice', prompt: '"It was quiet." (な-adj past):', options: ['しずかでした', 'しずかかったです', 'しずかいでした', 'しずかだったです'], correctAnswer: 'しずかでした' },
          ],
          successMessage: 'Level 10 complete. You can tell stories set in the past.',
          emotionalFeedback: {
            perfect: '「歴史家になれる！」',
            good: 'Past tense mastery achieved.',
            struggle: 'You cleared it. ました and ませんでした are yours.',
          }
        },
      ]
    }
  ],
  challengeMission: {
    id: 'JL10-challenge',
    title: 'Monday Report Challenge',
    kind: 'checkpoint',
    estimatedMinutes: 2,
    scenario: "Mrs. Tanaka hosts a Monday morning show-and-tell. Tell the whole room what you did last weekend — in perfect past tense.",
    vocabulary: [],
    grammar: [],
    examples: [],
    questions: [
      { id: 'q10-ch-1', type: 'translation-en-jp', prompt: '"I watched a movie yesterday."', correctAnswer: 'きのうえいがをみました', acceptedAnswers: ['きのうえいがをみました。'] },
      { id: 'q10-ch-2', type: 'multiple-choice', prompt: 'Past form of たべます:', options: ['たべました', 'たべます', 'たべませんでした', 'たべましょう'], correctAnswer: 'たべました' },
      { id: 'q10-ch-3', type: 'fill-in-blank', prompt: '「べんきょうし___でした。」(didn\'t study)', correctAnswer: 'ません' },
      { id: 'q10-ch-4', type: 'translation-en-jp', prompt: '"It was delicious."', correctAnswer: 'おいしかったです', acceptedAnswers: ['おいしかったです。'] },
      { id: 'q10-ch-5', type: 'sentence-build', prompt: 'Build: "I have been to Japan before."', correctAnswer: 'にほんにいったことがあります' },
      { id: 'q10-ch-6', type: 'multiple-choice', prompt: '"It was fun." — correct:', options: ['たのしかったです', 'たのしいでした', 'たのしかったでした', 'たのしくなかったです'], correctAnswer: 'たのしかったです' },
      { id: 'q10-ch-7', type: 'translation-jp-en', prompt: '「あさごはんをたべませんでした」', correctAnswer: "I didn't eat breakfast", acceptedAnswers: ["I did not eat breakfast."] },
      { id: 'q10-ch-8', type: 'fill-in-blank', prompt: '「えいがをみ___。」(watched)', correctAnswer: 'ました' },
      { id: 'q10-ch-9', type: 'translation-en-jp', prompt: '"I didn\'t go to school yesterday."', correctAnswer: 'きのうがっこうにいきませんでした', acceptedAnswers: ['きのうがっこうにいきませんでした。'] },
      { id: 'q10-ch-10', type: 'multiple-choice', prompt: '"It was quiet." (な-adj past):', options: ['しずかでした', 'しずかかったです', 'しずかいでした', 'しずかだったです'], correctAnswer: 'しずかでした' },
      { id: 'q10-ch-11', type: 'sentence-build', prompt: 'Build: "Last week I didn\'t study."', correctAnswer: 'せんしゅうはべんきょうしませんでした' },
      { id: 'q10-ch-12', type: 'fill-in-blank', prompt: '「むずかし___です。」(was difficult)', correctAnswer: 'かった' },
      { id: 'q10-ch-13', type: 'translation-en-jp', prompt: '"I have eaten sushi before."', correctAnswer: 'すしをたべたことがあります', acceptedAnswers: ['すしをたべたことがあります。'] },
      { id: 'q10-ch-14', type: 'translation-jp-en', prompt: '「たのしかったです」', correctAnswer: 'It was fun', acceptedAnswers: ['It was enjoyable.'] },
      { id: 'q10-ch-15', type: 'multiple-choice', prompt: '"I went to a festival. Then I ate ramen." — link word:', options: ['それから', 'でも', 'それに', 'しかし'], correctAnswer: 'それから' },
    ],
  }
};
