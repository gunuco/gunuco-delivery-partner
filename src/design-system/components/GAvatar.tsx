import { Image, StyleSheet, View } from 'react-native';

import { theme } from '../theme';
import { GText } from './GText';

export type GAvatarSize = keyof typeof theme.components.avatarSizes;

export type GAvatarProps = {
  size?: GAvatarSize;
  uri?: string | null;
  name?: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export function GAvatar({ size = 'md', uri, name = '' }: GAvatarProps) {
  const dim = theme.components.avatarSizes[size];
  const fontSize = Math.round(dim * 0.36);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        accessibilityLabel={name || 'Avatar'}
        style={{
          width: dim,
          height: dim,
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.surfaceMuted,
        }}
      />
    );
  }

  return (
    <View
      accessibilityLabel={name || 'Avatar'}
      style={[
        styles.fallback,
        {
          width: dim,
          height: dim,
          borderRadius: theme.radius.full,
        },
      ]}
    >
      <GText
        variant="label"
        color={theme.colors.primary}
        style={{ fontSize, lineHeight: fontSize + 2, fontWeight: '700' }}
      >
        {initialsFromName(name)}
      </GText>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
});
