/**
 * Unit tests for the kanji dataset and quiz generation.
 */
import { kanjiData } from '../data/kanji';

describe('kanji dataset', () => {
  test('has entries', () => {
    expect(kanjiData.length).toBeGreaterThan(0);
  });

  test('all entries have unique ids', () => {
    const ids = kanjiData.map((k) => k.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('all entries have unique characters', () => {
    const chars = kanjiData.map((k) => k.character);
    expect(new Set(chars).size).toBe(chars.length);
  });

  test('all entries have required fields', () => {
    for (const k of kanjiData) {
      expect(k.id).toBeTruthy();
      expect(k.character).toBeTruthy();
      expect(k.meanings.length).toBeGreaterThan(0);
      expect(Array.isArray(k.onyomi)).toBe(true);
      expect(Array.isArray(k.kunyomi)).toBe(true);
      expect(k.strokeCount).toBeGreaterThan(0);
      expect(k.category).toBeTruthy();
      expect(k.mnemonic).toBeTruthy();
      expect(k.level).toBe('N5');
    }
  });

  test('verified-svg entries have strokePaths', () => {
    for (const k of kanjiData) {
      if (k.strokeOrderSource === 'verified-svg') {
        expect(k.strokePaths).toBeDefined();
        expect(k.strokePaths!.length).toBeGreaterThan(0);
      }
    }
  });

  test('fallback-count entries do not claim verified paths', () => {
    for (const k of kanjiData) {
      if (k.strokeOrderSource === 'fallback-count') {
        // may have no strokePaths or empty — never verified
        if (k.strokePaths) {
          expect(k.strokePaths.length).toBe(0);
        }
      }
    }
  });

  test('every example has word, reading, meaning', () => {
    for (const k of kanjiData) {
      for (const ex of k.examples) {
        expect(ex.word).toBeTruthy();
        expect(ex.reading).toBeTruthy();
        expect(ex.meaning).toBeTruthy();
      }
    }
  });
});
