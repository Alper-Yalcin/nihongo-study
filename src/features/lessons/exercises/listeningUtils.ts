export function getJaVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined') return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'ja-JP') ??
    voices.find((v) => v.lang.startsWith('ja')) ??
    null
  );
}

export function speakJapanese(text: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'ja-JP';
  const voice = getJaVoice();
  if (voice) utt.voice = voice;
  utt.rate = 0.85;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}

export function initVoice(onReady: (hasVoice: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const resolve = () => {
    onReady(getJaVoice() !== null);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    resolve();
  } else {
    window.speechSynthesis.onvoiceschanged = resolve;
  }

  return () => {
    window.speechSynthesis.cancel();
  };
}
