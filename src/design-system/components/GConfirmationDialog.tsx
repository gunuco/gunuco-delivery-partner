import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { theme } from '../theme';
import { GButton } from './GButton';
import { GText } from './GText';

export type GConfirmationDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function GConfirmationDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: GConfirmationDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel} accessibilityLabel="Dismiss dialog">
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <GText variant="h3">{title}</GText>
          {message ? (
            <GText variant="body" color={theme.colors.textSecondary} style={styles.message}>
              {message}
            </GText>
          ) : null}
          <View style={styles.actions}>
            <GButton
              title={cancelLabel}
              variant="ghost"
              onPress={onCancel}
              disabled={loading}
              style={styles.btn}
            />
            <GButton
              title={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              loading={loading}
              style={styles.btn}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[5],
  },
  sheet: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[5],
    ...theme.shadows.lg,
  },
  message: {
    marginTop: theme.spacing[2],
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing[2],
    marginTop: theme.spacing[5],
  },
  btn: {
    minWidth: 100,
  },
});
