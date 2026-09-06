import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GButton,
  GHeader,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { DOCUMENT_LABELS } from '@/src/features/onboarding/steps';
import { useDocuments } from '@/src/hooks';
import type { DocumentType } from '@/src/types';

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
  const type = (VALID_TYPES.has(typeParam as DocumentType)
    ? typeParam
    : 'DRIVING_LICENCE') as DocumentType;

  const { documents, uploadDocument, uploadState } = useDocuments();
  const existing = useMemo(
    () => documents.find((d) => d.type === type),
    [documents, type],
  );
  const [uri, setUri] = useState<string | undefined>(existing?.fileUrl);

  const pick = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast({ type: 'warning', message: 'Permission required to upload' });
      return;
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.85 })
      : await ImagePicker.launchImageLibraryAsync({
          quality: 0.85,
          mediaTypes: ['images'],
        });
    if (!result.canceled && result.assets[0]?.uri) {
      setUri(result.assets[0].uri);
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
      <GHeader
        title={DOCUMENT_LABELS[type]}
        showBack
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing[8] },
        ]}
      >
        <GText variant="body" color={theme.colors.textSecondary}>
          Capture all four corners clearly. Avoid glare and blur.
        </GText>

        <View style={styles.preview}>
          {uri && !uri.startsWith('mock://') ? (
            <Image source={{ uri }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholder}>
              <GText variant="body" color={theme.colors.textMuted} center>
                {uri?.startsWith('mock://')
                  ? 'Document already on file — re-upload to replace'
                  : 'No image selected'}
              </GText>
            </View>
          )}
        </View>

        <GButton
          title="Take photo"
          size="lg"
          fullWidth
          variant="secondary"
          onPress={() => {
            void pick(true);
          }}
        />
        <GButton
          title="Choose from gallery"
          size="lg"
          fullWidth
          variant="outline"
          onPress={() => {
            void pick(false);
          }}
        />
        <GButton
          title="Upload document"
          size="lg"
          fullWidth
          loading={uploadState.isLoading}
          disabled={!uri}
          onPress={() => {
            void onUpload();
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
    height: 220,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  image: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[4],
  },
});
