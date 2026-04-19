import { GrammarPoint, JLearnLevel, VocabItem } from './jlearnTypes';

const v = {
  ichi: {
    id: 'v3-ichi',
    japanese: 'いち',
    romaji: 'ichi',
    english: '1',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  ni: {
    id: 'v3-ni',
    japanese: 'に',
    romaji: 'ni',
    english: '2',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  san: {
    id: 'v3-san',
    japanese: 'さん',
    romaji: 'san',
    english: '3',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  yon: {
    id: 'v3-yon',
    japanese: 'よん / し',
    romaji: 'yon / shi',
    english: '4',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  go: {
    id: 'v3-go',
    japanese: 'ご',
    romaji: 'go',
    english: '5',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  roku: {
    id: 'v3-roku',
    japanese: 'ろく',
    romaji: 'roku',
    english: '6',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  nana: {
    id: 'v3-nana',
    japanese: 'なな / しち',
    romaji: 'nana / shichi',
    english: '7',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  hachi: {
    id: 'v3-hachi',
    japanese: 'はち',
    romaji: 'hachi',
    english: '8',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  kyuu: {
    id: 'v3-kyuu',
    japanese: 'きゅう / く',
    romaji: 'kyuu / ku',
    english: '9',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  juu: {
    id: 'v3-juu',
    japanese: 'じゅう',
    romaji: 'juu',
    english: '10',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  ikutsu: {
    id: 'v3-ikutsu',
    japanese: 'いくつ',
    romaji: 'ikutsu',
    english: 'how many',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  juuichi: {
    id: 'v3-juuichi',
    japanese: 'じゅういち',
    romaji: 'juuichi',
    english: '11',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  juuni: {
    id: 'v3-juuni',
    japanese: 'じゅうに',
    romaji: 'juuni',
    english: '12',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  nijuu: {
    id: 'v3-nijuu',
    japanese: 'にじゅう',
    romaji: 'nijuu',
    english: '20',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  sanjuu: {
    id: 'v3-sanjuu',
    japanese: 'さんじゅう',
    romaji: 'sanjuu',
    english: '30',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  gojuu: {
    id: 'v3-gojuu',
    japanese: 'ごじゅう',
    romaji: 'gojuu',
    english: '50',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  hyaku: {
    id: 'v3-hyaku',
    japanese: 'ひゃく',
    romaji: 'hyaku',
    english: '100',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  nihyaku: {
    id: 'v3-nihyaku',
    japanese: 'にひゃく',
    romaji: 'nihyaku',
    english: '200',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  en: {
    id: 'v3-en',
    japanese: 'えん',
    romaji: 'en',
    english: 'yen',
    partOfSpeech: 'counter',
    jlptLevel: 'N5'
  },
  ikura: {
    id: 'v3-ikura',
    japanese: 'いくら',
    romaji: 'ikura',
    english: 'how much',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  sumimasen: {
    id: 'v3-sumimasen',
    japanese: 'すみません',
    romaji: 'sumimasen',
    english: 'excuse me',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  arigatouGozaimasu: {
    id: 'v3-arigatou-gozaimasu',
    japanese: 'ありがとうございます',
    romaji: 'arigatou gozaimasu',
    english: 'thank you (formal)',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  ji: {
    id: 'v3-ji',
    japanese: 'じ',
    romaji: 'ji',
    english: "o'clock",
    partOfSpeech: 'counter',
    jlptLevel: 'N5'
  },
  nanji: {
    id: 'v3-nanji',
    japanese: 'なんじ',
    romaji: 'nanji',
    english: 'what time',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  gozen: {
    id: 'v3-gozen',
    japanese: 'ごぜん',
    romaji: 'gozen',
    english: 'AM',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  gogo: {
    id: 'v3-gogo',
    japanese: 'ごご',
    romaji: 'gogo',
    english: 'PM',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  ima: {
    id: 'v3-ima',
    japanese: 'いま',
    romaji: 'ima',
    english: 'now',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  tokei: {
    id: 'v3-tokei',
    japanese: 'とけい',
    romaji: 'tokei',
    english: 'clock / watch',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  asa: {
    id: 'v3-asa',
    japanese: 'あさ',
    romaji: 'asa',
    english: 'morning',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  yoru: {
    id: 'v3-yoru',
    japanese: 'よる',
    romaji: 'yoru',
    english: 'evening / night',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  fun: {
    id: 'v3-fun',
    japanese: 'ふん / ぷん',
    romaji: 'fun / pun',
    english: 'minutes',
    partOfSpeech: 'counter',
    jlptLevel: 'N5'
  },
  han: {
    id: 'v3-han',
    japanese: 'はん',
    romaji: 'han',
    english: 'half past',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  nanpun: {
    id: 'v3-nanpun',
    japanese: 'なんぷん',
    romaji: 'nanpun',
    english: 'how many minutes',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  juppun: {
    id: 'v3-juppun',
    japanese: 'じゅっぷん',
    romaji: 'juppun',
    english: '10 minutes',
    partOfSpeech: 'counter',
    jlptLevel: 'N5'
  },
  gofun: {
    id: 'v3-gofun',
    japanese: 'ごふん',
    romaji: 'gofun',
    english: '5 minutes',
    partOfSpeech: 'counter',
    jlptLevel: 'N5'
  },
  nijuppun: {
    id: 'v3-nijuppun',
    japanese: 'にじゅっぷん',
    romaji: 'nijuppun',
    english: '20 minutes',
    partOfSpeech: 'counter',
    jlptLevel: 'N5'
  },
  choudo: {
    id: 'v3-choudo',
    japanese: 'ちょうど',
    romaji: 'choudo',
    english: 'exactly',
    partOfSpeech: 'adverb',
    jlptLevel: 'N5'
  },
  goro: {
    id: 'v3-goro',
    japanese: 'ごろ',
    romaji: 'goro',
    english: 'around / about',
    partOfSpeech: 'suffix',
    jlptLevel: 'N5'
  },
  getsuyoubi: {
    id: 'v3-getsuyoubi',
    japanese: 'げつようび',
    romaji: 'getsuyoubi',
    english: 'Monday',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  kayoubi: {
    id: 'v3-kayoubi',
    japanese: 'かようび',
    romaji: 'kayoubi',
    english: 'Tuesday',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  suiyoubi: {
    id: 'v3-suiyoubi',
    japanese: 'すいようび',
    romaji: 'suiyoubi',
    english: 'Wednesday',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  mokuyoubi: {
    id: 'v3-mokuyoubi',
    japanese: 'もくようび',
    romaji: 'mokuyoubi',
    english: 'Thursday',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  kinyoubi: {
    id: 'v3-kinyoubi',
    japanese: 'きんようび',
    romaji: 'kinyoubi',
    english: 'Friday',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  doyoubi: {
    id: 'v3-doyoubi',
    japanese: 'どようび',
    romaji: 'doyoubi',
    english: 'Saturday',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  nichiyoubi: {
    id: 'v3-nichiyoubi',
    japanese: 'にちようび',
    romaji: 'nichiyoubi',
    english: 'Sunday',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  kyou: {
    id: 'v3-kyou',
    japanese: 'きょう',
    romaji: 'kyou',
    english: 'today',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  ashita: {
    id: 'v3-ashita',
    japanese: 'あした',
    romaji: 'ashita',
    english: 'tomorrow',
    partOfSpeech: 'noun',
    jlptLevel: 'N5'
  },
  nanyoubi: {
    id: 'v3-nanyoubi',
    japanese: 'なんようび',
    romaji: 'nanyoubi',
    english: 'what day',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  wakarimashita: {
    id: 'v3-wakarimashita',
    japanese: 'わかりました',
    romaji: 'wakarimashita',
    english: 'got it / understood',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  tanoshiminiShiteru: {
    id: 'v3-tanoshimini-shiteru',
    japanese: 'たのしみにしてる',
    romaji: 'tanoshimi ni shiteru',
    english: 'I am looking forward to it',
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  },
  hayaiDesuNe: {
    id: 'v3-hayai-desu-ne',
    japanese: 'はやいですね',
    romaji: 'hayai desu ne',
    english: "that's early",
    partOfSpeech: 'expression',
    jlptLevel: 'N5'
  }
} satisfies Record<string, VocabItem>;

const g = {
  countingDesu: {
    id: 'g3-counting-desu',
    pattern: '[number] です',
    explanation: 'When the vendor asks how many, answer with the number and finish with です.',
    structure: 'いくつですか → [number] です',
    examples: ['さんです。', 'ごです。'],
    source: 'custom',
    jlptLevel: 'N5'
  },
  priceBuilding: {
    id: 'g3-price-building',
    pattern: 'じゅう / ひゃく + えん',
    explanation: 'Build bigger numbers by stacking parts, then add えん for the price.',
    structure: '[number parts] + えん',
    examples: ['ひゃくえん', 'にひゃくごじゅうえん'],
    source: 'custom',
    jlptLevel: 'N5'
  },
  askingPrice: {
    id: 'g3-asking-price',
    pattern: 'いくらですか',
    explanation: 'Use いくらですか when you want to know the price.',
    structure: 'いくら ですか',
    examples: ['いくらですか。'],
    source: 'genki1',
    jlptLevel: 'N5'
  },
  shoppingFlow: {
    id: 'g3-shopping-flow',
    pattern: 'すみません → いくらですか → ___ください → ありがとうございます',
    explanation: 'Get attention first, ask the price, order, then thank the vendor.',
    structure: 'opener → price → order → thanks',
    examples: ['すみません。りんごはいくらですか。みっつください。ありがとうございます。'],
    source: 'custom',
    jlptLevel: 'N5'
  },
  timeJiDesu: {
    id: 'g3-time-ji-desu',
    pattern: '[hour]じです / ごぜん / ごご',
    explanation: 'Put じ after the hour, and add ごぜん or ごご before it when you want AM or PM.',
    structure: '[ごぜん / ごご] + [number]じ + です',
    examples: ['さんじです。', 'ごごしちじです。'],
    source: 'custom',
    jlptLevel: 'N5'
  },
  minutesHanGoro: {
    id: 'g3-minutes-han-goro',
    pattern: '[hour]じ + [minutes] / はん / ごろ / ちょうど',
    explanation: 'Use はん for :30, ごろ for around a time, and ちょうど when it is exact.',
    structure: '[hour]じ[minutes] / はん / ごろ / ちょうど[number]じ',
    examples: ['さんじはんです。', 'ごごよじごろです。', 'ちょうどごじです。'],
    source: 'custom',
    jlptLevel: 'N5'
  },
  weekdaysPattern: {
    id: 'g3-weekdays-pattern',
    pattern: '[day]ようび / きょうは ___ です',
    explanation: 'Every weekday ends in ようび, and you can put きょうは or あしたは in front for today or tomorrow.',
    structure: '[きょう / あした] は [day] です',
    examples: ['きょうはすいようびです。', 'あしたはきんようびです。'],
    source: 'custom',
    jlptLevel: 'N5'
  },
  schedulingFlow: {
    id: 'g3-scheduling-flow',
    pattern: '[day] の [time] はどう？ → いいね → confirm',
    explanation: 'When making plans, offer a day and time together, then confirm the final plan clearly.',
    structure: '[day]の[time] はどう？ → confirmation',
    examples: ['どようびのさんじはどう？', 'どようびのよじはんね！'],
    source: 'custom',
    jlptLevel: 'N5'
  }
} satisfies Record<string, GrammarPoint>;

export const jlearnLevel3: JLearnLevel = {
  id: 'JL3',
  title: 'Numbers & Time',
  theme: 'Second week in Japan — shopping, counting, and making your first plans',
  location: 'Train station + Saturday market',
  jlptAlignment: 'N5',
  genkiChapters: [1, 4],
  checkpointUnitId: 'L3-U2',
  badge: {
    id: 'badge-time-keeper',
    name: 'Time Keeper',
    description: 'You can discuss time, dates, and numbers in conversation.'
  },
  units: [
    {
      id: 'L3-U1',
      title: 'Saturday Market',
      summary: 'Yuki takes you to the local market, where numbers turn into real purchases, prices, and fast vendor talk.',
      steps: [
        {
          id: 'L3-U1-M1',
          title: 'Counting at the fruit stall',
          kind: 'introduce',
          estimatedMinutes: 2,
          scenario:
            'Saturday morning. At the first fruit stall, the obaasan smiles and asks, 「いくつですか。」 Yuki nudges you to answer.',
          goal: 'Count 1–10 and tell the vendor how many you want.',
          vocabulary: [v.ichi, v.ni, v.san, v.yon, v.go, v.roku, v.nana, v.hachi, v.kyuu, v.juu, v.ikutsu],
          grammar: [g.countingDesu],
          examples: [
            {
              id: 'ex-L3-U1-M1-1',
              japanese: 'いくつですか。',
              romaji: 'Ikutsu desu ka.',
              english: 'How many?',
              vocabIds: [v.ikutsu.id],
              grammarIds: [g.countingDesu.id]
            },
            {
              id: 'ex-L3-U1-M1-2',
              japanese: 'さんです。',
              romaji: 'San desu.',
              english: 'Three.',
              vocabIds: [v.san.id],
              grammarIds: [g.countingDesu.id]
            },
            {
              id: 'ex-L3-U1-M1-3',
              japanese: 'ごです。',
              romaji: 'Go desu.',
              english: 'Five.',
              vocabIds: [v.go.id],
              grammarIds: [g.countingDesu.id]
            }
          ],
          branchingChoice: {
            prompt: 'Obaasan asks: 「いくつですか。」 You want 3 apples. What do you say?',
            options: [
              {
                id: 'a',
                label: 'さん',
                outcome: 'partial',
                reaction: 'Obaasan smiles and waits a beat longer.',
                explanation: 'The bare number works, but sounds more complete with です.'
              },
              {
                id: 'b',
                label: 'さんです',
                outcome: 'correct',
                reaction: 'Obaasan nods warmly: 「はい、さんですね！」'
              },
              {
                id: 'c',
                label: 'みっつください',
                outcome: 'correct',
                reaction: 'Obaasan beams — that is even more natural, just a little ahead of the lesson.'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L3-U1-M1-fruit-stall',
              title: 'Fruit stall exchange',
              turns: [
                {
                  speaker: 'Obaasan',
                  line: 'いくつですか。',
                  translation: 'How many?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'さんです',
                  acceptedAnswers: ['さんです。', 'みっつください', 'みっつください。'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Obaasan',
                  line: 'はい、さんこですね。ありがとう！',
                  translation: 'Okay, three of them. Thank you!',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'ありがとうございます',
                  acceptedAnswers: ['ありがとうございます。', 'ありがとう'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L3-U1-M1-1',
              type: 'sentence-build',
              prompt: 'Build: “Three.”',
              correctAnswer: 'さん です'
            },
            {
              id: 'q-L3-U1-M1-2',
              type: 'multiple-choice',
              prompt: 'What is なな?',
              options: ['3', '5', '7', '9'],
              correctAnswer: '7',
              targetVocabId: v.nana.id
            },
            {
              id: 'q-L3-U1-M1-3',
              type: 'listening-recognition',
              prompt: 'Listen and choose the number.',
              promptJapanese: 'きゅう',
              options: ['6', '8', '9', '10'],
              correctAnswer: '9',
              targetVocabId: v.kyuu.id
            },
            {
              id: 'q-L3-U1-M1-4',
              type: 'context-select',
              prompt: 'Vendor: 「いくつですか。」 You want 5.',
              options: ['ごです', 'ろくです', 'よんです'],
              correctAnswer: 'ごです',
              targetVocabId: v.go.id
            },
            {
              id: 'q-L3-U1-M1-5',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'はちです。',
              correctAnswer: 'eight',
              acceptedAnswers: ["it's 8", "it's eight", 'eight.']
            },
            {
              id: 'q-L3-U1-M1-6',
              type: 'fill-in-blank',
              prompt: 'Obaasan: 「いくつですか。」 You answer: ___',
              correctAnswer: 'さんです',
              acceptedAnswers: ['さんです。', 'ごです', 'ごです。']
            }
          ],
          successMessage: 'You can count and order in Japanese.',
          emotionalFeedback: {
            perfect: 'Obaasan slips an extra apple into your bag. Yuki saw this coming.',
            good: 'Yuki grins while the vendor bags your fruit. You sounded real.',
            struggle: 'The answer took a second, but it came. The stall kept moving with you.'
          }
        },
        {
          id: 'L3-U1-M2',
          title: 'Prices and bigger numbers',
          kind: 'expand',
          estimatedMinutes: 2,
          scenario:
            'At the next stall, a sign reads 「だいこん 250えん」. The vendor says the price aloud, and now you have to keep up.',
          goal: 'Understand prices 11–100+ and ask how much something costs.',
          vocabulary: [v.juuichi, v.juuni, v.nijuu, v.sanjuu, v.gojuu, v.hyaku, v.nihyaku, v.en, v.ikura],
          grammar: [g.priceBuilding, g.askingPrice],
          examples: [
            {
              id: 'ex-L3-U1-M2-1',
              japanese: 'いくらですか。',
              romaji: 'Ikura desu ka.',
              english: 'How much is it?',
              vocabIds: [v.ikura.id],
              grammarIds: [g.askingPrice.id]
            },
            {
              id: 'ex-L3-U1-M2-2',
              japanese: 'ひゃくえんです。',
              romaji: 'Hyaku en desu.',
              english: 'It is 100 yen.',
              vocabIds: [v.hyaku.id, v.en.id],
              grammarIds: [g.priceBuilding.id]
            },
            {
              id: 'ex-L3-U1-M2-3',
              japanese: 'にじゅうごえんです。',
              romaji: 'Nijuu-go en desu.',
              english: 'It is 25 yen.',
              vocabIds: [v.nijuu.id, v.go.id, v.en.id],
              grammarIds: [g.priceBuilding.id]
            }
          ],
          branchingChoice: {
            prompt: 'You want to ask the price of a cucumber. What do you say?',
            options: [
              {
                id: 'a',
                label: 'いくつですか',
                outcome: 'wrong',
                reaction: 'Obaasan starts holding up fingers instead. That means “how many.”'
              },
              {
                id: 'b',
                label: 'なんですか',
                outcome: 'partial',
                reaction: 'She answers what the item is, not the price.',
                explanation: 'なん asks what it is. いくら asks how much it costs.'
              },
              {
                id: 'c',
                label: 'いくらですか',
                outcome: 'correct',
                reaction: 'Obaasan smiles: 「ひゃくえんです！」'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L3-U1-M2-vegetable-stall',
              title: 'Vegetable stall exchange',
              turns: [
                {
                  speaker: 'Obaasan',
                  line: 'いらっしゃい！',
                  translation: 'Welcome!',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'すみません、いくらですか',
                  acceptedAnswers: ['すみません、いくらですか？', 'すみません。いくらですか。'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Obaasan',
                  line: 'ひゃくえんです。',
                  translation: 'It is 100 yen.',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'はい、ください',
                  acceptedAnswers: ['はい、ください。', 'じゃあ、ふたつください', 'じゃあ、ふたつください。'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L3-U1-M2-1',
              type: 'translation-en-jp',
              prompt: 'Translate: “35”',
              correctAnswer: 'さんじゅうご',
              acceptedAnswers: ['さんじゅうご。']
            },
            {
              id: 'q-L3-U1-M2-2',
              type: 'sentence-build',
              prompt: 'Build: “It is 150 yen.”',
              correctAnswer: 'ひゃく ごじゅう えんです'
            },
            {
              id: 'q-L3-U1-M2-3',
              type: 'fill-in-blank',
              prompt: 'にじゅう ___ = 27',
              correctAnswer: 'なな'
            },
            {
              id: 'q-L3-U1-M2-4',
              type: 'listening-recognition',
              prompt: 'Listen and choose the price.',
              promptJapanese: 'ひゃくごじゅうえん',
              options: ['50 yen', '100 yen', '150 yen', '250 yen'],
              correctAnswer: '150 yen'
            },
            {
              id: 'q-L3-U1-M2-5',
              type: 'context-select',
              prompt: 'You want to know the price. Ask:',
              options: ['いくつですか', 'なんですか', 'いくらですか'],
              correctAnswer: 'いくらですか',
              targetVocabId: v.ikura.id
            },
            {
              id: 'q-L3-U1-M2-6',
              type: 'fill-in-blank',
              prompt: '「ひゃく ___ です。」 Fill the currency word.',
              correctAnswer: 'えん'
            }
          ],
          successMessage: 'You can understand prices and pay in Japanese.',
          emotionalFeedback: {
            perfect: 'Obaasan counts your change out loud, and you catch every number.',
            good: 'The prices stopped sounding like noise. They started sounding useful.',
            struggle: 'The numbers moved fast, but you held onto the important ones.'
          }
        },
        {
          id: 'L3-U1-M3',
          title: 'Review: Three more stalls',
          kind: 'review',
          isReviewStep: true,
          estimatedMinutes: 2,
          scenario:
            'Yuki dares you to handle three more stalls alone while she watches from two steps back.',
          goal: 'Use numbers and prices across fast market interactions without help.',
          vocabulary: [],
          grammar: [],
          examples: [],
          questions: [
            {
              id: 'q-L3-U1-M3-1',
              type: 'fill-in-blank',
              prompt: 'Vendor: 「いくつですか。」 You want 4. → ___',
              correctAnswer: 'よんです',
              acceptedAnswers: ['よんです。']
            },
            {
              id: 'q-L3-U1-M3-2',
              type: 'fill-in-blank',
              prompt: 'Vendor: 「にひゃくえんです。」 You accept. → ___',
              correctAnswer: 'はい、ください',
              acceptedAnswers: ['はい、ください。']
            },
            {
              id: 'q-L3-U1-M3-3',
              type: 'sentence-build',
              prompt: 'Build: “It is 85 yen.”',
              correctAnswer: 'はちじゅう ご えんです'
            },
            {
              id: 'q-L3-U1-M3-4',
              type: 'context-select',
              prompt: 'The sign says 50円. Vendor asks 「いくつ？」 You want 2.',
              options: ['にです', 'にこください', 'ふたつください', 'ごです'],
              correctAnswer: 'ふたつください'
            },
            {
              id: 'q-L3-U1-M3-5',
              type: 'listening-recognition',
              prompt: 'Listen and choose the price.',
              promptJapanese: 'さんびゃくえん',
              options: ['30 yen', '130 yen', '300 yen', '350 yen'],
              correctAnswer: '300 yen'
            },
            {
              id: 'q-L3-U1-M3-6',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'じゅうななです。',
              correctAnswer: "it's 17",
              acceptedAnswers: ['it is 17', '17']
            },
            {
              id: 'q-L3-U1-M3-7',
              type: 'fill-in-blank',
              prompt: 'Yuki: 「いくらだった？」 You: ___',
              correctAnswer: 'にひゃくえんでした',
              acceptedAnswers: ['にひゃくえんでした。', 'ひゃくえんでした']
            }
          ],
          successMessage: 'Your numbers are strong — you can shop alone in Japan now.',
          emotionalFeedback: {
            perfect: 'Yuki claps you on the back. Three stalls, three clean transactions.',
            good: 'Yuki looked impressed even when she tried not to show it.',
            struggle: 'It was a lot of numbers in a row, but you still got through all three stalls.'
          }
        },
        {
          id: 'L3-U1-M4',
          title: 'Full shopping transaction',
          kind: 'produce',
          estimatedMinutes: 2,
          scenario:
            'At the last stall, you want 3 apples and a bag of rice. No hints. Yuki is filming, and the obaasan is waiting.',
          goal: 'Run a full shopping interaction: get attention, ask the price, order, and thank the vendor.',
          vocabulary: [],
          grammar: [g.shoppingFlow],
          examples: [
            {
              id: 'ex-L3-U1-M4-1',
              japanese: 'すみません。りんごはいくらですか。みっつください。ありがとうございます。',
              romaji: 'Sumimasen. Ringo wa ikura desu ka. Mittsu kudasai. Arigatou gozaimasu.',
              english: 'Excuse me. How much are the apples? Three, please. Thank you very much.',
              vocabIds: [v.sumimasen.id, v.ikura.id, v.arigatouGozaimasu.id],
              grammarIds: [g.shoppingFlow.id]
            }
          ],
          branchingChoice: {
            prompt: 'You walk up to the stall. What is your opening line?',
            options: [
              {
                id: 'a',
                label: 'こんにちは！いくらですか？',
                outcome: 'partial',
                reaction: 'Obaasan smiles, but she has no idea which item you mean.',
                explanation: 'You need a natural opener first, then point to the item.'
              },
              {
                id: 'b',
                label: 'すみません！',
                outcome: 'correct',
                reaction: 'Obaasan turns right to you: 「はい、なんですか？」'
              },
              {
                id: 'c',
                label: 'おじゃまします',
                outcome: 'wrong',
                reaction: 'That is for entering a home, not a market stall.'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L3-U1-M4-full-transaction',
              title: 'Full market transaction',
              turns: [
                {
                  speaker: 'You',
                  expectedAnswer: 'すみません',
                  acceptedAnswers: ['すみません！', 'すみません。'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Obaasan',
                  line: 'はい、なんですか。',
                  translation: 'Yes, what is it?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'りんごはいくらですか',
                  acceptedAnswers: ['りんごはいくらですか？', 'すみません、りんごはいくらですか。'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Obaasan',
                  line: 'ひとつひゃくえんです。',
                  translation: 'One is 100 yen.',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'じゃあ、みっつください',
                  acceptedAnswers: ['じゃあ、みっつください。', 'みっつください', 'みっつください。'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Obaasan',
                  line: 'はい、さんびゃくえんです！',
                  translation: 'Okay, that is 300 yen!',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'ありがとうございます',
                  acceptedAnswers: ['ありがとうございます。', 'ありがとう'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L3-U1-M4-1',
              type: 'sentence-build',
              prompt: 'Build the opener.',
              correctAnswer: 'すみません'
            },
            {
              id: 'q-L3-U1-M4-2',
              type: 'sentence-build',
              prompt: 'Build: “How much are the apples?”',
              correctAnswer: 'りんご は いくらですか'
            },
            {
              id: 'q-L3-U1-M4-3',
              type: 'sentence-build',
              prompt: 'Build: “Three, please.”',
              correctAnswer: 'みっつ ください'
            },
            {
              id: 'q-L3-U1-M4-4',
              type: 'translation-en-jp',
              prompt: 'Translate: “How much is it?”',
              correctAnswer: 'いくらですか',
              acceptedAnswers: ['いくらですか。']
            },
            {
              id: 'q-L3-U1-M4-5',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'ひゃくえんです。',
              correctAnswer: "it's 100 yen",
              acceptedAnswers: ['it is 100 yen', '100 yen']
            },
            {
              id: 'q-L3-U1-M4-6',
              type: 'context-select',
              prompt: 'Obaasan hands you change. What do you say?',
              options: ['さようなら', 'ありがとうございます', 'いくらですか'],
              correctAnswer: 'ありがとうございます'
            },
            {
              id: 'q-L3-U1-M4-7',
              type: 'fill-in-blank',
              prompt: '「りんごは ___ ですか。」 Fill the price question.',
              correctAnswer: 'いくら'
            }
          ],
          successMessage: 'You just had a full shopping conversation in Japanese — alone.',
          emotionalFeedback: {
            perfect: 'Yuki lowers her phone and just stares for a second. You sounded local.',
            good: 'Yuki replays the video immediately. She is impressed, and not hiding it.',
            struggle: 'It was not smooth, but it was complete. That is a real market win.'
          }
        },
        {
          id: 'L3-U1-M5',
          title: 'Checkpoint: Unit 3-1',
          kind: 'checkpoint',
          isCheckpoint: true,
          minPassScore: 80,
          estimatedMinutes: 2,
          scenario:
            'On the train home, Yuki quizzes you with 10 fast market questions. No hints. No rescue.',
          goal: 'Prove that numbers and prices stuck after the market.',
          vocabulary: [],
          grammar: [],
          examples: [],
          questions: [
            {
              id: 'q-L3-U1-M5-1',
              type: 'multiple-choice',
              prompt: 'What is なな?',
              options: ['5', '6', '7', '9'],
              correctAnswer: '7'
            },
            {
              id: 'q-L3-U1-M5-2',
              type: 'sentence-build',
              prompt: 'Build: “It is 35 yen.”',
              correctAnswer: 'さんじゅう ご えんです'
            },
            {
              id: 'q-L3-U1-M5-3',
              type: 'fill-in-blank',
              prompt: 'にじゅう ___ (27)',
              correctAnswer: 'なな'
            },
            {
              id: 'q-L3-U1-M5-4',
              type: 'context-select',
              prompt: 'You want to know a price. Say:',
              options: ['いくつですか', 'いくらですか', 'なんですか'],
              correctAnswer: 'いくらですか'
            },
            {
              id: 'q-L3-U1-M5-5',
              type: 'listening-recognition',
              prompt: 'Listen and choose the price.',
              promptJapanese: 'ひゃくごじゅうえん',
              options: ['100', '150', '200', '250'],
              correctAnswer: '150'
            },
            {
              id: 'q-L3-U1-M5-6',
              type: 'translation-en-jp',
              prompt: 'Translate: “It is 8 yen.”',
              correctAnswer: 'はちえんです',
              acceptedAnswers: ['はちえんです。']
            },
            {
              id: 'q-L3-U1-M5-7',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'にひゃくえんです。',
              correctAnswer: "it's 200 yen",
              acceptedAnswers: ['it is 200 yen', '200 yen']
            },
            {
              id: 'q-L3-U1-M5-8',
              type: 'fill-in-blank',
              prompt: 'Vendor: 「いくつですか。」 You want 5. → ___',
              correctAnswer: 'ごです',
              acceptedAnswers: ['ごです。']
            },
            {
              id: 'q-L3-U1-M5-9',
              type: 'sentence-build',
              prompt: 'Build: “Please give me 3.”',
              correctAnswer: 'みっつ ください'
            },
            {
              id: 'q-L3-U1-M5-10',
              type: 'context-select',
              prompt: 'Vendor says 「ひゃくえんです。」 The natural next reply is:',
              options: ['はい、ください', 'いくつですか', 'おじゃまします'],
              correctAnswer: 'はい、ください'
            }
          ],
          dialogueChains: [
            {
              id: 'dlg-L3-U1-M5-train-quiz',
              title: 'Yuki train quiz',
              turns: [
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'りんご、いくつほしい？',
                    2: 'りんご、いくついる？'
                  },
                  translation: 'How many apples do you want?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'さんです',
                  acceptedAnswers: ['さんです。', 'みっつください'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'じゃあ、これ、いくらですか？',
                    2: 'じゃ、これ、いくら？'
                  },
                  translation: 'Then how much is this?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'いくらですか',
                  acceptedAnswers: ['いくらですか。', 'すみません、いくらですか。'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'ひゃくごじゅうえんです！',
                    2: 'ひゃくごじゅうえんだよ！'
                  },
                  translation: 'It is 150 yen!',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'はい、ください',
                  acceptedAnswers: ['はい、ください。', 'ありがとうございます'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          successMessage: 'Unit 3-1 complete — numbers are yours now.',
          emotionalFeedback: {
            perfect: 'Yuki puts her phone away. “Okay, next: time and days.” The train keeps rolling.',
            good: 'Yuki looks satisfied. The market Japanese stuck.',
            struggle: 'The quiz was fast, but you hung onto the numbers all the way home.'
          }
        }
      ]
    },
    {
      id: 'L3-U2',
      title: 'Making Plans',
      summary: 'Back at school, Yuki and Keita turn numbers into time, days, and your first real Japanese outing plan.',
      prerequisiteUnitIds: ['L3-U1'],
      steps: [
        {
          id: 'L3-U2-M1',
          title: 'What time is it?',
          kind: 'introduce',
          estimatedMinutes: 1,
          scenario:
            'Between classes, Yuki asks, 「ねえ、いまなんじ？」 Her phone is dead, and she needs the time right now.',
          goal: 'Say whole-hour times and understand AM/PM.',
          vocabulary: [v.ji, v.nanji, v.gozen, v.gogo, v.ima, v.tokei, v.asa, v.yoru],
          grammar: [g.timeJiDesu],
          examples: [
            {
              id: 'ex-L3-U2-M1-1',
              japanese: 'いまなんじですか。',
              romaji: 'Ima nanji desu ka.',
              english: 'What time is it now?',
              vocabIds: [v.ima.id, v.nanji.id],
              grammarIds: [g.timeJiDesu.id]
            },
            {
              id: 'ex-L3-U2-M1-2',
              japanese: 'ごじです。',
              romaji: 'Go-ji desu.',
              english: "It's 5 o'clock.",
              vocabIds: [v.go.id, v.ji.id],
              grammarIds: [g.timeJiDesu.id]
            },
            {
              id: 'ex-L3-U2-M1-3',
              japanese: 'ごごしちじです。',
              romaji: 'Gogo shichi-ji desu.',
              english: "It's 7 PM.",
              vocabIds: [v.gogo.id, v.nana.id, v.ji.id],
              grammarIds: [g.timeJiDesu.id]
            }
          ],
          branchingChoice: {
            prompt: 'It is 10 AM. Yuki asks 「いまなんじ？」 What do you say?',
            options: [
              {
                id: 'a',
                label: 'じゅうです',
                outcome: 'wrong',
                reaction: 'Yuki laughs: “Ten what?” You need the hour marker.'
              },
              {
                id: 'b',
                label: 'じゅうじです',
                outcome: 'partial',
                reaction: 'Yuki nods, but you could be more specific.',
                explanation: 'The hour is right. Adding ごぜん makes the time clearer.'
              },
              {
                id: 'c',
                label: 'ごぜんじゅうじです',
                outcome: 'correct',
                reaction: 'Yuki claps: 「かんぺき！」'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L3-U2-M1-time-check',
              title: 'Quick hallway time check',
              turns: [
                {
                  speaker: 'Yuki',
                  line: 'いまなんじ？',
                  translation: 'What time is it now?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'ごごさんじです',
                  acceptedAnswers: ['ごごさんじです。', 'さんじです', 'さんじです。'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yuki',
                  line: 'うわ、もう？！',
                  translation: 'Whoa, already?!',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'はい、はやいですね',
                  acceptedAnswers: ['はい、はやいですね。', 'はやいですね', 'はい。'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L3-U2-M1-1',
              type: 'sentence-build',
              prompt: 'Build: “It is 3.”',
              correctAnswer: 'さんじ です'
            },
            {
              id: 'q-L3-U2-M1-2',
              type: 'translation-en-jp',
              prompt: 'Translate: “It is 9 AM.”',
              correctAnswer: 'ごぜんくじです',
              acceptedAnswers: ['ごぜんくじです。']
            },
            {
              id: 'q-L3-U2-M1-3',
              type: 'multiple-choice',
              prompt: 'What does ごぜん mean?',
              options: ['AM', 'PM', 'now', 'evening'],
              correctAnswer: 'AM',
              targetVocabId: v.gozen.id
            },
            {
              id: 'q-L3-U2-M1-4',
              type: 'fill-in-blank',
              prompt: 'いまなん ___ ですか。',
              correctAnswer: 'じ'
            },
            {
              id: 'q-L3-U2-M1-5',
              type: 'context-select',
              prompt: 'It is 8 PM. Say:',
              options: ['ごぜんはちじ', 'ごごはちじ', 'はちじあさ'],
              correctAnswer: 'ごごはちじ'
            },
            {
              id: 'q-L3-U2-M1-6',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'よじです。',
              correctAnswer: "it's 4",
              acceptedAnswers: ['it is 4', "it's 4 o'clock", '4 oclock']
            }
          ],
          successMessage: 'You can tell time in Japanese.',
          emotionalFeedback: {
            perfect: 'Yuki flashes you her dead phone and laughs. You just saved the moment.',
            good: 'You answered fast enough that Yuki did not even have to check elsewhere.',
            struggle: 'The clock words felt new, but the meaning still landed.'
          }
        },
        {
          id: 'L3-U2-M2',
          title: 'Minutes and half past',
          kind: 'expand',
          estimatedMinutes: 2,
          scenario:
            'Yuki opens her calendar and asks what exact time works for Saturday. Whole hours are not enough anymore.',
          goal: 'Say minutes, half past, approximate times, and exact times.',
          vocabulary: [v.fun, v.han, v.nanpun, v.juppun, v.gofun, v.nijuppun, v.choudo, v.goro],
          grammar: [g.minutesHanGoro],
          examples: [
            {
              id: 'ex-L3-U2-M2-1',
              japanese: 'さんじはんです。',
              romaji: 'San-ji han desu.',
              english: "It's 3:30.",
              vocabIds: [v.san.id, v.ji.id, v.han.id],
              grammarIds: [g.minutesHanGoro.id]
            },
            {
              id: 'ex-L3-U2-M2-2',
              japanese: 'にじじゅっぷんです。',
              romaji: 'Ni-ji juppun desu.',
              english: "It's 2:10.",
              vocabIds: [v.ni.id, v.ji.id, v.juppun.id],
              grammarIds: [g.minutesHanGoro.id]
            },
            {
              id: 'ex-L3-U2-M2-3',
              japanese: 'よじごろあいましょう。',
              romaji: 'Yo-ji goro aimashou.',
              english: "Let's meet around 4.",
              vocabIds: [v.yon.id, v.ji.id, v.goro.id],
              grammarIds: [g.minutesHanGoro.id]
            }
          ],
          branchingChoice: {
            prompt: 'Yuki suggests meeting at 2:30. How do you confirm it?',
            options: [
              {
                id: 'a',
                label: 'にじさんじゅうです',
                outcome: 'partial',
                reaction: 'Yuki squints. Technically understandable, but not how people usually say it.',
                explanation: 'Use はん for :30 instead of saying thirty.'
              },
              {
                id: 'b',
                label: 'にじはんです',
                outcome: 'correct',
                reaction: 'Yuki grins: 「そう、にじはん！」'
              },
              {
                id: 'c',
                label: 'にじちょうどです',
                outcome: 'wrong',
                reaction: 'Yuki laughs. ちょうど means exactly 2:00, not 2:30.'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L3-U2-M2-scheduling',
              title: 'Setting an exact time',
              turns: [
                {
                  speaker: 'Yuki',
                  line: 'どようび、なんじにする？',
                  translation: 'What time should we do Saturday?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'さんじはんはどう',
                  acceptedAnswers: ['さんじはんはどう？', 'よじごろはどう？'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yuki',
                  line: 'いいね！じゃあ、さんじはんに。',
                  translation: 'Nice! Then 3:30.',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'うん、またどようびに',
                  acceptedAnswers: ['うん、またどようびに！', 'うん、また土曜日に！'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L3-U2-M2-1',
              type: 'sentence-build',
              prompt: 'Build: “4:30.”',
              correctAnswer: 'よじ はん です'
            },
            {
              id: 'q-L3-U2-M2-2',
              type: 'translation-en-jp',
              prompt: 'Translate: “Around 3 PM.”',
              correctAnswer: 'ごごさんじごろ',
              acceptedAnswers: ['ごごさんじごろ。']
            },
            {
              id: 'q-L3-U2-M2-3',
              type: 'fill-in-blank',
              prompt: 'しちじじゅう ___ です。(7:15)',
              correctAnswer: 'ご'
            },
            {
              id: 'q-L3-U2-M2-4',
              type: 'multiple-choice',
              prompt: 'What does はん mean?',
              options: ['about', 'exactly', 'half past', 'minute'],
              correctAnswer: 'half past'
            },
            {
              id: 'q-L3-U2-M2-5',
              type: 'context-select',
              prompt: 'You want “exactly 5 o’clock.” Say:',
              options: ['ごじごろ', 'ちょうどごじ', 'ごじはん'],
              correctAnswer: 'ちょうどごじ'
            },
            {
              id: 'q-L3-U2-M2-6',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'さんじはんです。',
              correctAnswer: "it's 3:30",
              acceptedAnswers: ['it is 3:30', 'half past 3']
            }
          ],
          successMessage: 'You can schedule an exact time in Japanese.',
          emotionalFeedback: {
            perfect: 'Yuki drops it into her calendar immediately. Your first official Japanese appointment is real.',
            good: 'The time locks into place, and the plan starts feeling real.',
            struggle: 'The minute words were awkward, but by the end both of you knew when to meet.'
          }
        },
        {
          id: 'L3-U2-M3',
          title: 'Days of the week',
          kind: 'review',
          estimatedMinutes: 2,
          scenario:
            'Keita joins in and throws days around fast. Now you need to choose the right day before the plan falls apart.',
          goal: 'Understand and state days of the week while combining them with time.',
          vocabulary: [v.getsuyoubi, v.kayoubi, v.suiyoubi, v.mokuyoubi, v.kinyoubi, v.doyoubi, v.nichiyoubi, v.kyou, v.ashita, v.nanyoubi],
          grammar: [g.weekdaysPattern],
          examples: [
            {
              id: 'ex-L3-U2-M3-1',
              japanese: 'きょうはすいようびです。',
              romaji: 'Kyou wa suiyoubi desu.',
              english: 'Today is Wednesday.',
              vocabIds: [v.kyou.id, v.suiyoubi.id],
              grammarIds: [g.weekdaysPattern.id]
            },
            {
              id: 'ex-L3-U2-M3-2',
              japanese: 'あしたはきんようびです。',
              romaji: 'Ashita wa kinyoubi desu.',
              english: 'Tomorrow is Friday.',
              vocabIds: [v.ashita.id, v.kinyoubi.id],
              grammarIds: [g.weekdaysPattern.id]
            },
            {
              id: 'ex-L3-U2-M3-3',
              japanese: 'どようびにあいましょう。',
              romaji: 'Doyoubi ni aimashou.',
              english: "Let's meet on Saturday.",
              vocabIds: [v.doyoubi.id],
              grammarIds: [g.weekdaysPattern.id]
            }
          ],
          branchingChoice: {
            prompt: 'Keita asks: 「きょうはなんようび？」 It is Wednesday. What do you say?',
            options: [
              {
                id: 'a',
                label: 'すいようびです',
                outcome: 'correct',
                reaction: 'Keita nods: 「そうそう！」'
              },
              {
                id: 'b',
                label: 'もくようびです',
                outcome: 'wrong',
                reaction: 'Keita shakes his head. That is Thursday, not Wednesday.'
              },
              {
                id: 'c',
                label: 'きょうはすいようびです',
                outcome: 'correct',
                reaction: 'Keita grins. Full sentence, nice.'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L3-U2-M3-keita-plan',
              title: 'Finding the right day',
              turns: [
                {
                  speaker: 'Keita',
                  line: 'いつあう？',
                  translation: 'When should we meet?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'どようびはどう',
                  acceptedAnswers: ['どようびはどう？', 'にちようびはどう？'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Keita',
                  line: 'いいね！なんじ？',
                  translation: 'Nice! What time?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'さんじはんはどう',
                  acceptedAnswers: ['さんじはんはどう？', 'ごごよじはどう？'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L3-U2-M3-1',
              type: 'multiple-choice',
              prompt: 'Which is Saturday?',
              options: ['にちようび', 'どようび', 'きんようび'],
              correctAnswer: 'どようび'
            },
            {
              id: 'q-L3-U2-M3-2',
              type: 'translation-en-jp',
              prompt: 'Translate: “Today is Monday.”',
              correctAnswer: 'きょうはげつようびです',
              acceptedAnswers: ['きょうはげつようびです。']
            },
            {
              id: 'q-L3-U2-M3-3',
              type: 'listening-recognition',
              prompt: 'Listen and choose the day.',
              promptJapanese: 'かようび',
              options: ['Monday', 'Tuesday', 'Thursday', 'Sunday'],
              correctAnswer: 'Tuesday'
            },
            {
              id: 'q-L3-U2-M3-4',
              type: 'fill-in-blank',
              prompt: 'あした ___ もくようびです。',
              correctAnswer: 'は'
            },
            {
              id: 'q-L3-U2-M3-5',
              type: 'context-select',
              prompt: 'Yuki says 「にちようびにあいましょう。」 Which day is that?',
              options: ['Saturday', 'Sunday', 'Friday'],
              correctAnswer: 'Sunday'
            },
            {
              id: 'q-L3-U2-M3-6',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'どようびにあいましょう。',
              correctAnswer: "let's meet on saturday",
              acceptedAnswers: ['lets meet on saturday', 'meet on saturday']
            }
          ],
          successMessage: 'You can pick a day and set a plan in Japanese.',
          emotionalFeedback: {
            perfect: 'Your first plan with friends is locked in. It feels absurdly grown-up.',
            good: 'The group chat is suddenly real, and you are fully part of it.',
            struggle: 'The days came fast, but the plan still landed in the right place.'
          }
        },
        {
          id: 'L3-U2-M4',
          title: 'Full scheduling conversation',
          kind: 'produce',
          estimatedMinutes: 2,
          scenario:
            'Yuki and Keita want a cafe on Saturday. You have to negotiate day, time, and confirmation without hints.',
          goal: 'Hold a complete scheduling conversation using day, time, and a final confirmation.',
          vocabulary: [v.wakarimashita, v.tanoshiminiShiteru],
          grammar: [g.schedulingFlow],
          examples: [
            {
              id: 'ex-L3-U2-M4-1',
              japanese: 'どようびのさんじはどう？',
              romaji: 'Doyoubi no sanji wa dou?',
              english: 'How about Saturday at 3?',
              vocabIds: [v.doyoubi.id, v.san.id, v.ji.id],
              grammarIds: [g.schedulingFlow.id]
            },
            {
              id: 'ex-L3-U2-M4-2',
              japanese: 'わかりました。',
              romaji: 'Wakarimashita.',
              english: 'Got it.',
              vocabIds: [v.wakarimashita.id],
              grammarIds: []
            }
          ],
          branchingChoice: {
            prompt: 'Yuki texts: 「いつがいい？」 What is your first reply?',
            options: [
              {
                id: 'a',
                label: 'どようびのさんじはどう？',
                outcome: 'correct',
                reaction: 'Yuki replies instantly: 「いいね！」'
              },
              {
                id: 'b',
                label: 'どようびです',
                outcome: 'partial',
                reaction: 'Yuki asks back: 「じかんは？」',
                explanation: 'Day only is not enough. Offer a time too.'
              },
              {
                id: 'c',
                label: 'さんじです',
                outcome: 'partial',
                reaction: 'Yuki asks: 「なんようび？」',
                explanation: 'Time only is not enough. Give the day as well.'
              }
            ]
          },
          dialogueChains: [
            {
              id: 'dlg-L3-U2-M4-group-plan',
              title: 'Full outing plan',
              turns: [
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'いつがいい？',
                    2: 'いつ空いてる？'
                  },
                  translation: 'When works?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'どようびのさんじはどう',
                  acceptedAnswers: ['どようびのさんじはどう？', 'どようびのよじはどう？'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Keita',
                  line: 'いいね！でも、さんじはちょっと…よじはん？',
                  translation: 'Nice, but 3 is a bit hard... 4:30?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'うん、よじはんでいいよ',
                  acceptedAnswers: ['うん、よじはんでいいよ。', 'よじはんでいいよ'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yuki',
                  line: {
                    0: 'じゃあ、どようびのよじはんね！',
                    2: 'じゃ、どようびのよじはんね！'
                  },
                  translation: 'Okay, Saturday at 4:30 then!',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'うん、たのしみにしてる',
                  acceptedAnswers: ['うん、たのしみにしてる！', 'たのしみにしてる'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-L3-U2-M4-1',
              type: 'sentence-build',
              prompt: 'Build: “Saturday at 3.”',
              correctAnswer: 'どようび の さんじ'
            },
            {
              id: 'q-L3-U2-M4-2',
              type: 'sentence-build',
              prompt: 'Build: “How about 4 PM?”',
              correctAnswer: 'ごご よじ はどう'
            },
            {
              id: 'q-L3-U2-M4-3',
              type: 'translation-en-jp',
              prompt: 'Translate: “Tomorrow is Friday.”',
              correctAnswer: 'あしたはきんようびです',
              acceptedAnswers: ['あしたはきんようびです。']
            },
            {
              id: 'q-L3-U2-M4-4',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'にちようびのちょうどにじにあいましょう。',
              correctAnswer: "let's meet on sunday at exactly 2",
              acceptedAnswers: ['lets meet on sunday at exactly 2', 'meet on sunday at exactly 2']
            },
            {
              id: 'q-L3-U2-M4-5',
              type: 'context-select',
              prompt: 'You want to confirm a plan. Say:',
              options: ['さようなら', 'わかりました', 'いくらですか'],
              correctAnswer: 'わかりました'
            },
            {
              id: 'q-L3-U2-M4-6',
              type: 'context-select',
              prompt: 'The plan is set. Final line:',
              options: ['はじめまして', 'たのしみにしてる', 'ごめんなさい'],
              correctAnswer: 'たのしみにしてる'
            },
            {
              id: 'q-L3-U2-M4-7',
              type: 'fill-in-blank',
              prompt: 'どようびのよじはん ___',
              correctAnswer: 'ね'
            }
          ],
          successMessage: 'You just planned a full outing in Japanese with friends.',
          emotionalFeedback: {
            perfect: 'The group chat lights up with OKs. The whole plan was made in Japanese.',
            good: 'The details settle into place, and nobody switches languages.',
            struggle: 'It took a few turns, but the plan is real and in Japanese.'
          }
        },
        {
          id: 'L3-U2-M5',
          title: 'Checkpoint: Level 3 Complete',
          kind: 'checkpoint',
          isCheckpoint: true,
          minPassScore: 80,
          estimatedMinutes: 2,
          scenario:
            'End of the week. Yamada-sensei gives you a pop quiz on numbers, time, and plans. No help.',
          goal: 'Prove you can shop, tell time, and make plans in Japanese.',
          vocabulary: [],
          grammar: [],
          examples: [],
          questions: [
            {
              id: 'q-L3-U2-M5-1',
              type: 'multiple-choice',
              prompt: 'What is きゅう?',
              options: ['6', '7', '8', '9'],
              correctAnswer: '9'
            },
            {
              id: 'q-L3-U2-M5-2',
              type: 'sentence-build',
              prompt: 'Build: “It is 100 yen.”',
              correctAnswer: 'ひゃく えんです'
            },
            {
              id: 'q-L3-U2-M5-3',
              type: 'translation-en-jp',
              prompt: 'Translate: “It is 4:30 PM.”',
              correctAnswer: 'ごごよじはんです',
              acceptedAnswers: ['ごごよじはんです。']
            },
            {
              id: 'q-L3-U2-M5-4',
              type: 'fill-in-blank',
              prompt: 'にじゅう ___ (25)',
              correctAnswer: 'ご'
            },
            {
              id: 'q-L3-U2-M5-5',
              type: 'context-select',
              prompt: 'You want to know a price.',
              options: ['いくらですか', 'いくつですか', 'なんですか'],
              correctAnswer: 'いくらですか'
            },
            {
              id: 'q-L3-U2-M5-6',
              type: 'translation-jp-en',
              prompt: 'Translate to English.',
              promptJapanese: 'どようびのさんじにあいましょう。',
              correctAnswer: "let's meet saturday at 3",
              acceptedAnswers: ['lets meet saturday at 3', 'meet saturday at 3']
            },
            {
              id: 'q-L3-U2-M5-7',
              type: 'listening-recognition',
              prompt: 'Listen and choose the price.',
              promptJapanese: 'にひゃくごじゅうえん',
              options: ['150 yen', '200 yen', '250 yen', '350 yen'],
              correctAnswer: '250 yen'
            },
            {
              id: 'q-L3-U2-M5-8',
              type: 'multiple-choice',
              prompt: 'Which is Thursday?',
              options: ['すいようび', 'もくようび', 'にちようび', 'きんようび'],
              correctAnswer: 'もくようび'
            },
            {
              id: 'q-L3-U2-M5-9',
              type: 'sentence-build',
              prompt: 'Build: “Around 5 PM.”',
              correctAnswer: 'ごご ごじ ごろ'
            },
            {
              id: 'q-L3-U2-M5-10',
              type: 'fill-in-blank',
              prompt: 'Vendor: 「いくつですか。」 You want 4. → ___',
              correctAnswer: 'よんです',
              acceptedAnswers: ['よんです。']
            },
            {
              id: 'q-L3-U2-M5-11',
              type: 'translation-en-jp',
              prompt: 'Translate: “Today is Wednesday.”',
              correctAnswer: 'きょうはすいようびです',
              acceptedAnswers: ['きょうはすいようびです。']
            },
            {
              id: 'q-L3-U2-M5-12',
              type: 'context-select',
              prompt: 'Yuki says 「いつがいい？」 Your strongest opener is:',
              options: ['どようびのさんじはどう？', 'どようびです', 'さんじです'],
              correctAnswer: 'どようびのさんじはどう？'
            }
          ],
          dialogueChains: [
            {
              id: 'dlg-L3-U2-M5-final-plan',
              title: 'Final scheduling conversation',
              turns: [
                {
                  speaker: 'Yuki',
                  line: 'いつがいい？',
                  translation: 'When works?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'どようびのさんじはどう',
                  acceptedAnswers: ['どようびのさんじはどう？', 'どようびのよじはどう？'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Keita',
                  line: 'いいね！でも、よじはんは？',
                  translation: 'Nice! But what about 4:30?',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'うん、よじはんでいいよ',
                  acceptedAnswers: ['うん、よじはんでいいよ。'],
                  isLearnerTurn: true
                },
                {
                  speaker: 'Yuki',
                  line: 'じゃあ、どようびのよじはんね！',
                  translation: 'Okay, Saturday at 4:30 then!',
                  isLearnerTurn: false
                },
                {
                  speaker: 'You',
                  expectedAnswer: 'うん、たのしみにしてる',
                  acceptedAnswers: ['うん、たのしみにしてる！', 'たのしみにしてる'],
                  isLearnerTurn: true
                }
              ]
            }
          ],
          successMessage: 'Level 3 COMPLETE — you can shop, tell time, and make plans in Japanese.',
          emotionalFeedback: {
            perfect: 'Yamada-sensei hands back the quiz: 「よくできました。」 From her, that means everything.',
            good: 'Yamada-sensei gives a firm approving nod. You earned it.',
            struggle: 'It was a lot at once, but you made it through the full Level 3 range.'
          }
        }
      ]
    }
  ]
};
