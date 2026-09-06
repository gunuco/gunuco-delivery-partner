/** GUNUCO order & delivery workflow domain types */

export type OrderStatus =
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'GOING_TO_PICKUP'
  | 'ARRIVED_AT_PICKUP'
  | 'PICKED_UP'
  | 'GOING_TO_CUSTOMER'
  | 'ARRIVED_AT_CUSTOMER'
  | 'DELIVERY_VERIFICATION'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED';

export type FailReason =
  | 'CUSTOMER_UNAVAILABLE'
  | 'INCORRECT_ADDRESS'
  | 'CUSTOMER_REFUSED'
  | 'UNABLE_TO_CONTACT'
  | 'ACCESS_ISSUE'
  | 'SAFETY_ISSUE'
  | 'PRODUCT_DAMAGED'
  | 'OTHER';

export type VerificationMethod = 'OTP' | 'QR' | 'PHOTO' | 'SIGNATURE';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Address {
  line1: string;
  line2?: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: GeoPoint;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  /** Unit price in paise (integer) */
  unitPricePaise: number;
  imageUrl?: string;
  /** e.g. keep upright, avoid tilting — cake-aware handling */
  handlingInstructions: string[];
  isFragile: boolean;
  isMultiTier?: boolean;
  requiresRefrigeration?: boolean;
  weightGrams?: number;
}

export interface PickupDetails {
  name: string;
  address: Address;
  instructions?: string;
}

export interface DeliveryDetails {
  address: Address;
  instructions?: string;
}

export interface Order {
  id: string;
  /** e.g. GN10284 */
  orderNumber: string;
  status: OrderStatus;
  partnerId?: string;
  customerName: string;
  customerArea: string;
  customerPhoneMasked?: string;
  pickup: PickupDetails;
  delivery: DeliveryDetails;
  items: OrderItem[];
  specialInstructions?: string;
  estimatedEarningsPaise: number;
  distanceKm: number;
  estimatedDurationMinutes: number;
  assignedAt?: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  failReason?: FailReason;
  verificationMethod?: VerificationMethod;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryVerification {
  method: VerificationMethod;
  otp?: string;
  photoUri?: string;
  signatureUri?: string;
  qrPayload?: string;
}
