// Web Speech API wrapper for Arabic TTS.
//
// Important note for anyone debugging silent audio: speechSynthesis
// reads voices from the *operating system*, not from the browser.
// macOS, Windows, and Android usually do not ship an Arabic voice by
// default — when no `ar-*` voice is installed, the engine silently
// falls back to an unrelated voice (or skips the utterance entirely
// on some platforms). To diagnose, open the console and look for the
// "[arabicSpeech]" warning emitted on first speak() call.

// Holds the reset callback of whichever tile is currently speaking.
// Called before starting new speech so the previous tile deactivates.
let prevDone: (() => void) | null = null;

// One-time voice diagnostic. Logged the first time speakArabic runs,
// and again whenever the voice list changes (Chrome and Safari
// populate voices asynchronously, so the first call may see [] until
// the `voiceschanged` event fires).
let diagnosticLogged = false;
function logVoiceDiagnostic() {
  if (diagnosticLogged) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    // Voices not loaded yet — wait for the asynchronous event and
    // try again. Don't mark `diagnosticLogged` so we re-check.
    window.speechSynthesis.addEventListener(
      'voiceschanged',
      logVoiceDiagnostic,
      { once: true },
    );
    return;
  }
  diagnosticLogged = true;
  const arabicVoices = voices.filter((v) => v.lang.startsWith('ar'));
  if (arabicVoices.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(
      '[arabicSpeech] No Arabic system voice found. Install one to hear pronunciation:\n' +
        '  • macOS: System Settings → Accessibility → Spoken Content → Manage Voices → Arabic (Saudi Arabia) → download "Maged"\n' +
        '  • Windows: Settings → Time & Language → Language → Add Arabic + speech package\n' +
        '  • Android: Settings → System → Languages → Text-to-speech → install Arabic\n' +
        `  Available voices on this system: ${voices.map((v) => `${v.name} (${v.lang})`).join(', ')}`,
    );
  } else {
    // eslint-disable-next-line no-console
    console.info(
      `[arabicSpeech] Arabic voices available: ${arabicVoices
        .map((v) => `${v.name} (${v.lang})`)
        .join(', ')}`,
    );
  }
}

// Pick the best Arabic voice the system offers — preferring Saudi
// (modern standard pronunciation), then Egyptian, then anything `ar`.
function pickArabicVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'ar-SA') ??
    voices.find((v) => v.lang === 'ar-EG') ??
    voices.find((v) => v.lang.startsWith('ar')) ??
    null
  );
}

/**
 * Speak one or more Arabic words using the browser TTS engine.
 * Returns a cleanup function that cancels playback (safe to call on unmount).
 */
export function speakArabic(words: string | string[], onDone?: () => void): () => void {
  if (!window.speechSynthesis) return () => {};
  logVoiceDiagnostic();

  // Reset whichever tile was previously speaking
  prevDone?.();
  prevDone = onDone ?? null;

  const list = Array.isArray(words) ? words : [words];
  window.speechSynthesis.cancel();

  const voice = pickArabicVoice();

  list.forEach((text, i) => {
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ar-SA';
    utt.rate = 0.85;
    // Pinning the voice avoids the platform falling back to the
    // current default (often English) when `lang` alone doesn't
    // resolve to an installed voice.
    if (voice) utt.voice = voice;
    if (i === list.length - 1) {
      utt.onend = () => { prevDone = null; onDone?.(); };
    }
    window.speechSynthesis.speak(utt);
  });

  return () => { prevDone = null; window.speechSynthesis.cancel(); };
}
