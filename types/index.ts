/**
 * Core domain types for KANJI N5.
 * These describe the on-device kanji curriculum and user progress.
 */

/** A single example vocabulary word for a kanji. */
export interface ExampleWord {
  /** Japanese word (kanji + okurigana). */
  word: string;
  /** Hiragana reading of the word. */
  reading: string;
  /** Indonesian translation of the word. */
  meaning: string;
}

/** A single SVG path in a stroke-order diagram. */
export interface StrokePath {
  /** SVG path data (d attribute). */
  d: string;
  /** 1-based stroke number this path represents. */
  order: number;
}

/** A kanji entry in the local curriculum. */
export interface Kanji {
  /** Stable unique id, e.g. "n5-001". */
  id: string;
  /** The kanji character itself. */
  character: string;
  /** Indonesian meanings (one or more). */
  meanings: string[];
  /** Onyomi (Sino-Japanese reading) in katakana. */
  onyomi: string[];
  /** Kunyomi (native Japanese reading) in hiragana. */
  kunyomi: string[];
  /** Verified stroke count. */
  strokeCount: number;
  /** Category used for grouping (e.g. Numbers, Body). */
  category: string;
  /** Example vocabulary words using this kanji. */
  examples: ExampleWord[];
  /** Mnemonic to aid memorisation (Indonesian). */
  mnemonic: string;
  /** JLPT level tag this app targets. */
  level: 'N5';
  /** SVG stroke-order paths, when verified. May be empty with fallbackType. */
  strokePaths?: StrokePath[];
  /** How stroke order is represented. */
  strokeOrderSource: 'verified-svg' | 'fallback-count';
  /** Optional reference notes for content verification. */
  notes?: string;
}

/** Quiz question types supported by the app. */
export type QuizMode =
  | 'meaning-to-kanji'
  | 'kanji-to-meaning'
  | 'reading-to-kanji'
  | 'word-to-reading';

/** A single quiz question. */
export interface QuizQuestion {
  /** The id of the source kanji. */
  kanjiId: string;
  /** What is shown to the user as the prompt. */
  prompt: string;
  /** The correct answer display string. */
  answer: string;
  /** Four answer options (correct one included). */
  options: string[];
  /** The quiz mode this question belongs to. */
  mode: QuizMode;
}

/** Result of a single quiz attempt. */
export interface QuizResult {
  id: string;
  mode: QuizMode;
  score: number;
  total: number;
  timestamp: number;
  /** Kanji ids that were answered incorrectly. */
  wrong: string[];
}

/** A single item in the user's learning review history. */
export interface ReviewHistoryEntry {
  kanjiId: string;
  timestamp: number;
  correct: boolean;
}

/** Persisted user progress (all local, no cloud). */
export interface UserProgress {
  /** Kanji ids marked as mastered. */
  mastered: string[];
  /** Kanji ids marked as favorites. */
  favorites: string[];
  /** Current daily learning streak (consecutive days). */
  streak: number;
  /** ISO date string of the last day the user studied. */
  lastStudyDate: string | null;
  /** Daily goal (number of kanji to learn per day). */
  dailyGoal: number;
  /** Kanji ids studied today (reset each day). */
  studiedToday: string[];
  /** ISO date string for the current day bucket. */
  todayBucket: string | null;
  /** Quiz results history (most recent first). */
  quizResults: QuizResult[];
  /** Review history entries. */
  reviewHistory: ReviewHistoryEntry[];
  /** Whether onboarding has been completed. */
  onboardingComplete: boolean;
  /** App language code. */
  language: 'id' | 'en';
  /** Whether sound/haptics are enabled. */
  hapticsEnabled: boolean;
}
