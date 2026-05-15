import { useEffect, useState } from 'react';

interface UseBestScoreOptions<T> {
  storageKey: string;
  candidate: T;
  isBetter: (candidate: T, incumbent: T) => boolean;
}

export const useBestScore = <T,>({
  storageKey,
  candidate,
  isBetter
}: UseBestScoreOptions<T>) => {
  const [bestScore, setBestScore] = useState<T | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setBestScore(candidate);
      setIsNewBest(true);
      return;
    }

    let nextBestScore: T = candidate;
    let nextIsNewBest = true;

    try {
      const saved = window.localStorage.getItem(storageKey);

      if (saved) {
        const parsed = JSON.parse(saved) as T;

        if (isBetter(candidate, parsed)) {
          window.localStorage.setItem(storageKey, JSON.stringify(candidate));
        } else {
          nextBestScore = parsed;
          nextIsNewBest = false;
        }
      } else {
        window.localStorage.setItem(storageKey, JSON.stringify(candidate));
      }
    } catch {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(candidate));
      } catch {
        // Ignore storage write failures and keep rendering current stats.
      }
    }

    setBestScore(nextBestScore);
    setIsNewBest(nextIsNewBest);
  }, [candidate, isBetter, storageKey]);

  return { bestScore, isNewBest };
};
