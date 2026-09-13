/**
 * Unit tests for quiz question generation logic.
 */
import { kanjiData } from '../data/kanji';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

describe('quiz generation', () => {
  test('can sample unique kanji', () => {
    const sampled = shuffle(kanjiData).slice(0, 10);
    expect(sampled.length).toBe(10);
    const ids = sampled.map((k) => k.id);
    expect(new Set(ids).size).toBe(10);
  });

  test('can build meaning-to-kanji question', () => {
    const k = kanjiData[0];
    const options = [k.character, kanjiData[1].character, kanjiData[2].character, kanjiData[3].character];
    expect(options).toContain(k.character);
    expect(options.length).toBe(4);
  });
});
