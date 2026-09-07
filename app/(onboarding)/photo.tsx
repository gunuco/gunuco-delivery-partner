import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from '@/src/design-system';
import { GButton, GIcon, GStepIndicator, GText, theme, useToast } from '@/src/design-system';
import { OnboardingHeader } from '@/src/features/onboarding/OnboardingHeader';
import { StepBanner } from '@/src/features/onboarding/StepBanner';
import { ONBOARDING_UI_STEPS } from '@/src/features/onboarding/steps';
import { useDocuments, usePartner } from '@/src/hooks';

const GUIDELINES: { icon: IconName; label: string }[] = [
  { icon: 'sunny', label: 'Good lighting' },
  { icon: 'profile', label: 'Clear face' },
  { icon: 'checkCircle', label: 'No sunglasses or hats' },
];

export default function ProfilePhotoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { partner } = usePartner();
  const { uploadDocument, uploadState } = useDocuments();
  const [uri, setUri] = useState<string | undefined>(partner?.photoUrl);

  const loading = Boolean(uploadState?.isLoading);
  const canSave = Boolean(uri);
  const footerPad = useMemo(() => Math.max(insets.bottom, theme.spacing[3]) + 180, [insets.bottom]);

  const pickImage = async (fromCamera: boolean) => {
    try {
      const permission = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission?.granted) {
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

      const nextUri = result?.assets?.[0]?.uri;
      if (!result?.canceled && nextUri) {
        setUri(nextUri);
      }
    } catch {
      showToast({
        type: 'error',
        message: fromCamera ? 'Could not open camera' : 'Could not open gallery',
      });
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
      <OnboardingHeader title="Profile photo" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: footerPad }]}
        showsVerticalScrollIndicator={false}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={1} />

        <StepBanner name="photo" />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add photo"
          onPress={() => {
            void pickImage(false);
          }}
          style={({ pressed }) => [styles.addPhoto, pressed && styles.addPhotoPressed]}
        >
          {uri ? (
            <Image
              source={{ uri }}
              style={styles.preview}
              contentFit="cover"
              accessibilityLabel="Selected profile photo"
            />
          ) : (
            <>
              <GIcon name="camera" size={28} color={theme.colors.primary} />
              <GText variant="label" color={theme.colors.primary}>
                Add photo
              </GText>
            </>
          )}
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing[3]) }]}>
        <GButton
          title="Take photo"
          size="lg"
          fullWidth
          onPress={() => {
            void pickImage(true);
          }}
          leftIcon={<GIcon name="camera" size={18} color={theme.colors.textInverse} />}
        />
        <GButton
          title="Choose from gallery"
          size="lg"
          fullWidth
          variant="outline"
          onPress={() => {
            void pickImage(false);
          }}
          leftIcon={<GIcon name="image" size={18} color={theme.colors.primary} />}
        />
        <GButton
          title="Save & continue"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!canSave}
          onPress={() => {
            void onContinue();
          }}
        />
      </View>
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
  addPhoto: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    position: 'absolute',
    top: 300,
    right: 217,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[1],
    overflow: 'hidden',
  },
  addPhotoPressed: {
    opacity: 0.92,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  guidelines: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  guideCard: {
    flex: 1,
    minHeight: 84,
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 110,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    gap: theme.spacing[2],
    backgroundColor: theme.colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
});
