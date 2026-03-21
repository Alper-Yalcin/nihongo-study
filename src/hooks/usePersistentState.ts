import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type InitialValue<T> = T | (() => T);

interface UsePersistentStateOptions<T> {
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

const resolveInitialValue = <T,>(initialValue: InitialValue<T>) =>
  typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;

export const usePersistentState = <T,>(
  key: string,
  initialValue: InitialValue<T>,
  options: UsePersistentStateOptions<T> = {}
): readonly [T, Dispatch<SetStateAction<T>>] => {
  const serialize = options.serialize ?? JSON.stringify;
  const deserialize = options.deserialize ?? JSON.parse;

  const [value, setValue] = useState<T>(() => {
    const fallback = resolveInitialValue(initialValue);

    if (typeof window === 'undefined') {
      return fallback;
    }

    const savedValue = window.localStorage.getItem(key);

    if (savedValue === null) {
      return fallback;
    }

    try {
      return deserialize(savedValue);
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, serialize(value));
    } catch {
      // Ignore storage write failures and keep the in-memory state usable.
    }
  }, [key, serialize, value]);

  return [value, setValue] as const;
};
