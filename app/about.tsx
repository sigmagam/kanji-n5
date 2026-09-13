/**
 * About — app info, dataset sourcing, verification notes.
 */
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText, Header, Card } from '../components/ui';
import { colors, spacing } from '../constants/theme';
import { useKanjiData } from '../hooks/useKanjiData';

export default function About() {
  const kanji = useKanjiData();
  const verifiedSvg = kanji.filter((k) => k.strokeOrderSource === 'verified-svg').length;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Header title="Tentang Aplikasi" />
      <Card style={styles.section}>
        <ThemedText variant="kanjiSmall" style={styles.logo}>漢</ThemedText>
        <ThemedText variant="heading" style={styles.name}>KANJI N5</ThemedText>
        <ThemedText variant="caption" inkSoft>Kartu Flash Kanji Jepang · Versi 1.0.0</ThemedText>
        <ThemedText variant="body" style={styles.desc}>
          Aplikasi belajar kanji tingkat pemula yang berjalan sepenuhnya luring. Belajar dengan kartu flash, kuis, dan latihan urutan goresan — tanpa internet, tanpa login.
        </ThemedText>
      </Card>

      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Dataset Kanji</ThemedText>
        <ThemedText variant="body" style={styles.p}>
          Kurikulum berisi {kanji.length} kanji pemula yang dikurasi dan diverikasi.
        </ThemedText>
        <ThemedText variant="body" style={styles.p}>
          JLPT tidak menerbitkan satu daftar kanji resmi yang tetap atau jumlah resmi untuk N5. Aplikasi ini tidak mengklaim bahwa jumlah entri adalah "total resmi JLPT N5".
        </ThemedText>
        <ThemedText variant="caption" inkSoft style={styles.p}>
          • Total kanji: {kanji.length}
          {'\n'}• Urutan goresan SVG terverifikasi: {verifiedSvg}
          {'\n'}• Fallback hitungan goresan: {kanji.length - verifiedSvg}
        </ThemedText>
      </Card>

      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Sumber & Verifikasi</ThemedText>
        <ThemedText variant="body" style={styles.p}>
          Data diverifikasi dari sumber terpercaya:
        </ThemedText>
        <ThemedText variant="caption" inkSoft style={styles.p}>
          • KANJIDIC2 (EDRDG) — bacaan & jumlah goresan
          {'\n'}• Jisho.org (KANJIDIC2 + KANJIVG) — jumlah goresan & contoh
          {'\n'}• KANJIVG (KanjiVG project) — path SVG urutan goresan
          {'\n'}• "Basic Kanji Book" & "Kanji Look and Learn" — pengelompokan kategori
        </ThemedText>
        <ThemedText variant="caption" inkSoft style={styles.note}>
          Urutan goresan SVG hanya ditampilkan jika data terverifikasi telah ditranskripsi. Jika tidak tersedia, ditampilkan fallback hitungan goresan bernomor — tidak ada geometri yang dibuat-buat.
        </ThemedText>
      </Card>

      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Privasi</ThemedText>
        <ThemedText variant="body" style={styles.p}>
          Semua progres disimpan secara lokal di perangkat Anda. Tidak ada server, tidak ada basis data daring, tidak ada akun, tidak ada pelacakan.
        </ThemedText>
      </Card>

      <ThemedText variant="caption" inkSoft style={styles.footer}>
        Dibuat oleh sigmagam · MIT License
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  section: { marginBottom: spacing.md, alignItems: 'center' },
  logo: { color: colors.accent, marginBottom: spacing.xs },
  name: { marginBottom: 2 },
  desc: { textAlign: 'center', marginTop: spacing.md },
  sectionTitle: { marginBottom: spacing.sm, alignSelf: 'flex-start' },
  p: { alignSelf: 'flex-start', marginBottom: spacing.sm, textAlign: 'left' },
  note: { alignSelf: 'flex-start', marginTop: spacing.sm, fontStyle: 'italic' },
  footer: { textAlign: 'center', marginTop: spacing.lg },
});
