// Future-proof audio abstraction — swap Web Speech for mp3/TTS without touching callers

export function playJapaneseAudio(text: string, rate = 0.78): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

export function createAudioPlayer(text: string) {
  return {
    play: () => playJapaneseAudio(text),
    playSlower: () => playJapaneseAudio(text, 0.55),
  };
}

export function stopAudio(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
