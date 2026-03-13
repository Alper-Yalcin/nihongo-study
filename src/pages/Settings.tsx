import React from 'react';
import { Check } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { SectionCard } from '../components/SectionCard';
import {
  kanaFontStyles,
  KanaFontStyleId
} from '../data/kanaFontStyles';

interface SettingsProps {
  kanaFontStyle: KanaFontStyleId;
  onKanaFontStyleChange: (fontStyle: KanaFontStyleId) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  kanaFontStyle,
  onKanaFontStyleChange
}) => {
  const selectedFont = kanaFontStyles.find(option => option.id === kanaFontStyle) ?? kanaFontStyles[0];

  return (
    <PageContainer title="Settings">
      <div className="space-y-6">
        <SectionCard
          title="Kana Writing Style"
          description="Switch between different Japanese type styles to compare glyph shapes, similar to the design selector on RealKana."
        >
          <div className="space-y-6">
            <div className="settings-preview-shell rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Live Preview</h3>
                  <p className="text-sm text-slate-500">
                    Current style: {selectedFont.name}
                  </p>
                </div>
                <span className="settings-preview-badge rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm border border-slate-200">
                  Applied globally
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
                        <div className="mt-1 text-sm text-slate-500">{option.description}</div>
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
          title="How It Works"
          description="The selected kana font updates every place that uses Japanese text in the app."
        >
          <div className="grid gap-3 md:grid-cols-3">
            <div className="settings-info-card rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-1 text-sm font-semibold text-slate-800">Typing & Drawing</div>
              <p className="text-sm text-slate-500">
                Study tables and prompts use the selected kana style.
              </p>
            </div>
            <div className="settings-info-card rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-1 text-sm font-semibold text-slate-800">Listening</div>
              <p className="text-sm text-slate-500">
                Listening cards and character modal previews follow the same style.
              </p>
            </div>
            <div className="settings-info-card rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-1 text-sm font-semibold text-slate-800">Dictionary</div>
              <p className="text-sm text-slate-500">
                Kana words in dictionary tables switch instantly when you change the style.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
};
