/**
 * PressableCard — tappable card with subtle press feedback.
 */
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';

interface PressableCardProps {
  children: ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export function PressableCard({ children, onPress, style, disabled }: PressableCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }: { pressed: boolean }) => [
        styles.card,
        { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
});
