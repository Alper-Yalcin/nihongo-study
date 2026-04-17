import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '../shared/ui';
import { AppLanguage, ThemeMode } from '../data/appPreferences';
import { kanaFontStyles, KanaFontStyleId } from '../data/kanaFontStyles';
import { usePersistentState } from '../hooks/usePersistentState';

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

export const Settings: React.FC<SettingsProps> = ({
  language,
  themeMode,
  kanaFontStyle,
  onKanaFontStyleChange,
  onThemeModeChange,
  onLanguageChange
}) => {
  const [soundEffects, setSoundEffects] = usePersistentState<boolean>(SOUND_KEY, true);
  const [animations, setAnimations] = usePersistentState<boolean>(ANIMATION_KEY, true);
  const [motivationMessages, setMotivationMessages] = usePersistentState<boolean>(MOTIVATION_KEY, true);
  const [listeningDrills, setListeningDrills] = usePersistentState<boolean>(LISTENING_KEY, true);
  const selectedFont = kanaFontStyles.find((option) => option.id === kanaFontStyle) ?? kanaFontStyles[0];

  return (
    <div className="space-y-8 pb-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">Settings</div>
          <h1 className="mt-3 text-5xl font-black text-[var(--kt-ink-strong)]">
            {language === 'tr' ? 'Tercihler' : 'Preferences'}
          </h1>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <div className="space-y-8">
          <Card padding="lg">
            <h2 className="text-3xl font-black text-[var(--kt-ink-strong)]">
              {language === 'tr' ? 'Ders deneyimi' : 'Lesson experience'}
            </h2>
            <div className="mt-6 space-y-4">
              <SettingToggleRow label={language === 'tr' ? 'Ses efektleri' : 'Sound effects'} checked={soundEffects} onChange={setSoundEffects} />
              <SettingToggleRow label={language === 'tr' ? 'Animasyonlar' : 'Animations'} checked={animations} onChange={setAnimations} />
              <SettingToggleRow label={language === 'tr' ? 'Motivasyon mesajlari' : 'Motivation messages'} checked={motivationMessages} onChange={setMotivationMessages} />
              <SettingToggleRow label={language === 'tr' ? 'Dinleme egzersizleri' : 'Listening drills'} checked={listeningDrills} onChange={setListeningDrills} />
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-3xl font-black text-[var(--kt-ink-strong)]">
              {language === 'tr' ? 'Gorunum' : 'Appearance'}
            </h2>
            <div className="mt-6 space-y-5">
              <SettingSelectRow
                label={language === 'tr' ? 'Karanlik mod' : 'Theme'}
                value={themeMode === 'dark' ? (language === 'tr' ? 'Koyu' : 'Dark') : language === 'tr' ? 'Acik' : 'Light'}
                onClick={() => onThemeModeChange(themeMode === 'dark' ? 'light' : 'dark')}
              />
              <div>
                <div className="text-xl font-black text-[var(--kt-ink-strong)]">
                  {language === 'tr' ? 'Kana fontu' : 'Kana font'}
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {kanaFontStyles.map((option) => {
                    const isSelected = option.id === kanaFontStyle;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => onKanaFontStyleChange(option.id)}
                        className={`rounded-[1.4rem] border p-4 text-left transition ${
                          isSelected
                            ? 'border-[var(--kt-brand)] bg-[var(--kt-brand-soft)]'
                            : 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] hover:bg-[var(--kt-surface-muted)]'
                        }`}
                      >
                        <div className="text-lg font-black text-[var(--kt-ink-strong)]">{option.name}</div>
                        <div className="mt-1 text-sm text-[var(--kt-ink-muted)]">{option.description[language]}</div>
                        <div
                          className="mt-4 rounded-[1rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4 text-center text-4xl text-[var(--kt-ink-strong)]"
                          style={{ fontFamily: option.fontFamily }}
                        >
                          {option.preview}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] p-4">
                  <div className="text-sm font-semibold text-[var(--kt-ink-muted)]">
                    {language === 'tr' ? 'Aktif font' : 'Current font'}
                  </div>
                  <div className="mt-2 text-2xl font-black text-[var(--kt-ink-strong)]">{selectedFont.name}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-3xl font-black text-[var(--kt-ink-strong)]">{language === 'tr' ? 'Dil' : 'Language'}</h2>
            <div className="mt-5 flex gap-3">
              <LanguageButton active={language === 'tr'} label="TR" onClick={() => onLanguageChange('tr')} />
              <LanguageButton active={language === 'en'} label="EN" onClick={() => onLanguageChange('en')} />
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card padding="lg">
            <h3 className="text-3xl font-black text-[var(--kt-ink-strong)]">{language === 'tr' ? 'Hesap' : 'Account'}</h3>
            <div className="mt-5 space-y-3 text-lg font-black text-[var(--kt-ink-strong)]">
              <div>{language === 'tr' ? 'Tercihler' : 'Preferences'}</div>
              <div>{language === 'tr' ? 'Gizlilik ayarlari' : 'Privacy settings'}</div>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="text-3xl font-black text-[var(--kt-ink-strong)]">{language === 'tr' ? 'Destek' : 'Support'}</h3>
            <div className="mt-5 space-y-3 text-lg font-black text-[var(--kt-ink-strong)]">
              <div>{language === 'tr' ? 'Yardim merkezi' : 'Help center'}</div>
              <div>{language === 'tr' ? 'Yeni shell notlari' : 'New shell notes'}</div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

const SettingToggleRow: React.FC<{
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between gap-4 border-b border-[var(--kt-border-subtle)] pb-4">
    <div className="text-xl font-black text-[var(--kt-ink-strong)]">{label}</div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-16 rounded-full border transition ${
        checked ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)]' : 'border-[var(--kt-border)] bg-[var(--kt-surface-sunken)]'
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-[0.7rem] bg-[var(--kt-surface)] transition ${checked ? 'left-9' : 'left-1'}`}
      />
    </button>
  </div>
);

const SettingSelectRow: React.FC<{
  label: string;
  value: string;
  onClick: () => void;
}> = ({ label, value, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center justify-between rounded-[1.3rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-4 text-left"
  >
    <div>
      <div className="text-xl font-black text-[var(--kt-ink-strong)]">{label}</div>
      <div className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">{value}</div>
    </div>
    <ChevronDown size={18} className="text-[var(--kt-ink-subtle)]" />
  </button>
);

const LanguageButton: React.FC<{
  active: boolean;
  label: string;
  onClick: () => void;
}> = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-[1rem] border px-5 py-3 text-sm font-black uppercase tracking-[0.14em] ${
      active
        ? 'border-[var(--kt-brand)] bg-[var(--kt-brand-soft)] text-[var(--kt-brand)]'
        : 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] text-[var(--kt-ink-muted)]'
    }`}
  >
    {label}
  </button>
);
