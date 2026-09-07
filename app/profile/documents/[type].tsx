import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import {
  GButton,
  GEmptyState,
  GErrorState,
  GSkeleton,
  GStatusBadge,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import {
  ProfileDetailRow,
  ProfileHeroCard,
  ProfileScreenShell,
  PROFILE_BG,
} from '@/src/features/profile/ProfileScreenShell';
import { useDocuments } from '@/src/hooks';
import type { DocumentType } from '@/src/types';
import { formatDate, formatDateTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { DOCUMENT_TYPE_LABELS } from '@/src/utils/labels';

export default function DocumentDetailScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const rawType = Array.isArray(type) ? type[0] : type;
  const { documents, isLoading, error, refetch, uploadDocument, uploadState } =
    useDocuments();
  const { showToast } = useToast();

  const doc = useMemo(
    () => documents.find((item) => item.type === rawType),
    [documents, rawType],
  );

  const label =
    (rawType && DOCUMENT_TYPE_LABELS[rawType as DocumentType]) ||
    rawType ||
    'Document';

  if (isLoading && documents.length === 0) {
    return (
      <ProfileScreenShell title={label} onBack={() => router.back()}>
        <GSkeleton height={140} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && documents.length === 0) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title={label} onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load document"
            description={getErrorMessage(error)}
            onRetry={() => {
              void refetch();
            }}
          />
        </ProfileScreenShell>
      </View>
    );
  }

  if (!doc) {
    return (
      <ProfileScreenShell title={label} onBack={() => router.back()}>
        <GEmptyState
          title="Document not found"
          description="This document type is not on your profile yet."
          actionLabel="Back to documents"
          onAction={() => router.replace('/profile/documents')}
        />
      </ProfileScreenShell>
    );
  }

  const onUpload = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission needed',
          'Allow photo library access to upload documents.',
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]?.uri) {
        return;
      }
      await uploadDocument(doc.type, result.assets[0].uri);
      showToast({ type: 'success', message: 'Document uploaded for review.' });
      void refetch();
    } catch (err) {
      Alert.alert('Upload failed', getErrorMessage(err));
    }
  };

  return (
    <ProfileScreenShell
      title={label}
      subtitle="Document details"
      onBack={() => router.back()}
    >
      <ProfileHeroCard
        icon="document"
        eyebrow="Status"
        title={label}
        body={
          doc.rejectionReason
            ? doc.rejectionReason
            : 'Keep a clear photo of the original document. Blurry uploads delay approval.'
        }
        right={<GStatusBadge status={doc.status} kind="partner" />}
      />

      <ProfileDetailRow
        icon="clock"
        label="Uploaded"
        value={doc.uploadedAt ? formatDateTime(doc.uploadedAt) : 'Not uploaded'}
      />
      <ProfileDetailRow
        icon="calendar"
        label="Expiry"
        value={doc.expiryDate ? formatDate(doc.expiryDate) : '—'}
      />

      <View style={styles.actions}>
        <GButton
          title={
            doc.status === 'NOT_UPLOADED' || doc.status === 'REJECTED'
              ? 'Upload document'
              : 'Replace document'
          }
          fullWidth
          size="lg"
          loading={uploadState.isLoading}
          onPress={() => {
            void onUpload();
          }}
        />
      </View>
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: PROFILE_BG,
  },
  actions: {
    marginTop: theme.spacing[1],
  },
});
