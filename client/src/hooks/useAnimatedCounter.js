import { useState, useEffect, useRef } from 'react';

/**
 * Hook to animate a number from 0 to target value.
 * Uses requestAnimationFrame for smooth 60fps animation.
 */
export const useAnimatedCounter = (targetValue, duration = 1000, startOnMount = true) => {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const prevValueRef = useRef(0);

  useEffect(() => {
    if (!startOnMount) return;

    const from = prevValueRef.current;
    const to = Number(targetValue) || 0;
    prevValueRef.current = to;

    if (from === to) {
      setValue(to);
      return;
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;

      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setValue(to);
      }
    };

    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetValue, duration, startOnMount]);

  return Math.round(value);
};

export default useAnimatedCounter;
