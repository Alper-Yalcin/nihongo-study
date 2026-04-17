# Kototsuna — Duolingo-İlhamlı Sakura Yeniden Tasarımı

## Context

Kullanıcı, mevcut Kototsuna frontend tasarımını (dark-first, token-tabanlı ama düz kartlarla dolu hiyerarşi) beğenmiyor. Geliştirici, Duolingo'nun ekran görüntülerinden ilham alınarak hazırlanmış, Japonca öğrenme deneyimini **oyunlaştırılmış, yol-tabanlı (path), üç-kolonlu** bir kabuğa taşıyan yeni bir görsel-etkileşim katmanı istiyor. Tüm mevcut alan mantığı, rotalar, progress/play store'ları ve server-side word API'sı korunacak. Sadece **görsel kabuk + sayfa düzenleri + akışlar** değişecek.

Kısıt: **sakura pembesi marka kimliği** (`--kt-brand: #d06070`) ve mevcut semantic tokens (`--kt-*` + `.theme-dark` override'lar) olduğu gibi kalacak. Yeşil "Duo" renklerini sakura tonlarına (sakura / tere / yaprak / akşam / gün batımı) haritalayarak Duolingo'nun oyunsu ritmini uygulayacağız.

Hedef: 2 hafta içinde tamamlanabilecek, faz-bazlı, geri dönüşebilir bir yeniden tasarım; her sayfa migrate edildikçe `npx tsc --noEmit` + `npm run build` green kalacak.

---

## 1. Tasarım Felsefesi

### 1.1 Duolingo'dan Ne Alıyoruz
- **Üç-kolonlu sabit shell**: Sol nav bar (persistent), orta içerik, sağ ödül/stat rail.
- **Yol-bazlı (path) öğrenme**: Yılanvari dikey path, circular düğüm (node) kartları, ünite banner'ları, section divider'lar, "buraya atla" shortcut'lar.
- **Sürekli motivasyon katmanı**: Streak + XP/gem + hearts top bar, günlük görevler, unlock kartları.
- **Kart-stack section overview**: Her ünite bir card, progress bar + CTA + illüstrasyon + örnek cümle.
- **Playful mikro-jestler**: Büyük tıklanabilir alanlar, abartılmış hover/aktif durumlar, emoji/simge-yüklü ipucu kartları.

### 1.2 Neyi Duolingo'dan Almıyoruz
- Duo yeşili (#58cc02) → sakura pembesine çevrilecek.
- Duo-owl mascot → Kototsuna'nın sakura/torii/kitsune motifli illüstrasyon sistemi (aşağıda detaylı).
- Çocuksu/comic tipografi → Kototsuna'nın zarif Inter + Japonca font seçenekleri korunacak.
- "Hearts / lives / mağaza / leaderboard sosyal" sistemleri → Duolingo'nun bu özelliği bizde **yok**, sahte ekranlar koymak yerine o konumlara **anlamlı alternatifler** (mastery summary, due review, recent wins) yerleştireceğiz.

### 1.3 Sakura Renk Haritalaması
Mevcut tokenler korunuyor; Duolingo'nun "ünite renk bandı" konsepti için `--kt-*` paletine **section accent**'ler ekleyeceğiz (tokens.css'e append):

| Duolingo | Kototsuna eşdeğeri | Token |
|----------|-------------------|-------|
| #58cc02 (yeşil, aktif) | `#d06070` sakura | `--kt-brand` (var) |
| #1cb0f6 (mavi, ünite 2) | `#d594a1` kurudalı | `--kt-accent-warning` (var) |
| #58a700 (yeşil, ünite 3) | `#a8616f` olgun | `--kt-accent-success` (var) |
| #ce82ff (mor, ünite 4) | `#8b5a7a` gece-sakura | `--kt-accent-plum` (**yeni**) |
| #ff9600 (turuncu, streak) | `#d88a5a` gün batımı | `--kt-accent-sunset` (**yeni**) |
| #ff4b4b (kırmızı, hearts) | `#c24f69` sakura-danger | `--kt-accent-danger` (var) |
| Locked gri | `#8a7f85` ink-subtle | `--kt-ink-subtle` (var) |

Eklenecek yeni tokenler (hem `:root` hem `.theme-dark`'a):
```css
--kt-accent-plum: #8b5a7a;          /* dark: #c49abb */
--kt-accent-plum-soft: #f3e4ee;     /* dark: rgba(139,90,122,0.22) */
--kt-accent-sunset: #d88a5a;        /* dark: #f0b08c */
--kt-accent-sunset-soft: #ffe8dc;   /* dark: rgba(216,138,90,0.22) */
--kt-accent-info: #c96e81;          /* dark: #e8a4b5 — alt banner tonu */
--kt-accent-info-soft: #ffecef;     /* dark: rgba(201,110,129,0.22) */
```

### 1.4 Mascot & İllüstrasyon Stratejisi
Duolingo-owl yerine **"Hanabi"** (Kototsuna kitsune sakura yavrusu) isimli tek bir karakter set'i. 4 pose yeterli:
- `hanabi-wave.svg` — selam (Home hero)
- `hanabi-cheer.svg` — tebrik (lesson complete)
- `hanabi-study.svg` — kitap okuyor (path node yanı)
- `hanabi-sleep.svg` — ünite locked state

Bunların yanında **statik Japon motif SVG'leri**: torii, sakura yaprak spray, origami crane, bonsai, daruma, fan. Bu SVG'ler `public/illustrations/` altında; Phase 0'da placeholder (lucide icon + sakura dolgusu), sonraki faz gerçek SVG'lerle değiştirilecek.

---

## 2. Yeni Shell Mimarisi

### 2.1 Eski vs. Yeni
**Eski**: `Navbar` (top sticky) → `<main>` → `Footer`. Tek kolon, sayfa içeriği `PageShell` (max-w-6xl) ile ortalı.

**Yeni**: Üç kolonlu grid shell — sol sabit nav (240px), orta esnek içerik (min-w-0), sağ sabit rail (340px). Mobile'da sol nav bottom bar'a, sağ rail ise sheet'e dönüşür.

```
App.tsx
  <AppShell language themeMode …>      ← yeni wrapper, Navbar'ı değiştiriyor
    <LeftNav />                          ← persistent sidebar (desktop), bottom bar (mobile)
    <main>{Routes}</main>                ← mevcut sayfaların render noktası (değişmiyor)
    <RightRail script="hiragana" />      ← sayfaya göre contextual
  </AppShell>
```

### 2.2 Yeni Dosyalar
- `src/components/shell/AppShell.tsx` — grid layout, mobile responsive.
- `src/components/shell/LeftNav.tsx` — Duolingo-stil dikey nav (icon + label).
- `src/components/shell/RightRail.tsx` — sağ kolon orchestrator.
- `src/components/shell/StatsStrip.tsx` — top-right pill row (language flag + streak + XP + hearts placeholder).
- `src/components/shell/DailyQuestsCard.tsx` — "Günlük Görevler" card.
- `src/components/shell/UnlockCTA.tsx` — "Puan tabloları kilidini aç" tip kart.
- `src/components/shell/MobileBottomBar.tsx` — 5-slot bottom tab (sm:hidden).
- `src/components/shell/RightRailSheet.tsx` — sağ rail'in mobile variant'ı.

### 2.3 Silinecek / Küçülecek
- `src/components/Navbar.tsx` — LeftNav + StatsStrip'e bölünecek, dosya kaldırılacak.
- `src/components/Footer.tsx` — Duolingo tarzı footer yok; LeftNav altına kompakt (hakkında / şartlar / gizlilik) link listesi olarak inecek.

### 2.4 AppShell Responsive Davranışı
| Breakpoint | LeftNav | Main | RightRail |
|------------|---------|------|-----------|
| `< 768px` (mobile) | `MobileBottomBar` (5 icon) | full width | `RightRailSheet` (üst sağ menü icon → drawer) |
| `768-1280px` (tablet) | icon-only, 72px | flex-1 | icon-summary strip (72px) → click expands drawer |
| `> 1280px` (desktop) | icon + label, 240px | min-w-0 flex-1, max-w-3xl center | full 340px |

---

## 3. LeftNav (Sol Sidebar) Tasarımı

### 3.1 Görsel Dil
- Sticky, `var(--kt-surface)` arka plan, `border-r border-[var(--kt-border-subtle)]`.
- Logo üstte (`kototsuna-logo-light.png` / `kototsuna-logo.png`, theme-aware). Duolingo'daki 52px logo kutusu yerine bizde full-width padding'li (32px), marka kelimesi okunur.
- Her nav item:
  - Height: 56px, rounded-[var(--kt-radius)], padding 16px.
  - Inactive: `text-[var(--kt-ink-muted)]`, hover `bg-[var(--kt-brand-soft)]/40`.
  - Active: `bg-[var(--kt-brand-soft)] border-2 border-[var(--kt-brand)] text-[var(--kt-brand)]` — Duolingo'nun "pill highlight" ile aynı his, sakura tonunda.
  - Icon (24px, lucide) + uppercase label (font-bold, tracking-[0.06em], text-sm).

### 3.2 IA — Nav Item'lar
Mevcut `appShellRoutes` korunuyor; sadece **görsel gruplama** değişiyor:

| Slot | Icon | TR label | EN label | Hedef route |
|------|------|----------|----------|-------------|
| 1 | `Home` | ÖĞREN | LEARN | `appShellRoutes.home` |
| 2 | `Languages` | HARFLER | LETTERS | yeni `/letters` (aşağıda) |
| 3 | `Swords` | ALIŞTIRMA | PRACTICE | yeni `/practice` hub (review/weak/confusable/stats tek sayfa) |
| 4 | `Gamepad2` | OYUN | PLAY | hiraganaPlay (default script = son ziyaret edilen) |
| 5 | `Trophy` | GÖREVLER | QUESTS | yeni `/quests` |
| 6 | `User` | PROFİL | PROFILE | `appShellRoutes.account` |
| 7 | `MoreHorizontal` | DAHA FAZLA | MORE | flyout (Settings, Search, Help) |

**Önemli**: mevcut Hiragana/Katakana/Kanji üçlü ayrımı nav'dan kalkıyor — bunun yerine **script seçici** orta panel hero'sunda yer alıyor (aktif script bir "lesson track" gibi hissettiriyor — Duolingo'daki dil flag dropdown'ı gibi). Bu, gereksiz 3×3 menü karmaşasını kaldırıyor.

### 3.3 MORE Flyout
- `Settings` → `appShellRoutes.settings`
- `Search` → `appShellRoutes.search`
- `Help / SSS` → placeholder link
- `GitHub / About` → footer'dan göç eden meta link'ler
- Language toggle (TR/EN flag picker) ve theme toggle (Sun/Moon) flyout içinde — böylece nav içinde daimi yer kaplamıyorlar.

### 3.4 Script Seçici (Nav'ın en altında)
LeftNav'ın footer'ında küçük bir "aktif dil" pill: `🗾 Japonca` + altında küçük script sekmesi `[あ Hiragana] [カ Katakana] [漢 Kanji (soon)]`. Aktif script localStorage'a kaydediliyor (`kototsuna.active-script`) ve Home/Practice/Play rotaları bu seçime göre yönleniyor.

---

## 4. RightRail (Sağ Rail) Tasarımı

### 4.1 Composable Parçalar
RightRail, sayfaya göre farklı slot kombinasyonları render ediyor. Her sayfa shell'e hangi slot'ların açık olduğunu söylüyor.

**Slotlar**:
1. **StatsStrip** (her sayfa, üstte): 4 pill row
   - Script flag (🗾 Jp) → tıklayınca script switcher
   - Streak: `<Flame/>` + gün sayısı (mevcut `calculateCurrentStreak()` kullanılıyor)
   - XP/Gems: `<Gem/>` + `totalXp` (usePlayProgressStore'dan)
   - Hearts: `<Heart/>` + `5` (şimdilik decorative, gerçek hearts sistemi yok — tooltip: "Sınırsız hayat aktif")
2. **UnlockCTA** (Home + Path): "Leaderboards kilidi" yerine **"Kanji modülü yakında"** veya **"Lesson X kilidini aç"** tarzı motive edici kart.
3. **DailyQuestsCard** (Home + Quests): bugünün challenge'ları + progress bar + "Tümünü gör" link.
4. **MasteryMiniCard** (Path + Practice): aktif script'in tracked/weak/mastered dağılımı — küçük 3-stat pill satırı + mastery ring.
5. **RecentWinsCard** (Play + Stats): son 3 completed session (kısa; başlık + skor + zaman).
6. **AuthCard** (Home — auth yoksa): "İlerlemeni kaydet" — bir profil oluştur / giriş yap. (Mevcut auth yok; bu card placeholder olarak yer alıyor ve kullanıcı auth eklendiğinde hazır.)

### 4.2 Sayfa × Slot Matrisi
| Sayfa | StatsStrip | UnlockCTA | DailyQuests | MasteryMini | RecentWins | AuthCard |
|-------|------------|-----------|-------------|-------------|------------|----------|
| Home | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Path (Öğren) | ✅ | ✅ | ✅ | ✅ | — | — |
| Letters | ✅ | — | ✅ | ✅ | — | — |
| Practice | ✅ | — | ✅ | ✅ | ✅ | — |
| Play | ✅ | — | ✅ | — | ✅ | — |
| Quests | ✅ | ✅ | — | ✅ | — | — |
| Profile / Settings | ✅ | — | — | — | — | — |
| Session / Item detail | ✅ | — | — | — | — | — |

---

## 5. Sayfa Sayfa Tasarım ve Akış

### 5.1 Home — "Öğren" Dashboard
**Route**: `/`
**Dosya**: `src/pages/Home.tsx` (full rewrite — mevcut "Next Best Action + feature section" karışık içerik Duolingo tarzı konsolide ediliyor).

**Akış**:
1. Kullanıcı Home'a geliyor; üstte büyük bir **ActiveScriptHero** (Duolingo'nun yeşil ünite banner'ına karşılık): aktif script (örn. Hiragana), mevcut level+lesson, "DEVAM ET" ana CTA, "REHBER" sekonder CTA. Sağda Hanabi mascot (wave pose) + sakura yaprakları.
2. Hero'nun hemen altında **PathPreview**: 3–5 node preview strip (mevcut + sonraki lessons), yatay scroll (desktop), dikey mini path (mobile). Tıklama `/kana/{script}/learn`'e götürür.
3. **Script Switcher cards** (3 tile): Hiragana, Katakana, Kanji (kilitli — "Yakında" badge). Her kart: büyük karakter (あ ア 漢), progress ring, "Başla" butonu. Aktif olan daha büyük + border brand.
4. **Günün yönlendirmesi** — mevcut `getNextBestAction()` mantığı korunuyor (dueCount, weakCount'tan). Tek bir **SuggestedActionCard** (`Card tone="brand"` + icon + TR/EN copy + primary Button).
5. **Mini gamification row**: 3 küçük stat card — Streak, Total XP, Mastered count — mevcut store'lardan.
6. Footer zone: kompakt link listesi (Hakkında, Şartlar, Gizlilik) — Duolingo'nun sağ altındaki link grid'i gibi.

**Right rail**: StatsStrip + UnlockCTA (Kanji preview veya next milestone) + DailyQuestsCard + MasteryMiniCard + AuthCard.

**Silinecek**: mevcut Home'daki "Shell Areas", "Current Systems", "Foundation Items" uzun feature tanıtım blokları. Yeni kullanıcı onboarding gerekirse ayrıca bir `/welcome` rotasına taşınır.

---

### 5.2 Öğren Path — Duolingo Path Clone
**Route**: `/kana/{script}/learn` (mevcut, korunuyor)
**Dosya**: `src/pages/KanaStudyRoadmapPage.tsx` (büyük rewrite — LessonRunner iç modalı korunuyor; dış shell tamamen değişiyor).

**Görsel Yapı** (Duolingo Screenshot 1/3/4 ilhamı):
- **Sticky section banner**: `sticky top-0 z-10 rounded-[var(--kt-radius-md)] px-6 py-5` — aktif section başlığı ("1. KISIM, 3. ÜNİTE — Selamlaş ve vedalaş"), solda geri oku, sağda "REHBER" Button (secondary). Renk: aktif level'ın `--kt-accent-*` token'ı (level 1 = brand, level 2 = warning/kurudalı, level 3 = success/olgun, level 4 = plum/gece).
- **Center path**: `flex flex-col items-center gap-10`. Her lesson bir **PathNode** component:
  - 84px yuvarlak, ortada icon veya Japanese char
  - State'lere göre stil:
    - `active`: parlak brand dolgu + `shadow-[var(--kt-shadow-md)]` + yukarıda küçük "BAŞLAT" tooltip bubble
    - `completed`: `bg-[var(--kt-accent-success)]` + check icon
    - `locked`: `bg-[var(--kt-surface-sunken)]` + lock icon, opacity 60
    - `checkpoint` (isCheckpoint=true lesson): daha büyük (112px), border double, tatoo pattern
  - Düğümler arası hafif S-kıvrımı: sola–sağa `translateX` ile 0, +24, 0, -24, 0 sequence (CSS-only).
- **Intermediate decorations**: chest icon (2 lesson'da bir, ileride reward unlock'a bağlanacak), Hanabi-study mascot lesson 4'te ortada.
- **Section divider**: `<hr>` + ortada kısım açıklaması (Duolingo'daki "İsimleri sıfatlarla tanımla" gibi). Başlık: lesson group label.
- **"Buraya atla" (Jump) shortcut**: tamamlanmış section'ların başında, dashed border button `BURAYA ATLA!` — `lesson.prerequisiteLessonIds` check geçilmişse görünür. Click → o lesson'a jump + intro step'i atla.

**State**:
- `useStudyRoadmapStore` (mevcut) aynen kullanılıyor. `unlockedLessonIds`, `completedLessonIds`, `lessonRecords` okunuyor.
- `activeLessonId` (local state): ilk unlock-edilmemiş (veya geri dönüp biraz practice için tıklanan) lesson.

**Akış**:
1. Kullanıcı path'i görüyor, aktif node'un başında zaten durduğunu görüyor.
2. Active node'a tıklıyor → Duolingo'daki "start card" gibi küçük popover açılıyor: başlık + description + "BAŞLAT" Button. (`PathNodePopover` yeni component.)
3. Başlat → mevcut `LessonRunner` (696-866. satırlar) modal/fullscreen olarak açılıyor. İçerideki quiz step UI aynen korunuyor.
4. Lesson biterse:
   - Pass → node `completed`'e geçiyor, animation (sakura confetti SVG), bir sonraki node unlock oluyor, Hanabi-cheer pose flash.
   - Fail → node `active` kalıyor, `lessonRecords[id].attempts++`, "Tekrar dene" CTA.
5. Checkpoint lesson'a ulaşınca, card daha parlak, `RightRail.UnlockCTA` "Checkpoint test hazır" kartına dönüyor.

**Right rail**: StatsStrip + UnlockCTA ("Checkpoint X'e X ders kaldı") + DailyQuestsCard + MasteryMiniCard (aktif script).

---

### 5.3 Section Overview — Ünite Kart Stack'i
**Route**: `/kana/{script}/overview` (mevcut Hiragana/Katakana landing rotası yerine geçiyor)
**Dosya**: `src/pages/Hiragana.tsx` + `src/pages/Katakana.tsx` (ikisi de `ScriptPage` kullanıyor; `ScriptPage`'i rewrite edip ortak section overview render edeceğiz).

**Görsel Yapı** (Duolingo Screenshot 2 ilhamı):
- Üstte **GERİ** back link (sol üst, chevron + TR/EN).
- Dikey stack: **SectionCard** per level (3 level × 1 card = 3 card Hiragana için).
- Her SectionCard:
  - Sol üst köşe: "X. Kısım" başlığı (level.title) veya lock badge + "N ÜNİTE" eğer locked.
  - Altında progress bar `%X` + "DEVAM ET" Button (locked'da `KISMA ATLA` disabled variant veya Button ghost).
  - Sağda: Hanabi mascot + speech-bubble'da Japanese örnek cümle (ör: `こんにちは！`). Bubble: `rounded-[var(--kt-radius-md)] border border-[var(--kt-border)] bg-[var(--kt-surface)]` + pointer triangle sola.
  - Arkaplan: level-specific soft accent (`--kt-brand-soft`, `--kt-accent-warning-soft`, `--kt-accent-plum-soft`) — her card farklı ton.
  - Border-top 4px solid `--kt-accent-*` — Duolingo'nun "ünite rengi" bandı.

**Akış**:
1. Kullanıcı script'e tıkladığında (Home'dan veya LeftNav'ın script switcher'ından) bu sayfaya düşüyor.
2. Aktif level card'ı otomatik genişletilmiş ve scroll'un içinde görünür.
3. "DEVAM ET" → `/kana/{script}/learn`'e (aktif lesson'a) atıyor.
4. Locked kısımlarda "KISMA ATLA" diyalog açıyor: "Bu kısma atlamak için 30 ünite XP gereksinimin var" (gamification hook, net-new). Eğer kullanıcının yeterli XP'si varsa, shortcut çalışıyor.

**Silinecek**: Mevcut Hiragana.tsx'deki "Study / Dictionary" dual view. Dictionary Letters sayfasına kayıyor.

---

### 5.4 Letters (Harfler) — Hiragana/Katakana Grid
**Route**: `/letters?script=hiragana` (yeni)
**Dosya**: `src/pages/LettersPage.tsx` (yeni; mevcut `hiraganaWords` / `katakanaWords` sözlük-karışık sayfalarını replace etmiyor — onlar ayrı kalıyor. Letters sadece karakter tablosu.)

**Görsel Yapı** (Duolingo Screenshot 5/6 ilhamı):
- Üst tab bar: `HIRAGANA | KATAKANA`. Aktif tab alt-border brand. Search param ile senkron.
- Hero (center-align): büyük başlık `{Script}'yi öğrenelim!` + TR/EN subtitle + büyük CTA **KARAKTERLERİ ÖĞREN** (primary Button, path learn rotasına gidiyor).
- Grid: 5-cols × N-rows, her hücre bir **CharacterCell** card:
  - Büyük Japanese char (text-4xl, font-jp-current)
  - Altında küçük romaji (text-xs, ink-muted)
  - En altta mini progress bar (2px line, brand dolgu, `masteryScore` tabanlı)
  - Hover: scale-[1.05] + shadow-sm. Click → item detail (`/kana/item/{id}`).
  - Tracked değilse: opacity 50.
  - Mastered: `border-[var(--kt-accent-success)]` ince vurgu.

**Akış**:
1. Nav'dan `HARFLER` → default script `hiragana`.
2. Tab değiştirerek katakana'ya geçiş.
3. Herhangi bir karakter'e tıklama → `KanaItemPage` (mevcut, minor refinement).
4. "KARAKTERLERİ ÖĞREN" → `/kana/{script}/learn`.

**Right rail**: StatsStrip + DailyQuests + MasteryMini.

---

### 5.5 Practice Hub — Review / Weak / Confusable / Stats Birleşik
**Route**: `/practice?script=hiragana` (yeni, tek sayfa hub)
**Dosya**: `src/pages/PracticePage.tsx` (yeni; eski `KanaPathPage variant="review|weak|confusable"` + `KanaStatsPage` sekmelerle aynı sayfada toplanıyor).

**Gerekçe**: Şu an 4 ayrı rota (review, weak, confusable, stats) kullanıcıyı bölüyor. Duolingo'nun "Alıştırma hub'ı" tek sayfada 4 tile olarak sunuyor.

**Görsel Yapı**:
- Script tab (Hiragana / Katakana).
- 4 büyük drill tile grid (2×2 desktop, 1×4 mobile):
  - **Review Queue** (due items): sarı `--kt-accent-warning` accent, icon `RefreshCw`, count badge.
  - **Weak Drill**: kırmızı `--kt-accent-danger`, icon `AlertTriangle`.
  - **Confusables**: mor `--kt-accent-plum`, icon `Shuffle`.
  - **Stats**: yeşil `--kt-accent-success`, icon `BarChart3`.
- Her tile Card: large icon + title + helper (örn. `12 item due`) + Button "Başla".
- Tile'a click → mevcut `KanaPathPage` akışını **aynı sayfa içinde** `activeView` state ile render (modal-gibi overlay değil; inline replace). Üstte "← Practice'e geri dön" back link.

**Akış**:
1. Kullanıcı Practice hub'ına geliyor, script seçiyor.
2. 4 tile'dan birini seçiyor — içerik slide-fade ile değişiyor (aynı route, internal state).
3. Drill bitince "← Practice'e geri dön" ile tekrar hub'a.
4. Alt satırda Stats tile'a tıklanırsa `KanaStatsPage` içeriği inline render.

**Right rail**: StatsStrip + DailyQuests + MasteryMini + RecentWins.

**Route taşıma**: Eski `/kana/{script}/review|weak|confusable|stats` rotaları yeni hub'a redirect (deep-link çalışmaya devam eder — `?tab=review` query param ile). Kod değişikliği: `App.tsx` route tanımları `PracticePage` component'ine işaret ediyor, `tab` query'sine göre variant seçiyor. Eski `KanaPathPage` dosyası aynen kalır ama `PracticePage`'in içindeki renderer olarak kullanılır.

---

### 5.6 Play — Oyun Hub'ı
**Route**: `/kana/{script}/play` (mevcut, korunuyor)
**Dosya**: `src/pages/KanaPlayPage.tsx` (shell + top stats migrate edilmişti; şimdi **games grid** ve **content selector** duolingo-kart stiline çekiliyor).

**Görsel Yapı**:
- Üst hero: "Oyun Modu" eyebrow + başlık + aktif XP progress toward next reward.
- **GamesGrid**: 4 büyük tile (2×2):
  - Kana Match — sakura kart + match icon
  - Meaning Match — lila kart + translate icon
  - Speed Tap — turuncu kart + zap icon
  - Memory Flip — gece-sakura kart + brain icon
- Her tile: gradient bg (from `--kt-accent-*` to `--kt-accent-*-soft`), büyük icon, title, last score badge, "OYNA" Button.
- Tile altında DifficultySelector (Kolay / Normal / Zor) segment control + ContentSelector dropdown (mevcut props korunuyor).
- Active game başladığında game runner fullscreen overlay (mevcut).

**Challenge section** (sayfa altında): Duolingo "Günlük görev" tarzı — `usePlayProgressStore().challengeClaims` + `Challenges` engine'inden güncel aktif 3 challenge, her biri progress bar'lı card. Claim butonu aktif olduğunda sakura-glow animasyonu.

**Akış**:
1. Play hub → oyun seç → difficulty + content → OYNA → runner açılıyor.
2. Bitince LatestResultCard + reward unlock animasyonu + "Tekrar oyna" veya "Challenge talep et" CTA.
3. Challenge claim → `rewardRegistry` update, Hanabi-cheer + sakura confetti.

**Right rail**: StatsStrip + DailyQuests + RecentWins.

---

### 5.7 Quests (Görevler) — Daily Challenges
**Route**: `/quests` (yeni, nav'dan direkt erişim)
**Dosya**: `src/pages/QuestsPage.tsx` (yeni)

**Gerekçe**: Duolingo Screenshot 7'deki "Görevler" sayfasını taklit. Mevcut Play challenge engine'i hem Play sayfası hem burada expose ediliyor.

**Görsel Yapı**:
- **Hero card** (mor tonda — `--kt-accent-plum-soft` bg): "Hoş geldin!" + "Ödülleri kazanmak için görevleri tamamla" + Hanabi-wave mascot + treasure-chest SVG sağda.
- **Günlük Görevler** section:
  - Başlık + "1 SAAT" geri sayaç pill (midnight reset).
  - Her challenge ayrı card: icon (zap/flame/star lucide) + başlık ("10 Puan kazan") + progress bar (1/10 örnek) + reward pill (XP/badge).
  - Locked placeholder card: "Yakında yeni görevlerin kilidi açılacak" — gray, icon Lock.
- **Haftalık / Aylık** (alt section): mevcut challenge engine `resetPeriod: 'weekly'` olanlar. Şimdilik 1-2 tane, rest: "Yakında".

**Right rail**: StatsStrip + UnlockCTA ("Aylık mücadele X günde kilidi açılacak") + MasteryMini.

**Akış**:
1. Quests sekmesine tıkla → daily görevler listesi.
2. Görev devam ediyorsa progress bar otomatik update (kullanıcı Play / Learn'de oynadıkça).
3. Tamamlandığında card rainbow border + "TALEP ET" CTA → reward claim → registry update.

---

### 5.8 Profile — Kullanıcı Özet Paneli
**Route**: `/account` (mevcut, PlaceholderPage → gerçek profil sayfası oluyor)
**Dosya**: `src/pages/ProfilePage.tsx` (yeni, `PlaceholderPage`'i replace ediyor; `appShellRoutes.account` aynı)

**Görsel Yapı**:
- Üstte avatar placeholder + isim + "streak X gün" rozet.
- Stat grid (6 StatCard):
  - Toplam XP
  - Streak
  - Mastered karakter
  - Tracked karakter
  - Tamamlanan lesson
  - Tamamlanan oyun session
- **Başarılar (Badges)** strip: unlockedFeatureIds + badges count → rozetler row'u (kazanılmış = renkli, kazanılmamış = gray).
- **Son aktiviteler** timeline: son 5 lesson/play session.
- Alt: "Ayarlar" link → Settings.

**Right rail**: StatsStrip (sadeleştirilmiş).

---

### 5.9 Settings — Duolingo Screenshot 8 ilhamı
**Route**: `/account/settings` (mevcut)
**Dosya**: `src/pages/Settings.tsx` (rewrite — mevcut toggle'lar korunuyor, görsel yapı Duolingo'ya çekiliyor).

**Görsel Yapı**:
- 2-kolon: **Ana panel** (center, 60%) + **Secondary rail** (right, 30%).
- Ana panel başlık "Tercihler" (h1).
- Grup 1 — **Ders deneyimi**: 4 toggle (Ses efektleri, Animasyonlar, Motivasyon mesajları, Dinleme egzersizleri). Switch: sakura active / gray inactive.
- Grup 2 — **Görünüm**: Karanlık mod select (`Varsayılan | Açık | Koyu`), Kana font style dropdown (mevcut, 5 font).
- Grup 3 — **Dil**: TR / EN radio card.
- Sağ panelde 2 mini card:
  - **Hesap**: Tercihler (current), Gizlilik ayarları (placeholder link).
  - **Destek**: Yardım Merkezi (placeholder link).

**Akış**: Toggle/select değişikliği anlık save (zaten usePersistentState kullanıyor).

---

### 5.10 KanaItemPage & KanaSessionPage (Minor Refinement)
Bu sayfalar zaten Phase 6'da migrate edildi. Duolingo yeniden tasarımında ek değişiklik:
- **KanaItemPage**: Sol üstte back ("← Harfler"), hero'daki character card'ı daha büyük ve Duolingo-study modu tek-karakter vitrini gibi (`p-12 text-[120px]`). Progress ring etrafında (SVG stroke-dashoffset).
- **KanaSessionPage**: Replay UI'a başlık + mini timeline (her answer bir dot, doğru = yeşil sakura, yanlış = sakura-danger).

---

## 6. Yeni/Güncellenecek Component Primitive'ler

| Component | Konum | Görev |
|-----------|-------|-------|
| `PathNode` | `src/components/path/PathNode.tsx` | Dikey path'teki circular lesson düğümü |
| `PathNodePopover` | `src/components/path/PathNodePopover.tsx` | Active node'a tıklayınca açılan start-lesson popover |
| `SectionBanner` | `src/components/path/SectionBanner.tsx` | Sticky section header (renk + başlık + Rehber btn) |
| `JumpHereButton` | `src/components/path/JumpHereButton.tsx` | "BURAYA ATLA" dashed shortcut |
| `ScriptSwitcher` | `src/components/shell/ScriptSwitcher.tsx` | LeftNav footer'ındaki script segment |
| `MascotFigure` | `src/components/mascot/MascotFigure.tsx` | Hanabi pose component (`pose="wave"\|"cheer"\|"study"\|"sleep"` + size) |
| `SpeechBubble` | `src/components/mascot/SpeechBubble.tsx` | Japonca örnek cümle balonu |
| `QuestCard` | `src/components/quests/QuestCard.tsx` | Daily challenge card (progress + claim) |
| `GameTile` | `src/components/play/GameTile.tsx` | Play hub'daki gradient game card |
| `CharacterCell` | `src/components/letters/CharacterCell.tsx` | Letters grid'indeki karakter tile |
| `StatPill` | `src/components/shell/StatPill.tsx` | StatsStrip'in tekil icon+value pill'i |

Mevcut `Button`, `Card`, `StatCard`, `Badge`, `Eyebrow`, `PageHeader`, `PageSection`, `PageShell`, `EmptyState`, `StatusBanner`, `CTABlock` API'leri **değişmiyor** — yeni component'ler bunları compose ediyor.

### 6.1 `ProgressRing` (yeni, küçük util)
`<ProgressRing value={0..100} size={48|72|120} color="brand|success" />` — SVG circle stroke-dashoffset, Letters CharacterCell + Profile hero'da kullanılıyor.

### 6.2 `ConfettiBurst` (yeni, animasyon)
Lesson pass, challenge claim, level up anlarında tetiklenen sakura-petal confetti (pure CSS keyframe + SVG). Settings'teki "Animasyonlar" toggle'ı OFF ise render'lanmıyor.

---

## 7. tokens.css + index.css Değişiklikleri

### 7.1 tokens.css
- Yeni 6 token eklenecek (section 1.3'te listelendi): `--kt-accent-plum`, `--kt-accent-plum-soft`, `--kt-accent-sunset`, `--kt-accent-sunset-soft`, `--kt-accent-info`, `--kt-accent-info-soft`. Hem `:root` hem `.theme-dark`'a.
- Yeni: `--kt-path-node-active`, `--kt-path-node-completed`, `--kt-path-node-locked`, `--kt-path-connector` semantic tokenler (kısaca mevcut brand/success/subtle/border-subtle'a alias).

### 7.2 index.css
- Mevcut `.overview-hero*` rule'ları kaldırılabilir (yeni Home hero farklı class kullanıyor); migrate edildikten sonra silinecek.
- `!important` palette override'lar migrate olan her sayfadan sonra incrementally küçültülebilir.

---

## 8. Implementation Phases (Faz Sırası)

Her faz sonunda `npx tsc --noEmit` + `npm run build` green olmalı.

### Faz A — Shell Skeleton (0.5 gün)
1. Yeni `AppShell`, `LeftNav`, `RightRail`, `StatsStrip`, `MobileBottomBar` component iskeletleri oluştur (statik, mevcut store'dan veri oku).
2. `App.tsx`'i yeni shell'e geçir — `Navbar` + `Footer` yerine `<AppShell>`. Rotalar main slot'a düşer.
3. Mevcut her sayfa hala eski `PageShell` ile render edilecek — shell sayfayı sarmalıyor.

### Faz B — tokens.css + Design Primitive'ler (0.5 gün)
1. 6 yeni token ekle (hem light hem dark).
2. `ProgressRing`, `StatPill`, `QuestCard`, `GameTile`, `CharacterCell`, `MascotFigure` (placeholder lucide icon), `SpeechBubble` component'leri scaffold.

### Faz C — Home Rewrite (1 gün)
1. `Home.tsx` tamamen yeniden yaz: ActiveScriptHero + PathPreview + ScriptSwitcher cards + SuggestedAction + mini stats.
2. RightRail.Home variant'ını aktif et (StatsStrip + UnlockCTA + DailyQuests + MasteryMini + AuthCard).

### Faz D — Öğren Path Rewrite (1.5 gün)
1. `PathNode`, `PathNodePopover`, `SectionBanner`, `JumpHereButton` implement.
2. `KanaStudyRoadmapPage`'in dış shell'ini path UI'a çevir. LessonRunner iç modalı dokunma.
3. Section banner sticky + path node sequencing + locked/active/completed state mapping.
4. ConfettiBurst animasyonu pass tetikleme.

### Faz E — Script Overview + Letters (1 gün)
1. `ScriptPage`'i yeniden yaz → SectionCard stack (level başına bir kart, mascot + speech bubble + progress + CTA).
2. `LettersPage` yeni dosya: tab + hero + 5-col grid + CharacterCell.
3. `/letters` rotasını `App.tsx`'e ekle. Nav'dan `HARFLER` → `/letters?script=hiragana` bind.

### Faz F — Practice Hub (0.5 gün)
1. `PracticePage` yeni, 4 tile grid → query tab parametresine göre inline view.
2. Eski `/kana/{script}/review|weak|confusable|stats` rotalarını `PracticePage?tab=...`'a redirect.

### Faz G — Play Rewrite + Quests (1 gün)
1. `KanaPlayPage` iç games grid'i `GameTile` component'lerine çevir (gradient tile'lar).
2. `QuestsPage` yeni sayfa: Quest engine'den daily challenges render.
3. `/quests` rotası ekle, LeftNav'dan bind.

### Faz H — Profile + Settings (0.5 gün)
1. `/account`'u gerçek `ProfilePage`'e çevir (stat grid, badges, activity timeline).
2. Settings sayfasını Duolingo iki-kolon layout'una çek.

### Faz I — Mascot + Illustration (0.5 gün)
1. Hanabi 4 pose SVG'sini ekle (`public/illustrations/hanabi-*.svg`).
2. `MascotFigure` placeholder'ı gerçek SVG'ye swap.
3. SpeechBubble'larda Japonca default cümleler (`おはよう！`, `がんばって！`, `すごい！`, `やった！`) yerleştir.

### Faz J — Mobile Responsive Polish (0.5 gün)
1. MobileBottomBar 5 slot implementation.
2. RightRailSheet drawer (mobile'da üst sağ menü icon → drawer açılıyor).
3. Path page mobile'da daha dar circular node (64px). Letters grid mobile'da 3-col.

### Faz K — index.css Cleanup + Final QA (0.5 gün)
1. Migrate olmayan component kalmadıysa `!important` palette override'larını kaldır.
2. `.overview-hero*` rule'larını sil. `Navbar.tsx` + `PageContainer.tsx` dead dosyalarını sil.
3. Dark mode her sayfada manuel check.
4. `npx tsc --noEmit` + `npm run build` final green check.

**Toplam tahmin**: ~8 iş günü (paralel çalışılırsa ~5).

---

## 9. Kritik Mevcut Dosyalar

**Korunacak domain** (dokunulmayacak):
- `src/features/kana/progress/progressStore.tsx`
- `src/features/kana/review/reviewSelectors.ts`
- `src/features/kana/domain/kanaItem.ts` & `kanaProgress.ts` & `studySession.ts`
- `src/features/study-roadmap/content/roadmapDefinitions.ts`
- `src/features/study-roadmap/progress/useStudyRoadmapStore.ts`
- `src/features/play/progress/usePlayProgressStore.ts`
- `src/data/studyContent.ts` & `kana.ts` & `words.ts` & `appShellContent.ts`
- `src/utils/api.ts`

**Büyük rewrite**:
- `src/App.tsx` (shell swap)
- `src/pages/Home.tsx`
- `src/pages/KanaStudyRoadmapPage.tsx` (outer shell + path UI)
- `src/pages/KanaPlayPage.tsx` (games grid)
- `src/pages/ScriptPage.tsx` (SectionCard stack)
- `src/pages/Settings.tsx`
- `src/shared/ui/tokens.css` (6 yeni token)

**Yeni sayfalar**:
- `src/pages/LettersPage.tsx`
- `src/pages/PracticePage.tsx`
- `src/pages/QuestsPage.tsx`
- `src/pages/ProfilePage.tsx`

**Silinecek**:
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/PageContainer.tsx` (ScriptPage rewrite'dan sonra)

---

## 10. Verification Plan

Her faz sonrası:
1. `npx tsc --noEmit` — zero error.
2. `npm run build` — `dist/` çıkmalı, bundle < 900 kB.
3. `npm run dev` — manuel smoke test:
   - Home yüklenmeli, stats rail aktif script'e doğru değerleri göstermeli.
   - LeftNav'dan her tab'a click, doğru route.
   - Path page'de node'lar görünür, active node click → popover → LessonRunner modal.
   - Bir lesson tamamla → pass → next node unlock animate olsun.
   - Letters grid, her hücre tıklanabilir → item page.
   - Practice hub'da 4 tile, her birinin inline drill'i açılsın.
   - Dark mode toggle → 0 contrast bug, sakura tonları korunsun.
   - TR → EN dil switch → her string değişmeli.
   - Mobile (< 768px): bottom bar 5 slot, RightRail drawer açılsın.
4. Lighthouse: performance > 85, accessibility > 90.

---

## 11. Riskler ve Kararlar

### 11.1 Practice Hub — inline variant vs. ayrı sayfa
**Karar: inline variant**. 4 ayrı rota nav karmaşası yaratıyor; tek hub'dan akar. Deep-link uyumluluğu `?tab` query ile korunuyor.

### 11.2 Mascot
**Karar: Hanabi** (kitsune sakura yavrusu). SVG'ler Faz I'da gelir; Faz A-H'de lucide placeholder (Flower2/Sparkles) render eder.

### 11.3 Hearts System
**Karar: soft-include**. StatsStrip'te `<Heart/> 5` pill gösterilecek ama gerçek life-loss mekaniği eklenmeyecek. Tooltip: "Sınırsız hayat aktif — hata yapmaktan çekinme".

### 11.4 Renk Karar Noktaları
- Primary CTA: `--kt-brand` (#d06070).
- Completed/Başarı: `--kt-accent-success` (#a8616f).
- Warning/in-progress: `--kt-accent-sunset` (yeni, #d88a5a).
- Locked: `--kt-ink-subtle` on `--kt-surface-sunken`.
- Her level = farklı `--kt-accent-*` ton (4 level = 4 renk bandı).

### 11.5 LessonRunner İç UI
**Karar: dokunulmayacak**. Quiz step UI (recognition/reading/typing) zaten işlevsel.

### 11.6 Streak Kaynağı
**Karar**: Mevcut `calculateCurrentStreak()` (play sessions'tan) kullanılacak. Faz G'de gerekirse lesson completion'lardan da besleyen unified-streak helper eklenecek.

---

## 12. Faz A Başlangıcı İçin Hazır Liste

Faz A ilk commit'te oluşacak dosyalar:
1. `src/components/shell/AppShell.tsx`
2. `src/components/shell/LeftNav.tsx`
3. `src/components/shell/RightRail.tsx`
4. `src/components/shell/StatsStrip.tsx`
5. `src/components/shell/MobileBottomBar.tsx`
6. `src/components/shell/index.ts` (barrel)

`App.tsx` değişikliği:
- `import { Navbar } from './components/Navbar'` → kaldır
- `import { Footer } from './components/Footer'` → kaldır
- `import { AppShell } from './components/shell'` → ekle
- Return body: `<AppShell language themeMode ...><Routes/></AppShell>`
