/**
 * Writing practice — pick a kanji, see stroke order animation.
 */
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { ThemedText, Header, Card } from '../../components/ui';
import { StrokeOrderView, KanjiCell } from '../../components/kanji';
import { colors, spacing, radius } from '../../constants/theme';
import { useKanjiData } from '../../hooks/useKanjiData';
import type { Kanji } from '../../types';

export default function Writing() {
  const kanji = useKanjiData();
  const [selected, setSelected] = useState<Kanji | null>(null);

  const withSvg = useMemo(() => kanji.filter((k) => k.strokeOrderSource === 'verified-svg'), [kanji]);

  if (selected) {
    return (
      <View style={styles.detail}>
        <Pressable style={styles.back} onPress={() => setSelected(null)}>
          <ThemedText variant="caption" inkSoft>← Kembali ke daftar</ThemedText>
        </Pressable>
        <Card style={styles.practiceCard}>
          <View style={styles.charHeader}>
            <ThemedText variant="kanjiSmall">{selected.character}</ThemedText>
            <View>
              <ThemedText variant="heading">{selected.meanings.join(', ')}</ThemedText>
              <ThemedText variant="caption" inkSoft>{selected.strokeCount} goresan · {selected.strokeOrderSource === 'verified-svg' ? 'Animasi SVG' : 'Hitungan goresan'}</ThemedText>
            </View>
          </View>
          <StrokeOrderView kanji={selected} size={260} />
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Header title="Latihan Menulis" subtitle="Pelajari urutan goresan" />
      <Card style={styles.note}>
        <ThemedText variant="caption" inkSoft>
          Kanji dengan animasi SVG terverifikasi: {withSvg.length}. Kanji lainnya menampilkan jumlah goresan terverifikasi sebagai fallback bertanda nomor.
        </ThemedText>
      </Card>
      <FlatList
        data={kanji}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <KanjiCell
            kanji={item}
            onPress={() => setSelected(item)}
            mastered={false}
            favorite={false}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },
  note: { marginBottom: spacing.md },
  list: { paddingBottom: spacing.xxl, gap: spacing.sm },
  row: { gap: spacing.sm, justifyContent: 'space-between' },
  detail: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },
  back: { alignSelf: 'flex-start', marginBottom: spacing.md },
  practiceCard: { alignItems: 'center' },
  charHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
});
