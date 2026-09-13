/**
 * useHaptics — optional haptic feedback, gated by user setting.
 */
import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { useProgress } from '../context/ProgressContext';

export function useHaptics() {
  const { progress } = useProgress();
  const enabled = progress.hapticsEnabled;
  return useCallback((style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enabled) return;
    try {
      if (style === 'heavy') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else if (style === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {
      // no-op — haptics may be unavailable
    }
  }, [enabled]);
}
