import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GDocumentCard,
  GEmptyState,
  GErrorState,
  GHeader,
  GSkeleton,
  theme,
} from '@/src/design-system';
import { useDocuments } from '@/src/hooks';
import { formatDate } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { DOCUMENT_TYPE_LABELS } from '@/src/utils/labels';

export default function DocumentsScreen() {
  const { documents, isLoading, error, refetch, isFetching } = useDocuments();

  if (isLoading && documents.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Documents" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={72} borderRadius={theme.radius.lg} />
          <GSkeleton height={72} borderRadius={theme.radius.lg} />
        </View>
      </View>
    );
  }

  if (error && documents.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Documents" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load documents"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <GHeader
        title="Documents"
        subtitle="Keep verification up to date"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={theme.colors.primary}
          />
        }
      >
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
    gap: theme.spacing[3],
  },
  content: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[8],
    flexGrow: 1,
  },
});
