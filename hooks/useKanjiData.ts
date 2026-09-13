/**
 * useKanjiData — memoized access to the local kanji curriculum.
 */
import { useMemo } from 'react';
import { kanjiData } from '../data/kanji';
import type { Kanji } from '../types';

export function useKanjiData(): Kanji[] {
  return useMemo(() => kanjiData, []);
}

export function useKanjiById(id: string): Kanji | undefined {
  return useMemo(() => kanjiData.find((k) => k.id === id), [id]);
}

export function useKanjiByCategory(): Record<string, Kanji[]> {
  return useMemo(() => {
    return kanjiData.reduce<Record<string, Kanji[]>>((acc, k) => {
      (acc[k.category] = acc[k.category] || []).push(k);
      return acc;
    }, {});
  }, []);
}

export function useKanjiCategories(): string[] {
  return useMemo(() => [...new Set(kanjiData.map((k) => k.category))], []);
}
