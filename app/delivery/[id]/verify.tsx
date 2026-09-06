import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  GButton,
  GCard,
  GErrorState,
  GHeader,
  GInput,
  GLoader,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import {
  deliveryCompleteHref,
  deliveryHubHref,
} from '@/src/features/orders/deliveryRouting';
import { useOrder, useOrderActions } from '@/src/hooks';
import type { DeliveryVerification, VerificationMethod } from '@/src/types';

export default function VerifyScreen() {
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = typeof id === 'string' ? id : undefined;
  const { order, isLoading, error, refetch } = useOrder(orderId);
  const { verifyDelivery, markArrivedAtCustomer, complete, isActing } =
    useOrderActions();

  const method: VerificationMethod = order?.verificationMethod ?? 'OTP';
  const [otp, setOtp] = useState('');
  const [qrPayload, setQrPayload] = useState('');
  const [photoUri, setPhotoUri] = useState('');
  const [signatureUri, setSignatureUri] = useState('');

  const title = useMemo(() => {
    switch (method) {
      case 'OTP':
        return 'Enter delivery OTP';
      case 'QR':
        return 'Scan customer QR';
      case 'PHOTO':
        return 'Photo proof';
      case 'SIGNATURE':
        return 'Customer signature';
      default:
        return 'Verify delivery';
    }
  }, [method]);

  const buildVerification = useCallback((): DeliveryVerification | null => {
    switch (method) {
      case 'OTP': {
        const cleaned = otp.replace(/\D/g, '');
        if (cleaned.length < 4) return null;
        return { method: 'OTP', otp: cleaned };
      }
      case 'QR':
        if (!qrPayload.trim()) return null;
        return { method: 'QR', qrPayload: qrPayload.trim() };
      case 'PHOTO':
        if (!photoUri.trim()) return null;
        return { method: 'PHOTO', photoUri: photoUri.trim() };
      case 'SIGNATURE':
        if (!signatureUri.trim()) return null;
        return { method: 'SIGNATURE', signatureUri: signatureUri.trim() };
      default:
        return null;
    }
  }, [method, otp, photoUri, qrPayload, signatureUri]);

  const onSubmit = useCallback(async () => {
    if (!order) return;
    const verification = buildVerification();
    if (!verification) {
      toast.showToast({ type: 'warning', message: 'Complete verification first' });
      return;
    }
    try {
      if (order.status === 'ARRIVED_AT_CUSTOMER') {
        // ensure workflow can move into verification when needed
      } else if (order.status === 'GOING_TO_CUSTOMER') {
        await markArrivedAtCustomer(order.id);
      }
      await verifyDelivery(order.id, verification);
      await complete(order.id);
      toast.showToast({ type: 'success', message: 'Delivery verified' });
      router.replace(deliveryCompleteHref(order.id));
    } catch {
      toast.showToast({ type: 'error', message: 'Verification failed' });
    }
  }, [
    buildVerification,
    complete,
    markArrivedAtCustomer,
    order,
    toast,
    verifyDelivery,
  ]);

  if (isLoading) {
    return (
      <View style={styles.root}>
        <GHeader title="Verify" showBack onBack={() => router.back()} />
        <GLoader label="Loading verification…" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.root}>
        <GHeader title="Verify" showBack onBack={() => router.back()} />
        <GErrorState
          title="Verification unavailable"
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <GHeader
        title="Verify delivery"
        subtitle={`#${order.orderNumber}`}
        showBack
        onBack={() => router.push(deliveryHubHref(order.id))}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <GCard padding="md" style={styles.card}>
          <GText variant="h3">{title}</GText>
          <GText variant="body" color={theme.colors.textSecondary}>
            Method: {method} · Customer {order.customerName}
          </GText>
        </GCard>

        {method === 'OTP' ? (
          <GInput
            label="OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="Enter code"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            secureTextEntry
          />
        ) : null}

        {method === 'QR' ? (
          <GCard padding="md" style={styles.card}>
            <GText variant="body">
              QR scanner shell — paste or capture payload to continue.
            </GText>
            <GInput
              label="QR payload"
              value={qrPayload}
              onChangeText={setQrPayload}
              placeholder="Scan result"
              autoCapitalize="none"
            />
            <GButton
              title="Simulate scan"
              variant="secondary"
              onPress={() => setQrPayload(`GN-QR-${order.orderNumber}`)}
            />
          </GCard>
        ) : null}

        {method === 'PHOTO' ? (
          <GCard padding="md" style={styles.card}>
            <GText variant="body">
              Photo capture shell — attach a proof URI to continue.
            </GText>
            <GInput
              label="Photo URI"
              value={photoUri}
              onChangeText={setPhotoUri}
              placeholder="file:// or https://"
              autoCapitalize="none"
            />
            <GButton
              title="Simulate photo"
              variant="secondary"
              onPress={() => setPhotoUri(`mock://delivery-photo/${order.id}`)}
            />
          </GCard>
        ) : null}

        {method === 'SIGNATURE' ? (
          <GCard padding="md" style={styles.card}>
            <GText variant="body">
              Signature pad shell — capture signature URI to continue.
            </GText>
            <GInput
              label="Signature URI"
              value={signatureUri}
              onChangeText={setSignatureUri}
              placeholder="file://signature"
              autoCapitalize="none"
            />
            <GButton
              title="Simulate signature"
              variant="secondary"
              onPress={() => setSignatureUri(`mock://signature/${order.id}`)}
            />
          </GCard>
        ) : null}

        <GButton
          title="Submit verification"
          size="lg"
          fullWidth
          loading={isActing}
          onPress={() => {
            void onSubmit();
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing[4],
    gap: theme.spacing[4],
    paddingBottom: theme.spacing[10],
  },
  card: {
    gap: theme.spacing[3],
  },
});
