/**
 * Settings — daily goal, language, haptics, reset.
 */
import { useState } from 'react';
import { View, StyleSheet, Pressable, Alert, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { ThemedText, Header, Card } from '../components/ui';
import { colors, spacing, radius } from '../constants/theme';
import { useProgress } from '../context/ProgressContext';

export default function Settings() {
  const { progress, setDailyGoal, setLanguage, setHapticsEnabled, resetProgress } = useProgress();
  const [goal, setGoal] = useState(progress.dailyGoal);

  const handleReset = () => {
    Alert.alert('Reset Progres', 'Hapus semua progres, favorit, dan skor kuis?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => { resetProgress(); setGoal(5); } },
    ]);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Header title="Pengaturan" />
      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Tujuan Harian</ThemedText>
        <View style={styles.goalRow}>
          {[3, 5, 10, 15, 20].map((n) => (
            <Pressable
              key={n}
              style={[styles.goalBtn, goal === n && styles.goalBtnActive]}
              onPress={() => { setGoal(n); setDailyGoal(n); }}
            >
              <ThemedText variant="caption" inverted={goal === n}>{n}</ThemedText>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Bahasa</ThemedText>
        <View style={styles.row}>
          <Pressable style={[styles.langBtn, progress.language === 'id' && styles.langBtnActive]} onPress={() => setLanguage('id')}>
            <ThemedText variant="body" inverted={progress.language === 'id'}>Indonesia</ThemedText>
          </Pressable>
          <Pressable style={[styles.langBtn, progress.language === 'en' && styles.langBtnActive]} onPress={() => setLanguage('en')}>
            <ThemedText variant="body" inverted={progress.language === 'en'}>English</ThemedText>
          </Pressable>
        </View>
      </Card>

      <Card style={styles.section}>
        <View style={styles.switchRow}>
          <View>
            <ThemedText variant="subheading">Getaran (Haptik)</ThemedText>
            <ThemedText variant="caption" inkSoft>Umpan balik getar saat mengetuk kartu</ThemedText>
          </View>
          <Switch
            value={progress.hapticsEnabled}
            onValueChange={setHapticsEnabled}
            trackColor={{ false: colors.border, true: colors.accent }}
          />
        </View>
      </Card>

      <Card style={styles.section}>
        <ThemedText variant="subheading" style={styles.sectionTitle}>Data</ThemedText>
        <ThemedText variant="caption" inkSoft style={styles.dataNote}>
          Semua progres disimpan secara lokal di perangkat. Tidak ada sinkronisasi awan.
        </ThemedText>
        <Pressable style={styles.dangerBtn} onPress={handleReset}>
          <ThemedText variant="subheading" inverted>Reset Semua Progres</ThemedText>
        </Pressable>
      </Card>

      <Pressable style={styles.aboutLink} onPress={() => router.push('/about')}>
        <ThemedText variant="caption" inkSoft>Tentang Aplikasi →</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  section: { marginBottom: spacing.md },
  sectionTitle: { marginBottom: spacing.sm },
  goalRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  goalBtn: { width: 48, height: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  goalBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  row: { flexDirection: 'row', gap: spacing.sm },
  langBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.surface },
  langBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  dataNote: { marginBottom: spacing.md },
  dangerBtn: { backgroundColor: colors.danger, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  aboutLink: { alignSelf: 'center', padding: spacing.md },
});
