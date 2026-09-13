/**
 * Kanji library — browse all kanji, filter by category, search.
 */
import { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, TextInput, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText, Header } from '../../components/ui';
import { KanjiCell } from '../../components/kanji';
import { colors, spacing, radius } from '../../constants/theme';
import { useKanjiData, useKanjiCategories } from '../../hooks/useKanjiData';
import { useProgress } from '../../context/ProgressContext';

export default function KanjiLibrary() {
  const kanji = useKanjiData();
  const categories = useKanjiCategories();
  const { isMastered, isFavorite } = useProgress();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return kanji.filter((k) => {
      const matchCat = !activeCat || k.category === activeCat;
      const q = query.trim().toLowerCase();
      const matchQuery = !q ||
        k.character.includes(query) ||
        k.meanings.some((m) => m.toLowerCase().includes(q)) ||
        k.onyomi.some((o) => o.toLowerCase().includes(q)) ||
        k.kunyomi.some((u) => u.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [kanji, activeCat, query]);

  return (
    <View style={styles.wrap}>
      <Header title="Pustaka Kanji" subtitle={`${kanji.length} kanji`} />
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Cari kanji, makna, atau bacaan…"
          value={query}
          onChangeText={setQuery}
          placeholderTextColor={colors.inkMuted}
        />
      </View>
      <ScrollView horizontal style={styles.cats} contentContainerStyle={styles.catsContent} showsHorizontalScrollIndicator={false}>
        <Pressable
          style={[styles.chip, !activeCat && styles.chipActive]}
          onPress={() => setActiveCat(null)}
        >
          <ThemedText variant="caption" inverted={!activeCat}>Semua</ThemedText>
        </Pressable>
        {categories.map((c) => (
          <Pressable
            key={c}
            style={[styles.chip, activeCat === c && styles.chipActive]}
            onPress={() => setActiveCat(activeCat === c ? null : c)}
          >
            <ThemedText variant="caption" inverted={activeCat === c}>{c}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <KanjiCell
            kanji={item}
            mastered={isMastered(item.id)}
            favorite={isFavorite(item.id)}
            onPress={() => router.push(`/kanji/${item.id}`)}
          />
        )}
        ListEmptyComponent={<ThemedText variant="caption" inkSoft style={styles.empty}>Tidak ada hasil.</ThemedText>}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },
  searchWrap: { marginBottom: spacing.sm },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.ink,
  },
  cats: { marginBottom: spacing.md, maxHeight: 44 },
  catsContent: { gap: spacing.xs, paddingRight: spacing.md },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  list: { paddingBottom: spacing.xxl, gap: spacing.sm },
  row: { gap: spacing.sm, justifyContent: 'space-between' },
  empty: { textAlign: 'center', marginTop: spacing.xxl },
});
