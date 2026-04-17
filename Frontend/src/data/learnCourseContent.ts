import { AppLanguage } from './appPreferences';

export type LearnUnitTone = 'brand' | 'warning' | 'success' | 'plum' | 'sunset' | 'info';

export interface LearnUnitDialogueLine {
  speaker: string;
  text: string;
  translation: string;
}

export interface LearnCourseUnit {
  id: string;
  partNumber: number;
  unitNumber: number;
  title: string;
  summary: string;
  goals: string[];
  vocabulary: string[];
  grammarFocus: string[];
  lessonHighlights: string[];
  dialogue: LearnUnitDialogueLine[];
  bannerClassName: string;
  accentGlow: string;
  tone: LearnUnitTone;
  mascotPose: 'wave' | 'cheer' | 'study' | 'sleep';
}

export interface LearnCourseSection {
  id: string;
  partNumber: number;
  title: string;
  description: string;
  bannerClassName: string;
  units: LearnCourseUnit[];
}

const trSections: LearnCourseSection[] = [
  {
    id: 'part-1',
    partNumber: 1,
    title: 'Temel iletisim',
    description: 'Selamlas, siparis ver, kendini ve baskalarini tanit.',
    bannerClassName:
      'bg-[linear-gradient(135deg,var(--kt-accent-success)_0%,var(--kt-brand)_100%)]',
    units: [
      {
        id: 'p1-u1',
        partNumber: 1,
        unitNumber: 1,
        title: 'Yiyecek ve icecek siparis et',
        summary: 'Kafede temel siparis kaliplari, menu kelimeleri ve nazik istek cumleleri.',
        goals: [
          'Menudeki temel kelimeleri tanimak',
          'X o kudasai kalibini kullanmak',
          'Adet ve fiyat sorularini anlamak'
        ],
        vocabulary: ['mizu', 'ocha', 'kohi', 'pan', 'gohan', 'kudasai'],
        grammarFocus: ['Kore / sore / are', 'X o kudasai', 'nan + counter girisi'],
        lessonHighlights: ['Kelime seti', 'Mini diyalog', 'Dinleme hizi', 'Kontrol noktasi'],
        dialogue: [
          { speaker: 'A', text: 'Kohi o kudasai.', translation: 'Bir kahve lutfen.' },
          { speaker: 'B', text: 'Hai, kohi hitotsu desu ne.', translation: 'Tabii, bir kahve.' }
        ],
        bannerClassName:
          'bg-[linear-gradient(135deg,var(--kt-accent-success)_0%,var(--kt-accent-warning)_100%)]',
        accentGlow: 'rgba(144, 205, 70, 0.32)',
        tone: 'success',
        mascotPose: 'wave'
      },
      {
        id: 'p1-u2',
        partNumber: 1,
        unitNumber: 2,
        title: 'Isimleri sifatlarla tanimla',
        summary: 'Bir nesnenin buyuk, kucuk, yeni veya sakin oldugunu dogru kalipla soyle.',
        goals: [
          'Na ve i sifat farkini sezmek',
          'Kore wa ... desu kalibini kurmak',
          'Nesneyi sifat + isim ile anlatmak'
        ],
        vocabulary: ['ookii', 'chiisai', 'atarashii', 'shizuka', 'kirei', 'yuumei'],
        grammarFocus: ['i sifatlar', 'na sifatlar', 'Kore wa ... desu'],
        lessonHighlights: ['Gorsel esleme', 'Cumle tamamlama', 'Karsit sifatlar', 'Mini quiz'],
        dialogue: [
          { speaker: 'A', text: 'Ano mise wa shizuka desu.', translation: 'Su dukkan sakindir.' },
          { speaker: 'B', text: 'Kono hon wa atarashii desu.', translation: 'Bu kitap yenidir.' }
        ],
        bannerClassName:
          'bg-[linear-gradient(135deg,var(--kt-accent-plum)_0%,var(--kt-accent-info)_100%)]',
        accentGlow: 'rgba(176, 120, 236, 0.3)',
        tone: 'plum',
        mascotPose: 'study'
      },
      {
        id: 'p1-u3',
        partNumber: 1,
        unitNumber: 3,
        title: 'Selamlas ve vedalas',
        summary: 'Gunluk acilis, kisa tanisma ve kapanis cumlelerini ritimle kullan.',
        goals: [
          'Sabah, gunduz ve aksam selamlarini ayirmak',
          'Tanisma kaliplarini dogru kullanmak',
          'Kisa vedalasmalari pekistirmek'
        ],
        vocabulary: ['ohayou', 'konnichiwa', 'konbanwa', 'hajimemashite', 'jaa ne', 'mata ne'],
        grammarFocus: ['Aisatsu kaliplari', 'Hajimemashite', 'Yoroshiku onegaishimasu'],
        lessonHighlights: ['Dinle-tekrar et', 'Rol yapma', 'Hizli secim', 'Mikro diyalog'],
        dialogue: [
          { speaker: 'A', text: 'Hajimemashite. Ayse desu.', translation: 'Memnun oldum. Ben Ayse.' },
          { speaker: 'B', text: 'Yoroshiku onegaishimasu.', translation: 'Tanistigimiza memnun oldum.' }
        ],
        bannerClassName:
          'bg-[linear-gradient(135deg,var(--kt-accent-info)_0%,var(--kt-accent-success)_100%)]',
        accentGlow: 'rgba(54, 160, 255, 0.28)',
        tone: 'info',
        mascotPose: 'cheer'
      },
      {
        id: 'p1-u4',
        partNumber: 1,
        unitNumber: 4,
        title: 'Ulke ve milliyetler hakkinda konus',
        summary: 'Nereli oldugunu, hangi dili bildigini ve baskalarini nasil tanitacagini ogren.',
        goals: [
          'Kuni ve jin eklerini tanimak',
          'Watashi wa ... kara kimashita kalibini kurmak',
          'Dil ve milliyet kelimelerini ayirmak'
        ],
        vocabulary: ['nihon', 'toruko', 'amerika', 'nihonjin', 'eigo', 'go'],
        grammarFocus: ['... kara kimashita', '... jin', '... go'],
        lessonHighlights: ['Ulke kartlari', 'Esleme turu', 'Tanitim karti', 'Hedef tekrar'],
        dialogue: [
          { speaker: 'A', text: 'Watashi wa Toruko kara kimashita.', translation: 'Ben Turkiye den geldim.' },
          { speaker: 'B', text: 'Nihongo to eigo o benkyou shimasu.', translation: 'Japonca ve Ingilizce calisiyorum.' }
        ],
        bannerClassName:
          'bg-[linear-gradient(135deg,var(--kt-accent-info)_0%,var(--kt-brand)_100%)]',
        accentGlow: 'rgba(54, 160, 255, 0.3)',
        tone: 'info',
        mascotPose: 'wave'
      }
    ]
  },
  {
    id: 'part-2',
    partNumber: 2,
    title: 'Cumle kurma ve sosyal hayat',
    description: 'Soru-cevap yap, arkadaslarini tanit, rutin ve mekan dili kur.',
    bannerClassName:
      'bg-[linear-gradient(135deg,var(--kt-accent-sunset)_0%,var(--kt-accent-plum)_100%)]',
    units: [
      {
        id: 'p2-u5',
        partNumber: 2,
        unitNumber: 5,
        title: 'Olumsuz cumleler kur ve sorulari yanitla',
        summary: 'Degil, yok ve ka sorularini bir arada kullanarak kisa cevaplar ver.',
        goals: [
          'Janai / dewa arimasen ayirimini gormek',
          'Ka ile soru kalibini okumak',
          'Hai / iie ile dogru kisa cevap vermek'
        ],
        vocabulary: ['janai', 'arimasen', 'ka', 'hai', 'iie', 'chotto'],
        grammarFocus: ['... wa ... ja nai desu', 'Ka sorulari', 'Kisa cevaplar'],
        lessonHighlights: ['Soru avcisi', 'Dogru-yanlis', 'Kisa cevap turu', 'Kontrol testi'],
        dialogue: [
          { speaker: 'A', text: 'Sensei desu ka.', translation: 'Ogretmen misiniz?' },
          { speaker: 'B', text: 'Iie, sensei ja nai desu.', translation: 'Hayir, ogretmen degilim.' }
        ],
        bannerClassName:
          'bg-[linear-gradient(135deg,var(--kt-accent-sunset)_0%,var(--kt-accent-plum)_100%)]',
        accentGlow: 'rgba(255, 144, 108, 0.28)',
        tone: 'sunset',
        mascotPose: 'study'
      },
      {
        id: 'p2-u6',
        partNumber: 2,
        unitNumber: 6,
        title: 'Arkadaslarini tanit',
        summary: 'Birini isim, yas, meslek ve hobi ile tanitacak kadar cumle kur.',
        goals: [
          'Kono hito wa ... desu kalibini kurmak',
          'Yas ve meslek bilgisini eklemek',
          'Hobi ile tanitimi genisletmek'
        ],
        vocabulary: ['tomodachi', 'namae', 'shigoto', 'gakusei', 'sensei', 'hobi'],
        grammarFocus: ['Kono hito wa ... desu', 'X sai desu', 'Hobi wa ... desu'],
        lessonHighlights: ['Profil karti', 'Es dosturma', 'Dinleyip tanit', 'Mini sunum'],
        dialogue: [
          { speaker: 'A', text: 'Kono hito wa Emre san desu.', translation: 'Bu kisi Emre.' },
          { speaker: 'B', text: 'Gakusei de, hobi wa ongaku desu.', translation: 'Ogrenci ve hobisi muzik.' }
        ],
        bannerClassName:
          'bg-[linear-gradient(135deg,var(--kt-brand)_0%,var(--kt-accent-warning)_100%)]',
        accentGlow: 'rgba(208, 96, 112, 0.3)',
        tone: 'brand',
        mascotPose: 'cheer'
      },
      {
        id: 'p2-u7',
        partNumber: 2,
        unitNumber: 7,
        title: 'Saati soyle ve gunluk rutin anlat',
        summary: 'Saat, gun ve temel rutin fiilleriyle kisaca gununu anlat.',
        goals: [
          'Ima ... ji desu kalibini okumak',
          'Sabah-ogle-aksam rutinlerini siralamak',
          'Zaman ifadesini eylemle baglamak'
        ],
        vocabulary: ['ima', 'ji', 'asa', 'hiru', 'yoru', 'okimasu'],
        grammarFocus: ['Ima ... ji desu', 'Maiasa / maiban', 'masu fiil sonlari'],
        lessonHighlights: ['Saat kartlari', 'Rutin zinciri', 'Sirala', 'Mikro anlatim'],
        dialogue: [
          { speaker: 'A', text: 'Ima shichi ji desu.', translation: 'Su an saat yedi.' },
          { speaker: 'B', text: 'Maiasa roku ji ni okimasu.', translation: 'Her sabah saat alti da kalkarim.' }
        ],
        bannerClassName:
          'bg-[linear-gradient(135deg,var(--kt-accent-info)_0%,var(--kt-accent-success)_100%)]',
        accentGlow: 'rgba(54, 160, 255, 0.32)',
        tone: 'info',
        mascotPose: 'study'
      },
      {
        id: 'p2-u8',
        partNumber: 2,
        unitNumber: 8,
        title: 'Yerleri ve seyahat esyalarini bul',
        summary: 'Orada, burada ve valiz, pasaport gibi seyahat kelimeleriyle yon bul.',
        goals: [
          'Koko / soko / asoko farkini oturtmak',
          'Seyahat esyalarini temel cumlelerde kullanmak',
          'Basit yon ve yer tarifini takip etmek'
        ],
        vocabulary: ['koko', 'soko', 'asoko', 'pasupooto', 'kaban', 'kuukou'],
        grammarFocus: ['Koko / soko / asoko', 'X wa doko desu ka', 'Yer belirten kelimeler'],
        lessonHighlights: ['Mekan secimi', 'Esya bulma', 'Harita okuma', 'Checkpoint'],
        dialogue: [
          { speaker: 'A', text: 'Pasupooto wa asoko desu.', translation: 'Pasaport orada.' },
          { speaker: 'B', text: 'Kuukou wa doko desu ka.', translation: 'Havalimani nerede?' }
        ],
        bannerClassName:
          'bg-[linear-gradient(135deg,var(--kt-accent-warning)_0%,var(--kt-accent-sunset)_100%)]',
        accentGlow: 'rgba(255, 186, 90, 0.28)',
        tone: 'warning',
        mascotPose: 'wave'
      }
    ]
  }
];

const enSections: LearnCourseSection[] = [
  {
    ...trSections[0],
    title: 'Core communication',
    description: 'Greet people, order food, and introduce yourself.',
    units: [
      {
        ...trSections[0].units[0],
        summary: 'Cafe basics, menu words, and polite request patterns.'
      },
      {
        ...trSections[0].units[1],
        summary: 'Use adjectives to describe people, objects, and places.'
      },
      {
        ...trSections[0].units[2],
        summary: 'Daily greetings, short introductions, and simple goodbyes.'
      },
      {
        ...trSections[0].units[3],
        summary: 'Talk about countries, languages, and nationalities.'
      }
    ]
  },
  {
    ...trSections[1],
    title: 'Sentence building and social life',
    description: 'Ask questions, talk about routines, and navigate places.',
    units: [
      {
        ...trSections[1].units[0],
        summary: 'Build negative sentences and answer short questions.'
      },
      {
        ...trSections[1].units[1],
        summary: 'Introduce friends with name, role, and hobbies.'
      },
      {
        ...trSections[1].units[2],
        summary: 'Tell time and describe a simple routine.'
      },
      {
        ...trSections[1].units[3],
        summary: 'Find places and travel items with location words.'
      }
    ]
  }
];

export const getLearnCourseSections = (language: AppLanguage): LearnCourseSection[] =>
  language === 'en' ? enSections : trSections;

export const flattenLearnCourseUnits = (sections: LearnCourseSection[]) =>
  sections.flatMap((section) => section.units);

export const findLearnUnitById = (sections: LearnCourseSection[], unitId: string) =>
  flattenLearnCourseUnits(sections).find((unit) => unit.id === unitId) ?? null;
