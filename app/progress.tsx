/**
 * Progress dashboard — stats, streak, quiz history, mastery by category.
 */
import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText, Header, Card, Stat } from '../components/ui';
import { colors, spacing, radius } from '../constants/theme';
import { useKanjiData, useKanjiByCategory } from '../hooks/useKanjiData';
import { useProgress } from '../context/ProgressContext';

export default function Progress() {
  const kanji = useKanjiData();
  const byCat = useKanjiByCategory();
  const { progress } = useProgress();

  const masteredPct = Math.round((progress.mastered.length / kanji.length) * 100);
  const favPct = Math.round((progress.favorites.length / kanji.length) * 100);
  const recentQuizzes = progress.quizResults.slice(0, 5);

  const categoryStats = useMemo(() => {
    return Object.entries(byCat).map(([cat, items]) => ({
      cat,
      total: items.length,
      mastered: items.filter((k) => progress.mastered.includes(k.id)).length,
    }));
  }, [byCat, progress.mastered]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Header title="Progres" subtitle="Statistik belajar" />

      <View style={styles.statsRow}>
        <Stat label="Dikuasai" value={`${progress.mastered.length}/${kanji.length}`} accent />
        <Stat label="Streak" value={`${progress.streak} hari`} />
        <Stat label="Favorit" value={progress.favorites.length} />
      </View>

      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Penguasaan keseluruhan</ThemedText>
        <View style={styles.barRow}>
          <ThemedText variant="caption" inkSoft>Dikuasai</ThemedText>
          <ThemedText variant="caption" inkSoft>{masteredPct}%</ThemedText>
        </View>
        <View style={styles.bar}><View style={[styles.barFill, { width: `${masteredPct}%`, backgroundColor: colors.matcha }]} /></View>
        <View style={styles.barRow}>
          <ThemedText variant="caption" inkSoft>Favorit</ThemedText>
          <ThemedText variant="caption" inkSoft>{favPct}%</ThemedText>
        </View>
        <View style={styles.bar}><View style={[styles.barFill, { width: `${favPct}%`, backgroundColor: colors.accent }]} /></View>
      </Card>

      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Berdasarkan Kategori</ThemedText>
        {categoryStats.map((c) => {
          const pct = c.total > 0 ? Math.round((c.mastered / c.total) * 100) : 0;
          return (
            <View key={c.cat} style={styles.catRow}>
              <View style={styles.catLabel}>
                <ThemedText variant="body">{c.cat}</ThemedText>
                <ThemedText variant="caption" inkSoft>{c.mastered}/{c.total}</ThemedText>
              </View>
              <View style={styles.catBar}><View style={[styles.barFill, { width: `${pct}%`, backgroundColor: colors.matcha }]} /></View>
            </View>
          );
        })}
      </Card>

      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Riwayat Kuis Terbaru</ThemedText>
        {recentQuizzes.length === 0 ? (
          <ThemedText variant="caption" inkSoft>Belum ada kuis. Mulai dari menu Kuis!</ThemedText>
        ) : (
          recentQuizzes.map((r) => {
            const pct = Math.round((r.score / r.total) * 100);
            return (
              <View key={r.id} style={styles.quizRow}>
                <ThemedText variant="body">{r.mode}</ThemedText>
                <ThemedText variant="caption" inkSoft>{r.score}/{r.total} · {pct}%</ThemedText>
              </View>
            );
          })
        )}
      </Card>

      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Riwayat Tinjauan</ThemedText>
        <ThemedText variant="caption" inkSoft>{progress.reviewHistory.length} entri tersimpan</ThemedText>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  statsRow: { flexDirection: 'row', marginBottom: spacing.md },
  section: { marginBottom: spacing.md },
  sectionTitle: { marginBottom: spacing.sm },
  barRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm, marginBottom: 4 },
  bar: { height: 8, backgroundColor: colors.surfaceAlt, borderRadius: 4, overflow: 'hidden', marginBottom: spacing.sm },
  barFill: { height: 8, borderRadius: 4 },
  catRow: { marginBottom: spacing.sm },
  catLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  catBar: { height: 6, backgroundColor: colors.surfaceAlt, borderRadius: 3, overflow: 'hidden' },
  quizRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
});
