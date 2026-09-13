/**
 * Quiz review — shows kanji that were answered wrong.
 */
import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText, Header } from '../../components/ui';
import { KanjiCell } from '../../components/kanji';
import { colors, spacing } from '../../constants/theme';
import { useKanjiData } from '../../hooks/useKanjiData';

export default function QuizReview() {
  const params = useLocalSearchParams<{ ids: string }>();
  const kanji = useKanjiData();
  const ids = useMemo(() => (params.ids ? params.ids.split(',') : []), [params.ids]);
  const wrong = useMemo(() => kanji.filter((k) => ids.includes(k.id)), [kanji, ids]);

  return (
    <View style={styles.wrap}>
      <Header title="Tinjau Kesalahan" subtitle={`${wrong.length} kanji`} />
      <FlatList
        data={wrong}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<ThemedText variant="caption" inkSoft style={styles.empty}>Tidak ada kesalahan. Bagus!</ThemedText>}
        renderItem={({ item }) => (
          <KanjiCell kanji={item} onPress={() => router.push(`/kanji/${item.id}`)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },
  list: { paddingBottom: spacing.xxl, gap: spacing.sm },
  row: { gap: spacing.sm, justifyContent: 'space-between' },
  empty: { textAlign: 'center', marginTop: spacing.xl },
});
