import { ScriptStudyView } from '../types';
import { AppLanguage } from '../data/appPreferences';

export type ScriptAccentTone = 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';

interface ScriptHeroAction {
  label: string;
  target: ScriptStudyView;
}

interface KanjiHeroAction {
  label: string;
  targetIndex: number;
}

interface FeatureCardCopy {
  title: string;
  description: string;
}

export interface ScriptOverviewTopic {
  id: string;
  title: string;
  lead: string;
  paragraphs: string[];
  learningPoints: string[];
  demoSrc: string;
  demoAlt: string;
  fallbackTitle: string;
  fallbackPath: string;
}

export interface ScriptOverviewDetailSection {
  id: string;
  accent: ScriptAccentTone;
  badge: string;
  title: string;
  description: string;
  features: string[];
  previewSrc: string;
  previewAlt: string;
  fallbackTitle: string;
  fallbackPath: string;
  actionLabel: string;
  detailsTitle: string;
  detailsIntro: string;
  mediaPosition: 'left' | 'right';
  topics: ScriptOverviewTopic[];
}

interface ScriptOverviewPageCopy {
  overviewTab: string;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    copy: string;
    primaryAction: ScriptHeroAction;
    secondaryAction: ScriptHeroAction;
  };
  featureCards: FeatureCardCopy[];
  stats: {
    sections: string;
    characters: string;
    words: string;
    modes: string;
  };
  sections: Record<ScriptStudyView, ScriptOverviewDetailSection>;
}

export interface KanjiOverviewTrack extends ScriptOverviewDetailSection {
  studyIndex: number;
}

interface KanjiOverviewPageCopy {
  overviewTab: string;
  studyTab: string;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    copy: string;
    primaryAction: KanjiHeroAction;
    secondaryAction: KanjiHeroAction;
  };
  featureCards: FeatureCardCopy[];
  stats: {
    tracks: string;
  };
  tracksTitle: string;
  tracksDescription: string;
  tracksAction: string;
  sections: KanjiOverviewTrack[];
}

interface ScriptCommonCopy {
  close: string;
  detailsLabel: string;
  gifHint: string;
  learningLabel: string;
}

interface ScriptLandingContent {
  common: ScriptCommonCopy;
  hiragana: ScriptOverviewPageCopy;
  katakana: ScriptOverviewPageCopy;
  kanji: KanjiOverviewPageCopy;
}

export const scriptLandingContent: Record<AppLanguage, ScriptLandingContent> = {
  tr: {
    common: {
      close: 'Kapat',
      detailsLabel: 'Detayli bilgi',
      gifHint: 'Detaylar icin alana tikla',
      learningLabel: 'Bu bolumde ne ogrenilir?'
    },
    hiragana: {
      overviewTab: 'Overview',
      hero: {
        eyebrow: 'Hiragana Overview',
        title: 'Hiragana Calisma Alani',
        lead: 'Hiragana modlarini once ozetle incele, sonra istedigin moda gec.',
        copy: 'Bu sayfa genel bakis duzeniyle hiragana modlarini GIF preview ve modal detaylarla anlatir. Preview alanina tiklayip modal acabilir, sonra ilgili moda dogrudan gecis yapabilirsin.',
        primaryAction: { label: 'Yazma modunu ac', target: 'typing' },
        secondaryAction: { label: 'Sozluk modunu ac', target: 'dictionary' }
      },
      featureCards: [
        { title: 'Temel setler', description: 'Tekli ve birlesik hiragana gruplarini duzenli tekrar et.' },
        { title: 'Aktif recall', description: 'Yazma ve cizim akisiyla karakteri kendin uret.' },
        { title: 'Ses baglantisi', description: 'Dinleme akisi, ses ve sekil arasindaki bagi guclendirir.' },
        { title: 'Kelime odagi', description: 'Sozluk tarafi, hiraganayi kelime seviyesine tasir.' }
      ],
      stats: { sections: 'Bolum', characters: 'Karakter', words: 'Kelime', modes: 'Mod' },
      sections: {
        typing: {
          id: 'typing',
          accent: 'indigo',
          badge: 'Calisma Modu',
          title: 'Yazma Pratigi',
          description: 'Hiragana karakterini gorup romajisini yazarak hizli okuma refleksi kur.',
          features: ['Kana -> romaji akisi', 'Skor ve sure takibi', 'Satir bazli tekrar'],
          previewSrc: '/gifs/typing-demo.gif',
          previewAlt: 'Hiragana typing preview',
          fallbackTitle: 'Hiragana Typing GIF',
          fallbackPath: '/gifs/typing-demo.gif',
          actionLabel: 'Yazma modunu ac',
          detailsTitle: 'Hiragana Yazma Pratigi',
          detailsIntro: 'Bu akis, hiragana karakterini sadece tanimani degil dogru romajiyi aktif olarak uretmeni ister.',
          mediaPosition: 'right',
          topics: [
            {
              id: 'hiragana-typing-core',
              title: 'Okuma refleksi kurma',
              lead: 'Amaç, karakteri gorur gormez cevabi bekletmeden uretmektir.',
              paragraphs: ['Kisa tekrar donguleri, hangi satirlarda yavasladigini aninda gosterir.', 'Bu da hiragana tarafinda okuma hizini ve dogrulugu birlikte toparlamayi kolaylastirir.'],
              learningPoints: ['Hiragana -> romaji bagini guclendirir', 'Benzer karakterleri ayirt etmeyi kolaylastirir', 'Ilerlemeyi skorlarla gorunur yapar'],
              demoSrc: '/gifs/typing-standard.gif',
              demoAlt: 'Hiragana typing detail',
              fallbackTitle: 'Hiragana Typing Standard GIF',
              fallbackPath: '/gifs/typing-standard.gif'
            }
          ]
        },
        drawing: {
          id: 'drawing',
          accent: 'emerald',
          badge: 'Calisma Modu',
          title: 'Cizim Pratigi',
          description: 'Hiragana karakterlerini cizerek formu ve stroke mantigini fiziksel olarak oturt.',
          features: ['Rehberli cizim', 'Hafizadan tekrar', 'El hafizasi odagi'],
          previewSrc: '/gifs/drawing-demo.gif',
          previewAlt: 'Hiragana drawing preview',
          fallbackTitle: 'Hiragana Drawing GIF',
          fallbackPath: '/gifs/drawing-demo.gif',
          actionLabel: 'Cizim modunu ac',
          detailsTitle: 'Hiragana Cizim Pratigi',
          detailsIntro: 'Cizim alani, karakter formunu gorsel tanimadan cikarip fiziksel uretim seviyesine tasir.',
          mediaPosition: 'left',
          topics: [
            {
              id: 'hiragana-drawing-core',
              title: 'Formu sabitleme',
              lead: 'Cizim, sekli daha kalici hale getirir.',
              paragraphs: ['Rehberli asama, karakter oranini dogru kurmaya yardim eder.', 'Hafizadan cizim ise gercekten neyi tuttugunu daha net gosterir.'],
              learningPoints: ['Stroke mantigini gorunur yapar', 'Gorsel hafiza ile el hafizasini birlestirir', 'Benzer karakter hatalarini azaltir'],
              demoSrc: '/gifs/drawing-practice.gif',
              demoAlt: 'Hiragana drawing detail',
              fallbackTitle: 'Hiragana Drawing Practice GIF',
              fallbackPath: '/gifs/drawing-practice.gif'
            }
          ]
        },
        listening: {
          id: 'listening',
          accent: 'rose',
          badge: 'Calisma Modu',
          title: 'Dinleme Pratigi',
          description: 'Sesi duyup dogru kana ya da cevaba ulasarak ses-sekil bagini guclendir.',
          features: ['Karakter ve kelime sesi', 'Recognition ve uretim akisi', 'Ses -> cevap baglantisi'],
          previewSrc: '/gifs/listening-demo.gif',
          previewAlt: 'Hiragana listening preview',
          fallbackTitle: 'Hiragana Listening GIF',
          fallbackPath: '/gifs/listening-demo.gif',
          actionLabel: 'Dinleme modunu ac',
          detailsTitle: 'Hiragana Dinleme Pratigi',
          detailsIntro: 'Dinleme akisi, hiragana bilgisini ses uzerinden test eder ve karakteri duyarak tanimani ister.',
          mediaPosition: 'right',
          topics: [
            {
              id: 'hiragana-listening-core',
              title: 'Ses -> kana eslestirmesi',
              lead: 'Duydugun sesi dogru sekille iliskilendirmek kritik bir kontrol katmanidir.',
              paragraphs: ['Recognition akisi, dinleme calismasina dusuk bariyerli bir giris sunar.', 'Uretim isteyen kisimlar ise seceneksiz recall ile zorluk seviyesini yukarida tutar.'],
              learningPoints: ['Ses ayirt etme becerisini gelistirir', 'Ses -> cevap uretimini guclendirir', 'Baska modlara gecisi destekler'],
              demoSrc: '/gifs/listening-recognition.gif',
              demoAlt: 'Hiragana listening detail',
              fallbackTitle: 'Hiragana Listening Recognition GIF',
              fallbackPath: '/gifs/listening-recognition.gif'
            }
          ]
        },
        dictionary: {
          id: 'dictionary',
          accent: 'amber',
          badge: 'Calisma Modu',
          title: 'Sozluk ve Quizler',
          description: 'Hiragana kelimelerini incele, filtrele ve farkli soru yonleriyle tekrar et.',
          features: ['Arama ve JLPT filtreleme', 'Kelime -> romaji / anlam', 'Anlam -> kelime ve test modu'],
          previewSrc: '/gifs/dictionary-demo.gif',
          previewAlt: 'Hiragana dictionary preview',
          fallbackTitle: 'Hiragana Dictionary GIF',
          fallbackPath: '/gifs/dictionary-demo.gif',
          actionLabel: 'Sozluk modunu ac',
          detailsTitle: 'Hiragana Sozluk Calismasi',
          detailsIntro: 'Sozluk alani, hiraganayi karakter seviyesinden cikarip gercek kelime kullanimi icine tasir.',
          mediaPosition: 'left',
          topics: [
            {
              id: 'hiragana-dictionary-core',
              title: 'Kelimeyi farkli yonlerden yoklama',
              lead: 'Yeni quiz yonleri ayni kelimeyi sadece okumayi degil hatirlamayi da ister.',
              paragraphs: ['Arama ve filtreler, calisma havuzunu odakli sekilde daraltir.', 'Kelime -> anlam ve anlam -> kelime yonleri, pasif taniyi aktif recalla cevirir.'],
              learningPoints: ['Kelime seviyesinde tekrar kurar', 'Anlam bagini kuvvetlendirir', 'Karismik test ile daha guclu tekrar sunar'],
              demoSrc: '/gifs/dictionary-typing.gif',
              demoAlt: 'Hiragana dictionary detail',
              fallbackTitle: 'Hiragana Dictionary Quiz GIF',
              fallbackPath: '/gifs/dictionary-typing.gif'
            }
          ]
        }
      }
    },
    katakana: {
      overviewTab: 'Overview',
      hero: {
        eyebrow: 'Katakana Overview',
        title: 'Katakana Calisma Alani',
        lead: 'Katakana modlarini once ozetle incele, sonra ihtiyacin olan moda gec.',
        copy: 'Bu sayfa genel bakis duzenini katakana icin tekrar kurar. GIF preview alanina tiklayinca detay modali acilir ve her bolumden ilgili moda dogrudan gecis yapabilirsin.',
        primaryAction: { label: 'Dinleme modunu ac', target: 'listening' },
        secondaryAction: { label: 'Sozluk modunu ac', target: 'dictionary' }
      },
      featureCards: [
        { title: 'Odunc kelime odagi', description: 'Katakana agirlikli kelimeleri ve modern okuma kaliplarini birlikte tekrar et.' },
        { title: 'Sekil netligi', description: 'Yazma ve cizim, benzer katakana formlarini daha temiz ayirmayi saglar.' },
        { title: 'Ses kaliplari', description: 'Dinleme akisi daha az tanidik katakana ses sekillerini oturtur.' },
        { title: 'Kelime tekrari', description: 'Sozluk alani, katakanayi sadece okumaktan hatirlamaya tasir.' }
      ],
      stats: { sections: 'Bolum', characters: 'Karakter', words: 'Kelime', modes: 'Mod' },
      sections: {
        typing: {
          id: 'typing',
          accent: 'indigo',
          badge: 'Calisma Modu',
          title: 'Katakana Yazma Pratigi',
          description: 'Katakana karakterini gorup romajisini hizli ureterek odunc kelime okumayi akicilastir.',
          features: ['Hizli recognition akisi', 'Benzer form ayrimi', 'Ritim ve skor takibi'],
          previewSrc: '/gifs/typing-demo.gif',
          previewAlt: 'Katakana typing preview',
          fallbackTitle: 'Katakana Typing GIF',
          fallbackPath: '/gifs/typing-demo.gif',
          actionLabel: 'Yazma modunu ac',
          detailsTitle: 'Katakana Yazma Pratigi',
          detailsIntro: 'Katakana typing akisi, formu gorur gormez cevabi uretme hizini ve dogrulugunu guclendirmek icin kullanilir.',
          mediaPosition: 'right',
          topics: [
            {
              id: 'katakana-typing-core',
              title: 'Hiz ve dogrulugu birlestirmek',
              lead: 'Odunc kelime okuma, karakteri bekletmeden tanimaya baglidir.',
              paragraphs: ['Bu akis karakteri sadece tanidik hissetmeyi degil, dogru romajiyi hemen uretmeyi ister.', 'Ozellikle benzer katakana formlarinda yasadigin tereddutleri daha gorunur hale getirir.'],
              learningPoints: ['Katakana -> romaji bagini hizlandirir', 'Benzer formlari ayirmayi kolaylastirir', 'Odunc kelime okumayi daha akici yapar'],
              demoSrc: '/gifs/typing-standard.gif',
              demoAlt: 'Katakana typing detail',
              fallbackTitle: 'Katakana Typing Standard GIF',
              fallbackPath: '/gifs/typing-standard.gif'
            }
          ]
        },
        drawing: {
          id: 'drawing',
          accent: 'emerald',
          badge: 'Calisma Modu',
          title: 'Katakana Cizim Pratigi',
          description: 'Katakana cizerek ince sekil farklarini daha kalici hale getir ve el hafizasini devreye sok.',
          features: ['Sekil odakli tekrar', 'Rehberli ve hafizadan cizim', 'Motor destekli pekistirme'],
          previewSrc: '/gifs/drawing-demo.gif',
          previewAlt: 'Katakana drawing preview',
          fallbackTitle: 'Katakana Drawing GIF',
          fallbackPath: '/gifs/drawing-demo.gif',
          actionLabel: 'Cizim modunu ac',
          detailsTitle: 'Katakana Cizim Pratigi',
          detailsIntro: 'Katakana tarafinda cizim daha da degerlidir cunku bircok form ilk bakista birbirine yakin hissedilir.',
          mediaPosition: 'left',
          topics: [
            {
              id: 'katakana-drawing-core',
              title: 'Sekil farklarini tutmak',
              lead: 'Karakteri kendi elinle yazmak, ince farklari daha kolay sabitler.',
              paragraphs: ['Cizim aci, bosluk ve yerlesim farklarini gorsel taniyadan daha net ortaya cikarir.', 'Bu da benzer katakana gruplarindaki karisikliklari azaltir.'],
              learningPoints: ['Sekil farklarini daha somut hale getirir', 'Gorsel hafiza ile el hafizasini birlestirir', 'Kilavuzsuz recallu guclendirir'],
              demoSrc: '/gifs/drawing-practice.gif',
              demoAlt: 'Katakana drawing detail',
              fallbackTitle: 'Katakana Drawing Practice GIF',
              fallbackPath: '/gifs/drawing-practice.gif'
            }
          ]
        },
        listening: {
          id: 'listening',
          accent: 'rose',
          badge: 'Calisma Modu',
          title: 'Katakana Dinleme Pratigi',
          description: 'Katakana agirlikli ses kaliplarini duyup dogru okuma cevabina ulas.',
          features: ['Odunc kelime odakli ses akisi', 'Recognition ve typing cevaplari', 'Ses -> okuma baglantisi'],
          previewSrc: '/gifs/listening-demo.gif',
          previewAlt: 'Katakana listening preview',
          fallbackTitle: 'Katakana Listening GIF',
          fallbackPath: '/gifs/listening-demo.gif',
          actionLabel: 'Dinleme modunu ac',
          detailsTitle: 'Katakana Dinleme Pratigi',
          detailsIntro: 'Katakana dinleme alani, ithal ses kaliplarini ayirt edip bunu dogru yazi bicimine baglamana yardim eder.',
          mediaPosition: 'right',
          topics: [
            {
              id: 'katakana-listening-core',
              title: 'Ses kaliplarini ayirmak',
              lead: 'Katakana sesi, kalip tanidik hale gelene kadar daha yabanci gelebilir.',
              paragraphs: ['Tekrarlar bu ses kaliplarini daha erken fark etmeyi kolaylastirir.', 'Uretim isteyen cevaplar ise sesi daha aktif ve daha zorlayici bir recall gorevine cevirir.'],
              learningPoints: ['Ses ayirt etme becerisini gelistirir', 'Ses -> cevap zincirini tamamlar', 'Diger modlara aktarimi destekler'],
              demoSrc: '/gifs/listening-recognition.gif',
              demoAlt: 'Katakana listening detail',
              fallbackTitle: 'Katakana Listening Recognition GIF',
              fallbackPath: '/gifs/listening-recognition.gif'
            }
          ]
        },
        dictionary: {
          id: 'dictionary',
          accent: 'amber',
          badge: 'Calisma Modu',
          title: 'Katakana Sozluk ve Quizler',
          description: 'Katakana kelimelerini arayip farkli soru yonleriyle tekrar et.',
          features: ['Aranabilir kelime listesi', 'Anlam ve okuma yonleri', 'Karisik test akisi'],
          previewSrc: '/gifs/dictionary-demo.gif',
          previewAlt: 'Katakana dictionary preview',
          fallbackTitle: 'Katakana Dictionary GIF',
          fallbackPath: '/gifs/dictionary-demo.gif',
          actionLabel: 'Sozluk modunu ac',
          detailsTitle: 'Katakana Sozluk Calismasi',
          detailsIntro: 'Sozluk alani, katakana calismasini tekil karakterlerden cikarip gercek kelime tekrarina baglar.',
          mediaPosition: 'left',
          topics: [
            {
              id: 'katakana-dictionary-core',
              title: 'Kelimeyi birden fazla acidan gormek',
              lead: 'Anlam odakli sorular ve karisik testler katakana kelimelerini daha aktif hale getirir.',
              paragraphs: ['Filtreler daha dar odunc kelime havuzlarina odaklanmani saglar.', 'Anlam -> kelime gibi sorular zorlugu yalnizca okumaya gore daha yukari tasir.'],
              learningPoints: ['Kelime seviyesinde tekrar kurar', 'Okuma ve anlam bagini guclendirir', 'Daha zor karisik recall ekler'],
              demoSrc: '/gifs/dictionary-typing.gif',
              demoAlt: 'Katakana dictionary detail',
              fallbackTitle: 'Katakana Dictionary Quiz GIF',
              fallbackPath: '/gifs/dictionary-typing.gif'
            }
          ]
        }
      }
    },
    kanji: {
      overviewTab: 'Overview',
      studyTab: 'Calisma',
      hero: {
        eyebrow: 'Kanji Overview',
        title: 'Kanji Genel Bakis',
        lead: 'Kanji sayfasi once bolumleri aciklar, sonra secilen track study alanina gecer.',
        copy: 'Bu overview katmani, mevcut kanji bolumlerini GIF preview ve detay modali ile tanitir. Preview alanina tiklayip daha detayli bilgi gorebilir, sonra ilgili bolumu acabilirsin.',
        primaryAction: { label: 'Baslangic bolumunu ac', targetIndex: 0 },
        secondaryAction: { label: 'Orta seviye bolumu ac', targetIndex: 1 }
      },
      featureCards: [
        { title: 'Seviye bazli akis', description: 'Baslangic, orta ve ileri kanji bolumleri ayri tanitilir.' },
        { title: 'Overview -> study', description: 'Kullanici once bolumu gorur, sonra tek tikla study alanina gecer.' },
        { title: 'Detay modali', description: 'GIF preview tiklandiginda track hakkinda daha ayrintili bilgi acilir.' }
      ],
      stats: { tracks: 'Odak alani' },
      tracksTitle: 'Kanji bolumleri',
      tracksDescription: 'Preview alanlarini incele, modal detayini ac ve sonra secilen bolumu study ekraninda goster.',
      tracksAction: 'Bolumu ac',
      sections: [
        {
          id: 'beginner',
          studyIndex: 0,
          accent: 'indigo',
          badge: 'Kanji Bolumu',
          title: 'Baslangic Kanji',
          description: 'Gunluk kullanimda erken karsina cikacak temel karakterleri incelemek icin giris alani.',
          features: ['Cekirdek karakter havuzu', 'Daha yonlendirilmis baslangic', 'Bolum bazli study gecisi'],
          previewSrc: '/gifs/kanji-beginner.gif',
          previewAlt: 'Beginner kanji preview',
          fallbackTitle: 'Kanji Beginner GIF',
          fallbackPath: '/gifs/kanji-beginner.gif',
          actionLabel: 'Baslangic bolumunu ac',
          detailsTitle: 'Baslangic Kanji Bolumu',
          detailsIntro: 'Bu bolum, kanji tarafina giriste karmasayi azaltmak ve daha yonetilebilir bir havuz acmak icin kullanilir.',
          mediaPosition: 'right',
          topics: [
            {
              id: 'kanji-beginner-core',
              title: 'Temel havuzu once gormek',
              lead: 'Baslangicta amac fazla yayilmak degil, cekirdek karakterleri daha duzenli tekrar etmektir.',
              paragraphs: ['Overview katmani, study ekranina gecmeden once hangi tracki actigini netlestirir.', 'Bu da yeni kullanicinin bolumler arasinda kaybolmasini azaltir.'],
              learningPoints: ['Cekirdek havuzu tanitir', 'Ilk study seansini daha yonetilebilir yapar', 'Bolum secimini daha bilincli hale getirir'],
              demoSrc: '/gifs/kanji-beginner.gif',
              demoAlt: 'Beginner kanji detail',
              fallbackTitle: 'Kanji Beginner Detail GIF',
              fallbackPath: '/gifs/kanji-beginner.gif'
            }
          ]
        },
        {
          id: 'intermediate',
          studyIndex: 1,
          accent: 'emerald',
          badge: 'Kanji Bolumu',
          title: 'Orta Seviye Kanji',
          description: 'Daha yogun karakter havuzunu acmadan once kapsami overview ile gormeni saglar.',
          features: ['Daha yogun inceleme alani', 'Section navigator ile gezi', 'Overview destekli gecis'],
          previewSrc: '/gifs/kanji-intermediate.gif',
          previewAlt: 'Intermediate kanji preview',
          fallbackTitle: 'Kanji Intermediate GIF',
          fallbackPath: '/gifs/kanji-intermediate.gif',
          actionLabel: 'Orta seviye bolumu ac',
          detailsTitle: 'Orta Seviye Kanji Bolumu',
          detailsIntro: 'Orta seviye alan, yogunlugun arttigi noktada overview katmanini daha degerli hale getirir.',
          mediaPosition: 'left',
          topics: [
            {
              id: 'kanji-intermediate-core',
              title: 'Yogunlugu onceden gormek',
              lead: 'Overview, study alanina gecmeden once beklentiyi netlestirir.',
              paragraphs: ['Bu track daha genis bir karakter havuzuna yaklastigi icin secim asamasinda daha bilincli ilerlemek gerekir.', 'Preview ve modal, hangi bolumu acacagini daha net secmeni saglar.'],
              learningPoints: ['Yogun tracki onceden tanitir', 'Study planlamasini kolaylastirir', 'Secim anini daha amacli yapar'],
              demoSrc: '/gifs/kanji-intermediate.gif',
              demoAlt: 'Intermediate kanji detail',
              fallbackTitle: 'Kanji Intermediate Detail GIF',
              fallbackPath: '/gifs/kanji-intermediate.gif'
            }
          ]
        },
        {
          id: 'advanced',
          studyIndex: 2,
          accent: 'slate',
          badge: 'Kanji Bolumu',
          title: 'Ileri Seviye Kanji',
          description: 'Daha buyuk kapsamli trackleri study ekranina gecmeden once tanitan overview bolumu.',
          features: ['Genis kapsamli karakter havuzu', 'Overview -> study handoff', 'Buyuk tracklerde daha kontrollu acis'],
          previewSrc: '/gifs/kanji-advanced.gif',
          previewAlt: 'Advanced kanji preview',
          fallbackTitle: 'Kanji Advanced GIF',
          fallbackPath: '/gifs/kanji-advanced.gif',
          actionLabel: 'Ileri seviye bolumu ac',
          detailsTitle: 'Ileri Seviye Kanji Bolumu',
          detailsIntro: 'Ileri seviye alanda overview katmani, buyuk bir tracki acmadan once neye girdigini anlamani saglar.',
          mediaPosition: 'right',
          topics: [
            {
              id: 'kanji-advanced-core',
              title: 'Scope control',
              lead: 'Buyuk tracklerde once genel resmi gormek daha saglikli bir gecis yaratir.',
              paragraphs: ['Preview ve modal yapisi, study ekranina gecmeden once trackin ne sundugunu netlestirir.', 'Bu da buyuk havuzlarda daha hizli ve kontrollu karar vermeyi kolaylastirir.'],
              learningPoints: ['Kapsami onceden tanitir', 'Buyuk havuzlarda karar vermeyi kolaylastirir', 'Overview -> study gecisini sade tutar'],
              demoSrc: '/gifs/kanji-advanced.gif',
              demoAlt: 'Advanced kanji detail',
              fallbackTitle: 'Kanji Advanced Detail GIF',
              fallbackPath: '/gifs/kanji-advanced.gif'
            }
          ]
        }
      ]
    }
  },
  en: {
    common: {
      close: 'Close',
      detailsLabel: 'Detailed info',
      gifHint: 'Click the section for details',
      learningLabel: 'What do you learn here?'
    },
    hiragana: {
      overviewTab: 'Overview',
      hero: {
        eyebrow: 'Hiragana Overview',
        title: 'Hiragana Study Area',
        lead: 'Review the hiragana modes first, then move straight into the workflow you want.',
        copy: 'This page mirrors the main overview style for hiragana. GIF previews open a detail modal, and each section lets you jump directly into the related study mode.',
        primaryAction: { label: 'Open typing mode', target: 'typing' },
        secondaryAction: { label: 'Open dictionary mode', target: 'dictionary' }
      },
      featureCards: [
        { title: 'Core sets', description: 'Review core and combined hiragana groups in one place.' },
        { title: 'Active recall', description: 'Typing and drawing push recognition into production.' },
        { title: 'Audio support', description: 'Listening drills strengthen the sound-symbol link.' },
        { title: 'Vocabulary review', description: 'Dictionary study moves hiragana into word-level practice.' }
      ],
      stats: { sections: 'Sections', characters: 'Characters', words: 'Words', modes: 'Modes' },
      sections: {
        typing: {
          id: 'typing', accent: 'indigo', badge: 'Study Mode', title: 'Typing Practice', description: 'See hiragana and produce the matching romaji quickly.', features: ['Kana -> romaji flow', 'Score and timing feedback', 'Row-based repetition'], previewSrc: '/gifs/typing-demo.gif', previewAlt: 'Hiragana typing preview', fallbackTitle: 'Hiragana Typing GIF', fallbackPath: '/gifs/typing-demo.gif', actionLabel: 'Open typing mode', detailsTitle: 'Hiragana Typing Practice', detailsIntro: 'The typing flow asks you to actively produce the answer instead of only recognizing the character.', mediaPosition: 'right', topics: [{ id: 'hiragana-typing-core', title: 'Building reading reflexes', lead: 'The main goal is faster, more stable kana recall.', paragraphs: ['Short loops reveal hesitation quickly and make weak rows visible.', 'That makes it easier to improve both speed and accuracy together.'], learningPoints: ['Strengthens hiragana -> romaji mapping', 'Improves separation between similar characters', 'Makes progress easier to measure'], demoSrc: '/gifs/typing-standard.gif', demoAlt: 'Hiragana typing detail', fallbackTitle: 'Hiragana Typing Standard GIF', fallbackPath: '/gifs/typing-standard.gif' }] },
        drawing: {
          id: 'drawing', accent: 'emerald', badge: 'Study Mode', title: 'Drawing Practice', description: 'Draw hiragana to lock in form and stroke flow through physical production.', features: ['Guided drawing', 'Memory-based recall', 'Handwriting-focused reinforcement'], previewSrc: '/gifs/drawing-demo.gif', previewAlt: 'Hiragana drawing preview', fallbackTitle: 'Hiragana Drawing GIF', fallbackPath: '/gifs/drawing-demo.gif', actionLabel: 'Open drawing mode', detailsTitle: 'Hiragana Drawing Practice', detailsIntro: 'Drawing turns hiragana from a visual recognition task into a physical writing task.', mediaPosition: 'left', topics: [{ id: 'hiragana-drawing-core', title: 'Stabilizing the form', lead: 'Writing the shape yourself makes the character more durable in memory.', paragraphs: ['Guided practice helps establish proportion and stroke logic.', 'Memory-based drawing then reveals what really stayed in recall.'], learningPoints: ['Shows stroke logic more clearly', 'Combines visual and motor memory', 'Reduces mistakes on similar kana'], demoSrc: '/gifs/drawing-practice.gif', demoAlt: 'Hiragana drawing detail', fallbackTitle: 'Hiragana Drawing Practice GIF', fallbackPath: '/gifs/drawing-practice.gif' }] },
        listening: {
          id: 'listening', accent: 'rose', badge: 'Study Mode', title: 'Listening Practice', description: 'Hear the sound and connect it to the right kana or response.', features: ['Character and word audio', 'Recognition and production flows', 'Sound -> answer reinforcement'], previewSrc: '/gifs/listening-demo.gif', previewAlt: 'Hiragana listening preview', fallbackTitle: 'Hiragana Listening GIF', fallbackPath: '/gifs/listening-demo.gif', actionLabel: 'Open listening mode', detailsTitle: 'Hiragana Listening Practice', detailsIntro: 'The listening side checks whether hiragana recognition still holds when the prompt becomes audio instead of text.', mediaPosition: 'right', topics: [{ id: 'hiragana-listening-core', title: 'Matching sound to kana', lead: 'Audio-based recall is a strong validation layer for reading work.', paragraphs: ['Recognition gives a lower-barrier listening entry point.', 'Production-based answers raise the challenge and push active recall further.'], learningPoints: ['Improves sound discrimination', 'Strengthens sound -> answer production', 'Supports stronger transfer into other modes'], demoSrc: '/gifs/listening-recognition.gif', demoAlt: 'Hiragana listening detail', fallbackTitle: 'Hiragana Listening Recognition GIF', fallbackPath: '/gifs/listening-recognition.gif' }] },
        dictionary: {
          id: 'dictionary', accent: 'amber', badge: 'Study Mode', title: 'Dictionary and Quizzes', description: 'Browse hiragana vocabulary and review it from multiple question directions.', features: ['Search and JLPT filters', 'Word -> romaji / meaning', 'Meaning -> word and mixed test'], previewSrc: '/gifs/dictionary-demo.gif', previewAlt: 'Hiragana dictionary preview', fallbackTitle: 'Hiragana Dictionary GIF', fallbackPath: '/gifs/dictionary-demo.gif', actionLabel: 'Open dictionary mode', detailsTitle: 'Hiragana Dictionary Study', detailsIntro: 'The dictionary side moves hiragana work from isolated symbols into actual vocabulary review.', mediaPosition: 'left', topics: [{ id: 'hiragana-dictionary-core', title: 'Checking the same word from multiple directions', lead: 'The newer quiz directions make vocabulary recall more active.', paragraphs: ['Search and filtering narrow the review pool for more deliberate sessions.', 'Meaning-based prompts turn passive reading into stronger recall.'], learningPoints: ['Builds word-level repetition', 'Strengthens reading + meaning links', 'Creates harder mixed review'], demoSrc: '/gifs/dictionary-typing.gif', demoAlt: 'Hiragana dictionary detail', fallbackTitle: 'Hiragana Dictionary Quiz GIF', fallbackPath: '/gifs/dictionary-typing.gif' }] }
      }
    },
    katakana: {
      overviewTab: 'Overview',
      hero: {
        eyebrow: 'Katakana Overview',
        title: 'Katakana Study Area',
        lead: 'Review the katakana workflows first, then jump into the mode you want.',
        copy: 'This page recreates the overview structure for katakana. Clicking the GIF preview opens a detail modal, and each section includes a direct route into the related mode.',
        primaryAction: { label: 'Open listening mode', target: 'listening' },
        secondaryAction: { label: 'Open dictionary mode', target: 'dictionary' }
      },
      featureCards: [
        { title: 'Loanword focus', description: 'Practice katakana-heavy vocabulary and modern reading patterns.' },
        { title: 'Shape clarity', description: 'Typing and drawing make similar forms easier to separate.' },
        { title: 'Audio patterns', description: 'Listening work helps with less familiar katakana sound shapes.' },
        { title: 'Word review', description: 'Dictionary work pushes katakana from reading into recall.' }
      ],
      stats: { sections: 'Sections', characters: 'Characters', words: 'Words', modes: 'Modes' },
      sections: {
        typing: {
          id: 'typing', accent: 'indigo', badge: 'Study Mode', title: 'Katakana Typing', description: 'See katakana and produce the romaji quickly for smoother loanword reading.', features: ['Fast recognition flow', 'Similar-form separation', 'Rhythm and score tracking'], previewSrc: '/gifs/typing-demo.gif', previewAlt: 'Katakana typing preview', fallbackTitle: 'Katakana Typing GIF', fallbackPath: '/gifs/typing-demo.gif', actionLabel: 'Open typing mode', detailsTitle: 'Katakana Typing Practice', detailsIntro: 'Katakana typing is mainly about producing the answer immediately when the form appears.', mediaPosition: 'right', topics: [{ id: 'katakana-typing-core', title: 'Speed with accuracy', lead: 'Loanword reading improves when form recognition becomes more automatic.', paragraphs: ['This flow pushes you to produce the correct answer rather than only feel that the character looks familiar.', 'That matters especially when similar katakana forms create hesitation.'], learningPoints: ['Speeds up katakana -> romaji mapping', 'Improves separation of similar forms', 'Supports smoother loanword reading'], demoSrc: '/gifs/typing-standard.gif', demoAlt: 'Katakana typing detail', fallbackTitle: 'Katakana Typing Standard GIF', fallbackPath: '/gifs/typing-standard.gif' }] },
        drawing: {
          id: 'drawing', accent: 'emerald', badge: 'Study Mode', title: 'Katakana Drawing', description: 'Draw katakana to make the fine visual differences more stable in memory.', features: ['Shape-focused repetition', 'Guided and memory drawing', 'Motor reinforcement'], previewSrc: '/gifs/drawing-demo.gif', previewAlt: 'Katakana drawing preview', fallbackTitle: 'Katakana Drawing GIF', fallbackPath: '/gifs/drawing-demo.gif', actionLabel: 'Open drawing mode', detailsTitle: 'Katakana Drawing Practice', detailsIntro: 'Drawing is especially useful on the katakana side because many forms feel close at a glance.', mediaPosition: 'left', topics: [{ id: 'katakana-drawing-core', title: 'Holding shape differences', lead: 'Writing the character yourself makes subtle differences easier to remember.', paragraphs: ['Drawing exposes angle, spacing, and placement more clearly than visual recognition alone.', 'That helps reduce confusion across similar katakana groups.'], learningPoints: ['Makes shape differences more concrete', 'Combines visual and motor memory', 'Improves unguided recall later'], demoSrc: '/gifs/drawing-practice.gif', demoAlt: 'Katakana drawing detail', fallbackTitle: 'Katakana Drawing Practice GIF', fallbackPath: '/gifs/drawing-practice.gif' }] },
        listening: {
          id: 'listening', accent: 'rose', badge: 'Study Mode', title: 'Katakana Listening', description: 'Hear katakana-heavy sound patterns and turn them into the right reading response.', features: ['Loanword-oriented audio flow', 'Recognition and typing answers', 'Sound -> reading reinforcement'], previewSrc: '/gifs/listening-demo.gif', previewAlt: 'Katakana listening preview', fallbackTitle: 'Katakana Listening GIF', fallbackPath: '/gifs/listening-demo.gif', actionLabel: 'Open listening mode', detailsTitle: 'Katakana Listening Practice', detailsIntro: 'The katakana listening area helps you separate imported sound patterns and connect them to the right written form.', mediaPosition: 'right', topics: [{ id: 'katakana-listening-core', title: 'Separating sound patterns', lead: 'Katakana audio often feels less intuitive until the pattern becomes familiar.', paragraphs: ['Repetition helps the learner notice those sound shapes sooner.', 'Production-based answers then make the audio response more active and more demanding.'], learningPoints: ['Improves sound discrimination', 'Completes the sound -> answer chain', 'Supports transfer into other modes'], demoSrc: '/gifs/listening-recognition.gif', demoAlt: 'Katakana listening detail', fallbackTitle: 'Katakana Listening Recognition GIF', fallbackPath: '/gifs/listening-recognition.gif' }] },
        dictionary: {
          id: 'dictionary', accent: 'amber', badge: 'Study Mode', title: 'Katakana Dictionary', description: 'Search katakana vocabulary and review it through multiple quiz directions.', features: ['Searchable word list', 'Meaning and reading directions', 'Mixed test flow'], previewSrc: '/gifs/dictionary-demo.gif', previewAlt: 'Katakana dictionary preview', fallbackTitle: 'Katakana Dictionary GIF', fallbackPath: '/gifs/dictionary-demo.gif', actionLabel: 'Open dictionary mode', detailsTitle: 'Katakana Dictionary Study', detailsIntro: 'The dictionary area connects katakana practice to actual vocabulary instead of isolated symbols.', mediaPosition: 'left', topics: [{ id: 'katakana-dictionary-core', title: 'Reviewing the word from more than one angle', lead: 'Meaning-based prompts and mixed tests make katakana vocabulary more active.', paragraphs: ['Filtering lets you focus on narrower loanword-heavy pools.', 'Meaning -> word style questions raise the recall difficulty beyond reading alone.'], learningPoints: ['Creates word-level review', 'Strengthens reading and meaning links', 'Adds harder mixed recall'], demoSrc: '/gifs/dictionary-typing.gif', demoAlt: 'Katakana dictionary detail', fallbackTitle: 'Katakana Dictionary Quiz GIF', fallbackPath: '/gifs/dictionary-typing.gif' }] }
      }
    },
    kanji: {
      overviewTab: 'Overview',
      studyTab: 'Study',
      hero: {
        eyebrow: 'Kanji Overview',
        title: 'Kanji Overview',
        lead: 'Review the available kanji tracks first, then open the section you want.',
        copy: 'The kanji page now starts with an overview layer with GIF previews and a detail modal. You inspect the track first, then open it in the study screen.',
        primaryAction: { label: 'Open beginner track', targetIndex: 0 },
        secondaryAction: { label: 'Open intermediate track', targetIndex: 1 }
      },
      featureCards: [
        { title: 'Level focus', description: 'Beginner, intermediate, and advanced tracks are introduced separately.' },
        { title: 'Overview -> study', description: 'You inspect the track before moving into the study screen.' },
        { title: 'Detail modal', description: 'Clicking the preview opens a more detailed explanation for that track.' }
      ],
      stats: { tracks: 'Focus areas' },
      tracksTitle: 'Kanji tracks',
      tracksDescription: 'Inspect the GIF preview, open the detail modal, then move into the selected study section.',
      tracksAction: 'Open section',
      sections: [
        { id: 'beginner', studyIndex: 0, accent: 'indigo', badge: 'Kanji Track', title: 'Beginner Kanji', description: 'Introduces the earliest high-frequency kanji in a more manageable entry track.', features: ['Core character pool', 'Gentler starting point', 'Section-based study handoff'], previewSrc: '/gifs/kanji-beginner.gif', previewAlt: 'Beginner kanji preview', fallbackTitle: 'Kanji Beginner GIF', fallbackPath: '/gifs/kanji-beginner.gif', actionLabel: 'Open beginner track', detailsTitle: 'Beginner Kanji Track', detailsIntro: 'The beginner track is designed to reduce scope and make the first kanji study sessions more manageable.', mediaPosition: 'right', topics: [{ id: 'kanji-beginner-core', title: 'Seeing the core pool first', lead: 'The first goal is not breadth but repeatable work on the most visible kanji.', paragraphs: ['The overview layer clarifies what the track contains before the study screen opens.', 'That keeps the first sessions more controlled and less noisy.'], learningPoints: ['Introduces the core pool', 'Makes first study sessions easier to manage', 'Supports more deliberate track choice'], demoSrc: '/gifs/kanji-beginner.gif', demoAlt: 'Beginner kanji detail', fallbackTitle: 'Kanji Beginner Detail GIF', fallbackPath: '/gifs/kanji-beginner.gif' }] },
        { id: 'intermediate', studyIndex: 1, accent: 'emerald', badge: 'Kanji Track', title: 'Intermediate Kanji', description: 'Adds a denser inspection area where overview-first choice becomes more useful.', features: ['Denser track scope', 'Navigator-supported study flow', 'Overview-supported entry'], previewSrc: '/gifs/kanji-intermediate.gif', previewAlt: 'Intermediate kanji preview', fallbackTitle: 'Kanji Intermediate GIF', fallbackPath: '/gifs/kanji-intermediate.gif', actionLabel: 'Open intermediate track', detailsTitle: 'Intermediate Kanji Track', detailsIntro: 'The intermediate track benefits more from overview because the content density is higher.', mediaPosition: 'left', topics: [{ id: 'kanji-intermediate-core', title: 'Checking density before entry', lead: 'Overview helps the learner understand the scope before opening the track.', paragraphs: ['That makes the study session feel more intentional.', 'The preview and modal make it easier to choose the right section first.'], learningPoints: ['Introduces the denser scope early', 'Helps plan the study session', 'Improves section choice'], demoSrc: '/gifs/kanji-intermediate.gif', demoAlt: 'Intermediate kanji detail', fallbackTitle: 'Kanji Intermediate Detail GIF', fallbackPath: '/gifs/kanji-intermediate.gif' }] },
        { id: 'advanced', studyIndex: 2, accent: 'slate', badge: 'Kanji Track', title: 'Advanced Kanji', description: 'Previews the broadest track before the user enters the study area.', features: ['Wider character scope', 'Overview -> study handoff', 'More controlled opening of large tracks'], previewSrc: '/gifs/kanji-advanced.gif', previewAlt: 'Advanced kanji preview', fallbackTitle: 'Kanji Advanced GIF', fallbackPath: '/gifs/kanji-advanced.gif', actionLabel: 'Open advanced track', detailsTitle: 'Advanced Kanji Track', detailsIntro: 'At the advanced level, an overview-first entry helps the user understand scope before opening a large track.', mediaPosition: 'right', topics: [{ id: 'kanji-advanced-core', title: 'Opening large tracks with intent', lead: 'The preview and modal reduce guesswork before entering the study screen.', paragraphs: ['This makes the transition into the study area cleaner.', 'It also supports faster decisions when the content scope grows.'], learningPoints: ['Clarifies track scope', 'Supports faster selection in larger pools', 'Keeps the overview -> study transition simple'], demoSrc: '/gifs/kanji-advanced.gif', demoAlt: 'Advanced kanji detail', fallbackTitle: 'Kanji Advanced Detail GIF', fallbackPath: '/gifs/kanji-advanced.gif' }] }
      ]
    }
  }
};

