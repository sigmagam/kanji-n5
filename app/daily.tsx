/**
 * Daily learning — today's batch toward the daily goal.
 */
import { useMemo } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ThemedText, Header, Card, Stat } from '../components/ui';
import { KanjiCell } from '../components/kanji';
import { colors, spacing, radius } from '../constants/theme';
import { useKanjiData } from '../hooks/useKanjiData';
import { useProgress } from '../context/ProgressContext';

export default function Daily() {
  const kanji = useKanjiData();
  const { progress } = useProgress();

  // Today's batch: next unlearned kanji up to daily goal, plus review.
  const batch = useMemo(() => {
    const unlearned = kanji.filter((k) => !progress.mastered.includes(k.id));
    const target = unlearned.slice(0, progress.dailyGoal);
    if (target.length < progress.dailyGoal) {
      // pad with reviewed mastered kanji
      const review = kanji.filter((k) => progress.mastered.includes(k.id)).slice(0, progress.dailyGoal - target.length);
      return [...target, ...review];
    }
    return target;
  }, [kanji, progress.mastered, progress.dailyGoal]);

  const goalPct = Math.min(100, Math.round((progress.studiedToday.length / progress.dailyGoal) * 100));
  const goalDone = progress.studiedToday.length >= progress.dailyGoal;

  return (
    <View style={styles.wrap}>
      <Header title="Belajar Harian" subtitle={`Tujuan: ${progress.dailyGoal} kanji`} />
      <Card style={styles.hero}>
        <View style={styles.heroTop}>
          <ThemedText variant="caption" inkSoft>Progress hari ini</ThemedText>
          <ThemedText variant="heading">{progress.studiedToday.length} / {progress.dailyGoal}</ThemedText>
        </View>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${goalPct}%` }]} />
        </View>
        {goalDone ? (
          <ThemedText variant="caption" style={styles.doneText}>🎉 Tujuan harian tercapai!</ThemedText>
        ) : (
          <ThemedText variant="caption" inkSoft>Kartu tersisa: {Math.max(0, progress.dailyGoal - progress.studiedToday.length)}</ThemedText>
        )}
      </Card>

      <View style={styles.statsRow}>
        <Stat label="Streak" value={`${progress.streak} hari`} accent />
        <Stat label="Dikuasai" value={progress.mastered.length} />
        <Stat label="Favorit" value={progress.favorites.length} />
      </View>

      <ThemedText variant="subheading" style={styles.sectionTitle}>Batch Hari Ini</ThemedText>
      <FlatList
        data={batch}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<ThemedText variant="caption" inkSoft style={styles.empty}>Semua kanji telah dikuasai! 🎉</ThemedText>}
        renderItem={({ item }) => (
          <KanjiCell
            kanji={item}
            mastered={progress.mastered.includes(item.id)}
            favorite={progress.favorites.includes(item.id)}
            onPress={() => router.push(`/kanji/${item.id}`)}
          />
        )}
      />

      <Pressable style={styles.startBtn} onPress={() => router.push('/flashcards')}>
        <ThemedText variant="subheading" inverted>Mulai Sesi Flashcard</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },
  hero: { marginBottom: spacing.md },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  bar: { height: 8, backgroundColor: colors.surfaceAlt, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.matcha, borderRadius: 4 },
  doneText: { marginTop: spacing.sm, color: colors.matcha },
  statsRow: { flexDirection: 'row', marginBottom: spacing.md },
  sectionTitle: { marginBottom: spacing.sm },
  list: { paddingBottom: spacing.xxl, gap: spacing.sm },
  row: { gap: spacing.sm, justifyContent: 'space-between' },
  empty: { textAlign: 'center', marginTop: spacing.xl },
  startBtn: {
    backgroundColor: colors.accent, paddingVertical: spacing.md,
    borderRadius: radius.pill, alignItems: 'center', marginTop: spacing.md,
  },
});
