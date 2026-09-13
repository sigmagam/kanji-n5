/**
 * QuizCard — displays a question with four options.
 */
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { colors, radius, spacing } from '../../constants/theme';
import type { QuizQuestion } from '../../types';

interface Props {
  question: QuizQuestion;
  index: number;
  total: number;
  selected: string | null;
  onSelect: (option: string) => void;
}

const optionLabels = ['A', 'B', 'C', 'D'];

export function QuizCard({ question, index, total, selected, onSelect }: Props) {
  const modeLabels: Record<string, string> = {
    'meaning-to-kanji': 'Makna → Kanji',
    'kanji-to-meaning': 'Kanji → Makna',
    'reading-to-kanji': 'Bacaan → Kanji',
    'word-to-reading': 'Kata → Bacaan',
  };

  return (
    <View>
      <View style={styles.meta}>
        <ThemedText variant="caption" inkSoft>{modeLabels[question.mode]}</ThemedText>
        <ThemedText variant="caption" inkSoft>{index + 1} / {total}</ThemedText>
      </View>
      <View style={styles.promptBox}>
        <ThemedText variant="kanjiSmall" style={styles.prompt}>{question.prompt}</ThemedText>
      </View>
      <View style={styles.options}>
        {question.options.map((opt, i) => {
          const isSelected = selected === opt;
          return (
            <Pressable
              key={i}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onSelect(opt)}
            >
              <ThemedText variant="caption" inkSoft={!(isSelected)} inverted={isSelected}>
                {optionLabels[i]}
              </ThemedText>
              <ThemedText variant="subheading" inverted={isSelected}>{opt}</ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  promptBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  prompt: { color: colors.ink },
  options: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  optionSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
