/**
 * Flashcard learning — swipe through kanji, flip, favorite, mark mastered.
 */
import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText, Card } from '../../components/ui';
import { Flashcard } from '../../components/cards';
import { colors, spacing, radius } from '../../constants/theme';
import { useKanjiData } from '../../hooks/useKanjiData';
import { useProgress } from '../../context/ProgressContext';

export default function Flashcards() {
  const params = useLocalSearchParams<{ focus?: string }>();
  const allKanji = useKanjiData();
  const { isMastered, isFavorite, toggleMastered, toggleFavorite, recordStudy } = useProgress();

  const deck = useMemo(() => {
    if (params.focus) {
      const idx = allKanji.findIndex((k) => k.id === params.focus);
      if (idx >= 0) {
        return [allKanji[idx], ...allKanji.slice(idx + 1), ...allKanji.slice(0, idx)];
      }
    }
    return allKanji;
  }, [allKanji, params.focus]);

  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = deck[index];

  const next = useCallback(() => {
    if (current) recordStudy(current.id);
    if (index + 1 >= deck.length) {
      setCompleted(true);
    } else {
      setIndex((i) => i + 1);
    }
  }, [current, index, deck.length, recordStudy]);

  const prev = useCallback(() => {
    if (index > 0) setIndex((i) => i - 1);
  }, [index]);

  const repeat = useCallback(() => {
    setIndex(0);
    setCompleted(false);
  }, []);

  if (completed) {
    return (
      <View style={styles.done}>
        <ThemedText variant="kanjiSmall" style={styles.doneChar}>✓</ThemedText>
        <ThemedText variant="heading">Sesi selesai!</ThemedText>
        <ThemedText variant="body" inkSoft>Anda meninjau {deck.length} kanji.</ThemedText>
        <Pressable style={styles.btn} onPress={repeat}>
          <ThemedText variant="subheading" inverted>Ulangi Sesi</ThemedText>
        </Pressable>
      </View>
    );
  }

  if (!current) {
    return <View style={styles.done}><ThemedText variant="body" inkSoft>Tidak ada kartu.</ThemedText></View>;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <ThemedText variant="caption" inkSoft>Kartu {index + 1} / {deck.length}</ThemedText>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${((index + 1) / deck.length) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.cardWrap}>
        <Flashcard
          kanji={current}
          mastered={isMastered(current.id)}
          favorite={isFavorite(current.id)}
          onToggleFavorite={() => toggleFavorite(current.id)}
          onToggleMastered={() => toggleMastered(current.id)}
        />
      </View>

      <View style={styles.nav}>
        <Pressable style={[styles.navBtn, index === 0 && styles.navBtnDisabled]} onPress={prev} disabled={index === 0}>
          <ThemedText variant="subheading" inkSoft={index === 0}>← Sebelumnya</ThemedText>
        </Pressable>
        <Pressable style={styles.navBtnPrimary} onPress={next}>
          <ThemedText variant="subheading" inverted>{index + 1 >= deck.length ? 'Selesai' : 'Berikutnya →'}</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: spacing.md, justifyContent: 'space-between' },
  top: { marginBottom: spacing.sm },
  bar: { height: 4, backgroundColor: colors.surfaceAlt, borderRadius: 2, marginTop: spacing.xs, overflow: 'hidden' },
  barFill: { height: 4, backgroundColor: colors.matcha, borderRadius: 2 },
  cardWrap: { flex: 1, marginVertical: spacing.md },
  nav: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  navBtn: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  navBtnDisabled: { opacity: 0.5 },
  navBtnPrimary: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.pill, backgroundColor: colors.accent, alignItems: 'center' },
  done: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  doneChar: { color: colors.matcha, marginBottom: spacing.md },
  btn: { marginTop: spacing.xl, backgroundColor: colors.accent, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.pill },
});
