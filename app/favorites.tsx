/**
 * Favorites — saved kanji.
 */
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { ThemedText, Header } from '../components/ui';
import { KanjiCell } from '../components/kanji';
import { colors, spacing } from '../constants/theme';
import { useKanjiData } from '../hooks/useKanjiData';
import { useProgress } from '../context/ProgressContext';

export default function Favorites() {
  const kanji = useKanjiData();
  const { progress, isMastered } = useProgress();
  const favs = kanji.filter((k) => progress.favorites.includes(k.id));

  return (
    <View style={styles.wrap}>
      <Header title="Favorit" subtitle={`${favs.length} kanji tersimpan`} />
      <FlatList
        data={favs}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<ThemedText variant="caption" inkSoft style={styles.empty}>Belum ada favorit. Ketuk ☆ di kartu untuk menyimpan.</ThemedText>}
        renderItem={({ item }) => (
          <KanjiCell
            kanji={item}
            mastered={isMastered(item.id)}
            favorite={true}
            onPress={() => router.push(`/kanji/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },
  list: { paddingBottom: spacing.xxl, gap: spacing.sm },
  row: { gap: spacing.sm, justifyContent: 'space-between' },
  empty: { textAlign: 'center', marginTop: spacing.xxl },
});
