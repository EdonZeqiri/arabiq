import { useState, useEffect, useRef } from 'react';
import { speakArabic } from '@/lib/arabicSpeech';

export function useArabicSpell() {
  const [spelling, setSpelling] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cancelRef.current?.(), []);

  function toggle(words: string | string[]) {
    if (spelling) { cancelRef.current?.(); setSpelling(false); return; }
    setSpelling(true);
    cancelRef.current = speakArabic(words, () => setSpelling(false));
  }

  return { spelling, toggle };
}
