/**
 * sounds.ts — Web Audio API tabanlı, asset-free ses sentezi.
 *
 * Tasarım:
 * - Tek bir AudioContext lazy initialize edilir; iOS Safari autoplay
 *   policy'si gereği ilk kullanıcı etkileşimine kadar suspended kalır
 *   ve `unlock()` ile resume edilir. App mount'ta global pointerdown/keydown
 *   listener bir kerelik unlock tetikler.
 * - Her ses kısa bir oscillator + envelope bileşimi. MP3/asset yok.
 * - Tüm fonksiyonlar try/catch içinde — ses ortamı yoksa sessizce yutulur.
 *
 * Ses paleti (yaklaşık japon estetiği):
 * - shoji: yumuşak, kısa highpass tıkırtı (doğru cevap)
 * - mizu: tek damla — kısa pitch bend (combo milestone)
 * - koto: pluck — claim/reward
 * - sumi: kalın alçak hum (yanlış, rahatsız etmez)
 * - chime: shield kullanıldı — kibar uyarı
 */

let ctx: AudioContext | null = null;
let unlocked = false;

const ensureCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  return ctx;
};

export const unlockAudio = (): void => {
  if (unlocked) return;
  const c = ensureCtx();
  if (!c) return;
  // Sessiz primer buffer — bazı tarayıcılarda gerek (synchronous, gesture içinde)
  try {
    const buffer = c.createBuffer(1, 1, 22050);
    const src = c.createBufferSource();
    src.buffer = buffer;
    src.connect(c.destination);
    src.start(0);
  } catch {
    /* yok say */
  }
  if (c.state === 'suspended') {
    // resume() Promise — başarısız olursa unlock'u retry için açık bırakırız
    c.resume()
      .then(() => {
        unlocked = c.state === 'running';
      })
      .catch(() => {
        unlocked = false;
      });
    // Optimistik işaretle; durum sonradan resume.then()'de düzeltilir
    unlocked = true;
  } else {
    unlocked = true;
  }
};

interface ToneSpec {
  freq: number;
  type?: OscillatorType;
  duration: number;
  attack?: number;
  release?: number;
  gain?: number;
  pitchBendTo?: number;
}

const playTone = (spec: ToneSpec): void => {
  const c = ensureCtx();
  if (!c || c.state === 'suspended') return;
  try {
    const now = c.currentTime;
    const osc = c.createOscillator();
    osc.type = spec.type ?? 'sine';
    osc.frequency.setValueAtTime(spec.freq, now);
    if (spec.pitchBendTo) {
      osc.frequency.exponentialRampToValueAtTime(spec.pitchBendTo, now + spec.duration);
    }

    const g = c.createGain();
    const peak = spec.gain ?? 0.18;
    const attack = spec.attack ?? 0.005;
    const release = spec.release ?? Math.max(0.05, spec.duration - attack);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + attack + release);

    osc.connect(g).connect(c.destination);
    osc.start(now);
    osc.stop(now + spec.duration + 0.05);
  } catch {
    /* yok say */
  }
};

const playChord = (specs: ToneSpec[]): void => {
  for (const s of specs) playTone(s);
};

// === Public sounds ===

export const playShoji = (): void =>
  playTone({ freq: 1480, type: 'triangle', duration: 0.08, gain: 0.12, attack: 0.002, release: 0.07 });

export const playMizu = (combo: number): void => {
  const base = 660 + Math.min(combo, 12) * 35;
  playTone({
    freq: base,
    pitchBendTo: base * 1.5,
    type: 'sine',
    duration: 0.18,
    gain: 0.18,
    attack: 0.004,
    release: 0.16
  });
};

export const playKoto = (): void => {
  // Pluck — temel + yumuşak harmonic
  playChord([
    { freq: 392, type: 'triangle', duration: 0.45, gain: 0.18, attack: 0.003, release: 0.42 },
    { freq: 587, type: 'sine', duration: 0.35, gain: 0.08, attack: 0.005, release: 0.32 },
    { freq: 784, type: 'sine', duration: 0.25, gain: 0.05, attack: 0.006, release: 0.22 }
  ]);
};

export const playSumi = (): void =>
  playTone({ freq: 196, type: 'sine', duration: 0.2, gain: 0.1, attack: 0.01, release: 0.18 });

export const playChime = (): void =>
  playChord([
    { freq: 880, type: 'sine', duration: 0.12, gain: 0.1, attack: 0.003, release: 0.11 },
    { freq: 1320, type: 'sine', duration: 0.18, gain: 0.07, attack: 0.005, release: 0.16 }
  ]);

export const playMushin = (): void => {
  // 3 notalı kısa motif — günde 1 kez tetiklenir
  const c = ensureCtx();
  if (!c) return;
  const t0 = c.currentTime;
  [523, 659, 784].forEach((freq, i) => {
    setTimeout(() => playTone({ freq, type: 'triangle', duration: 0.32, gain: 0.18 }), i * 110);
  });
  void t0;
};

// Global unlock listener — App mount'ta installAudioUnlock() çağrılır.
// İlk gesture'da deneriz; başarısız olursa context.state === 'running' olana
// kadar her gesture'da yeniden dener (iOS Safari'de bazen 1. gesture yetmiyor).
export const installAudioUnlock = (): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;
  const handler = () => {
    unlockAudio();
    const c = ensureCtx();
    if (c?.state === 'running') {
      cleanup();
    }
  };
  const cleanup = () => {
    window.removeEventListener('pointerdown', handler);
    window.removeEventListener('keydown', handler);
    window.removeEventListener('touchend', handler);
  };
  window.addEventListener('pointerdown', handler, { passive: true });
  window.addEventListener('keydown', handler);
  window.addEventListener('touchend', handler, { passive: true });
  return cleanup;
};

export const isAudioUnlocked = (): boolean => unlocked;
