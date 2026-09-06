import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GButton,
  GDocumentCard,
  GHeader,
  GLoader,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import {
  DOCUMENT_LABELS,
  ONBOARDING_UI_STEPS,
  REQUIRED_DOCUMENT_TYPES,
} from '@/src/features/onboarding/steps';
import { useDocuments, useOnboarding } from '@/src/hooks';
import type { DocumentStatus, DocumentType } from '@/src/types';

function isUploaded(status: DocumentStatus | undefined): boolean {
  return status === 'PENDING' || status === 'APPROVED' || status === 'REJECTED';
}

export default function DocumentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { documents, isLoading, refetch } = useDocuments();
  const { completeStep, updateStepState } = useOnboarding();

  const byType = Object.fromEntries(documents.map((d) => [d.type, d])) as Partial<
    Record<DocumentType, (typeof documents)[number]>
  >;

  const allReady = REQUIRED_DOCUMENT_TYPES.every((type) =>
    isUploaded(byType[type]?.status),
  );

  const onContinue = async () => {
    if (!allReady) {
      showToast({
        type: 'warning',
        message: 'Upload all required documents to continue',
      });
      return;
    }
    try {
      await completeStep('DOCUMENTS');
      router.push('/(onboarding)/bank');
    } catch {
      showToast({ type: 'error', message: 'Could not save document progress' });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <GLoader label="Loading documents…" />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <GHeader title="Documents" showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing[8] },
        ]}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={4} />

        <GText variant="body" color={theme.colors.textSecondary}>
          Upload clear photos of each document. Verification usually takes a few hours.
        </GText>

        <View style={styles.list}>
          {REQUIRED_DOCUMENT_TYPES.map((type) => {
            const doc = byType[type];
            return (
              <GDocumentCard
                key={type}
                type={DOCUMENT_LABELS[type]}
                status={doc?.status ?? 'NOT_UPLOADED'}
                expiry={doc?.expiryDate}
                onPress={() =>
                  router.push({
                    pathname: '/(onboarding)/document-upload',
                    params: { type },
                  })
                }
              />
            );
          })}
        </View>

        <GButton
          title="Refresh status"
          variant="ghost"
          fullWidth
          onPress={() => {
            void refetch();
          }}
        />

        <GButton
          title="Continue"
          size="lg"
          fullWidth
          disabled={!allReady}
          loading={updateStepState.isLoading}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[3],
  },
  list: { gap: theme.spacing[3] },
});
