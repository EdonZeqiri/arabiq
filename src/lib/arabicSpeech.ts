// Holds the reset callback of whichever tile is currently speaking.
// Called before starting new speech so the previous tile deactivates.
let prevDone: (() => void) | null = null;

/**
 * Speak one or more Arabic words using the browser TTS engine.
 * Returns a cleanup function that cancels playback (safe to call on unmount).
 */
export function speakArabic(words: string | string[], onDone?: () => void): () => void {
  if (!window.speechSynthesis) return () => {};

  // Reset whichever tile was previously speaking
  prevDone?.();
  prevDone = onDone ?? null;

  const list = Array.isArray(words) ? words : [words];
  window.speechSynthesis.cancel();

  list.forEach((text, i) => {
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ar-SA';
    utt.rate = 0.85;
    if (i === list.length - 1) {
      utt.onend = () => { prevDone = null; onDone?.(); };
    }
    window.speechSynthesis.speak(utt);
  });

  return () => { prevDone = null; window.speechSynthesis.cancel(); };
}
