import { Character, KanaGroup, KanaSection } from '../types';

// --- HIRAGANA ---

export const hiraganaSingleMatrix: (Character | null)[][] = [
  // Row 1: a
  [
    { 
      id: 'h-a', 
      symbol: 'あ', 
      label: 'a',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 3,
        strokeGuides: [
          { index: 1, labelX: 72, labelY: 126, arrowFrom: { x: 92, y: 128 }, arrowTo: { x: 128, y: 122 }, color: '#ef4444' },
          { index: 2, labelX: 134, labelY: 52, arrowFrom: { x: 134, y: 70 }, arrowTo: { x: 134, y: 106 }, color: '#3b82f6' },
          { index: 3, labelX: 228, labelY: 108, arrowFrom: { x: 244, y: 118 }, arrowTo: { x: 216, y: 144 }, color: '#10b981' }
        ]
      }
    }, 
    { id: 'h-ka', symbol: 'か', label: 'ka' }, { id: 'h-sa', symbol: 'さ', label: 'sa' }, { id: 'h-ta', symbol: 'た', label: 'ta' }, { id: 'h-na', symbol: 'な', label: 'na' }, { id: 'h-ha', symbol: 'は', label: 'ha' }, { id: 'h-ma', symbol: 'ま', label: 'ma' }, { id: 'h-ya', symbol: 'や', label: 'ya' }, { id: 'h-ra', symbol: 'ら', label: 'ra' }, { id: 'h-wa', symbol: 'わ', label: 'wa' }, null, { id: 'h-ga', symbol: 'が', label: 'ga' }, { id: 'h-za', symbol: 'ざ', label: 'za' }, { id: 'h-da', symbol: 'だ', label: 'da' }, { id: 'h-ba', symbol: 'ば', label: 'ba' }, { id: 'h-pa', symbol: 'ぱ', label: 'pa' }
  ],
  // Row 2: i
  [
    { 
      id: 'h-i', 
      symbol: 'い', 
      label: 'i',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 2,
        strokeGuides: [
          { index: 1, labelX: 52, labelY: 86, arrowFrom: { x: 70, y: 96 }, arrowTo: { x: 70, y: 158 }, color: '#ef4444' },
          { index: 2, labelX: 234, labelY: 88, arrowFrom: { x: 224, y: 98 }, arrowTo: { x: 224, y: 154 }, color: '#3b82f6' }
        ]
      }
    }, 
    { id: 'h-ki', symbol: 'き', label: 'ki' }, { id: 'h-shi', symbol: 'し', label: 'shi' }, { id: 'h-chi', symbol: 'ち', label: 'chi' }, { id: 'h-ni', symbol: 'に', label: 'ni' }, { id: 'h-hi', symbol: 'ひ', label: 'hi' }, { id: 'h-mi', symbol: 'み', label: 'mi' }, null, { id: 'h-ri', symbol: 'り', label: 'ri' }, null, null, { id: 'h-gi', symbol: 'ぎ', label: 'gi' }, { id: 'h-ji', symbol: 'じ', label: 'ji' }, { id: 'h-dji', symbol: 'ぢ', label: 'ji' }, { id: 'h-bi', symbol: 'び', label: 'bi' }, { id: 'h-pi', symbol: 'ぴ', label: 'pi' }
  ],
  // Row 3: u
  [
    { 
      id: 'h-u', 
      symbol: 'う', 
      label: 'u',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 2,
        strokeGuides: [
          { index: 1, labelX: 102, labelY: 34, arrowFrom: { x: 118, y: 40 }, arrowTo: { x: 150, y: 56 }, color: '#ef4444' },
          { index: 2, labelX: 68, labelY: 96, arrowFrom: { x: 86, y: 102 }, arrowTo: { x: 150, y: 114 }, color: '#3b82f6' }
        ]
      }
    }, 
    { id: 'h-ku', symbol: 'く', label: 'ku' }, { id: 'h-su', symbol: 'す', label: 'su' }, { id: 'h-tsu', symbol: 'つ', label: 'tsu' }, { id: 'h-nu', symbol: 'ぬ', label: 'nu' }, { id: 'h-fu', symbol: 'ふ', label: 'fu' }, { id: 'h-mu', symbol: 'む', label: 'mu' }, { id: 'h-yu', symbol: 'ゆ', label: 'yu' }, { id: 'h-ru', symbol: 'る', label: 'ru' }, null, null, { id: 'h-gu', symbol: 'ぐ', label: 'gu' }, { id: 'h-zu', symbol: 'ず', label: 'zu' }, { id: 'h-dzu', symbol: 'づ', label: 'zu' }, { id: 'h-bu', symbol: 'ぶ', label: 'bu' }, { id: 'h-pu', symbol: 'ぷ', label: 'pu' }
  ],
  // Row 4: e
  [
    { 
      id: 'h-e', 
      symbol: 'え', 
      label: 'e',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 2,
        strokeGuides: [
          { index: 1, labelX: 102, labelY: 34, arrowFrom: { x: 118, y: 40 }, arrowTo: { x: 150, y: 58 }, color: '#ef4444' },
          { index: 2, labelX: 68, labelY: 96, arrowFrom: { x: 86, y: 100 }, arrowTo: { x: 154, y: 100 }, color: '#3b82f6' }
        ]
      }
    }, 
    { id: 'h-ke', symbol: 'け', label: 'ke' }, { id: 'h-se', symbol: 'せ', label: 'se' }, { id: 'h-te', symbol: 'て', label: 'te' }, { id: 'h-ne', symbol: 'ね', label: 'ne' }, { id: 'h-he', symbol: 'へ', label: 'he' }, { id: 'h-me', symbol: 'め', label: 'me' }, null, { id: 'h-re', symbol: 'れ', label: 're' }, null, null, { id: 'h-ge', symbol: 'げ', label: 'ge' }, { id: 'h-ze', symbol: 'ぜ', label: 'ze' }, { id: 'h-de', symbol: 'で', label: 'de' }, { id: 'h-be', symbol: 'べ', label: 'be' }, { id: 'h-pe', symbol: 'ぺ', label: 'pe' }
  ],
  // Row 5: o
  [
    { 
      id: 'h-o', 
      symbol: 'お', 
      label: 'o',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 3,
        safeZone: { x: 72, y: 42, width: 156, height: 196 },
        strokeGuides: [
          { index: 1, labelX: 42, labelY: 42, arrowFrom: { x: 58, y: 42 }, arrowTo: { x: 126, y: 42 }, color: '#ef4444' },
          { index: 2, labelX: 92, labelY: 18, arrowFrom: { x: 104, y: 28 }, arrowTo: { x: 104, y: 102 }, color: '#3b82f6' },
          { index: 3, labelX: 228, labelY: 54, arrowFrom: { x: 244, y: 64 }, arrowTo: { x: 264, y: 88 }, color: '#10b981' }
        ]
      }
    }, 
    { id: 'h-ko', symbol: 'こ', label: 'ko' }, { id: 'h-so', symbol: 'そ', label: 'so' }, { id: 'h-to', symbol: 'と', label: 'to' }, { id: 'h-no', symbol: 'の', label: 'no' }, { id: 'h-ho', symbol: 'ほ', label: 'ho' }, { id: 'h-mo', symbol: 'も', label: 'mo' }, { id: 'h-yo', symbol: 'よ', label: 'yo' }, { id: 'h-ro', symbol: 'ろ', label: 'ro' }, { id: 'h-wo', symbol: 'を', label: 'wo' }, { id: 'h-n', symbol: 'ん', label: 'n' }, { id: 'h-go', symbol: 'ご', label: 'go' }, { id: 'h-zo', symbol: 'ぞ', label: 'zo' }, { id: 'h-do', symbol: 'ど', label: 'do' }, { id: 'h-bo', symbol: 'ぼ', label: 'bo' }, { id: 'h-po', symbol: 'ぽ', label: 'po' }
  ]
];

export const hiraganaDoubleMatrix: (Character | null)[][] = [
  // Row 1: ya
  [
    { id: 'h-kya', symbol: 'きゃ', label: 'kya' }, { id: 'h-sha', symbol: 'しゃ', label: 'sha' }, { id: 'h-cha', symbol: 'ちゃ', label: 'cha' }, { id: 'h-nya', symbol: 'にゃ', label: 'nya' }, { id: 'h-hya', symbol: 'ひゃ', label: 'hya' }, { id: 'h-mya', symbol: 'みゃ', label: 'mya' }, { id: 'h-rya', symbol: 'りゃ', label: 'rya' }, { id: 'h-gya', symbol: 'ぎゃ', label: 'gya' }, { id: 'h-ja', symbol: 'じゃ', label: 'ja' }, { id: 'h-bya', symbol: 'びゃ', label: 'bya' }, { id: 'h-pya', symbol: 'ぴゃ', label: 'pya' }
  ],
  // Row 2: yu
  [
    { id: 'h-kyu', symbol: 'きゅ', label: 'kyu' }, { id: 'h-shu', symbol: 'しゅ', label: 'shu' }, { id: 'h-chu', symbol: 'ちゅ', label: 'chu' }, { id: 'h-nyu', symbol: 'にゅ', label: 'nyu' }, { id: 'h-hyu', symbol: 'ひゅ', label: 'hyu' }, { id: 'h-myu', symbol: 'みゅ', label: 'myu' }, { id: 'h-ryu', symbol: 'りゅ', label: 'ryu' }, { id: 'h-gyu', symbol: 'ぎゅ', label: 'gyu' }, { id: 'h-ju', symbol: 'じゅ', label: 'ju' }, { id: 'h-byu', symbol: 'びゅ', label: 'byu' }, { id: 'h-pyu', symbol: 'ぴゅ', label: 'pyu' }
  ],
  // Row 3: yo
  [
    { id: 'h-kyo', symbol: 'きょ', label: 'kyo' }, { id: 'h-sho', symbol: 'しょ', label: 'sho' }, { id: 'h-cho', symbol: 'ちょ', label: 'cho' }, { id: 'h-nyo', symbol: 'にょ', label: 'nyo' }, { id: 'h-hyo', symbol: 'ひょ', label: 'hyo' }, { id: 'h-myo', symbol: 'みょ', label: 'myo' }, { id: 'h-ryo', symbol: 'りょ', label: 'ryo' }, { id: 'h-gyo', symbol: 'ぎょ', label: 'gyo' }, { id: 'h-jo', symbol: 'じょ', label: 'jo' }, { id: 'h-byo', symbol: 'びょ', label: 'byo' }, { id: 'h-pyo', symbol: 'ぴょ', label: 'pyo' }
  ]
];

// --- KATAKANA ---

export const katakanaSingleMatrix: (Character | null)[][] = [
  // Row 1: a
  [
    { 
      id: 'k-a', 
      symbol: 'ア', 
      label: 'a',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 2,
        strokeGuides: [
          { index: 1, labelX: 60, labelY: 58, arrowFrom: { x: 78, y: 52 }, arrowTo: { x: 154, y: 52 }, color: '#ef4444' },
          { index: 2, labelX: 132, labelY: 104, arrowFrom: { x: 142, y: 116 }, arrowTo: { x: 142, y: 184 }, color: '#3b82f6' }
        ]
      }
    }, 
    { id: 'k-ka', symbol: 'カ', label: 'ka' }, { id: 'k-sa', symbol: 'サ', label: 'sa' }, { id: 'k-ta', symbol: 'タ', label: 'ta' }, { id: 'k-na', symbol: 'ナ', label: 'na' }, { id: 'k-ha', symbol: 'ハ', label: 'ha' }, { id: 'k-ma', symbol: 'マ', label: 'ma' }, { id: 'k-ya', symbol: 'ヤ', label: 'ya' }, { id: 'k-ra', symbol: 'ラ', label: 'ra' }, { id: 'k-wa', symbol: 'ワ', label: 'wa' }, null, { id: 'k-ga', symbol: 'ガ', label: 'ga' }, { id: 'k-za', symbol: 'ザ', label: 'za' }, { id: 'k-da', symbol: 'ダ', label: 'da' }, { id: 'k-ba', symbol: 'バ', label: 'ba' }, { id: 'k-pa', symbol: 'パ', label: 'pa' }
  ],
  // Row 2: i
  [
    { 
      id: 'k-i', 
      symbol: 'イ', 
      label: 'i',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 2,
        strokeGuides: [
          { index: 1, labelX: 178, labelY: 36, arrowFrom: { x: 190, y: 46 }, arrowTo: { x: 152, y: 118 }, color: '#ef4444' },
          { index: 2, labelX: 214, labelY: 104, arrowFrom: { x: 224, y: 118 }, arrowTo: { x: 224, y: 196 }, color: '#3b82f6' }
        ]
      }
    }, 
    { id: 'k-ki', symbol: 'キ', label: 'ki' }, { id: 'k-shi', symbol: 'シ', label: 'shi' }, { id: 'k-chi', symbol: 'チ', label: 'chi' }, { id: 'k-ni', symbol: 'ニ', label: 'ni' }, { id: 'k-hi', symbol: 'ヒ', label: 'hi' }, { id: 'k-mi', symbol: 'ミ', label: 'mi' }, null, { id: 'k-ri', symbol: 'リ', label: 'ri' }, null, null, { id: 'k-gi', symbol: 'ギ', label: 'gi' }, { id: 'k-ji', symbol: 'ジ', label: 'ji' }, { id: 'k-dji', symbol: 'ヂ', label: 'ji' }, { id: 'k-bi', symbol: 'ビ', label: 'bi' }, { id: 'k-pi', symbol: 'ピ', label: 'pi' }
  ],
  // Row 3: u
  [
    { 
      id: 'k-u', 
      symbol: 'ウ', 
      label: 'u',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 3,
        strokeGuides: [
          { index: 1, labelX: 138, labelY: 24, arrowFrom: { x: 150, y: 34 }, arrowTo: { x: 150, y: 60 }, color: '#ef4444' },
          { index: 2, labelX: 70, labelY: 92, arrowFrom: { x: 88, y: 96 }, arrowTo: { x: 154, y: 96 }, color: '#3b82f6' },
          { index: 3, labelX: 194, labelY: 122, arrowFrom: { x: 204, y: 136 }, arrowTo: { x: 204, y: 208 }, color: '#10b981' }
        ]
      }
    }, 
    { id: 'k-ku', symbol: 'ク', label: 'ku' }, { id: 'k-su', symbol: 'ス', label: 'su' }, { id: 'k-tsu', symbol: 'ツ', label: 'tsu' }, { id: 'k-nu', symbol: 'ヌ', label: 'nu' }, { id: 'k-fu', symbol: 'フ', label: 'fu' }, { id: 'k-mu', symbol: 'ム', label: 'mu' }, { id: 'k-yu', symbol: 'ユ', label: 'yu' }, { id: 'k-ru', symbol: 'ル', label: 'ru' }, null, null, { id: 'k-gu', symbol: 'グ', label: 'gu' }, { id: 'k-zu', symbol: 'ズ', label: 'zu' }, { id: 'k-dzu', symbol: 'ヅ', label: 'zu' }, { id: 'k-bu', symbol: 'ブ', label: 'bu' }, { id: 'k-pu', symbol: 'プ', label: 'pu' }
  ],
  // Row 4: e
  [
    { 
      id: 'k-e', 
      symbol: 'エ', 
      label: 'e',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 3,
        strokeGuides: [
          { index: 1, labelX: 60, labelY: 56, arrowFrom: { x: 78, y: 50 }, arrowTo: { x: 156, y: 50 }, color: '#ef4444' },
          { index: 2, labelX: 122, labelY: 84, arrowFrom: { x: 132, y: 96 }, arrowTo: { x: 132, y: 176 }, color: '#3b82f6' },
          { index: 3, labelX: 60, labelY: 222, arrowFrom: { x: 80, y: 214 }, arrowTo: { x: 162, y: 214 }, color: '#10b981' }
        ]
      }
    }, 
    { id: 'k-ke', symbol: 'ケ', label: 'ke' }, { id: 'k-se', symbol: 'セ', label: 'se' }, { id: 'k-te', symbol: 'テ', label: 'te' }, { id: 'k-ne', symbol: 'ネ', label: 'ne' }, { id: 'k-he', symbol: 'ヘ', label: 'he' }, { id: 'k-me', symbol: 'メ', label: 'me' }, null, { id: 'k-re', symbol: 'レ', label: 're' }, null, null, { id: 'k-ge', symbol: 'ゲ', label: 'ge' }, { id: 'k-ze', symbol: 'ゼ', label: 'ze' }, { id: 'k-de', symbol: 'デ', label: 'de' }, { id: 'k-be', symbol: 'ベ', label: 'be' }, { id: 'k-pe', symbol: 'ペ', label: 'pe' }
  ],
  // Row 5: o
  [
    { 
      id: 'k-o', 
      symbol: 'オ', 
      label: 'o',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 3,
        safeZone: { x: 78, y: 46, width: 150, height: 188 },
        strokeGuides: [
          { index: 1, labelX: 48, labelY: 46, arrowFrom: { x: 64, y: 46 }, arrowTo: { x: 132, y: 46 }, color: '#ef4444' },
          { index: 2, labelX: 106, labelY: 76, arrowFrom: { x: 118, y: 88 }, arrowTo: { x: 118, y: 158 }, color: '#3b82f6' },
          { index: 3, labelX: 64, labelY: 112, arrowFrom: { x: 80, y: 124 }, arrowTo: { x: 60, y: 170 }, color: '#10b981' }
        ]
      }
    }, 
    { id: 'k-ko', symbol: 'コ', label: 'ko' }, { id: 'k-so', symbol: 'ソ', label: 'so' }, { id: 'k-to', symbol: 'ト', label: 'to' }, { id: 'k-no', symbol: 'ノ', label: 'no' }, { id: 'k-ho', symbol: 'ホ', label: 'ho' }, { id: 'k-mo', symbol: 'モ', label: 'mo' }, { id: 'k-yo', symbol: 'ヨ', label: 'yo' }, { id: 'k-ro', symbol: 'ロ', label: 'ro' }, { id: 'k-wo', symbol: 'ヲ', label: 'wo' }, { id: 'k-n', symbol: 'ン', label: 'n' }, { id: 'k-go', symbol: 'ゴ', label: 'go' }, { id: 'k-zo', symbol: 'ゾ', label: 'zo' }, { id: 'k-do', symbol: 'ド', label: 'do' }, { id: 'k-bo', symbol: 'ボ', label: 'bo' }, { id: 'k-po', symbol: 'ポ', label: 'po' }
  ]
];

export const katakanaDoubleMatrix: (Character | null)[][] = [
  // Row 1: ya
  [
    { id: 'k-kya', symbol: 'キャ', label: 'kya' }, { id: 'k-sha', symbol: 'シャ', label: 'sha' }, { id: 'k-cha', symbol: 'チャ', label: 'cha' }, { id: 'k-nya', symbol: 'ニャ', label: 'nya' }, { id: 'k-hya', symbol: 'ヒャ', label: 'hya' }, { id: 'k-mya', symbol: 'ミャ', label: 'mya' }, { id: 'k-rya', symbol: 'リャ', label: 'rya' }, { id: 'k-gya', symbol: 'ギャ', label: 'gya' }, { id: 'k-ja', symbol: 'ジャ', label: 'ja' }, { id: 'k-bya', symbol: 'ビャ', label: 'bya' }, { id: 'k-pya', symbol: 'ピャ', label: 'pya' }
  ],
  // Row 2: yu
  [
    { id: 'k-kyu', symbol: 'キュ', label: 'kyu' }, { id: 'k-shu', symbol: 'シュ', label: 'shu' }, { id: 'k-chu', symbol: 'チュ', label: 'chu' }, { id: 'k-nyu', symbol: 'ニュ', label: 'nyu' }, { id: 'k-hyu', symbol: 'ヒュ', label: 'hyu' }, { id: 'k-myu', symbol: 'ミュ', label: 'myu' }, { id: 'k-ryu', symbol: 'リュ', label: 'ryu' }, { id: 'k-gyu', symbol: 'ギュ', label: 'gyu' }, { id: 'k-ju', symbol: 'ジュ', label: 'ju' }, { id: 'k-byu', symbol: 'ビュ', label: 'byu' }, { id: 'k-pyu', symbol: 'ピュ', label: 'pyu' }
  ],
  // Row 3: yo
  [
    { id: 'k-kyo', symbol: 'キョ', label: 'kyo' }, { id: 'k-sho', symbol: 'ショ', label: 'sho' }, { id: 'k-cho', symbol: 'チョ', label: 'cho' }, { id: 'k-nyo', symbol: 'ニョ', label: 'nyo' }, { id: 'k-hyo', symbol: 'ヒョ', label: 'hyo' }, { id: 'k-myo', symbol: 'ミョ', label: 'myo' }, { id: 'k-ryo', symbol: 'リョ', label: 'ryo' }, { id: 'k-gyo', symbol: 'ギョ', label: 'gyo' }, { id: 'k-jo', symbol: 'ジョ', label: 'jo' }, { id: 'k-byo', symbol: 'ビョ', label: 'byo' }, { id: 'k-pyo', symbol: 'ピョ', label: 'pyo' }
  ]
];

export const katakanaExtendedMatrix: (Character | null)[][] = [
  // Row 1: a
  [ { id: 'k-fa', symbol: 'ファ', label: 'fa' }, { id: 'k-va', symbol: 'ヴァ', label: 'va' }, { id: 'k-tsa', symbol: 'ツァ', label: 'tsa' }, null, null, null ],
  // Row 2: i
  [ { id: 'k-fi', symbol: 'フィ', label: 'fi' }, { id: 'k-vi', symbol: 'ヴィ', label: 'vi' }, { id: 'k-tsi', symbol: 'ツィ', label: 'tsi' }, { id: 'k-ti', symbol: 'ティ', label: 'ti' }, { id: 'k-di', symbol: 'ディ', label: 'di' }, null ],
  // Row 3: u
  [ null, { id: 'k-vu', symbol: 'ヴ', label: 'vu' }, null, { id: 'k-tu', symbol: 'トゥ', label: 'tu' }, { id: 'k-du', symbol: 'ドゥ', label: 'du' }, null ],
  // Row 4: e
  [ { id: 'k-fe', symbol: 'フェ', label: 'fe' }, { id: 'k-ve', symbol: 'ヴェ', label: 've' }, { id: 'k-tse', symbol: 'ツェ', label: 'tse' }, { id: 'k-che', symbol: 'チェ', label: 'che' }, { id: 'k-she', symbol: 'シェ', label: 'she' }, { id: 'k-je', symbol: 'ジェ', label: 'je' } ],
  // Row 5: o
  [ { id: 'k-fo', symbol: 'フォ', label: 'fo' }, { id: 'k-vo', symbol: 'ヴォ', label: 'vo' }, { id: 'k-tso', symbol: 'ツォ', label: 'tso' }, null, null, null ]
];

// --- SECTIONS FOR STUDY MODE ---

function getCol(matrix: (Character | null)[][], colIndex: number, id: string, label: string): KanaGroup {
  return {
    id,
    label,
    characters: matrix.map(row => row[colIndex]).filter((c): c is Character => c !== null)
  };
}

export const hiraganaSections: KanaSection[] = [
  {
    id: 'hiragana-single',
    title: 'Single Characters',
    description: 'The basic Japanese phonetic script, used for native Japanese words.',
    matrix: hiraganaSingleMatrix,
    columnGroupIds: ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n', 'ga', 'za', 'da', 'ba', 'pa'],
    groups: [
      getCol(hiraganaSingleMatrix, 0, 'a', 'A Column'),
      getCol(hiraganaSingleMatrix, 1, 'ka', 'Ka Column'),
      getCol(hiraganaSingleMatrix, 2, 'sa', 'Sa Column'),
      getCol(hiraganaSingleMatrix, 3, 'ta', 'Ta Column'),
      getCol(hiraganaSingleMatrix, 4, 'na', 'Na Column'),
      getCol(hiraganaSingleMatrix, 5, 'ha', 'Ha Column'),
      getCol(hiraganaSingleMatrix, 6, 'ma', 'Ma Column'),
      getCol(hiraganaSingleMatrix, 7, 'ya', 'Ya Column'),
      getCol(hiraganaSingleMatrix, 8, 'ra', 'Ra Column'),
      getCol(hiraganaSingleMatrix, 9, 'wa', 'Wa Column'),
      getCol(hiraganaSingleMatrix, 10, 'n', 'N Column'),
      getCol(hiraganaSingleMatrix, 11, 'ga', 'Ga Column'),
      getCol(hiraganaSingleMatrix, 12, 'za', 'Za Column'),
      getCol(hiraganaSingleMatrix, 13, 'da', 'Da Column'),
      getCol(hiraganaSingleMatrix, 14, 'ba', 'Ba Column'),
      getCol(hiraganaSingleMatrix, 15, 'pa', 'Pa Column'),
    ]
  },
  {
    id: 'hiragana-double',
    title: 'Double Characters',
    description: 'Combinations of characters with ya, yu, yo.',
    matrix: hiraganaDoubleMatrix,
    columnGroupIds: ['kya', 'sha', 'cha', 'nya', 'hya', 'mya', 'rya', 'gya', 'ja', 'bya', 'pya'],
    groups: [
      getCol(hiraganaDoubleMatrix, 0, 'kya', 'Kya Column'),
      getCol(hiraganaDoubleMatrix, 1, 'sha', 'Sha Column'),
      getCol(hiraganaDoubleMatrix, 2, 'cha', 'Cha Column'),
      getCol(hiraganaDoubleMatrix, 3, 'nya', 'Nya Column'),
      getCol(hiraganaDoubleMatrix, 4, 'hya', 'Hya Column'),
      getCol(hiraganaDoubleMatrix, 5, 'mya', 'Mya Column'),
      getCol(hiraganaDoubleMatrix, 6, 'rya', 'Rya Column'),
      getCol(hiraganaDoubleMatrix, 7, 'gya', 'Gya Column'),
      getCol(hiraganaDoubleMatrix, 8, 'ja', 'Ja Column'),
      getCol(hiraganaDoubleMatrix, 9, 'bya', 'Bya Column'),
      getCol(hiraganaDoubleMatrix, 10, 'pya', 'Pya Column'),
    ]
  }
];

export const katakanaSections: KanaSection[] = [
  {
    id: 'katakana-single',
    title: 'Single Characters',
    description: 'Used primarily for foreign loanwords, onomatopoeia, and emphasis.',
    matrix: katakanaSingleMatrix,
    columnGroupIds: ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n', 'ga', 'za', 'da', 'ba', 'pa'],
    groups: [
      getCol(katakanaSingleMatrix, 0, 'a', 'A Column'),
      getCol(katakanaSingleMatrix, 1, 'ka', 'Ka Column'),
      getCol(katakanaSingleMatrix, 2, 'sa', 'Sa Column'),
      getCol(katakanaSingleMatrix, 3, 'ta', 'Ta Column'),
      getCol(katakanaSingleMatrix, 4, 'na', 'Na Column'),
      getCol(katakanaSingleMatrix, 5, 'ha', 'Ha Column'),
      getCol(katakanaSingleMatrix, 6, 'ma', 'Ma Column'),
      getCol(katakanaSingleMatrix, 7, 'ya', 'Ya Column'),
      getCol(katakanaSingleMatrix, 8, 'ra', 'Ra Column'),
      getCol(katakanaSingleMatrix, 9, 'wa', 'Wa Column'),
      getCol(katakanaSingleMatrix, 10, 'n', 'N Column'),
      getCol(katakanaSingleMatrix, 11, 'ga', 'Ga Column'),
      getCol(katakanaSingleMatrix, 12, 'za', 'Za Column'),
      getCol(katakanaSingleMatrix, 13, 'da', 'Da Column'),
      getCol(katakanaSingleMatrix, 14, 'ba', 'Ba Column'),
      getCol(katakanaSingleMatrix, 15, 'pa', 'Pa Column'),
    ]
  },
  {
    id: 'katakana-double',
    title: 'Double Characters',
    description: 'Combinations of characters with ya, yu, yo.',
    matrix: katakanaDoubleMatrix,
    columnGroupIds: ['kya', 'sha', 'cha', 'nya', 'hya', 'mya', 'rya', 'gya', 'ja', 'bya', 'pya'],
    groups: [
      getCol(katakanaDoubleMatrix, 0, 'kya', 'Kya Column'),
      getCol(katakanaDoubleMatrix, 1, 'sha', 'Sha Column'),
      getCol(katakanaDoubleMatrix, 2, 'cha', 'Cha Column'),
      getCol(katakanaDoubleMatrix, 3, 'nya', 'Nya Column'),
      getCol(katakanaDoubleMatrix, 4, 'hya', 'Hya Column'),
      getCol(katakanaDoubleMatrix, 5, 'mya', 'Mya Column'),
      getCol(katakanaDoubleMatrix, 6, 'rya', 'Rya Column'),
      getCol(katakanaDoubleMatrix, 7, 'gya', 'Gya Column'),
      getCol(katakanaDoubleMatrix, 8, 'ja', 'Ja Column'),
      getCol(katakanaDoubleMatrix, 9, 'bya', 'Bya Column'),
      getCol(katakanaDoubleMatrix, 10, 'pya', 'Pya Column'),
    ]
  },
  {
    id: 'katakana-extended',
    title: 'Extended Characters',
    description: 'Modern additions for more accurate foreign sound representation.',
    matrix: katakanaExtendedMatrix,
    columnGroupIds: ['fa', 'va', 'tsa', 'ti', 'di', 'je'],
    groups: [
      getCol(katakanaExtendedMatrix, 0, 'fa', 'F- Group'),
      getCol(katakanaExtendedMatrix, 1, 'va', 'V- Group'),
      getCol(katakanaExtendedMatrix, 2, 'tsa', 'Ts- Group'),
      getCol(katakanaExtendedMatrix, 3, 'ti', 'T/Ch Group'),
      getCol(katakanaExtendedMatrix, 4, 'di', 'D/Sh Group'),
      getCol(katakanaExtendedMatrix, 5, 'je', 'J Group'),
    ]
  }
];
