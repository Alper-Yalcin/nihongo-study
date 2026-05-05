import React from 'react';
import {
  Bell,
  Check,
  Headphones,
  Moon,
  Music2,
  Palette,
  Sparkles,
  Sun,
  Volume2,
  Wand2
} from 'lucide-react';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { kanaFontStyles, KanaFontStyle, KanaFontStyleId } from '../../data/kanaFontStyles';
import { usePersistentState } from '../../hooks/usePersistentState';

interface SettingsProps {
  language: AppLanguage;
  themeMode: ThemeMode;
  kanaFontStyle: KanaFontStyleId;
  onKanaFontStyleChange: (fontStyle: KanaFontStyleId) => void;
  onThemeModeChange: (themeMode: ThemeMode) => void;
  onLanguageChange: (language: AppLanguage) => void;
}

const SOUND_KEY = 'kototsuna.pref.sound-effects';
const MOTIVATION_SOUND_KEY = 'kototsuna.pref.motivation-sounds';
const ANIMATION_KEY = 'kototsuna.pref.animations';
const TRANSITION_KEY = 'kototsuna.pref.transition-effects';
const MOTIVATION_KEY = 'kototsuna.pref.motivation';
const LISTENING_KEY = 'kototsuna.pref.listening-drills';

const kanaPreview = 'あ き さ';

const copy = {
  tr: {
    eyebrow: 'DOJO AYARLARI',
    title: 'Öğrenme ortamını ayarla',
    description: 'Görünümü, sesi ve çalışma ritmini kendine göre düzenle.',
    themeTitle: 'Görsel atmosfer',
    light: 'Açık',
    dark: 'Koyu',
    lightDesc: 'Sıcak krem, sakin metin ve gündüz çalışma hissi.',
    darkDesc: 'Koyu sahne, yumuşak ışık ve gece odağı.',
    fontTitle: 'Kana yazı stili',
    fontHint: 'Kana karakterlerini hangi ritimle görmek istediğini seç.',
    experienceTitle: 'Ders deneyimi',
    soundGroup: 'Ses',
    motionGroup: 'Hareket',
    supportGroup: 'Destek',
    soundEffects: 'Ses efektleri',
    motivationSounds: 'Motivasyon sesleri',
    animations: 'Animasyonlar',
    transitions: 'Geçiş efektleri',
    motivationMessages: 'Motivasyon mesajları',
    listeningDrills: 'Dinleme egzersizleri',
    languageTitle: 'Arayüz dili',
    previewTitle: 'Canlı ders önizlemesi',
    previewTask: 'Kana çalışması',
    previewQuestion: 'Bu karakterin okunuşu nedir?',
    answer: 'Cevapla',
    on: 'açık',
    off: 'kapalı'
  },
  en: {
    eyebrow: 'DOJO SETTINGS',
    title: 'Shape your learning environment',
    description: 'Adjust the look, sound, and rhythm of your study space.',
    themeTitle: 'Visual atmosphere',
    light: 'Light',
    dark: 'Dark',
    lightDesc: 'Warm cream, calm text, and a daytime study feel.',
    darkDesc: 'Deep scene, soft light, and night focus.',
    fontTitle: 'Kana writing style',
    fontHint: 'Choose the visual rhythm you want for kana characters.',
    experienceTitle: 'Lesson experience',
    soundGroup: 'Sound',
    motionGroup: 'Motion',
    supportGroup: 'Support',
    soundEffects: 'Sound effects',
    motivationSounds: 'Motivation sounds',
    animations: 'Animations',
    transitions: 'Transition effects',
    motivationMessages: 'Motivation messages',
    listeningDrills: 'Listening drills',
    languageTitle: 'Interface language',
    previewTitle: 'Live lesson preview',
    previewTask: 'Kana practice',
    previewQuestion: 'What is the reading of this character?',
    answer: 'Answer',
    on: 'on',
    off: 'off'
  }
} as const;

type SettingCopy = (typeof copy)['tr'] | (typeof copy)['en'];

export const Settings: React.FC<SettingsProps> = ({
  language,
  themeMode,
  kanaFontStyle,
  onKanaFontStyleChange,
  onThemeModeChange,
  onLanguageChange
}) => {
  const c = copy[language];
  const isDark = themeMode === 'dark';
  const [soundEffects, setSoundEffects] = usePersistentState<boolean>(SOUND_KEY, true);
  const [motivationSounds, setMotivationSounds] = usePersistentState<boolean>(MOTIVATION_SOUND_KEY, true);
  const [animations, setAnimations] = usePersistentState<boolean>(ANIMATION_KEY, true);
  const [transitionEffects, setTransitionEffects] = usePersistentState<boolean>(TRANSITION_KEY, true);
  const [motivationMessages, setMotivationMessages] = usePersistentState<boolean>(MOTIVATION_KEY, true);
  const [listeningDrills, setListeningDrills] = usePersistentState<boolean>(LISTENING_KEY, true);
  const selectedFont = kanaFontStyles.find((option) => option.id === kanaFontStyle) ?? kanaFontStyles[0];

  return (
    <main className="relative min-h-[calc(100vh-92px)] overflow-x-hidden px-5 pb-24 pt-12 text-[var(--kt-ink-strong)] sm:px-8 lg:px-12">
      <SettingsBackdrop isDark={isDark} />

      <div className="relative mx-auto w-full max-w-[1520px]">
        <SettingsHeader copy={c} />

        <div className="mt-14 flex flex-col gap-14 xl:flex-row xl:items-start xl:gap-20">
          <div className="min-w-0 flex-1 space-y-16">
            <ThemeAtmosphereSelector copy={c} value={themeMode} onChange={onThemeModeChange} />

            <KanaFontSelector
              copy={c}
              language={language}
              value={kanaFontStyle}
              onChange={onKanaFontStyleChange}
            />

            <ExperienceToggles
              copy={c}
              groups={[
                {
                  title: c.soundGroup,
                  items: [
                    { icon: Volume2, label: c.soundEffects, checked: soundEffects, onChange: setSoundEffects },
                    { icon: Music2, label: c.motivationSounds, checked: motivationSounds, onChange: setMotivationSounds },
                    { icon: Headphones, label: c.listeningDrills, checked: listeningDrills, onChange: setListeningDrills }
                  ]
                },
                {
                  title: c.motionGroup,
                  items: [
                    { icon: Wand2, label: c.animations, checked: animations, onChange: setAnimations },
                    { icon: Sparkles, label: c.transitions, checked: transitionEffects, onChange: setTransitionEffects }
                  ]
                },
                {
                  title: c.supportGroup,
                  items: [
                    { icon: Bell, label: c.motivationMessages, checked: motivationMessages, onChange: setMotivationMessages }
                  ]
                }
              ]}
            />

            <LanguageSelector copy={c} value={language} onChange={onLanguageChange} />
          </div>

          <LiveLessonPreview
            copy={c}
            language={language}
            themeMode={themeMode}
            selectedFont={selectedFont}
            soundEffects={soundEffects}
            animations={animations}
            motivationMessages={motivationMessages}
            listeningDrills={listeningDrills}
          />
        </div>
      </div>
    </main>
  );
};

const SettingsBackdrop: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div className={`absolute inset-0 ${isDark ? 'bg-slate-950/55' : 'bg-rose-50/25'}`} />
    <div className="absolute inset-0 bg-white/20 [.theme-dark_&]:bg-transparent" />
    <div className="absolute left-[12%] top-[-8rem] h-[30rem] w-[30rem] rounded-full bg-[#f04d72]/14 blur-3xl" />
    <div className="absolute right-[4%] top-[9rem] h-[28rem] w-[28rem] rounded-full bg-[#f09a20]/12 blur-3xl" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--kt-ink-strong)_10%,transparent)_1px,transparent_0)] bg-[length:28px_28px] opacity-[0.10]" />
    <div className="absolute right-[-5rem] top-4 font-jp text-[18rem] font-black leading-none text-[var(--kt-brand)] opacity-[0.045] blur-[1px]">
      設定
    </div>
  </div>
);

const SettingsHeader: React.FC<{ copy: SettingCopy }> = ({ copy }) => (
  <header className="relative max-w-4xl pt-6">
    <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--kt-brand)]">
      <Palette size={15} />
      {copy.eyebrow}
    </div>
    <h1 className="mt-5 text-5xl font-black leading-[0.96] tracking-tight text-[var(--kt-ink-strong)] sm:text-7xl">
      {copy.title}
    </h1>
    <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--kt-ink-muted)] sm:text-xl">
      {copy.description}
    </p>
  </header>
);

const SectionTitle: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => (
  <div className="mb-6">
    <h2 className="text-3xl font-black tracking-tight text-[var(--kt-ink-strong)]">{title}</h2>
    {hint ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--kt-ink-muted)]">{hint}</p> : null}
  </div>
);

const ThemeAtmosphereSelector: React.FC<{
  copy: SettingCopy;
  value: ThemeMode;
  onChange: (value: ThemeMode) => void;
}> = ({ copy, value, onChange }) => (
  <section>
    <SectionTitle title={copy.themeTitle} />
    <div className="flex flex-col gap-5 lg:flex-row">
      {[
        { id: 'light' as ThemeMode, label: copy.light, description: copy.lightDesc, icon: Sun },
        { id: 'dark' as ThemeMode, label: copy.dark, description: copy.darkDesc, icon: Moon }
      ].map((option) => {
        const selected = value === option.id;
        const previewDark = option.id === 'dark';
        const Icon = option.icon;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`group relative min-h-56 flex-1 overflow-hidden rounded-[2rem] px-5 py-5 text-left transition duration-300 hover:-translate-y-1 ${
              selected
                ? 'shadow-[0_26px_80px_rgba(240,77,114,0.20)]'
                : 'opacity-78 hover:opacity-100'
            }`}
          >
            <span
              className={`absolute inset-x-6 top-0 h-1 rounded-full transition ${
                selected ? 'bg-[linear-gradient(90deg,#f04d72,#f09a20)] opacity-100' : 'bg-[var(--kt-border-subtle)] opacity-40'
              }`}
            />
            <span
              className={`absolute inset-0 -z-10 rounded-[2rem] backdrop-blur-xl ${
                previewDark
                  ? 'bg-[linear-gradient(145deg,rgba(20,15,25,0.92),rgba(42,31,47,0.76))]'
                  : 'bg-[linear-gradient(145deg,rgba(255,251,247,0.82),rgba(255,244,238,0.54))]'
              }`}
            />

            <div className={previewDark ? 'text-white' : 'text-[#233244]'}>
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f04d72]/14 text-[#f04d72]">
                  <Icon size={20} />
                </span>
                {selected ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f04d72] text-white">
                    <Check size={15} />
                  </span>
                ) : null}
              </div>

              <div className="mt-9 max-w-sm">
                <div className="h-3 w-36 rounded-full bg-current opacity-18" />
                <div className="mt-3 h-2 w-56 max-w-full rounded-full bg-current opacity-10" />
                <div className="mt-8 flex items-center gap-3">
                  <span className="h-11 w-28 rounded-full bg-[#f04d72] shadow-[0_14px_34px_rgba(240,77,114,0.22)]" />
                  <span className="h-2 w-24 rounded-full bg-current opacity-14" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-black text-[var(--kt-ink-strong)]">{option.label}</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--kt-ink-muted)]">{option.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  </section>
);

const KanaFontSelector: React.FC<{
  copy: SettingCopy;
  language: AppLanguage;
  value: KanaFontStyleId;
  onChange: (value: KanaFontStyleId) => void;
}> = ({ copy, language, value, onChange }) => (
  <section>
    <SectionTitle title={copy.fontTitle} hint={copy.fontHint} />
    <div className="-mx-5 flex gap-5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {kanaFontStyles.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`group min-w-[17rem] rounded-[1.8rem] px-5 py-5 text-left transition duration-300 hover:-translate-y-1 ${
              selected
                ? 'bg-[rgba(240,77,114,0.10)] shadow-[0_22px_60px_rgba(240,77,114,0.16)]'
                : 'bg-[rgba(255,255,255,0.28)] opacity-70 backdrop-blur-md hover:opacity-100 [.theme-dark_&]:bg-white/5'
            }`}
          >
            <div
              className={`text-5xl font-black leading-none transition duration-300 ${
                selected ? 'text-[var(--kt-brand)]' : 'text-[var(--kt-ink-strong)]'
              }`}
              style={{ fontFamily: option.fontFamily }}
            >
              {kanaPreview}
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-[var(--kt-ink-strong)]">{option.name}</h3>
                <p className="mt-1 line-clamp-1 text-sm text-[var(--kt-ink-muted)]">{option.description[language]}</p>
              </div>
              {selected ? <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--kt-brand)] shadow-[0_0_16px_rgba(240,77,114,0.55)]" /> : null}
            </div>
          </button>
        );
      })}
    </div>
  </section>
);

interface ExperienceGroup {
  title: string;
  items: {
    icon: React.ElementType;
    label: string;
    checked: boolean;
    onChange: (next: boolean) => void;
  }[];
}

const ExperienceToggles: React.FC<{ copy: SettingCopy; groups: ExperienceGroup[] }> = ({ copy, groups }) => (
  <section>
    <SectionTitle title={copy.experienceTitle} />
    <div className="flex flex-col gap-10 lg:flex-row">
      {groups.map((group) => (
        <div key={group.title} className="flex-1">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--kt-brand)]">{group.title}</h3>
          <div className="mt-5 space-y-5">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between gap-5 border-t border-[var(--kt-border-subtle)] pt-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon size={19} className="shrink-0 text-[var(--kt-ink-subtle)]" />
                    <span className="text-base font-bold text-[var(--kt-ink-strong)]">{item.label}</span>
                  </div>
                  <SoftToggle checked={item.checked} onChange={item.onChange} label={item.label} onLabel={copy.on} offLabel={copy.off} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const SoftToggle: React.FC<{
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  onLabel: string;
  offLabel: string;
}> = ({ checked, onChange, label, onLabel, offLabel }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className="group inline-flex min-w-[6.25rem] items-center justify-end gap-3 text-sm font-black text-[var(--kt-ink-muted)]"
  >
    <span className={checked ? 'text-[var(--kt-brand)]' : 'text-[var(--kt-ink-subtle)]'}>{checked ? onLabel : offLabel}</span>
    <span
      className={`relative h-7 w-12 rounded-full p-1 transition duration-200 ${
        checked ? 'bg-[#f04d72] shadow-[0_0_20px_rgba(240,77,114,0.22)]' : 'bg-[var(--kt-progress-track)]'
      }`}
    >
      <span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </span>
  </button>
);

const LanguageSelector: React.FC<{
  copy: SettingCopy;
  value: AppLanguage;
  onChange: (value: AppLanguage) => void;
}> = ({ copy, value, onChange }) => (
  <section>
    <SectionTitle title={copy.languageTitle} />
    <div className="flex flex-wrap gap-3">
      {[
        { id: 'tr' as AppLanguage, label: 'TR' },
        { id: 'en' as AppLanguage, label: 'EN' }
      ].map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`min-h-12 rounded-full px-7 text-sm font-black transition duration-200 ${
              selected
                ? 'bg-[#f04d72] text-white shadow-[0_16px_36px_rgba(240,77,114,0.22)]'
                : 'bg-[rgba(255,255,255,0.36)] text-[var(--kt-ink-muted)] backdrop-blur-md hover:text-[var(--kt-ink-strong)] [.theme-dark_&]:bg-white/6'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </section>
);

const LiveLessonPreview: React.FC<{
  copy: SettingCopy;
  language: AppLanguage;
  themeMode: ThemeMode;
  selectedFont: KanaFontStyle;
  soundEffects: boolean;
  animations: boolean;
  motivationMessages: boolean;
  listeningDrills: boolean;
}> = ({ copy, language, themeMode, selectedFont, soundEffects, animations, motivationMessages, listeningDrills }) => {
  const previewDark = themeMode === 'dark';
  const activePills = [
    soundEffects ? copy.soundEffects : null,
    listeningDrills ? copy.listeningDrills : null,
    motivationMessages ? '+12 XP' : null,
    language.toUpperCase()
  ].filter(Boolean);

  return (
    <aside className="w-full shrink-0 xl:sticky xl:top-28 xl:w-[26rem]">
      <div className="text-xs font-black uppercase tracking-[0.22em] text-[var(--kt-brand)]">{copy.previewTitle}</div>
      <div
        className={`relative mt-6 overflow-hidden rounded-[2.4rem] px-7 py-8 shadow-[0_28px_100px_rgba(208,96,112,0.16)] backdrop-blur-2xl ${
          previewDark
            ? 'bg-[linear-gradient(145deg,rgba(18,13,24,0.88),rgba(42,31,48,0.72))] text-white'
            : 'bg-[linear-gradient(145deg,rgba(255,252,248,0.72),rgba(255,241,232,0.46))] text-[#1f2b3b]'
        }`}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 font-jp text-[9rem] font-black text-[#f04d72]/10" aria-hidden="true">
          問
        </div>
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-black uppercase tracking-[0.18em] opacity-50">{copy.previewTask}</span>
            {motivationMessages ? <span className="rounded-full bg-[#f04d72]/14 px-3 py-1 text-xs font-black text-[#f04d72]">+12 XP</span> : null}
          </div>

          <div
            className={`mx-auto mt-10 flex h-36 w-36 items-center justify-center rounded-full text-7xl font-black ${
              previewDark ? 'bg-white/8 text-white' : 'bg-white/48 text-[#1f2b3b]'
            } ${animations ? 'transition duration-300 hover:scale-105' : ''}`}
            style={{ fontFamily: selectedFont.fontFamily }}
          >
            あ
          </div>

          <p className="mx-auto mt-7 max-w-xs text-center text-base font-semibold leading-7 opacity-72">{copy.previewQuestion}</p>
          <button
            type="button"
            className="mt-7 flex min-h-12 w-full items-center justify-center rounded-full bg-[#f04d72] text-sm font-black text-white shadow-[0_18px_42px_rgba(240,77,114,0.28)] transition hover:scale-[1.02]"
          >
            {copy.answer}
          </button>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {activePills.map((pill) => (
              <span key={pill} className="rounded-full bg-current/8 px-3 py-1 text-[11px] font-black opacity-70">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
