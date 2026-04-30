import React from 'react';
import {
  Bell,
  Brush,
  Check,
  Globe2,
  GraduationCap,
  Headphones,
  Languages,
  Moon,
  Palette,
  Sparkles,
  Sun,
  Volume2,
  Wand2
} from 'lucide-react';
import { AppLanguage, ThemeMode } from '../data/appPreferences';
import { kanaFontStyles, KanaFontStyleId } from '../data/kanaFontStyles';
import { usePersistentState } from '../hooks/usePersistentState';
import { GamePageShell, PageHero } from '../components/layout';

interface SettingsProps {
  language: AppLanguage;
  themeMode: ThemeMode;
  kanaFontStyle: KanaFontStyleId;
  onKanaFontStyleChange: (fontStyle: KanaFontStyleId) => void;
  onThemeModeChange: (themeMode: ThemeMode) => void;
  onLanguageChange: (language: AppLanguage) => void;
}

const SOUND_KEY = 'kototsuna.pref.sound-effects';
const ANIMATION_KEY = 'kototsuna.pref.animations';
const MOTIVATION_KEY = 'kototsuna.pref.motivation';
const LISTENING_KEY = 'kototsuna.pref.listening-drills';

interface Copy {
  eyebrow: string;
  title: string;
  description: string;
  appearance: string;
  appearanceHint: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  kanaFont: string;
  kanaFontHint: string;
  lesson: string;
  lessonHint: string;
  soundLabel: string;
  soundDesc: string;
  animationsLabel: string;
  animationsDesc: string;
  motivationLabel: string;
  motivationDesc: string;
  listeningLabel: string;
  listeningDesc: string;
  language: string;
  languageHint: string;
  livePreview: string;
  current: string;
  on: string;
  off: string;
}

const copyEn: Copy = {
  eyebrow: 'Dojo preferences',
  title: 'Settings',
  description: 'Tune how Kototsuna looks, sounds, and feels. Changes apply instantly across the app.',
  appearance: 'Appearance',
  appearanceHint: 'Theme and the typeface used for kana characters.',
  theme: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  kanaFont: 'Kana font',
  kanaFontHint: 'Pick a typeface for hiragana and katakana display.',
  lesson: 'Lesson experience',
  lessonHint: 'Sound, motion, encouragement, and listening drills.',
  soundLabel: 'Sound effects',
  soundDesc: 'Answer and reward sounds during practice.',
  animationsLabel: 'Animations',
  animationsDesc: 'Motion for transitions and feedback.',
  motivationLabel: 'Motivation messages',
  motivationDesc: 'Short encouraging notes during study.',
  listeningLabel: 'Listening drills',
  listeningDesc: 'Audio-focused question flows.',
  language: 'Language',
  languageHint: 'Interface language for menus and instructions.',
  livePreview: 'Live preview',
  current: 'Current',
  on: 'On',
  off: 'Off'
};

const copyTr: Copy = {
  eyebrow: 'Dojo tercihleri',
  title: 'Ayarlar',
  description: 'Kototsuna’nin gorunusunu, sesini ve hissini ayarla. Degisiklikler aninda uygulanir.',
  appearance: 'Gorunum',
  appearanceHint: 'Tema ve kana karakterlerinin yazi tipi.',
  theme: 'Tema',
  themeLight: 'Acik',
  themeDark: 'Koyu',
  kanaFont: 'Kana fontu',
  kanaFontHint: 'Hiragana ve katakana icin bir yazi tipi sec.',
  lesson: 'Ders deneyimi',
  lessonHint: 'Ses, hareket, motivasyon ve dinleme egzersizleri.',
  soundLabel: 'Ses efektleri',
  soundDesc: 'Calisma sirasindaki cevap ve odul sesleri.',
  animationsLabel: 'Animasyonlar',
  animationsDesc: 'Gecis ve geri bildirim hareketleri.',
  motivationLabel: 'Motivasyon mesajlari',
  motivationDesc: 'Calisma sirasinda kisa destek metinleri.',
  listeningLabel: 'Dinleme egzersizleri',
  listeningDesc: 'Ses odakli soru akislari.',
  language: 'Dil',
  languageHint: 'Menuler ve talimatlar icin arayuz dili.',
  livePreview: 'Canli onizleme',
  current: 'Aktif',
  on: 'Acik',
  off: 'Kapali'
};

export const Settings: React.FC<SettingsProps> = ({
  language,
  themeMode,
  kanaFontStyle,
  onKanaFontStyleChange,
  onThemeModeChange,
  onLanguageChange
}) => {
  const c = language === 'tr' ? copyTr : copyEn;
  const [soundEffects, setSoundEffects] = usePersistentState<boolean>(SOUND_KEY, true);
  const [animations, setAnimations] = usePersistentState<boolean>(ANIMATION_KEY, true);
  const [motivationMessages, setMotivationMessages] = usePersistentState<boolean>(MOTIVATION_KEY, true);
  const [listeningDrills, setListeningDrills] = usePersistentState<boolean>(LISTENING_KEY, true);
  const selectedFont = kanaFontStyles.find((option) => option.id === kanaFontStyle) ?? kanaFontStyles[0];

  return (
    <GamePageShell className="space-y-7 px-3 sm:px-5">
      <PageHero
        className="bg-[linear-gradient(135deg,var(--kt-surface-raised),var(--kt-brand-soft))]"
        backgroundGlyph="設定"
        eyebrow={
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--kt-surface-muted)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
            <Palette size={13} />
            {c.eyebrow}
          </div>
        }
        title={c.title}
        description={c.description}
      />

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        {/* ============== LEFT: settings sections ============== */}
        <div className="space-y-5">
          {/* APPEARANCE */}
          <SettingsCard
            icon={<Brush size={18} />}
            title={c.appearance}
            description={c.appearanceHint}
          >
            <Field label={c.theme}>
              <Segmented
                value={themeMode}
                onChange={onThemeModeChange}
                options={[
                  { id: 'light' as ThemeMode, label: c.themeLight, icon: Sun },
                  { id: 'dark' as ThemeMode, label: c.themeDark, icon: Moon }
                ]}
              />
            </Field>

            <Field label={c.kanaFont} hint={c.kanaFontHint}>
              <div className="grid gap-2 sm:grid-cols-2">
                {kanaFontStyles.map((option) => {
                  const isSelected = option.id === kanaFontStyle;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onKanaFontStyleChange(option.id)}
                      className={`group relative flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                        isSelected
                          ? 'border-[color:var(--kt-brand)]/55 bg-[var(--kt-brand-soft)] shadow-[0_4px_14px_rgba(196,93,79,0.12)]'
                          : 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] hover:bg-[var(--kt-surface-muted)]'
                      }`}
                    >
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--kt-surface-muted)_60%,transparent)] text-2xl font-black text-[var(--kt-ink-strong)]"
                        style={{ fontFamily: option.fontFamily }}
                      >
                        あ
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-black ${isSelected ? 'text-[var(--kt-brand)]' : 'text-[var(--kt-ink-strong)]'}`}
                          >
                            {option.name}
                          </span>
                          {isSelected ? (
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--kt-brand)] text-[var(--kt-brand-on)]">
                              <Check size={10} />
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[12px] leading-5 text-[var(--kt-ink-muted)]">
                          {option.description[language]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Field>
          </SettingsCard>

          {/* LESSON EXPERIENCE */}
          <SettingsCard
            icon={<GraduationCap size={18} />}
            title={c.lesson}
            description={c.lessonHint}
          >
            <ul className="divide-y divide-[var(--kt-border-subtle)]">
              <ToggleRow
                icon={<Volume2 size={16} />}
                label={c.soundLabel}
                description={c.soundDesc}
                checked={soundEffects}
                onChange={setSoundEffects}
              />
              <ToggleRow
                icon={<Wand2 size={16} />}
                label={c.animationsLabel}
                description={c.animationsDesc}
                checked={animations}
                onChange={setAnimations}
              />
              <ToggleRow
                icon={<Bell size={16} />}
                label={c.motivationLabel}
                description={c.motivationDesc}
                checked={motivationMessages}
                onChange={setMotivationMessages}
              />
              <ToggleRow
                icon={<Headphones size={16} />}
                label={c.listeningLabel}
                description={c.listeningDesc}
                checked={listeningDrills}
                onChange={setListeningDrills}
              />
            </ul>
          </SettingsCard>

          {/* LANGUAGE */}
          <SettingsCard
            icon={<Languages size={18} />}
            title={c.language}
            description={c.languageHint}
          >
            <Segmented
              value={language}
              onChange={onLanguageChange}
              options={[
                { id: 'tr' as AppLanguage, label: 'Türkçe', icon: Globe2 },
                { id: 'en' as AppLanguage, label: 'English', icon: Globe2 }
              ]}
            />
          </SettingsCard>
        </div>

        {/* ============== RIGHT: live preview (sticky) ============== */}
        <aside className="lg:sticky lg:top-4">
          <div
            className="overflow-hidden rounded-[1.25rem] border border-[var(--kt-border-subtle)] p-5"
            style={{
              background:
                'linear-gradient(160deg, color-mix(in srgb, var(--kt-surface) 80%, transparent), color-mix(in srgb, var(--kt-brand-soft) 50%, transparent))'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--kt-ink-subtle)]">
                {c.livePreview}
              </div>
              <span className="rounded-full bg-[var(--kt-accent-info-soft)] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
                {c.current}
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_75%,transparent)] p-5 text-center">
              <div
                className="font-jp text-[3.6rem] font-black leading-none text-[var(--kt-ink-strong)]"
                style={{ fontFamily: selectedFont.fontFamily }}
              >
                {selectedFont.preview}
              </div>
              <div className="mt-3 text-base font-black text-[var(--kt-ink-strong)]">{selectedFont.name}</div>
              <p className="mt-1 text-[12px] leading-5 text-[var(--kt-ink-muted)]">
                {selectedFont.description[language]}
              </p>
            </div>

            <dl className="mt-4 divide-y divide-[var(--kt-border-subtle)] text-sm">
              <PreviewRow icon={<Palette size={14} />} label={c.theme} value={themeMode === 'dark' ? c.themeDark : c.themeLight} />
              <PreviewRow icon={<Languages size={14} />} label={c.language} value={language === 'tr' ? 'Türkçe' : 'English'} />
              <PreviewRow icon={<Volume2 size={14} />} label={c.soundLabel} value={soundEffects ? c.on : c.off} tone={soundEffects ? 'on' : 'off'} />
              <PreviewRow icon={<Wand2 size={14} />} label={c.animationsLabel} value={animations ? c.on : c.off} tone={animations ? 'on' : 'off'} />
              <PreviewRow icon={<Bell size={14} />} label={c.motivationLabel} value={motivationMessages ? c.on : c.off} tone={motivationMessages ? 'on' : 'off'} />
              <PreviewRow icon={<Headphones size={14} />} label={c.listeningLabel} value={listeningDrills ? c.on : c.off} tone={listeningDrills ? 'on' : 'off'} />
            </dl>
          </div>
        </aside>
      </div>
    </GamePageShell>
  );
};

/* ============== local components ============== */

const SettingsCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ icon, title, description, children }) => (
  <section className="rounded-[1.25rem] border border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_88%,transparent)] p-5 md:p-6">
    <header className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--kt-brand-soft)] text-[var(--kt-brand)]">
        {icon}
      </span>
      <div className="min-w-0">
        <h2 className="text-lg font-black tracking-[-0.01em] text-[var(--kt-ink-strong)] md:text-xl">{title}</h2>
        {description ? <p className="mt-0.5 text-sm leading-5 text-[var(--kt-ink-muted)]">{description}</p> : null}
      </div>
    </header>
    <div className="mt-5 space-y-5">{children}</div>
  </section>
);

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div>
    <div className="flex items-center justify-between">
      <label className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
        {label}
      </label>
    </div>
    {hint ? <p className="mb-2 mt-0.5 text-[12px] text-[var(--kt-ink-muted)]">{hint}</p> : <div className="mb-2" />}
    {children}
  </div>
);

interface SegmentedOption<T extends string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ElementType;
}

function Segmented<T extends string>({
  value,
  onChange,
  options
}: {
  value: T;
  onChange: (next: T) => void;
  options: SegmentedOption<T>[];
}) {
  return (
    <div
      role="tablist"
      className="inline-flex w-full max-w-md items-center rounded-full border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] p-1"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-black transition ${
              active
                ? 'bg-[var(--kt-surface)] text-[var(--kt-brand)] shadow-[0_2px_10px_rgba(0,0,0,0.06)]'
                : 'text-[var(--kt-ink-muted)] hover:text-[var(--kt-ink-strong)]'
            }`}
          >
            {Icon ? <Icon size={15} /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

const ToggleRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}> = ({ icon, label, description, checked, onChange }) => (
  <li className="flex items-center justify-between gap-4 py-3.5 first:pt-1 last:pb-1">
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--kt-surface-muted)] text-[var(--kt-ink-muted)]">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[15px] font-black text-[var(--kt-ink-strong)]">{label}</div>
        <div className="mt-0.5 text-[12px] leading-5 text-[var(--kt-ink-muted)]">{description}</div>
      </div>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        checked ? 'bg-[var(--kt-brand)]' : 'bg-[var(--kt-surface-sunken)]'
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  </li>
);

const PreviewRow: React.FC<{ icon: React.ReactNode; label: string; value: string; tone?: 'on' | 'off' }> = ({
  icon,
  label,
  value,
  tone
}) => {
  const valueClass =
    tone === 'on'
      ? 'text-[var(--kt-accent-success)]'
      : tone === 'off'
        ? 'text-[var(--kt-ink-subtle)]'
        : 'text-[var(--kt-ink-strong)]';
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">
        <span className="text-[var(--kt-ink-subtle)]">{icon}</span>
        {label}
      </dt>
      <dd className={`text-sm font-black tabular-nums ${valueClass}`}>{value}</dd>
    </div>
  );
};
