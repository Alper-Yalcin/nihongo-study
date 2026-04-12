# Kotonoha Kana Rebuild Target

## Amac

Bu belge, Kotonoha'nin kana tarafini yeniden kurarken ulasilmasi gereken urun hedeflerini, teknik yonu ve zorunlu feature kapsamlarini tek yerde toplar.

Ana hedef:

- Kotonoha'yi "cok modlu kana araci" yapisindan cikarip "ogrenciyi yonlendiren, ilerlemeyi takip eden, review uretebilen, kelimeye bag kuran kana ogrenme sistemi" haline getirmek

Bu rebuild'in odagi yeni mod eklemek degil, ogrenme omurgasini kurmaktir.

## Temel Sorular

Sistem su sorulara cevap verebilmelidir:

- Bugun ne calismaliyim?
- Hangi karakterlerde zayifim?
- Hangi karakterler tekrar bekliyor?
- Hangi grubu tamamladim?
- Typing, drawing veya listening tarafinda nerede daha zayifim?
- Hangi karakterleri birbiriyle karistiriyorum?
- Hangi karakterleri kelime icinde taniyorum, hangilerini sadece tek basina biliyorum?

## Urun Prensipleri

- Mode-first degil progress-first dusun
- Kullaniciya sadece arac verme, yon ver
- Random tekrar yerine nedenli review kullan
- Kana ogrenimini soyut bir karakter calismasi olarak birakma, kelimeye bagla
- Tek skor yerine ogrenme durumu takip et
- Mevcut degerli teknik varliklari koru
- Ilk surumde kapsami kucuk tut, cekirdegi saglam kur

## Kapsam

Bu hedef dosyasi sadece kana rebuild kapsamindadir.

Kapsam dahilinde:

- Hiragana
- Katakana
- Kana progress sistemi
- Learn path
- Review queue
- Weak item mantigi
- Confusable drill mantigi
- Session engine
- Curated word packs
- Kana -> word bridge
- Basit stats

Kapsam disinda:

- Agir gamification
- Achievement sistemi
- Account sync
- Tam olgun SRS algoritmasi
- AI ogretmen
- Buyuk dictionary browse urunu
- Karmafik dashboard animasyonlari

## Korunacak Mevcut Teknik Varliklar

- Kana inventory verisi
- Drawing evaluator
- Typing normalization ve accepted answer mantigi
- NHK guide image hatt i
- Kana audio hatt i
- Mevcut typing, drawing ve listening bile senlerinin yeniden kullanilabilir kisimlari

## Ana Urun Akisi

Sistemin cekirdek ogrenme akisi su olmalidir:

1. Learn
2. Reinforce
3. Measure
4. Review
5. Word Bridge

Detay:

- Learn: yeni karakterleri kontrollu sirayla acar
- Reinforce: typing, drawing ve listening ile pekistirir
- Measure: weak ve confusable drill'lerle gercek ogrenmeyi yoklar
- Review: due item mantigiyla unutulanlari geri getirir
- Word Bridge: karakteri kolay kelime ve ses baglamina tasir

## Ilk Surumde Zorunlu Ozellikler

- Hiragana ve katakana coverage
- Character progress tracking
- Learn path
- Daily review queue
- Weak item detection
- Confusable drills
- Route tabanli ekran yapisi
- Resume edilebilir session
- Curated beginner word packs
- Server-side word search
- Kana item detail sayfasi
- Basit stats paneli
- Basit mastery gorunumu
- Kana -> word bridge

## Ilk Surumde Yapilmayacaklar

- Achievement sistemi
- Rozetler
- Study coupon mantigi
- Account tabanli cloud sync
- AI correction veya AI tutor
- Tam dictionary platformu
- Yuksek maliyetli audio/content uretimi
- Word listening, audio tamamlanmadan aktif edilmeyecek

## Mimari Hedef

Eski yaklasim:

- Ekran bazli
- State bazli gecis
- Moduller birbirinden bagimsiz
- Best score var ama learning state yok

Yeni yaklasim:

- Learning-engine bazli
- Progress merkezli
- Review queue merkezli
- Session engine ortak
- Route tabanli
- Moduller ana urun degil, ogrenme akisinin parcasi

## Domain Modeli

### KanaItem

Her karakter icin temel kayit.

Alanlar:

- id
- script
- char
- romaji[]
- type
- sectionId
- groupId
- strokeCount
- drawingMetadata
- audioKey
- guideImageKey
- exampleWordIds[]

### KanaProgress

Her karakter icin ogrenme durumu.

Alanlar:

- kanaId
- state
- masteryScore
- recognitionScore
- typingScore
- drawingScore
- listeningScore
- timesSeen
- timesCorrect
- timesWrong
- lastSeenAt
- lastCorrectAt
- lastWrongAt
- nextReviewAt
- confusedWith[]

Not:

- Bu model tek source of truth anlayisiyla tasarlanacak
- State ve mastery, session verilerinden tutarli sekilde guncellenecek

### ReviewEntry

Review kuyrugu icin.

Alanlar:

- kanaId
- priority
- reason
- dueAt
- sourceMode
- createdAt

### StudySession

Aktif veya tamamlanmis session icin.

Alanlar:

- id
- type
- script
- mode
- itemIds[]
- currentIndex
- startedAt
- completedAt
- config
- resultsSummary

### WordPack

Filtrelenmis kelime setleri icin.

Alanlar:

- id
- script
- title
- level
- category
- kanaIds[]
- wordIds[]
- estimatedDifficulty

## Curriculum Hedefi

Curriculum dosyasi acik ve degistirilebilir olmalidir.

### Hiragana Sirasi

- vowels
- k group
- s group
- t group
- n group
- h group
- m group
- y group
- r group
- w and n
- dakuten
- handakuten
- yoon
- small tsu usage

### Katakana Sirasi

- basic vowels
- base rows
- dakuten
- yoon-like combinations
- long vowel patterns
- extended katakana

## Progress State Hedefi

State modeli:

- new
- learning
- weak
- known
- mastered

Temel gecis beklentileri:

- Yeni gorulen item new -> learning olur
- Tutarli dogru cevaplar learning -> known yapar
- Farkli modlarda tutarli basari known -> mastered yapar
- Tekrarlanan hatalar weak'e dusurur
- Uzun sure sonra yapilan hata item'i tekrar weak tarafina cekebilir

## Review Queue Hedefi

Review queue random olmamali, nedenli calismalidir.

Queue'ya item ekleme nedenleri:

- yeni ogrenen item
- yanlis cevaplanan item
- weak item
- overdue item
- confusable set icindeki item
- belirli modda zayif olan item

Overview ekraninda kullaniciya gosterilecek ozet:

- due review count
- weak item count
- confusable drill count
- next learn group

## Session Engine Hedefi

Tum calisma akislarinin ortak session mantigi olmalidir.

Session tipleri:

- learn
- review
- weak_drill
- confusable_drill
- checkpoint_test
- speed

Session modlari:

- typing
- drawing
- listening
- mixed

Her soru icin ortak event bilgisi:

- item shown
- answer submitted
- correct or incorrect
- latency
- retries
- hints used
- mode

Session sonunda sistem sunlari gunceller:

- progress
- review queue
- weak item durumu
- confusable evidence
- today stats
- session summary

## Route Hedefi

Ana route yapisi:

- /kana
- /kana/:script/overview
- /kana/:script/learn
- /kana/:script/review
- /kana/:script/weak
- /kana/:script/confusable
- /kana/:script/words
- /kana/:script/stats
- /kana/item/:kanaId
- /kana/session/:sessionId

Not:

- Typing, drawing ve listening gerekirse tool-level veya helper route olabilir
- Ama ana IA overview -> learn -> review -> weak -> confusable -> stats olmali

## Ekran Hedefleri

### Overview

Gosterilecek bloklar:

- Today's Reviews
- Next Learn Group
- Weak Items
- Confusable Kana
- Quick Start
- Overall Mastery
- Recent Mistakes
- Completed Groups

### Learn Screen

Gosterilecekler:

- bugunku yeni karakterler
- karakter karti
- romaji
- ses
- stroke rehberi
- guide image
- ornek kelime
- mini typing checkpoint
- mini drawing checkpoint

### Review Screen

Gosterilecekler:

- due queue
- mixed review akisi
- priority tabanli sira
- session ilerleme ozeti

### Weak Screen

Gosterilecekler:

- en cok hata yapilan karakterler
- hangi modda zayif oldugu
- son 7 gun hata gorunumu
- en cok karistigi karakter

### Confusable Screen

Ilk surum seed setleri:

- シ / ツ
- ソ / ン
- あ / お
- ぬ / め
- さ / ち

Bu ekran:

- benzer karakterleri yan yana gostermeli
- typing, recognition ve gerekirse drawing mini drill sunmali

### Item Detail Screen

Her kana icin:

- karakter
- romaji
- group bilgisi
- section bilgisi
- ses butonu
- stroke bilgisi
- guide image
- ornek kelimeler
- mastery durumu
- weak veya known etiketi
- en cok karistigi karakter
- hizli test baslat butonu

### Stats Screen

Ilk surumde basit olacak:

- today studied
- reviews done
- weakest groups
- recent mistakes
- mastery distribution
- completed sections

## Dictionary ve Word Sistemi Hedefi

### Teknik Hedef

- Tum kelimeleri tek seferde client'a cekme modeli kaldirilacak
- Search, filter ve pagination server-side olacak

### Zorunlu Endpoint Davranisi

GET /api/words parametreleri:

- script
- query
- mode
- level
- packId
- limit
- offset

GET /api/word-packs donmeli

GET /api/words/:id kelime detayini donmeli

### Ilk Curated Word Packs

- Hiragana Beginner Core 1
- Hiragana Beginner Core 2
- Everyday Basics
- Katakana Loanwords Basic
- Food and Drink
- Travel and Transport

### Kana -> Word Bridge

Her karakter icin:

- 3-5 uygun kelime
- kolaydan zora secim
- mumkunse sesle bag kurabilen en az bir ornek

## Listening Politikasi

Iki net kural:

- Character listening tam desteklenecek
- Word listening audio hazir degilse aktif edilmeyecek

Yarim calisan audio deneyimi urunde tutulmayacak.

## Persistence Hedefi

Ilk surumde local-first ilerlenebilir.

Beklentiler:

- progress repository abstraction
- session repository abstraction
- local persistence implementasyonu
- ileride server sync'e acik tasarim

Ilk surumde zorunlu:

- progress kaybi olmamasi
- session resume calismasi
- review queue kalici olmasi

## Backend Hedefi

Server tarafinda gerekli alanlar:

- word filtering
- word pagination
- word packs
- gerekirse progress sync icin API zemini

Ilk surumde gereksiz olanlar:

- kana inventory API
- answer-bazli network zorunlulugu

Kana inventory client-side kalabilir.

## Klasor Yapisi Hedefi

Frontend hedef yapisi:

- src/features/kana/domain
- src/features/kana/data
- src/features/kana/progress
- src/features/kana/review
- src/features/kana/session
- src/features/kana/modes
- src/features/kana/lexicon
- src/features/kana/routes
- src/features/kana/components

Backend hedef yapisi:

- server/modules/kana

## Teknik Oncelik Sirasi

1. domain model separation
2. progress store
3. review queue
4. session engine connection
5. learn path
6. route refactor
7. word API refactor
8. curated packs
9. stats
10. polish

## Sprint Hedefleri

### Sprint 1

Odak:

- ogrenme omurgasi

Zorunlu ciktilar:

- domain ayrimi
- progress store
- mastery state guncelleme
- review queue
- session sonucunun progress'e yazilmasi
- local persistence
- overview'de due ve weak ozetleri
- temel testler

### Sprint 2

Odak:

- yonlendirilmis urun deneyimi

Zorunlu ciktilar:

- route refactor
- learn page
- review page
- weak page
- confusable page
- item detail page
- session resume
- mastery lite gorunumu

### Sprint 3

Odak:

- kelime bagi ve olceklenebilirlik

Zorunlu ciktilar:

- word API filtreleme
- pagination
- curated packs
- kana -> word bridge
- dictionary rebuild
- word listening karari
- stats page tamamlanmasi

## Basari Olcutleri

Urun:

- kullanici due review'e donuyor mu
- learn path izleniyor mu
- weak item ekranina gecis oluyor mu
- session resume calisiyor mu

Ogrenme:

- weak item recovery rate
- confusable hata orani dusuyor mu
- new -> known gecis orani
- mod bazli zayifliklar ayristirilabiliyor mu

Teknik:

- word search response suresi kabul edilebilir mi
- initial load daha hafif mi
- session restore stabil mi
- dictionary performansi katakana tarafinda bozulmuyor mu

## Sabit Kural

Bu rebuild sirasinda ana kural:

- Yeni mod ekleme
- Once progress, review, learn path ve curated content omurgasini kur

Typing, drawing, listening ve dictionary korunacak; ama bunlar artik urunun kendisi degil, urunun kullandigi ogrenme araclari olacak.
