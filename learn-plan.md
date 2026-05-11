Ready for review
Select text to add comments on the plan
Plan: Kototsuna Adaptive Lesson System
Context
Mevcut /learn/unit/:unitId sistemi basit teach→listen→build→choice döngüsü sunar. Yeni adaptive lesson sistemi bunu aşıp Duolingo-inspired, Japonca'ya özel optimize edilmiş bir "interactive learning platform" sunacak. Kullanıcı quiz değil, Japonca kullanıyor hissine sahip olmalı.

Mimari
Yeni feature module: Frontend/src/features/lesson/ Mevcut sistemlere dokunulmaz, paralel çalışır.

Audio: Abstraction layer (playJapaneseAudio) — arkasında Web Speech API, ileride mp3 / TTS Style: Mevcut CSS design tokens (var(--kt-*)) State: localStorage + React state (KanaProgressProvider pattern)

1. Types — lessonTypes.ts
// ── Exercise Types ────────────────────────────────────────────────────────
type ExerciseType =
  | 'instant_recognition'    // JP → anlam MC (easy, confidence boost)
  | 'audio_reinforcement'    // Ses + göster, soru değil + mini reinforce
  | 'kana_recognition'       // Kana → romaji
  | 'audio_to_kana'          // Ses → kana seçimi
  | 'audio_to_meaning'       // Ses → anlam seçimi
  | 'visual_context'         // Immersion card + mini soru
  | 'guided_response'        // NPC prompt → seçenekler
  | 'token_build'            // JP cümle tap-sequencing (mobil-first)
  | 'listening_build'        // Ses + token build birlikte
  | 'fill_blank'             // Particle/word/verb blank
  | 'conversation_chain'     // Multi-turn NPC (multi valid answers, memory)
  | 'listening_conversation' // NPC sadece ses, text gizli
  | 'fast_recall'            // Dynamic timer recall
  | 'npc_reaction'           // Micro emotional transition (soru değil)

type ExerciseDifficulty = 'easy' | 'medium' | 'hard'

type SkillTag =
  | 'listening' | 'kana' | 'recognition' | 'conversation'
  | 'particle' | 'grammar' | 'recall' | 'production' | 'sentence_order'

// Base — her exercise ortak alanları
interface BaseExercise {
  id: string
  type: ExerciseType
  difficulty: ExerciseDifficulty
  skillTags: SkillTag[]
  progressGain: number          // Bu type için nominal gain (correct)
  explanation?: string          // "Neden bu cevap?" içeriği
  smartFeedback?: string        // Yanlış cevap sonrası kısa hint
}

// ── Progress Bar Psychology ───────────────────────────────────────────────
// Nominal gain'ler (correct = %100, wrong = %30, retry = %60)
const PROGRESS_GAIN_BY_TYPE: Record<ExerciseType, number> = {
  instant_recognition: 5,
  audio_reinforcement: 0,      // soru değil, direkt geç
  kana_recognition: 5,
  audio_to_kana: 7,
  audio_to_meaning: 7,
  visual_context: 0,           // soru değil
  guided_response: 5,
  token_build: 10,
  listening_build: 10,
  fill_blank: 8,
  conversation_chain: 12,
  listening_conversation: 10,
  fast_recall: 6,
  npc_reaction: 0,             // transition, soru değil
}
// Wrong: gain * 0.30 | Retry correct: gain * 0.60

// ── Adaptive Data (SRS-ready) ─────────────────────────────────────────────
interface ExerciseAdaptiveData {
  exerciseId: string
  lastSeen: number
  correctCount: number
  wrongCount: number
  easeFactor: number       // SRS ease factor, başlangıç: 2.5
  masteryLevel: 0 | 1 | 2 | 3
}

// ── Confidence Scores ─────────────────────────────────────────────────────
interface ConfidenceScores {
  listening: number        // 0-100
  kana: number
  particles: number
  production: number
}

// ── Conversation Memory ────────────────────────────────────────────────────
type ConversationMemory = Record<string, string>
// { 'name': 'アリ', 'drink': '水' }

// ── Lesson Result ──────────────────────────────────────────────────────────
interface LessonResult {
  lessonId: string
  totalExercises: number
  correctFirstTry: number
  confidenceScores: ConfidenceScores
  skillBreakdown: Record<SkillTag, { correct: number; total: number }>
  xpEarned: number
  completedAt: number
}
2. Audio Abstraction — lessonAudio.ts
// Future-proof: Web Speech şimdi, mp3/TTS sonra
export function playJapaneseAudio(text: string, rate = 0.78): void {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  u.rate = rate
  window.speechSynthesis.speak(u)
}

export function createAudioPlayer(text: string) {
  return {
    play: () => playJapaneseAudio(text),
    playSlower: () => playJapaneseAudio(text, 0.55),
  }
}
3. Lesson Engine Hook — useLessonFlow.ts
Progress Bar Logic:

correct    → gain * 1.0
wrong      → gain * 0.30 (ilerleme durmaz!)
retry ok   → gain * 0.60
Progress NEVER goes backward.
Adaptive Review Queue (severity-based):

Small mistake (1x)      → sona ekle (1x review)
Repeated fail (2x)      → 3 soru sonra tekrar
Critical grammar fail   → immediate re-queue (hemen sonraki)
Confidence Tracking:

Her exercise tamamlandığında skillTags ile ilgili confidence skoru güncellenir
Correct → +weight, Wrong → -weight (min 0, max 100)
Bu skor Lesson Complete'te gösterilir + ileride adaptive pacing için kullanılır
Difficulty Pacing:

Lesson başı (0-30%): easy ağırlıklı
Orta (30-70%):       medium ağırlıklı  
Son (70-100%):       recall + hard
Micro Emotional Transitions:

Her 3-4 exercise'den sonra bir npc_reaction otomatik eklenir
Reaction metinleri: "Nice!", "Great listening!", "You got it!", "Keep going!"
Tiny animation (mascot wave veya confetti spark) — sadece 800ms görünür, flow bozulmaz
Multi-turn Memory:

const [memory, setMemory] = useState<ConversationMemory>({})
const updateMemory = (key: string, value: string) =>
  setMemory(prev => ({ ...prev, [key]: value }))
4. Exercise Components (13 tip)
Ortak prop pattern:

interface ExerciseProps<T extends BaseExercise> {
  exercise: T
  language: AppLanguage
  memory?: ConversationMemory
  onMemoryUpdate?: (key: string, value: string) => void
  onCorrect: () => void
  onWrong: () => void
}
InstantRecognition (easy)
Büyük Japonca kart (font-jp 5xl)
2×2 grid Türkçe seçenek
Tap → anında renk feedback → FeedbackBar
AudioReinforcement (immersion, soru değil)
Auto-play on mount, 🔊 replay butonu
Japonca text (büyük) + anlam (altında)
Opsiyonel mini reinforce soru (contextual: "Ne zaman kullanılır?")
Continue butonu
KanaRecognition
Kana gösterilir, 4 romaji seçenek
AudioToKana (listening)
Auto-play, "Tekrar dinle" küçük buton
4 Japonca kana seçenek (font-jp)
AudioToMeaning (listening)
Auto-play, 4 Türkçe seçenek
VisualContext (immersion + mini reinforce)
Emoji/ikon sahne (🌅 🌙 ☕)
NPC bubble: Japonca + çeviri
Opsiyonel contextual soru (bağlam sorusu: "Hangi durumda söylenir?")
Correct → onCorrect, soru yoksa direkt devam
GuidedResponse
NPC prompt + ses
3 seçenek (dikey), basit interaction hissi
TokenBuild (CORE MECHANIC)
Türkçe prompt + opsiyonel ses
Seçilen tokenlar: üst bölge (tap → geri döner)
Token bank: alt bölge (tap → seçilir)
Tap sequencing, drag-drop yok (mobil-first)
"Kontrol et" → FeedbackBar + "Neden bu cevap?" collapsible
ListeningBuild (listening + production)
TokenBuild + ses butonu
Ses çalar → sonra tokenlar aktifleşir
FillBlank (particle/word/verb)
Japonca cümle, ___ highlighted
4 MC seçenek
Smart error feedback ("を nesne particle'ı...")
ConversationChain (signature mechanic)
NPC bubble (sol, ses auto-play)
Kullanıcı sırası: select / token (variant'a göre)
Multiple valid answers destekli (acceptedAnswers: string[])
Multi-turn memory: NPC isim/bilgi hatırlar ({name} template)
Örnek: NPC template: {name}さん、こんにちは！
Formal/casual variant desteği
FastRecall (timed)
Türkçe prompt (büyük bold)
Dynamic timer: timerMs = 3000 + (kana.length * 400) + (difficulty === 'hard' ? 1500 : 0)
Circular progress indicator
4 Japonca seçenek
Timer biter → wrong count
NpcReaction (micro emotional transition, soru değil)
NPC mascot + kısa animasyon (800ms)
Mesaj: "Nice!", "Great listening!", "You got it!"
Auto-advance
ListeningConversation (advanced listening)
NPC sadece ses çalar
Text başta hidden
"Göster" reveal butonu (opsiyonel destek)
Sonra cevap seçer
5. Lesson Runner — LessonRunner.tsx
useLessonFlow hook
İnce progress bar üstte + X butonu
Exercise dispatch
LessonFeedbackBar — correct/wrong + "Neden?" collapsible
Passive reinforcement: FeedbackBar correct anında önceki öğrenilen kelimenin kısa echo'su
Lesson complete → LessonComplete
6. Feedback Bar — LessonFeedbackBar.tsx
Correct: yeşil + smartFeedback (varsa)
Wrong: kırmızı + kısa hint mesajı
"Neden?" collapsible (explanation)
Continue / Tekrar dene
7. Lesson Complete — LessonComplete.tsx
Mastery Feedback (skill-specific ratings):

✔ XP (animasyonlu sayaç)
✔ Listening: Excellent / Good / Improving
✔ Kana Recall: Excellent / Good / Improving
✔ Conversation: Excellent / Good / Improving
✔ Öğrenilen kelimeler listesi
✔ Streak bilgisi
LearnFallingFlowers confetti + "Sonraki Ders" / "Haritaya Dön"

8. Adaptive Storage — lessonStorage.ts
interface LessonProgress {
  completedLessonIds: string[]
  lessonResults: Record<string, LessonResult>
  adaptiveData: Record<string, ExerciseAdaptiveData>  // SRS-ready
  confidenceHistory: ConfidenceScores[]               // time-series
}
const LESSON_STORAGE_KEY = 'kototsuna.lesson-progress'
9. Lesson Data — data/greetingsUnit.ts
Selamlaşma ünitesi — 3 lesson:

Lesson 1 (temel selamlar, easy→medium): おはよう, こんにちは, こんばんは, はじめまして ~14 exercise: instant_recognition → audio_reinforcement → kana_recognition → audio_to_kana → audio_to_meaning → npc_reaction → guided_response → token_build → conversation_chain → fill_blank → fast_recall × 2

Lesson 2 (vedalaşma + ありがとう, medium): じゃあね, またね, ありがとう, どういたしまして ~14 exercise, medium difficulty ağırlıklı

Lesson 3 (conversation practice, hard): Tüm selamlar + multi-turn conversation_chain + listening_conversation + fast_recall (hard difficulty, longer timer)

10. Değiştirilecek Dosyalar (2 adet)
Frontend/src/data/appShellContent.ts
learnUnits: '/learn/units'
learnLessonBase: '/learn/lesson'
getLessonRoute(unitId, lessonId): string
Frontend/src/App.tsx
<Route path="/learn/units" element={<LessonUnitsPage language={language} />} />
<Route path="/learn/lesson/:unitId/:lessonId"
       element={<LessonRunnerPage language={language} themeMode={themeMode} />} />
Yeni Dosyalar (20 adet)
features/lesson/
├── lessonTypes.ts
├── lessonAudio.ts              ← abstraction layer
├── lessonStorage.ts
├── useLessonFlow.ts            ← engine hook
├── data/
│   └── greetingsUnit.ts
└── components/
    ├── LessonRunner.tsx
    ├── LessonFeedbackBar.tsx
    ├── LessonComplete.tsx
    └── exercises/
        ├── InstantRecognition.tsx
        ├── AudioReinforcement.tsx
        ├── KanaRecognition.tsx
        ├── AudioToKana.tsx
        ├── AudioToMeaning.tsx
        ├── VisualContext.tsx
        ├── GuidedResponse.tsx
        ├── TokenBuild.tsx
        ├── ListeningBuild.tsx
        ├── FillBlank.tsx
        ├── ConversationChain.tsx
        ├── FastRecall.tsx
        ├── NpcReaction.tsx
        └── ListeningConversation.tsx

pages/learn/
├── LessonRunnerPage.tsx
└── LessonUnitsPage.tsx
Kapsam Dışı (Phase 2)
Tam SRS scheduling (schema hazır, logic sonra)
Speaking/pronunciation exercises
Backend entegrasyonu
Level 2+ content (sadece Selamlaşma ünitesi)
Test Planı
/learn/units → UnitCard görünümü, kilit state
Lesson başlar → direkt ilk exercise (popup/intro yok)
Progress bar: correct → %100 gain, wrong → %30 gain, geriye gitmiyor
NpcReaction: 3-4 exercise'den sonra micro transition
Token build: tap sequencing, doğru sıra kontrolü, explanation açılır
Conversation chain: multi valid answers çalışır, NPC isim hatırlar
Fast recall: kana uzunluğuna göre dinamik timer
Wrong × 2 → birkaç soru sonra re-queue
Lesson complete: skill-specific mastery feedback (Listening: Excellent)
Adaptive data + confidence scores localStorage'a yazılır
Dark/light mode + TR/EN dil geçişi