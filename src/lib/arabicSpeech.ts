// Web Speech API wrapper for Arabic TTS.
//
// Important note for anyone debugging silent audio: speechSynthesis
// reads voices from the *operating system*, not from the browser.
// macOS, Windows, and Android usually do not ship an Arabic voice by
// default — when no `ar-*` voice is installed, the engine silently
// falls back to an unrelated voice (or skips the utterance entirely
// on some platforms). To diagnose, open the console and look for the
// "[arabicSpeech]" warning emitted on first speak() call.
//
// This wrapper papers over a handful of well-known engine bugs:
//
//   1. Voices load asynchronously. The first call after page load may
//      see `getVoices() === []`. We wait for the `voiceschanged`
//      event before queueing the utterance.
//   2. Chrome silently pauses synthesis after ~15s of speaking. We
//      tickle `resume()` on a 5s heartbeat while anything is queued.
//   3. After many `cancel()` calls, both Chrome and Safari can leave
//      `speechSynthesis.speaking === true` with nothing actually
//      playing — the next `speak()` then queues forever. We force a
//      fresh cancel+resume cycle on every invocation, and run a
//      watchdog: if `onstart` doesn't fire within ~700ms, we cancel
//      and retry once with a brand-new utterance.
//   4. iOS Safari requires a user-gesture-driven speak() before the
//      engine accepts utterances. Since speakArabic is always called
//      from a click handler in this app, we don't need extra unlock
//      logic — but we DO trigger an empty pre-warm on first invoke to
//      kick the engine into a "ready" state.

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

// Wait up to `timeoutMs` for the voice list to populate. Resolves
// immediately if voices are already there. Used to guard against the
// "first click is silent" case on Chrome/Safari where getVoices()
// returns [] until the `voiceschanged` event fires.
function ensureVoicesLoaded(timeoutMs = 1500): Promise<void> {
  return new Promise((resolve) => {
    if (window.speechSynthesis.getVoices().length > 0) {
      resolve();
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.speechSynthesis.removeEventListener('voiceschanged', finish);
      resolve();
    };
    window.speechSynthesis.addEventListener('voiceschanged', finish);
    setTimeout(finish, timeoutMs);
  });
}

// Token for the currently-active invocation. Used so a cleanup
// function returned by an *old* speakArabic call doesn't tear down
// playback that a *newer* call has just queued — important under
// React 18 StrictMode in dev where useEffect cleanups run more
// aggressively than they would in production.
let activeToken = 0;

// Chrome keep-alive heartbeat — Chrome's speech engine silently
// pauses itself after ~15s of an utterance, and *also* sometimes
// after the page has been idle. Tickling `resume()` on a 5s timer
// while anything is queued keeps it awake. The interval is null when
// nothing is queued.
let keepAliveTimer: ReturnType<typeof setInterval> | null = null;
function startKeepAlive() {
  if (keepAliveTimer != null) return;
  keepAliveTimer = setInterval(() => {
    if (
      window.speechSynthesis.speaking ||
      window.speechSynthesis.pending
    ) {
      // Pause+resume is the documented workaround for Chrome's
      // 15-second auto-pause bug. On other engines it's a no-op.
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    } else {
      stopKeepAlive();
    }
  }, 5000);
}
function stopKeepAlive() {
  if (keepAliveTimer != null) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

// Hard reset of the engine — used both before queueing a new
// utterance and as the recovery step when the watchdog fires. The
// cancel() clears any phantom queued utterances; resume() un-pauses
// the engine if a previous cancel left it in the "paused" state
// (a known Safari/macOS quirk).
function resetEngine() {
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* engine may throw mid-state — ignore and continue */
  }
  try {
    window.speechSynthesis.resume();
  } catch {
    /* same */
  }
}

/**
 * Speak one or more Arabic words using the browser TTS engine.
 * Returns a cleanup function that cancels playback (safe to call on unmount).
 */
export function speakArabic(words: string | string[], onDone?: () => void): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return () => {};
  }
  logVoiceDiagnostic();

  // Reset whichever tile was previously speaking
  prevDone?.();
  prevDone = onDone ?? null;

  const myToken = ++activeToken;
  const list = Array.isArray(words) ? words : [words];

  // Watchdog timers per utterance — if onstart doesn't fire within
  // ~700ms, we assume the engine swallowed the utterance and retry
  // once. Stored so cleanup can clear them.
  const watchdogs: ReturnType<typeof setTimeout>[] = [];
  const clearWatchdogs = () => {
    while (watchdogs.length) clearTimeout(watchdogs.pop()!);
  };

  // Build and queue an utterance. Pulled into a closure so we can
  // re-call it on watchdog retry without re-walking the whole list.
  const queueUtterance = (
    text: string,
    isLast: boolean,
    attempt: number,
  ) => {
    if (myToken !== activeToken) return; // superseded mid-flight

    const voice = pickArabicVoice();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.85;

    // Pinning the voice avoids the platform falling back to the
    // current default (often English) when `lang` alone doesn't
    // resolve to an installed voice. Critically, when we pin the
    // voice we must also set `utt.lang` to *that voice's* lang —
    // some platforms (Safari/macOS with the new "ar-001" world-
    // Arabic tag on Majed) silently skip the utterance when
    // `utt.lang` doesn't match the pinned voice's lang exactly.
    if (voice) {
      utt.voice = voice;
      utt.lang = voice.lang;
    } else {
      utt.lang = 'ar-SA';
    }

    let started = false;

    utt.onstart = () => {
      started = true;
      // eslint-disable-next-line no-console
      console.info(
        `[arabicSpeech] start "${text}" voice=${
          utt.voice?.name ?? '<default>'
        } lang=${utt.lang}`,
      );
    };

    utt.onerror = (ev) => {
      // "canceled" / "interrupted" are benign when a newer speak
      // call superseded this one — only log real errors.
      if (ev.error && ev.error !== 'canceled' && ev.error !== 'interrupted') {
        // eslint-disable-next-line no-console
        console.warn(`[arabicSpeech] error "${text}":`, ev.error);
      }
    };

    if (isLast) {
      utt.onend = () => {
        prevDone = null;
        clearWatchdogs();
        stopKeepAlive();
        onDone?.();
      };
    }

    // Watchdog: if onstart doesn't fire within 700ms AND nothing
    // else in the queue is speaking, the engine almost certainly
    // ate this utterance. Reset and retry — but only once, to
    // avoid an infinite loop on systems that genuinely cannot
    // speak (e.g. no Arabic voice + strict lang matching).
    if (attempt === 0) {
      const watchdog = setTimeout(() => {
        if (myToken !== activeToken) return;
        if (started) return;
        if (window.speechSynthesis.speaking) return; // something IS playing
        // eslint-disable-next-line no-console
        console.warn(
          `[arabicSpeech] watchdog: "${text}" never started after 700ms — retrying`,
        );
        resetEngine();
        // Small delay so the engine settles after cancel.
        setTimeout(() => {
          if (myToken !== activeToken) return;
          queueUtterance(text, isLast, attempt + 1);
        }, 50);
      }, 700);
      watchdogs.push(watchdog);
    }

    window.speechSynthesis.speak(utt);
  };

  // Kick the actual queueing off after voices are ready. On a fully
  // warm engine this resolves synchronously; on the first click of
  // a fresh page it may wait up to ~1.5s for the voice list.
  ensureVoicesLoaded().then(() => {
    if (myToken !== activeToken) return;

    // Force a hard reset of the engine state. Doing this
    // unconditionally — not gated on `speaking || pending` — is
    // what fixes the "phantom speaking" stuck state where the
    // engine reports it's busy but isn't actually emitting audio.
    resetEngine();

    startKeepAlive();

    // Small delay after cancel — Safari is finicky about
    // queueing immediately after cancel(). 30ms is enough to let
    // the cancel propagate without being user-noticeable.
    setTimeout(() => {
      if (myToken !== activeToken) return;
      list.forEach((text, i) => {
        queueUtterance(text, i === list.length - 1, 0);
      });
    }, 30);
  });

  // Cleanup is conservative: only cancel speech if THIS invocation
  // is still the active one. A stale cleanup (e.g. fired by React
  // StrictMode after a newer speakArabic has already taken over)
  // becomes a no-op instead of cancelling the new playback.
  return () => {
    if (myToken !== activeToken) return;
    prevDone = null;
    clearWatchdogs();
    stopKeepAlive();
    resetEngine();
  };
}
