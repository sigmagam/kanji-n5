/**
 * useQuiz — generates randomized quiz questions from the local dataset.
 * Four modes: meaning→kanji, kanji→meaning, reading→kanji, word→reading.
 */
import { useMemo, useCallback } from 'react';
import { kanjiData } from '../data/kanji';
import type { QuizQuestion, QuizMode } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors<T>(pool: T[], correct: T, count: number): T[] {
  const others = pool.filter((x) => x !== correct);
  return shuffle(others).slice(0, count);
}

export function useQuiz(mode: QuizMode, count = 10) {
  const pool = useMemo(() => kanjiData, []);

  const questions = useMemo<QuizQuestion[]>(() => {
    const sampled = shuffle(pool).slice(0, Math.min(count, pool.length));
    return sampled.map((k) => {
      let prompt = '';
      let answer = '';
      let optionPool: string[] = [];
      switch (mode) {
        case 'meaning-to-kanji':
          prompt = k.meanings[0];
          answer = k.character;
          optionPool = pool.map((x) => x.character);
          break;
        case 'kanji-to-meaning':
          prompt = k.character;
          answer = k.meanings[0];
          optionPool = pool.map((x) => x.meanings[0]);
          break;
        case 'reading-to-kanji': {
          const reading = (k.onyomi[0] || k.kunyomi[0] || '');
          prompt = reading;
          answer = k.character;
          optionPool = pool.map((x) => x.onyomi[0] || x.kunyomi[0] || '');
          break;
        }
        case 'word-to-reading': {
          const ex = k.examples[0];
          prompt = ex.word;
          answer = ex.reading;
          optionPool = pool.map((x) => x.examples[0]?.reading || '');
          break;
        }
      }
      const distractors = pickDistractors(optionPool, answer, 3);
      const options = shuffle([answer, ...distractors]);
      return { kanjiId: k.id, prompt, answer, options, mode };
    });
  }, [mode, count, pool]);

  const regenerate = useCallback(() => {
    // Re-shuffle by changing reference; consumers re-run useMemo via key.
    return questions;
  }, [questions]);

  return { questions, regenerate };
}
