/**
 * Flashcard — tap-to-flip, swipe-navigable kanji card.
 * Uses react-native-reanimated for smooth 3D flip.
 */

import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '../ui/ThemedText';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { useHaptics } from '../../hooks/useHaptics';
import type { Kanji } from '../../types';

interface Props {
  kanji: Kanji;
  mastered?: boolean;
  favorite?: boolean;
  onToggleFavorite?: () => void;
  onToggleMastered?: () => void;
}

export function Flashcard({ kanji, mastered, favorite, onToggleFavorite, onToggleMastered }: Props) {
  const [flipped, setFlipped] = useState(false);
  const rotation = useSharedValue(0);
  const haptic = useHaptics();

  const flip = () => {
    haptic('light');
    rotation.value = withTiming(flipped ? 0 : 180, {
      duration: 350,
      easing: Easing.inOut(Easing.ease),
    });
    setFlipped((f) => !f);
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${rotation.value}deg` }],
    opacity: interpolate(rotation.value, [0, 90, 180], [1, 0, 0]),
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${rotation.value + 180}deg` }],
    opacity: interpolate(rotation.value, [0, 90, 180], [0, 0, 1]),
  }));

  return (
    <View style={styles.scene}>
      {/* FRONT — kanji character */}
      <Animated.View style={[styles.face, styles.front, frontStyle]}>
        <Pressable style={styles.faceContent} onPress={flip}>
          <ThemedText variant="kanji" style={styles.char}>{kanji.character}</ThemedText>
          <ThemedText variant="caption" inkSoft style={styles.hint}>Ketuk untuk membalik</ThemedText>
        </Pressable>
        <View style={styles.actions}>
          <Pressable style={[styles.actionBtn, favorite && styles.actionActive]} onPress={onToggleFavorite}>
            <ThemedText variant="caption" inverted={favorite}>{favorite ? '★' : '☆'} Favorit</ThemedText>
          </Pressable>
          <Pressable style={[styles.actionBtn, mastered && styles.actionMatcha]} onPress={onToggleMastered}>
            <ThemedText variant="caption" inverted={mastered}>{mastered ? '✓' : '○'} Kuasai</ThemedText>
          </Pressable>
        </View>
      </Animated.View>

      {/* BACK — details */}
      <Animated.View style={[styles.face, styles.back, backStyle]}>
        <Pressable style={styles.faceContent} onPress={flip}>
          <ThemedText variant="heading">{kanji.meanings.join(', ')}</ThemedText>
          <View style={styles.readingRow}>
            <View style={styles.readingBlock}>
              <ThemedText variant="caption" inkSoft>Onyomi</ThemedText>
              <ThemedText variant="reading">{kanji.onyomi.join(', ') || '—'}</ThemedText>
            </View>
            <View style={styles.readingBlock}>
              <ThemedText variant="caption" inkSoft>Kunyomi</ThemedText>
              <ThemedText variant="reading">{kanji.kunyomi.join(', ') || '—'}</ThemedText>
            </View>
          </View>
          <View style={styles.meta}>
            <ThemedText variant="caption" inkSoft>{kanji.strokeCount} goresan · {kanji.category}</ThemedText>
          </View>
          <View style={styles.examples}>
            {kanji.examples.slice(0, 3).map((ex, i) => (
              <View key={i} style={styles.exampleRow}>
                <ThemedText variant="subheading">{ex.word}</ThemedText>
                <ThemedText variant="caption" inkSoft>{ex.reading} — {ex.meaning}</ThemedText>
              </View>
            ))}
          </View>
          {kanji.mnemonic ? (
            <View style={styles.mnemonic}>
              <ThemedText variant="caption" inkSoft>💡 {kanji.mnemonic}</ThemedText>
            </View>
          ) : null}
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  front: { backgroundColor: colors.surface },
  back: { backgroundColor: colors.surface, transform: [{ rotateY: '180deg' }] },
  faceContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  char: { color: colors.ink },
  hint: { marginTop: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  actionBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  actionActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  actionMatcha: { backgroundColor: colors.matcha, borderColor: colors.matcha },
  readingRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  readingBlock: { flex: 1, alignItems: 'center' },
  meta: { marginTop: spacing.sm },
  examples: { marginTop: spacing.md, gap: spacing.sm, width: '100%' },
  exampleRow: { alignItems: 'center', gap: 2 },
  mnemonic: { marginTop: spacing.md, paddingHorizontal: spacing.lg },
});
