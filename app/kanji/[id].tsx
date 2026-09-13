/**
 * Kanji detail — full info for a single kanji with stroke order.
 */
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText, Card } from '../../components/ui';
import { StrokeOrderView } from '../../components/kanji';
import { colors, spacing, radius } from '../../constants/theme';
import { useKanjiById } from '../../hooks/useKanjiData';
import { useProgress } from '../../context/ProgressContext';

export default function KanjiDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const kanji = useKanjiById(id);
  const { isMastered, isFavorite, toggleMastered, toggleFavorite } = useProgress();

  if (!kanji) {
    return (
      <View style={styles.missing}>
        <ThemedText variant="body" inkSoft>Kanji tidak ditemukan.</ThemedText>
      </View>
    );
  }

  const mastered = isMastered(kanji.id);
  const favorite = isFavorite(kanji.id);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <ThemedText variant="kanji" style={styles.char}>{kanji.character}</ThemedText>
        <ThemedText variant="heading">{kanji.meanings.join(', ')}</ThemedText>
        <ThemedText variant="caption" inkSoft>{kanji.category} · {kanji.strokeCount} goresan · {kanji.level}</ThemedText>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.action, favorite && styles.actionAccent]}
          onPress={() => toggleFavorite(kanji.id)}
        >
          <ThemedText variant="subheading" inverted={favorite}>{favorite ? '★ Favorit' : '☆ Favorit'}</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.action, mastered && styles.actionMatcha]}
          onPress={() => toggleMastered(kanji.id)}
        >
          <ThemedText variant="subheading" inverted={mastered}>{mastered ? '✓ Dikuasai' : '○ Tandai Kuasai'}</ThemedText>
        </Pressable>
      </View>

      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Bacaan</ThemedText>
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
      </Card>

      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Urutan Goresan</ThemedText>
        <StrokeOrderView kanji={kanji} size={220} />
      </Card>

      {kanji.mnemonic ? (
        <Card style={styles.section}>
          <ThemedText variant="subheading" style={styles.sectionTitle}>Mnemonic</ThemedText>
          <ThemedText variant="body">💡 {kanji.mnemonic}</ThemedText>
        </Card>
      ) : null}

      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Kosakata Contoh</ThemedText>
        {kanji.examples.map((ex, i) => (
          <View key={i} style={styles.exampleRow}>
            <View>
              <ThemedText variant="subheading">{ex.word}</ThemedText>
              <ThemedText variant="caption" inkSoft>{ex.reading}</ThemedText>
            </View>
            <ThemedText variant="body" inkSoft>{ex.meaning}</ThemedText>
          </View>
        ))}
      </Card>

      {kanji.notes ? (
        <ThemedText variant="caption" inkSoft style={styles.notes}>{kanji.notes}</ThemedText>
      ) : null}

      <Pressable style={styles.flashBtn} onPress={() => router.push(`/flashcards?focus=${kanji.id}`)}>
        <ThemedText variant="subheading" inverted>Belajar dengan Flashcard</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  hero: { alignItems: 'center', marginVertical: spacing.lg },
  char: { color: colors.ink },
  actions: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  action: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  actionAccent: { backgroundColor: colors.accent, borderColor: colors.accent },
  actionMatcha: { backgroundColor: colors.matcha, borderColor: colors.matcha },
  section: { marginBottom: spacing.md },
  sectionTitle: { marginBottom: spacing.sm },
  readingRow: { flexDirection: 'row', gap: spacing.lg },
  readingBlock: { flex: 1 },
  exampleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  notes: { marginTop: spacing.sm, marginBottom: spacing.lg, textAlign: 'center', paddingHorizontal: spacing.md },
  flashBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
