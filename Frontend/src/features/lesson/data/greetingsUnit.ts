import type { Lesson, LessonUnit } from '../lessonTypes';

// ── Lesson 1: Temel selamlar ───────────────────────────────────────────────

const lesson1: Lesson = {
  id: 'p1-u1-l1',
  unitId: 'p1-u1',
  title: { tr: 'İlk Selamlar', en: 'First Greetings' },
  estimatedMinutes: 5,
  learnedWords: [
    { japanese: 'こんにちは', romaji: 'konnichiwa', meaning: 'Merhaba' },
    { japanese: 'おはよう', romaji: 'ohayou', meaning: 'Günaydın' },
    { japanese: 'こんばんは', romaji: 'konbanwa', meaning: 'İyi akşamlar' },
    { japanese: 'はじめまして', romaji: 'hajimemashite', meaning: 'Memnun oldum' },
  ],
  exercises: [
    // ── BLOK 1: こんにちは ────────────────────────────────────────────────────

    // 1. TeachCard — önce öğret
    {
      id: 'gr1-tc-1',
      type: 'teach_card',
      difficulty: 'easy',
      skillTags: ['kana', 'listening', 'recognition'],
      progressGain: 3,
      japanese: 'こんにちは',
      romaji: 'konnichiwa',
      meaning: 'Merhaba',
      audioText: 'こんにちは',
      exampleJapanese: 'こんにちは！',
      exampleMeaning: 'Merhaba!',
      usageNote: 'Öğleden sonraya kadar kullanılır.',
    },
    // 2. AudioReinforcement — dinleme
    {
      id: 'gr1-ar-1',
      type: 'audio_reinforcement',
      difficulty: 'easy',
      skillTags: ['listening', 'kana'],
      progressGain: 0,
      japanese: 'こんにちは',
      romaji: 'konnichiwa',
      meaning: 'Merhaba',
      audioText: 'こんにちは',
    },
    // 3. InstantRecognition — ilk test
    {
      id: 'gr1-ir-1',
      type: 'instant_recognition',
      difficulty: 'easy',
      skillTags: ['recognition', 'kana'],
      progressGain: 5,
      japanese: 'こんにちは',
      romaji: 'konnichiwa',
      smartFeedback: 'こんにちは öğleden sonraya kadar kullanılır.',
      options: [
        { label: 'Merhaba', correct: true },
        { label: 'Günaydın', correct: false },
        { label: 'İyi akşamlar', correct: false },
        { label: 'Görüşürüz', correct: false },
      ],
    },

    // ── BLOK 2: おはよう ──────────────────────────────────────────────────────

    // 4. TeachCard — önce öğret
    {
      id: 'gr1-tc-2',
      type: 'teach_card',
      difficulty: 'easy',
      skillTags: ['kana', 'listening', 'recognition'],
      progressGain: 3,
      japanese: 'おはよう',
      romaji: 'ohayou',
      meaning: 'Günaydın',
      audioText: 'おはよう',
      exampleJapanese: 'おはよう！',
      exampleMeaning: 'Günaydın!',
      usageNote: 'Sabah saatlerinde, arkadaş ve aileyle kullanılır.',
    },
    // 5. AudioToKana — sesi duy, kana seç
    {
      id: 'gr1-atk-1',
      type: 'audio_to_kana',
      difficulty: 'easy',
      skillTags: ['listening', 'kana'],
      progressGain: 7,
      audioText: 'おはよう',
      smartFeedback: 'おはよう sabahları kullanılan samimi selamdır.',
      options: [
        { japanese: 'おはよう', correct: true },
        { japanese: 'こんにちは', correct: false },
        { japanese: 'こんばんは', correct: false },
        { japanese: 'はじめまして', correct: false },
      ],
    },
    // 6. VisualContext — sabah sahnesi
    {
      id: 'gr1-vc-1',
      type: 'visual_context',
      difficulty: 'easy',
      skillTags: ['recognition', 'listening'],
      progressGain: 0,
      scene: '🌅',
      npcJapanese: 'おはよう！',
      npcMeaning: 'Günaydın!',
    },

    // ── BLOK 3: こんばんは ────────────────────────────────────────────────────

    // 7. TeachCard — önce öğret
    {
      id: 'gr1-tc-3',
      type: 'teach_card',
      difficulty: 'easy',
      skillTags: ['kana', 'listening', 'recognition'],
      progressGain: 3,
      japanese: 'こんばんは',
      romaji: 'konbanwa',
      meaning: 'İyi akşamlar',
      audioText: 'こんばんは',
      exampleJapanese: 'こんばんは！',
      exampleMeaning: 'İyi akşamlar!',
      usageNote: 'Akşam saatlerinde kullanılır.',
    },
    // 8. AudioToMeaning — sesi duy, anlamı seç
    {
      id: 'gr1-atm-1',
      type: 'audio_to_meaning',
      difficulty: 'easy',
      skillTags: ['listening'],
      progressGain: 7,
      audioText: 'こんばんは',
      japanese: 'こんばんは',
      smartFeedback: 'こんばんは akşam selamıdır.',
      options: [
        { label: 'İyi akşamlar', correct: true },
        { label: 'Günaydın', correct: false },
        { label: 'Merhaba', correct: false },
        { label: 'Görüşürüz', correct: false },
      ],
    },
    // 9. GuidedResponse — NPC selar, kullanıcı yanıt verir
    {
      id: 'gr1-gr-1',
      type: 'guided_response',
      difficulty: 'medium',
      skillTags: ['conversation', 'production'],
      progressGain: 5,
      npcJapanese: 'おはよう！',
      npcMeaning: 'Günaydın!',
      audioText: 'おはよう',
      smartFeedback: 'Sabah selam alınca おはよう ile karşılık ver.',
      options: [
        { japanese: 'おはよう！', correct: true },
        { japanese: 'こんばんは', correct: false },
        { japanese: 'さようなら', correct: false },
      ],
    },

    // ── BLOK 4: はじめまして ──────────────────────────────────────────────────

    // 10. TeachCard — önce öğret
    {
      id: 'gr1-tc-4',
      type: 'teach_card',
      difficulty: 'easy',
      skillTags: ['kana', 'listening', 'recognition'],
      progressGain: 3,
      japanese: 'はじめまして',
      romaji: 'hajimemashite',
      meaning: 'Memnun oldum',
      audioText: 'はじめまして',
      exampleJapanese: 'はじめまして、アリです。',
      exampleMeaning: 'Memnun oldum, ben Ali.',
      usageNote: 'İlk tanışmada söylenir.',
    },
    // 11. VisualContext — tanışma sahnesi
    {
      id: 'gr1-vc-2',
      type: 'visual_context',
      difficulty: 'easy',
      skillTags: ['recognition', 'conversation'],
      progressGain: 0,
      scene: '🤝',
      npcJapanese: 'はじめまして！',
      npcMeaning: 'Memnun oldum!',
    },
    // 12. ConversationChain — kısa selamlaşma
    {
      id: 'gr1-cc-1',
      type: 'conversation_chain',
      difficulty: 'medium',
      skillTags: ['conversation', 'production'],
      progressGain: 12,
      explanation: 'Japonca\'da tanışma sırası: はじめまして → isim → どうぞよろしく',
      turns: [
        {
          speaker: 'npc',
          npcJapanese: 'こんにちは！はじめまして。',
          npcMeaning: 'Merhaba! Memnun oldum.',
          audioText: 'こんにちは、はじめまして',
        },
        {
          speaker: 'user',
          userOptions: [
            { japanese: 'こんにちは！はじめまして。', correct: true },
            { japanese: 'さようなら', correct: false },
            { japanese: 'こんばんは', correct: false },
          ],
        },
        {
          speaker: 'npc',
          npcJapanese: 'おはよう！',
          npcMeaning: 'Günaydın!',
          audioText: 'おはよう',
        },
        {
          speaker: 'user',
          userOptions: [
            { japanese: 'おはよう！', correct: true },
            { japanese: 'こんばんは', correct: false },
            { japanese: 'はじめまして', correct: false },
          ],
        },
      ],
    },

    // ── BLOK 5: Hafif recall ──────────────────────────────────────────────────

    // 13. FastRecall — こんばんは
    {
      id: 'gr1-fr-1',
      type: 'fast_recall',
      difficulty: 'medium',
      skillTags: ['recall', 'kana'],
      progressGain: 6,
      prompt: 'İyi akşamlar',
      answerJapanese: 'こんばんは',
      timerMs: 3800,
      smartFeedback: 'こんばんは = akşam selamı',
      options: [
        { japanese: 'こんばんは', correct: true },
        { japanese: 'おはよう', correct: false },
        { japanese: 'こんにちは', correct: false },
        { japanese: 'はじめまして', correct: false },
      ],
    },
    // 14. FastRecall — はじめまして
    {
      id: 'gr1-fr-2',
      type: 'fast_recall',
      difficulty: 'medium',
      skillTags: ['recall', 'kana'],
      progressGain: 6,
      prompt: 'Memnun oldum (ilk tanışma)',
      answerJapanese: 'はじめまして',
      timerMs: 4200,
      smartFeedback: 'はじめまして = ilk tanışmada söylenir',
      options: [
        { japanese: 'はじめまして', correct: true },
        { japanese: 'こんばんは', correct: false },
        { japanese: 'おはよう', correct: false },
        { japanese: 'ありがとう', correct: false },
      ],
    },
  ],
};

// ── Lesson 2: Vedalaşma + ありがとう ──────────────────────────────────────

const lesson2: Lesson = {
  id: 'p1-u1-l2',
  unitId: 'p1-u1',
  title: { tr: 'Vedalaşma & Teşekkürler', en: 'Farewells & Thanks' },
  estimatedMinutes: 4,
  learnedWords: [
    { japanese: 'さようなら', romaji: 'sayounara', meaning: 'Hoşça kal (resmi)' },
    { japanese: 'じゃあね', romaji: 'jaa ne', meaning: 'Görüşürüz' },
    { japanese: 'ありがとう', romaji: 'arigatou', meaning: 'Teşekkürler' },
    { japanese: 'どういたしまして', romaji: 'douitashimashite', meaning: 'Rica ederim' },
    { japanese: 'ありがとうございます', romaji: 'arigatou gozaimasu', meaning: 'Çok teşekkürler' },
  ],
  exercises: [
    // 1. Instant Recognition — さようなら
    {
      id: 'gr2-ir-1',
      type: 'instant_recognition',
      difficulty: 'easy',
      skillTags: ['recognition', 'kana'],
      progressGain: 5,
      japanese: 'さようなら',
      romaji: 'sayounara',
      options: [
        { label: 'Hoşça kal (resmi)', correct: true },
        { label: 'Merhaba', correct: false },
        { label: 'Teşekkürler', correct: false },
        { label: 'Günaydın', correct: false },
      ],
    },
    // 2. Audio Reinforcement
    {
      id: 'gr2-ar-1',
      type: 'audio_reinforcement',
      difficulty: 'easy',
      skillTags: ['listening', 'kana'],
      progressGain: 0,
      japanese: 'じゃあね',
      romaji: 'jaa ne',
      meaning: 'Görüşürüz (arkadaşça)',
      audioText: 'じゃあね',
    },
    // 3. Instant Recognition — ありがとう
    {
      id: 'gr2-ir-2',
      type: 'instant_recognition',
      difficulty: 'easy',
      skillTags: ['recognition', 'kana'],
      progressGain: 5,
      japanese: 'ありがとう',
      romaji: 'arigatou',
      options: [
        { label: 'Teşekkürler', correct: true },
        { label: 'Özür dilerim', correct: false },
        { label: 'Hoşça kal', correct: false },
        { label: 'Memnun oldum', correct: false },
      ],
    },
    // 4. Kana Recognition — ありがとう
    {
      id: 'gr2-kr-1',
      type: 'kana_recognition',
      difficulty: 'easy',
      skillTags: ['kana', 'recognition'],
      progressGain: 5,
      japanese: 'ありがとう',
      options: [
        { label: 'arigatou', correct: true },
        { label: 'sayounara', correct: false },
        { label: 'sumimasen', correct: false },
        { label: 'douitashimashite', correct: false },
      ],
    },
    // 5. Audio → Kana
    {
      id: 'gr2-atk-1',
      type: 'audio_to_kana',
      difficulty: 'medium',
      skillTags: ['listening', 'kana'],
      progressGain: 7,
      audioText: 'ありがとう',
      options: [
        { japanese: 'ありがとう', correct: true },
        { japanese: 'さようなら', correct: false },
        { japanese: 'どういたしまして', correct: false },
        { japanese: 'じゃあね', correct: false },
      ],
    },
    // 6. NPC Reaction
    {
      id: 'gr2-nr-1',
      type: 'npc_reaction',
      difficulty: 'easy',
      skillTags: ['listening'],
      progressGain: 0,
      message: 'You got it!',
    },
    // 7. Instant Recognition — どういたしまして
    {
      id: 'gr2-ir-3',
      type: 'instant_recognition',
      difficulty: 'medium',
      skillTags: ['recognition', 'kana'],
      progressGain: 5,
      japanese: 'どういたしまして',
      romaji: 'douitashimashite',
      options: [
        { label: 'Rica ederim', correct: true },
        { label: 'Teşekkürler', correct: false },
        { label: 'Özür dilerim', correct: false },
        { label: 'Hoşça kal', correct: false },
      ],
    },
    // 8. Audio → Meaning
    {
      id: 'gr2-atm-1',
      type: 'audio_to_meaning',
      difficulty: 'medium',
      skillTags: ['listening'],
      progressGain: 7,
      audioText: 'どういたしまして',
      japanese: 'どういたしまして',
      options: [
        { label: 'Rica ederim', correct: true },
        { label: 'Teşekkürler', correct: false },
        { label: 'Özür dilerim', correct: false },
        { label: 'Memnun oldum', correct: false },
      ],
    },
    // 9. Fill Blank — particle
    {
      id: 'gr2-fb-1',
      type: 'fill_blank',
      difficulty: 'medium',
      skillTags: ['particle', 'grammar'],
      progressGain: 8,
      sentenceBefore: 'ありがとう',
      sentenceAfter: 'ざいます',
      blankType: 'word',
      explanation: 'ありがとうございます = çok teşekkür ederim (resmi form)',
      smartFeedback: 'ございます kibarlık ekler — resmi ortamlar için.',
      options: [
        { label: 'ご', correct: true },
        { label: 'は', correct: false },
        { label: 'を', correct: false },
        { label: 'が', correct: false },
      ],
    },
    // 10. Guided Response
    {
      id: 'gr2-gr-1',
      type: 'guided_response',
      difficulty: 'medium',
      skillTags: ['conversation', 'production'],
      progressGain: 5,
      npcJapanese: 'ありがとう！',
      npcMeaning: 'Teşekkürler!',
      audioText: 'ありがとう',
      options: [
        { japanese: 'どういたしまして！', correct: true },
        { japanese: 'おはよう！', correct: false },
        { japanese: 'はじめまして！', correct: false },
      ],
    },
    // 11. Token Build
    {
      id: 'gr2-tb-1',
      type: 'token_build',
      difficulty: 'medium',
      skillTags: ['grammar', 'sentence_order', 'production'],
      progressGain: 10,
      prompt: 'Çok teşekkür ederim.',
      answerTokens: ['ありがとう', 'ございます'],
      bankTokens: ['ありがとう', 'ございます', 'さようなら', 'は'],
      explanation: 'ありがとう(teşekkürler) + ございます(kibarlık eki) = resmi teşekkür',
      smartFeedback: 'ございます eklenince daha kibar olur.',
    },
    // 12. NPC Reaction
    {
      id: 'gr2-nr-2',
      type: 'npc_reaction',
      difficulty: 'easy',
      skillTags: ['production'],
      progressGain: 0,
      message: 'Keep going!',
    },
    // 13-14. Fast Recall
    {
      id: 'gr2-fr-1',
      type: 'fast_recall',
      difficulty: 'medium',
      skillTags: ['recall', 'kana'],
      progressGain: 6,
      prompt: 'Teşekkürler',
      answerJapanese: 'ありがとう',
      timerMs: 3000 + 5 * 400,
      options: [
        { japanese: 'ありがとう', correct: true },
        { japanese: 'さようなら', correct: false },
        { japanese: 'じゃあね', correct: false },
        { japanese: 'どういたしまして', correct: false },
      ],
    },
    {
      id: 'gr2-fr-2',
      type: 'fast_recall',
      difficulty: 'medium',
      skillTags: ['recall', 'kana'],
      progressGain: 6,
      prompt: 'Rica ederim',
      answerJapanese: 'どういたしまして',
      timerMs: 3000 + 8 * 400,
      options: [
        { japanese: 'どういたしまして', correct: true },
        { japanese: 'ありがとう', correct: false },
        { japanese: 'すみません', correct: false },
        { japanese: 'こんにちは', correct: false },
      ],
    },
  ],
};

// ── Lesson 3: Konuşma pratiği ──────────────────────────────────────────────

const lesson3: Lesson = {
  id: 'p1-u1-l3',
  unitId: 'p1-u1',
  title: { tr: 'Konuşma Pratiği', en: 'Conversation Practice' },
  estimatedMinutes: 5,
  learnedWords: [
    { japanese: 'おはようございます', romaji: 'ohayou gozaimasu', meaning: 'Günaydın (resmi)' },
    { japanese: 'よろしくおねがいします', romaji: 'yoroshiku onegaishimasu', meaning: 'Çok memnun oldum' },
    { japanese: 'みず', romaji: 'mizu', meaning: 'Su' },
    { japanese: 'を', romaji: 'wo', meaning: 'Nesne particle\'ı' },
    { japanese: 'のみます', romaji: 'nomimasu', meaning: 'İçerim' },
    { japanese: 'は', romaji: 'wa', meaning: 'Konu particle\'ı' },
  ],
  exercises: [
    // 1. Warm-up recall
    {
      id: 'gr3-ir-1',
      type: 'instant_recognition',
      difficulty: 'easy',
      skillTags: ['recognition', 'recall'],
      progressGain: 5,
      japanese: 'おはようございます',
      romaji: 'ohayou gozaimasu',
      options: [
        { label: 'Günaydın (resmi)', correct: true },
        { label: 'İyi akşamlar', correct: false },
        { label: 'Merhaba', correct: false },
        { label: 'Hoşça kal', correct: false },
      ],
    },
    // 2. Audio → Kana (harder)
    {
      id: 'gr3-atk-1',
      type: 'audio_to_kana',
      difficulty: 'medium',
      skillTags: ['listening', 'kana'],
      progressGain: 7,
      audioText: 'はじめまして',
      options: [
        { japanese: 'はじめまして', correct: true },
        { japanese: 'よろしくおねがいします', correct: false },
        { japanese: 'ありがとうございます', correct: false },
        { japanese: 'おはようございます', correct: false },
      ],
    },
    // 3. Fill Blank — particle practice
    {
      id: 'gr3-fb-1',
      type: 'fill_blank',
      difficulty: 'medium',
      skillTags: ['particle', 'grammar'],
      progressGain: 8,
      sentenceBefore: 'わたし',
      sentenceAfter: 'がくせいです',
      blankType: 'particle',
      explanation: 'は konu particle\'ıdır. "Ben öğrenciyim" = わたしはがくせいです',
      smartFeedback: 'は (wa) konu particle\'ı — cümlenin konusunu belirtir.',
      options: [
        { label: 'は', correct: true },
        { label: 'を', correct: false },
        { label: 'が', correct: false },
        { label: 'に', correct: false },
      ],
    },
    // 4. Visual Context — evening scene
    {
      id: 'gr3-vc-1',
      type: 'visual_context',
      difficulty: 'easy',
      skillTags: ['recognition', 'grammar'],
      progressGain: 0,
      scene: '🌙',
      npcJapanese: 'こんばんは！はじめまして。',
      npcMeaning: 'İyi akşamlar! Memnun oldum.',
    },
    // 5. Conversation Chain — multi-turn, memory
    {
      id: 'gr3-cc-1',
      type: 'conversation_chain',
      difficulty: 'medium',
      skillTags: ['conversation', 'production', 'grammar'],
      progressGain: 12,
      explanation: 'はじめまして = ilk tanışmada söylenir, よろしく = "iyi geçinelim" anlamında',
      turns: [
        {
          speaker: 'npc',
          npcJapanese: 'こんにちは！はじめまして。',
          npcMeaning: 'Merhaba! Memnun oldum.',
          audioText: 'こんにちは！はじめまして。',
        },
        {
          speaker: 'user',
          userOptions: [
            { japanese: 'はじめまして！', correct: true },
            { japanese: 'さようなら', correct: false },
            { japanese: 'おはよう', correct: false },
          ],
        },
        {
          speaker: 'npc',
          npcJapanese: 'お名前は？',
          npcMeaning: 'Adınız ne?',
          audioText: 'お名前は？',
        },
        {
          speaker: 'user',
          memoryKey: 'name',
          userOptions: [
            { japanese: 'アリです', correct: true },
            { japanese: 'がくせいです', correct: false },
            { japanese: 'ありがとう', correct: false },
          ],
        },
        {
          speaker: 'npc',
          npcJapanese: 'アリさん、よろしくおねがいします！',
          npcMeaning: 'Ali, çok memnun oldum!',
          audioText: 'アリさん、よろしくおねがいします！',
        },
        {
          speaker: 'user',
          userOptions: [
            { japanese: 'よろしくおねがいします！', correct: true },
            { japanese: 'じゃあね', correct: false },
            { japanese: 'ありがとう', correct: false },
          ],
        },
      ],
    },
    // 6. NPC Reaction
    {
      id: 'gr3-nr-1',
      type: 'npc_reaction',
      difficulty: 'easy',
      skillTags: ['conversation'],
      progressGain: 0,
      message: 'Great conversation!',
    },
    // 7. Listening Build
    {
      id: 'gr3-lb-1',
      type: 'listening_build',
      difficulty: 'hard',
      skillTags: ['listening', 'sentence_order', 'production', 'grammar'],
      progressGain: 10,
      audioText: 'わたしはがくせいです',
      prompt: 'Ben öğrenciyim.',
      answerTokens: ['わたし', 'は', 'がくせい', 'です'],
      bankTokens: ['わたし', 'は', 'がくせい', 'です', 'こんにちは', 'を', 'が'],
      explanation: 'わたしはがくせいです = Ben öğrenciyim',
      smartFeedback: 'は particle\'ı konuyu belirtir.',
    },
    // 8. Listening Conversation
    {
      id: 'gr3-lc-1',
      type: 'listening_conversation',
      difficulty: 'hard',
      skillTags: ['listening', 'conversation'],
      progressGain: 10,
      audioText: 'おはようございます！',
      hiddenJapanese: 'おはようございます！',
      hiddenMeaning: 'Günaydın! (resmi)',
      options: [
        { japanese: 'おはようございます！', correct: true },
        { japanese: 'こんばんは', correct: false },
        { japanese: 'さようなら', correct: false },
        { japanese: 'ありがとう', correct: false },
      ],
    },
    // 9. Token Build — harder
    {
      id: 'gr3-tb-1',
      type: 'token_build',
      difficulty: 'hard',
      skillTags: ['grammar', 'sentence_order', 'production', 'particle'],
      progressGain: 10,
      prompt: 'Su içerim.',
      answerTokens: ['みず', 'を', 'のみます'],
      bankTokens: ['みず', 'を', 'のみます', 'は', 'おちゃ', 'が'],
      explanation: 'みず=su, を=nesne particle\'ı, のみます=içerim',
      smartFeedback: 'を particle\'ı nesne (doğrudan etkilenen şey) için kullanılır.',
    },
    // 10. NPC Reaction
    {
      id: 'gr3-nr-2',
      type: 'npc_reaction',
      difficulty: 'easy',
      skillTags: ['production'],
      progressGain: 0,
      message: 'Amazing progress!',
    },
    // 11-13. Fast Recall (hard, longer timers)
    {
      id: 'gr3-fr-1',
      type: 'fast_recall',
      difficulty: 'hard',
      skillTags: ['recall', 'kana'],
      progressGain: 6,
      prompt: 'Memnun oldum',
      answerJapanese: 'はじめまして',
      timerMs: 3000 + 6 * 400 + 1500,
      options: [
        { japanese: 'はじめまして', correct: true },
        { japanese: 'ありがとう', correct: false },
        { japanese: 'こんにちは', correct: false },
        { japanese: 'さようなら', correct: false },
      ],
    },
    {
      id: 'gr3-fr-2',
      type: 'fast_recall',
      difficulty: 'hard',
      skillTags: ['recall', 'production'],
      progressGain: 6,
      prompt: 'İyi geçinelim / Çok memnun oldum',
      answerJapanese: 'よろしくおねがいします',
      timerMs: 3000 + 10 * 400 + 1500,
      options: [
        { japanese: 'よろしくおねがいします', correct: true },
        { japanese: 'どういたしまして', correct: false },
        { japanese: 'はじめまして', correct: false },
        { japanese: 'ありがとうございます', correct: false },
      ],
    },
    {
      id: 'gr3-fr-3',
      type: 'fast_recall',
      difficulty: 'hard',
      skillTags: ['recall', 'particle'],
      progressGain: 6,
      prompt: 'Ben öğrenciyim. (Japonca\'da konu particle\'ı nedir?)',
      answerJapanese: 'は',
      timerMs: 3000 + 1 * 400 + 1500,
      options: [
        { japanese: 'は', correct: true },
        { japanese: 'を', correct: false },
        { japanese: 'が', correct: false },
        { japanese: 'に', correct: false },
      ],
    },
  ],
};

// ── Unit Export ────────────────────────────────────────────────────────────

export const greetingsUnit: LessonUnit = {
  id: 'p1-u1',
  theme: { tr: 'Selamlaşma', en: 'Greetings' },
  description: {
    tr: 'Japonca\'da temel selamlar, tanışma ifadeleri ve nazik vedalaşma.',
    en: 'Basic Japanese greetings, introduction phrases, and polite farewells.',
  },
  wordCount: 10,
  grammarCount: 3,
  isCheckpoint: false,
  lessons: [lesson1, lesson2, lesson3],
};

export const allUnits: LessonUnit[] = [greetingsUnit];

export function getLessonUnit(unitId: string): LessonUnit | null {
  return allUnits.find((u) => u.id === unitId) ?? null;
}

export function getLesson(unitId: string, lessonId: string): import('../lessonTypes').Lesson | null {
  const unit = getLessonUnit(unitId);
  return unit?.lessons.find((l) => l.id === lessonId) ?? null;
}

const ALL_LESSON_IDS = new Set(allUnits.flatMap((u) => u.lessons.map((l) => l.id)));

export function hasLessonData(lessonId: string): boolean {
  return ALL_LESSON_IDS.has(lessonId);
}
