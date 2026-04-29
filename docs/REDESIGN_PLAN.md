# Kototsuna Redesign Plan — Addiction Loop, Japon Estetiğiyle

## Hedef
**Duolingo seviyesi addiction loop, Duolingo çakması olmadan.**
Duolingo'nun mekaniği güçlü, estetiği agresif (kartoon baykuş, suçluluk uyandıran bildirim, kalp/can sistemi). Biz aynı psikolojiyi **Japon estetiği** ile sunacağız: sakura, sumi-e, washi doku, dan/rütbe sistemi, ki (気) enerjisi. Mekanik aynı derinlikte ama **ton farklı**: nazik, ritüel, "saygılı tekrar".

## Tasarım İlkeleri (Duolingo'dan ayrışma)
| Duolingo | Kototsuna |
|---|---|
| Cartoon baykuş, suçluluk | Sakura yaprağı, ritüel sessizlik |
| "You broke your streak!" guilt | "灯 söndü — yeniden yak" — geri davet |
| Hearts (can) sistemi | Ki (気) enerjisi — yenilenir, cezalandırmaz |
| Leagues (Bronze→Diamond) | Dan/Kyū (10. kyū → 1. dan) — dövüş sanatı rütbesi |
| Streak fire 🔥 | Tomoshibi 灯 (mum/kandil) — büyür, parlar |
| XP gem | Hanabira 花びら (sakura yaprağı) sayısı |
| Pushy mascot | Sensei karakteri — minimal, kaligrafik, sessiz |

**Anahtar fark**: Duolingo "korkutarak tutar". Biz "ritüel ile bağlarız". Aynı dopamin, farklı estetik.

---

## Core Loop (Üç Katmanlı)

### Katman 1: Mikro Loop — Saniyeler (Her Cevap)
Doğru cevap → ses + glow + combo sayar
- **Combo göstergesi**: 3 doğru = ×1.5, 5 doğru = ×2, 10 doğru = ×3 (`renzoku 連続`)
- **Yanlış cevap**: combo sıfırlanmaz hemen — 1 "shield" verilir (1 hata affedilir)
- **Doğru cevap sesi**: shōji açılma / mizu damlası — kısa, hoş
- **Yanlış cevap**: rahatsız ses YOK — kalın siyah çizgi + nazik "yeniden" mesajı

### Katman 2: Mezo Loop — Dakikalar (Her Oturum)
Oturum sonu → reward sequence + next session preview
- **Hanabira flyUp** (XP yerine sakura yaprağı havalanır)
- **Mastery delta**: "3 yeni kana ustalığa yaklaştı" — somut ilerleme
- **Tomoshibi büyüdü**: streak günü görsel olarak büyür (12 → 13)
- **Sonraki oturum preview**: "12 yaprağa daha 1. dan'a yükseliyorsun"

### Katman 3: Makro Loop — Günler/Haftalar (Geri Gelme)
- **Dan/Kyū yükselişi**: 10. kyū → 9. kyū → ... → 1. dan (haftalar)
- **Tomoshibi 灯 sistemi**: streak metrik ama **görsel olarak gelişen mum** — 7 gün = parlak, 30 gün = altın halka, 100 gün = sakura halesi
- **Haftalık ritüel**: pazartesi sabahı "yeni hafta" intro animasyonu (mevsim teması)
- **Loss aversion (nazik ton)**: streak kırılınca "灯 söndü" — guilt değil, **davet**: "yeniden yak (5 dk)"

---

## Phase 1: Foundation — Layout & Tema

### Layout Kararları
- Right rail kaldırılır
- Sticky tam-genişlik navbar
- Desktop sidebar kaldırılır, mobile bottom bar korunur
- "Play" → "Meydan"

### Navbar Yapısı
```
Desktop:
┌─────────────────────────────────────────────────────────────────┐
│ 灯 Kototsuna  Learn  Letters  Practice  Meydan  Quests          │
│                                       [灯 12] [花 450] [9°] 👤 │
└─────────────────────────────────────────────────────────────────┘
                                          streak  hanabira  dan
```
- 灯 (tomoshibi) = streak — primary, küçük SVG mum ikonu, parlaklığı streak günüyle artar
- 花 (hanabira) = XP — secondary, muted
- **Dan rozeti** (9°, 8°, ...) = makro progression — navbar'da görünür, **prestige sinyali**

### Estetik Tokens
```css
/* Yeni tokens */
--tomoshibi-glow: 0 0 12px rgba(255,180,80,0.6);
--washi-bg: url('/textures/washi-subtle.png');  /* %3 opacity doku */
--sumi-stroke: 1px solid rgba(20,20,20,0.85);
--sakura-trail: linear-gradient(...);
--dan-gold: #c9a961;
--ki-blue: #6b9bd8;  /* enerji rengi */
```
**Washi doku**: arka plana çok hafif (%3) japon kağıt dokusu — Duolingo'nun düz yeşili yerine "atmosfer".

### Dosyalar
| Dosya | Değişiklik |
|---|---|
| `components/shell/AppShell.tsx` | 3-kolon kaldırılır |
| `components/shell/TopNav.tsx` | Tomoshibi + Hanabira + Dan rozeti |
| `components/shell/LeftNav.tsx` | `hidden` |
| `components/shell/RightRail.tsx` | Çıkarılır |
| `data/appShellContent.ts` | "Play" → "Meydan" |
| `shared/ui/tokens.css` | Washi, tomoshibi, dan tokens |

---

## Phase 2: Combo & Ki Sistemi (Cross-Cutting Mekanik)

**Bu Phase önce gelir — diğer sayfalar bu sisteme bağlanır.**

### Combo (連続 Renzoku)
Her doğru cevap zinciri sayar. UI: ekranın sağ üstünde küçük sayaç.
```
×3  doğru → küçük titreşim + "連続 ×3" rozet
×5  doğru → 1.5x hanabira + ses yükselir
×10 doğru → 2x hanabira + ekrana sakura yaprağı yağar (3 sn)
×20 doğru → "Mushin 無心" rozeti — günde 1 kez kazanılır
```

### Ki (気) Enerji Sistemi — "Heart" alternatifi
Duolingo'da kalp biter, oyun durur (cezalandırıcı). Bizimki:
- **Ki maksimum 5**, her yanlış cevap 1 azalır
- Ki 0 olunca: oyun **durmaz** — sadece XP kazanımı %50 olur
- Ki yenilenir: 10 dk = +1, doğru cevap zinciri 5'e ulaşırsa +1 anında
- **Ders sonu bonus**: Ki tam (5/5) ile bitirme → +%20 hanabira "ki bonus"
- Görsel: navbar yakınında 5 küçük yuvarlak nokta (mavi, ki rengi)

**Felsefe**: Duolingo "yapma yoksa duracaksın" der. Biz "iyi yap, daha çok kazanırsın" deriz. Aynı motivasyon, ters polarize.

### Shield (盾)
İlk yanlış cevap **combo'yu kırmaz** — ekrana "盾 kullanıldı" mikro-mesajı. Oturum başına 1 kere. Bu mekanik kullanıcının "kaybetme korkusunu" combo zincirine yatırım yapmasına dönüştürür.

### Hook
```typescript
// Frontend/src/shared/hooks/useFeedback.ts
const { recordCorrect, recordWrong, combo, ki, hanabira } = useFeedback();
```
Tüm pratik/quiz sayfaları bu hook'u kullanır — feedback merkezîleşir.

### Dosyalar (yeni)
| Dosya | İçerik |
|---|---|
| `shared/hooks/useFeedback.ts` | Combo + Ki + Hanabira state |
| `shared/feedback/ComboIndicator.tsx` | Sağ üst combo sayacı |
| `shared/feedback/KiBar.tsx` | 5 nokta gösterge |
| `shared/feedback/HanabiraFly.tsx` | Yaprak fly animasyonu |
| `shared/feedback/sounds.ts` | shoji, mizu, koto sesleri |

---

## Phase 3: Mastery Sistemi (Görünür Öğrenme)

**Eksiklik düzeltildi**: Duolingo "skill strength" gösterir ama gizli. Biz **kana mastery'yi merkez yapacağız**.

### Mastery Modeli
Her kana için 0–100 mastery skoru. Kaynak: doğru/yanlış oranı + spaced repetition aralığı + son 7 gün performansı.

### Görselleştirme
- **Kana grid (LettersPage)**: her hücre arka plan rengi mastery'ye göre — solgun pembe (0) → tam pembe (100)
- **Heatmap toggle**: "Zayıflarım" tuşu → mastery <40 olanlar parlar, diğerleri solar
- **Tooltip**: hücreye hover → "ね · %72 ustalık · son 5 cevap: ✓✓✗✓✓"

### "Forge" Sayfası (Yeni Kavram — Practice'in Üst Seviyesi)
`/practice/forge` — sadece **zayıf kana**'larla otomatik oluşturulan oturum.
- "12 zayıf kana — 4 dakikada güçlendir"
- Tamamlandığında her kana için mastery delta gösterilir: `ね 72 → 81 (+9)`
- **Bu Duolingo'da yok** — bizim ayrışma noktamız.

### Dosyalar
| Dosya | Değişiklik |
|---|---|
| `data/masterySystem.ts` | Mastery hesaplama |
| `pages/LettersPage.tsx` | Heatmap, tooltip, mastery rengi |
| `pages/ForgePage.tsx` (yeni) | Zayıf kana drill |

---

## Phase 4: Learn — Yolculuk Haritası (Snake Path)

**UX Modeli**: Journey + branching + atmosfer

### Node Tipleri
- `●` Mission — 48px
- `🔴` Challenge (Boss) — 64px
- `⭐` Checkpoint — 72px, dan terfi noktası
- `🌸` Bonus — 40px, opsiyonel side path (branching!)

### Branching (Duolingo'dan ayrışma)
Duolingo lineer. Biz **bazı checkpoint'lerde 2 yol** sunarız:
- Sol yol: "Dilbilgisi ağırlıklı" (yavaş, derin)
- Sağ yol: "Konuşma ağırlıklı" (hızlı, telaffuz)
İki yol da aynı checkpoint'te birleşir. Agency hissi.

### Path İnteraktivitesi
- Tamamlanan path renklenir (sumi-e mürekkep akışı animasyonu)
- Aktif node breathe animasyonu (2s)
- Node tıklama → bounce + drawer (right slide-in, 90vw / 400px)
- Auto-scroll YOK — kullanıcı kontrolü
- **Mevsim teması**: arka plan ayın mevsimine göre değişir (ilkbahar = sakura, yaz = matsuri, sonbahar = kırmızı yapraklar, kış = kar) — geri gelme sebebi

### Path Atmosferi
- Çok hafif parallax (mouse hareketiyle %2)
- Path kenarında **dağ silüeti** (sumi-e tarzı, gri)
- Tamamlanan checkpoint'te **küçük torii** ikonu

### Dosya
`pages/LearnJapanesePage.tsx`

---

## Phase 5: Practice — Combo Arena

**UX değişikliği**: Practice "launcher + 4 mod" değil — **combo'nun pişirildiği yer**.

### Yapı
```
─── 連続 Combo Arena ──────────────────────
[ Hızlı başlat: 23 zayıf, ~4dk → BAŞLA ]    ← primary CTA, glow
                                              ki 5/5 → ki bonus aktif

Modlar:
  Review      Weak Drill     Confusables    Free
  📚 23       💪 12 zayıf    🎯 karışık     ✨ serbest

─── Bugünkü ───────────────────────────────
   ✓ 45 doğru   ·   连续 max: ×7   ·   花 +180
```

### "Hafif kaos" yerine: **Mevsim/Saat reaktivitesi**
Kart arka planları saate göre değişir:
- Sabah (06–11): açık mavi-pembe (asa 朝)
- Öğlen: parlak
- Akşam: ılık turuncu (yūgata 夕方)
- Gece: lacivert + yıldız

Aynı sayfayı farklı saatlerde açmak farklı hissettirir → **geri gelme küçük sebep**.

### Dosya
`pages/PracticePage.tsx`

---

## Phase 6: Quests — Üç Zaman Dilimi

### Günlük (Daily)
- 3 görev, sabah 06:00 yenilenir
- "Tümünü Al" toplu claim → büyük flyUp (10 yaprak birden)

### Haftalık (Weekly)
- 7 gün ızgarası: Pzt ✅ Sal ✅ ... 
- 5/7 gün → 🏆 200 hanabira
- 7/7 gün → "Kanpeki 完璧" rozeti + +1 ki maksimum (kalıcı, **prestige**)

### Sezonluk (Seasonal) — Duolingo'da yok
- 90 günlük sezon (ilkbahar / yaz / sonbahar / kış)
- Sezon sonu: dan terfi şansı + özel kana-sticker koleksiyonu
- Geçmiş sezonlar profilinde sergilenir → **identity/prestige**

### Reward Anı
1. Hanabira flyUp (8 yaprak, fizik tabanlı)
2. Ses: koto teli (短い音)
3. Mobil: vibrate(50)
4. **Next reward preview**: "Sonraki: +100 花 · 2 gün aktif kal → 🏆"
5. Ekrana 1 sakura yaprağı düşer (kalıcı 3 sn)

### Loss Aversion (nazik)
Streak kırılma uyarısı:
- 23:00'a kadar pratik yapılmamışsa: "灯 zayıflıyor — 5 dk yeter"
- Kırıldıysa: "灯 söndü — yeniden yak" (suçluluk değil, davet)
- **Streak freeze** (週末休): hafta sonu 1 freeze otomatik (premium'a takılı değil — saygı)

### Dosya
`pages/QuestsPage.tsx`

---

## Phase 7: Meydan — Core Loop'a Bağlı PvE/PvP

### Modlar
```
┌──────────────────┬──────────────────┐
│  Speed Mode      │  Timed Challenge │
│  灯+1 streak     │  花 ×2 (30dk)    │
├──────────────────┼──────────────────┤
│  Dōjō (PvE Boss) │  Duel (PvP)      │
│  🐉 haftalık boss│  ⚔️ 1v1          │
└──────────────────┴──────────────────┘
```

### Dōjō — Haftalık Boss (yeni, PvE)
- Her hafta bir "boss kana set" (örn: en çok karıştırılan 20 kana)
- Tüm kullanıcılar aynı boss'a karşı — kümülatif damage
- Topluluk %100 yenerse: herkes ödül alır (+200 hanabira)
- **Async sosyal** — yarış değil, ortak amaç → zorbalık hissi yok

### Duel — Async PvP
- Arkadaşa duel davet et
- Her oyuncu kendi zamanında 10 soru cevaplar
- Combo + doğru oranı = skor
- 24 saat içinde cevaplama → otomatik kazanır
- **Async** olması Duolingo'nun real-time stress'inden ayrışma

### Leaderboard — Lig Yerine "Dan Salonları"
Duolingo'nun haftalık lig sistemi (Bronze→Diamond) bağımlılık yapıyor ama anksiyete de yaratıyor.
Bizim versiyonumuz:
- **Dan salonları**: aynı dan/kyū'daki ~30 kişi
- Haftalık değil **aylık** sıralama (daha az stres)
- İlk 5: sezon sonu özel kana-sticker
- **Kayıp yok**: sıralama düşük olsa bile dan kaybedilmez (terfi tek yönlü)

### Dosya
`pages/MeydanPage.tsx`

---

## Phase 8: Sosyal & Identity

### Profil Sayfası
- **Dan rozeti** (büyük, kaligrafi)
- **Tomoshibi heat calendar** (GitHub commit grid tarzı, 365 gün)
- **Kana koleksiyonu**: ustalaştığın kana sayısı, görsel grid
- **Sezon stickerları** (geçmiş sezon ödülleri)
- **Mushin rozetleri** (×20 combo'lar)

### Arkadaş Sistemi
- Kullanıcı adı + 4 haneli kod ile ekle (Discord modeli)
- Arkadaş feed: "Ali 7. kyū'ya yükseldi · 2 sa önce"
- **Reaksiyon var, mesaj yok** (Duolingo'nun "comments" toxicity'sinden ayrışma)
- 5 emoji: 🌸 👏 🔥 ⚔️ 🎌

### Onboarding (yeni kullanıcı first 5 dk)
1. Kısa Sensei intro (3 ekran, kaligrafi animasyonlu)
2. **İlk başarı 30 sn içinde**: 5 hiragana göster → quiz → 5/5 doğru → büyük flyUp + "İlk dan'a hoş geldin: 10. kyū"
3. Bildirim izni iste (sadece bu noktada, soft copy)
4. İlk gün quest set: "3 mission tamamla" → 100 hanabira

### Dosyalar (yeni)
| Dosya | İçerik |
|---|---|
| `pages/ProfilePage.tsx` | Dan, heat calendar, koleksiyon |
| `pages/FriendsPage.tsx` | Liste, feed, ekle |
| `pages/OnboardingPage.tsx` | First-run experience |
| `data/danSystem.ts` | Dan/Kyū hesaplama (10. kyū → 1. dan) |

---

## Phase 9: Bildirim & Geri Çağırma

### Bildirim Stratejisi
**Duolingo "passive aggressive" bildirim ile ünlü** — biz tersi.

| Senaryo | Duolingo | Kototsuna |
|---|---|---|
| Streak kırılacak | "Your owl is sad 😢" | "灯 sönmek üzere — hazır olduğunda" |
| 3 gün gelmedin | "We miss you!" guilt | "Sezonda 3 gün geçti, sakuralar bekliyor" |
| Yeni içerik | "Come back!" | "Yeni boss açıldı" (nesnel bilgi) |

### Akıllı Zaman
- Kullanıcının son 14 günkü pratik saatlerinden ortalama hesaplanır
- Bildirim o saat ±15 dk'da gelir (push'lamaz, **uyum sağlar**)

---

## Uygulama Sırası (Yeni)

| # | Phase | Süre Tahmini | Bağımlılık |
|---|---|---|---|
| 1 | Foundation (layout + tema tokens) | 1 gün | — |
| 2 | **Combo & Ki sistemi (cross-cutting)** | 2 gün | Phase 1 |
| 3 | Mastery sistemi | 2 gün | Phase 2 |
| 4 | Learn (snake path + branching + mevsim) | 2 gün | Phase 1, 3 |
| 5 | Practice (Combo Arena) | 1 gün | Phase 2, 3 |
| 6 | Quests (3 zaman dilimi + nazik loss aversion) | 2 gün | Phase 2 |
| 7 | Meydan (Dōjō + Duel + Dan salonları) | 3 gün | Phase 2 |
| 8 | Sosyal & Identity & Onboarding | 3 gün | Phase 7 |
| 9 | Bildirim sistemi | 1 gün | Phase 8 |

**Toplam**: ~17 gün. Phase 2 (Combo & Ki) **kritik** — diğer her şeyin bağlandığı omurga.

---

## Kritik Dosyalar (Güncellenmiş)

### Yeni (oluşturulacak)
- `shared/hooks/useFeedback.ts` — combo, ki, hanabira merkez state
- `shared/feedback/ComboIndicator.tsx`
- `shared/feedback/KiBar.tsx`
- `shared/feedback/HanabiraFly.tsx`
- `shared/feedback/sounds.ts`
- `data/masterySystem.ts`
- `data/danSystem.ts`
- `pages/ForgePage.tsx`
- `pages/MeydanPage.tsx`
- `pages/ProfilePage.tsx`
- `pages/FriendsPage.tsx`
- `pages/OnboardingPage.tsx`

### Değişecek
- `components/shell/AppShell.tsx` — full-width
- `components/shell/TopNav.tsx` — tomoshibi + hanabira + dan
- `pages/LearnJapanesePage.tsx` — snake + branching + mevsim
- `pages/PracticePage.tsx` — Combo Arena
- `pages/LettersPage.tsx` — mastery heatmap
- `pages/QuestsPage.tsx` — 3 zaman dilimi
- `shared/ui/tokens.css` — washi, tomoshibi, dan, ki tokens

---

## Korunanlar
- Spaced repetition (mastery sisteminin altında)
- Kana içeriği ve ses sistemi
- Sakura renk paleti (tema olarak güçlendirilir)
- MobileBottomBar

## Duolingo'dan Kasıtlı Ayrışma Özeti

| Mekanik | Duolingo | Kototsuna |
|---|---|---|
| Streak | 🔥 fire | 灯 tomoshibi (görsel evrim) |
| XP | gem | 花 hanabira (sakura yaprağı) |
| Tier | Bronze→Diamond lig | Dan/Kyū rütbe (dövüş sanatı) |
| Heart | Kalp (cezalandırıcı) | Ki (azaltır kazancı, durdurmaz) |
| Combo | Yok (sadece XP boost gizli) | 連続 görünür, shield, mushin |
| Path | Lineer | Branching checkpoint'ler |
| Boss | Yok | Dōjō haftalık async boss |
| PvP | Real-time pressure | Async duel |
| Lig | Haftalık (anksiyete) | Aylık dan salonları (yumuşak) |
| Mascot | Pushy baykuş | Sessiz Sensei (kaligrafi) |
| Bildirim | Guilt-trip | Davet, nesnel |
| Streak break | "💔 You broke your streak" | "灯 söndü — yeniden yak" |
| Mastery | Gizli | Heatmap, Forge sayfası |
| Sosyal | Comments (toxic) | Reaksiyon emoji (sınırlı) |
| Atmosfer | Düz yeşil, cartoon | Washi doku, mevsim, sumi-e |

**Bu plan Duolingo'nun her dopamin tetikleyicisini yeniden inşa ediyor — ama her birini Japon kültürel bağlamında yeniden çerçeveliyor.** Sonuç: aynı bağımlılık, taklit hissi yok.

---

## Test Kriterleri

1. **Onboarding**: yeni kullanıcı 90 sn içinde ilk dopamin (flyUp) yaşar
2. **Combo**: 10 doğru → ekrana yaprak yağışı tetiklenir
3. **Ki**: 5 yanlış sonrası oyun durmaz, %50 modu aktifleşir
4. **Mastery**: kana grid heatmap toggle çalışır, tooltip son 5 cevabı gösterir
5. **Branching**: Learn checkpoint'te 2 yol seçilebilir, sonradan birleşir
6. **Mevsim**: ilkbahar (Mart-Mayıs) sakura aktif, kış kar
7. **Quests**: günlük claim → flyUp + ses + vibrate + next preview
8. **Streak break**: 灯 söndü mesajı **suçluluk üretmez**, davet eder
9. **Dōjō**: haftalık boss açılır, async damage birikir
10. **Bildirim**: kullanıcının ortalama saatine ±15 dk geliyor
