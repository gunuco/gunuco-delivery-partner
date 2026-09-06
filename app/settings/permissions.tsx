import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

import {
  GButton,
  GHeader,
  GListRow,
  GText,
  theme,
} from '@/src/design-system';
import { getErrorMessage } from '@/src/utils/errors';

type PermState = 'granted' | 'denied' | 'undetermined' | 'unknown';

function labelFor(state: PermState): string {
  switch (state) {
    case 'granted':
      return 'Allowed';
    case 'denied':
      return 'Denied';
    case 'undetermined':
      return 'Not decided';
    default:
      return 'Check device settings';
  }
}

export default function SettingsPermissionsScreen() {
  const [location, setLocation] = useState<PermState>('unknown');
  const [camera, setCamera] = useState<PermState>('unknown');
  const [photos, setPhotos] = useState<PermState>('unknown');

  const refresh = useCallback(async () => {
    try {
      const loc = await Location.getForegroundPermissionsAsync();
      setLocation(
        loc.status === 'granted'
          ? 'granted'
          : loc.status === 'denied'
            ? 'denied'
            : 'undetermined',
      );
      const cam = await ImagePicker.getCameraPermissionsAsync();
      setCamera(
        cam.status === 'granted'
          ? 'granted'
          : cam.status === 'denied'
            ? 'denied'
            : 'undetermined',
      );
      const lib = await ImagePicker.getMediaLibraryPermissionsAsync();
      setPhotos(
        lib.status === 'granted'
          ? 'granted'
          : lib.status === 'denied'
            ? 'denied'
            : 'undetermined',
      );
    } catch (err) {
      Alert.alert('Permission check failed', getErrorMessage(err));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <View style={styles.screen}>
      <GHeader
        title="Permissions"
        subtitle="Required for safe deliveries"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <GListRow title="Location" subtitle={labelFor(location)} />
        <GListRow title="Camera" subtitle={labelFor(camera)} />
        <GListRow title="Photo library" subtitle={labelFor(photos)} />
        <GText variant="caption" color={theme.colors.textMuted} style={styles.note}>
          GUNUCO uses location while you are online to assign nearby orders.
          Camera helps with delivery verification photos. We do not start silent
          tracking from the Emergency screen.
        </GText>
        <GButton
          title="Refresh status"
          fullWidth
          variant="outline"
          onPress={() => {
            void refresh();
          }}
        />
        <GButton
          title="Open system settings"
          fullWidth
          onPress={() => {
            void Linking.openSettings();
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing[8],
    gap: theme.spacing[3],
  },
  note: {
    paddingHorizontal: theme.spacing[4],
  },
});
