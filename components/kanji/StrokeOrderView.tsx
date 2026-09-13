/**
 * StrokeOrderView — renders verified SVG stroke paths sequentially,
 * or a graceful numbered-grid fallback when verified data is unavailable.
 *
 * NEVER fabricates path geometry: if strokeOrderSource is 'fallback-count',
 * we only show numbered cells for the verified stroke count, with no paths.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import { ThemedText } from '../ui/ThemedText';
import { colors, radius, spacing } from '../../constants/theme';
import type { Kanji } from '../../types';

interface Props {
  kanji: Kanji;
  size?: number;
}

export function StrokeOrderView({ kanji, size = 240 }: Props) {
  const [currentStroke, setCurrentStroke] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = kanji.strokePaths?.length ?? kanji.strokeCount;

  const stop = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    stop();
    setPlaying(true);
    setCurrentStroke(0);
  }, [stop]);

  const restart = useCallback(() => {
    setCurrentStroke(0);
    play();
  }, [play]);

  useEffect(() => {
    if (!playing) return;
    if (currentStroke >= total) {
      stop();
      return;
    }
    timer.current = setTimeout(() => {
      setCurrentStroke((c) => c + 1);
    }, 700);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, currentStroke, total, stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  // GRACEFUL FALLBACK: no verified paths → numbered grid by stroke count
  if (kanji.strokeOrderSource !== 'verified-svg' || !kanji.strokePaths?.length) {
    return (
      <View style={styles.fallbackWrap}>
        <View style={styles.grid}>
          {Array.from({ length: total }).map((_, i) => (
            <View key={i} style={styles.gridCell}>
              <Svg width={48} height={48}>
                <Rect x={1} y={1} width={46} height={46} rx={4} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={1} />
                <SvgText x={24} y={30} fontSize={18} fill={colors.inkSoft} textAnchor="middle" fontFamily="System">
                  {i + 1}
                </SvgText>
              </Svg>
            </View>
          ))}
        </View>
        <ThemedText variant="caption" inkSoft style={styles.fallbackNote}>
          Urutan goresan SVG belum tersedia. Menampilkan jumlah goresan terverifikasi ({total} goresan).
        </ThemedText>
      </View>
    );
  }

  // VERIFIED SVG mode
  const shownPaths = kanji.strokePaths!.filter((p) => p.order <= currentStroke);

  return (
    <View style={styles.wrap}>
      <Pressable onPress={playing ? stop : play} style={styles.svgWrap}>
        <Svg width={size} height={size}>
          {/* faint guide grid */}
          <Rect x={0} y={0} width={size} height={size} fill={colors.surface} stroke={colors.border} strokeWidth={1} rx={radius.md} />
          <Rect x={0} y={size / 2} width={size} height={0.5} fill={colors.border} opacity={0.5} />
          <Rect x={size / 2} y={0} width={0.5} height={size} fill={colors.border} opacity={0.5} />
          <Rect x={0} y={0} width={size} height={size / 2} fill={colors.accent} opacity={0.04} rx={radius.md} />
          {shownPaths.map((p, i) => (
            <Path
              key={i}
              d={p.d}
              fill="none"
              stroke={i === shownPaths.length - 1 ? colors.accent : colors.ink}
              strokeWidth={size * 0.06}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={i === shownPaths.length - 1 ? 1 : 0.4}
            />
          ))}
        </Svg>
      </Pressable>
      <View style={styles.controls}>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={playing ? stop : play}>
          <ThemedText variant="caption" inverted>{playing ? 'Jeda' : 'Putar'}</ThemedText>
        </Pressable>
        <Pressable style={styles.btn} onPress={restart}>
          <ThemedText variant="caption" inkSoft>Ulangi</ThemedText>
        </Pressable>
      </View>
      <ThemedText variant="caption" inkSoft style={styles.counter}>
        Goresan {Math.min(currentStroke, total)} / {total}
      </ThemedText>
    </View>
  );
}

const cellSize = 48;
const cols = 8;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  svgWrap: { marginBottom: spacing.sm },
  controls: { flexDirection: 'row', gap: spacing.sm },
  btn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  btnPrimary: { backgroundColor: colors.accent, borderColor: colors.accent },
  counter: { marginTop: spacing.sm },
  fallbackWrap: { alignItems: 'center' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: cols * (cellSize + 4),
  },
  gridCell: { margin: 2 },
  fallbackNote: {
    marginTop: spacing.md,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
