import React from 'react';
import { Check } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { SectionCard } from '../components/SectionCard';
import { AppLanguage } from '../data/appPreferences';
import {
  kanaFontStyles,
  KanaFontStyleId
} from '../data/kanaFontStyles';
import { settingsContent } from '../data/settingsContent';

interface SettingsProps {
  language: AppLanguage;
  kanaFontStyle: KanaFontStyleId;
  onKanaFontStyleChange: (fontStyle: KanaFontStyleId) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  language,
  kanaFontStyle,
  onKanaFontStyleChange
}) => {
  const selectedFont = kanaFontStyles.find(option => option.id === kanaFontStyle) ?? kanaFontStyles[0];
  const copy = settingsContent[language];

  return (
    <PageContainer title={copy.pageTitle}>
      <div className="space-y-6">
        <SectionCard
          title={copy.fontSectionTitle}
          description={copy.fontSectionDescription}
        >
          <div className="space-y-6">
            <div className="settings-preview-shell rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{copy.livePreviewTitle}</h3>
                  <p className="text-sm text-slate-500">
                    {copy.currentStyleLabel}: {selectedFont.name}
                  </p>
                </div>
                <span className="settings-preview-badge rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm border border-slate-200">
                  {copy.appliedGloballyLabel}
                </span>
              </div>

              <div className="settings-preview-card rounded-2xl border border-slate-200 bg-white p-5">
                <div
                  className="mb-3 text-center text-4xl text-slate-800 md:text-5xl"
                  style={{ fontFamily: selectedFont.fontFamily }}
                >
                  ひ さ そ り ふ め
                </div>
                <div
                  className="text-center text-2xl text-slate-700 md:text-3xl"
                  style={{ fontFamily: selectedFont.fontFamily }}
                >
                  ヒ サ ソ リ フ メ
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {kanaFontStyles.map(option => {
                const isSelected = option.id === kanaFontStyle;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onKanaFontStyleChange(option.id)}
                    className={`settings-font-card rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'settings-font-card-selected border-indigo-300 bg-indigo-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{option.name}</div>
                        <div className="mt-1 text-sm text-slate-500">{option.description[language]}</div>
                      </div>
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500 text-white'
                            : 'border-slate-300 bg-white text-transparent'
                        }`}
                      >
                        <Check size={14} />
                      </div>
                    </div>

                    <div className="settings-font-swatch rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div
                        className="text-center text-3xl text-slate-800"
                        style={{ fontFamily: option.fontFamily }}
                      >
                        {option.preview}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title={copy.howItWorksTitle}
          description={copy.howItWorksDescription}
        >
          <div className="grid gap-3 md:grid-cols-3">
            {copy.infoCards.map((item) => (
              <div key={item.title} className="settings-info-card rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-1 text-sm font-semibold text-slate-800">{item.title}</div>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
};
