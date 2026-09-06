/**
 * Indian mobile helpers for GUNUCO partner auth & display.
 */

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Normalizes to a 10-digit Indian mobile when possible.
 */
function toTenDigitMobile(phone: string): string | null {
  const digits = digitsOnly(phone);
  if (digits.length === 10 && INDIAN_MOBILE_REGEX.test(digits)) {
    return digits;
  }
  if (digits.length === 12 && digits.startsWith('91') && INDIAN_MOBILE_REGEX.test(digits.slice(2))) {
    return digits.slice(2);
  }
  if (
    digits.length === 11 &&
    digits.startsWith('0') &&
    INDIAN_MOBILE_REGEX.test(digits.slice(1))
  ) {
    return digits.slice(1);
  }
  return null;
}

/**
 * Masks a phone for display, e.g. "+91 98XXXXXX42".
 */
export function maskPhone(phone: string): string {
  const ten = toTenDigitMobile(phone);
  if (!ten) {
    const digits = digitsOnly(phone);
    if (digits.length < 4) {
      return phone;
    }
    const visibleStart = digits.slice(0, 2);
    const visibleEnd = digits.slice(-2);
    return `${visibleStart}${'X'.repeat(Math.max(digits.length - 4, 0))}${visibleEnd}`;
  }

  const prefix = ten.slice(0, 2);
  const suffix = ten.slice(-2);
  return `+91 ${prefix}XXXXXX${suffix}`;
}

export function isValidIndianMobile(phone: string): boolean {
  return toTenDigitMobile(phone) !== null;
}

/** Returns 10-digit Indian mobile or null. */
export function getTenDigitMobile(phone: string): string | null {
  return toTenDigitMobile(phone);
}

/** Formats to E.164 Indian mobile (+91XXXXXXXXXX). */
export function toE164Indian(phone: string): string | null {
  const ten = toTenDigitMobile(phone);
  return ten ? `+91${ten}` : null;
}
