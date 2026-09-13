import type { ExpoConfig, ConfigContext } from '@expo/config';

/**
 * app.config.ts — dynamic Expo configuration for KANJI N5.
 * Secrets are never hardcoded here; EAS reads them from the env during cloud builds.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'KANJI N5',
  slug: 'kanji-n5',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'kanjin5',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1a1a1a',
  },
  android: {
    package: 'com.sigmagam.kanjin5',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundImage: './assets/images/adaptive-icon-bg.png',
    },
    permissions: [],
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.sigmagam.kanjin5',
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: ['expo-router'],
  experiments: {
    tsconfigPaths: true,
  },
  extra: {
    eas: {
      projectId: 'kanji-n5',
    },
  },
});
