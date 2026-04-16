import { useCallback, useEffect, useRef, useState } from 'react';

export interface VoiceRecorderApi {
  isRecording: boolean;
  audioURL: string | null;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearRecording: () => void;
}

/**
 * Thin wrapper around the MediaRecorder API.
 * - Requests microphone only when startRecording is called.
 * - Cleans up object URLs + streams on unmount or clearRecording.
 * - Falls back gracefully if the browser denies access.
 */
export function useVoiceRecorder(): VoiceRecorderApi {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const clearRecording = useCallback(() => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    setError(null);
    chunksRef.current = [];
  }, [audioURL]);

  const startRecording = useCallback(async () => {
    setError(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError('Shfletuesi juaj nuk mbështet regjistrimin e zërit.');
      return;
    }

    try {
      // Clean any previous take before starting a new one.
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL(null);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mime = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mime || 'audio/webm',
        });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stopStream();
      };

      recorderRef.current = recorder;
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
  }, [audioURL, stopStream]);

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
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isRecording,
    audioURL,
    error,
    startRecording,
    stopRecording,
    clearRecording,
  };
}
