import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GAvatar,
  GButton,
  GHeader,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { ONBOARDING_UI_STEPS } from '@/src/features/onboarding/steps';
import { useDocuments, usePartner } from '@/src/hooks';

export default function ProfilePhotoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { partner } = usePartner();
  const { uploadDocument, uploadState } = useDocuments();
  const [uri, setUri] = useState<string | undefined>(partner?.photoUrl);

  const pickImage = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showToast({
        type: 'warning',
        message: fromCamera
          ? 'Camera permission is required'
          : 'Photo library permission is required',
      });
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          mediaTypes: ['images'],
        });

    if (!result.canceled && result.assets[0]?.uri) {
      setUri(result.assets[0].uri);
    }
  };

  const onContinue = async () => {
    if (!uri) {
      showToast({ type: 'warning', message: 'Please add a profile photo' });
      return;
    }
    try {
      await uploadDocument('PROFILE_PHOTO', uri);
      router.push('/(onboarding)/location');
    } catch {
      showToast({ type: 'error', message: 'Could not save profile photo' });
    }
  };

  return (
    <View style={styles.flex}>
      <GHeader title="Profile photo" showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing[8] },
        ]}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={1} />

        <GText variant="body" color={theme.colors.textSecondary}>
          Upload a clear, well-lit photo of your face. This helps stores and customers
          recognize you.
        </GText>

        <View style={styles.preview}>
          <GAvatar size="xl" uri={uri} name={partner?.name ?? 'Partner'} />
        </View>

        <GButton
          title="Take photo"
          size="lg"
          fullWidth
          variant="secondary"
          onPress={() => {
            void pickImage(true);
          }}
        />
        <GButton
          title="Choose from gallery"
          size="lg"
          fullWidth
          variant="outline"
          onPress={() => {
            void pickImage(false);
          }}
        />
        <GButton
          title="Save & continue"
          size="lg"
          fullWidth
          loading={uploadState.isLoading}
          disabled={!uri}
          onPress={() => {
            void onContinue();
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[3],
  },
  preview: {
    alignItems: 'center',
    paddingVertical: theme.spacing[6],
  },
});
