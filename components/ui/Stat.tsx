/**
 * Stat — compact stat display (label + value).
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { colors, radius, spacing } from '../../constants/theme';

interface StatProps {
  label: string;
  value: string | number;
  accent?: boolean;
}

export function Stat({ label, value, accent }: StatProps) {
  return (
    <View style={[styles.box, accent && styles.accent]}>
      <ThemedText variant="caption" inkSoft>{label}</ThemedText>
      <ThemedText variant="heading" inkSoft={!accent} style={accent ? styles.accentText : undefined}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
  },
  accent: { backgroundColor: colors.accent, borderColor: colors.accentSoft, borderWidth: 0 },
  accentText: { color: colors.inkInverted },
});
