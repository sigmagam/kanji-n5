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
      const kind =
        style === 'heavy' ? Haptics.NotificationFeedbackType.Warning :
        style === 'medium' ? Haptics.ImpactFeedbackStyle.Medium :
        Haptics.ImpactFeedbackStyle.Light;
      if (style === 'heavy') Haptics.notificationAsync(kind);
      else Haptics.impactAsync(kind);
    } catch {
      // no-op — haptics may be unavailable
    }
  }, [enabled]);
}
