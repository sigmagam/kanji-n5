/**
 * Onboarding — introduces the app, sets daily goal, marks complete.
 */
import { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText, Card } from '../components/ui';
import { colors, spacing, radius } from '../constants/theme';
import { useProgress } from '../context/ProgressContext';
import { useKanjiData } from '../hooks/useKanjiData';

export default function Onboarding() {
  const { completeOnboarding, setDailyGoal, progress } = useProgress();
  const kanji = useKanjiData();
  const [goal, setGoal] = useState(progress.dailyGoal || 5);
  const [step, setStep] = useState(0);

  const finish = () => {
    setDailyGoal(goal);
    completeOnboarding();
    router.replace('/home');
  };

  const slides = [
    {
      title: 'Selamat Datang di KANJI N5',
      body: `Pelajari ${kanji.length} kanji tingkat pemula dengan kartu flash, kuis, dan latihan menulis. Semua berjalan secara luring — tanpa internet.`,
    },
    {
      title: 'Belajar Setiap Hari',
      body: 'Tetapkan tujuan harian. Pertahankan rentetan (streak) belajar dengan membuka kartu atau kuis minimal sekali sehari.',
    },
    {
      title: 'Tingkatkan dengan Kuis',
      body: 'Empat mode kuis: Makna→Kanji, Kanji→Makna, Bacaan→Kanji, dan Kata→Bacaan. Tinjau jawaban salah dan coba lagi.',
    },
  ];

  const isLast = step === slides.length - 1;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.progress}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.logo}>
        <ThemedText variant="kanjiSmall" style={styles.logoChar}>漢</ThemedText>
      </View>

      <ThemedText variant="title" style={styles.title}>{slides[step].title}</ThemedText>
      <ThemedText variant="body" inkSoft style={styles.body}>{slides[step].body}</ThemedText>

      {isLast ? (
        <Card style={styles.goalCard}>
          <ThemedText variant="subheading">Tujuan harian: {goal} kanji</ThemedText>
          <View style={styles.goalRow}>
            {[3, 5, 10, 15].map((n) => (
              <Pressable
                key={n}
                style={[styles.goalBtn, goal === n && styles.goalBtnActive]}
                onPress={() => setGoal(n)}
              >
                <ThemedText variant="caption" inverted={goal === n}>{n}</ThemedText>
              </Pressable>
            ))}
          </View>
          <ThemedText variant="caption" inkSoft style={styles.goalNote}>
            Anda dapat mengubah ini nanti di Pengaturan.
          </ThemedText>
        </Card>
      ) : null}

      <View style={styles.actions}>
        {step > 0 ? (
          <Pressable style={styles.btnGhost} onPress={() => setStep((s) => s - 1)}>
            <ThemedText variant="subheading" inkSoft>Kembali</ThemedText>
          </Pressable>
        ) : null}
        <Pressable style={styles.btn} onPress={() => (isLast ? finish() : setStep((s) => s + 1))}>
          <ThemedText variant="subheading" inverted>{isLast ? 'Mulai Belajar' : 'Lanjut'}</ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, alignItems: 'center', paddingTop: spacing.xxl },
  progress: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.accent, width: 24 },
  logo: {
    width: 96, height: 96, borderRadius: 24, borderWidth: 2, borderColor: colors.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  logoChar: { color: colors.accent },
  title: { textAlign: 'center', marginBottom: spacing.md },
  body: { textAlign: 'center', marginBottom: spacing.xl },
  goalCard: { width: '100%', marginBottom: spacing.xl },
  goalRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, justifyContent: 'center' },
  goalBtn: {
    width: 56, height: 56, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
  },
  goalBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  goalNote: { marginTop: spacing.md, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  btn: {
    backgroundColor: colors.accent, paddingVertical: spacing.md, paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
  },
  btnGhost: { paddingVertical: spacing.md, paddingHorizontal: spacing.md },
});
