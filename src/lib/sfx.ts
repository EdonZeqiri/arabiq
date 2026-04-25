// Tiny Web Audio helpers for pass / fail feedback cues.
//
// We deliberately synthesize the tones instead of shipping .mp3 assets:
//   - Zero network cost, zero load-time blocking, zero CORS drama on
//     GitHub Pages.
//   - The pass/fail envelopes are tuned (300ms, soft triangle wave,
//     gentle attack/release) to feel like app UI sounds, not like a
//     1990s game over screen. Short enough that a user racing through
//     exercises isn't annoyed.
//
// Browser audio rules: an AudioContext can only start after a user
// gesture on most browsers, so we create it lazily the first time a
// cue is fired. That cue will always be triggered by a click / speech
// callback that followed a click, so the gesture constraint is met.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (ctx) return ctx;
  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    return ctx;
  } catch {
    return null;
  }
}

// Play a single tone with a short ADSR envelope so it sounds more
// "chime"-y and less "beep"-y. Volume peaks around 0.12 to stay under
// the level of typical dialogue audio — we don't want to startle.
function tone(
  freq: number,
  startOffset: number,
  durationMs: number,
  type: OscillatorType = 'triangle',
  peakGain = 0.12,
): void {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime + startOffset;
  const end = now + durationMs / 1000;

  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  const gain = ac.createGain();
  // Quick attack → gentle decay. Keeps the cue crisp without clicks.
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(end + 0.02);
}

/**
 * Cheerful three-note ascending arpeggio — a C-major triad (C5-E5-G5)
 * played quickly. Reads unmistakably as "correct!" in every UI sound
 * convention (Duolingo, iOS notification success, game pickups).
 * Triangle wave gives a clear, slightly bell-like tone; the three
 * ascending notes remove any ambiguity.
 */
export function playPass(): void {
  tone(523.25, 0, 110, 'triangle'); // C5
  tone(659.25, 0.07, 110, 'triangle'); // E5
  tone(783.99, 0.14, 220, 'triangle'); // G5
}

/**
 * Classic "error buzz" — a short, low square-wave drone with a drop
 * in pitch. Square wave sounds deliberately electronic and "wrong",
 * matching every OS error sound ever shipped. Short enough to not be
 * punishing, distinctive enough that you can never mistake it for
 * the success chime.
 */
export function playFail(): void {
  // Square waves are harmonically rich and sound louder than triangles
  // at the same gain — pull them down to 0.07 so the error buzz is
  // assertive but doesn't startle someone wearing headphones.
  tone(220, 0, 90, 'square', 0.07); // A3 buzz
  tone(196, 0.11, 180, 'square', 0.07); // G3 — tiny drop completes the fail
}
