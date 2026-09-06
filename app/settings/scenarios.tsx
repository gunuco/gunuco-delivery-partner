import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GEmptyState,
  GHeader,
  GLoader,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { useUiTestScenarios } from '@/src/hooks/useUiTestScenarios';

export default function UiTestScenariosScreen() {
  const toast = useToast();
  const { isAvailable, scenarios, activeId, applyingId, applyScenario } =
    useUiTestScenarios();

  const onSelect = useCallback(
    async (id: string) => {
      const result = await applyScenario(id);
      if (!result.ok) {
        toast.showToast({ type: 'error', message: result.message });
        return;
      }
      toast.showToast({ type: 'success', message: `Scenario applied: ${id}` });
      router.replace(result.href);
    },
    [applyScenario, toast],
  );

  return (
    <View style={styles.screen}>
      <GHeader
        title="UI Test Scenarios"
        subtitle="Mock QA — tap to apply"
        showBack
        onBack={() => router.back()}
      />

      {!isAvailable ? (
        <GEmptyState
          title="Scenarios unavailable"
          description="Enable EXPO_PUBLIC_UI_TEST_MODE=true with DATA_MODE=mock in a non-production build."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <GText variant="caption" color={theme.colors.textSecondary} style={styles.hint}>
            {`All scenarios below seed the mock store. Active: ${activeId || 'none'}`}
          </GText>

          {scenarios.map((item) => {
            const isActive = item.id === activeId;
            const isApplying = applyingId === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Apply scenario ${item.id}`}
                disabled={Boolean(applyingId)}
                onPress={() => void onSelect(item.id)}
                style={({ pressed }) => [
                  styles.row,
                  isActive && styles.rowActive,
                  pressed && styles.rowPressed,
                ]}
              >
                <View style={styles.rowText}>
                  <View style={styles.titleRow}>
                    <GText variant="title">{item.id}</GText>
                    {isActive ? <GBadge label="Active" tone="success" /> : null}
                  </View>
                  <GText variant="caption" color={theme.colors.textSecondary}>
                    {item.description}
                  </GText>
                </View>
                {isApplying ? <GLoader size="small" /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[10],
    gap: theme.spacing[3],
  },
  hint: {
    marginBottom: theme.spacing[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing[4],
    minHeight: theme.components.minTouchTarget,
  },
  rowActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceMuted,
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowText: {
    flex: 1,
    gap: theme.spacing[1],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    flexWrap: 'wrap',
  },
});
