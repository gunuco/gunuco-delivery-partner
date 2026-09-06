import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import {
  GButton,
  GCard,
  GEmptyState,
  GErrorState,
  GHeader,
  GListRow,
  GSkeleton,
  GStatusBadge,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
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
      <View style={styles.screen}>
        <GHeader title={label} showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={140} borderRadius={theme.radius.lg} />
        </View>
      </View>
    );
  }

  if (error && documents.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title={label} showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load document"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  if (!doc) {
    return (
      <View style={styles.screen}>
        <GHeader title={label} showBack onBack={() => router.back()} />
        <GEmptyState
          title="Document not found"
          description="This document type is not on your profile yet."
          actionLabel="Back to documents"
          onAction={() => router.replace('/profile/documents')}
        />
      </View>
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
    <View style={styles.screen}>
      <GHeader title={label} showBack onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <GCard padding="lg" style={styles.hero}>
          <GStatusBadge status={doc.status} kind="partner" />
          <GText variant="h3">{label}</GText>
          {doc.rejectionReason ? (
            <GText variant="body" color={theme.colors.danger}>
              {doc.rejectionReason}
            </GText>
          ) : (
            <GText variant="body" color={theme.colors.textSecondary}>
              Keep a clear photo of the original document. Blurry uploads delay
              approval.
            </GText>
          )}
        </GCard>

        <GListRow
          title="Uploaded"
          right={
            <GText variant="body">
              {doc.uploadedAt ? formatDateTime(doc.uploadedAt) : 'Not uploaded'}
            </GText>
          }
        />
        <GListRow
          title="Expiry"
          right={
            <GText variant="body">
              {doc.expiryDate ? formatDate(doc.expiryDate) : '—'}
            </GText>
          }
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  pad: {
    padding: theme.spacing[4],
  },
  content: {
    paddingBottom: theme.spacing[8],
  },
  hero: {
    margin: theme.spacing[4],
    gap: theme.spacing[2],
  },
  actions: {
    padding: theme.spacing[4],
  },
});
