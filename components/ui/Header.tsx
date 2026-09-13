/**
 * Header — screen title with optional subtitle.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { spacing } from '../../constants/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function Header({ title, subtitle, right }: HeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.text}>
        <ThemedText variant="title">{title}</ThemedText>
        {subtitle ? <ThemedText variant="caption" inkSoft>{subtitle}</ThemedText> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.md },
  text: { flex: 1 },
});
