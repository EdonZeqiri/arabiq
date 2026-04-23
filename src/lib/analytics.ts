// Thin wrapper around the Umami tracker that ships in index.html.
//
// Why a wrapper and not a direct `window.umami.track(...)` call at each
// site?
//   1. Type-safety — every event we care about is listed here as a
//      discriminated union, so autocomplete catches typos.
//   2. Dev-mode no-op — in `npm run dev` we only log to console; we
//      never pollute the real dashboard with hot-reload noise.
//   3. Umami might not be loaded yet (slow network, ad-blocker). This
//      wrapper silently drops the call instead of throwing.
//
// Umami attaches itself to `window.umami` when the script loads. We
// feature-detect each call instead of storing a reference, so a late
// load still captures events.

type Props = Record<string, string | number | boolean | undefined>;

/**
 * Every tracked event in the app — add new ones here so the dashboard
 * stays tidy and we can spot typos at call sites. The shape is:
 *
 *   event name   — lowercase snake_case, past-tense verb where possible
 *   props        — small bag of primitives (Umami drops nested objects)
 */
export type TrackEvent =
  // ── Navigation / engagement ──
  | { name: 'chapter_opened'; props: { chapter: number } }
  | { name: 'section_expanded'; props: { section: string; chapter: number } }
  // ── Dialogues ──
  | { name: 'dialogue_viewed'; props: { chapter: number; dialogue: string } }
  | { name: 'dialogue_mastered'; props: { chapter: number; dialogue: string } }
  | { name: 'dialogue_variant_cycled'; props: { dialogue: string; variant: number } }
  // ── Stories ──
  | { name: 'story_viewed'; props: { chapter: number; story: string } }
  | { name: 'story_variant_cycled'; props: { story: string; variant: number } }
  | { name: 'story_recorded'; props: { chapter: number; story: string } }
  // ── Voice / pronunciation ──
  | { name: 'voice_record_started'; props: { context: 'story' | 'dialogue' | 'exercise' } }
  | { name: 'pronunciation_passed'; props: { accuracy: number; context: string } }
  | { name: 'pronunciation_failed'; props: { accuracy: number; context: string } }
  // ── Exercises ──
  | { name: 'exercise_attempted'; props: { chapter: number; exercise: string } }
  | { name: 'exercise_correct'; props: { chapter: number; exercise: string } }
  | { name: 'exercise_revealed'; props: { chapter: number; exercise: string } }
  // ── Vocabulary ──
  | { name: 'vocab_searched'; props: { query_length: number } }
  | { name: 'vocab_speaker_played'; props: { word: string } }
  // ── Ayat ──
  | { name: 'ayah_revealed'; props: { chapter: number; reference: string } }
  // ── Settings ──
  | { name: 'setting_toggled'; props: { setting: string; value: boolean } };

const isDev =
  typeof import.meta !== 'undefined' &&
  (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV === true;

// Umami's real signature is an overloaded function; TypeScript's union
// handling doesn't preserve overload arms through our narrowing path,
// so we model it as a plain variadic callable and cast at the edge.
interface UmamiTracker {
  (name: string, props?: Props): void;
  (callback: (props: Props) => Props): void;
}
interface UmamiWindow extends Window {
  umami?: { track: UmamiTracker };
}

/**
 * Fire a custom event. Safe to call before Umami has loaded — if the
 * tracker isn't ready we swallow the call rather than queue (Umami
 * auto-tracks page views on its own, so queuing custom events isn't
 * worth the complexity for a pageview-heavy app).
 */
export function track<E extends TrackEvent>(event: E): void {
  if (isDev) {
    // Visible in the browser devtools while developing. Keeps the
    // dashboard clean and makes typos obvious.
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event.name, event.props);
    return;
  }
  const w = window as UmamiWindow;
  try {
    w.umami?.track?.(event.name, event.props as Props);
  } catch {
    // Network issues, ad-blockers, etc. — analytics must never break
    // the app, so we swallow.
  }
}
