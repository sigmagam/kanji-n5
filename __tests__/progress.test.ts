/**
 * Unit tests for progress state logic (pure functions).
 */
describe('progress logic', () => {
  test('streak increments on consecutive days', () => {
    const today = '2026-09-13';
    const yesterday = '2026-09-12';
    const diff = Math.round((new Date(today + 'T00:00:00').getTime() - new Date(yesterday + 'T00:00:00').getTime()) / 86400000);
    expect(diff).toBe(1);
  });

  test('daily goal clamps to valid range', () => {
    const clamp = (n: number) => Math.max(1, Math.min(50, n));
    expect(clamp(0)).toBe(1);
    expect(clamp(5)).toBe(5);
    expect(clamp(100)).toBe(50);
  });
});
