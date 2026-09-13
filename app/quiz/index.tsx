/**
 * Quiz mode selector.
 */
import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText, Header } from '../../components/ui';
import { colors, spacing, radius } from '../../constants/theme';
import type { QuizMode } from '../../types';

const modes: { mode: QuizMode; title: string; desc: string }[] = [
  { mode: 'meaning-to-kanji', title: 'Makna → Kanji', desc: 'Tebak kanji dari makna' },
  { mode: 'kanji-to-meaning', title: 'Kanji → Makna', desc: 'Tebak makna dari kanji' },
  { mode: 'reading-to-kanji', title: 'Bacaan → Kanji', desc: 'Tebak kanji dari bacaan' },
  { mode: 'word-to-reading', title: 'Kata → Bacaan', desc: 'Tebak bacaan dari kata' },
];

export default function QuizHome() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Header title="Kuis" subtitle="Pilih mode" />
      <View style={styles.modes}>
        {modes.map((m) => (
          <Pressable
            key={m.mode}
            style={({ pressed }) => [styles.modeCard, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => router.push(`/quiz/play?mode=${m.mode}`)}
          >
            <ThemedText variant="heading">{m.title}</ThemedText>
            <ThemedText variant="caption" inkSoft>{m.desc}</ThemedText>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md },
  modes: { gap: spacing.md },
  modeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
});
