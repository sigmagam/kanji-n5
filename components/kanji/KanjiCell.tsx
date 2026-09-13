/**
 * KanjiCell — compact kanji display cell (library list / grid).
 */
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { PressableCard } from '../ui/PressableCard';
import { colors, spacing } from '../../constants/theme';
import type { Kanji } from '../../types';

interface Props {
  kanji: Kanji;
  onPress: () => void;
  mastered?: boolean;
  favorite?: boolean;
}

export function KanjiCell({ kanji, onPress, mastered, favorite }: Props) {
  return (
    <PressableCard onPress={onPress} style={styles.cell}>
      <View style={styles.topRow}>
        <ThemedText variant="kanjiSmall" style={styles.char}>{kanji.character}</ThemedText>
        <View style={styles.badges}>
          {mastered ? <View style={[styles.dot, styles.dotMatcha]} /> : null}
          {favorite ? <View style={[styles.dot, styles.dotAccent]} /> : null}
        </View>
      </View>
      <ThemedText variant="caption" inkSoft numberOfLines={1} style={styles.meaning}>
        {kanji.meanings.join(', ')}
      </ThemedText>
      <View style={styles.metaRow}>
        <ThemedText variant="caption" inkSoft>{kanji.strokeCount} goresan</ThemedText>
        <ThemedText variant="caption" inkSoft>· {kanji.category}</ThemedText>
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  cell: { width: 148 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  char: { color: colors.ink },
  badges: { flexDirection: 'row', gap: 4, marginTop: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotMatcha: { backgroundColor: colors.matcha },
  dotAccent: { backgroundColor: colors.accent },
  meaning: { marginTop: spacing.xs },
  metaRow: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xs },
});
