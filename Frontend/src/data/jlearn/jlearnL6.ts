import { JLearnLevel } from './jlearnTypes';

export const jlearnLevel6: JLearnLevel = {
  id: 'JL6',
  title: 'Location & Existence',
  theme: 'Describe where people and things are using います and あります.',
  location: 'Tanaka House & Neighborhood',
  jlptAlignment: 'N5',
  genkiChapters: [4],
  checkpointUnitId: 'L6-U2',
  badge: { id: 'badge-locator', name: 'Locator', description: 'You can find anything and anyone in any space.' },
  storyHook: {
    type: 'invitation-tease',
    speaker: 'Yuki',
    teaser: "Yuki texts you from somewhere in the house. You need to find her.",
    japanese: 'どこにいる？',
    translation: 'Where are you?'
  },
  units: [
    {
      id: 'L6-U1',
      title: 'います・あります',
      summary: 'います for living things, あります for non-living things.',
      steps: [
        {
          id: 'L6-U1-M1',
          title: 'Is there a cat?',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario: "A cat wanders into the Tanaka garden. You notice it.",
          goal: 'Use います for living things and あります for non-living things.',
          vocabulary: [
            { id: 'v6-imasu', japanese: 'います', romaji: 'imasu', english: 'is/are (living things)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v6-arimasu', japanese: 'あります', romaji: 'arimasu', english: 'is/are (non-living things)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v6-neko', japanese: 'ねこ', romaji: 'neko', english: 'cat', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-inu', japanese: 'いぬ', romaji: 'inu', english: 'dog', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-niwa', japanese: 'にわ', romaji: 'niwa', english: 'garden', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g6-imasu-arimasu',
            pattern: '[subject] が います / あります',
            explanation: 'います = existence of living things (people, animals). あります = existence of non-living things (objects, plants).',
            structure: '[noun] が います/あります',
            examples: ['にわにねこがいます。', 'つくえのうえにほんがあります。', 'いぬがいますか。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex6-1-1', japanese: 'にわにねこがいます。', romaji: 'Niwa ni neko ga imasu.', english: 'There is a cat in the garden.', vocabIds: ['v6-niwa', 'v6-neko', 'v6-imasu'], grammarIds: ['g6-imasu-arimasu'] },
            { id: 'ex6-1-2', japanese: 'つくえのうえにほんがあります。', romaji: 'Tsukue no ue ni hon ga arimasu.', english: 'There is a book on the desk.', vocabIds: ['v6-arimasu'], grammarIds: ['g6-imasu-arimasu'] },
            { id: 'ex6-1-3', japanese: 'いぬがいますか。', romaji: 'Inu ga imasu ka.', english: 'Is there a dog?', vocabIds: ['v6-inu', 'v6-imasu'], grammarIds: ['g6-imasu-arimasu'] },
          ],
          branchingChoice: {
            prompt: "A plant is on the windowsill. Which verb?",
            options: [
              { id: 'a', label: 'まどのそばにはながあります', outcome: 'correct', reaction: 'Right! Plants use あります — they cannot move on their own.' },
              { id: 'b', label: 'まどのそばにはながいます', outcome: 'wrong', reaction: 'います is for living things that move. Plants use あります.' },
              { id: 'c', label: 'まどのそばにはながです', outcome: 'wrong', reaction: 'Need あります or います to express existence.' },
            ]
          },
          dialogueChains: [{ id: 'dl6-1-1', turns: [
            { speaker: 'Yuki', line: { 0: 'にわにねこがいますよ！', 2: 'にわに猫いるよ！' }, isLearnerTurn: false, translation: 'There is a cat in the garden!' },
            { speaker: 'You', expectedAnswer: 'ほんとうですか、かわいいですね', acceptedAnswers: ['ほんとうですか', 'かわいい！', 'かわいいですね'], isLearnerTurn: true, translation: 'Really? How cute!' },
            { speaker: 'Yuki', line: { 0: 'はい！しろいねこです。', 2: 'うん！白い猫！' }, isLearnerTurn: false, translation: 'Yes! A white cat.' },
          ]}],
          questions: [
            { id: 'q6-1-1', type: 'multiple-choice', prompt: 'Which verb for a dog?', options: ['います', 'あります', 'です', 'います or あります'], correctAnswer: 'います' },
            { id: 'q6-1-2', type: 'translation-en-jp', prompt: '"There is a book." (non-living)', correctAnswer: 'ほんがあります', acceptedAnswers: ['ほんがあります。'] },
            { id: 'q6-1-3', type: 'fill-in-blank', prompt: '「にわにねこが___。」', correctAnswer: 'います' },
          ],
          successMessage: 'います vs あります — you have the distinction.',
          emotionalFeedback: {
            perfect: '「完璧！ねこも喜んでる！」',
            good: 'Right choice, right verb.',
            struggle: 'Remember: can it move on its own? います. Otherwise あります.',
          }
        },
        {
          id: 'L6-U1-M2',
          title: 'に — location particle',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "Yuki asks where things are in the house.",
          goal: 'Use に to mark the location of existence.',
          vocabulary: [
            { id: 'v6-ni', japanese: 'に', romaji: 'ni', english: 'at / in / on (location)', partOfSpeech: 'particle', jlptLevel: 'N5' },
            { id: 'v6-doko', japanese: 'どこ', romaji: 'doko', english: 'where', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-ima', japanese: 'いま', romaji: 'ima', english: 'living room', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-daidokoro', japanese: 'だいどころ', romaji: 'daidokoro', english: 'kitchen', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g6-ni-location',
            pattern: '[location] に [subject] が います/あります',
            explanation: 'に marks the place where something exists. Word order: location に subject が verb.',
            structure: '[location] に [noun] が います/あります',
            examples: ['いまにいます。', 'だいどころにたなかさんがいます。', 'どこにいますか。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex6-2-1', japanese: 'いまにいます。', romaji: 'Ima ni imasu.', english: 'I am in the living room.', vocabIds: ['v6-ima', 'v6-ni', 'v6-imasu'], grammarIds: ['g6-ni-location'] },
            { id: 'ex6-2-2', japanese: 'だいどころにたなかさんがいます。', romaji: 'Daidokoro ni Tanaka-san ga imasu.', english: 'Mrs. Tanaka is in the kitchen.', vocabIds: ['v6-daidokoro', 'v6-ni', 'v6-imasu'], grammarIds: ['g6-ni-location'] },
            { id: 'ex6-2-3', japanese: 'どこにいますか。', romaji: 'Doko ni imasu ka.', english: 'Where are you?', vocabIds: ['v6-doko', 'v6-ni', 'v6-imasu'], grammarIds: ['g6-ni-location'] },
          ],
          branchingChoice: {
            prompt: "Yuki texts asking where you are. You reply you're in the living room:",
            options: [
              { id: 'a', label: 'いまにいます', outcome: 'correct', reaction: 'Yuki replies: 「わかった！行くね！」' },
              { id: 'b', label: 'いまがいます', outcome: 'wrong', reaction: 'が marks the subject. Use に for location: いまに。' },
              { id: 'c', label: 'いまいます', outcome: 'partial', reaction: 'Understood, but に is needed to mark the location correctly.' },
            ]
          },
          dialogueChains: [{ id: 'dl6-1-2', turns: [
            { speaker: 'Yuki', line: { 0: 'どこにいますか？', 2: 'どこにいる？' }, isLearnerTurn: false, translation: 'Where are you?' },
            { speaker: 'You', expectedAnswer: 'いまにいます', acceptedAnswers: ['いまにいます。', 'いまです'], isLearnerTurn: true, translation: 'I am in the living room.' },
            { speaker: 'Yuki', line: { 0: 'わかりました！すぐ行きます。', 2: 'わかった！すぐ行く！' }, isLearnerTurn: false, translation: 'Got it! Coming right away.' },
          ]}],
          questions: [
            { id: 'q6-2-1', type: 'translation-en-jp', prompt: '"Where are you?"', correctAnswer: 'どこにいますか', acceptedAnswers: ['どこにいますか？'] },
            { id: 'q6-2-2', type: 'fill-in-blank', prompt: '「だいどころ___たなかさんがいます。」', correctAnswer: 'に' },
            { id: 'q6-2-3', type: 'multiple-choice', prompt: '"Mrs. Tanaka is in the kitchen." — correct form:', options: ['だいどころにたなかさんがいます', 'たなかさんがだいどころです', 'だいどころがたなかさんにいます', 'たなかさんにだいどころがいます'], correctAnswer: 'だいどころにたなかさんがいます' },
          ],
          successMessage: 'Location marked clearly with に.',
          emotionalFeedback: {
            perfect: '「正確！」 Yuki finds you immediately.',
            good: 'に placed correctly.',
            struggle: 'Location に subject が verb. Lock that order in.',
          }
        },
        {
          id: 'L6-U1-M3',
          title: 'Relative positions',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Mrs. Tanaka has rearranged the room. You describe where things are.",
          goal: 'Use positional words: うえ, した, そば, なか, まえ, うしろ.',
          vocabulary: [
            { id: 'v6-ue', japanese: 'うえ', romaji: 'ue', english: 'on top / above', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-shita', japanese: 'した', romaji: 'shita', english: 'under / below', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-soba', japanese: 'そば', romaji: 'soba', english: 'next to / near', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-naka', japanese: 'なか', romaji: 'naka', english: 'inside', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-mae', japanese: 'まえ', romaji: 'mae', english: 'in front of', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g6-position',
            pattern: 'X の うえ/した/なか に Y が あります',
            explanation: 'Positional nouns combine with の to describe where something is relative to another object.',
            structure: '[reference] の [position] に [item] が あります/います',
            examples: ['つくえのうえにほんがあります。', 'いすのしたにねこがいます。', 'かばんのなかにけいたいがあります。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex6-3-1', japanese: 'つくえのうえにほんがあります。', romaji: 'Tsukue no ue ni hon ga arimasu.', english: 'There is a book on top of the desk.', vocabIds: ['v6-ue', 'v6-arimasu'], grammarIds: ['g6-position'] },
            { id: 'ex6-3-2', japanese: 'いすのしたにねこがいます。', romaji: 'Isu no shita ni neko ga imasu.', english: 'There is a cat under the chair.', vocabIds: ['v6-shita', 'v6-neko', 'v6-imasu'], grammarIds: ['g6-position'] },
            { id: 'ex6-3-3', japanese: 'かばんのなかにけいたいがあります。', romaji: 'Kaban no naka ni keitai ga arimasu.', english: 'There is a phone inside the bag.', vocabIds: ['v6-naka', 'v6-arimasu'], grammarIds: ['g6-position'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks where the cat is. It's under the chair:",
            options: [
              { id: 'a', label: 'いすのしたにいます', outcome: 'correct', reaction: '「え、かわいい！」 Yuki crouches down to look.' },
              { id: 'b', label: 'いすのうえにいます', outcome: 'wrong', reaction: 'うえ is on top. The cat is under — した.' },
              { id: 'c', label: 'いすのしたにあります', outcome: 'wrong', reaction: 'The cat is alive — use います, not あります.' },
            ]
          },
          dialogueChains: [{ id: 'dl6-1-3', turns: [
            { speaker: 'Yuki', line: { 0: 'ねこはどこにいますか？', 2: 'ねこ、どこ？' }, isLearnerTurn: false, translation: 'Where is the cat?' },
            { speaker: 'You', expectedAnswer: 'いすのしたにいます', acceptedAnswers: ['いすのしたにいます。', 'いすの下です'], isLearnerTurn: true, translation: 'It is under the chair.' },
            { speaker: 'Yuki', line: { 0: '「あ、いた！」', 2: 'あ、いたいた！' }, isLearnerTurn: false, translation: 'Oh, found it!' },
          ]}],
          questions: [
            { id: 'q6-3-1', type: 'translation-en-jp', prompt: '"There is a book on top of the desk."', correctAnswer: 'つくえのうえにほんがあります', acceptedAnswers: ['つくえのうえにほんがあります。'] },
            { id: 'q6-3-2', type: 'fill-in-blank', prompt: '「かばんの___にけいたいがあります。」(inside)', correctAnswer: 'なか' },
            { id: 'q6-3-3', type: 'multiple-choice', prompt: '"Cat is under the chair" — correct:', options: ['いすのしたにねこがいます', 'いすのうえにねこがいます', 'いすのしたにねこがあります', 'ねこのしたにいすがいます'], correctAnswer: 'いすのしたにねこがいます' },
          ],
          successMessage: 'Every item in its place. Position vocab solid.',
          emotionalFeedback: {
            perfect: '「部屋の地図が作れるね！」',
            good: 'Described the room perfectly.',
            struggle: 'Position words pair with の and に. Keep building.',
          }
        },
        {
          id: 'L6-U1-M4',
          title: 'There is / There isn\'t',
          kind: 'review',
          estimatedMinutes: 1,
          scenario: "Yuki asks if various things are in the house. Answer yes and no.",
          goal: 'Use the negative forms いません and ありません.',
          vocabulary: [
            { id: 'v6-imasen', japanese: 'いません', romaji: 'imasen', english: 'is not (living things)', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { id: 'v6-arimasen', japanese: 'ありません', romaji: 'arimasen', english: 'is not (non-living things)', partOfSpeech: 'verb', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g6-negative-existence',
            pattern: 'いません / ありません',
            explanation: 'Negative existence: いません = (living thing) is not there; ありません = (object) is not there.',
            structure: '[noun] が いません/ありません',
            examples: ['ねこはいません。', 'にわにはながありません。', 'だれもいません。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex6-4-1', japanese: 'ねこはいません。', romaji: 'Neko wa imasen.', english: 'The cat is not here.', vocabIds: ['v6-neko', 'v6-imasen'], grammarIds: ['g6-negative-existence'] },
            { id: 'ex6-4-2', japanese: 'つくえのうえにほんがありません。', romaji: 'Tsukue no ue ni hon ga arimasen.', english: 'There is no book on the desk.', vocabIds: ['v6-arimasen'], grammarIds: ['g6-negative-existence'] },
            { id: 'ex6-4-3', japanese: 'だれもいません。', romaji: 'Dare mo imasen.', english: 'Nobody is here.', vocabIds: ['v6-imasen'], grammarIds: ['g6-negative-existence'] },
          ],
          branchingChoice: {
            prompt: "Yuki asks if there's a dog. There isn't. You say:",
            options: [
              { id: 'a', label: 'いぬはいません', outcome: 'correct', reaction: '「そっか。ねこだけだね。」' },
              { id: 'b', label: 'いぬはありません', outcome: 'wrong', reaction: 'Dogs are living things — use いません.' },
              { id: 'c', label: 'いぬはいないです', outcome: 'partial', reaction: 'Understood — but いません is the standard polite form.' },
            ]
          },
          dialogueChains: [{ id: 'dl6-1-4', turns: [
            { speaker: 'Yuki', line: { 0: 'いまにだれかいますか？', 2: 'リビングに誰かいる？' }, isLearnerTurn: false, translation: 'Is anyone in the living room?' },
            { speaker: 'You', expectedAnswer: 'いいえ、だれもいません', acceptedAnswers: ['だれもいません', 'いいえ、だれもいません。'], isLearnerTurn: true, translation: 'No, nobody is there.' },
            { speaker: 'Yuki', line: { 0: 'そうか、ありがとう。', 2: 'そっか、ありがと。' }, isLearnerTurn: false, translation: "I see, thanks." },
          ]}],
          questions: [
            { id: 'q6-4-1', type: 'multiple-choice', prompt: '"The cat is not here" — correct form:', options: ['ねこはいません', 'ねこはありません', 'ねこはいます', 'ねこはないです'], correctAnswer: 'ねこはいません' },
            { id: 'q6-4-2', type: 'translation-en-jp', prompt: '"There is no book on the desk."', correctAnswer: 'つくえのうえにほんがありません', acceptedAnswers: ['つくえのうえにほんがありません。'] },
            { id: 'q6-4-3', type: 'fill-in-blank', prompt: '「だれも___。」(nobody is here)', correctAnswer: 'いません' },
          ],
          successMessage: "Positive and negative existence both under control.",
          emotionalFeedback: {
            perfect: '「よくわかってる！」 Yuki is impressed.',
            good: 'Clear and accurate.',
            struggle: 'います→いません, あります→ありません. You\'re getting it.',
          }
        },
      ]
    },
    {
      id: 'L6-U2',
      title: 'Finding People & Things',
      summary: 'Ask where people and things are, describe layouts, and navigate spaces.',
      steps: [
        {
          id: 'L6-U2-M1',
          title: 'Where is Yuki?',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario: "You can't find Yuki. You ask Mrs. Tanaka.",
          goal: 'Ask where people are using どこにいますか.',
          vocabulary: [
            { id: 'v6-ni階', japanese: '二階', romaji: 'nikai', english: 'second floor', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-genkan', japanese: 'げんかん', romaji: 'genkan', english: 'entrance / foyer', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g6-where-person',
            pattern: '[person] は どこに いますか',
            explanation: 'Ask where a person is: [person] は どこに いますか. Answer: [location] に います.',
            structure: '[person] は どこに いますか → [location] に います',
            examples: ['ゆきさんはどこにいますか。', 'にかいにいます。', 'げんかんにいます。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex6-5-1', japanese: 'ゆきさんはどこにいますか。', romaji: 'Yuki-san wa doko ni imasu ka.', english: 'Where is Yuki?', vocabIds: ['v6-doko', 'v6-ni', 'v6-imasu'], grammarIds: ['g6-where-person'] },
            { id: 'ex6-5-2', japanese: 'にかいにいます。', romaji: 'Nikai ni imasu.', english: 'She is on the second floor.', vocabIds: ['v6-ni階', 'v6-ni', 'v6-imasu'], grammarIds: ['g6-where-person'] },
            { id: 'ex6-5-3', japanese: 'げんかんにいます。', romaji: 'Genkan ni imasu.', english: 'I am at the entrance.', vocabIds: ['v6-genkan', 'v6-ni', 'v6-imasu'], grammarIds: ['g6-where-person'] },
          ],
          branchingChoice: {
            prompt: "You're looking for Mrs. Tanaka. You ask Yuki where she is:",
            options: [
              { id: 'a', label: 'たなかさんはどこにいますか', outcome: 'correct', reaction: '「だいどころにいます！」 Yuki points to the kitchen.' },
              { id: 'b', label: 'たなかさんはどこにありますか', outcome: 'wrong', reaction: 'Mrs. Tanaka is a person — use います.' },
              { id: 'c', label: 'たなかさんはどこですか', outcome: 'partial', reaction: 'Understood, but the full form with にいます is more natural.' },
            ]
          },
          dialogueChains: [{ id: 'dl6-2-1', turns: [
            { speaker: 'You', expectedAnswer: 'ゆきさんはどこにいますか', acceptedAnswers: ['ゆきはどこにいますか？', 'ゆきさんはどこですか'], isLearnerTurn: true, translation: 'Where is Yuki?' },
            { speaker: 'Mrs. Tanaka', line: { 0: 'にかいにいますよ。', 2: '二階にいるよ。' }, isLearnerTurn: false, translation: 'She is on the second floor.' },
            { speaker: 'You', expectedAnswer: 'ありがとうございます', acceptedAnswers: ['ありがとうございます。', 'ありがとう'], isLearnerTurn: true, translation: 'Thank you.' },
          ]}],
          questions: [
            { id: 'q6-5-1', type: 'translation-en-jp', prompt: '"Where is Yuki?"', correctAnswer: 'ゆきさんはどこにいますか', acceptedAnswers: ['ゆきはどこにいますか？'] },
            { id: 'q6-5-2', type: 'fill-in-blank', prompt: '「にかい___います。」', correctAnswer: 'に' },
            { id: 'q6-5-3', type: 'multiple-choice', prompt: '"She is at the entrance." — correct:', options: ['げんかんにいます', 'げんかんがいます', 'げんかんにあります', 'げんかんでいます'], correctAnswer: 'げんかんにいます' },
          ],
          successMessage: 'You found Yuki on the second floor.',
          emotionalFeedback: {
            perfect: '「すぐわかった！」',
            good: 'Location found correctly.',
            struggle: 'どこ + に + います — the trio that finds anyone.',
          }
        },
        {
          id: 'L6-U2-M2',
          title: 'Where is the station?',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "You need to find the nearest station. A passerby helps you.",
          goal: 'Ask where a place is using どこにありますか.',
          vocabulary: [
            { id: 'v6-eki', japanese: 'えき', romaji: 'eki', english: 'station', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-chikaku', japanese: 'ちかく', romaji: 'chikaku', english: 'nearby', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-asoko', japanese: 'あそこ', romaji: 'asoko', english: 'over there (far from both)', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g6-where-place',
            pattern: '[place] は どこに ありますか',
            explanation: 'Ask where a place or object is using あります. Answer with location + に あります.',
            structure: '[place/object] は どこに ありますか → [location] に あります',
            examples: ['えきはどこにありますか。', 'ちかくにあります。', 'あそこにあります。'],
            source: 'genki1', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex6-6-1', japanese: 'えきはどこにありますか。', romaji: 'Eki wa doko ni arimasu ka.', english: 'Where is the station?', vocabIds: ['v6-eki', 'v6-doko', 'v6-arimasu'], grammarIds: ['g6-where-place'] },
            { id: 'ex6-6-2', japanese: 'あそこにあります。', romaji: 'Asoko ni arimasu.', english: 'It is over there.', vocabIds: ['v6-asoko', 'v6-arimasu'], grammarIds: ['g6-where-place'] },
            { id: 'ex6-6-3', japanese: 'コンビニのそばにあります。', romaji: 'Konbini no soba ni arimasu.', english: 'It is near the convenience store.', vocabIds: ['v6-soba', 'v6-arimasu'], grammarIds: ['g6-where-place'] },
          ],
          branchingChoice: {
            prompt: "You want to ask a passerby where the convenience store is:",
            options: [
              { id: 'a', label: 'コンビニはどこにありますか', outcome: 'correct', reaction: '「あそこです！」 The passerby points ahead.' },
              { id: 'b', label: 'コンビニはどこにいますか', outcome: 'wrong', reaction: 'A konbini is a non-living place — use あります.' },
              { id: 'c', label: 'コンビニはどこですか', outcome: 'partial', reaction: 'Understood — but にありますか is more precise.' },
            ]
          },
          dialogueChains: [{ id: 'dl6-2-2', turns: [
            { speaker: 'You', expectedAnswer: 'えきはどこにありますか', acceptedAnswers: ['えきはどこですか？', 'えきはどこにありますか？'], isLearnerTurn: true, translation: 'Where is the station?' },
            { speaker: 'Passerby', line: 'えきですか。あそこです。まっすぐいってください。', isLearnerTurn: false, translation: 'The station? It is over there. Go straight.' },
            { speaker: 'You', expectedAnswer: 'ありがとうございます', acceptedAnswers: ['ありがとうございます。', 'ありがとう'], isLearnerTurn: true, translation: 'Thank you.' },
          ]}],
          questions: [
            { id: 'q6-6-1', type: 'translation-en-jp', prompt: '"Where is the station?"', correctAnswer: 'えきはどこにありますか', acceptedAnswers: ['えきはどこにありますか？'] },
            { id: 'q6-6-2', type: 'fill-in-blank', prompt: '「コンビニのそば___あります。」', correctAnswer: 'に' },
            { id: 'q6-6-3', type: 'multiple-choice', prompt: '"It is over there." — correct:', options: ['あそこにあります', 'あそこがあります', 'あそこにいます', 'あそこでいます'], correctAnswer: 'あそこにあります' },
          ],
          successMessage: 'You can navigate now. Finding places is your new skill.',
          emotionalFeedback: {
            perfect: '「すごい、道案内できる！」',
            good: 'Found the station. Good job.',
            struggle: 'あります for places. いません for people. Keep going.',
          }
        },
        {
          id: 'L6-U2-M3',
          title: 'Room tour',
          kind: 'produce',
          estimatedMinutes: 1,
          scenario: "Mrs. Tanaka gives you a tour of the house. You describe what is in each room.",
          goal: 'Combine position words, います, and あります to describe a full room.',
          vocabulary: [
            { id: 'v6-sofa', japanese: 'ソファ', romaji: 'sofa', english: 'sofa', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-terebi', japanese: 'テレビ', romaji: 'terebi', english: 'television', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { id: 'v6-mado', japanese: 'まど', romaji: 'mado', english: 'window', partOfSpeech: 'noun', jlptLevel: 'N5' },
          ],
          grammar: [{
            id: 'g6-room-desc',
            pattern: '[room] に [item] が あります / [person] が います',
            explanation: 'Describe a room by listing what is inside using に + が + あります/います.',
            structure: '[location] に [noun] が あります/います',
            examples: ['いまにソファがあります。', 'まどのそばにネコがいます。', 'テレビのまえにいます。'],
            source: 'custom', jlptLevel: 'N5'
          }],
          examples: [
            { id: 'ex6-7-1', japanese: 'いまにソファがあります。', romaji: 'Ima ni sofa ga arimasu.', english: 'There is a sofa in the living room.', vocabIds: ['v6-ima', 'v6-sofa', 'v6-arimasu'], grammarIds: ['g6-room-desc'] },
            { id: 'ex6-7-2', japanese: 'まどのそばにねこがいます。', romaji: 'Mado no soba ni neko ga imasu.', english: 'The cat is near the window.', vocabIds: ['v6-mado', 'v6-soba', 'v6-neko', 'v6-imasu'], grammarIds: ['g6-room-desc'] },
            { id: 'ex6-7-3', japanese: 'テレビのまえにいます。', romaji: 'Terebi no mae ni imasu.', english: 'I am in front of the television.', vocabIds: ['v6-terebi', 'v6-mae', 'v6-imasu'], grammarIds: ['g6-room-desc'] },
          ],
          branchingChoice: {
            prompt: "Mrs. Tanaka asks what is in front of the window:",
            options: [
              { id: 'a', label: 'まどのまえにソファがあります', outcome: 'correct', reaction: '「そうです！よく見てますね。」' },
              { id: 'b', label: 'ソファのまえにまどがあります', outcome: 'wrong', reaction: 'Reversed: the sofa is in front of the window, not the reverse.' },
              { id: 'c', label: 'まどのまえにソファがいます', outcome: 'wrong', reaction: 'A sofa cannot move — use あります.' },
            ]
          },
          dialogueChains: [{ id: 'dl6-2-3', turns: [
            { speaker: 'Mrs. Tanaka', line: { 0: 'このへやにはなにがありますか？', 2: 'この部屋に何がある？' }, isLearnerTurn: false, translation: 'What is in this room?' },
            { speaker: 'You', expectedAnswer: 'テレビとソファがあります', acceptedAnswers: ['テレビがあります', 'テレビとソファがあります。'], isLearnerTurn: true, translation: 'There is a TV and a sofa.' },
            { speaker: 'Mrs. Tanaka', line: { 0: 'そうですね！ほかには？', 2: 'そうだね！ほかには？' }, isLearnerTurn: false, translation: 'That is right! What else?' },
          ]}],
          questions: [
            { id: 'q6-7-1', type: 'translation-en-jp', prompt: '"There is a TV in the living room."', correctAnswer: 'いまにテレビがあります', acceptedAnswers: ['いまにテレビがあります。'] },
            { id: 'q6-7-2', type: 'fill-in-blank', prompt: '「まどのそば___ねこがいます。」', correctAnswer: 'に' },
            { id: 'q6-7-3', type: 'multiple-choice', prompt: '"The sofa is in front of the window." — correct:', options: ['まどのまえにソファがあります', 'ソファのまえにまどがあります', 'まどのまえにソファがいます', 'ソファがまどにあります'], correctAnswer: 'まどのまえにソファがあります' },
          ],
          successMessage: 'Room described like a tour guide. Excellent.',
          emotionalFeedback: {
            perfect: '「建築家みたい！」',
            good: 'Every item placed precisely.',
            struggle: 'Location + に + noun + が + verb. The structure works.',
          }
        },
        {
          id: 'L6-U2-M4',
          title: 'Level 6 Checkpoint',
          kind: 'checkpoint',
          estimatedMinutes: 2,
          isCheckpoint: true,
          minPassScore: 80,
          scenario: "Final test: います/あります, に, position words, affirmative and negative existence.",
          goal: 'Demonstrate full command of Level 6 location and existence.',
          vocabulary: [],
          grammar: [],
          examples: [],
          branchingChoice: {
            prompt: "You are asked where Mrs. Tanaka is. She is in the kitchen:",
            options: [
              { id: 'a', label: 'だいどころにいます', outcome: 'correct', reaction: '「そうです！」' },
              { id: 'b', label: 'だいどころにあります', outcome: 'wrong', reaction: 'Mrs. Tanaka is a person — います.' },
              { id: 'c', label: 'だいどころがいます', outcome: 'wrong', reaction: 'に marks location, not が.' },
            ]
          },
          dialogueChains: [{ id: 'dl6-2-4', turns: [
            { speaker: 'Yuki', line: 'さあ、テストです！いまに何がありますか？', isLearnerTurn: false, translation: 'Now — what is in the living room?' },
            { speaker: 'You', expectedAnswer: 'ソファとテレビがあります', acceptedAnswers: ['テレビがあります', 'ソファがあります', 'ソファとテレビがあります。'], isLearnerTurn: true, translation: 'There is a sofa and a TV.' },
            { speaker: 'Yuki', line: '合格！よくできました！', isLearnerTurn: false, translation: 'Pass! Well done!' },
          ]}],
          questions: [
            { id: 'q6-cp-1', type: 'multiple-choice', prompt: 'Which verb for a cat?', options: ['います', 'あります', 'です', 'どこです'], correctAnswer: 'います' },
            { id: 'q6-cp-2', type: 'translation-en-jp', prompt: '"Where is the station?"', correctAnswer: 'えきはどこにありますか', acceptedAnswers: ['えきはどこにありますか？'] },
            { id: 'q6-cp-3', type: 'fill-in-blank', prompt: '「つくえのうえ___ほんがあります。」', correctAnswer: 'に' },
            { id: 'q6-cp-4', type: 'sentence-build', prompt: 'Build: "The cat is under the chair."', correctAnswer: 'いすのしたにねこがいます' },
            { id: 'q6-cp-5', type: 'translation-jp-en', prompt: '「だいどころにたなかさんがいます」', correctAnswer: 'Mrs. Tanaka is in the kitchen', acceptedAnswers: ['Tanaka-san is in the kitchen.'] },
            { id: 'q6-cp-6', type: 'multiple-choice', prompt: '"Nobody is here." — correct:', options: ['だれもいません', 'だれもありません', 'だれかいます', 'だれもいます'], correctAnswer: 'だれもいません' },
          ],
          successMessage: 'Level 6 complete. You can find anything and anyone in Japan.',
          emotionalFeedback: {
            perfect: '「地図なしで生きていける！」',
            good: 'Location mastery achieved.',
            struggle: 'You cleared it. います and あります are yours now.',
          }
        },
      ]
    }
  ],
  challengeMission: {
    id: 'JL6-challenge',
    title: 'House Hunt Challenge',
    kind: 'checkpoint',
    estimatedMinutes: 2,
    scenario: "Yuki hid things all around the Tanaka house as a prank. Find everything using your location skills.",
    vocabulary: [],
    grammar: [],
    examples: [],
    questions: [
      { id: 'q6-ch-1', type: 'multiple-choice', prompt: 'Which verb for a dog?', options: ['います', 'あります', 'です', 'あります or います'], correctAnswer: 'います' },
      { id: 'q6-ch-2', type: 'translation-en-jp', prompt: '"Where is Yuki?"', correctAnswer: 'ゆきさんはどこにいますか', acceptedAnswers: ['ゆきはどこにいますか？'] },
      { id: 'q6-ch-3', type: 'fill-in-blank', prompt: '「つくえのうえ___ほんがあります。」', correctAnswer: 'に' },
      { id: 'q6-ch-4', type: 'sentence-build', prompt: 'Build: "The cat is under the chair."', correctAnswer: 'いすのしたにねこがいます' },
      { id: 'q6-ch-5', type: 'translation-en-jp', prompt: '"There is no book on the desk."', correctAnswer: 'つくえのうえにほんがありません', acceptedAnswers: ['つくえのうえにほんがありません。'] },
      { id: 'q6-ch-6', type: 'multiple-choice', prompt: '"The station is over there." — correct:', options: ['えきはあそこにあります', 'えきがあそこです', 'あそこにえきがいます', 'えきにあそこがあります'], correctAnswer: 'えきはあそこにあります' },
      { id: 'q6-ch-7', type: 'translation-jp-en', prompt: '「だれもいません」', correctAnswer: 'Nobody is here', acceptedAnswers: ['There is nobody here.'] },
      { id: 'q6-ch-8', type: 'fill-in-blank', prompt: '「まどのそば___ねこがいます。」', correctAnswer: 'に' },
      { id: 'q6-ch-9', type: 'multiple-choice', prompt: '"There is no dog." — correct:', options: ['いぬはいません', 'いぬはありません', 'いぬがいます', 'いぬがありません'], correctAnswer: 'いぬはいません' },
      { id: 'q6-ch-10', type: 'translation-en-jp', prompt: '"Where is the convenience store?"', correctAnswer: 'コンビニはどこにありますか', acceptedAnswers: ['コンビニはどこですか？'] },
      { id: 'q6-ch-11', type: 'sentence-build', prompt: 'Build: "Mrs. Tanaka is in the kitchen."', correctAnswer: 'だいどころにたなかさんがいます' },
      { id: 'q6-ch-12', type: 'fill-in-blank', prompt: '「かばんのなか___けいたいがあります。」', correctAnswer: 'に' },
      { id: 'q6-ch-13', type: 'multiple-choice', prompt: '"There is a sofa in the living room." — correct:', options: ['いまにソファがあります', 'いまがソファにあります', 'ソファのいまにあります', 'いまにソファがいます'], correctAnswer: 'いまにソファがあります' },
      { id: 'q6-ch-14', type: 'translation-jp-en', prompt: '「いすのしたにねこがいます」', correctAnswer: 'There is a cat under the chair', acceptedAnswers: ['A cat is under the chair.'] },
      { id: 'q6-ch-15', type: 'multiple-choice', prompt: '"I am in front of the TV." — correct:', options: ['テレビのまえにいます', 'テレビのうえにいます', 'テレビのしたにあります', 'テレビのまえにあります'], correctAnswer: 'テレビのまえにいます' },
    ],
  }
};
