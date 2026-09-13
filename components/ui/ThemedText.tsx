/**
 * ThemedText — typographic component.
 */
import type { ReactNode } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants/theme';

interface ThemedTextProps extends TextProps {
  variant?: keyof typeof typography;
  inkSoft?: boolean;
  inverted?: boolean;
  children?: ReactNode;
}

export function ThemedText({ variant = 'body', inkSoft, inverted, style, ...rest }: ThemedTextProps) {
  const color = inverted ? colors.inkInverted : inkSoft ? colors.inkSoft : colors.ink;
  return <Text style={[typography[variant], { color }, styles.base, style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: { flexShrink: 1 },
});
