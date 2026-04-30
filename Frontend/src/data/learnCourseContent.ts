import { AppLanguage } from './appPreferences';
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
