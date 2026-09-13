/**
 * Quiz play — presents questions, scores, stores result.
 */
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '../../components/ui';
import { QuizCard } from '../../components/quiz';
import { colors, spacing, radius } from '../../constants/theme';
import { useQuiz } from '../../hooks/useQuiz';
import { useProgress } from '../../context/ProgressContext';
import type { QuizMode } from '../../types';

const QUIZ_COUNT = 10;

export default function QuizPlay() {
  const params = useLocalSearchParams<{ mode: string }>();
  const mode = (params.mode as QuizMode) || 'meaning-to-kanji';
  const { questions } = useQuiz(mode, QUIZ_COUNT);
  const { recordQuiz, recordReview } = useProgress();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[index];
  const isAnswered = selected !== null;
  const isCorrect = isAnswered && selected === q?.answer;

  const handleSelect = (opt: string) => {
    if (isAnswered || !q) return;
    setSelected(opt);
    const correct = opt === q.answer;
    if (correct) setScore((s) => s + 1);
    else setWrong((w) => [...w, q.kanjiId]);
    recordReview({ kanjiId: q.kanjiId, correct });
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      recordQuiz({ mode, score, total: questions.length, wrong });
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <View style={styles.done}>
        <ThemedText variant="kanjiSmall" style={styles.doneChar}>{pct >= 70 ? '✓' : '!'}</ThemedText>
        <ThemedText variant="title">Kuis Selesai</ThemedText>
        <ThemedText variant="heading" style={styles.scoreText}>{score} / {questions.length}</ThemedText>
        <ThemedText variant="body" inkSoft>{pct}% benar</ThemedText>
        <View style={styles.doneActions}>
          <Pressable style={styles.btnGhost} onPress={() => router.replace('/quiz')}>
            <ThemedText variant="subheading" inkSoft>Menu Kuis</ThemedText>
          </Pressable>
          <Pressable style={styles.btn} onPress={() => { setIndex(0); setSelected(null); setScore(0); setWrong([]); setDone(false); }}>
            <ThemedText variant="subheading" inverted>Coba Lagi</ThemedText>
          </Pressable>
        </View>
        {wrong.length > 0 ? (
          <Pressable style={styles.reviewBtn} onPress={() => router.push(`/quiz/review?ids=${wrong.join(',')}`)}>
            <ThemedText variant="caption" inkSoft>Tinjau kesalahan ({wrong.length}) →</ThemedText>
          </Pressable>
        ) : null}
      </View>
    );
  }

  if (!q) {
    return <View style={styles.done}><ThemedText variant="body" inkSoft>Tidak ada soal.</ThemedText></View>;
  }

  return (
    <View style={styles.wrap}>
      <QuizCard
        question={q}
        index={index}
        total={questions.length}
        selected={selected}
        onSelect={handleSelect}
      />
      <View style={styles.bottom}>
        {isAnswered ? (
          <Pressable style={[styles.btn, isCorrect ? styles.btnCorrect : styles.btnWrong]} onPress={next}>
            <ThemedText variant="subheading" inverted>{isCorrect ? 'Benar! →' : 'Jawaban: ' + q.answer + ' →'}</ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: spacing.md, justifyContent: 'space-between' },
  bottom: { marginTop: spacing.md },
  btn: { paddingVertical: spacing.md, borderRadius: radius.pill, alignItems: 'center', backgroundColor: colors.accent },
  btnCorrect: { backgroundColor: colors.matcha },
  btnWrong: { backgroundColor: colors.danger },
  btnGhost: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  done: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  doneChar: { color: colors.matcha, marginBottom: spacing.md },
  scoreText: { marginVertical: spacing.sm },
  doneActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  reviewBtn: { marginTop: spacing.xl },
});
