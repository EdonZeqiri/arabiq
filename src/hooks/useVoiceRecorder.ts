import { useCallback, useEffect, useRef, useState } from 'react';

export interface Take {
  id: string;
  url: string;
  createdAt: number;
  /** Recording length in milliseconds — measured start→stop. */
  durationMs: number;
}

export interface VoiceRecorderApi {
  isRecording: boolean;
  /** Newest-first list of completed recordings in this session. */
  takes: Take[];
  /** Convenience alias for the most recent take's url (or null). */
  audioURL: string | null;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  /** Remove a single take by id. */
  removeTake: (id: string) => void;
  /** Clear every take. Kept as `clearRecording` so older callers keep working. */
  clearRecording: () => void;
}

/**
 * Wrapper around the MediaRecorder API that keeps a *stack* of takes
 * rather than a single blob. Users who want to compare attempt #1 to
 * attempt #3 can — and the common "oh no I hit record again and lost
 * my take" footgun disappears, because starting a new take no longer
 * wipes the previous one.
 *
 * Cleans up object URLs + mic streams on unmount.
 */
export function useVoiceRecorder(): VoiceRecorderApi {
  const [isRecording, setIsRecording] = useState(false);
  const [takes, setTakes] = useState<Take[]>([]);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef<number>(0);
  // We keep the live takes array in a ref too so the `onstop` handler,
  // which closes over the first render's state, can still append to the
  // current list instead of clobbering it.
  const takesRef = useRef<Take[]>([]);
  takesRef.current = takes;

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const removeTake = useCallback((id: string) => {
    setTakes((list) => {
      const next = list.filter((t) => {
        if (t.id !== id) return true;
        URL.revokeObjectURL(t.url);
        return false;
      });
      return next;
    });
  }, []);

  const clearRecording = useCallback(() => {
    setTakes((list) => {
      list.forEach((t) => URL.revokeObjectURL(t.url));
      return [];
    });
    setError(null);
    chunksRef.current = [];
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError('Shfletuesi juaj nuk mbështet regjistrimin e zërit.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mime = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';
      const recorder = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mime || 'audio/webm',
        });
        const url = URL.createObjectURL(blob);
        const take: Take = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          url,
          createdAt: Date.now(),
          durationMs: Date.now() - startedAtRef.current,
        };
        // Newest on top — matches the UI stack.
        setTakes((list) => [take, ...list]);
        stopStream();
      };

      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Leja për mikrofonin u refuzua.'
          : 'Nuk mund të hap mikrofonin. Provoni përsëri.';
      setError(message);
      stopStream();
      setIsRecording(false);
    }
  }, [stopStream]);

  const stopRecording = useCallback(() => {
    const r = recorderRef.current;
    if (r && r.state !== 'inactive') {
      r.stop();
    }
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      recorderRef.current?.state !== 'inactive' && recorderRef.current?.stop();
      stopStream();
      takesRef.current.forEach((t) => URL.revokeObjectURL(t.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isRecording,
    takes,
    audioURL: takes[0]?.url ?? null,
    error,
    startRecording,
    stopRecording,
    removeTake,
    clearRecording,
  };
}
