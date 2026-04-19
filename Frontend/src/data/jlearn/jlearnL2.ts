import { GrammarPoint, JLearnLevel, VocabItem } from './jlearnTypes';

const v = {
  namae: {
    id: 'v2-namae',
    japanese: 'なまえ',
    romaji: 'namae',
    english: 'name',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  watashi: {
    id: 'v2-watashi',
    japanese: 'わたし',
    romaji: 'watashi',
    english: 'I / me',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  anata: {
    id: 'v2-anata',
    japanese: 'あなた',
    romaji: 'anata',
    english: 'you',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  kare: {
    id: 'v2-kare',
    japanese: 'かれ',
    romaji: 'kare',
    english: 'he',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  kanojo: {
    id: 'v2-kanojo',
    japanese: 'かのじょ',
    romaji: 'kanojo',
    english: 'she',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  san: {
    id: 'v2-san',
    japanese: 'さん',
    romaji: 'san',
    english: 'Mr./Ms. honorific',
    partOfSpeech: 'suffix',
    jlptLevel: 'N5'
  },
  kun: {
    id: 'v2-kun',
    japanese: 'くん',
    romaji: 'kun',
    english: 'honorific for younger male classmate',
    partOfSpeech: 'suffix',
    jlptLevel: 'N5'
  },
  chan: {
    id: 'v2-chan',
    japanese: 'ちゃん',
    romaji: 'chan',
    english: 'affectionate honorific',
    partOfSpeech: 'suffix',
    jlptLevel: 'N5'
  },
  gakusei: {
    id: 'v2-gakusei',
    japanese: 'がくせい',
    romaji: 'gakusei',
    english: 'student',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  sensei: {
    id: 'v2-sensei',
    japanese: 'せんせい',
    romaji: 'sensei',
    english: 'teacher',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  hajimemashite: {
    id: 'v2-hajimemashite',
    japanese: 'はじめまして',
    romaji: 'hajimemashite',
    english: 'nice to meet you',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  yoroshiku: {
    id: 'v2-yoroshiku',
    japanese: 'よろしくおねがいします',
    romaji: 'yoroshiku onegai shimasu',
    english: 'please take care of me / nice to meet you',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  kochiraKoso: {
    id: 'v2-kochira-koso',
    japanese: 'こちらこそ',
    romaji: 'kochira koso',
    english: 'likewise / same here',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  nihon: {
    id: 'v2-nihon',
    japanese: 'にほん',
    romaji: 'nihon',
    english: 'Japan',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  amerika: {
    id: 'v2-amerika',
    japanese: 'アメリカ',
    romaji: 'amerika',
    english: 'America',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  igirisu: {
    id: 'v2-igirisu',
    japanese: 'イギリス',
    romaji: 'igirisu',
    english: 'England',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  kankoku: {
    id: 'v2-kankoku',
    japanese: 'かんこく',
    romaji: 'kankoku',
    english: 'Korea',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  furansu: {
    id: 'v2-furansu',
    japanese: 'フランス',
    romaji: 'furansu',
    english: 'France',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  toruko: {
    id: 'v2-toruko',
    japanese: 'トルコ',
    romaji: 'toruko',
    english: 'Turkey',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  jin: {
    id: 'v2-jin',
    japanese: 'じん',
    romaji: 'jin',
    english: 'person from a country',
    partOfSpeech: 'suffix',
    jlptLevel: 'N5'
  },
  go: {
    id: 'v2-go',
    japanese: 'ご',
    romaji: 'go',
    english: 'language of a country',
    partOfSpeech: 'suffix',
    jlptLevel: 'N5'
  },
  doko: {
    id: 'v2-doko',
    japanese: 'どこ',
    romaji: 'doko',
    english: 'where',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  madaMada: {
    id: 'v2-mada-mada',
    japanese: 'まだまだです',
    romaji: 'mada mada desu',
    english: 'not yet / I still have a long way to go',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  sukoshiHanasemasu: {
    id: 'v2-sukoshi-hanasemasu',
    japanese: 'すこしはなせます',
    romaji: 'sukoshi hanasemasu',
    english: 'I can speak a little',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  kaishain: {
    id: 'v2-kaishain',
    japanese: 'かいしゃいん',
    romaji: 'kaishain',
    english: 'company employee',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  isha: {
    id: 'v2-isha',
    japanese: 'いしゃ',
    romaji: 'isha',
    english: 'doctor',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  enjinia: {
    id: 'v2-enjinia',
    japanese: 'えんじにあ',
    romaji: 'enjinia',
    english: 'engineer',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  ryuugakusei: {
    id: 'v2-ryuugakusei',
    japanese: 'りゅうがくせい',
    romaji: 'ryuugakusei',
    english: 'international student',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  shigoto: {
    id: 'v2-shigoto',
    japanese: 'しごと',
    romaji: 'shigoto',
    english: 'job / work',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  nan: {
    id: 'v2-nan',
    japanese: 'なん',
    romaji: 'nan',
    english: 'what',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  hajimeteAdverb: {
    id: 'v2-hajimete-adverb',
    japanese: 'はじめて',
    romaji: 'hajimete',
    english: 'for the first time',
    partOfSpeech: 'adverb',
    jlptLevel: 'N5'
  },
  sai: {
    id: 'v2-sai',
    japanese: 'さい',
    romaji: 'sai',
    english: 'years old',
    partOfSpeech: 'counter',
    jlptLevel: 'N5'
  },
  hatachi: {
    id: 'v2-hatachi',
    japanese: 'はたち',
    romaji: 'hatachi',
    english: '20 years old',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  nansai: {
    id: 'v2-nansai',
    japanese: 'なんさい',
    romaji: 'nansai',
    english: 'how old?',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  ikutsu: {
    id: 'v2-ikutsu',
    japanese: 'いくつ',
    romaji: 'ikutsu',
    english: 'how many / how old',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  juunana: {
    id: 'v2-juunana',
    japanese: 'じゅうなな',
    romaji: 'juunana',
    english: '17',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  juuhachi: {
    id: 'v2-juuhachi',
    japanese: 'じゅうはち',
    romaji: 'juuhachi',
    english: '18',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  nijuuichi: {
    id: 'v2-nijuuichi',
    japanese: 'にじゅういち',
    romaji: 'nijuuichi',
    english: '21',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  }
} satisfies Record<string, VocabItem>;

const g = {
  identityDesu: {
    id: 'g2-identity-desu',
    pattern: 'わたしは ___ です',
    explanation: 'Put the name or thing after わたしは, then end with です to say what it is politely.',
    structure: 'わたし は [name / noun] です',
    examples: ['わたしはエマです。', 'かれはけんじさんです。'],
    source: 'genki1',
    jlptLevel: 'N5'
  },
  negativeDesu: {
    id: 'g2-negative-desu',
    pattern: '___ じゃないです',
    explanation: 'To say something is not true, replace です with じゃないです.',
    structure: '[noun] じゃないです',
    examples: ['わたしはがくせいじゃないです。', 'かのじょはせんせいじゃないです。'],
    source: 'taekim',
    jlptLevel: 'N5'
  },
  originKaraKimashita: {
    id: 'g2-origin-kara-kimashita',
    pattern: '___ から きました',
    explanation: 'Put から after the place you came from, then add きました.',
    structure: '[country] から きました',
    examples: ['トルコからきました。', 'イギリスからきました。'],
    source: 'genki1',
    jlptLevel: 'N5'
  },
  jinAndGo: {
    id: 'g2-jin-go',
    pattern: '___じん / ___ご',
    explanation: 'Add じん for a person from that country, and ご for the language of that country.',
    structure: '[country] + じん / ご',
    examples: ['にほんじん', 'にほんご'],
    source: 'custom',
    jlptLevel: 'N5'
  },
  selfIntroFlow: {
    id: 'g2-self-intro-flow',
    pattern: 'はじめまして → わたしは ___ です → ___からきました → よろしくおねがいします',
    explanation: 'Start with your name, then where you came from, and save よろしくおねがいします for the end.',
    structure: 'opening → name → origin → closing',
    examples: ['はじめまして。わたしはエマです。アメリカからきました。よろしくおねがいします。'],
    source: 'custom',
    jlptLevel: 'N5'
  },
  jobDesu: {
    id: 'g2-job-desu',
    pattern: 'わたしは ___ です',
    explanation: 'Drop a job word into the same pattern to say what you do.',
    structure: 'わたし は [job] です',
    examples: ['わたしはりゅうがくせいです。', 'かれはいしゃです。'],
    source: 'genki1',
    jlptLevel: 'N5'
  },
  ageSai: {
    id: 'g2-age-sai',
    pattern: '[number]さい です',
    explanation: 'Put さい after the age number, then finish with です.',
    structure: '[number] さい です',
    examples: ['わたしはじゅうななさいです。', 'かれははたちです。'],
    source: 'custom',
    jlptLevel: 'N5'
  },
  fullSelfIntroFlow: {
    id: 'g2-full-self-intro-flow',
    pattern: 'はじめまして → name → origin → job → age → よろしくおねがいします',
    explanation: 'Say your name first, then origin, job, age, and close politely at the end.',
    structure: 'opening → name → origin → job → age → closing',
    examples: ['はじめまして。わたしはエマです。アメリカからきました。りゅうがくせいです。じゅうはちさいです。よろしくおねがいします。'],
    source: 'custom',
    jlptLevel: 'N5'
  }
} satisfies Record<string, GrammarPoint>;

export const jlearnLevel2: JLearnLevel = {
  id: 'JL2',
  title: 'Self Introduction',
  theme: 'First day at school — name, origin, and your first classroom conversations',
  location: 'Homeroom classroom + school lunch',
  jlptAlignment: 'N5',
  genkiChapters: [1],
  checkpointUnitId: 'L2-U2',
  badge: {
    id: 'badge-self-introducer',
    name: 'Self-Introducer',
    description: 'You can introduce yourself completely to anyone in Japanese.'
  },
  units: [
    {
      id: 'L2-U1',
      title: 'First Day in Homeroom',
      summary: 'Yamada-sensei introduces you, Yuki gets curious, and you build your first real self-introduction.',
      steps: [
        {
          id: 'L2-U1-M1',
          title: 'Your teacher asks your name',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario:
            'Yamada-sensei says, 「みなさん、あたらしいがくせいをしょうかいします。なまえはなんですか。」 The room goes completely quiet.',
          goal: 'Say your name with わたしは ___ です.',
          vocabulary: [v.namae, v.watashi, v.anata, v.kare, v.kanojo, v.san, v.kun, v.chan],
          grammar: [g.identityDesu, g.negativeDesu],
          examples: [
            {
              id: 'ex-L2-U1-M1-1',
              japanese: 'わたしはマリアです。',
              romaji: 'Watashi wa Maria desu.',
              english: 'I am Maria.',
              vocabIds: [v.watashi.id],
              grammarIds: [g.identityDesu.id]
            },
            {
              id: 'ex-L2-U1-M1-2',
              japanese: 'かれはたなかさんです。',
              romaji: 'Kare wa Tanaka-san desu.',
              english: 'He is Tanaka-san.',
              vocabIds: [v.kare.id, v.san.id],
              grammarIds: [g.identityDesu.id]
            },
            {
              id: 'ex-L2-U1-M1-3',
              japanese: 'わたしはがくせいじゃないです。',
              romaji: 'Watashi wa gakusei janai desu.',
              english: 'I am not a student.',
              vocabIds: [v.watashi.id, v.gakusei.id],
              grammarIds: [g.negativeDesu.id]
            },
            {
              id: 'ex-L2-U1-M1-4',
              japanese: 'あなたのなまえはなんですか。',
              romaji: 'Anata no namae wa nan desu ka.',
              english: 'What is your name?',
              vocabIds: [v.anata.id, v.namae.id],
              grammarIds: []
            }
          ],
          branchingChoice: {
            prompt: 'Yamada-sensei asks: 「なまえはなんですか。」 What do you say?',
            options: [
              {
                id: 'a',
                label: 'Stay silent and bow',
                outcome: 'wrong',
                reaction: 'Yamada-sensei repeats the question slowly. Fifty classmates keep staring.'
              },
              {
                id: 'b',
                label: 'Just say your name',
                outcome: 'partial',
                reaction: 'She nods, then gestures for a full sentence.',
                explanation: 'Start with わたしは, then say your name, then finish with です.'
              },
              {
                id: 'c',
                label: 'わたしはエマです',
                outcome: 'correct',
                reaction: 'Yamada-sensei smiles warmly: 「エマさん、よろしくおねがいします。」'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L2-U1-M1-classroom',
              title: 'In front of the class',
              turns: [
                {
                  speaker: 'Yamada-sensei',
                  line: 'なまえはなんですか。',
                  translation: 'What is your name?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'わたしはエマです',
                  acceptedAnswers: ['わたしはエマです。', 'エマです', 'わたしはマリアです', 'わたしはけんじです'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yamada-sensei',
                  line: 'エマさん、よろしくおねがいします。',
                  translation: 'Emma-san, nice to meet you.',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'こちらこそよろしくおねがいします',
                  acceptedAnswers: ['こちらこそ、よろしくおねがいします', 'こちらこそよろしくおねがいします。', 'よろしくおねがいします'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L2-U1-M1-1',
              type: 'sentence-build',
              prompt: 'Build: “I am Kenji.”',
              correctAnswer: 'わたし は ケンジ です',
              explanation: 'Start with わたし は, then add the name, then end with です.',
              targetGrammarId: g.identityDesu.id
            },
            {
              id: 'q-L2-U1-M1-2',
              type: 'fill-in-blank',
              prompt: 'わたし ___ マリアです。',
              correctAnswer: 'は',
              targetGrammarId: g.identityDesu.id
            },
            {
              id: 'q-L2-U1-M1-3',
              type: 'context-select',
              prompt: 'Which honorific fits your teacher?',
              options: ['ちゃん', 'くん', 'さん'],
              correctAnswer: 'さん',
              targetVocabId: v.san.id
            },
            {
              id: 'q-L2-U1-M1-4',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'かのじょはせんせいじゃないです。',
              correctAnswer: 'she is not a teacher',
              acceptedAnswers: ['she is not a teacher.'],
              targetGrammarId: g.negativeDesu.id
            },
            {
              id: 'q-L2-U1-M1-5',
              type: 'translation-en-jp',
              prompt: 'Translate: “He is Kenji-san.”',
              correctAnswer: 'かれはけんじさんです',
              acceptedAnswers: ['かれはけんじさんです。'],
              targetVocabId: v.kare.id
            },
            {
              id: 'q-L2-U1-M1-6',
              type: 'sentence-build',
              prompt: 'Build the negative: “I am not a student.”',
              correctAnswer: 'わたし は がくせい じゃないです',
              targetVocabId: v.gakusei.id,
              targetGrammarId: g.negativeDesu.id
            },
            {
              id: 'q-L2-U1-M1-7',
              type: 'fill-in-blank',
              prompt: '「なまえはなんですか。」 You answer: ___',
              correctAnswer: 'わたしはエマです',
              acceptedAnswers: ['わたしはエマです。', 'エマです'],
              explanation: 'A full classroom answer starts with わたしは.',
              targetVocabId: v.namae.id
            }
          ],
          successMessage: 'You can introduce your name in Japanese — and you made your first impression.',
          emotionalFeedback: {
            perfect: 'The room goes silent for a beat — then the first clap starts. You finally breathe.',
            good: 'A few students smile and nod. The pressure breaks all at once.',
            struggle: 'Your voice shook, but it came out. In this room, that counts.'
          }
        },
        {
          id: 'L2-U1-M2',
          title: 'A classmate asks where you are from',
          kind: 'expand',
          estimatedMinutes: 2,
          scenario:
            'Break time. Yuki slides her desk closer and asks, 「どこからきましたか。」 She wants to know more — and fast.',
          goal: 'Say where you are from and understand nationality vs. language.',
          vocabulary: [v.nihon, v.amerika, v.igirisu, v.kankoku, v.furansu, v.toruko, v.jin, v.go, v.doko],
          grammar: [g.originKaraKimashita, g.jinAndGo],
          examples: [
            {
              id: 'ex-L2-U1-M2-1',
              japanese: 'わたしはアメリカからきました。',
              romaji: 'Watashi wa Amerika kara kimashita.',
              english: 'I came from America.',
              vocabIds: [v.watashi.id, v.amerika.id],
              grammarIds: [g.originKaraKimashita.id]
            },
            {
              id: 'ex-L2-U1-M2-2',
              japanese: 'かれはフランスじんです。',
              romaji: 'Kare wa Furansu-jin desu.',
              english: 'He is French.',
              vocabIds: [v.kare.id, v.furansu.id, v.jin.id],
              grammarIds: [g.jinAndGo.id]
            },
            {
              id: 'ex-L2-U1-M2-3',
              japanese: 'あなたはどこからきましたか。',
              romaji: 'Anata wa doko kara kimashita ka.',
              english: 'Where are you from?',
              vocabIds: [v.anata.id, v.doko.id],
              grammarIds: [g.originKaraKimashita.id]
            },
            {
              id: 'ex-L2-U1-M2-4',
              japanese: 'わたしはにほんごをはなします。',
              romaji: 'Watashi wa nihongo o hanashimasu.',
              english: 'I speak Japanese.',
              vocabIds: [v.watashi.id, v.nihon.id, v.go.id],
              grammarIds: [g.jinAndGo.id]
            }
          ],
          branchingChoice: {
            prompt: 'Yuki asks: 「どこからきましたか。」 You are from England. What do you say?',
            options: [
              {
                id: 'a',
                label: 'イギリスごです',
                outcome: 'wrong',
                reaction: 'Yuki tilts her head. That is a language, not a place.',
                explanation: 'ご means language. Use からきました for where you came from.'
              },
              {
                id: 'b',
                label: 'イギリスじんです',
                outcome: 'partial',
                reaction: 'Yuki nods, but asks again: 「どこから？」',
                explanation: 'じん tells what you are. からきました tells where you came from.'
              },
              {
                id: 'c',
                label: 'イギリスからきました',
                outcome: 'correct',
                reaction: 'Yuki lights up: 「そうですか！ イギリスからきたんだ！」'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L2-U1-M2-yuki',
              title: 'Yuki gets curious',
              turns: [
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'どこからきましたか。',
                    2: 'どこから来たの？'
                  },
                  translation: 'Where did you come from?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'トルコからきました',
                  acceptedAnswers: ['トルコからきました。', 'イギリスからきました', 'イギリスからきました。', 'アメリカからきました'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'そうですか！ トルコご、じょうずですね！',
                    2: 'へえ！ トルコ語、うまいね！'
                  },
                  translation: 'Really? Your Turkish is good!',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'いいえ、まだまだです',
                  acceptedAnswers: ['まだまだです', 'いいえ、まだまだです。', 'まだまだです。'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'にほんごはどうですか。',
                    2: '日本語、どう？'
                  },
                  translation: 'How is your Japanese?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'すこしはなせます',
                  acceptedAnswers: ['すこしはなせます。', 'まだまだです', 'まだまだです。'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L2-U1-M2-1',
              type: 'sentence-build',
              prompt: 'Build: “I came from Turkey.”',
              correctAnswer: 'わたし は トルコ からきました',
              targetVocabId: v.toruko.id,
              targetGrammarId: g.originKaraKimashita.id
            },
            {
              id: 'q-L2-U1-M2-2',
              type: 'translation-en-jp',
              prompt: 'Translate: “I am Korean.”',
              correctAnswer: 'わたしはかんこくじんです',
              acceptedAnswers: ['わたしはかんこくじんです。', 'かんこくじんです'],
              targetVocabId: v.kankoku.id
            },
            {
              id: 'q-L2-U1-M2-3',
              type: 'fill-in-blank',
              prompt: 'わたしはにほん ___ きました。',
              correctAnswer: 'から',
              targetGrammarId: g.originKaraKimashita.id
            },
            {
              id: 'q-L2-U1-M2-4',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'かのじょはかんこくごをはなします。',
              correctAnswer: 'she speaks korean',
              acceptedAnswers: ['she speaks korean.'],
              targetVocabId: v.go.id
            },
            {
              id: 'q-L2-U1-M2-5',
              type: 'context-select',
              prompt: 'Someone asks 「どこからきましたか。」 You are from France.',
              options: ['フランスじゃないです', 'フランスからきました', 'フランスごです'],
              correctAnswer: 'フランスからきました',
              targetVocabId: v.furansu.id
            },
            {
              id: 'q-L2-U1-M2-6',
              type: 'sentence-build',
              prompt: 'Build: “He is English.”',
              correctAnswer: 'かれ は イギリスじん です',
              targetVocabId: v.igirisu.id,
              targetGrammarId: g.jinAndGo.id
            },
            {
              id: 'q-L2-U1-M2-7',
              type: 'fill-in-blank',
              prompt: '「どこからきましたか。」 You answer: ___',
              correctAnswer: 'イギリスからきました',
              acceptedAnswers: ['イギリスからきました。', 'トルコからきました', 'トルコからきました。'],
              explanation: 'Answer with country + からきました.',
              targetVocabId: v.doko.id
            }
          ],
          successMessage: 'You know how to say where you are from — and ask where others are from.',
          emotionalFeedback: {
            perfect: 'Yuki pulls her desk even closer. You are officially interesting.',
            good: 'Yuki keeps asking questions. That is a very good sign.',
            struggle: 'You stumbled, but Yuki stayed. The conversation did not die.'
          }
        },
        {
          id: 'L2-U1-M3',
          title: 'Review: Three new classmates',
          kind: 'review',
          isReviewStep: true,
          estimatedMinutes: 2,
          scenario:
            'Lunch break. Three classmates stop by your desk one after another. No vocab panel. No rescue.',
          goal: 'Use your name and origin naturally in three different mini-conversations.',
          vocabulary: [],
          grammar: [],
          examples: [],
          questions: [
            {
              id: 'q-L2-U1-M3-1',
              type: 'fill-in-blank',
              prompt: 'Classmate: 「なまえはなんですか。」 You: ___',
              correctAnswer: 'わたしはエマです',
              acceptedAnswers: ['わたしはエマです。', 'エマです']
            },
            {
              id: 'q-L2-U1-M3-2',
              type: 'fill-in-blank',
              prompt: 'Classmate: 「どこからきましたか。」 You: ___',
              correctAnswer: 'トルコからきました',
              acceptedAnswers: ['トルコからきました。', 'イギリスからきました', 'イギリスからきました。']
            },
            {
              id: 'q-L2-U1-M3-3',
              type: 'context-select',
              prompt: 'Your female teacher walks by. Which honorific fits?',
              options: ['ちゃん', 'さん', 'くん'],
              correctAnswer: 'さん'
            },
            {
              id: 'q-L2-U1-M3-4',
              type: 'sentence-build',
              prompt: 'Build: “She is not Japanese.”',
              correctAnswer: 'かのじょ は にほんじん じゃないです'
            },
            {
              id: 'q-L2-U1-M3-5',
              type: 'context-select',
              prompt: 'A friend says 「かれはアメリカからきました。」 What does it mean?',
              options: ['He is American', 'He came from America', 'He speaks American'],
              correctAnswer: 'He came from America'
            },
            {
              id: 'q-L2-U1-M3-6',
              type: 'sentence-build',
              prompt: 'Build: “He is French.”',
              correctAnswer: 'かれ は フランスじん です'
            },
            {
              id: 'q-L2-U1-M3-7',
              type: 'fill-in-blank',
              prompt: 'Classmate: 「にほんごはじょうずですね！」 You: ___',
              correctAnswer: 'いいえ、まだまだです',
              acceptedAnswers: ['まだまだです', 'まだまだです。', 'いいえ、まだまだです。']
            },
            {
              id: 'q-L2-U1-M3-8',
              type: 'translation-en-jp',
              prompt: 'Translate: “Where are you from?”',
              correctAnswer: 'どこからきましたか',
              acceptedAnswers: ['どこからきましたか。']
            }
          ],
          successMessage: 'Three conversations down — you are settling into your new school.',
          emotionalFeedback: {
            perfect: 'Three classmates, three clean replies. You never froze once.',
            good: 'The questions kept coming, and you kept answering. Something shifted.',
            struggle: 'It was messy, but you stayed in the conversation every time.'
          }
        },
        {
          id: 'L2-U1-M4',
          title: 'Stand up and introduce yourself',
          kind: 'produce',
          estimatedMinutes: 2,
          scenario:
            'Yamada-sensei says, 「じこしょうかいをしてください。」 You stand up. The room is still. You have four sentences and no notes.',
          goal: 'Give a full self-introduction: opening, name, origin, and closing.',
          vocabulary: [],
          grammar: [g.selfIntroFlow],
          examples: [
            {
              id: 'ex-L2-U1-M4-1',
              japanese: 'はじめまして。わたしはエマです。アメリカからきました。よろしくおねがいします。',
              romaji: 'Hajimemashite. Watashi wa Ema desu. Amerika kara kimashita. Yoroshiku onegai shimasu.',
              english: 'Nice to meet you. I am Emma. I came from America. Please take care of me.',
              vocabIds: [v.hajimemashite.id, v.watashi.id, v.amerika.id, v.yoroshiku.id],
              grammarIds: [g.selfIntroFlow.id]
            }
          ],
          branchingChoice: {
            prompt: 'Yamada-sensei says 「どうぞ。」 What do you say first?',
            options: [
              {
                id: 'a',
                label: '___からきました',
                outcome: 'partial',
                reaction: 'Yamada-sensei smiles gently: “In Japanese introductions, your name usually comes first.”',
                explanation: 'Start with はじめまして and your name before your origin.'
              },
              {
                id: 'b',
                label: 'はじめまして。わたしは___です',
                outcome: 'correct',
                reaction: 'The class follows you immediately. Yamada-sensei gives one approving nod.'
              },
              {
                id: 'c',
                label: 'よろしくおねがいします',
                outcome: 'wrong',
                reaction: 'Yamada-sensei raises a hand softly. That line belongs at the end.'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L2-U1-M4-intro',
              title: 'Guided classroom introduction',
              turns: [
                {
                  speaker: 'Yamada-sensei',
                  line: 'はじめまして、どうぞ。なまえは？',
                  translation: 'Go ahead. Your name?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'はじめまして。わたしはエマです',
                  acceptedAnswers: ['はじめまして。わたしはエマです。', 'わたしはエマです', 'はじめまして。わたしはけんじです'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yamada-sensei',
                  line: 'どこからきましたか。',
                  translation: 'Where did you come from?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'アメリカからきました',
                  acceptedAnswers: ['アメリカからきました。', 'トルコからきました', 'トルコからきました。'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yamada-sensei',
                  line: 'ありがとうございます！ みなさん、よろしく！',
                  translation: 'Thank you! Everyone, please take care of them!',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'よろしくおねがいします',
                  acceptedAnswers: ['よろしくおねがいします。', 'こちらこそよろしくおねがいします'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L2-U1-M4-1',
              type: 'sentence-build',
              prompt: 'Build the opening.',
              correctAnswer: 'はじめまして'
            },
            {
              id: 'q-L2-U1-M4-2',
              type: 'sentence-build',
              prompt: 'Build: “I am Emma.”',
              correctAnswer: 'わたし は エマ です'
            },
            {
              id: 'q-L2-U1-M4-3',
              type: 'sentence-build',
              prompt: 'Build: “I came from America.”',
              correctAnswer: 'アメリカ からきました'
            },
            {
              id: 'q-L2-U1-M4-4',
              type: 'sentence-build',
              prompt: 'Build the closing.',
              correctAnswer: 'よろしくおねがいします'
            },
            {
              id: 'q-L2-U1-M4-5',
              type: 'translation-en-jp',
              prompt: 'Translate: “Nice to meet you. I am Kenji.”',
              correctAnswer: 'はじめまして。わたしはけんじです',
              acceptedAnswers: ['はじめまして。わたしはけんじです。', 'はじめまして、わたしはけんじです']
            },
            {
              id: 'q-L2-U1-M4-6',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'はじめまして。わたしはリナです。かんこくからきました。',
              correctAnswer: 'nice to meet you. i am rina. i came from korea',
              acceptedAnswers: ['nice to meet you. i am rina. i came from korea.']
            },
            {
              id: 'q-L2-U1-M4-7',
              type: 'sentence-build',
              prompt: 'Build the full opening line.',
              correctAnswer: 'はじめまして わたし は エマ です'
            },
            {
              id: 'q-L2-U1-M4-8',
              type: 'context-select',
              prompt: 'Your introduction is over and classmates clap. The polite thing to say:',
              options: ['さようなら', 'よろしくおねがいします', 'おはようございます'],
              correctAnswer: 'よろしくおねがいします'
            }
          ],
          successMessage: 'You gave your first self-introduction in Japanese — in front of the whole class.',
          emotionalFeedback: {
            perfect: 'You catch someone whispering 「じょうずだね。」 You understood every word.',
            good: 'The room is quiet in a good way. People were listening.',
            struggle: 'Your heart was loud, but your Japanese was louder.'
          }
        },
        {
          id: 'L2-U1-M5',
          title: 'Checkpoint: Unit 2-1',
          kind: 'checkpoint',
          isCheckpoint: true,
          minPassScore: 80,
          estimatedMinutes: 2,
          scenario:
            'End of the first day. Yamada-sensei hands you a short quiz: “Can you do it again?” No notes. No vocab panel.',
          goal: 'Prove you can give your name, origin, and a basic classroom introduction.',
          vocabulary: [],
          grammar: [],
          examples: [],
          questions: [
            {
              id: 'q-L2-U1-M5-1',
              type: 'sentence-build',
              prompt: 'Build: “I am Emma.”',
              correctAnswer: 'わたし は エマ です'
            },
            {
              id: 'q-L2-U1-M5-2',
              type: 'sentence-build',
              prompt: 'Build: “I came from England.”',
              correctAnswer: 'イギリス からきました'
            },
            {
              id: 'q-L2-U1-M5-3',
              type: 'fill-in-blank',
              prompt: 'わたし ___ がくせいです。',
              correctAnswer: 'は'
            },
            {
              id: 'q-L2-U1-M5-4',
              type: 'context-select',
              prompt: 'Which honorific fits a younger male classmate?',
              options: ['さん', 'くん', 'ちゃん'],
              correctAnswer: 'くん'
            },
            {
              id: 'q-L2-U1-M5-5',
              type: 'translation-en-jp',
              prompt: 'Translate: “She is not a teacher.”',
              correctAnswer: 'かのじょはせんせいじゃないです',
              acceptedAnswers: ['かのじょはせんせいじゃないです。']
            },
            {
              id: 'q-L2-U1-M5-6',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'かれはイギリスじんです。',
              correctAnswer: 'he is english',
              acceptedAnswers: ['he is english.']
            },
            {
              id: 'q-L2-U1-M5-7',
              type: 'fill-in-blank',
              prompt: 'Classmate: 「なまえはなんですか。」 You: ___',
              correctAnswer: 'わたしはエマです',
              acceptedAnswers: ['わたしはエマです。', 'エマです']
            },
            {
              id: 'q-L2-U1-M5-8',
              type: 'sentence-build',
              prompt: 'Build the negative: “I am not Japanese.”',
              correctAnswer: 'わたし は にほんじん じゃないです'
            },
            {
              id: 'q-L2-U1-M5-9',
              type: 'context-select',
              prompt: 'Someone asks 「どこからきましたか。」 You are from England.',
              options: ['イギリスごです', 'イギリスからきました', 'イギリスじゃないです'],
              correctAnswer: 'イギリスからきました'
            },
            {
              id: 'q-L2-U1-M5-10',
              type: 'sentence-build',
              prompt: 'Build the full 3-part intro.',
              correctAnswer: 'はじめまして わたし は エマ です アメリカ からきました よろしくおねがいします'
            }
          ],
          successMessage: 'Unit 2-1 complete — you have made your first impression in Japanese.',
          emotionalFeedback: {
            perfect: 'Yamada-sensei tucks the paper away and gives one small nod. That might be top marks.',
            good: 'Yamada-sensei looks satisfied. Day one ended better than it started.',
            struggle: 'The quiz was rough, but it is over — and you are still standing in Japanese.'
          }
        }
      ]
    },
    {
      id: 'L2-U2',
      title: 'Lunch Table Conversations',
      summary: 'Yuki, Keita, and Sora ask what you do and how old you are, then push you to give a complete self-introduction.',
      prerequisiteUnitIds: ['L2-U1'],
      steps: [
        {
          id: 'L2-U2-M1',
          title: 'What do you do?',
          kind: 'introduce',
          estimatedMinutes: 2,
          scenario:
            'At lunch, Keita leans over and asks, 「しごとはなんですか。」 He wants to know what kind of person you are, not just your name.',
          goal: 'Describe yourself and others with job and role nouns.',
          vocabulary: [v.gakusei, v.sensei, v.kaishain, v.isha, v.enjinia, v.ryuugakusei, v.shigoto, v.nan, v.hajimeteAdverb],
          grammar: [g.jobDesu, g.negativeDesu],
          examples: [
            {
              id: 'ex-L2-U2-M1-1',
              japanese: 'わたしはりゅうがくせいです。',
              romaji: 'Watashi wa ryuugakusei desu.',
              english: 'I am an international student.',
              vocabIds: [v.watashi.id, v.ryuugakusei.id],
              grammarIds: [g.jobDesu.id]
            },
            {
              id: 'ex-L2-U2-M1-2',
              japanese: 'かれはえんじにあです。',
              romaji: 'Kare wa enjinia desu.',
              english: 'He is an engineer.',
              vocabIds: [v.kare.id, v.enjinia.id],
              grammarIds: [g.jobDesu.id]
            },
            {
              id: 'ex-L2-U2-M1-3',
              japanese: 'しごとはなんですか。',
              romaji: 'Shigoto wa nan desu ka.',
              english: 'What is your job?',
              vocabIds: [v.shigoto.id, v.nan.id],
              grammarIds: []
            },
            {
              id: 'ex-L2-U2-M1-4',
              japanese: 'せんせいじゃないです。',
              romaji: 'Sensei janai desu.',
              english: 'Not a teacher.',
              vocabIds: [v.sensei.id],
              grammarIds: [g.negativeDesu.id]
            }
          ],
          branchingChoice: {
            prompt: 'Keita asks: 「しごとはなんですか。」 You are an exchange student. What do you say?',
            options: [
              {
                id: 'a',
                label: 'わたしはがくせいです',
                outcome: 'partial',
                reaction: 'Keita nods, but still looks curious.',
                explanation: 'がくせい is true, but りゅうがくせい is more precise for you.'
              },
              {
                id: 'b',
                label: 'わたしはりゅうがくせいです',
                outcome: 'correct',
                reaction: 'Keita grins: 「おれも！ みんながくせいだよ！」'
              },
              {
                id: 'c',
                label: 'わたしははじめてです',
                outcome: 'wrong',
                reaction: 'Keita blinks. はじめて means “for the first time,” not a job.'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L2-U2-M1-keita',
              title: 'Casual lunch talk',
              turns: [
                {
                  speaker: 'Keita',
                  line: 'しごとはなんですか。',
                  translation: 'What do you do?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'わたしはりゅうがくせいです',
                  acceptedAnswers: ['わたしはりゅうがくせいです。', 'りゅうがくせいです', 'わたしはがくせいです'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Keita',
                  line: 'そうですか！ わたしもがくせいです。',
                  translation: 'Really? I am a student too.',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'そうですか！よろしくおねがいします',
                  acceptedAnswers: ['そうですか！よろしくおねがいします。', 'よろしくおねがいします', 'そうですか'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L2-U2-M1-1',
              type: 'sentence-build',
              prompt: 'Build: “I am an international student.”',
              correctAnswer: 'わたし は りゅうがくせい です'
            },
            {
              id: 'q-L2-U2-M1-2',
              type: 'multiple-choice',
              prompt: 'What is かいしゃいん?',
              options: ['student', 'doctor', 'company employee', 'teacher'],
              correctAnswer: 'company employee',
              targetVocabId: v.kaishain.id
            },
            {
              id: 'q-L2-U2-M1-3',
              type: 'translation-en-jp',
              prompt: 'Translate: “I am a teacher.”',
              correctAnswer: 'わたしはせんせいです',
              acceptedAnswers: ['わたしはせんせいです。', 'せんせいです']
            },
            {
              id: 'q-L2-U2-M1-4',
              type: 'fill-in-blank',
              prompt: 'しごとは ___ ですか。',
              correctAnswer: 'なん'
            },
            {
              id: 'q-L2-U2-M1-5',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'かれはえんじにあじゃないです。',
              correctAnswer: 'he is not an engineer',
              acceptedAnswers: ['he is not an engineer.']
            },
            {
              id: 'q-L2-U2-M1-6',
              type: 'context-select',
              prompt: 'You want to be specific that you are an exchange student.',
              options: ['がくせいです', 'りゅうがくせいです', 'はじめてです'],
              correctAnswer: 'りゅうがくせいです'
            }
          ],
          successMessage: 'You can say what you do — and understand what others do.',
          emotionalFeedback: {
            perfect: 'Keita bumps your arm and laughs. That was your first truly casual Japanese exchange.',
            good: 'Keita keeps the conversation going. You are officially in the group now.',
            struggle: 'You had to work for it, but Keita waited. That matters.'
          }
        },
        {
          id: 'L2-U2-M2',
          title: 'How old are you?',
          kind: 'expand',
          estimatedMinutes: 1,
          scenario:
            'Sora, who has barely spoken, quietly asks, 「なんさいですか。」 The whole table goes still for a second.',
          goal: 'Say your age with さい and recognize the special form はたち.',
          vocabulary: [v.sai, v.hatachi, v.nansai, v.ikutsu, v.juunana, v.juuhachi, v.nijuuichi],
          grammar: [g.ageSai],
          examples: [
            {
              id: 'ex-L2-U2-M2-1',
              japanese: 'わたしはじゅうななさいです。',
              romaji: 'Watashi wa juunana-sai desu.',
              english: 'I am 17 years old.',
              vocabIds: [v.watashi.id, v.juunana.id, v.sai.id],
              grammarIds: [g.ageSai.id]
            },
            {
              id: 'ex-L2-U2-M2-2',
              japanese: 'かれははたちです。',
              romaji: 'Kare wa hatachi desu.',
              english: 'He is 20.',
              vocabIds: [v.kare.id, v.hatachi.id],
              grammarIds: [g.ageSai.id]
            },
            {
              id: 'ex-L2-U2-M2-3',
              japanese: 'なんさいですか。',
              romaji: 'Nan-sai desu ka.',
              english: 'How old are you?',
              vocabIds: [v.nansai.id],
              grammarIds: [g.ageSai.id]
            },
            {
              id: 'ex-L2-U2-M2-4',
              japanese: 'いくつですか。',
              romaji: 'Ikutsu desu ka.',
              english: 'How old? / How many?',
              vocabIds: [v.ikutsu.id],
              grammarIds: []
            }
          ],
          branchingChoice: {
            prompt: 'Sora asks: 「なんさいですか。」 You are 18. What do you say?',
            options: [
              {
                id: 'a',
                label: 'じゅうはちです',
                outcome: 'partial',
                reaction: 'Sora nods slowly, then softly adds: 「じゅうはち…さい？」',
                explanation: 'Add さい after the number when talking about age.'
              },
              {
                id: 'b',
                label: 'わたしははたちです',
                outcome: 'wrong',
                reaction: 'Sora shakes her head a little. はたち means 20 exactly.'
              },
              {
                id: 'c',
                label: 'わたしはじゅうはちさいです',
                outcome: 'correct',
                reaction: 'Sora relaxes and gives a small, real smile.'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L2-U2-M2-sora',
              title: 'Age exchange',
              turns: [
                {
                  speaker: 'Sora',
                  line: 'なんさいですか。',
                  translation: 'How old are you?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'わたしはじゅうはちさいです',
                  acceptedAnswers: ['わたしはじゅうはちさいです。', 'じゅうはちさいです', 'わたしはじゅうななさいです'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Sora',
                  line: 'そうですか。わたしはじゅうしちさいです。',
                  translation: 'I see. I am 17.',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'そうですか！わたしもじゅうはちさいです',
                  acceptedAnswers: ['そうですか！わたしもじゅうはちさいです。', 'わたしはじゅうはちさいです', 'そうですか'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L2-U2-M2-1',
              type: 'translation-en-jp',
              prompt: 'Translate: “I am 21 years old.”',
              correctAnswer: 'わたしはにじゅういちさいです',
              acceptedAnswers: ['わたしはにじゅういちさいです。']
            },
            {
              id: 'q-L2-U2-M2-2',
              type: 'fill-in-blank',
              prompt: 'わたしはにじゅうさん ___ です。',
              correctAnswer: 'さい'
            },
            {
              id: 'q-L2-U2-M2-3',
              type: 'multiple-choice',
              prompt: 'How do you say “20 years old” in Japanese?',
              options: ['にじゅうさい', 'はたち', 'にさい', 'じゅうさい'],
              correctAnswer: 'はたち',
              targetVocabId: v.hatachi.id
            },
            {
              id: 'q-L2-U2-M2-4',
              type: 'sentence-build',
              prompt: 'Build: “I am 17 years old.”',
              correctAnswer: 'わたし は じゅうななさい です'
            },
            {
              id: 'q-L2-U2-M2-5',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'かれははたちです。',
              correctAnswer: 'he is 20 years old',
              acceptedAnswers: ['he is 20 years old.']
            },
            {
              id: 'q-L2-U2-M2-6',
              type: 'context-select',
              prompt: 'A friend asks 「いくつ？」 What are they asking?',
              options: ['your name', 'your country', 'your age'],
              correctAnswer: 'your age'
            }
          ],
          successMessage: 'You can talk about age in Japanese — and Sora finally opened up.',
          emotionalFeedback: {
            perfect: 'Sora nods and smiles. It is quiet, but it lands harder than a cheer.',
            good: 'Sora says a little more than before. That feels important.',
            struggle: 'The answer took time, but Sora waited for it. You think that means something.'
          }
        },
        {
          id: 'L2-U2-M3',
          title: 'Review: Lunch conversation',
          kind: 'review',
          isReviewStep: true,
          estimatedMinutes: 2,
          scenario:
            'Lunch is almost over. Keita’s older sister stops by the table, and the conversation suddenly widens.',
          goal: 'Handle quick exchanges about jobs and age without the vocab panel.',
          vocabulary: [],
          grammar: [],
          examples: [],
          questions: [
            {
              id: 'q-L2-U2-M3-1',
              type: 'fill-in-blank',
              prompt: 'Sister: 「しごとはなんですか。」 You: ___',
              correctAnswer: 'わたしはいしゃです',
              acceptedAnswers: ['わたしはいしゃです。', 'いしゃです']
            },
            {
              id: 'q-L2-U2-M3-2',
              type: 'sentence-build',
              prompt: 'Build: “She is a company employee.”',
              correctAnswer: 'かのじょ は かいしゃいん です'
            },
            {
              id: 'q-L2-U2-M3-3',
              type: 'context-select',
              prompt: 'A friend asks 「いくつ？」 What do they want to know?',
              options: ['your name', 'your country', 'your age'],
              correctAnswer: 'your age'
            },
            {
              id: 'q-L2-U2-M3-4',
              type: 'translation-en-jp',
              prompt: 'Translate: “I am not a doctor.”',
              correctAnswer: 'わたしはいしゃじゃないです',
              acceptedAnswers: ['わたしはいしゃじゃないです。']
            },
            {
              id: 'q-L2-U2-M3-5',
              type: 'sentence-build',
              prompt: 'Build the question: “What is your job?”',
              correctAnswer: 'しごと は なん ですか'
            },
            {
              id: 'q-L2-U2-M3-6',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'かれはえんじにあです。',
              correctAnswer: 'he is an engineer',
              acceptedAnswers: ['he is an engineer.']
            },
            {
              id: 'q-L2-U2-M3-7',
              type: 'fill-in-blank',
              prompt: 'Keita: 「なんさいですか。」 You: わたしは ___ さいです。',
              correctAnswer: 'じゅうはち',
              acceptedAnswers: ['じゅうなな', 'にじゅういち']
            },
            {
              id: 'q-L2-U2-M3-8',
              type: 'context-select',
              prompt: 'Which answer means “I am an exchange student”?',
              options: ['わたしはりゅうがくせいです', 'わたしははじめてです', 'わたしははたちです'],
              correctAnswer: 'わたしはりゅうがくせいです'
            }
          ],
          successMessage: 'Lunchtime done — you held three real conversations.',
          emotionalFeedback: {
            perfect: 'The lunch bell rings, and you realize you spoke to everyone at the table.',
            good: 'Three people, three exchanges, no freeze. That is progress you can feel.',
            struggle: 'It was a lot at once, but you stayed in the lunch conversation until the end.'
          }
        },
        {
          id: 'L2-U2-M4',
          title: 'Complete self-introduction',
          kind: 'produce',
          estimatedMinutes: 2,
          scenario:
            'Yamada-sensei asks for a bulletin-board self-introduction card: name, origin, nationality, role, age, and a closing. Then you read it aloud.',
          goal: 'Produce a complete multi-sentence self-introduction from memory.',
          vocabulary: [],
          grammar: [g.fullSelfIntroFlow, g.ageSai],
          examples: [
            {
              id: 'ex-L2-U2-M4-1',
              japanese: 'はじめまして。わたしはエマです。アメリカからきました。りゅうがくせいです。じゅうはちさいです。よろしくおねがいします。',
              romaji: 'Hajimemashite. Watashi wa Ema desu. Amerika kara kimashita. Ryuugakusei desu. Juuhachi-sai desu. Yoroshiku onegai shimasu.',
              english: 'Nice to meet you. I am Emma. I came from America. I am an exchange student. I am 18. Please take care of me.',
              vocabIds: [v.hajimemashite.id, v.watashi.id, v.amerika.id, v.ryuugakusei.id, v.juuhachi.id, v.yoroshiku.id],
              grammarIds: [g.fullSelfIntroFlow.id, g.ageSai.id]
            }
          ],
          branchingChoice: {
            prompt: 'The bulletin card is blank. Which sentence do you write first?',
            options: [
              {
                id: 'a',
                label: 'よろしくおねがいします',
                outcome: 'wrong',
                reaction: 'That is the closing — but there is nothing to close yet.'
              },
              {
                id: 'b',
                label: 'はじめまして。わたしは___です',
                outcome: 'correct',
                reaction: 'Yamada-sensei nods: 「そうです！」 The rest of the card can flow from there.'
              },
              {
                id: 'c',
                label: '___さいです',
                outcome: 'partial',
                reaction: 'Age comes later. People need your name first.',
                explanation: 'Start with your opening and name, then build outward.'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L2-U2-M4-full-intro',
              title: 'Teacher-prompted full introduction',
              turns: [
                {
                  speaker: 'Yamada-sensei',
                  line: 'はじめまして。なまえはなんですか。',
                  translation: 'Nice to meet you. What is your name?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'わたしはエマです',
                  acceptedAnswers: ['わたしはエマです。', 'はじめまして。わたしはエマです', 'わたしはけんじです'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yamada-sensei',
                  line: 'どこからきましたか。',
                  translation: 'Where did you come from?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'アメリカからきました',
                  acceptedAnswers: ['アメリカからきました。', 'イギリスからきました', 'トルコからきました'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yamada-sensei',
                  line: 'おしごとは？',
                  translation: 'And what do you do?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'りゅうがくせいです',
                  acceptedAnswers: ['りゅうがくせいです。', 'がくせいです'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yamada-sensei',
                  line: 'なんさいですか。',
                  translation: 'How old are you?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'じゅうはちさいです。よろしくおねがいします',
                  acceptedAnswers: ['じゅうはちさいです。よろしくおねがいします。', 'じゅうはちさいです よろしくおねがいします', 'にじゅういちさいです。よろしくおねがいします。'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L2-U2-M4-1',
              type: 'sentence-build',
              prompt: 'Build the opening.',
              correctAnswer: 'はじめまして'
            },
            {
              id: 'q-L2-U2-M4-2',
              type: 'sentence-build',
              prompt: 'Build: “I am Emma.”',
              correctAnswer: 'わたし は エマ です'
            },
            {
              id: 'q-L2-U2-M4-3',
              type: 'sentence-build',
              prompt: 'Build: “I came from America.”',
              correctAnswer: 'アメリカ からきました'
            },
            {
              id: 'q-L2-U2-M4-4',
              type: 'sentence-build',
              prompt: 'Build: “I am an exchange student.”',
              correctAnswer: 'りゅうがくせい です'
            },
            {
              id: 'q-L2-U2-M4-5',
              type: 'sentence-build',
              prompt: 'Build: “I am 18 years old.”',
              correctAnswer: 'じゅうはちさい です'
            },
            {
              id: 'q-L2-U2-M4-6',
              type: 'sentence-build',
              prompt: 'Build the closing.',
              correctAnswer: 'よろしくおねがいします'
            },
            {
              id: 'q-L2-U2-M4-7',
              type: 'translation-en-jp',
              prompt: 'Translate: “Nice to meet you. I am Kenji. I came from England.”',
              correctAnswer: 'はじめまして。わたしはけんじです。イギリスからきました',
              acceptedAnswers: ['はじめまして。わたしはけんじです。イギリスからきました。']
            },
            {
              id: 'q-L2-U2-M4-8',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'はじめまして。わたしはリナです。かんこくからきました。にじゅうさいです。',
              correctAnswer: 'nice to meet you. i am rina. i came from korea. i am 20 years old',
              acceptedAnswers: ['nice to meet you. i am rina. i came from korea. i am 20 years old.']
            },
            {
              id: 'q-L2-U2-M4-9',
              type: 'context-select',
              prompt: 'Your card is finished and classmates clap. The right closing line is:',
              options: ['よろしくおねがいします', 'さようなら', 'おはようございます'],
              correctAnswer: 'よろしくおねがいします'
            }
          ],
          successMessage: 'You gave a complete self-introduction in Japanese — all five sentences.',
          emotionalFeedback: {
            perfect: 'Yuki reads your card and tugs your sleeve, delighted. You are part of the classroom now.',
            good: 'The card sounds like a real person, not a drill. That is the point.',
            struggle: 'It took effort, but by the end the card sounded like you.'
          }
        },
        {
          id: 'L2-U2-M5',
          title: 'Checkpoint: Level 2 Complete',
          kind: 'checkpoint',
          isCheckpoint: true,
          minPassScore: 80,
          estimatedMinutes: 2,
          scenario:
            'Final school-day quiz from Yamada-sensei. Twelve questions. Everything from Level 2. No help.',
          goal: 'Prove you can fully introduce yourself in Japanese.',
          vocabulary: [],
          grammar: [],
          examples: [],
          questions: [
            {
              id: 'q-L2-U2-M5-1',
              type: 'sentence-build',
              prompt: 'Build: “I am Emma.”',
              correctAnswer: 'わたし は エマ です'
            },
            {
              id: 'q-L2-U2-M5-2',
              type: 'sentence-build',
              prompt: 'Build: “I came from America.”',
              correctAnswer: 'アメリカ からきました'
            },
            {
              id: 'q-L2-U2-M5-3',
              type: 'fill-in-blank',
              prompt: 'わたし ___ がくせいです。',
              correctAnswer: 'は'
            },
            {
              id: 'q-L2-U2-M5-4',
              type: 'fill-in-blank',
              prompt: 'わたしはじゅうはち ___ です。',
              correctAnswer: 'さい'
            },
            {
              id: 'q-L2-U2-M5-5',
              type: 'context-select',
              prompt: 'Which honorific fits a younger male classmate?',
              options: ['さん', 'くん', 'ちゃん'],
              correctAnswer: 'くん'
            },
            {
              id: 'q-L2-U2-M5-6',
              type: 'context-select',
              prompt: 'Which line means “I am an exchange student”?',
              options: ['わたしはりゅうがくせいです', 'わたしはいしゃです', 'わたしははじめてです'],
              correctAnswer: 'わたしはりゅうがくせいです'
            },
            {
              id: 'q-L2-U2-M5-7',
              type: 'translation-en-jp',
              prompt: 'Translate: “She is not a teacher.”',
              correctAnswer: 'かのじょはせんせいじゃないです',
              acceptedAnswers: ['かのじょはせんせいじゃないです。']
            },
            {
              id: 'q-L2-U2-M5-8',
              type: 'translation-en-jp',
              prompt: 'Translate: “I am 21 years old.”',
              correctAnswer: 'わたしはにじゅういちさいです',
              acceptedAnswers: ['わたしはにじゅういちさいです。']
            },
            {
              id: 'q-L2-U2-M5-9',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'かれはイギリスじんです。',
              correctAnswer: 'he is english',
              acceptedAnswers: ['he is english.']
            },
            {
              id: 'q-L2-U2-M5-10',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'はじめまして。わたしはリナです。かんこくからきました。',
              correctAnswer: 'nice to meet you. i am rina. i came from korea',
              acceptedAnswers: ['nice to meet you. i am rina. i came from korea.']
            },
            {
              id: 'q-L2-U2-M5-11',
              type: 'sentence-build',
              prompt: 'Build the full self-introduction sequence.',
              correctAnswer: 'はじめまして わたし は エマ です アメリカ からきました りゅうがくせい です じゅうはちさい です よろしくおねがいします'
            },
            {
              id: 'q-L2-U2-M5-12',
              type: 'context-select',
              prompt: 'Someone asks 「どこからきましたか。」 You are from England.',
              options: ['イギリスごです', 'イギリスからきました', 'イギリスじゃないです'],
              correctAnswer: 'イギリスからきました'
            }
          ],
          dialogueChains: [
            {
              id: 'dlg-L2-U2-M5-level-checkpoint',
              title: 'Teacher-prompted final introduction',
              turns: [
                {
                  speaker: 'Yamada-sensei',
                  line: 'なまえはなんですか。',
                  translation: 'What is your name?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'わたしはエマです',
                  acceptedAnswers: ['わたしはエマです。', 'わたしはけんじです'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yamada-sensei',
                  line: 'どこからきましたか。',
                  translation: 'Where did you come from?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'アメリカからきました',
                  acceptedAnswers: ['アメリカからきました。', 'イギリスからきました'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yamada-sensei',
                  line: 'おしごとは？',
                  translation: 'What do you do?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'りゅうがくせいです',
                  acceptedAnswers: ['りゅうがくせいです。', 'がくせいです'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yamada-sensei',
                  line: 'なんさいですか。',
                  translation: 'How old are you?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'じゅうはちさいです。よろしくおねがいします',
                  acceptedAnswers: ['じゅうはちさいです。よろしくおねがいします。', 'にじゅういちさいです。よろしくおねがいします。'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          successMessage: 'Level 2 COMPLETE — you can introduce yourself fully in Japanese. Next: numbers and time.',
          emotionalFeedback: {
            perfect: 'Yamada-sensei sets down her pen. 「よくできました。」 Coming from her, that is everything.',
            good: 'Yamada-sensei looks pleased. The class now knows exactly who you are.',
            struggle: 'It was not perfect, but it was real. You can introduce yourself in Japanese now.'
          }
        }
      ]
    }
  ]
};
