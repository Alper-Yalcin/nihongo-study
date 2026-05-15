import { AppLanguage } from '../../../data/appPreferences';
import { KanaSection } from '../../../types';
import { KanaScript } from '../../kana/domain/kanaItem';
import {
  LessonStepId,
  StudyLessonDefinition,
  StudyTrackDefinition
} from '../domain/roadmapTypes';

interface LessonTemplate {
  id: string;
  title: Record<AppLanguage, string>;
  description: Record<AppLanguage, string>;
  groupIds: string[];
  stepOrder?: LessonStepId[];
  minPassScore?: number;
  minMasteryRequired?: number;
  isCheckpoint?: boolean;
  prerequisiteLessonIds?: string[];
}

interface LevelTemplate {
  id: string;
  title: Record<AppLanguage, string>;
  description: Record<AppLanguage, string>;
  lessons: LessonTemplate[];
}

const defaultStepOrder: LessonStepId[] = [
  'introduction',
  'recognition',
  'reading',
  'practice',
  'mini-test'
];

const defaultMinPassScore = 70;
const defaultMinMasteryRequired = 80;

const hiraganaLevelTemplates: LevelTemplate[] = [
  {
    id: 'h-level-1',
    title: {
      tr: 'Level 1 - Temel Sesler',
      en: 'Level 1 - Core Sounds'
    },
    description: {
      tr: 'Ilk gorus, temel kolonlar ve ilk hizli hatirlama.',
      en: 'First exposure, foundational columns, and quick recall.'
    },
    lessons: [
      {
        id: 'h-l1-vowels-ka',
        title: { tr: 'Vowel + Ka Baslangici', en: 'Vowels + Ka Start' },
        description: {
          tr: 'a kolonu ve ka kolonu ile baslangic hatti.',
          en: 'Start with the vowel and ka columns.'
        },
        groupIds: ['a', 'ka']
      },
      {
        id: 'h-l1-sa-ta',
        title: { tr: 'Sa + Ta Akisi', en: 'Sa + Ta Flow' },
        description: {
          tr: 's ve t seslerini tanima ve ayirt etme.',
          en: 'Recognize and separate s and t sounds.'
        },
        groupIds: ['sa', 'ta']
      },
      {
        id: 'h-l1-na-ha',
        title: { tr: 'Na + Ha Guclendirme', en: 'Na + Ha Reinforcement' },
        description: {
          tr: 'ilk level kapanisi, okumayi hizlandirma.',
          en: 'Close the first level with faster reading.'
        },
        groupIds: ['na', 'ha']
      }
    ]
  },
  {
    id: 'h-level-2',
    title: {
      tr: 'Level 2 - Akicilik Temeli',
      en: 'Level 2 - Fluency Base'
    },
    description: {
      tr: 'orta kolonlar, wa/n kapanisi ve checkpoint.',
      en: 'Middle columns, wa/n ending, and a checkpoint.'
    },
    lessons: [
      {
        id: 'h-l2-ma-ya',
        title: { tr: 'Ma + Ya Kombosu', en: 'Ma + Ya Combo' },
        description: {
          tr: 'm ve y seslerinde hizli secim.',
          en: 'Fast selection over m and y sounds.'
        },
        groupIds: ['ma', 'ya']
      },
      {
        id: 'h-l2-ra-wa-n',
        title: { tr: 'Ra + Wa + N', en: 'Ra + Wa + N' },
        description: {
          tr: 'tek hece kapanislari ve ayirt etme.',
          en: 'Final sounds and end-of-syllable recognition.'
        },
        groupIds: ['ra', 'wa', 'n']
      },
      {
        id: 'h-l2-checkpoint',
        title: { tr: 'Checkpoint A', en: 'Checkpoint A' },
        description: {
          tr: 'Level 1-2 karmasi mini degerlendirme.',
          en: 'Mixed mini-evaluation over levels 1-2.'
        },
        groupIds: ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'],
        isCheckpoint: true,
        prerequisiteLessonIds: ['h-l1-vowels-ka', 'h-l1-sa-ta', 'h-l1-na-ha', 'h-l2-ma-ya', 'h-l2-ra-wa-n'],
        minMasteryRequired: 80
      }
    ]
  },
  {
    id: 'h-level-3',
    title: {
      tr: 'Level 3 - Dakuten/Handakuten',
      en: 'Level 3 - Dakuten/Handakuten'
    },
    description: {
      tr: 'sesli varyasyonlari ayirt etme ve tekrar.',
      en: 'Distinguish voiced variations and reinforce.'
    },
    lessons: [
      {
        id: 'h-l3-ga-za',
        title: { tr: 'Ga + Za', en: 'Ga + Za' },
        description: {
          tr: 'g/z sesleri ile hizli tanima.',
          en: 'Fast recognition on g/z sounds.'
        },
        groupIds: ['ga', 'za']
      },
      {
        id: 'h-l3-da-ba',
        title: { tr: 'Da + Ba', en: 'Da + Ba' },
        description: {
          tr: 'd/b kolonlarinda secme ve yazma.',
          en: 'Selection and typing on d/b columns.'
        },
        groupIds: ['da', 'ba']
      },
      {
        id: 'h-l3-pa-checkpoint',
        title: { tr: 'Pa + Voiced Checkpoint', en: 'Pa + Voiced Checkpoint' },
        description: {
          tr: 'p ve diger sesli kolonlari birlestir.',
          en: 'Combine p with other voiced columns.'
        },
        groupIds: ['pa', 'ga', 'za', 'da', 'ba'],
        isCheckpoint: true,
        prerequisiteLessonIds: ['h-l3-ga-za', 'h-l3-da-ba'],
        minMasteryRequired: 80
      }
    ]
  },
  {
    id: 'h-level-4',
    title: {
      tr: 'Level 4 - Yoon Girisi',
      en: 'Level 4 - Yoon Intro'
    },
    description: {
      tr: 'kucuk ya/yu/yo kombinasyonlari.',
      en: 'Small ya/yu/yo combinations.'
    },
    lessons: [
      {
        id: 'h-l4-kya-sha-cha',
        title: { tr: 'Kya + Sha + Cha', en: 'Kya + Sha + Cha' },
        description: {
          tr: 'ilk birlesik ses bloklari.',
          en: 'First combined-sound blocks.'
        },
        groupIds: ['kya', 'sha', 'cha']
      },
      {
        id: 'h-l4-nya-hya-mya',
        title: { tr: 'Nya + Hya + Mya', en: 'Nya + Hya + Mya' },
        description: {
          tr: 'orta yoon setleri ile tekrar.',
          en: 'Reinforcement with mid yoon sets.'
        },
        groupIds: ['nya', 'hya', 'mya']
      }
    ]
  },
  {
    id: 'h-level-5',
    title: {
      tr: 'Level 5 - Yoon Akiciligi',
      en: 'Level 5 - Yoon Fluency'
    },
    description: {
      tr: 'ileri birlesik sesler ve final mini test.',
      en: 'Advanced combined sounds and final mini test.'
    },
    lessons: [
      {
        id: 'h-l5-rya-gya-ja',
        title: { tr: 'Rya + Gya + Ja', en: 'Rya + Gya + Ja' },
        description: {
          tr: 'hizli okuma ve secim karmasi.',
          en: 'Mixed fast reading and selection.'
        },
        groupIds: ['rya', 'gya', 'ja']
      },
      {
        id: 'h-l5-bya-pya-review',
        title: { tr: 'Bya + Pya Final', en: 'Bya + Pya Final' },
        description: {
          tr: 'tum yoon setlerinden final pekistirme.',
          en: 'Final reinforcement across all yoon sets.'
        },
        groupIds: ['bya', 'pya', 'kya', 'sha', 'cha', 'nya', 'hya', 'mya', 'rya', 'gya', 'ja']
      }
    ]
  }
];

const katakanaLevelTemplates: LevelTemplate[] = [
  {
    id: 'k-level-1',
    title: {
      tr: 'Level 1 - Temel Sesler',
      en: 'Level 1 - Core Sounds'
    },
    description: {
      tr: 'katakana temel kolonlarina giris.',
      en: 'Intro to foundational katakana columns.'
    },
    lessons: [
      {
        id: 'k-l1-vowels-ka',
        title: { tr: 'Vowel + Ka Baslangici', en: 'Vowels + Ka Start' },
        description: {
          tr: 'ilk kolonlar ile katakana okuma.',
          en: 'Read katakana with first columns.'
        },
        groupIds: ['a', 'ka']
      },
      {
        id: 'k-l1-sa-ta',
        title: { tr: 'Sa + Ta Akisi', en: 'Sa + Ta Flow' },
        description: {
          tr: 's/t kolonlari hizli tanima.',
          en: 'Fast recognition on s/t columns.'
        },
        groupIds: ['sa', 'ta']
      },
      {
        id: 'k-l1-na-ha',
        title: { tr: 'Na + Ha Guclendirme', en: 'Na + Ha Reinforcement' },
        description: {
          tr: 'ilk level kapanisi.',
          en: 'Close the first level.'
        },
        groupIds: ['na', 'ha']
      }
    ]
  },
  {
    id: 'k-level-2',
    title: {
      tr: 'Level 2 - Akicilik Temeli',
      en: 'Level 2 - Fluency Base'
    },
    description: {
      tr: 'orta kolonlar ve checkpoint.',
      en: 'Middle columns and checkpoint.'
    },
    lessons: [
      {
        id: 'k-l2-ma-ya',
        title: { tr: 'Ma + Ya Kombosu', en: 'Ma + Ya Combo' },
        description: {
          tr: 'kisa tekrar turu.',
          en: 'Short reinforcement cycle.'
        },
        groupIds: ['ma', 'ya']
      },
      {
        id: 'k-l2-ra-wa-n',
        title: { tr: 'Ra + Wa + N', en: 'Ra + Wa + N' },
        description: {
          tr: 'tek hece kapanislari.',
          en: 'End-of-syllable forms.'
        },
        groupIds: ['ra', 'wa', 'n']
      },
      {
        id: 'k-l2-checkpoint',
        title: { tr: 'Checkpoint A', en: 'Checkpoint A' },
        description: {
          tr: 'level 1-2 karmasi mini test.',
          en: 'Mixed mini test for levels 1-2.'
        },
        groupIds: ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'],
        isCheckpoint: true,
        prerequisiteLessonIds: ['k-l1-vowels-ka', 'k-l1-sa-ta', 'k-l1-na-ha', 'k-l2-ma-ya', 'k-l2-ra-wa-n'],
        minMasteryRequired: 80
      }
    ]
  },
  {
    id: 'k-level-3',
    title: {
      tr: 'Level 3 - Dakuten/Handakuten',
      en: 'Level 3 - Dakuten/Handakuten'
    },
    description: {
      tr: 'sesli kolonlarin ayrimi.',
      en: 'Voiced-column discrimination.'
    },
    lessons: [
      {
        id: 'k-l3-ga-za',
        title: { tr: 'Ga + Za', en: 'Ga + Za' },
        description: {
          tr: 'g/z seti.',
          en: 'g/z set.'
        },
        groupIds: ['ga', 'za']
      },
      {
        id: 'k-l3-da-ba',
        title: { tr: 'Da + Ba', en: 'Da + Ba' },
        description: {
          tr: 'd/b seti.',
          en: 'd/b set.'
        },
        groupIds: ['da', 'ba']
      },
      {
        id: 'k-l3-pa-checkpoint',
        title: { tr: 'Pa + Voiced Checkpoint', en: 'Pa + Voiced Checkpoint' },
        description: {
          tr: 'p ile final tekrar.',
          en: 'Final reinforcement with p.'
        },
        groupIds: ['pa', 'ga', 'za', 'da', 'ba'],
        isCheckpoint: true,
        prerequisiteLessonIds: ['k-l3-ga-za', 'k-l3-da-ba'],
        minMasteryRequired: 80
      }
    ]
  },
  {
    id: 'k-level-4',
    title: {
      tr: 'Level 4 - Yoon Girisi',
      en: 'Level 4 - Yoon Intro'
    },
    description: {
      tr: 'birlesik ses yapilari.',
      en: 'Combined sound patterns.'
    },
    lessons: [
      {
        id: 'k-l4-kya-sha-cha',
        title: { tr: 'Kya + Sha + Cha', en: 'Kya + Sha + Cha' },
        description: {
          tr: 'ilk yoon seti.',
          en: 'First yoon set.'
        },
        groupIds: ['kya', 'sha', 'cha']
      },
      {
        id: 'k-l4-nya-hya-mya',
        title: { tr: 'Nya + Hya + Mya', en: 'Nya + Hya + Mya' },
        description: {
          tr: 'ikinci yoon seti.',
          en: 'Second yoon set.'
        },
        groupIds: ['nya', 'hya', 'mya']
      }
    ]
  },
  {
    id: 'k-level-5',
    title: {
      tr: 'Level 5 - Yoon Akiciligi',
      en: 'Level 5 - Yoon Fluency'
    },
    description: {
      tr: 'ileri yoon kombinasyonlari.',
      en: 'Advanced yoon combinations.'
    },
    lessons: [
      {
        id: 'k-l5-rya-gya-ja',
        title: { tr: 'Rya + Gya + Ja', en: 'Rya + Gya + Ja' },
        description: {
          tr: 'ileri hiz testi.',
          en: 'Advanced speed check.'
        },
        groupIds: ['rya', 'gya', 'ja']
      },
      {
        id: 'k-l5-bya-pya-review',
        title: { tr: 'Bya + Pya Final', en: 'Bya + Pya Final' },
        description: {
          tr: 'tum yoon setlerinin final pekistirmesi.',
          en: 'Final reinforcement for all yoon sets.'
        },
        groupIds: ['bya', 'pya', 'kya', 'sha', 'cha', 'nya', 'hya', 'mya', 'rya', 'gya', 'ja']
      }
    ]
  },
  {
    id: 'k-level-6',
    title: {
      tr: 'Level 6 - Loanword Ekleri',
      en: 'Level 6 - Loanword Extensions'
    },
    description: {
      tr: 'katakana extended karakterleri ile yabanci sesler.',
      en: 'Foreign sounds with katakana extended characters.'
    },
    lessons: [
      {
        id: 'k-l6-extended-a',
        title: { tr: 'Fa + Va Seti', en: 'Fa + Va Set' },
        description: {
          tr: 'f ve v tabanli modern karakterler.',
          en: 'Modern f and v based characters.'
        },
        groupIds: ['fa', 'va']
      },
      {
        id: 'k-l6-extended-b',
        title: { tr: 'Tsa + Ti + Di + Je', en: 'Tsa + Ti + Di + Je' },
        description: {
          tr: 'kalan extended setleri.',
          en: 'Remaining extended sets.'
        },
        groupIds: ['tsa', 'ti', 'di', 'je']
      },
      {
        id: 'k-l6-loanword-checkpoint',
        title: { tr: 'Loanword Checkpoint', en: 'Loanword Checkpoint' },
        description: {
          tr: 'extended ve yoon karmasi final turu.',
          en: 'Final mixed round with extended and yoon.'
        },
        groupIds: ['fa', 'va', 'tsa', 'ti', 'di', 'je', 'rya', 'gya', 'ja'],
        isCheckpoint: true,
        prerequisiteLessonIds: ['k-l6-extended-a', 'k-l6-extended-b'],
        minMasteryRequired: 80
      }
    ]
  }
];

const isGroupAvailable = (sections: KanaSection[], groupId: string) =>
  sections.some((section) => section.groups.some((group) => group.id === groupId));

const normalizeLessons = (
  templates: LessonTemplate[],
  sections: KanaSection[],
  language: AppLanguage
): StudyLessonDefinition[] =>
  templates
    .map((lesson) => ({
      ...lesson,
      groupIds: lesson.groupIds.filter((groupId) => isGroupAvailable(sections, groupId))
    }))
    .filter((lesson) => lesson.groupIds.length > 0)
    .map((lesson) => ({
      id: lesson.id,
      title: lesson.title[language],
      description: lesson.description[language],
      groupIds: lesson.groupIds,
      stepOrder: lesson.stepOrder ?? defaultStepOrder,
      minPassScore: lesson.minPassScore ?? defaultMinPassScore,
      minMasteryRequired: lesson.minMasteryRequired ?? defaultMinMasteryRequired,
      isCheckpoint: lesson.isCheckpoint ?? false,
      prerequisiteLessonIds: lesson.prerequisiteLessonIds ?? []
    }));

const getTrackCopy = (
  script: KanaScript,
  language: AppLanguage
): Pick<StudyTrackDefinition, 'title' | 'subtitle' | 'phaseLabel'> => {
  if (script === 'hiragana') {
    return {
      title: 'Hiragana Track',
      subtitle:
        language === 'tr'
          ? 'Temel okuma hizi ve otomatik taniyicilik icin asamali yol.'
          : 'Stage-based path for fast reading and automatic recall.',
      phaseLabel: language === 'tr' ? 'Faz 1 aktif' : 'Phase 1 active'
    };
  }

  return {
    title: 'Katakana Track',
    subtitle:
      language === 'tr'
        ? 'Loanword odakli akicilik ve modern karakter kapsami.'
        : 'Loanword-focused fluency with modern character coverage.',
    phaseLabel: language === 'tr' ? 'Faz 1 aktif' : 'Phase 1 active'
  };
};

export const buildKanaRoadmapTrack = (
  script: KanaScript,
  sections: KanaSection[],
  language: AppLanguage
): StudyTrackDefinition => {
  const templates = script === 'hiragana' ? hiraganaLevelTemplates : katakanaLevelTemplates;
  const copy = getTrackCopy(script, language);

  return {
    id: script,
    title: copy.title,
    subtitle: copy.subtitle,
    script,
    phaseLabel: copy.phaseLabel,
    levels: templates
      .map((level) => ({
        id: level.id,
        title: level.title[language],
        description: level.description[language],
        lessons: normalizeLessons(level.lessons, sections, language)
      }))
      .filter((level) => level.lessons.length > 0)
  };
};

export const buildKanjiPreviewTrack = (language: AppLanguage): StudyTrackDefinition => ({
  id: 'kanji',
  title: 'Kanji Track',
  subtitle:
    language === 'tr'
      ? 'Parca parca karakter + kelime + anlam stratejisi (Faz 2).'
      : 'Character + word + meaning strategy in stages (Phase 2).',
  script: null,
  phaseLabel: language === 'tr' ? 'Faz 2 planlandi' : 'Planned for Phase 2',
  levels: [
    {
      id: 'kanji-preview-level',
      title: language === 'tr' ? 'Onizleme' : 'Preview',
      description:
        language === 'tr'
          ? 'Kanji yol haritasi, kana track tamamlanma oranina gore acilacak.'
          : 'The kanji roadmap unlocks based on kana track completion.',
      lessons: []
    }
  ]
});

export const getTrackLessonOrder = (track: StudyTrackDefinition) =>
  track.levels.flatMap((level) => level.lessons.map((lesson) => lesson.id));

export const findTrackLessonById = (track: StudyTrackDefinition, lessonId: string) =>
  track.levels.flatMap((level) => level.lessons).find((lesson) => lesson.id === lessonId) ?? null;
