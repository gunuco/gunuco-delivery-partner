import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  GEmptyState,
  GErrorState,
  GDocumentCard,
  GSkeleton,
  theme,
} from '@/src/design-system';
import {
  ProfileHeroCard,
  ProfileScreenShell,
  PROFILE_BG,
} from '@/src/features/profile/ProfileScreenShell';
import { useDocuments } from '@/src/hooks';
import { formatDate } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { DOCUMENT_TYPE_LABELS } from '@/src/utils/labels';

export default function DocumentsScreen() {
  const { documents, isLoading, error, refetch, isFetching } = useDocuments();

  if (isLoading && documents.length === 0) {
    return (
      <ProfileScreenShell
        title="Documents"
        subtitle="Keep verification up to date"
        onBack={() => router.back()}
      >
        <GSkeleton height={88} borderRadius={theme.radius.xl} />
        <GSkeleton height={88} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && documents.length === 0) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="Documents" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load documents"
            description={getErrorMessage(error)}
            onRetry={() => {
              void refetch();
            }}
          />
        </ProfileScreenShell>
      </View>
    );
  }

  return (
    <ProfileScreenShell
      title="Documents"
      subtitle="Keep verification up to date"
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <ProfileHeroCard
        icon="document"
        eyebrow="Verification"
        title="Your partner documents"
        body="Licence, RC and identity papers keep you eligible for cake deliveries."
      />

      {documents.length === 0 ? (
        <GEmptyState
          title="No documents"
          description="Upload your licence and RC to stay eligible for deliveries."
        />
      ) : (
        documents.map((doc) => (
          <GDocumentCard
            key={doc.id}
            type={DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type}
            status={doc.status}
            expiry={doc.expiryDate ? formatDate(doc.expiryDate) : undefined}
            onPress={() => router.push(`/profile/documents/${doc.type}`)}
          />
        ))
      )}
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: PROFILE_BG,
  },
});
