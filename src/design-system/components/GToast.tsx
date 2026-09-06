import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../theme';
import { GText } from './GText';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ShowToastOptions = {
  type?: ToastType;
  message: string;
  durationMs?: number;
};

type ToastContextValue = {
  showToast: (options: ShowToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const typeColors: Record<ToastType, string> = {
  success: theme.colors.success,
  error: theme.colors.danger,
  warning: theme.colors.warning,
  info: theme.colors.info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      setToast(null);
    });
  }, [opacity]);

  const showToast = useCallback(
    ({ type = 'info', message, durationMs = 2800 }: ShowToastOptions) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setToast({ type, message });
      opacity.setValue(0);
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      timerRef.current = setTimeout(hide, durationMs);
    },
    [hide, opacity],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              top: insets.top + theme.spacing[3],
              opacity,
              borderLeftColor: typeColors[toast.type],
            },
          ]}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          <GText variant="bodyBold" color={theme.colors.text}>
            {toast.message}
          </GText>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: theme.spacing[4],
    right: theme.spacing[4],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderLeftWidth: 4,
    ...theme.shadows.md,
    zIndex: 1000,
  },
});
