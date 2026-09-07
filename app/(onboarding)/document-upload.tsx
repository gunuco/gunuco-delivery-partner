import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GButton,
  GIcon,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import type { IconName } from '@/src/design-system';
import { StepBanner } from '@/src/features/onboarding/StepBanner';
import { OnboardingHeader } from '@/src/features/onboarding/OnboardingHeader';
import { DOCUMENT_LABELS } from '@/src/features/onboarding/steps';
import { useDocuments } from '@/src/hooks';
import type { DocumentType } from '@/src/types';

const GUIDELINES: { icon: IconName; label: string }[] = [
  { icon: 'scan', label: 'All corners visible' },
  { icon: 'sunny', label: 'Good lighting' },
  { icon: 'closeCircle', label: 'No blur or glare' },
];

const VALID_TYPES = new Set<DocumentType>([
  'DRIVING_LICENCE',
  'RC',
  'INSURANCE',
  'IDENTITY',
  'PROFILE_PHOTO',
]);

function paramString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export default function DocumentUploadScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const params = useLocalSearchParams<{ type?: string }>();
  const typeParam = paramString(params.type);
  const type = (
    VALID_TYPES.has(typeParam as DocumentType) ? typeParam : 'DRIVING_LICENCE'
  ) as DocumentType;

  const { documents, uploadDocument, uploadState } = useDocuments();
  const safeDocs = documents ?? [];
  const existing = useMemo(
    () => safeDocs.find((d) => d?.type === type),
    [safeDocs, type],
  );
  const [uri, setUri] = useState<string | undefined>(existing?.fileUrl);

  const title = DOCUMENT_LABELS[type] ?? 'Document';
  const loading = Boolean(uploadState?.isLoading);
  const canUpload = Boolean(uri);
  const footerPad = useMemo(
    () => Math.max(insets.bottom, theme.spacing[3]) + 180,
    [insets.bottom],
  );

  const showPreview = Boolean(uri && !uri.startsWith('mock://'));
  const hasMockFile = Boolean(uri?.startsWith('mock://'));

  const pick = async (fromCamera: boolean) => {
    try {
      const permission = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission?.granted) {
        showToast({ type: 'warning', message: 'Permission required to upload' });
        return;
      }
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ quality: 0.85 })
        : await ImagePicker.launchImageLibraryAsync({
            quality: 0.85,
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

  const onUpload = async () => {
    if (!uri) {
      showToast({ type: 'warning', message: 'Select a document image first' });
      return;
    }
    try {
      await uploadDocument(type, uri);
      showToast({ type: 'success', message: 'Document uploaded' });
      router.back();
    } catch {
      showToast({ type: 'error', message: 'Upload failed. Try again.' });
    }
  };

  return (
    <View style={styles.flex}>
      <OnboardingHeader title={title} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: footerPad }]}
        showsVerticalScrollIndicator={false}
      >
        <StepBanner name="docUpload" />

        <View style={styles.guidelines}>
          {GUIDELINES.map((item) => (
            <View key={item.label} style={styles.guideItem}>
              <View style={styles.guideIcon}>
                <GIcon name={item.icon} size={18} color={theme.colors.primary} />
              </View>
              <GText
                variant="caption"
                color={theme.colors.text}
                center
                numberOfLines={2}
              >
                {item.label}
              </GText>
            </View>
          ))}
        </View>

        <View style={styles.viewfinder}>
          {showPreview ? (
            <Image
              source={{ uri: uri! }}
              style={styles.previewImage}
              contentFit="cover"
              accessibilityLabel="Selected document image"
            />
          ) : (
            <View style={styles.placeholder}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
              <GIcon name="camera" size={32} color={theme.colors.textInverse} />
              <GText variant="body" color={theme.colors.textInverse} center>
                {hasMockFile
                  ? 'Document on file — re-upload to replace'
                  : 'Position your document here'}
              </GText>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, theme.spacing[3]) },
        ]}
      >
        <GButton
          title="Take photo"
          size="lg"
          fullWidth
          variant="secondary"
          onPress={() => {
            void pick(true);
          }}
          leftIcon={<GIcon name="camera" size={18} color={theme.colors.primary} />}
        />
        <GButton
          title="Choose from gallery"
          size="lg"
          fullWidth
          variant="outline"
          onPress={() => {
            void pick(false);
          }}
          leftIcon={<GIcon name="image" size={18} color={theme.colors.primary} />}
        />
        <GButton
          title="Upload document"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!canUpload}
          onPress={() => {
            void onUpload();
          }}
          leftIcon={
            <GIcon name="cloudUpload" size={18} color={theme.colors.textInverse} />
          }
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
    gap: theme.spacing[4],
  },
  guidelines: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  guideItem: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  guideIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    height: 220,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    backgroundColor: '#1F1F24',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    padding: theme.spacing[6],
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: theme.colors.textInverse,
  },
  tl: {
    top: 16,
    left: 16,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  tr: {
    top: 16,
    right: 16,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bl: {
    bottom: 16,
    left: 16,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  br: {
    bottom: 16,
    right: 16,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    gap: theme.spacing[2],
    backgroundColor: theme.colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
});
