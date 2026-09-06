import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { GIcon } from '../icons/GIcon';
import { theme } from '../theme';
import { GIconButton } from './GIconButton';
import { GText } from './GText';

export type GModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

export function GModal({ visible, onClose, title, children, contentStyle }: GModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close modal"
        />
        <View style={[styles.sheet, contentStyle]}>
          <View style={styles.handle} />
          {title ? (
            <View style={styles.header}>
              <GText variant="title" style={styles.title} numberOfLines={1}>
                {title}
              </GText>
              <GIconButton accessibilityLabel="Close" onPress={onClose} size={40}>
                <GIcon name="close" size={22} color={theme.colors.text} />
              </GIconButton>
            </View>
          ) : null}
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[7],
    paddingTop: theme.spacing[2],
    maxHeight: '88%',
    ...theme.shadows.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.borderStrong,
    marginBottom: theme.spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  title: {
    flex: 1,
  },
});
