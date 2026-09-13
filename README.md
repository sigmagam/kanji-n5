# KANJI N5 — Japanese Flashcards

> Aplikasi Android belajar kanji tingkat pemula (N5) yang berjalan sepenuhnya **luring** (offline-first). Dibangun dengan React Native, Expo, TypeScript, dan Expo Router. Antarmuka berbahasa Indonesia.

![Dataset](https://img.shields.io/badge/kanji-99%20entri-blue)
![Offline](https://img.shields.io/badge/offline-first-success)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

## ✨ Fitur

- **99 kanji** kurikulum pemula yang dikurasi & diverifikasi (makna dalam Bahasa Indonesia)
- **13 layar**: Splash, Onboarding, Beranda, Pustaka, Detail Kanji, Flashcard, Harian, Kuis, Latihan Menulis, Favorit, Progres, Pengaturan, Tentang
- **Flashcard** dengan animasi flip 3D (Reanimated), navigasi geser, favorit, tandai dikuasai, ulangi
- **Kuis** 4 mode: Makna→Kanji, Kanji→Makna, Bacaan→Kanji, Kata→Bacaan — dengan skor, tinjau kesalahan, coba lagi
- **Urutan goresan** dengan animasi SVG berurutan (putar/jeda/ulangi) atau fallback hitungan goresan bernomor
- **Penyimpanan lokal** untuk progres, dikuasai, favorit, skor kuis, streak, tujuan harian, riwayat tinjauan, pengaturan
- **Tanpa internet, server, basis data daring, atau login** untuk fitur inti

## 📱 Tampilan

- Desain minimalis, elegan, bernuansa Jepang (kertas washi, tinta sumi, merah hanko)
- Tipografi bersih, transisi halus, kontras tinggi
- Tanpa gradien neon, tanpa glassmorphism berlebihan, tanpa tombol palsu

## 🗂️ Dataset Kanji

| Properti | Nilai |
|---|---|
| Total kanji | 99 (kurikulum pemula) |
| Kategori | 14 (Angka, Waktu, Manusia, Tubuh, Alam, Arah, Sifat, Aksi, Benda, Tempat, Sosial, Keluarga, Lain-lain, Warna) |
| Urutan goresan SVG terverifikasi | 16 |
| Fallback hitungan goresan | 83 |

### Sumber & Verifikasi

JLPT **tidak** menerbitkan satu daftar kanji resmi yang tetap atau jumlah resmi untuk N5. Aplikasi ini **tidak mengklaim** bahwa 99 adalah "total resmi JLPT N5". Ini adalah kurikulum pemula yang dikurasi dari:

- **KANJIDIC2** (EDRDG) — bacaan & jumlah goresan
- **Jisho.org** (KANJIDIC2 + KANJIVG) — jumlah goresan & contoh kata
- **KANJIVG** (KanjiVG project) — path SVG urutan goresan terverifikasi
- **"Basic Kanji Book"** (Bonjinsha) & **"Kanji Look and Learn"** (Goko) — pengelompokan kategori

Setiap entri diverikasi untuk: karakter kanji (tanpa duplikat), onyomi (katakana), kunyomi (hiragana), jumlah goresan, makna Indonesia, dan contoh kosakata.

**Urutan goresan**: Hanya ditampilkan animasi SVG jika data terverifikasi telah ditranskripsi. Jika tidak, ditampilkan fallback hitungan goresan bernomor — **tidak ada geometri path yang dibuat-buat**.

Dataset bersifat **expandable**: tambahkan objek `Kanji` baru ke `data/kanji.ts` dan seluruh aplikasi otomatis mengenalinya.

## 🚀 Menjalankan Secara Lokal

```bash
# 1. Install dependencies
npm install

# 2. Mulai dev server Expo
npm start

# 3. Pindai QR dengan Expo Go (Android), atau tekan 'a' untuk emulator Android
```

**Prasyarat**: Node.js ≥ 18, Expo Go (di perangkat) atau Android Studio (untuk emulator).

## 📦 Build APK

### Preview APK (untuk pengujian)

```bash
# Login ke EAS (sekali saja)
npx eas login

# Build APK preview
eas build --platform android --profile preview
```

APK siap diunduh dari dashboard EAS setelah build selesai.

### Production AAB (untuk Play Store)

```bash
eas build --platform android --profile production
```

Menghasilkan `.aab` (Android App Bundle) untuk diunggah ke Google Play Console.

## 🔐 Keamanan & Secret

- **Tidak ada signing key, token, atau secret yang di-commit.**
- `.gitignore` mengecualikan `secrets/`, `.env`, `*.keystore`, `*.jks`.
- Token EAS (`EXPO_TOKEN`) disuntik via GitHub Secrets atau `eas secret:create` — tidak pernah di hardcode.
- Lihat `.env.example` untuk variabel lingkungan lokal.

## 🔧 CI/CD (GitHub Actions)

Alur kerja `.github/workflows/ci.yml` menjalankan otomatis pada push/PR ke `main`:

1. Install dependencies (`npm ci`)
2. TypeScript checking (`npm run typecheck`)
3. Linting (`npm run lint`)
4. Unit tests (`npm test`)
5. Dataset validation (`npm run validate:dataset`)
6. Expo project validation (`npm run validate:project`)
7. Android EAS build (preview APK, hanya pada push ke `main`)

Alur kerja ini **tidak memerlukan VPS** untuk menjalankan aplikasi.

## 📂 Struktur Proyek

```
kanji-n5/
├── app/                      # Expo Router screens (file-based routing)
│   ├── _layout.tsx           # Root layout (providers, stack)
│   ├── index.tsx             # Splash → onboarding/home redirect
│   ├── onboarding.tsx
│   ├── home.tsx
│   ├── kanji/
│   │   ├── index.tsx         # Library
│   │   └── [id].tsx          # Detail
│   ├── flashcards/index.tsx
│   ├── daily.tsx
│   ├── quiz/
│   │   ├── index.tsx         # Mode selector
│   │   ├── play.tsx          # Quiz play
│   │   └── review.tsx        # Review mistakes
│   ├── writing/index.tsx
│   ├── favorites.tsx
│   ├── progress.tsx
│   ├── settings.tsx
│   └── about.tsx
├── components/
│   ├── ui/                   # Card, ThemedText, PressableCard, Header, Stat
│   ├── kanji/                # KanjiCell, StrokeOrderView
│   ├── cards/                # Flashcard (Reanimated flip)
│   └── quiz/                 # QuizCard
├── context/
│   └── ProgressContext.tsx   # AsyncStorage-backed progress
├── hooks/
│   ├── useKanjiData.ts
│   ├── useQuiz.ts
│   ├── useThemeColor.ts
│   └── useHaptics.ts
├── constants/
│   └── theme.ts              # Design system
├── data/
│   └── kanji.ts              # Curated N5 dataset (99 entries)
├── scripts/
│   ├── validate-dataset.ts   # CI dataset validation
│   └── validate-project.ts   # CI project validation
├── types/
│   └── index.ts              # Domain types
├── __tests__/                # Unit tests
├── .github/workflows/        # CI/CD
├── app.config.ts             # Expo config (package: com.sigmagam.kanjin5)
├── eas.json                  # EAS build profiles
├── package.json
└── tsconfig.json
```

## 🧪 Testing

```bash
npm test                    # Unit tests
npm run validate:dataset   # Dataset integrity
npm run validate:project   # Project structure
npm run typecheck           # TypeScript
npm run lint               # ESLint
```

## 📋 Detail Teknis

| Item | Nilai |
|---|---|
| Package name | `com.sigmagam.kanjin5` |
| Min Android SDK | Expo SDK 51 default |
| Router | Expo Router (file-based) |
| State | React Context + AsyncStorage |
| Animasi | react-native-reanimated |
| SVG | react-native-svg |
| Bahasa UI | Indonesia |

## ⚠️ Keterbatasan

- Aset gambar (ikon, splash) saat ini adalah placeholder solid — ganti dengan aset desain final sebelum rilis produksi.
- 83 dari 99 kanji menggunakan fallback hitungan goresan (tanpa animasi SVG) — dapat diperluas dengan mentranskripsi lebih banyak path KANJIVG.
- Aplikasi ditargetkan untuk Android; build iOS tersedia jika dikonfigurasi.
- Tidak ada sinkronisasi awan (sesuai desain offline-first).

## 📄 Lisensi

MIT © sigmagam
