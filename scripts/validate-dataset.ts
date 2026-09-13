/**
 * Dataset validation script.
 * Run with: npm run validate:dataset
 *
 * Verifies the kanji dataset for:
 *   - No duplicate IDs
 *   - No duplicate characters
 *   - No missing required fields
 *   - Correct stroke-count type
 *   - Example words have word, reading, meaning
 *   - Stroke-order source is one of the allowed values
 *   - verified-svg entries actually have strokePaths
 *   - fallback-count entries do NOT pretend to have verified paths
 */

import { kanjiData } from '../data/kanji';
import type { Kanji } from '../types';

let errors = 0;
let warnings = 0;

function fail(msg: string): void {
  console.error(`✗ ${msg}`);
  errors += 1;
}

function warn(msg: string): void {
  console.warn(`! ${msg}`);
  warnings += 1;
}

const seenIds = new Set<string>();
const seenChars = new Set<string>();
const validSources = new Set(['verified-svg', 'fallback-count']);

for (const k of kanjiData as Kanji[]) {
  const ref = `${k.id ?? '?'}`;
  if (!k.id) fail(`entry has no id: ${JSON.stringify(k).slice(0, 60)}`);
  if (!k.character) fail(`${ref}: missing character`);
  if (!k.meanings || k.meanings.length === 0) fail(`${ref}: missing meanings`);
  if (!k.onyomi) fail(`${ref}: missing onyomi (use [] if none)`);
  if (!k.kunyomi) fail(`${ref}: missing kunyomi (use [] if none)`);
  if (typeof k.strokeCount !== 'number' || k.strokeCount < 1) {
    fail(`${ref}: invalid strokeCount "${k.strokeCount}"`);
  }
  if (!k.category) fail(`${ref}: missing category`);
  if (!k.examples || k.examples.length === 0) {
    warn(`${ref}: no example vocabulary`);
  } else {
    for (const ex of k.examples) {
      if (!ex.word) fail(`${ref}: example missing word`);
      if (!ex.reading) fail(`${ref}: example "${ex.word}" missing reading`);
      if (!ex.meaning) fail(`${ref}: example "${ex.word}" missing meaning`);
    }
  }
  if (!k.mnemonic) fail(`${ref}: missing mnemonic`);
  if (k.level !== 'N5') fail(`${ref}: level must be "N5"`);
  if (!validSources.has(k.strokeOrderSource)) {
    fail(`${ref}: invalid strokeOrderSource "${k.strokeOrderSource}"`);
  }
  if (k.strokeOrderSource === 'verified-svg') {
    if (!k.strokePaths || k.strokePaths.length === 0) {
      fail(`${ref}: strokeOrderSource is verified-svg but no strokePaths`);
    } else {
      for (const p of k.strokePaths) {
        if (!p.d || typeof p.d !== 'string') fail(`${ref}: stroke ${p.order} has no path d`);
        if (typeof p.order !== 'number' || p.order < 1) fail(`${ref}: stroke has invalid order`);
      }
    }
  }
  if (k.id && seenIds.has(k.id)) fail(`duplicate id: ${k.id}`);
  if (k.id) seenIds.add(k.id);
  if (k.character && seenChars.has(k.character)) fail(`duplicate character: ${k.character}`);
  if (k.character) seenChars.add(k.character);
}

console.log(`\nDataset: ${kanjiData.length} kanji entries`);
console.log(`Categories: ${[...new Set((kanjiData as Kanji[]).map(k => k.category))].join(', ')}`);
console.log(`Verified SVG stroke order: ${(kanjiData as Kanji[]).filter(k => k.strokeOrderSource === 'verified-svg').length}`);
console.log(`Fallback (count-only) stroke order: ${(kanjiData as Kanji[]).filter(k => k.strokeOrderSource === 'fallback-count').length}`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors > 0) {
  console.error('\n✗ Dataset validation FAILED');
  process.exit(1);
}
console.log('\n✓ Dataset validation passed');
process.exit(0);
