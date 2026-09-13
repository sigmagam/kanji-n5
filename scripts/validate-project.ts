/**
 * Expo project validation script.
 * Run with: npm run validate:project
 *
 * Checks that key project files exist and that the app.config.ts / package.json
 * reference expected identifiers. Does NOT require a running packager.
 */

import { readFileSync, existsSync } from 'node:fs';

const requiredFiles = [
  'package.json',
  'app.config.ts',
  'tsconfig.json',
  'babel.config.js',
  'eas.json',
  'data/kanji.ts',
  'app/_layout.tsx',
  'app/index.tsx',
];

let errors = 0;
const fail = (m: string) => { console.error(`✗ ${m}`); errors += 1; };

for (const f of requiredFiles) {
  if (!existsSync(f)) fail(`missing required file: ${f}`);
}

// package.json sanity
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
if (pkg.name !== 'kanji-n5') fail(`package name is "${pkg.name}", expected "kanji-n5"`);
if (!pkg.main || !pkg.main.includes('expo-router')) fail('package.json main must use expo-router/entry');
if (!pkg.scripts?.typecheck) fail('missing typecheck script');
if (!pkg.scripts?.lint) fail('missing lint script');
if (!pkg.scripts?.test) fail('missing test script');
if (!pkg.scripts?.['validate:dataset']) fail('missing validate:dataset script');

// eas.json sanity
const eas = JSON.parse(readFileSync('eas.json', 'utf8'));
if (!eas.build?.preview) fail('eas.json missing preview profile');
if (eas.build.preview?.android?.buildType !== 'apk') fail('preview profile must build apk');
if (!eas.build?.production) fail('eas.json missing production profile');

console.log(`\nRequired files: ${requiredFiles.length}`);
console.log(`Errors: ${errors}`);
if (errors > 0) {
  console.error('\n✗ Project validation FAILED');
  process.exit(1);
}
console.log('\n✓ Project validation passed');
process.exit(0);
