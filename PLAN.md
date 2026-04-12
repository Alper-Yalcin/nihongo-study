# Kotonoha Kana Rebuild Plan

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

## Phase 0 - Shell Prep

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

Amac:

- state tabanli ana gezinmeyi route tabanli shell'e tasimak

Teslimatlar:

- app shell route tabanli hale getirilir
- `/` home route'u olur
- `/kana/:script/overview` route'lari eklenir
- kanji placeholder route'lari eklenir
- eski ekranlar gecici olarak yeni route'lara baglanir

Kabul kriterleri:

- URL ile ana kana entry'lerine ulasilabilir
- route degisimi artik sadece local component state'e bagimli degildir

## Phase 1b - Desktop Navbar Rewrite

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

Amac:

- shell navigasyonunu mobil ve footer tarafinda tamamlamak

Teslimatlar:

- mobile navbar yeni IA ile uyumlu hale gelir
- mobile navigation sade ama bilgi mimarisine uygun olur
- footer cok sutunlu bilgi merkezi olarak yeniden kurulur
- footer link kolonlari urunun farkli alanlarina gercek gecis sunar

Kabul kriterleri:

- mobilde navigation hala erisilebilir kalir
- footer dekoratif degil, gercek navigasyon merkezi olur

## Phase 2a - Home Page Foundation

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

## Phase 2c - Study/Test/Play Entry Mapping

Amac:

- yeni IA ile kana ekranlari arasindaki urun koprulerini tamamlamak

Teslimatlar:

- `Study / Test / Play` dropdown girisleri gercek route'lara baglanir
- hiragana ve katakana icin study/test/play haritasi netlesir
- kanji bu fazda hala placeholder seviyesinde kalir

Kabul kriterleri:

- kullanici top nav'dan urun akislarini anlayarak ilgili kana alanina gidebilir
- navigation ve overview CTA'lari birbiriyle celismez

## Phase 3a - Kana Domain and Persistence Foundation

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

Amac:

- typing, drawing ve listening'i ortak ogrenme pipeline'ina baglamak

Teslimatlar:

- ortak session event modeli kurulur
- typing, drawing ve listening sonuc verileri ortak scoring/update akisina baglanir
- session sonunda progress guncellenir
- session resume calisir

Kabul kriterleri:

- modlar bagimsiz skor ekranlari gibi calismaz
- session yarim birakilip geri acilabilir

## Phase 3c - Review, Weak, Confusable

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

Amac:

- kelime tarafini olceklenebilir hale getirmek

Teslimatlar:

- `/api/words` server-side filter + pagination destekler
- `/api/word-packs` ve `/api/words/:id` eklenir
- client tum kelimeleri tek seferde cekmeyi birakir

Kabul kriterleri:

- dictionary buyuk word pool'da da hizli kalir
- sorgu, filtre ve pagination backend uzerinden yurur

## Phase 4b - Word Bridge and Stats

Amac:

- kana ogrenimini gercek kullanim ve olcum katmanina baglamak

Teslimatlar:

- curated word packs eklenir
- kana -> word bridge eklenir
- dictionary yeni packs ile butunlesir
- stats ekrani tamamlanir
- word listening icin audio karari uygulanir

Kabul kriterleri:

- her karakter yalniz gorunmez; kelime bagi da sunar
- stats gercek progress verisini yansitir
- word listening yarim calisan durum birakmaz
