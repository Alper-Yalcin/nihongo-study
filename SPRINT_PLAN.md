# Kototsuna Sprint Plan

**Referans**: [REDESIGN_PLAN.md](REDESIGN_PLAN.md)
**Toplam süre**: 4 sprint × 5 iş günü = 20 iş günü (~4 hafta)
**Strateji**: Vertical slice — her sprint sonunda **kullanılabilir, test edilebilir** bir bütün çıkar. Phase'ler sıralı ama her sprint kendi içinde demo-edilebilir.

---

## Sprint Stratejisi

### İlke 1: Omurga Önce
**Combo & Ki sistemi (Phase 2)** Sprint 1'de tamamlanır — diğer tüm sayfalar bu hook'a bağlanacak. Omurga gecikirse her şey gecikir.

### İlke 2: Hissiyat Erken
Sprint 1 sonunda **dopamin loop hissedilebilir** olmalı (combo + flyUp + ses). Visual polish sonra; mekanik önce.

### İlke 3: Risk Önde
- Yüksek risk / yüksek belirsizlik işler (ses sistemi, animasyon performansı, mevsim arka plan) **erken sprint'lerde** denenir.
- Düşük risk işler (profil sayfası, bildirim) sona.

### İlke 4: Demo-able Increments
Her sprint sonunda demo: "şunu aç, şunu yap, şu hisset". Soyut "altyapı bitti" demosu yok.

### İlke 5: Buffer
Her sprint'in 5. günü **hardening** — bug fix, polish, test. Yeni feature başlama.

---

## Sprint Dağılımı (Üst Bakış)

| Sprint | Tema | Çıktı | Demo |
|---|---|---|---|
| **S1** | Omurga & Hissiyat | Layout + Combo/Ki + Mastery temeli | "Pratik yap, combo yükselt, yaprak uçur" |
| **S2** | Öğrenme Yolculuğu | Learn snake + Practice arena + Letters heatmap | "Yolculukta ilerle, zayıfları forge'la" |
| **S3** | Geri Gelme Mekaniği | Quests 3-katman + Tomoshibi + Loss aversion | "Streak yak, sezon ödülü gör" |
| **S4** | Sosyal & Identity | Meydan + Profil + Onboarding + Bildirim | "Yeni kullanıcı 90sn → ilk dopamin" |

---

## SPRINT 1 — Omurga & Hissiyat
**Hedef**: Bir kullanıcı combo yapıp yaprak uçurabilmeli, ki harcayabilmeli, mastery delta görebilmeli.

### Day 1 — Foundation
- [ ] `AppShell.tsx` — 3-kolon kaldır, full-width grid
- [ ] `LeftNav` `hidden`, `RightRail` AppShell'den çıkar
- [ ] `tokens.css` — washi, tomoshibi-glow, dan-gold, ki-blue tokens
- [ ] `appShellContent.ts` — "Play" → "Meydan"
- **DoD**: Sayfa açılır, layout çakılma yok, tema renkleri görsel olarak doğru.

### Day 2 — Feedback Hook (Omurga)
- [ ] `shared/hooks/useFeedback.ts` — combo, ki, hanabira state + persist (localStorage)
- [ ] Combo logic: 3/5/10/20 eşikleri, multiplier
- [ ] Ki logic: 5 max, yanlış -1, 10dk +1, 5-combo'da +1, 0'da %50 mod
- [ ] Shield: oturum başına 1, ilk yanlışta tetiklenir
- **DoD**: Hook unit test edilebilir, console'dan API kullanılabilir.

### Day 3 — Feedback Visual Layer
- [ ] `ComboIndicator.tsx` — sağ üst, ×3/×5/×10 görsel eşikleri
- [ ] `KiBar.tsx` — 5 nokta, mavi (ki), yanmış olanlar solgun
- [ ] `HanabiraFly.tsx` — 1-8 yaprak fizik tabanlı animasyon
- [ ] `sounds.ts` — shoji, mizu, koto sesleri (placeholder OK), Web Audio API
- [ ] Navbar'a tomoshibi + hanabira + dan rozeti yerleştir
- **DoD**: Manuel trigger ile combo göstergesi çalışır, yaprak uçar, ses çıkar.

### Day 4 — Mastery Sistemi
- [ ] `data/masterySystem.ts` — kana başına 0-100 hesaplama (doğru/yanlış + recency)
- [ ] Mevcut bir pratik sayfasında (en küçüğü) `useFeedback` entegre et — gerçek combo kazanılsın
- [ ] Mastery delta gösterimi: oturum sonu "ね 72 → 81 (+9)"
- **DoD**: Bir pratik oturumunda combo yükselir, ki azalır, mastery ilerler, ekrana sayılar yansır.

### Day 5 — Hardening
- [ ] Combo edge case'leri (network gecikme, race condition)
- [ ] Ses prefetch + autoplay policy fallback
- [ ] Animasyon performans (60fps mobile)
- [ ] localStorage migration güvenliği
- [ ] Sprint demo

### Sprint 1 Definition of Done
✅ Bir kullanıcı tek bir pratik sayfasında: doğru cevaplar verince combo yükseliyor, yanlışta ki azalıyor, oturum sonu hanabira uçuyor, mastery delta görünüyor. Layout temiz, washi doku arkada.

### Riskler
- **Ses autoplay policy** (Safari/iOS) — Day 3 spike yapılmalı
- **Animasyon performansı** — yaprak yağışı 60fps tutmalı; canvas mı CSS mi karar Day 3'te

---

## SPRINT 2 — Öğrenme Yolculuğu
**Hedef**: Learn'de path interaktif, branching checkpoint var. Practice "Combo Arena". Letters mastery heatmap.

### Day 1 — Learn Snake Path (Statik)
- [ ] Node tipleri: Mission/Challenge/Checkpoint/Bonus — 4 tip component
- [ ] Node state: active/completed/locked + görsel
- [ ] Statik zigzag layout, `nodePositions` state
- [ ] Tamamlanan path renklenir (sumi-e mürekkep akış efekti)
- **DoD**: Path render olur, node tipleri ayırt edilir, state değişimi görsel.

### Day 2 — Learn İnteraktivite & Drawer
- [ ] Aktif node breathe animasyonu (2s loop)
- [ ] Node click → bounce (50ms) + glow (500ms)
- [ ] Right drawer (`min(90vw, 400px)`, ESC, backdrop)
- [ ] Drawer içerik: ders detay, başla CTA
- **DoD**: Tıklanabilir, drawer responsive, 375px'te taşma yok.

### Day 3 — Branching & Mevsim
- [ ] Checkpoint'te 2 yol (sol/sağ) — sonra birleşir
- [ ] Yol seçimi state'e kaydedilir
- [ ] Mevsim arka plan: tarih → mevsim mapping (ilkbahar/yaz/sonbahar/kış)
- [ ] Mevsim asset'leri (sakura/matsuri/yaprak/kar) — CSS only veya hafif SVG
- **DoD**: Bir checkpoint'te 2 yol görülür, bugün ilkbaharsa sakura aktif.

### Day 4 — Practice Combo Arena & Letters Heatmap
- [ ] `PracticePage.tsx` — primary "Hızlı başlat" CTA + 4 mod kart
- [ ] Saate göre arka plan değişimi (sabah/öğle/akşam/gece)
- [ ] `LettersPage.tsx` — kana hücre arka plan mastery rengine bağlı
- [ ] "Zayıflarım" toggle — <40 mastery parlar
- [ ] Hücre tooltip — mastery + son 5 cevap
- **DoD**: Practice'te primary CTA glow, Letters'ta heatmap toggle çalışır.

### Day 5 — Forge & Hardening
- [ ] `pages/ForgePage.tsx` — zayıf kana otomatik oturum
- [ ] Forge sonu mastery delta listesi
- [ ] Bug fix, polish, sprint demo

### Sprint 2 DoD
✅ Learn'de tıklanabilir snake path, branching, mevsim arka plan. Practice combo arena. Letters heatmap. Forge sayfasıyla zayıf drill. Combo hook her yerde aktif.

### Riskler
- **SVG path animasyonu** vs CSS — Day 1'de karar
- **Mevsim asset boyutu** — CSS-only zorla; SVG/PNG sadece gerekirse

---

## SPRINT 3 — Geri Gelme Mekaniği
**Hedef**: Quests 3-katman, tomoshibi evrimi, nazik loss aversion, sezon konsepti.

### Day 1 — Quests Günlük & Reward Sequence
- [ ] `QuestsPage.tsx` — günlük 3 görev, 06:00 reset
- [ ] Anticipation buton (claim öncesi pulse + altın glow)
- [ ] Claim sequence: flyUp (8 yaprak) + koto sesi + vibrate(50)
- [ ] Next reward preview component
- [ ] "Tümünü Al" toplu claim
- **DoD**: Claim full sequence çalışıyor, preview görünüyor.

### Day 2 — Quests Haftalık & Sezonluk
- [ ] Haftalık 7-gün ızgarası, 5/7 ve 7/7 ödülleri
- [ ] Kanpeki rozeti — ki max +1 kalıcı buff
- [ ] Sezonluk 90-gün konsepti, sezon progress bar
- [ ] Sezon sticker koleksiyonu (statik liste, kazanım logic'i)
- **DoD**: Üç zaman dilimi de UI'da görünür, ödül akışları çalışır.

### Day 3 — Tomoshibi Evrimi & Streak
- [ ] Tomoshibi component — 1g/7g/30g/100g görsel evrimi (4 kademe)
- [ ] Heat calendar (365 gün GitHub commit grid tarzı)
- [ ] Streak freeze logic — hafta sonu otomatik 1 freeze
- **DoD**: Streak günü arttıkça tomoshibi görsel olarak büyür.

### Day 4 — Loss Aversion & Geri Davet
- [ ] 23:00 geçmişse "灯 zayıflıyor" mikro-banner (sayfa içi, push değil)
- [ ] Streak kırıldıysa açılışta "灯 söndü — yeniden yak" modal
- [ ] Yeniden yakma flow: 5 dk pratik → tomoshibi yenilenir
- **DoD**: Streak break sonrası ton yumuşak, çağrı net.

### Day 5 — Hardening & Sprint Demo
- [ ] Tarih/saat edge case'leri (timezone, gün dönüşü)
- [ ] localStorage migration (eski streak verisi)
- [ ] Sprint demo

### Sprint 3 DoD
✅ Üç katmanlı quest sistemi, evrilen tomoshibi, sezon konsepti, nazik loss aversion. Kullanıcı oturum kaçırsa bile "kötü hissetmeden" geri çağrılır.

---

## SPRINT 4 — Sosyal, Identity & Onboarding
**Hedef**: Yeni kullanıcı 90 sn'de ilk dopamin, mevcut kullanıcı dan/dōjō/duel ile sosyal kanca.

### Day 1 — Meydan Sayfası & Modlar
- [ ] `MeydanPage.tsx` — 4 mod kart (Speed/Timed/Dōjō/Duel)
- [ ] Speed Mode: streak +1 mekaniği
- [ ] Timed Challenge: hanabira ×2, 30dk TTL (context state)
- [ ] Duel & Dōjō yer tutucu UI (next sprint Phase için "Yakında" değil — minimum işleyen)
- **DoD**: Speed + Timed çalışıyor, mod aktiviteleri navbar'da yansıyor.

### Day 2 — Dōjō (Async Boss) & Dan Salonları
- [ ] `data/danSystem.ts` — 10. kyū → 1. dan eşikleri
- [ ] Dōjō: haftalık boss kana set, kümülatif damage (lokal sim — backend yoksa)
- [ ] Dan salonları: aynı dan'daki ~30 kişilik aylık leaderboard (mock data OK)
- **DoD**: Dōjō UI'da boss göstergesi var, dan rozeti navbar'da doğru gösteriliyor.

### Day 3 — Profil & Friends
- [ ] `ProfilePage.tsx` — dan rozeti, heat calendar, kana koleksiyonu, sticker shelf, mushin rozetleri
- [ ] `FriendsPage.tsx` — kullanıcı kodu sistemi, ekle/feed, 5 reaksiyon emoji
- [ ] Async duel davet flow
- **DoD**: Profil sayfası kişisel kimliği tam yansıtır, arkadaş eklenir.

### Day 4 — Onboarding (First 5 dk)
- [ ] `OnboardingPage.tsx` — 3 ekran Sensei intro (kaligrafi animasyon)
- [ ] First mission: 5 hiragana → quiz → 5/5 → flyUp + "10. kyū'ya hoş geldin"
- [ ] Bildirim izni soft prompt (sadece bu noktada)
- [ ] İlk gün quest set seed
- **DoD**: Yeni kullanıcı tamamen sıfırdan 90 sn içinde ilk büyük flyUp'ı yaşar.

### Day 5 — Bildirim Sistemi & Final Hardening
- [ ] Akıllı zaman: son 14 gün ortalama pratik saati
- [ ] Bildirim copy: davet tonu (REDESIGN_PLAN tablosu)
- [ ] Final QA: tüm 10 test kriteri (REDESIGN_PLAN.md test bölümü)
- [ ] Final demo

### Sprint 4 DoD
✅ Yeni kullanıcı onboard olur ve ilk dopamin yaşar. Mevcut kullanıcı meydanda dōjō/duel görür, profilde kimliğini görür, arkadaş ekler. Bildirim akıllı saatte gelir, ton nazik.

---

## Sprint Ritüelleri

### Daily Stand-up (15 dk, sabah)
1. Dün ne bitti?
2. Bugün ne hedefliyorum?
3. Engel var mı?

### Sprint Planning (Pazartesi sabah, 1 sa)
- Sprint hedefini netleştir
- Day 1-5 task'larını review et, gerekirse skopu ayarla
- Risk listesi güncelle

### Sprint Review (Cuma 16:00, 30 dk)
- Demo (yukarıdaki "demo-able" senaryolar)
- DoD kontrol
- Bir sonraki sprint'e taşınacaklar

### Sprint Retro (Cuma 17:00, 30 dk)
- Ne iyiydi / ne kötüydü / ne deneyelim
- Action item: max 2 (fazlası uygulanmaz)

---

## Definition of Done — Genel

Bir task "done" sayılması için:
1. ✅ Kod main'e merge oldu
2. ✅ TypeScript hatası yok (`tsc --noEmit`)
3. ✅ Manuel test edildi (mobile 375px + desktop 1280px+)
4. ✅ Dark + light tema çalışıyor
5. ✅ Combo/Ki/Hanabira hook'una bağlıysa, persist çalışıyor
6. ✅ Animasyon 60fps (mobile orta seviye cihaz)
7. ✅ Erişilebilirlik: keyboard nav + ARIA temel

---

## Risk Kayıt Defteri

| Risk | Olasılık | Etki | Azaltma |
|---|---|---|---|
| Ses autoplay policy (iOS Safari) | Orta | Yüksek | Sprint 1 Day 3 spike |
| Yaprak animasyonu mobile'da yavaş | Orta | Yüksek | Canvas fallback hazır |
| Mevsim asset boyutu | Düşük | Orta | CSS-only zorla |
| Backend gerektiren feature'lar (dōjō, duel) | Yüksek | Orta | Mock-first, lokal sim |
| Branching path UX karmaşası | Orta | Orta | Sprint 2 Day 3 user test |
| localStorage quota / migration | Düşük | Yüksek | Sprint 1 Day 5 schema versioning |

---

## Skopa Almayacaklar (Bu 4 Sprint Dışı)

Bu öğeler **bilinçli olarak** skopa alınmadı — sonraki sprintlere kalır:
- Backend / API (her şey lokal-first, mock data)
- Premium tier / payment
- A/B test altyapısı
- Detaylı analytics
- Çoklu dil UI (Türkçe sabit)
- Real-time PvP (sadece async duel var)
- Ses içerik (placeholder OK)

---

## Sprint Sonrası — Olası Sonraki Adımlar

Sprint 4 bittikten sonra ürün **MVP++** seviyesinde. Sonraki adaylar:
- Backend entegrasyonu (gerçek leaderboard, dōjō community damage)
- Sezon mekanik tam akış (sezon başı/sonu töreni)
- Push bildirim altyapısı (PWA / native)
- Detaylı analytics — funnel, retention metrik
- Ses içeriği (yerel ses sanatçısı, koto/shoji efektleri)
- A/B test: tomoshibi görsel evrimi etkisi vs flat streak sayısı
