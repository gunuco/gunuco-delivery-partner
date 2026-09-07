import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GButton,
  GCard,
  GIcon,
  GLoader,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import type { IconName } from '@/src/design-system';
import { StepBanner } from '@/src/features/onboarding/StepBanner';
import { OnboardingHeader } from '@/src/features/onboarding/OnboardingHeader';
import {
  DOCUMENT_DESCRIPTIONS,
  DOCUMENT_LABELS,
  ONBOARDING_UI_STEPS,
  REQUIRED_DOCUMENT_TYPES,
} from '@/src/features/onboarding/steps';
import { useDocuments, useOnboarding } from '@/src/hooks';
import type { DocumentStatus, DocumentType } from '@/src/types';

const DOC_ICONS: Record<DocumentType, IconName> = {
  DRIVING_LICENCE: 'idCard',
  RC: 'car',
  INSURANCE: 'shield',
  IDENTITY: 'profile',
  PROFILE_PHOTO: 'camera',
};
function isUploaded(status: DocumentStatus | undefined): boolean {
  return status === 'PENDING' || status === 'APPROVED' || status === 'REJECTED';
}

function statusLabel(status: DocumentStatus | undefined): string {
  switch (status) {
    case 'APPROVED':
      return 'APPROVED';
    case 'PENDING':
      return 'PENDING';
    case 'REJECTED':
      return 'REJECTED';
    default:
      return 'NOT UPLOADED';
  }
}

function statusTone(status: DocumentStatus | undefined): {
  bg: string;
  text: string;
} {
  switch (status) {
    case 'APPROVED':
      return { bg: theme.colors.successSoft, text: theme.colors.success };
    case 'PENDING':
      return { bg: theme.colors.warningSoft, text: theme.colors.warning };
    case 'REJECTED':
      return { bg: theme.colors.dangerSoft, text: theme.colors.danger };
    default:
      return { bg: theme.colors.accentSoft, text: theme.colors.primary };
  }
}

export default function DocumentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { documents, isLoading, refetch } = useDocuments();
  const { completeStep, updateStepState } = useOnboarding();

  const safeDocs = documents ?? [];
  const byType = useMemo(() => {
    const map: Partial<Record<DocumentType, (typeof safeDocs)[number]>> = {};
    for (const doc of safeDocs) {
      if (doc?.type) map[doc.type] = doc;
    }
    return map;
  }, [safeDocs]);

  const allReady = REQUIRED_DOCUMENT_TYPES.every((type) =>
    isUploaded(byType[type]?.status),
  );

  const footerPad = useMemo(
    () => Math.max(insets.bottom, theme.spacing[3]) + 120,
    [insets.bottom],
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
      <OnboardingHeader title="Documents" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: footerPad }]}
        showsVerticalScrollIndicator={false}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={4} />

        <StepBanner name="documents" />

        <View style={styles.list}>
          {REQUIRED_DOCUMENT_TYPES.map((type) => {
            const doc = byType[type];
            const status = doc?.status;
            const tone = statusTone(status);
            return (
              <Pressable
                key={type}
                accessibilityRole="button"
                accessibilityLabel={DOCUMENT_LABELS[type]}
                onPress={() =>
                  router.push({
                    pathname: '/(onboarding)/document-upload',
                    params: { type },
                  })
                }
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <GCard padding="md" elevated style={styles.docCard}>
                  <View style={styles.docTop}>
                    <View style={styles.docIcon}>
                      <GIcon
                        name={DOC_ICONS[type] ?? 'document'}
                        size={22}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={styles.docCopy}>
                      <GText variant="bodyBold" numberOfLines={1}>
                        {DOCUMENT_LABELS[type] ?? type}
                      </GText>
                      <GText
                        variant="caption"
                        color={theme.colors.textSecondary}
                        numberOfLines={2}
                      >
                        {DOCUMENT_DESCRIPTIONS[type] ??
                          'Upload a clear photo of this document.'}
                      </GText>
                    </View>
                    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
                      <GText variant="label" color={tone.text}>
                        {statusLabel(status)}
                      </GText>
                    </View>
                  </View>
                  <View style={styles.docActions}>
                    <View style={styles.cameraBtn}>
                      <GIcon name="camera" size={16} color={theme.colors.primary} />
                    </View>
                    <GIcon
                      name="chevronRight"
                      size={18}
                      color={theme.colors.primary}
                    />
                  </View>
                </GCard>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.tipCard}>
          <GIcon name="info" size={20} color={theme.colors.primary} />
          <View style={styles.tipCopy}>
            <GText variant="bodyBold" color={theme.colors.primary}>
              Make sure the photos are clear and readable
            </GText>
            <GText variant="caption" color={theme.colors.textSecondary}>
              Blurry, cropped or dark images may delay verification.
            </GText>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, theme.spacing[3]) },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Refresh status"
          onPress={() => {
            void refetch();
          }}
          style={styles.refresh}
        >
          <GIcon name="refresh" size={16} color={theme.colors.primary} />
          <GText variant="bodyBold" color={theme.colors.primary}>
            Refresh status
          </GText>
        </Pressable>

        <GButton
          title="Continue"
          size="lg"
          fullWidth
          disabled={!allReady}
          loading={Boolean(updateStepState?.isLoading)}
          onPress={() => {
            void onContinue();
          }}
          rightIcon={
            <GIcon name="arrowForward" size={18} color={theme.colors.textInverse} />
          }
        />
      </View>
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
  docCard: {
    backgroundColor: theme.colors.surface,
    gap: theme.spacing[3],
  },
  docTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
  },
  docIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  badge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  docActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing[2],
  },
  cameraBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.lg,
    padding: theme.spacing[4],
    alignItems: 'flex-start',
  },
  tipCopy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  pressed: { opacity: 0.92 },
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
  refresh: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
});
