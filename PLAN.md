# Kototsuna Kana Rebuild Plan

## Summary

Plan, buyuk tek hamleler yerine kucuk ve merge edilebilir fazlara bolunur.

Uygulama sirasi:

- Phase 0: shell kararlarini sabitle ve zemin hazirla
- Phase 1x: navbar, footer, route shell
- Phase 2x: home ve kana giris/overview deneyimi
- Phase 3x: progress, session, review motoru
- Phase 4x: words, stats, final baglama

Ana sabitler:

- UI first onceligi korunur
- renk paleti korunur
- navbar yuksekligi korunur
- kana table yapisi korunur
- top-level IA `Home / Study / Test / Play / Search / Account` cizgisine tasinir
- kanji ilk surumde placeholder/overview seviyesinde kalir

## Current Status

- Route-based app shell aktif ve ana navigation route-first calisiyor.
- Desktop navbar rewrite fiilen tamamlandi; mobile navbar ve footer da aktif.
- Home page foundation tamamlandi.
- Kana domain/persistence foundation tamamlandi.
- Learn/review/weak/confusable akislari gercek veriyle calisiyor.
- Session engine entegrasyonu typing/drawing/listening tarafinda ortak orchestration katmanina tasindi.
- Word API tarafinda server-side filter/pagination ve ek endpointler var, ama UI entegrasyonu parcali.
- Proje UI-first siralamada Phase 2c ve Phase 3b kapanisina ulasip Phase 4a UI tamamlama adimina gecmis durumda.
- Kalan acik ana konu, word tarafinda pack/detail endpointlerinin tum ilgili UI akislarinda tutarli kullanimi ve preload desenlerinin azaltilmasi.

## Phase 0 - Shell Prep

Durum: Done

Amac:

- app shell yonunu sabitlemek
- plan ve hedef belgelerini ayni IA uzerinde hizalamak
- navbar/footer icin data-driven icerik modelini tanimlamak

Teslimatlar:

- `PLAN.md` ve `KANA_REBUILD_TARGET.md` ayni IA kararlarini yansitir
- route-first yaklasim sabitlenir
- kanji placeholder karari sabitlenir
- top-level navigation kategorileri sabitlenir
- navbar ve footer icin data-driven icerik modeli tanimlanir

Kabul kriterleri:

- shell degisiklikleri baslamadan once IA karari nettir
- eski `hiragana / katakana / kanji` top-level tab sistemi artik hedef mimari degildir

## Phase 1a - Router Skeleton

Durum: Mostly done

Amac:

- state tabanli ana gezinmeyi route tabanli shell'e tasimak

Teslimatlar:

- app shell route tabanli hale getirildi
- `/` home route'u aktif
- hiragana/katakana overview route'lari aktif
- kanji placeholder/overview route'u aktif
- eski entry path'lerinin bir kismi redirect ile yeni route'lara baglandi

Kabul kriterleri:

- URL ile ana kana entry'lerine ulasilabiliyor
- kalan acik: canonical route yapisi ve redirect/fallback temizligi tamamlanmali

## Phase 1b - Desktop Navbar Rewrite

Durum: Done

Amac:

- desktop navbar'i yeni urun IA'sina gecirmek

Teslimatlar:

- top-level item'lar script isimlerinden urun alanlarina doner
- desktop dropdown sistemi eklenir
- dropdown icinde `Hiragana / Katakana / Kanji`, gerekli yerde `Kana` grubu gosterilir
- dropdown genisligi navbar sinirini asmaz
- navbar yuksekligi korunur

Kabul kriterleri:

- desktop navbar artik script tab bar gibi gorunmez
- dropdown paneli nav ile bagli ve kompakt hissedilir

## Phase 1c - Mobile Navbar and Footer Rewrite

Durum: Mostly done

Amac:

- shell navigasyonunu mobil ve footer tarafinda tamamlamak

Teslimatlar:

- mobile navbar yeni IA ile uyumlu hale gelir
- mobile navigation sade ama bilgi mimarisine uygun olur
- footer cok sutunlu bilgi merkezi olarak yeniden kurulur
- footer link kolonlari urunun farkli alanlarina gecis sunar

Kabul kriterleri:

- mobilde navigation hala erisilebilir kalir
- footer dekoratif degil, gercek navigasyon merkezi olur
- kalan acik: nav/footer linklerinin placeholder veya redirect/fallback'e dusen kisimlari temizlenir

## Phase 2a - Home Page Foundation

Durum: Done

Amac:

- urune guclu bir giris katmani eklemek

Teslimatlar:

- yeni home page yapilir
- home, urunun ne oldugunu ve hangi sistemlere sahip oldugunu anlatir
- `Study / Test / Play` mantigi aciklanir
- script bazli hizli giris bloklari eklenir

Kabul kriterleri:

- kullanici home'dan urunun ana yapisini anlayabilir
- home mevcut overview'in tekrari gibi hissettirmez

## Phase 2b - Kana Overview Rewrite

Durum: Mostly done

Amac:

- calisma hakkinda bilgi alma ve calisma baslatma deneyimini duzeltmek

Teslimatlar:

- hiragana ve katakana overview ekranlari yeniden kurulur
- `Next Learn / Due Reviews / Weak Items / Confusables / Quick Start / Overall Mastery` bloklari eklenir
- CTA'lar bilgi bloklarindan ayrilir
- kana table korunur, etrafindaki giris katmani yeniden tasarlanir

Kabul kriterleri:

- kullanici overview'de ne okuyacagini ve neye tiklayacagini anlar
- calisma baslatma alani daha guclu ve aciklayici olur
- kalan acik: overview'den baslatilan akislarin ana yolu local state degil route uzerinden calismalidir

## Phase 2c - Study/Test/Play Entry Mapping

Durum: Done

Amac:

- yeni IA ile kana ekranlari arasindaki urun koprulerini kapatmak ve UI-route tutarliligini bitirmek

Teslimatlar:

- overview/start aksiyonlarinda local activeView gecislerinin ana yol olmaktan cikarilmasi
- overview CTA aksiyonlarinin route-driven hale getirilmesi
- `Study / Test / Play` dropdown, overview CTA ve footer mapping'inin ayni route gercegine baglanmasi
- hiragana ve katakana icin study/test/play haritasinin off-plan baglarinin temizlenmesi
- kanji tarafinin placeholder kapsaminda acik ve tutarli kalmasi
- placeholder/redirect/fallback dongulerinin Phase 2 beklentisi olan destinasyonlarda temizlenmesi

Kabul kriterleri:

- kullanici top nav'dan urun akislarini anlayarak ilgili kana alanina dogrudan gidebilir
- navigation, footer ve overview CTA'lari birbirini route seviyesinde dogru tamamlar
- URL/back-forward davranisi ana calisma girislerinde tutarli calisir

## Phase 3a - Kana Domain and Persistence Foundation

Durum: Done

Amac:

- ogrenme motorunun veri temelini kurmak

Teslimatlar:

- `KanaItem`, `KanaProgress`, `ReviewEntry`, `StudySession`, `WordPack` ayrilir
- `progressRepository` ve `sessionRepository` abstraction'lari tanimlanir
- ilk surum local-first persistence kurulur
- inventory client-side kalir

Kabul kriterleri:

- progress verisi best-score mantigindan ayrilir
- session ve progress kaliciligi icin ortak kontratlar vardir

## Phase 3b - Session Engine Integration

Durum: Done

Amac:

- typing, drawing ve listening'i ortak ogrenme pipeline'ina baglamak

Teslimatlar:

- typing, drawing ve listening tarafinda session olusturma/guncelleme/tamamlama aktif
- session sonunda progress guncellemesi aktif
- session resume aktif
- modlar arasi ortak session orchestration katmani aktif

Kabul kriterleri:

- session yarim birakilip geri acilabilir
- ayni session pipeline kurgusu modlar arasi tekil katman uzerinden calisir

## Phase 3c - Review, Weak, Confusable

Durum: Done (stabilizasyon acik)

Amac:

- ogrenme motorunun kullaniciya gorunen akilli tarafini acmak

Teslimatlar:

- learn path uygulanir
- review queue calisir
- weak item mantigi calisir
- confusable seed setleri ve drill akisi eklenir
- `learn / review / weak / confusable` sayfalari gercek veriye baglanir
- item detail ekrani acilir

Kabul kriterleri:

- kullanici yeni karakter, due review, weak item ve confusable akislarini ayri ayri gorebilir
- yanlis yapilan item'ler kaybolmaz

## Phase 4a - Word API Refactor

Durum: Done

Amac:

- kelime tarafini olceklenebilir hale getirmek

Teslimatlar:

- `/api/words` server-side filter + pagination destekliyor
- `/api/word-packs` ve `/api/words/:id` endpointleri mevcut
- dictionary panelinde pagination aktif
- dictionary panelinde pack secimi ve word detail endpoint entegrasyonu aktif
- script/kana path/kana item ekranlarinda bulk preload yerine ihtiyac odakli sorgu deseni aktif

Kabul kriterleri:

- dictionary buyuk word pool'da da hizli kalir
- sorgu, filtre ve pagination backend uzerinden yurur
- pack tabanli UI akislari dictionary panelinde net ve uca bagli calisir

## Phase 4b - Word Bridge and Stats

Durum: Done (stabilizasyon acik)

Amac:

- kana ogrenimini gercek kullanim ve olcum katmanina baglamak

Teslimatlar:

- kana -> word bridge'in ilk katmani aktif (item detail ve ilgili kelime baglari)
- stats ekrani aktif
- curated word packs server tarafinda mevcut
- curated pack akislari dictionary panelinde secilebilir ve calisma akislarina bagli
- word listening audio icin google-translate words yolu + fallback stratejisi uygulandi

Kabul kriterleri:

- her karakter yalniz gorunmez; kelime bagi da sunar
- stats gercek progress verisini yansitir
- word listening yarim calisan durum birakmaz

## Immediate Next Step

Bir sonraki odak, 4a/4b kapanislarindan sonra stabilizasyon ve son mile polish adimlaridir.

- Word listening audio varlik kapsamini genisletip fallback hit oranini takip et.
- Kana item ve path ekranlarinda word sorgu limitlerini gercek kullanim metriklerine gore ince ayarla.
- End-to-end smoke/regression checklist'i ile study/test/play + words akislarinin tum rotalarda tutarli oldugunu dogrula.
