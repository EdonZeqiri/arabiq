import { AlertCircle, Eye, EyeOff, Mic, RotateCcw, Square, Trash2 } from 'lucide-react';
import type { Story } from '@/data/curriculum';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useState } from 'react';
import { stripHarakat } from '@/lib/arabicText';

interface StoryCardProps {
  story: Story;
  showHarakat: boolean;
}

/**
 * A single chapter story rendered for self-practice.
 *
 * Flow:
 *   1. User reads the Albanian translation.
 *   2. Records themselves saying it in Arabic (MediaRecorder).
 *   3. Reveals the Arabic text and plays back their recording to
 *      compare pronunciation + word order.
 *
 * The Arabic paragraph is hidden by default so the user is forced to
 * attempt the translation before peeking at the model text.
 */
export function StoryCard({ story, showHarakat }: StoryCardProps) {
  const [revealed, setRevealed] = useState(false);
  const {
    isRecording,
    audioURL,
    error,
    startRecording,
    stopRecording,
    clearRecording,
  } = useVoiceRecorder();

  const reset = () => {
    setRevealed(false);
    clearRecording();
  };

  return (
    <article className="p-5 space-y-4">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-amber-600 font-semibold">
            Tregim
          </span>
          <h3 className="text-sm font-semibold text-slate-800">
            {story.titleAl}
          </h3>
        </div>
        {(revealed || audioURL) && (
          <button
            onClick={reset}
            className="btn-ghost !px-2 !py-1 text-xs"
            title="Rifillo"
          >
            <RotateCcw size={14} /> Rifillo
          </button>
        )}
      </header>

      {/* Albanian paragraph — always visible, this is the prompt */}
      <p className="text-[15px] text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-4">
        {story.albanian}
      </p>

      {/* Voice recorder row */}
      <div className="flex flex-wrap items-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="btn-primary !rounded-full !w-12 !h-12 !p-0"
            aria-label="Fillo regjistrimin"
            title="Regjistro përkthimin tënd në arabisht"
          >
            <Mic size={18} />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="btn !rounded-full !w-12 !h-12 !p-0 bg-red-600 text-white hover:bg-red-700 animate-pulse"
            aria-label="Ndal regjistrimin"
          >
            <Square size={18} />
          </button>
        )}

        {audioURL && !isRecording && (
          <>
            <audio controls src={audioURL} className="h-10 max-w-full">
              <track kind="captions" />
            </audio>
            <button
              onClick={clearRecording}
              className="btn-ghost !px-2 !py-2"
              aria-label="Fshi regjistrimin"
              title="Fshi"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}

        <div className="text-xs text-slate-500 min-w-0">
          {isRecording && 'Duke regjistruar… shtyp 🟥 për të ndaluar.'}
          {!isRecording && !audioURL &&
            'Përkthe tregimin me zë në arabisht, pastaj krahaso.'}
          {!isRecording && audioURL && !revealed &&
            'Dëgjo regjistrimin tënd, pastaj shtyp "Trego arabishten" për të kontrolluar.'}
          {!isRecording && audioURL && revealed &&
            'Krahaso regjistrimin me tekstin arabisht më poshtë.'}
        </div>
      </div>

      {/* Reveal / Arabic text */}
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="btn-outline w-full justify-center"
        >
          <Eye size={16} /> Trego arabishten
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
              Arabishtja
            </span>
            <button
              onClick={() => setRevealed(false)}
              className="btn-ghost !px-2 !py-1 text-xs"
              title="Fshih përsëri"
            >
              <EyeOff size={14} /> Fshih
            </button>
          </div>
          <p
            dir="rtl"
            className="font-amiri text-2xl md:text-[28px] text-slate-900"
            style={{ lineHeight: 2.4 }}
          >
            {showHarakat ? story.arabic : stripHarakat(story.arabic)}
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-1">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </article>
  );
}
