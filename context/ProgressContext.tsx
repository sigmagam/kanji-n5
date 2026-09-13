/**
 * ProgressContext — local-first persistent state for KANJI N5.
 * Uses AsyncStorage. No cloud, no login, no network required.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProgress, QuizResult, ReviewHistoryEntry } from '../types';

const STORAGE_KEY = '@kanji_n5/progress_v1';

const defaultProgress: UserProgress = {
  mastered: [],
  favorites: [],
  streak: 0,
  lastStudyDate: null,
  dailyGoal: 5,
  studiedToday: [],
  todayBucket: null,
  quizResults: [],
  reviewHistory: [],
  onboardingComplete: false,
  language: 'id',
  hapticsEnabled: true,
};

interface ProgressContextValue {
  progress: UserProgress;
  ready: boolean;
  toggleFavorite: (kanjiId: string) => void;
  isFavorite: (kanjiId: string) => boolean;
  toggleMastered: (kanjiId: string) => void;
  isMastered: (kanjiId: string) => boolean;
  recordStudy: (kanjiId: string) => void;
  recordQuiz: (result: Omit<QuizResult, 'id' | 'timestamp'>) => void;
  recordReview: (entry: Omit<ReviewHistoryEntry, 'timestamp'>) => void;
  setDailyGoal: (n: number) => void;
  completeOnboarding: () => void;
  setLanguage: (lang: 'id' | 'en') => void;
  setHapticsEnabled: (enabled: boolean) => void;
  resetProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00').getTime();
  const db = new Date(b + 'T00:00:00').getTime();
  return Math.round((db - da) / 86400000);
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<UserProgress>;
          setProgress({ ...defaultProgress, ...parsed });
        }
      } catch (e) {
        console.warn('Failed to load progress:', e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next: UserProgress) => {
    setProgress(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist progress:', e);
    }
  }, []);

  const rollDay = useCallback((): UserProgress => {
    const today = todayISO();
    if (progress.todayBucket === today) return progress;
    // Compute streak.
    let streak = 1;
    if (progress.lastStudyDate) {
      const diff = daysBetween(progress.lastStudyDate, today);
      if (diff === 1) streak = progress.streak + 1;
      else if (diff === 0) streak = progress.streak || 1;
      else streak = 1;
    }
    return {
      ...progress,
      todayBucket: today,
      studiedToday: [],
      streak,
    };
  }, [progress]);

  const toggleFavorite = useCallback((kanjiId: string) => {
    const exists = progress.favorites.includes(kanjiId);
    const next = {
      ...progress,
      favorites: exists ? progress.favorites.filter((id) => id !== kanjiId) : [...progress.favorites, kanjiId],
    };
    persist(next);
  }, [progress, persist]);

  const isFavorite = useCallback((kanjiId: string) => progress.favorites.includes(kanjiId), [progress.favorites]);

  const toggleMastered = useCallback((kanjiId: string) => {
    const exists = progress.mastered.includes(kanjiId);
    const next = {
      ...progress,
      mastered: exists ? progress.mastered.filter((id) => id !== kanjiId) : [...progress.mastered, kanjiId],
    };
    persist(next);
  }, [progress, persist]);

  const isMastered = useCallback((kanjiId: string) => progress.mastered.includes(kanjiId), [progress.mastered]);

  const recordStudy = useCallback((kanjiId: string) => {
    const rolled = rollDay();
    const studiedToday = rolled.studiedToday.includes(kanjiId)
      ? rolled.studiedToday
      : [...rolled.studiedToday, kanjiId];
    const next: UserProgress = {
      ...rolled,
      studiedToday,
      lastStudyDate: todayISO(),
      streak: rolled.streak || 1,
    };
    persist(next);
  }, [rollDay, persist]);

  const recordQuiz = useCallback((result: Omit<QuizResult, 'id' | 'timestamp'>) => {
    const full: QuizResult = {
      ...result,
      id: `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    };
    const next = {
      ...progress,
      quizResults: [full, ...progress.quizResults].slice(0, 50),
    };
    persist(next);
  }, [progress, persist]);

  const recordReview = useCallback((entry: Omit<ReviewHistoryEntry, 'timestamp'>) => {
    const full: ReviewHistoryEntry = { ...entry, timestamp: Date.now() };
    const next = {
      ...progress,
      reviewHistory: [full, ...progress.reviewHistory].slice(0, 200),
    };
    persist(next);
  }, [progress, persist]);

  const setDailyGoal = useCallback((n: number) => {
    persist({ ...progress, dailyGoal: Math.max(1, Math.min(50, n)) });
  }, [progress, persist]);

  const completeOnboarding = useCallback(() => {
    persist({ ...progress, onboardingComplete: true });
  }, [progress, persist]);

  const setLanguage = useCallback((lang: 'id' | 'en') => {
    persist({ ...progress, language: lang });
  }, [progress, persist]);

  const setHapticsEnabled = useCallback((enabled: boolean) => {
    persist({ ...progress, hapticsEnabled: enabled });
  }, [progress, persist]);

  const resetProgress = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setProgress(defaultProgress);
  }, []);

  const value: ProgressContextValue = {
    progress,
    ready,
    toggleFavorite,
    isFavorite,
    toggleMastered,
    isMastered,
    recordStudy,
    recordQuiz,
    recordReview,
    setDailyGoal,
    completeOnboarding,
    setLanguage,
    setHapticsEnabled,
    resetProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
