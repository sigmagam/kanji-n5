/**
 * Root layout — wraps the app in the ProgressProvider, SafeArea, and StatusBar.
 * Screens are file-based; explicit Screen declarations set header titles.
 */
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProgressProvider } from '../context/ProgressContext';
import { colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProgressProvider>
          <StatusBar style="dark" backgroundColor={colors.bg} />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.bg },
              headerTitleStyle: { color: colors.ink, fontWeight: '600' },
              headerTintColor: colors.accent,
              contentStyle: { backgroundColor: colors.bg },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ title: 'Selamat Datang', headerShown: false }} />
            <Stack.Screen name="home" options={{ title: 'Beranda', headerShown: false }} />
            <Stack.Screen name="kanji/index" options={{ title: 'Pustaka Kanji' }} />
            <Stack.Screen name="kanji/[id]" options={{ title: 'Detail Kanji' }} />
            <Stack.Screen name="flashcards/index" options={{ title: 'Flashcard' }} />
            <Stack.Screen name="daily" options={{ title: 'Belajar Harian' }} />
            <Stack.Screen name="quiz/index" options={{ title: 'Kuis' }} />
            <Stack.Screen name="quiz/play" options={{ title: 'Kuis' }} />
            <Stack.Screen name="quiz/review" options={{ title: 'Tinjau Kesalahan' }} />
            <Stack.Screen name="writing/index" options={{ title: 'Latihan Menulis' }} />
            <Stack.Screen name="favorites" options={{ title: 'Favorit' }} />
            <Stack.Screen name="progress" options={{ title: 'Progres' }} />
            <Stack.Screen name="settings" options={{ title: 'Pengaturan' }} />
            <Stack.Screen name="about" options={{ title: 'Tentang' }} />
          </Stack>
        </ProgressProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
