import { AppLanguage } from '../../data/appPreferences';
import { JLPTLevel } from './learnLevels';

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
  level: JLPTLevel;
  title: string;
  description: string;
  bannerClassName: string;
  units: LearnCourseUnit[];
}

const trSections: LearnCourseSection[] = [
  {
    id: 'part-1',
    partNumber: 1,
    level: 'n5',
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
    level: 'n5',
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

const trPart3: LearnCourseSection = {
  id: 'part-3',
  partNumber: 3,
  level: 'n5',
  title: 'Alisveris ve sayilar',
  description: 'Sayilari kullan, alisveris yap, yon sor ve hava durumunu anlat.',
  bannerClassName:
    'bg-[linear-gradient(135deg,var(--kt-accent-warning)_0%,var(--kt-accent-success)_100%)]',
  units: [
    {
      id: 'p3-u9',
      partNumber: 3,
      unitNumber: 9,
      title: 'Bir ila yuz arasi sayilari ogren',
      summary: 'Temel Japonca sayilari ve bunlari gunluk konusmalarda kullanmayi ogren.',
      goals: [
        'Ichi dan hyaku ya kadar sayabilmek',
        'Sayi + counter kaliplarini tanimak',
        'Kac tane sorusunu yanıtlamak'
      ],
      vocabulary: ['ichi', 'ni', 'san', 'shi', 'go', 'juu'],
      grammarFocus: ['Sayilar 1-100', 'Nan-bon / nan-mai', 'Ikutsu desu ka'],
      lessonHighlights: ['Sayi kartlari', 'Hizli sayma', 'Dinle-tekrar et', 'Quiz'],
      dialogue: [
        { speaker: 'A', text: 'Ikutsu desu ka.', translation: 'Kac tane?' },
        { speaker: 'B', text: 'Mittsu desu.', translation: 'Uc tane.' }
      ],
      bannerClassName:
        'bg-[linear-gradient(135deg,var(--kt-accent-warning)_0%,var(--kt-accent-success)_100%)]',
      accentGlow: 'rgba(255, 186, 90, 0.32)',
      tone: 'warning',
      mascotPose: 'cheer'
    },
    {
      id: 'p3-u10',
      partNumber: 3,
      unitNumber: 10,
      title: 'Dukkanda alisveris yap',
      summary: 'Fiyat sor, begendiklerini ifade et ve odeme kaliplarini kullan.',
      goals: [
        'Ikura desu ka ile fiyat sormak',
        'Kore o kudasai kalibini pekistirmek',
        'Pahalı / ucuz sifatlarini eklemek'
      ],
      vocabulary: ['ikura', 'yasui', 'takai', 'kaimasu', 'mise', 'okane'],
      grammarFocus: ['Ikura desu ka', 'X en desu', 'Kore o kudasai'],
      lessonHighlights: ['Fiyat tabelasi', 'Diyalog', 'Sayi + en', 'Odeme'],
      dialogue: [
        { speaker: 'A', text: 'Kore wa ikura desu ka.', translation: 'Bu kac para?' },
        { speaker: 'B', text: 'Sanbyaku en desu.', translation: 'Uc yuz yen.' }
      ],
      bannerClassName:
        'bg-[linear-gradient(135deg,var(--kt-accent-success)_0%,var(--kt-accent-warning)_100%)]',
      accentGlow: 'rgba(144, 205, 70, 0.3)',
      tone: 'success',
      mascotPose: 'wave'
    },
    {
      id: 'p3-u11',
      partNumber: 3,
      unitNumber: 11,
      title: 'Renkler ve giysiler hakkinda konus',
      summary: 'Renk adlarini ogren ve giysileri rengiyle birlikte tanimla.',
      goals: [
        'Temel renk kelimelerini tanimak',
        'X-iro no Y kalibini kurmak',
        'Giysi + renk kombinasyonu yapmak'
      ],
      vocabulary: ['aka', 'ao', 'shiro', 'kuro', 'ki', 'fuku'],
      grammarFocus: ['X-iro no Y', 'Nani-iro desu ka', 'Sifat + isim'],
      lessonHighlights: ['Renk paleti', 'Esleme', 'Cumle kurma', 'Mini test'],
      dialogue: [
        { speaker: 'A', text: 'Sono fuku wa nan-iro desu ka.', translation: 'O kıyafetin rengi ne?' },
        { speaker: 'B', text: 'Aoi fuku desu.', translation: 'Mavi bir kıyafet.' }
      ],
      bannerClassName:
        'bg-[linear-gradient(135deg,var(--kt-accent-info)_0%,var(--kt-accent-plum)_100%)]',
      accentGlow: 'rgba(54, 160, 255, 0.28)',
      tone: 'info',
      mascotPose: 'study'
    },
    {
      id: 'p3-u12',
      partNumber: 3,
      unitNumber: 12,
      title: 'Kontrol noktasi: Alisveris',
      summary: 'Sayilar, fiyatlar ve renkler konularini test eden kontrol noktasi.',
      goals: [
        'Sayilari ve fiyatlari dogru kullanmak',
        'Renk ve giysi tanimlamasi yapmak',
        'Alisveris diyalogunu tamamlamak'
      ],
      vocabulary: ['ikura', 'en', 'iro', 'kaimasu', 'yasui', 'takai'],
      grammarFocus: ['Sayilar + en', 'Renk + isim', 'Alisveris kaliplari'],
      lessonHighlights: ['Karma sorular', 'Diyalog tamamlama', 'Hizli secim', 'Sonuc'],
      dialogue: [
        { speaker: 'A', text: 'Aoi shatsu o kudasai.', translation: 'Mavi gomlek lutfen.' },
        { speaker: 'B', text: 'Hai, senhyaku en desu.', translation: 'Tabii, bin yuz yen.' }
      ],
      bannerClassName:
        'bg-[linear-gradient(135deg,var(--kt-accent-warning)_0%,var(--kt-brand)_100%)]',
      accentGlow: 'rgba(255, 186, 90, 0.3)',
      tone: 'warning',
      mascotPose: 'cheer'
    },
    {
      id: 'p3-u13',
      partNumber: 3,
      unitNumber: 13,
      title: 'Ulasim araclari ve yolculuk',
      summary: 'Tren, otobus ve taksi gibi tasitlari kullanarak yolculuk cumleleri kur.',
      goals: [
        'Temel ulasim kelimelerini tanimak',
        'De gitmek / binerek gitmek kalibini kullanmak',
        'Bilet alma diyalogunu kurmak'
      ],
      vocabulary: ['densha', 'basu', 'takushii', 'eki', 'norimas', 'kippu'],
      grammarFocus: ['X de ikimasu', 'X ni norimas', 'Doko made'],
      lessonHighlights: ['Tasit kartlari', 'Guzergah', 'Bilet diyalogu', 'Quiz'],
      dialogue: [
        { speaker: 'A', text: 'Densha de ikimasu.', translation: 'Trenle gidiyorum.' },
        { speaker: 'B', text: 'Eki wa doko desu ka.', translation: 'İstasyon nerede?' }
      ],
      bannerClassName:
        'bg-[linear-gradient(135deg,var(--kt-accent-plum)_0%,var(--kt-accent-info)_100%)]',
      accentGlow: 'rgba(176, 120, 236, 0.3)',
      tone: 'plum',
      mascotPose: 'study'
    },
    {
      id: 'p3-u14',
      partNumber: 3,
      unitNumber: 14,
      title: 'Yon tarif et ve yol sor',
      summary: 'Sag, sol, duz gidin ve donus ifadeleriyle basit yon tarifi yap.',
      goals: [
        'Migi / hidari / massugu farkini pekistirmek',
        'X wa doko desu ka sorusunu kullanmak',
        'Basit tarifli rotayi takip etmek'
      ],
      vocabulary: ['migi', 'hidari', 'massugu', 'magatte', 'chikaku', 'tooi'],
      grammarFocus: ['Migi ni magatte kudasai', 'Massugu itte', 'X no chikaku'],
      lessonHighlights: ['Harita oyunu', 'Dinle-goster', 'Yol tarifi yaz', 'Test'],
      dialogue: [
        { speaker: 'A', text: 'Yuubinkyoku wa doko desu ka.', translation: 'Postane nerede?' },
        { speaker: 'B', text: 'Massugu itte, migi ni magatte kudasai.', translation: 'Duz gidin, sağa donun.' }
      ],
      bannerClassName:
        'bg-[linear-gradient(135deg,var(--kt-accent-info)_0%,var(--kt-brand)_100%)]',
      accentGlow: 'rgba(54, 160, 255, 0.3)',
      tone: 'info',
      mascotPose: 'wave'
    },
    {
      id: 'p3-u15',
      partNumber: 3,
      unitNumber: 15,
      title: 'Hava durumunu anlat',
      summary: 'Bugun hava nasil, sicak mi soguk mu sorularini yanıtlamayı ogren.',
      goals: [
        'Temel hava durumu kelimelerini tanimak',
        'Kyoo no tenki wa ... desu kalibini kurmak',
        'Mevsim ve hava sifatlarini baglamak'
      ],
      vocabulary: ['tenki', 'atsui', 'samui', 'ame', 'hare', 'kaze'],
      grammarFocus: ['Kyoo wa X desu', 'Tenki ga ii / warui', 'Meevsim kelimeleri'],
      lessonHighlights: ['Hava sembolleri', 'Tahmın diyalogu', 'Mevsim esleme', 'Quiz'],
      dialogue: [
        { speaker: 'A', text: 'Kyoo no tenki wa dou desu ka.', translation: 'Bugunun havası nasıl?' },
        { speaker: 'B', text: 'Atsukute, hare desu.', translation: 'Sicak ve acik.' }
      ],
      bannerClassName:
        'bg-[linear-gradient(135deg,var(--kt-accent-info)_0%,var(--kt-accent-success)_100%)]',
      accentGlow: 'rgba(54, 160, 255, 0.28)',
      tone: 'info',
      mascotPose: 'study'
    },
    {
      id: 'p3-u16',
      partNumber: 3,
      unitNumber: 16,
      title: 'Kontrol noktasi: Ulasim ve hava',
      summary: 'Ulasim, yon tarifi ve hava durumu konularini test eden buyuk kontrol noktasi.',
      goals: [
        'Ulasim ve yon kelimelerini dogru kullanmak',
        'Hava durumu cumleleri kurmak',
        'Karma konularda akici cevap vermek'
      ],
      vocabulary: ['densha', 'migi', 'tenki', 'atsui', 'eki', 'massugu'],
      grammarFocus: ['X de ikimasu', 'Yon tarifi', 'Tenki cumleleri'],
      lessonHighlights: ['Karma sorular', 'Senaryo oyunu', 'Hizli secim', 'Buyuk final'],
      dialogue: [
        { speaker: 'A', text: 'Eki wa doko desu ka.', translation: 'İstasyon nerede?' },
        { speaker: 'B', text: 'Massugu itte, hidari ni magatte kudasai.', translation: 'Duz gidin, sola donun.' }
      ],
      bannerClassName:
        'bg-[linear-gradient(135deg,var(--kt-accent-plum)_0%,var(--kt-accent-sunset)_100%)]',
      accentGlow: 'rgba(176, 120, 236, 0.32)',
      tone: 'plum',
      mascotPose: 'cheer'
    }
  ]
};

trSections.push(trPart3);

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

enSections.push({
  ...trPart3,
  title: 'Shopping and numbers',
  description: 'Use numbers, shop, ask for directions, and talk about the weather.',
  units: [
    { ...trPart3.units[0], summary: 'Learn numbers 1-100 and use them in conversation.' },
    { ...trPart3.units[1], summary: 'Ask for prices, express preferences, and pay.' },
    { ...trPart3.units[2], summary: 'Learn color names and describe clothing.' },
    { ...trPart3.units[3], summary: 'Shopping checkpoint: numbers, prices, and colors.' },
    { ...trPart3.units[4], summary: 'Use trains, buses, and taxis to travel.' },
    { ...trPart3.units[5], summary: 'Ask for and give simple directions.' },
    { ...trPart3.units[6], summary: 'Describe the weather and seasons.' },
    { ...trPart3.units[7], summary: 'Transport and weather checkpoint.' }
  ]
});

interface CanonicalN5UnitBlueprint {
  title: { tr: string; en: string };
  summary: { tr: string; en: string };
  goals: { tr: string[]; en: string[] };
  vocabulary: string[];
  grammarFocus: string[];
  lessonHighlights: string[];
  dialogue: {
    text: string;
    tr: string;
    en: string;
  }[];
}

const canonicalN5Units: CanonicalN5UnitBlueprint[] = [
  {
    title: { tr: 'Selamlasma ve sosyal rituel', en: 'Greetings and social rituals' },
    summary: { tr: 'Eve giris, yemek, okul selami, veda, tesekkur ve ozur kaliplari.', en: 'Entering a home, meals, school greetings, farewells, thanks, and apologies.' },
    goals: {
      tr: ['Iliskiye gore selam secmek', 'Ev ve yemek rituel kaliplarini kullanmak', 'Tesekkur ve ozur ayrimini yapmak'],
      en: ['Choose greetings by relationship', 'Use home and meal ritual phrases', 'Separate thanks from apologies']
    },
    vocabulary: ['ohayou', 'konnichiwa', 'konbanwa', 'oyasumi', 'itadakimasu', 'sumimasen'],
    grammarFocus: ['aisatsu register', 'ohayou gozaimasu vs ohayou', 'sumimasen vs gomen nasai'],
    lessonHighlights: ['Enter the House', 'Dinner Time', 'Saying Goodnight', 'Greeting Your Teacher', 'Meet Yuki', 'Saying Goodbye', 'Thank and Apologize', 'Checkpoint'],
    dialogue: [
      { text: 'Ohayou gozaimasu.', tr: 'Gunaydin.', en: 'Good morning.' },
      { text: 'Sumimasen. Arigatou gozaimasu.', tr: 'Affedersiniz. Tesekkur ederim.', en: 'Excuse me. Thank you.' }
    ]
  },
  {
    title: { tr: 'Kendini tanitma', en: 'Self-introduction' },
    summary: { tr: 'Isim, milliyet, meslek, soru-cevap, aitlik ve olumsuz isim cumleleri.', en: 'Name, nationality, role, questions, possession, and negative noun sentences.' },
    goals: {
      tr: ['Watashi wa ... desu kalibiyle tanitmak', 'Desu ka sorularina yanit vermek', 'No ile aitlik kurmak'],
      en: ['Introduce yourself with watashi wa ... desu', 'Answer desu ka questions', 'Use no for possession']
    },
    vocabulary: ['watashi', 'nihon', 'amerika', 'nihonjin', 'gakusei', 'sensei'],
    grammarFocus: ['N wa N desu', 'N wa N desu ka', 'Noun no Noun', 'N wa N janai desu'],
    lessonHighlights: ['I Am...', 'My Occupation', 'Asking Questions', 'This and That', 'Whose Is This?', 'Negative Identity', 'Checkpoint'],
    dialogue: [
      { text: 'Watashi wa gakusei desu.', tr: 'Ben ogrenciyim.', en: 'I am a student.' },
      { text: 'Sensei desu ka. Iie, chigaimasu.', tr: 'Ogretmen misiniz? Hayir, degil.', en: 'Are you a teacher? No, that is not right.' }
    ]
  },
  {
    title: { tr: 'Sayilar ve para', en: 'Numbers and money' },
    summary: { tr: '1-10000 arasi sayilar, yen fiyatlari, pahali/ucuz tepkileri.', en: 'Numbers from 1 to 10000, yen prices, and cheap/expensive reactions.' },
    goals: {
      tr: ['Temel sayilari okumak', 'Fiyat sormak ve soylemek', 'Yen ile alisveris cumlesi kurmak'],
      en: ['Read core numbers', 'Ask and state prices', 'Build yen shopping sentences']
    },
    vocabulary: ['ichi', 'ni', 'san', 'juu', 'hyaku', 'ikura'],
    grammarFocus: ['cardinal numbers', 'juu / hyaku / sen / man', 'ikura + N wa N en desu'],
    lessonHighlights: ['Numbers 1-10', 'Tens and Hundreds', 'How Much?', 'Checkpoint'],
    dialogue: [
      { text: 'Kore wa ikura desu ka.', tr: 'Bu ne kadar?', en: 'How much is this?' },
      { text: 'Sanbyaku en desu.', tr: 'Uc yuz yen.', en: 'It is 300 yen.' }
    ]
  },
  {
    title: { tr: 'Saat, gun ve tarih', en: 'Time, days, and dates' },
    summary: { tr: 'Saat soyleme, haftanin gunleri, ne zaman ve nereden nereye araligi.', en: 'Telling time, weekdays, when questions, and from-until ranges.' },
    goals: {
      tr: ['Ima ... ji desu kalibini kullanmak', 'Gunleri ni ile baglamak', 'Kara-made ile aralik vermek'],
      en: ['Use ima ... ji desu', 'Attach days with ni', 'Give ranges with kara-made']
    },
    vocabulary: ['ima', 'ji', 'fun', 'getsuyoubi', 'kinyoubi', 'kara'],
    grammarFocus: ['ji / fun desu', 'youbi ni', 'kara-made'],
    lessonHighlights: ['Telling Time', 'Days of the Week', 'From / Until', 'Schedule Checkpoint'],
    dialogue: [
      { text: 'Ima shichi ji desu.', tr: 'Simdi saat yedi.', en: 'It is seven now.' },
      { text: 'Getsuyoubi kara kinyoubi made desu.', tr: 'Pazartesiden cumaya kadar.', en: 'From Monday to Friday.' }
    ]
  },
  {
    title: { tr: 'Gunluk aktiviteler ve fiiller', en: 'Daily activities and verbs' },
    summary: { tr: 'Ru-fiiller, u-fiiller, masu cekimi, nesne ve hedef parcaciklari.', en: 'Ru-verbs, u-verbs, masu forms, objects, and destination particles.' },
    goals: {
      tr: ['Masu formunda fiil kurmak', 'O ile nesne isaretlemek', 'Ni/he ile hedef soylemek'],
      en: ['Use verbs in masu form', 'Mark objects with o', 'State destinations with ni/he']
    },
    vocabulary: ['tabemasu', 'mimasu', 'ikimasu', 'kaerimasu', 'gohan', 'gakkou'],
    grammarFocus: ['ru-verb masu form', 'u-verb masu form', 'Verb + o', 'ni/he destination', 'mashita / masen deshita'],
    lessonHighlights: ['Ru-Verbs', 'U-Verbs', 'What Do You Eat/Drink?', 'Where Do You Go?', 'When Do You Do It?', 'Negative and Past', 'Checkpoint'],
    dialogue: [
      { text: 'Mainichi gakkou ni ikimasu.', tr: 'Her gun okula giderim.', en: 'I go to school every day.' },
      { text: 'Kinou pan o tabemashita.', tr: 'Dun ekmek yedim.', en: 'I ate bread yesterday.' }
    ]
  },
  {
    title: { tr: 'Sifatlarla anlatma', en: 'Describing with adjectives' },
    summary: { tr: 'I-sifat ve na-sifat olumlu, olumsuz, gecmis ve isim oncesi kullanim.', en: 'I-adjectives and na-adjectives in positive, negative, past, and noun-modifying forms.' },
    goals: {
      tr: ['I-sifatlari cekimlemek', 'Na-sifatlari desu ile kullanmak', 'Sifat + isim kurmak'],
      en: ['Conjugate i-adjectives', 'Use na-adjectives with desu', 'Modify nouns with adjectives']
    },
    vocabulary: ['ookii', 'chiisai', 'atarashii', 'yasui', 'kirei', 'shizuka'],
    grammarFocus: ['i-adj + desu', 'i-adj kunai / katta', 'na-adj + desu', 'na-adj janai / deshita', 'adj + noun'],
    lessonHighlights: ['Basic i-Adjectives', 'Negative and Past i-Adj', 'Ii and Bad', 'Basic na-Adjectives', 'Negative and Past na-Adj', 'Adjective + Noun', 'Checkpoint'],
    dialogue: [
      { text: 'Kono hon wa atarashii desu.', tr: 'Bu kitap yenidir.', en: 'This book is new.' },
      { text: 'Ano mise wa shizuka deshita.', tr: 'Su dukkan sakindi.', en: 'That shop was quiet.' }
    ]
  },
  {
    title: { tr: 'Varlik ve konum', en: 'Existence and location' },
    summary: { tr: 'Imasu/arimasu, yer kelimeleri ve insanlar ile nesnelerin konumu.', en: 'Imasu/arimasu, location words, and positions of people and things.' },
    goals: {
      tr: ['Canlilar icin imasu kullanmak', 'Nesneler icin arimasu kullanmak', 'Ue/shita/mae gibi konumlari soylemek'],
      en: ['Use imasu for living things', 'Use arimasu for objects', 'State positions like ue/shita/mae']
    },
    vocabulary: ['imasu', 'arimasu', 'neko', 'tsukue', 'ue', 'shita'],
    grammarFocus: ['N ga imasu', 'N ga arimasu', 'position noun + ni', 'N no soba ni'],
    lessonHighlights: ['Living Things Exist', 'Things Exist', 'Location Words', 'Where Is the Station?', 'Checkpoint'],
    dialogue: [
      { text: 'Tsukue no ue ni hon ga arimasu.', tr: 'Masanin ustunde kitap var.', en: 'There is a book on the desk.' },
      { text: 'Eki wa konbini no tonari ni arimasu.', tr: 'Istasyon marketin yaninda.', en: 'The station is next to the convenience store.' }
    ]
  },
  {
    title: { tr: 'Sayaclar', en: 'Counters' },
    summary: { tr: 'Kisi sayma, yerli sayilar ve mai/hon/satsu/hiki gibi temel sayaclar.', en: 'Counting people, native numbers, and common counters like mai/hon/satsu/hiki.' },
    goals: {
      tr: ['Hitori/futari ayrimini bilmek', 'Hitotsu-tou arasi saymak', 'Nesne tipine gore sayac secmek'],
      en: ['Use hitori/futari correctly', 'Count with hitotsu-tou', 'Choose counters by object type']
    },
    vocabulary: ['hitori', 'futari', 'nin', 'hitotsu', 'mai', 'hon'],
    grammarFocus: ['nin counters', 'native number counters', 'mai / hon / satsu / hiki'],
    lessonHighlights: ['Counting People', 'Counting Things', 'How Many?', 'Counter Checkpoint'],
    dialogue: [
      { text: 'Futari desu.', tr: 'Iki kisiyiz.', en: 'Two people.' },
      { text: 'Hon o nisatsu kudasai.', tr: 'Iki kitap lutfen.', en: 'Two books, please.' }
    ]
  },
  {
    title: { tr: 'Alisveris ve para', en: 'Shopping and money' },
    summary: { tr: 'Kosoado sistemi, burada/orada, isteme, adet ve tam magaza islemi.', en: 'Kosoado, here/there, wanting items, quantities, and full store transactions.' },
    goals: {
      tr: ['Kono/sono/ano/dono ile nesne secmek', 'Kudasai ile istemek', 'Hoshii ile istek soylemek'],
      en: ['Pick items with kono/sono/ano/dono', 'Request with kudasai', 'Express wants with hoshii']
    },
    vocabulary: ['kore', 'sore', 'are', 'kudasai', 'hoshii', 'reshiito'],
    grammarFocus: ['kono/sono/ano/dono + noun', 'koko/soko/asoko/doko', 'N o kudasai', 'N ga hoshii desu'],
    lessonHighlights: ['This One or That One?', 'Here and There', 'Buying Things', 'I Want This', 'How Many?', 'Full Shopping Scene', 'Checkpoint'],
    dialogue: [
      { text: 'Kono pan o hitotsu kudasai.', tr: 'Bu ekmekten bir tane lutfen.', en: 'One of this bread, please.' },
      { text: 'Kore ga hoshii desu.', tr: 'Bunu istiyorum.', en: 'I want this.' }
    ]
  },
  {
    title: { tr: 'Rica ve izin', en: 'Requests and permissions' },
    summary: { tr: 'Te-form, rica, izin, yasak ve okul kurallari.', en: 'Te-form, requests, permission, prohibitions, and school rules.' },
    goals: {
      tr: ['Ru ve u fiilleri te-forma cevirmek', 'Te kudasai ile rica etmek', 'Te mo ii / te wa ikemasen ayrimini yapmak'],
      en: ['Convert ru/u verbs to te-form', 'Request with te kudasai', 'Separate te mo ii from te wa ikemasen']
    },
    vocabulary: ['tabete', 'mite', 'itte', 'kaite', 'matte', 'kinshi'],
    grammarFocus: ['ru-verb te-form', 'u-verb te-form', 'te kudasai', 'te mo ii desu ka', 'te wa ikemasen', 'naide kudasai'],
    lessonHighlights: ['Te-Form of ru-Verbs', 'Te-Form of u-Verbs', 'Please Do This', 'May I?', 'Do Not Do That', 'Helping a Friend', 'Checkpoint'],
    dialogue: [
      { text: 'Mite kudasai.', tr: 'Lutfen bakin.', en: 'Please look.' },
      { text: 'Koko ni suwatte mo ii desu ka.', tr: 'Buraya oturabilir miyim?', en: 'May I sit here?' }
    ]
  },
  {
    title: { tr: 'Devam eden durumlar ve aile', en: 'Ongoing actions and family' },
    summary: { tr: 'Te iru ile su an, durum, giyinme, bilme/yasama ve aile anlatimi.', en: 'Te iru for now, states, wearing, knowing/living, and family descriptions.' },
    goals: {
      tr: ['Su anki eylemi te imasu ile anlatmak', 'Giyinme ve yasama durumlarini soylemek', 'Aile uyelerini tanitmak'],
      en: ['Describe current actions with te imasu', 'State wearing/living conditions', 'Introduce family members']
    },
    vocabulary: ['ima', 'shitte imasu', 'sunde imasu', 'chichi', 'haha', 'kazoku'],
    grammarFocus: ['Verb-te imasu progressive', 'te iru state', 'shitte imasu / shirimasen', 'family humble vs respectful words'],
    lessonHighlights: ['What Are You Doing Now?', 'What Is She Wearing?', 'Do You Know?', 'My Family', 'Family Lives', 'Describe the Scene', 'Checkpoint'],
    dialogue: [
      { text: 'Ima denwa o shite imasu.', tr: 'Simdi telefon ediyorum.', en: 'I am on the phone now.' },
      { text: 'Haha wa Tokyo ni sunde imasu.', tr: 'Annem Tokyo da yasiyor.', en: 'My mother lives in Tokyo.' }
    ]
  },
  {
    title: { tr: 'Sevme, isteme ve neden', en: 'Likes, wants, and reasons' },
    summary: { tr: 'Suki/kirai, jouzu/heta, hobi, tai-form ve kara ile neden.', en: 'Suki/kirai, jouzu/heta, hobbies, tai-form, and reasons with kara.' },
    goals: {
      tr: ['Ga suki/kirai kalibini kullanmak', 'Vru koto ga suki demek', 'Tai desu ve kara ile istek aciklamak'],
      en: ['Use ga suki/kirai', 'Say Vru koto ga suki', 'Explain wants with tai desu and kara']
    },
    vocabulary: ['suki', 'kirai', 'jouzu', 'heta', 'shumi', 'kara'],
    grammarFocus: ['N ga suki/kirai desu', 'N ga jouzu/heta desu', 'Vru koto ga suki', 'verb-stem + tai desu', 'kara reason'],
    lessonHighlights: ['I Like / I Dislike', 'Good At / Bad At', 'Hobbies', 'I Want To Do...', 'Because', 'Dream Conversation', 'Checkpoint'],
    dialogue: [
      { text: 'Eiga ga suki desu.', tr: 'Film severim.', en: 'I like movies.' },
      { text: 'Nihon ni ikitai desu kara, benkyou shimasu.', tr: 'Japonya ya gitmek istedigim icin calisiyorum.', en: 'I study because I want to go to Japan.' }
    ]
  },
  {
    title: { tr: 'Karsilastirma ve soru kelimeleri', en: 'Comparisons and question words' },
    summary: { tr: 'Yori, hou ga, ichiban, dochira, donna ve temel soru kelimeleri.', en: 'Yori, hou ga, ichiban, dochira, donna, and core question words.' },
    goals: {
      tr: ['A wa B yori kalibini kurmak', 'Ichiban ile en iyiyi soylemek', 'Soru kelimeleriyle tercih sormak'],
      en: ['Build A wa B yori comparisons', 'Use ichiban for the best', 'Ask preferences with question words']
    },
    vocabulary: ['yori', 'ichiban', 'dochira', 'dare', 'nani', 'donna'],
    grammarFocus: ['A wa B yori adj desu', 'N no naka de ichiban', 'A to B to dochira', 'question word + verb + ka', 'donna N'],
    lessonHighlights: ['A is More Than B', 'The Best of All', 'Which Do You Prefer?', 'Who, What, Where', 'What Kind Of?', 'Travel Planning Discussion', 'Checkpoint'],
    dialogue: [
      { text: 'Tokyo wa Osaka yori ookii desu.', tr: 'Tokyo Osaka dan daha buyuk.', en: 'Tokyo is bigger than Osaka.' },
      { text: 'Densha to basu to dochira ga ii desu ka.', tr: 'Tren mi otobus mu daha iyi?', en: 'Which is better, train or bus?' }
    ]
  },
  {
    title: { tr: 'Ulasim ve plan yapma', en: 'Transportation and planning' },
    summary: { tr: 'Aracla gitme, rota, sure, mashou/mashou ka, davet ve yon tarifleri.', en: 'Travel by transport, routes, duration, mashou/mashou ka, invitations, and directions.' },
    goals: {
      tr: ['De ikimasu ile ulasim araci soylemek', 'Kara-made ile rota kurmak', 'Mashou/masen ka ile plan yapmak'],
      en: ['State transport with de ikimasu', 'Build routes with kara-made', 'Plan with mashou/masen ka']
    },
    vocabulary: ['densha', 'basu', 'eki', 'norikae', 'massugu', 'migi'],
    grammarFocus: ['transport + de ikimasu', 'place kara-made', 'duration + kakarimasu', 'mashou / mashou ka', 'masen ka invitation', 'direction verbs + te-form'],
    lessonHighlights: ['Transportation', 'From Here to There', 'How Long Does It Take?', 'Let Us Go!', 'Would You Like To?', 'Getting to the Museum', 'Checkpoint'],
    dialogue: [
      { text: 'Densha de eki made ikimasu.', tr: 'Trenle istasyona giderim.', en: 'I go to the station by train.' },
      { text: 'Issho ni ikimasen ka.', tr: 'Birlikte gitmez miyiz?', en: 'Would you like to go together?' }
    ]
  },
  {
    title: { tr: 'Yemek, restoran ve siralama', en: 'Food, restaurants, and sequences' },
    summary: { tr: 'Japon yemekleri, tat sifatlari, restoran siparisi ve te-form zinciri.', en: 'Japanese foods, taste adjectives, restaurant ordering, and te-form chaining.' },
    goals: {
      tr: ['Yemek ve tat kelimelerini kullanmak', 'Restoranda nazik siparis vermek', 'Eylemleri te-form ile siralamak'],
      en: ['Use food and taste words', 'Order politely at restaurants', 'Sequence actions with te-form']
    },
    vocabulary: ['sushi', 'raamen', 'oishii', 'karai', 'osusume', 'okaikei'],
    grammarFocus: ['food noun vocabulary', 'taste i-adjectives', 'N o hitotsu kudasai', 'te-form action sequence', 'mazu / tsugi ni / sorekara'],
    lessonHighlights: ['Japanese Food Vocab', 'It Is Delicious!', 'Ordering at a Restaurant', 'And Then...', 'My Morning Routine', 'Restaurant Role-play', 'Checkpoint'],
    dialogue: [
      { text: 'Raamen o hitotsu kudasai.', tr: 'Bir ramen lutfen.', en: 'One ramen, please.' },
      { text: 'Shawaa o abite, dekakemasu.', tr: 'Dus alip disari cikarim.', en: 'I shower, then go out.' }
    ]
  },
  {
    title: { tr: 'Duz form ve N5 finali', en: 'Plain forms and N5 finale' },
    summary: { tr: 'Duz form, olumsuz duz form, to omoimasu, N5 kanji ve genel tekrar.', en: 'Plain form, plain negatives, to omoimasu, N5 kanji, and full review.' },
    goals: {
      tr: ['Duz formu tanimak ve uretmek', 'To omoimasu ile fikir soylemek', 'N5 kapsaminda karma tekrar yapmak'],
      en: ['Recognize and produce plain forms', 'State opinions with to omoimasu', 'Review the full N5 scope']
    },
    vocabulary: ['taberu', 'nomanai', 'to omoimasu', 'tabun', 'kanji', 'N5'],
    grammarFocus: ['dictionary/plain non-past', 'verb nai-form', 'adj kunai / N janai', 'plain form + to omoimasu', 'core N5 kanji in context', 'full N5 synthesis'],
    lessonHighlights: ['Plain Form Non-Past', 'Plain Negative', 'I Think That...', 'N5 Grammar Review', 'Kanji Basics', 'One Month in Japan', 'N5 Grand Checkpoint'],
    dialogue: [
      { text: 'Ashita ame ga furu to omoimasu.', tr: 'Yarin yagmur yagacak diye dusunuyorum.', en: 'I think it will rain tomorrow.' },
      { text: 'N5 no mondai o zenbu fukushuu shimasu.', tr: 'Butun N5 sorularini tekrar ederim.', en: 'I review all N5 questions.' }
    ]
  }
];

const canonicalN5SectionMeta = [
  {
    title: { tr: 'N5 Temel iletisim', en: 'N5 core communication' },
    description: { tr: 'Selamlas, kendini tanit, sayi ve zaman cumleleri kur.', en: 'Greet people, introduce yourself, and use numbers and time.' }
  },
  {
    title: { tr: 'N5 cumle kurma', en: 'N5 sentence building' },
    description: { tr: 'Fiil, sifat, konum ve sayaclarla temel cumleleri genislet.', en: 'Expand core sentences with verbs, adjectives, locations, and counters.' }
  },
  {
    title: { tr: 'N5 sosyal yasam', en: 'N5 social life' },
    description: { tr: 'Alisveris, rica, izin, aile, tercih ve istekleri kullan.', en: 'Use shopping, requests, permission, family, preferences, and wants.' }
  },
  {
    title: { tr: 'N5 baglama ve final', en: 'N5 integration and finale' },
    description: { tr: 'Karsilastir, plan yap, restoranda konus ve N5 finalini tamamla.', en: 'Compare, plan, order food, sequence actions, and finish the N5 review.' }
  }
];

const canonicalN5Tones: LearnUnitTone[] = [
  'info',
  'brand',
  'warning',
  'plum',
  'success',
  'plum',
  'info',
  'warning',
  'success',
  'brand',
  'info',
  'plum',
  'warning',
  'info',
  'success',
  'brand'
];

const canonicalN5Banners = [
  'bg-[linear-gradient(135deg,var(--kt-accent-info)_0%,var(--kt-accent-success)_100%)]',
  'bg-[linear-gradient(135deg,var(--kt-brand)_0%,var(--kt-accent-warning)_100%)]',
  'bg-[linear-gradient(135deg,var(--kt-accent-warning)_0%,var(--kt-accent-success)_100%)]',
  'bg-[linear-gradient(135deg,var(--kt-accent-plum)_0%,var(--kt-accent-info)_100%)]',
  'bg-[linear-gradient(135deg,var(--kt-accent-success)_0%,var(--kt-brand)_100%)]',
  'bg-[linear-gradient(135deg,var(--kt-accent-plum)_0%,var(--kt-accent-sunset)_100%)]',
  'bg-[linear-gradient(135deg,var(--kt-accent-info)_0%,var(--kt-brand)_100%)]',
  'bg-[linear-gradient(135deg,var(--kt-accent-warning)_0%,var(--kt-brand)_100%)]'
];

const canonicalN5GlowByTone: Record<LearnUnitTone, string> = {
  brand: 'rgba(208, 96, 112, 0.3)',
  warning: 'rgba(255, 186, 90, 0.3)',
  success: 'rgba(144, 205, 70, 0.3)',
  plum: 'rgba(176, 120, 236, 0.3)',
  sunset: 'rgba(255, 144, 108, 0.28)',
  info: 'rgba(54, 160, 255, 0.3)'
};

const canonicalN5MascotPoses: LearnCourseUnit['mascotPose'][] = ['wave', 'study', 'cheer', 'study'];

const buildCanonicalN5Sections = (language: AppLanguage): LearnCourseSection[] =>
  canonicalN5SectionMeta.map((section, sectionIndex) => {
    const partNumber = sectionIndex + 1;
    const unitOffset = sectionIndex * 4;

    return {
      id: `n5-part-${partNumber}`,
      partNumber,
      level: 'n5',
      title: section.title[language],
      description: section.description[language],
      bannerClassName: canonicalN5Banners[sectionIndex % canonicalN5Banners.length],
      units: canonicalN5Units.slice(unitOffset, unitOffset + 4).map((unit, localIndex) => {
        const unitNumber = unitOffset + localIndex + 1;
        const tone = canonicalN5Tones[unitNumber - 1];

        return {
          id: `p${partNumber}-u${unitNumber}`,
          partNumber,
          unitNumber,
          title: unit.title[language],
          summary: unit.summary[language],
          goals: unit.goals[language],
          vocabulary: unit.vocabulary,
          grammarFocus: unit.grammarFocus,
          lessonHighlights: unit.lessonHighlights,
          dialogue: unit.dialogue.map((line, lineIndex) => ({
            speaker: lineIndex === 0 ? 'A' : 'B',
            text: line.text,
            translation: line[language]
          })),
          bannerClassName: canonicalN5Banners[(unitNumber - 1) % canonicalN5Banners.length],
          accentGlow: canonicalN5GlowByTone[tone],
          tone,
          mascotPose: canonicalN5MascotPoses[(unitNumber - 1) % canonicalN5MascotPoses.length]
        };
      })
    };
  });

trSections.splice(0, trSections.length, ...buildCanonicalN5Sections('tr'));
enSections.splice(0, enSections.length, ...buildCanonicalN5Sections('en'));

const trN4Sections: LearnCourseSection[] = [
  {
    id: 'n4-part-1',
    partNumber: 1,
    level: 'n4',
    title: 'Temel dilbilgisi',
    description: 'Te-form, geçmiş zaman ve bağlaçları kullan.',
    bannerClassName:
      'bg-[linear-gradient(135deg,var(--kt-accent-info)_0%,var(--kt-brand)_100%)]',
    units: [
      {
        id: 'n4-p1-u1',
        partNumber: 1,
        unitNumber: 1,
        title: 'Te-form kullanımı',
        summary: 'Fiilleri te-form a çevir ve birden fazla eylemi birbirine bağla.',
        goals: ['Te-form oluşturmak', 'Eylemleri zincirlemek', 'İzin ve rica ifadesi'],
        vocabulary: ['tabete', 'nonde', 'itte', 'mite', 'shite', 'kite'],
        grammarFocus: ['V-te form', 'V-te kudasai', 'V-te mo ii desu ka'],
        lessonHighlights: ['Dönüşüm tablosu', 'Zincir cümleler', 'Rica kalıpları', 'Quiz'],
        dialogue: [
          { speaker: 'A', text: 'Mite kudasai.', translation: 'Lütfen bakın.' },
          { speaker: 'B', text: 'Hai, wakarimashita.', translation: 'Evet, anladım.' }
        ],
        bannerClassName:
          'bg-[linear-gradient(135deg,var(--kt-accent-info)_0%,var(--kt-brand)_100%)]',
        accentGlow: 'rgba(54, 160, 255, 0.30)',
        tone: 'info',
        mascotPose: 'study'
      },
      {
        id: 'n4-p1-u2',
        partNumber: 1,
        unitNumber: 2,
        title: 'Geçmiş zaman',
        summary: 'Ta-form ile geçmiş eylemleri ve deneyimleri anlat.',
        goals: ['Ta-form oluşturmak', 'Geçmiş olayları anlatmak', 'Koto ga aru ile deneyim'],
        vocabulary: ['tabeta', 'itta', 'mita', 'shita', 'kita', 'nonda'],
        grammarFocus: ['V-ta form', 'V-ta koto ga aru', 'Geçmiş zaman cümleleri'],
        lessonHighlights: ['Geçmiş dönüşümü', 'Deneyim anlatımı', 'Zaman çizgisi', 'Test'],
        dialogue: [
          { speaker: 'A', text: 'Nihon ni itta koto ga arimasu ka.', translation: 'Japonya ya gittin mi?' },
          { speaker: 'B', text: 'Hai, ichinendo itta koto ga arimasu.', translation: 'Evet, bir kez gittim.' }
        ],
        bannerClassName:
          'bg-[linear-gradient(135deg,var(--kt-accent-plum)_0%,var(--kt-accent-info)_100%)]',
        accentGlow: 'rgba(176, 120, 236, 0.30)',
        tone: 'plum',
        mascotPose: 'wave'
      },
      {
        id: 'n4-p1-u3',
        partNumber: 1,
        unitNumber: 3,
        title: 'Bağlaçlar ve sıralama',
        summary: 'Cümleleri kara, node, ga ve demo ile birbirine bağla.',
        goals: ['Neden-sonuç ilişkisi kurmak', 'Zıtlık ifadesi', 'Cümle bağlama'],
        vocabulary: ['dakara', 'demo', 'shikashi', 'soshite', 'mata', 'sorede'],
        grammarFocus: ['Kara / node', 'Demo / shikashi / ga', 'Soshite / sorede'],
        lessonHighlights: ['Bağlaç haritası', 'Cümle birleştirme', 'Tartışma diyaloğu', 'Quiz'],
        dialogue: [
          { speaker: 'A', text: 'Ame ga futta kara, uchi ni imashita.', translation: 'Yağmur yağdığı için evdeydim.' },
          { speaker: 'B', text: 'Demo, watashi wa dekakemashita.', translation: 'Ama ben çıktım.' }
        ],
        bannerClassName:
          'bg-[linear-gradient(135deg,var(--kt-accent-success)_0%,var(--kt-accent-warning)_100%)]',
        accentGlow: 'rgba(144, 205, 70, 0.28)',
        tone: 'success',
        mascotPose: 'cheer'
      },
      {
        id: 'n4-p1-u4',
        partNumber: 1,
        unitNumber: 4,
        title: 'Kontrol Noktası: N4 Dilbilgisi',
        summary: 'Te-form, geçmiş zaman ve bağlaçları test eden kontrol noktası.',
        goals: ['Te-form ve ta-form kullanımı', 'Bağlaçlarla cümle kurma', 'N4 dilbilgisi özeti'],
        vocabulary: ['tabete', 'itta', 'dakara', 'demo', 'koto', 'arimasu'],
        grammarFocus: ['V-te / V-ta', 'Kara / node / demo', 'Koto ga aru'],
        lessonHighlights: ['Karma sorular', 'Dönüşüm testi', 'Bağlaç seçimi', 'Büyük kontrol'],
        dialogue: [
          { speaker: 'A', text: 'Nihongo o benkyou shita koto ga arimasu ka.', translation: 'Japonca çalıştın mı?' },
          { speaker: 'B', text: 'Hai, mainichi benkyou shite imasu.', translation: 'Evet, her gün çalışıyorum.' }
        ],
        bannerClassName:
          'bg-[linear-gradient(135deg,var(--kt-accent-warning)_0%,var(--kt-brand)_100%)]',
        accentGlow: 'rgba(255, 186, 90, 0.32)',
        tone: 'warning',
        mascotPose: 'cheer'
      }
    ]
  }
];

const enN4Sections: LearnCourseSection[] = [
  {
    ...trN4Sections[0],
    title: 'Core grammar',
    description: 'Use te-form, past tense, and connectors.',
    units: [
      { ...trN4Sections[0].units[0], summary: 'Convert verbs to te-form and chain multiple actions.' },
      { ...trN4Sections[0].units[1], summary: 'Use ta-form to talk about past actions and experiences.' },
      { ...trN4Sections[0].units[2], summary: 'Connect sentences using kara, node, demo, and soshite.' },
      { ...trN4Sections[0].units[3], summary: 'N4 grammar checkpoint: te-form, past tense, and connectors.' }
    ]
  }
];

export const getLearnCourseSections = (language: AppLanguage, level?: JLPTLevel): LearnCourseSection[] => {
  const trAll = [...trSections, ...trN4Sections];
  const enAll = [...enSections, ...enN4Sections];
  const all = language === 'en' ? enAll : trAll;
  if (!level) return all;
  return all.filter((s) => s.level === level);
};

export const flattenLearnCourseUnits = (sections: LearnCourseSection[]) =>
  sections.flatMap((section) => section.units);

export const findLearnUnitById = (sections: LearnCourseSection[], unitId: string) =>
  flattenLearnCourseUnits(sections).find((unit) => unit.id === unitId) ?? null;
