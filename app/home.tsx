/**
 * Home dashboard — primary hub. Quick stats + entry points to all features.
 */
import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ThemedText, Header, Stat, Card } from '../components/ui';
import { colors, spacing, radius } from '../constants/theme';
import { useProgress } from '../context/ProgressContext';
import { useKanjiData } from '../hooks/useKanjiData';

const tiles = [
  { label: 'Pustaka', desc: 'Semua kanji', icon: '本', href: '/kanji' },
  { label: 'Flashcard', desc: 'Pelajari kartu', icon: '刷', href: '/flashcards' },
  { label: 'Harian', desc: 'Tujuan harian', icon: '日', href: '/daily' },
  { label: 'Kuis', desc: 'Uji dirimu', icon: '問', href: '/quiz' },
  { label: 'Menulis', desc: 'Urutan goresan', icon: '筆', href: '/writing' },
  { label: 'Favorit', desc: 'Kanji tersimpan', icon: '★', href: '/favorites' },
  { label: 'Progres', desc: 'Statistik', icon: '進', href: '/progress' },
  { label: 'Pengaturan', desc: 'Preferensi', icon: '設', href: '/settings' },
] as const;

export default function Home() {
  const { progress } = useProgress();
  const kanji = useKanjiData();
  const learnedPct = Math.round((progress.mastered.length / kanji.length) * 100);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Header title="KANJI N5" subtitle="Selamat belajar" />
      <Card style={styles.hero}>
        <ThemedText variant="caption" inkSoft>Rentetan belajar</ThemedText>
        <ThemedText variant="title" style={styles.streak}>{progress.streak} hari 🔥</ThemedText>
        <View style={styles.statsRow}>
          <Stat label="Hari ini" value={`${progress.studiedToday.length}/${progress.dailyGoal}`} />
          <Stat label="Dikuasai" value={progress.mastered.length} accent />
          <Stat label="Total" value={kanji.length} />
        </View>
      </Card>

      <View style={styles.tiles}>
        {tiles.map((t) => (
          <Pressable
            key={t.label}
            style={({ pressed }) => [styles.tile, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => router.push(t.href)}
          >
            <ThemedText variant="kanjiSmall" style={styles.tileIcon}>{t.icon}</ThemedText>
            <ThemedText variant="subheading">{t.label}</ThemedText>
            <ThemedText variant="caption" inkSoft>{t.desc}</ThemedText>
          </Pressable>
        ))}
      </View>

      <Card style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <ThemedText variant="subheading">Progres keseluruhan</ThemedText>
          <ThemedText variant="caption" inkSoft>{learnedPct}%</ThemedText>
        </View>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${learnedPct}%` }]} />
        </View>
        <ThemedText variant="caption" inkSoft style={styles.progressNote}>
          {progress.mastered.length} dari {kanji.length} kanji dikuasai
        </ThemedText>
      </Card>

      <Pressable style={styles.aboutLink} onPress={() => router.push('/about')}>
        <ThemedText variant="caption" inkSoft>Tentang aplikasi →</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  hero: { marginBottom: spacing.md },
  streak: { marginVertical: spacing.xs },
  statsRow: { flexDirection: 'row', marginTop: spacing.sm },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  tile: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 2,
  },
  tileIcon: { color: colors.accent, marginBottom: spacing.xs },
  progressCard: { marginBottom: spacing.md },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  bar: { height: 8, backgroundColor: colors.surfaceAlt, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.matcha, borderRadius: 4 },
  progressNote: { marginTop: spacing.sm },
  aboutLink: { alignSelf: 'center', padding: spacing.md },
});
