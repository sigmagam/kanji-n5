/**
 * Entry route — shows splash while loading, then routes to onboarding or home.
 */
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { colors, spacing } from '../constants/theme';
import { useProgress } from '../context/ProgressContext';
import { useKanjiData } from '../hooks/useKanjiData';

export default function Index() {
  const { ready, progress } = useProgress();
  const kanji = useKanjiData();

  if (!ready) {
    return (
      <View style={styles.splash}>
        <View style={styles.logo}>
          <ThemedText variant="kanjiSmall" style={styles.logoChar}>漢</ThemedText>
        </View>
        <ThemedText variant="heading" inverted style={styles.title}>KANJI N5</ThemedText>
        <ThemedText variant="caption" inkSoft>Kartu Flash Kanji Jepang</ThemedText>
        <ActivityIndicator color={colors.inkInverted} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  if (!progress.onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/home" />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoChar: { color: colors.accentSoft },
  title: { marginBottom: spacing.xs },
});
