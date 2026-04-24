import { JLearnLevel } from './jlearnTypes';

export const jlearnLevel13: JLearnLevel = {
  id: 'JL13',
  title: 'Reasons',
  theme: 'Explain why using から and ので.',
  location: 'School Events',
  jlptAlignment: 'N5',
  genkiChapters: [9],
  checkpointUnitId: 'L13-U2',
  badge: { id: 'badge-reasoner', name: 'Reasoner', description: 'You can explain the why behind everything you say.' },
  storyHook: {
    type: 'invitation-tease',
    speaker: 'Yuki',
    teaser: "Sports day is cancelled. You want to know why. Yuki has all the answers.",
    japanese: 'あめだから、やめたんだよ。',
    translation: "Because it's raining, they cancelled it."
  },
  units: [
    {
      id: 'L13-U1',
      title: 'から — Because',
      summary: 'Give reasons using から at the end of a clause.',
      steps: [
        {
          id: 'L13-U1-M1',
          title: 'Why? Because.',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: "Sports day is cancelled. Everyone wants explanations.",
          goal: 'Use から to explain a reason: [reason]から、[result].',
          vocabulary: [
            { id: 'v13-kara', japanese: 'から', romaji: 'kara', english: 'because / since (reason)', partOfSpeech: 'particle', jlptLevel: 'N5' },
            { id: 'v13-ame', japanese: 'あめ', romaji: 'ame', english: 'rain', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v13-dakara', japanese: 'だから', romaji: 'dakara', english: 'therefore / so', partOfSpeech: 'particle', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g13-kara',
            pattern: '[reason] から、[result]',
            explanation: 'から follows the reason clause (noun/verb/adjective). The result comes after. Order: reason から、result.',
            structure: '[reason clause] + から、[result clause]',
            examples: ['あめだから、うんどうかいはやめました。', 'つかれているから、ねます。', 'たかいから、かいません。'],
            source: 'genki2', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex13-1-1', japanese: 'あめだから、うんどうかいはやめました。', romaji: 'Ame da kara, undoukai wa yamemashita.', english: "Because it's raining, sports day was cancelled.", vocabIds: ['v13-ame', 'v13-kara'], grammarIds: ['g13-kara'] },
            { id: 'ex13-1-2', japanese: 'つかれているから、ねます。', romaji: 'Tsukarete iru kara, nemasu.', english: "Because I'm tired, I'll sleep.", vocabIds: ['v13-kara'], grammarIds: ['g13-kara'] },
            { id: 'ex13-1-3', japanese: 'たかいから、かいません。', romaji: 'Takai kara, kaimasen.', english: "Because it's expensive, I won't buy it.", vocabIds: ['v13-kara'], grammarIds: ['g13-kara'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks why you're not eating. You're not hungry:",
            options: [
              { id: 'a', label: 'おなかがすいていないから、たべません', outcome: 'correct', reaction: '「そうですか。でもすこしたべてね。」' },
              { id: 'b', label: 'たべません、おなかがすいていないから', outcome: 'partial', reaction: 'Understood — but the natural order is reason から、result.' },
              { id: 'c', label: 'おなかがすいていないで、たべません', outcome: 'wrong', reaction: 'Reason uses から, not で: おなかがすいていないから.' },
            ]
          },
          dialogueChains: [{ id: 'dl13-1-1', turns: [
            { speaker: 'Yuki', line: { 0: 'どうしてうんどうかいはやめましたか？', 2: 'なんで運動会やめたの？' }, isLearnerTurn: false, translation: 'Why was sports day cancelled?' },
            { speaker: 'You', expectedAnswer: 'あめだから、やめました', acceptedAnswers: ['あめだから、やめました。', 'あめがふっているから'], isLearnerTurn: true, translation: "Because it's raining, they cancelled it." },
            { speaker: 'Yuki', line: { 0: 'そうですね。ざんねん！', 2: 'そうだね。残念！' }, isLearnerTurn: false, translation: "That's right. Too bad!" },
          ]}],
          questions: [
            { id: 'q13-1-1', type: 'translation-en-jp', prompt: '"Because it\'s expensive, I won\'t buy it."', correctAnswer: 'たかいから、かいません', acceptedAnswers: ['たかいから、かいません。'] },
            { id: 'q13-1-2', type: 'fill-in-blank', prompt: '「あめだ___、やめました。」', correctAnswer: 'から' },
            { id: 'q13-1-3', type: 'multiple-choice', prompt: '"Because I\'m tired, I\'ll sleep." — correct:', options: ['つかれているから、ねます', 'ねます、つかれているから', 'つかれているで、ねます', 'つかれているので、ねます'], correctAnswer: 'つかれているから、ねます' },
          ],
          successMessage: 'から: reasons unlocked. Every why has an answer now.',
          emotionalFeedback: {
            perfect: '「説明上手！」',
            good: 'Reason structure correct.',
            struggle: 'Reason + から + result. The comma in the middle helps.',
          }
        },
        {
          id: 'L13-U1-M2',
          title: 'Explaining decisions',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "School trip planning. You explain your choices using から.",
          goal: 'Use から after verbs, adjectives, and nouns.',
          vocabulary: [
            { id: 'v13-suki', japanese: 'すきだから', romaji: 'suki da kara', english: 'because I like it', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { id: 'v13-muzukashii', japanese: 'むずかしいから', romaji: 'muzukashii kara', english: 'because it\'s difficult', partOfSpeech: 'expression', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g13-kara-all',
            pattern: 'から after verb / い-adj / な-adj+だ / noun+だ',
            explanation: 'から attaches directly to plain forms. Noun/な-adj need だ before から. い-adj: directly attach から.',
            structure: '[plain verb / adj / noun+だ] + から',
            examples: ['にほんごがすきだから、べんきょうします。', 'むずかしいから、てつだってください。', 'やすみだから、いえにいます。'],
            source: 'genki2', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex13-2-1', japanese: 'にほんごがすきだから、べんきょうします。', romaji: 'Nihongo ga suki da kara, benkyou shimasu.', english: 'Because I like Japanese, I study it.', vocabIds: ['v13-suki'], grammarIds: ['g13-kara-all'] },
            { id: 'ex13-2-2', japanese: 'むずかしいから、てつだってください。', romaji: 'Muzukashii kara, tetsudatte kudasai.', english: "Because it's difficult, please help me.", vocabIds: ['v13-muzukashii'], grammarIds: ['g13-kara-all'] },
            { id: 'ex13-2-3', japanese: 'やすみだから、いえにいます。', romaji: 'Yasumi da kara, ie ni imasu.', english: "Because it's a holiday, I'm at home.", vocabIds: ['v13-kara'], grammarIds: ['g13-kara-all'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks why you study Japanese. Because you like it:",
            options: [
              { id: 'a', label: 'にほんごがすきだから、べんきょうします', outcome: 'correct', reaction: '「わあ、うれしい！」 Yuki is touched.' },
              { id: 'b', label: 'にほんごがすきから、べんきょうします', outcome: 'wrong', reaction: 'すき is a な-adj. Needs だ before から: すきだから.' },
              { id: 'c', label: 'にほんごがすきだので、べんきょうします', outcome: 'partial', reaction: 'ので also works, but から is more direct here.' },
            ]
          },
          dialogueChains: [{ id: 'dl13-1-2', turns: [
            { speaker: 'Yuki', line: { 0: 'どうしてにほんごをべんきょうしますか？', 2: 'なんで日本語勉強してるの？' }, isLearnerTurn: false, translation: 'Why do you study Japanese?' },
            { speaker: 'You', expectedAnswer: 'にほんごがすきだから、べんきょうします', acceptedAnswers: ['すきだから、べんきょうします', 'にほんにすみたいから'], isLearnerTurn: true, translation: 'Because I like Japanese, I study it.' },
            { speaker: 'Yuki', line: { 0: 'すごい！わたしもうれしいです！', 2: 'すごい！私もうれしい！' }, isLearnerTurn: false, translation: "Amazing! I'm happy too!" },
          ]}],
          questions: [
            { id: 'q13-2-1', type: 'translation-en-jp', prompt: '"Because I like Japanese, I study it."', correctAnswer: 'にほんごがすきだから、べんきょうします', acceptedAnswers: ['にほんごがすきだからべんきょうします'] },
            { id: 'q13-2-2', type: 'fill-in-blank', prompt: '「むずかしい___、てつだってください。」', correctAnswer: 'から' },
            { id: 'q13-2-3', type: 'multiple-choice', prompt: '"Because it\'s a holiday, I\'m at home." — correct:', options: ['やすみだから、いえにいます', 'やすみから、いえにいます', 'やすみだので、いえにいます', 'やすみのに、いえにいます'], correctAnswer: 'やすみだから、いえにいます' },
          ],
          successMessage: 'から works for all word types. Reasons: complete.',
          emotionalFeedback: {
            perfect: '「理由がはっきり！」',
            good: 'から attached correctly.',
            struggle: 'な-adj and noun need だ before から. い-adj attaches directly.',
          }
        },
        {
          id: 'L13-U1-M3',
          title: 'Answering どうして',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Yuki quizzes you with multiple どうして questions.",
          goal: 'Answer どうして questions naturally using から.',
          vocabulary: [
            { id: 'v13-doushite', japanese: 'どうして', romaji: 'doushite', english: 'why / for what reason', partOfSpeech: 'adverb', jlptLevel: 'N5' },
            { id: 'v13-naze', japanese: 'なぜ', romaji: 'naze', english: 'why (formal)', partOfSpeech: 'adverb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g13-doushite',
            pattern: 'どうして～ですか → [reason] からです',
            explanation: 'Answer どうして questions with the reason + からです. からです is the standalone answer form.',
            structure: 'どうして [clause]ですか → [reason] からです',
            examples: ['どうしてたべませんか。おなかがすいていないからです。', 'どうしてにほんにきましたか。にほんごがすきだからです。'],
            source: 'genki2', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex13-3-1', japanese: 'どうしてたべませんか。おなかがすいていないからです。', romaji: 'Doushite tabemasen ka. Onaka ga suite inai kara desu.', english: "Why don't you eat? Because I'm not hungry.", vocabIds: ['v13-doushite'], grammarIds: ['g13-doushite'] },
            { id: 'ex13-3-2', japanese: 'どうしてにほんにきましたか。にほんごがすきだからです。', romaji: 'Doushite nihon ni kimashita ka. Nihongo ga suki da kara desu.', english: 'Why did you come to Japan? Because I like Japanese.', vocabIds: ['v13-doushite'], grammarIds: ['g13-doushite'] },
          ],
          branchingChoice: {
            prompt: "Yuki: 「どうして学校に来ませんでしたか？」 You were sick:",
            options: [
              { id: 'a', label: 'びょうきだったからです', outcome: 'correct', reaction: '「大丈夫？お大事に！」 Yuki looks worried.' },
              { id: 'b', label: 'びょうきですから', outcome: 'partial', reaction: 'Understood — use the past: びょうきだったから.' },
              { id: 'c', label: 'びょうきからです', outcome: 'wrong', reaction: 'Need だった before から: びょうきだったからです.' },
            ]
          },
          dialogueChains: [{ id: 'dl13-1-3', turns: [
            { speaker: 'Yuki', line: { 0: 'どうしてきのうがっこうにきませんでしたか？', 2: 'なんで昨日学校来なかったの？' }, isLearnerTurn: false, translation: "Why didn't you come to school yesterday?" },
            { speaker: 'You', expectedAnswer: 'びょうきだったからです', acceptedAnswers: ['びょうきだから', 'びょうきだったからです。'], isLearnerTurn: true, translation: 'Because I was sick.' },
            { speaker: 'Yuki', line: { 0: 'そうですか！だいじょうぶですか？', 2: 'そっか！大丈夫？' }, isLearnerTurn: false, translation: "I see! Are you okay?" },
          ]}],
          questions: [
            { id: 'q13-3-1', type: 'translation-en-jp', prompt: '"Because I was sick."', correctAnswer: 'びょうきだったからです', acceptedAnswers: ['びょうきだったからです。'] },
            { id: 'q13-3-2', type: 'fill-in-blank', prompt: '「どうしてたべませんか。おなかがすいていない___です。」', correctAnswer: 'から' },
            { id: 'q13-3-3', type: 'multiple-choice', prompt: '"Why didn\'t you study?" — answer: "Because it was difficult":', options: ['むずかしかったからです', 'むずかしいからです', 'むずかしかったです', 'むずかしだからです'], correctAnswer: 'むずかしかったからです' },
          ],
          successMessage: 'どうして answered every time. から explains everything.',
          emotionalFeedback: {
            perfect: '「理由が明確！」',
            good: 'Every reason delivered.',
            struggle: 'どうして + reason + からです. Full pattern.',
          }
        },
        {
          id: 'L13-U1-M4',
          title: 'から review',
          kind: 'review',
          estimatedMinutes: 1,
          scenario: "Quick sprint with from-varied reasons.",
          goal: 'Apply から after all word types fluently.',
          vocabulary: [
            { id: 'v13-isogashii', japanese: 'いそがしい', romaji: 'isogashii', english: 'busy', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g13-kara-review',
            pattern: 'Full から review',
            explanation: 'から works after: verb plain form, い-adj, な-adj + だ, noun + だ.',
            structure: '[various forms] + から、[result]',
            examples: ['いそがしいから、いけません。', 'やすみだから、うちにいます。', 'たかかったから、かいませんでした。'],
            source: 'genki2', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex13-4-1', japanese: 'いそがしいから、いけません。', romaji: 'Isogashii kara, ikemasen.', english: "Because I'm busy, I can't go.", vocabIds: ['v13-isogashii', 'v13-kara'], grammarIds: ['g13-kara-review'] },
            { id: 'ex13-4-2', japanese: 'たかかったから、かいませんでした。', romaji: 'Takakatta kara, kaimasen deshita.', english: "Because it was expensive, I didn't buy it.", vocabIds: ['v13-kara'], grammarIds: ['g13-kara-review'] },
          ],
          branchingChoice: {
            prompt: "You can't join Yuki's plan. You're busy:",
            options: [
              { id: 'a', label: 'いそがしいから、いけません', outcome: 'correct', reaction: '「そっか、残念！また今度ね。」' },
              { id: 'b', label: 'いそがしいだから、いけません', outcome: 'wrong', reaction: 'い-adjectives attach から directly, no だ needed.' },
              { id: 'c', label: 'いそがしいから、いきます', outcome: 'wrong', reaction: 'いきます = I will go. You said you can\'t go: いけません.' },
            ]
          },
          dialogueChains: [{ id: 'dl13-1-4', turns: [
            { speaker: 'Yuki', line: { 0: 'どうしていっしょにいけないんですか？', 2: 'なんで一緒に行けないの？' }, isLearnerTurn: false, translation: "Why can't you come with us?" },
            { speaker: 'You', expectedAnswer: 'いそがしいから、いけません', acceptedAnswers: ['いそがしいからです', 'いそがしいから、いけません。'], isLearnerTurn: true, translation: "Because I'm busy, I can't go." },
            { speaker: 'Yuki', line: { 0: 'そっか。またこんど！', 2: 'そっか。またね！' }, isLearnerTurn: false, translation: "I see. Next time!" },
          ]}],
          questions: [
            { id: 'q13-4-1', type: 'translation-en-jp', prompt: '"Because I\'m busy, I can\'t go."', correctAnswer: 'いそがしいから、いけません', acceptedAnswers: ['いそがしいからいけません'] },
            { id: 'q13-4-2', type: 'fill-in-blank', prompt: '「たかかった___、かいませんでした。」', correctAnswer: 'から' },
            { id: 'q13-4-3', type: 'multiple-choice', prompt: '"Because it was a holiday, I stayed home." — correct:', options: ['やすみだったから、いえにいました', 'やすみから、いえにいました', 'やすみでから、いえにいました', 'やすみだたから、いえにいました'], correctAnswer: 'やすみだったから、いえにいました' },
          ],
          successMessage: 'から in all flavors. Every reason covered.',
          emotionalFeedback: {
            perfect: '「全部言える！」',
            good: 'から solid across all forms.',
            struggle: 'い-adj: direct. な-adj/noun: + だ. Verb: plain form. Three tracks.',
          }
        },
      ]
    },
    {
      id: 'L13-U2',
      title: 'ので — Softer Reasons',
      summary: 'Use ので for polite, explanatory reasons.',
      steps: [
        {
          id: 'L13-U2-M1',
          title: 'Polite excuses',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "You need to leave a club meeting early. Polite reason required.",
          goal: 'Use ので for polite, explanatory reasons.',
          vocabulary: [
            { id: 'v13-node', japanese: 'ので', romaji: 'node', english: 'because / since (polite)', partOfSpeech: 'particle', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g13-node',
            pattern: '[reason] + ので、[result]',
            explanation: 'ので is softer and more formal than から. Use ので in polite situations and when giving explanations to superiors.',
            structure: '[plain form] + ので、[result]',
            examples: ['びょうきなので、はやくかえります。', 'じゅぎょうがあるので、しつれいします。', 'あめがふっているので、いきません。'],
            source: 'genki2', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex13-5-1', japanese: 'びょうきなので、はやくかえります。', romaji: 'Byouki na node, hayaku kaerimasu.', english: "Because I'm sick, I'll go home early.", vocabIds: ['v13-node'], grammarIds: ['g13-node'] },
            { id: 'ex13-5-2', japanese: 'じゅぎょうがあるので、しつれいします。', romaji: 'Jugyou ga aru node, shitsurei shimasu.', english: 'I have class, so please excuse me.', vocabIds: ['v13-node'], grammarIds: ['g13-node'] },
            { id: 'ex13-5-3', japanese: 'あめがふっているので、いきません。', romaji: 'Ame ga futte iru node, ikimasen.', english: "Because it's raining, I won't go.", vocabIds: ['v13-node'], grammarIds: ['g13-node'] },
          ],
          branchingChoice: {
            prompt: "You need to leave the teacher's office early. You say (politely):",
            options: [
              { id: 'a', label: 'じゅぎょうがあるので、しつれいします', outcome: 'correct', reaction: '「わかりました。お気をつけて。」 The teacher nods.' },
              { id: 'b', label: 'じゅぎょうがあるから、しつれいします', outcome: 'partial', reaction: 'から works — but ので is softer and more appropriate with a teacher.' },
              { id: 'c', label: 'じゅぎょうがあるなので、しつれいします', outcome: 'wrong', reaction: 'ある is a verb — attaches ので directly, no な needed.' },
            ]
          },
          dialogueChains: [{ id: 'dl13-2-1', turns: [
            { speaker: 'You', expectedAnswer: 'じゅぎょうがあるので、しつれいします', acceptedAnswers: ['じゅぎょうがあるので、しつれいします。', 'びょうきなので、かえります'], isLearnerTurn: true, translation: 'I have class, so excuse me.' },
            { speaker: 'Teacher', line: 'わかりました。お気をつけて。', isLearnerTurn: false, translation: 'Understood. Take care.' },
            { speaker: 'You', expectedAnswer: 'ありがとうございます', acceptedAnswers: ['ありがとうございます。', 'しつれいします'], isLearnerTurn: true, translation: 'Thank you.' },
          ]}],
          questions: [
            { id: 'q13-5-1', type: 'translation-en-jp', prompt: '"Because I\'m sick, I\'ll go home early."', correctAnswer: 'びょうきなので、はやくかえります', acceptedAnswers: ['びょうきなのではやくかえります'] },
            { id: 'q13-5-2', type: 'fill-in-blank', prompt: '「じゅぎょうがある___、しつれいします。」', correctAnswer: 'ので' },
            { id: 'q13-5-3', type: 'multiple-choice', prompt: '"Because it\'s raining, I won\'t go." — polite form:', options: ['あめがふっているので、いきません', 'あめがふっているから、いきません', 'あめだので、いきません', 'あめなので、いきます'], correctAnswer: 'あめがふっているので、いきません' },
          ],
          successMessage: 'ので: the polite reason. Perfect for teachers and seniors.',
          emotionalFeedback: {
            perfect: '「礼儀正しい理由！」',
            good: 'ので used in the right context.',
            struggle: 'ので is softer than から. Use it with teachers, seniors, formal contexts.',
          }
        },
        {
          id: 'L13-U2-M2',
          title: 'から vs ので',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Compare the same reason expressed with から and ので. Choose the right one.",
          goal: 'Know when to use から (casual) vs ので (polite).',
          vocabulary: [
            { id: 'v13-formal', japanese: 'ていねい', romaji: 'teinei', english: 'polite / careful', partOfSpeech: 'adjective', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g13-kara-vs-node',
            pattern: 'から (casual/direct) vs ので (polite/explanatory)',
            explanation: 'から = blunt, direct reason. ので = soft, polite explanation. Identical meaning, different register.',
            structure: '[reason] + から/ので + [result]',
            examples: ['casual: つかれているから、ねます。', 'polite: つかれているので、おさきにしつれいします。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex13-6-1', japanese: '（カジュアル）つかれているから、ねます。', romaji: '(casual) Tsukarete iru kara, nemasu.', english: "(casual) Because I'm tired, I'll sleep.", vocabIds: ['v13-kara'], grammarIds: ['g13-kara-vs-node'] },
            { id: 'ex13-6-2', japanese: '（ていねい）つかれているので、おさきにしつれいします。', romaji: '(polite) Tsukarete iru node, osaki ni shitsurei shimasu.', english: "(polite) Because I'm tired, please excuse me for leaving first.", vocabIds: ['v13-node'], grammarIds: ['g13-kara-vs-node'] },
          ],
          branchingChoice: {
            prompt: "You're telling your teacher you can't stay after school:",
            options: [
              { id: 'a', label: 'じゅぎょうがあるので、のこれません', outcome: 'correct', reaction: '「わかりました。」 Teacher nods, satisfied.' },
              { id: 'b', label: 'じゅぎょうがあるから、のこれない', outcome: 'partial', reaction: 'Grammatically fine, but casual form is too blunt for a teacher.' },
              { id: 'c', label: 'じゅぎょうがあります、のこれません', outcome: 'wrong', reaction: 'Need a conjunction: ので or から to link the reason to result.' },
            ]
          },
          dialogueChains: [{ id: 'dl13-2-2', turns: [
            { speaker: 'Teacher', line: 'のこってもらえますか？', isLearnerTurn: false, translation: 'Can you stay after?' },
            { speaker: 'You', expectedAnswer: 'すみません、じゅぎょうがあるので、のこれません', acceptedAnswers: ['じゅぎょうがあるので、のこれません', 'すみません、のこれません'], isLearnerTurn: true, translation: "Sorry, I can't stay because I have class." },
            { speaker: 'Teacher', line: 'わかりました。またにしましょう。', isLearnerTurn: false, translation: 'Understood. Let\'s do it another time.' },
          ]}],
          questions: [
            { id: 'q13-6-1', type: 'multiple-choice', prompt: 'Which is more polite for a teacher?', options: ['つかれているので、かえります', 'つかれているから、かえります', 'both are equal', 'neither is correct'], correctAnswer: 'つかれているので、かえります' },
            { id: 'q13-6-2', type: 'fill-in-blank', prompt: '「じゅぎょうがある___、のこれません。」(polite)', correctAnswer: 'ので' },
            { id: 'q13-6-3', type: 'multiple-choice', prompt: 'Casual excuse to a friend — best choice:', options: ['つかれているから、ねる', 'つかれているので、ねます', 'つかれているなので、ねます', 'つかれているだから、ねます'], correctAnswer: 'つかれているから、ねる' },
          ],
          successMessage: 'Register distinction made. から = friend. ので = teacher.',
          emotionalFeedback: {
            perfect: '「場の空気が読める！」',
            good: 'Right register for each context.',
            struggle: 'Same meaning, different register. Context determines the choice.',
          }
        },
        {
          id: 'L13-U2-M3',
          title: 'Multi-reason chains',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Sports festival closing ceremony. You explain multiple things using reasons.",
          goal: 'Use reasons fluently in extended speech.',
          vocabulary: [
            { id: 'v13-tanoshikatta', japanese: 'たのしかったから', romaji: 'tanoshikatta kara', english: 'because it was fun', partOfSpeech: 'expression', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g13-multi',
            pattern: 'Extended speech with から/ので',
            explanation: 'In natural speech, link multiple reasons and results. Use から casually or ので formally.',
            structure: '[action]. [reason]から/ので、[feeling/next action].',
            examples: ['うんどうかいはたのしかったです。みんなとできたから、よかったです。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex13-7-1', japanese: 'うんどうかいはたのしかったです。みんなといっしょだったから、よかったです。', romaji: 'Undoukai wa tanoshikatta desu. Minna to issho datta kara, yokatta desu.', english: 'Sports day was fun. Because we were all together, it was great.', vocabIds: ['v13-tanoshikatta', 'v13-kara'], grammarIds: ['g13-multi'] },
            { id: 'ex13-7-2', japanese: 'つかれたけど、よかったです。あしたもがんばりたいから、はやくねます。', romaji: 'Tsukareta kedo, yokatta desu. Ashita mo ganbaritai kara, hayaku nemasu.', english: "I'm tired but it was worth it. Because I want to try hard tomorrow, I'll sleep early.", vocabIds: ['v13-kara'], grammarIds: ['g13-multi'] },
          ],
          branchingChoice: {
            prompt: "Sports day ended. You're happy. You say:",
            options: [
              { id: 'a', label: 'みんながんばったから、うれしいです', outcome: 'correct', reaction: '「わたしも！またやりたい！」 Yuki agrees.' },
              { id: 'b', label: 'みんながんばった、うれしいです', outcome: 'wrong', reaction: 'Missing connector: から or ので between reason and result.' },
              { id: 'c', label: 'うれしいです、みんながんばったから', outcome: 'partial', reaction: 'Understood — but reason から result is the natural order.' },
            ]
          },
          dialogueChains: [{ id: 'dl13-2-3', turns: [
            { speaker: 'Yuki', line: { 0: 'うんどうかいはどうでしたか？', 2: '運動会どうだった？' }, isLearnerTurn: false, translation: 'How was sports day?' },
            { speaker: 'You', expectedAnswer: 'たのしかったです。みんながんばったから、よかったです', acceptedAnswers: ['たのしかったです', 'みんながんばったから、よかったです'], isLearnerTurn: true, translation: 'It was fun. Because everyone tried hard, it was great.' },
            { speaker: 'Yuki', line: { 0: 'そうですね！また来年！', 2: 'そうだね！また来年！' }, isLearnerTurn: false, translation: "That's right! Again next year!" },
          ]}],
          questions: [
            { id: 'q13-7-1', type: 'translation-en-jp', prompt: '"Because everyone tried hard, it was great."', correctAnswer: 'みんながんばったから、よかったです', acceptedAnswers: ['みんながんばったからよかったです'] },
            { id: 'q13-7-2', type: 'fill-in-blank', prompt: '「たのしかったから、___。」(I want to do it again)', correctAnswer: 'またやりたいです' },
            { id: 'q13-7-3', type: 'multiple-choice', prompt: '"I\'m tired, so I\'ll sleep early." — correct:', options: ['つかれたから、はやくねます', 'ねます、つかれたから', 'つかれたで、はやくねます', 'はやくねます、つかれた'], correctAnswer: 'つかれたから、はやくねます' },
          ],
          successMessage: 'Multi-sentence reasoning: natural and confident.',
          emotionalFeedback: {
            perfect: '「スピーチみたい！」',
            good: 'Reasons chain naturally.',
            struggle: 'Reason + から/ので + result. Keep the order and it flows.',
          }
        },
        {
          id: 'L13-U2-M4',
          title: 'Level 13 Checkpoint',
          kind: 'checkpoint',
          estimatedMinutes: 2,
          isCheckpoint: true,
          minPassScore: 80,
          scenario: "Final test: から, ので, どうして answers, and polite vs casual register.",
          goal: 'Demonstrate full command of Level 13 reasons.',
          vocabulary: [],
          grammar: [],
          examples: [],
          branchingChoice: {
            prompt: "You tell your teacher you can't attend the event. Politely explain:",
            options: [
              { id: 'a', label: 'じゅぎょうがあるので、いけません', outcome: 'correct', reaction: '「わかりました。お大事に。」' },
              { id: 'b', label: 'じゅぎょうがあるから、いけない', outcome: 'partial', reaction: 'Too casual for a teacher. ので is better.' },
              { id: 'c', label: 'じゅぎょうがあります、いけません', outcome: 'wrong', reaction: 'Need ので to connect the reason to the result.' },
            ]
          },
          dialogueChains: [{ id: 'dl13-2-4', turns: [
            { speaker: 'Teacher', line: 'りゆうのテストです！どうしてにほんごをべんきょうしますか？', isLearnerTurn: false, translation: 'Reason test! Why do you study Japanese?' },
            { speaker: 'You', expectedAnswer: 'にほんごがすきだからです', acceptedAnswers: ['にほんごがすきだから、べんきょうします', 'にほんごがすきだからです。'], isLearnerTurn: true, translation: 'Because I like Japanese.' },
            { speaker: 'Teacher', line: '合格！理由がはっきりしています！', isLearnerTurn: false, translation: 'Pass! Reasons are clear!' },
          ]}],
          questions: [
            { id: 'q13-cp-1', type: 'translation-en-jp', prompt: '"Because it\'s expensive, I won\'t buy it."', correctAnswer: 'たかいから、かいません', acceptedAnswers: ['たかいからかいません'] },
            { id: 'q13-cp-2', type: 'translation-en-jp', prompt: '"Because I have class, excuse me." (polite)', correctAnswer: 'じゅぎょうがあるので、しつれいします', acceptedAnswers: ['じゅぎょうがあるのでしつれいします'] },
            { id: 'q13-cp-3', type: 'fill-in-blank', prompt: '「いそがしい___、いけません。」', correctAnswer: 'から' },
            { id: 'q13-cp-4', type: 'sentence-build', prompt: 'Build: "Because I like Japanese, I study it."', correctAnswer: 'にほんごがすきだから、べんきょうします' },
            { id: 'q13-cp-5', type: 'translation-jp-en', prompt: '「びょうきなので、はやくかえります」', correctAnswer: "Because I'm sick, I'll go home early", acceptedAnswers: ["I'm sick so I'll go home early."] },
            { id: 'q13-cp-6', type: 'multiple-choice', prompt: 'Polite reason connector for teacher:', options: ['ので', 'から', 'だから', 'なので'], correctAnswer: 'ので' },
          ],
          successMessage: 'Level 13 complete. You can explain anything in Japanese.',
          emotionalFeedback: {
            perfect: '「なぜを語れる人！」',
            good: 'Reason mastery achieved.',
            struggle: 'You cleared it. から and ので are your explanation tools.',
          }
        },
      ]
    }
  ],
  challengeMission: {
    id: 'JL13-challenge',
    title: 'Debate Club Challenge',
    kind: 'checkpoint',
    estimatedMinutes: 2,
    scenario: "The debate club is testing new members. You must explain every position with a reason — and choose the right register for each audience.",
    vocabulary: [],
    grammar: [],
    examples: [],
    questions: [
      { id: 'q13-ch-1', type: 'translation-en-jp', prompt: '"Because it\'s expensive, I won\'t buy it."', correctAnswer: 'たかいから、かいません', acceptedAnswers: ['たかいからかいません'] },
      { id: 'q13-ch-2', type: 'multiple-choice', prompt: '"Because I\'m sick, I\'ll go home." — polite form:', options: ['びょうきなので、かえります', 'びょうきだから、かえります', 'びょうきだから、かえる', 'びょうきなので、かえる'], correctAnswer: 'びょうきなので、かえります' },
      { id: 'q13-ch-3', type: 'fill-in-blank', prompt: '「あめだ___、やめました。」', correctAnswer: 'から' },
      { id: 'q13-ch-4', type: 'translation-en-jp', prompt: '"Because I like Japanese, I study it."', correctAnswer: 'にほんごがすきだから、べんきょうします', acceptedAnswers: ['にほんごがすきだからべんきょうします'] },
      { id: 'q13-ch-5', type: 'multiple-choice', prompt: '"Because it was expensive, I didn\'t buy it." — correct:', options: ['たかかったから、かいませんでした', 'たかいから、かいませんでした', 'たかかったので、かいません', 'たかかったかから、かいませんでした'], correctAnswer: 'たかかったから、かいませんでした' },
      { id: 'q13-ch-6', type: 'sentence-build', prompt: 'Build: "Because I\'m busy, I can\'t go."', correctAnswer: 'いそがしいから、いけません' },
      { id: 'q13-ch-7', type: 'translation-jp-en', prompt: '「つかれているから、ねます」', correctAnswer: "Because I'm tired, I'll sleep", acceptedAnswers: ["I'm tired so I'll sleep."] },
      { id: 'q13-ch-8', type: 'fill-in-blank', prompt: '「じゅぎょうがある___、しつれいします。」(polite)', correctAnswer: 'ので' },
      { id: 'q13-ch-9', type: 'translation-en-jp', prompt: '"Because I was sick." (answer form)', correctAnswer: 'びょうきだったからです', acceptedAnswers: ['びょうきだったからです。'] },
      { id: 'q13-ch-10', type: 'multiple-choice', prompt: 'Polite reason connector for a teacher:', options: ['ので', 'から', 'だから', 'だので'], correctAnswer: 'ので' },
      { id: 'q13-ch-11', type: 'sentence-build', prompt: 'Build: "Because I have class, excuse me." (polite)', correctAnswer: 'じゅぎょうがあるので、しつれいします' },
      { id: 'q13-ch-12', type: 'fill-in-blank', prompt: '「にほんごがすきだ___、べんきょうします。」', correctAnswer: 'から' },
      { id: 'q13-ch-13', type: 'translation-jp-en', prompt: '「むずかしいから、てつだってください」', correctAnswer: "Because it's difficult, please help me", acceptedAnswers: ["It's difficult so please help."] },
      { id: 'q13-ch-14', type: 'multiple-choice', prompt: '"Why didn\'t you come?" — answer "Because I was sick":', options: ['びょうきだったからです', 'びょうきだからです', 'びょうきなので', 'びょうきでしたから'], correctAnswer: 'びょうきだったからです' },
      { id: 'q13-ch-15', type: 'translation-en-jp', prompt: '"Because it\'s raining, I won\'t go." (polite)', correctAnswer: 'あめがふっているので、いきません', acceptedAnswers: ['あめがふっているのでいきません'] },
    ],
  }
};
