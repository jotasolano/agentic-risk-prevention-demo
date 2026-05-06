import React, { useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  perCharMs: number;
  onDone?: () => void;
  onProgress?: (typed: string) => void;
}

export function Typewriter({ text, perCharMs, onDone, onProgress }: TypewriterProps) {
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    indexRef.current = 0;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onProgress?.(text);
      onDone?.();
      return;
    }

    const type = () => {
      if (!mountedRef.current) return;
      indexRef.current += 1;
      const currentText = text.slice(0, indexRef.current);
      onProgress?.(currentText);
      if (indexRef.current < text.length) {
        timerRef.current = setTimeout(type, perCharMs);
      } else {
        onDone?.();
      }
    };

    timerRef.current = setTimeout(type, perCharMs);

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
