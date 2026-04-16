import { Mic, Square, Play, Trash2, AlertCircle } from 'lucide-react';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';

export function VoiceRecorder() {
  const {
    isRecording,
    audioURL,
    error,
    startRecording,
    stopRecording,
    clearRecording,
  } = useVoiceRecorder();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="btn-primary !rounded-full !w-14 !h-14 !p-0"
            aria-label="Fillo regjistrimin"
          >
            <Mic size={22} />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="btn !rounded-full !w-14 !h-14 !p-0 bg-red-600 text-white hover:bg-red-700 animate-pulse"
            aria-label="Ndal regjistrimin"
          >
            <Square size={22} />
          </button>
        )}

        {audioURL && !isRecording && (
          <>
            <audio controls src={audioURL} className="h-10">
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
      </div>

      <div className="text-xs text-slate-500 text-center">
        {isRecording && 'Duke regjistruar… shtyp 🟥 për të ndaluar.'}
        {!isRecording && !audioURL && 'Shtyp 🎤 për të regjistruar zërin tënd.'}
        {!isRecording && audioURL && (
          <span className="inline-flex items-center gap-1">
            <Play size={12} /> Luaje regjistrimin dhe krahasoje me modelin.
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-1">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
}
