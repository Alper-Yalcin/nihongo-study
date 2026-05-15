import React, { useEffect } from 'react';
import { ComboIndicator } from './ComboIndicator';
import { HanabiraFly } from './HanabiraFly';
import { MasteryDeltaToast } from './MasteryDeltaToast';
import {
  installAudioUnlock,
  playChime,
  playKoto,
  playMizu,
  playMushin,
  playShoji,
  playSumi
} from './sounds';
import { subscribeFeedbackPulse } from '../../hooks/useFeedback';

const tryVibrate = (pattern: number | number[]): void => {
  if (typeof navigator === 'undefined') return;
  const nav = navigator as unknown as { vibrate?: (p: number | number[]) => boolean };
  try {
    nav.vibrate?.(pattern);
  } catch {
    /* iOS Safari ve bazı tarayıcılar — yok say */
  }
};

export const FeedbackLayer: React.FC = () => {
  useEffect(() => {
    const cleanup = installAudioUnlock();
    return cleanup;
  }, []);

  useEffect(() => {
    const unsub = subscribeFeedbackPulse((detail) => {
      switch (detail.kind) {
        case 'correct':
          playShoji();
          break;
        case 'wrong':
          playSumi();
          tryVibrate(20);
          break;
        case 'shield':
          playChime();
          break;
        case 'milestone':
          playMizu(detail.combo);
          if ((detail.milestoneThreshold ?? 0) >= 10) {
            tryVibrate([30, 40, 30]);
          } else {
            tryVibrate(15);
          }
          break;
        case 'mushin':
          playMushin();
          tryVibrate([40, 60, 40, 60, 80]);
          break;
        default:
          break;
      }
      // Reward seslerini özel claim akışlarında çağıracağız (Sprint 3)
      void playKoto;
    });
    return unsub;
  }, []);

  return (
    <>
      <ComboIndicator />
      <HanabiraFly />
      <MasteryDeltaToast />
    </>
  );
};
