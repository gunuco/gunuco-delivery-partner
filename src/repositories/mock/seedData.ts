import type {
  AppNotification,
  AuthSession,
  BankDetails,
  Benefit,
  DemandZone,
  DeliveryEarning,
  FaqItem,
  HelpTopic,
  Incentive,
  InsuranceInfo,
  OnboardingProgress,
  Order,
  Partner,
  PartnerDocument,
  PerformanceMetrics,
  PerformanceTrendPoint,
  PersonalDetails,
  Payout,
  Referral,
  Shift,
  SupportTicket,
  Vehicle,
} from '@/src/types';

/** Canonical mock partner phone — store full, mask in UI via maskPhone(). */
export const SEED_PARTNER_PHONE = '+919876543142';
export const SEED_PARTNER_ID = 'partner_keshava_10284';
export const SEED_PARTNER_CODE = 'GN-RD-10284';
/** Mock OTP accepted for any phone — never log this value in repositories. */
export const MOCK_OTP = '482916';

const HUB_PICKUP = {
  name: 'GUNUCO Jubilee Hills Hub',
  address: {
    line1: 'Road No. 36, Jubilee Hills',
    line2: 'Near Peddamma Temple',
    area: 'Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    coordinates: { latitude: 17.4326, longitude: 78.4071 },
  },
  instructions: 'Collect from cake staging counter. Verify upright tags before leaving.',
} as const;

function isoDaysAgo(days: number, hour = 10, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function isoHoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 3_600_000).toISOString();
}

export function createSeedPartner(overrides: Partial<Partner> = {}): Partner {
  const now = new Date().toISOString();
  return {
    id: SEED_PARTNER_ID,
    partnerCode: SEED_PARTNER_CODE,
    phone: SEED_PARTNER_PHONE,
    name: 'Keshava Reddy',
    email: 'keshava.reddy@gunuco.partner',
    photoUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    hubId: 'hub_jubilee_hills',
    hubName: 'GUNUCO Jubilee Hills',
    status: 'APPROVED',
    availability: 'ONLINE',
    rating: 4.87,
    totalDeliveries: 1284,
    onboardingStep: 'COMPLETED',
    createdAt: isoDaysAgo(180),
    updatedAt: now,
    ...overrides,
  };
}

export function createSeedPersonalDetails(): PersonalDetails {
  return {
    fullName: 'Keshava Reddy',
    dateOfBirth: '1994-08-14',
    gender: 'MALE',
    address: 'Flat 302, Sri Sai Residency, Road No. 12',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
  };
}

export function createSeedBankDetails(): BankDetails {
  return {
    accountHolderName: 'Keshava Reddy',
    accountNumberMasked: 'XXXXXX3142',
    ifsc: 'HDFC0001234',
    bankName: 'HDFC Bank',
    verificationStatus: 'VERIFIED',
  };
}

export function createSeedOnboarding(
  overrides: Partial<OnboardingProgress> = {},
): OnboardingProgress {
  return {
    currentStep: 'COMPLETED',
    completedSteps: [
      'PHONE_VERIFIED',
      'PERSONAL_DETAILS',
      'DOCUMENTS',
      'VEHICLE',
      'BANK',
      'TRAINING',
      'SUBMITTED',
    ],
    requiredSteps: [
      'PHONE_VERIFIED',
      'PERSONAL_DETAILS',
      'DOCUMENTS',
      'VEHICLE',
      'BANK',
      'TRAINING',
      'SUBMITTED',
    ],
    ...overrides,
  };
}

export function createSeedVehicle(): Vehicle {
  return {
    id: 'vehicle_activa_1028',
    type: 'TWO_WHEELER',
    make: 'Honda',
    model: 'Activa 6G',
    number: 'TS09XX1028',
    color: 'Pearl Precious White',
    ownership: 'OWNED',
    year: 2023,
  };
}

export function createSeedDocuments(
  allApproved = true,
): PartnerDocument[] {
  const status = allApproved ? 'APPROVED' : 'PENDING';
  return [
    {
      id: 'doc_dl',
      type: 'DRIVING_LICENCE',
      status: allApproved ? 'APPROVED' : 'PENDING',
      fileUrl: 'mock://documents/dl.jpg',
      uploadedAt: isoDaysAgo(90),
      expiryDate: '2028-06-30',
    },
    {
      id: 'doc_rc',
      type: 'RC',
      status,
      fileUrl: 'mock://documents/rc.jpg',
      uploadedAt: isoDaysAgo(90),
      expiryDate: '2027-03-15',
    },
    {
      id: 'doc_insurance',
      type: 'INSURANCE',
      status,
      fileUrl: 'mock://documents/insurance.pdf',
      uploadedAt: isoDaysAgo(88),
      expiryDate: '2026-12-01',
    },
    {
      id: 'doc_identity',
      type: 'IDENTITY',
      status,
      fileUrl: 'mock://documents/aadhaar.jpg',
      uploadedAt: isoDaysAgo(92),
    },
    {
      id: 'doc_photo',
      type: 'PROFILE_PHOTO',
      status: allApproved ? 'APPROVED' : 'NOT_UPLOADED',
      fileUrl: allApproved ? 'mock://documents/profile.jpg' : undefined,
      uploadedAt: allApproved ? isoDaysAgo(91) : undefined,
    },
  ];
}

export function createSeedOrders(partnerId: string): Order[] {
  const now = new Date().toISOString();

  const assigned: Order = {
    id: 'order_gn10284',
    orderNumber: 'GN10284',
    status: 'ASSIGNED',
    partnerId,
    customerName: 'Ananya Sharma',
    customerArea: 'Banjara Hills',
    customerPhoneMasked: '+91 98XXXXXX17',
    pickup: { ...HUB_PICKUP },
    delivery: {
      address: {
        line1: 'Villa 14, Road No. 2',
        line2: 'Near Care Hospital',
        area: 'Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        coordinates: { latitude: 17.4156, longitude: 78.4346 },
      },
      instructions: 'Gate code 4412. Hand to security if customer unavailable.',
    },
    items: [
      {
        id: 'item_truffle',
        name: 'Belgian Chocolate Truffle Cake',
        quantity: 1,
        unitPricePaise: 189900,
        imageUrl:
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
        handlingInstructions: ['KEEP UPRIGHT', 'DO NOT TILT', 'HANDLE WITH CARE'],
        isFragile: true,
        isMultiTier: true,
        requiresRefrigeration: true,
        weightGrams: 1500,
      },
      {
        id: 'item_cookies',
        name: 'Chocolate Chip Cookies',
        quantity: 1,
        unitPricePaise: 44900,
        handlingInstructions: ['KEEP DRY'],
        isFragile: false,
        weightGrams: 400,
      },
    ],
    specialInstructions: 'Birthday order — keep cake upright at all times.',
    estimatedEarningsPaise: 8500,
    distanceKm: 3.4,
    estimatedDurationMinutes: 22,
    assignedAt: now,
    verificationMethod: 'OTP',
    expiresAt: isoHoursFromNow(0.25),
    createdAt: now,
    updatedAt: now,
  };

  const deliveredYesterday: Order = {
    id: 'order_gn10271',
    orderNumber: 'GN10271',
    status: 'DELIVERED',
    partnerId,
    customerName: 'Rahul Mehta',
    customerArea: 'Madhapur',
    customerPhoneMasked: '+91 90XXXXXX55',
    pickup: { ...HUB_PICKUP },
    delivery: {
      address: {
        line1: 'Cyber Towers, Tower A, Floor 8',
        area: 'Madhapur',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081',
        coordinates: { latitude: 17.4484, longitude: 78.3908 },
      },
      instructions: 'Reception desk, mention GUNUCO delivery.',
    },
    items: [
      {
        id: 'item_red_velvet',
        name: 'Red Velvet Brownie Box',
        quantity: 2,
        unitPricePaise: 69900,
        imageUrl:
          'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&h=200&fit=crop',
        handlingInstructions: ['KEEP FLAT', 'AVOID HEAT'],
        isFragile: true,
        requiresRefrigeration: false,
        weightGrams: 800,
      },
    ],
    estimatedEarningsPaise: 7200,
    distanceKm: 6.1,
    estimatedDurationMinutes: 28,
    assignedAt: isoDaysAgo(0, 10, 2),
    acceptedAt: isoDaysAgo(0, 10, 3),
    pickedUpAt: isoDaysAgo(0, 10, 32),
    deliveredAt: isoDaysAgo(0, 11, 24),
    verificationMethod: 'OTP',
    createdAt: isoDaysAgo(0, 10, 0),
    updatedAt: isoDaysAgo(0, 11, 24),
  };

  const deliveredFilmNagar: Order = {
    id: 'order_gn10291',
    orderNumber: 'GN10291',
    status: 'DELIVERED',
    partnerId,
    customerName: 'Priya Nair',
    customerArea: 'Film Nagar',
    customerPhoneMasked: '+91 97XXXXXX08',
    pickup: { ...HUB_PICKUP },
    delivery: {
      address: {
        line1: 'Plot 22, Film Nagar Colony',
        line2: 'Near ANR Gardens',
        area: 'Film Nagar',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500096',
        coordinates: { latitude: 17.4162, longitude: 78.4169 },
      },
    },
    items: [
      {
        id: 'item_opera',
        name: 'Opera Cake Slice Box',
        quantity: 4,
        unitPricePaise: 29900,
        imageUrl:
          'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=200&h=200&fit=crop',
        handlingInstructions: ['KEEP UPRIGHT', 'REFRIGERATE IF DELAYED'],
        isFragile: true,
        requiresRefrigeration: true,
        weightGrams: 600,
      },
    ],
    estimatedEarningsPaise: 6400,
    distanceKm: 2.8,
    estimatedDurationMinutes: 18,
    assignedAt: isoDaysAgo(2, 11, 0),
    acceptedAt: isoDaysAgo(2, 11, 1),
    pickedUpAt: isoDaysAgo(2, 11, 18),
    deliveredAt: isoDaysAgo(2, 11, 42),
    verificationMethod: 'QR',
    createdAt: isoDaysAgo(2, 10, 50),
    updatedAt: isoDaysAgo(2, 11, 42),
  };

  const deliveredKondapur: Order = {
    id: 'order_gn10265',
    orderNumber: 'GN10265',
    status: 'DELIVERED',
    partnerId,
    customerName: 'Vikram Rao',
    customerArea: 'Kondapur',
    customerPhoneMasked: '+91 96XXXXXX33',
    pickup: { ...HUB_PICKUP },
    delivery: {
      address: {
        line1: 'Botanical Garden Road, Apex Heights 5B',
        area: 'Kondapur',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500084',
        coordinates: { latitude: 17.4572, longitude: 78.3679 },
      },
      instructions: 'Call on arrival — lift access via visitor pass.',
    },
    items: [
      {
        id: 'item_mousse',
        name: 'Dark Chocolate Mousse Cake',
        quantity: 1,
        unitPricePaise: 159900,
        imageUrl:
          'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=200&h=200&fit=crop',
        handlingInstructions: ['KEEP UPRIGHT', 'DO NOT TILT', 'COLD CHAIN'],
        isFragile: true,
        isMultiTier: false,
        requiresRefrigeration: true,
        weightGrams: 1200,
      },
      {
        id: 'item_macaron',
        name: 'Assorted Macaron Box',
        quantity: 1,
        unitPricePaise: 89900,
        handlingInstructions: ['KEEP FLAT', 'DO NOT STACK'],
        isFragile: true,
        weightGrams: 350,
      },
    ],
    estimatedEarningsPaise: 9800,
    distanceKm: 8.2,
    estimatedDurationMinutes: 35,
    assignedAt: isoDaysAgo(3, 19, 0),
    acceptedAt: isoDaysAgo(3, 19, 1),
    pickedUpAt: isoDaysAgo(3, 19, 20),
    deliveredAt: isoDaysAgo(3, 20, 5),
    verificationMethod: 'PHOTO',
    createdAt: isoDaysAgo(3, 18, 50),
    updatedAt: isoDaysAgo(3, 20, 5),
  };

  const cancelled: Order = {
    id: 'order_gn10250',
    orderNumber: 'GN10250',
    status: 'CANCELLED',
    partnerId,
    customerName: 'Sneha Kapoor',
    customerArea: 'Jubilee Hills',
    customerPhoneMasked: '+91 95XXXXXX21',
    pickup: { ...HUB_PICKUP },
    delivery: {
      address: {
        line1: 'Road No. 45, Check Post',
        area: 'Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        coordinates: { latitude: 17.4308, longitude: 78.4112 },
      },
    },
    items: [
      {
        id: 'item_cupcake',
        name: 'Vanilla Cupcake Assortment',
        quantity: 12,
        unitPricePaise: 9900,
        handlingInstructions: ['KEEP UPRIGHT'],
        isFragile: true,
        weightGrams: 900,
      },
    ],
    estimatedEarningsPaise: 4500,
    distanceKm: 1.6,
    estimatedDurationMinutes: 12,
    assignedAt: isoDaysAgo(4, 14, 0),
    createdAt: isoDaysAgo(4, 13, 55),
    updatedAt: isoDaysAgo(4, 14, 8),
  };

  return [assigned, deliveredYesterday, deliveredFilmNagar, deliveredKondapur, cancelled];
}

/** Active-order templates used by scenario seeder (cloned & status-patched). */
export function createActiveOrderTemplate(
  partnerId: string,
  status: Order['status'],
): Order {
  const base = createSeedOrders(partnerId)[0];
  const now = new Date().toISOString();
  const order: Order = {
    ...base,
    id: 'order_active_scenario',
    orderNumber: 'GN10284',
    status,
    partnerId,
    updatedAt: now,
    assignedAt: now,
  };

  if (status !== 'ASSIGNED') {
    order.acceptedAt = now;
  }
  if (
    status === 'PICKED_UP' ||
    status === 'GOING_TO_CUSTOMER' ||
    status === 'ARRIVED_AT_CUSTOMER' ||
    status === 'DELIVERY_VERIFICATION' ||
    status === 'DELIVERED' ||
    status === 'FAILED'
  ) {
    order.pickedUpAt = now;
  }
  if (status === 'DELIVERED') {
    order.deliveredAt = now;
  }
  if (status === 'FAILED') {
    order.failedAt = now;
    order.failReason = 'CUSTOMER_UNAVAILABLE';
  }
  return order;
}

export function createSeedEarnings(partnerId: string): DeliveryEarning[] {
  void partnerId;
  return [
    {
      id: 'earn_gn10271',
      orderId: 'order_gn10271',
      orderNumber: 'GN10271',
      date: isoDaysAgo(1, 17, 5),
      breakdown: {
        basePaise: 4500,
        distancePaise: 1800,
        surgePaise: 500,
        incentivePaise: 400,
        adjustmentsPaise: 0,
        deductionsPaise: 0,
        netPaise: 7200,
      },
      status: 'SETTLED',
    },
    {
      id: 'earn_gn10291',
      orderId: 'order_gn10291',
      orderNumber: 'GN10291',
      date: isoDaysAgo(2, 11, 42),
      breakdown: {
        basePaise: 4200,
        distancePaise: 1200,
        surgePaise: 0,
        incentivePaise: 1000,
        adjustmentsPaise: 0,
        deductionsPaise: 0,
        netPaise: 6400,
      },
      status: 'SETTLED',
    },
    {
      id: 'earn_gn10265',
      orderId: 'order_gn10265',
      orderNumber: 'GN10265',
      date: isoDaysAgo(3, 20, 5),
      breakdown: {
        basePaise: 5000,
        distancePaise: 2800,
        surgePaise: 1200,
        incentivePaise: 800,
        adjustmentsPaise: 0,
        deductionsPaise: 0,
        netPaise: 9800,
      },
      status: 'SETTLED',
    },
    {
      id: 'earn_gn10240',
      orderId: 'order_gn10240',
      orderNumber: 'GN10240',
      date: isoDaysAgo(0, 9, 30),
      breakdown: {
        basePaise: 4500,
        distancePaise: 1500,
        surgePaise: 0,
        incentivePaise: 0,
        adjustmentsPaise: 0,
        deductionsPaise: 0,
        netPaise: 6000,
      },
      status: 'PENDING',
    },
  ];
}

export function createSeedPayouts(): Payout[] {
  return [
    {
      id: 'payout_week_prev',
      amountPaise: 184500,
      status: 'PAID',
      scheduledAt: isoDaysAgo(7, 0, 0),
      paidAt: isoDaysAgo(6, 18, 0),
      method: 'Bank transfer',
    },
    {
      id: 'payout_week_current',
      amountPaise: 92800,
      status: 'PROCESSING',
      scheduledAt: isoHoursFromNow(24),
      method: 'Bank transfer',
    },
  ];
}

export function createSeedIncentives(): Incentive[] {
  const weekStart = isoDaysAgo(2, 0, 0);
  const weekEnd = isoHoursFromNow(120);
  return [
    {
      id: 'inc_weekly_orders',
      title: 'Weekend Cake Rush',
      description: 'Complete 12 deliveries this week for a bonus.',
      targetType: 'WEEKLY',
      targetValue: 12,
      currentValue: 9,
      rewardPaise: 25000,
      status: 'ACTIVE',
      validFrom: weekStart,
      validTo: weekEnd,
      remainingLabel: '3 orders left',
    },
    {
      id: 'inc_peak_evening',
      title: 'Evening Peak Bonus',
      description: 'Deliver during 6–10 PM peak window.',
      targetType: 'PEAK_HOURS',
      targetValue: 5,
      currentValue: 3,
      rewardPaise: 15000,
      status: 'ACTIVE',
      validFrom: weekStart,
      validTo: weekEnd,
      remainingLabel: '2 peak deliveries left',
    },
    {
      id: 'inc_earnings_streak',
      title: 'Earn ₹2,000 this week',
      description: 'Hit weekly earnings target across Jubilee Hills hub.',
      targetType: 'EARNINGS',
      targetValue: 200000,
      currentValue: 142500,
      rewardPaise: 20000,
      status: 'ACTIVE',
      validFrom: weekStart,
      validTo: weekEnd,
      remainingLabel: '₹575 left',
    },
    {
      id: 'inc_completed_last',
      title: 'Monday Marathon',
      description: 'Completed 8 Monday deliveries.',
      targetType: 'ORDERS',
      targetValue: 8,
      currentValue: 8,
      rewardPaise: 10000,
      status: 'COMPLETED',
      validFrom: isoDaysAgo(10),
      validTo: isoDaysAgo(3),
    },
  ];
}

export function createSeedPerformance(): PerformanceMetrics {
  return {
    acceptanceRate: 0.94,
    completionRate: 0.97,
    onTimeRate: 0.91,
    customerRating: 4.87,
    partnerScore: 92,
    ordersCompleted: 48,
    distanceTravelledKm: 186.4,
    period: 'WEEK',
  };
}

export function createSeedPerformanceTrend(): PerformanceTrendPoint[] {
  return [
    { date: isoDaysAgo(6), score: 88, ordersCompleted: 6 },
    { date: isoDaysAgo(5), score: 90, ordersCompleted: 7 },
    { date: isoDaysAgo(4), score: 89, ordersCompleted: 5 },
    { date: isoDaysAgo(3), score: 91, ordersCompleted: 8 },
    { date: isoDaysAgo(2), score: 93, ordersCompleted: 9 },
    { date: isoDaysAgo(1), score: 92, ordersCompleted: 7 },
    { date: isoDaysAgo(0), score: 92, ordersCompleted: 6 },
  ];
}

export function createSeedShifts(): Shift[] {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const date = `${yyyy}-${mm}-${dd}`;

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  return [
    {
      id: 'shift_today_morning',
      date,
      startTime: '09:00',
      endTime: '13:00',
      hubName: 'GUNUCO Jubilee Hills',
      area: 'Jubilee Hills',
      status: 'ACTIVE',
      capacity: 20,
      bookedCount: 14,
      estimatedEarningsPaise: 45000,
      incentiveNote: 'Morning bakery rush',
    },
    {
      id: 'shift_today_evening',
      date,
      startTime: '17:00',
      endTime: '22:00',
      hubName: 'GUNUCO Jubilee Hills',
      area: 'Film Nagar / Banjara Hills',
      status: 'BOOKED',
      capacity: 25,
      bookedCount: 18,
      estimatedEarningsPaise: 72000,
      incentiveNote: 'Peak hours + surge',
    },
    {
      id: 'shift_tomorrow_noon',
      date: tDate,
      startTime: '12:00',
      endTime: '16:00',
      hubName: 'GUNUCO Jubilee Hills',
      area: 'Madhapur / Kondapur',
      status: 'AVAILABLE',
      capacity: 22,
      bookedCount: 9,
      estimatedEarningsPaise: 52000,
    },
  ];
}

export function createSeedDemandZones(
  level: DemandZone['level'] = 'NORMAL',
): DemandZone[] {
  const highBoost = level === 'HIGH' ? 1.4 : level === 'LOW' ? 1.0 : 1.15;
  return [
    {
      id: 'zone_jubilee',
      name: 'Jubilee Hills',
      level,
      center: { latitude: 17.4326, longitude: 78.4071 },
      radiusKm: 2.5,
      surgeMultiplier: level === 'HIGH' ? 1.5 : highBoost,
      activeOrdersEstimate: level === 'HIGH' ? 28 : level === 'LOW' ? 4 : 12,
    },
    {
      id: 'zone_banjara',
      name: 'Banjara Hills',
      level: level === 'HIGH' ? 'HIGH' : 'NORMAL',
      center: { latitude: 17.4156, longitude: 78.4346 },
      radiusKm: 2.2,
      surgeMultiplier: level === 'HIGH' ? 1.35 : 1.1,
      activeOrdersEstimate: level === 'HIGH' ? 22 : 9,
    },
    {
      id: 'zone_film_nagar',
      name: 'Film Nagar',
      level: level === 'HIGH' ? 'HIGH' : 'NORMAL',
      center: { latitude: 17.4162, longitude: 78.4169 },
      radiusKm: 1.8,
      surgeMultiplier: level === 'HIGH' ? 1.45 : 1.05,
      activeOrdersEstimate: level === 'HIGH' ? 18 : 7,
    },
    {
      id: 'zone_madhapur',
      name: 'Madhapur',
      level: level === 'LOW' ? 'LOW' : 'NORMAL',
      center: { latitude: 17.4484, longitude: 78.3908 },
      radiusKm: 3.0,
      surgeMultiplier: 1.0,
      activeOrdersEstimate: level === 'LOW' ? 3 : 8,
    },
    {
      id: 'zone_kondapur',
      name: 'Kondapur',
      level: level === 'LOW' ? 'LOW' : 'NORMAL',
      center: { latitude: 17.4572, longitude: 78.3679 },
      radiusKm: 2.8,
      surgeMultiplier: 1.0,
      activeOrdersEstimate: level === 'LOW' ? 2 : 6,
    },
  ];
}

export function createSeedNotifications(): AppNotification[] {
  return [
    {
      id: 'notif_order_new',
      category: 'ORDER',
      title: 'New order nearby',
      body: 'GN10284 — Belgian Chocolate Truffle Cake to Banjara Hills.',
      read: false,
      createdAt: new Date().toISOString(),
      deepLink: '/orders/order_gn10284',
    },
    {
      id: 'notif_incentive',
      category: 'INCENTIVES',
      title: '3 orders left for Weekend Cake Rush',
      body: 'Complete 3 more deliveries to unlock ₹250 bonus.',
      read: false,
      createdAt: isoDaysAgo(0, 8, 0),
      deepLink: '/incentives',
    },
    {
      id: 'notif_payout',
      category: 'EARNINGS',
      title: 'Payout processing',
      body: 'Your weekly payout of ₹928 is being processed.',
      read: true,
      createdAt: isoDaysAgo(1, 10, 0),
      deepLink: '/earnings/payouts',
    },
    {
      id: 'notif_shift',
      category: 'SHIFT',
      title: 'Evening shift reminder',
      body: 'Your 5–10 PM shift at Jubilee Hills starts soon.',
      read: true,
      createdAt: isoDaysAgo(0, 15, 0),
      deepLink: '/shifts',
    },
  ];
}

export function createSeedTickets(includeOpen: boolean): SupportTicket[] {
  if (!includeOpen) {
    return [];
  }
  return [
    {
      id: 'ticket_fail_gn',
      category: 'CUSTOMER_ISSUE',
      subject: 'Customer unavailable — GN10284',
      description: 'Reached address twice; no response at gate.',
      status: 'OPEN',
      orderId: 'order_active_scenario',
      createdAt: isoDaysAgo(0, 18, 0),
      updatedAt: isoDaysAgo(0, 18, 30),
      messages: [
        {
          id: 'msg_1',
          sender: 'PARTNER',
          body: 'Customer not answering calls. Waiting at gate.',
          createdAt: isoDaysAgo(0, 18, 0),
        },
        {
          id: 'msg_2',
          sender: 'SUPPORT',
          body: 'Thanks Keshava. We are trying the customer. Please wait 5 minutes.',
          createdAt: isoDaysAgo(0, 18, 12),
        },
      ],
    },
    {
      id: 'ticket_earnings',
      category: 'PAYMENT_EARNINGS',
      subject: 'Peak bonus not reflected',
      description: 'Evening peak incentive for yesterday looks incomplete.',
      status: 'IN_PROGRESS',
      createdAt: isoDaysAgo(2, 12, 0),
      updatedAt: isoDaysAgo(1, 9, 0),
      messages: [
        {
          id: 'msg_e1',
          sender: 'PARTNER',
          body: 'Peak bonus for 3 deliveries not credited.',
          createdAt: isoDaysAgo(2, 12, 0),
        },
      ],
    },
  ];
}

export function createSeedFaqs(): FaqItem[] {
  return [
    {
      id: 'faq_upright',
      category: 'Delivery',
      question: 'How should I carry multi-tier cakes?',
      answer:
        'Always keep cakes upright, use the provided box base, and avoid sudden braking. Do not tilt or place bags on top.',
    },
    {
      id: 'faq_otp',
      category: 'Delivery',
      question: 'What if the customer OTP does not work?',
      answer:
        'Confirm the order number with the customer, retry once, then contact GUNUCO support from the order screen.',
    },
    {
      id: 'faq_payout',
      category: 'Earnings',
      question: 'When are weekly payouts credited?',
      answer:
        'Payouts are initiated every Monday for the previous week and usually settle within 24–48 hours.',
    },
  ];
}

export function createSeedHelpTopics(): HelpTopic[] {
  return [
    {
      id: 'help_orders',
      title: 'Orders & delivery',
      description: 'Pickup, handling, and verification help',
      icon: 'orderAssigned',
    },
    {
      id: 'help_earnings',
      title: 'Earnings & payouts',
      description: 'Breakups, incentives, and bank credits',
      icon: 'earnings',
    },
    {
      id: 'help_account',
      title: 'Account & documents',
      description: 'Profile, KYC, and vehicle details',
      icon: 'account',
    },
  ];
}

export function createSeedBenefits(): Benefit[] {
  return [
    {
      id: 'ben_accident',
      title: 'On-trip accident cover',
      description: 'Coverage while fulfilling GUNUCO deliveries.',
      status: 'ACTIVE',
      provider: 'GUNUCO Protect',
      validUntil: '2026-12-31',
    },
    {
      id: 'ben_health',
      title: 'Partner health assist',
      description: 'Tele-consult access for active partners.',
      status: 'ACTIVE',
      provider: 'GUNUCO Care',
      validUntil: '2026-12-31',
    },
  ];
}

export function createSeedInsurance(): InsuranceInfo {
  return {
    provider: 'GUNUCO Protect',
    policyNumberMasked: 'GP-XXXX-10284',
    coverageSummary: 'On-trip personal accident up to ₹5 Lakh',
    status: 'ACTIVE',
    validUntil: '2026-12-31',
  };
}

export function createSeedReferral(): Referral {
  return {
    id: 'ref_keshava',
    code: 'KESHAVA10284',
    invitedCount: 5,
    rewardedCount: 2,
    totalRewardPaise: 100000,
    history: [
      {
        id: 'ref_entry_1',
        inviteeName: 'Suresh Kumar',
        status: 'REWARDED',
        rewardPaise: 50000,
        createdAt: isoDaysAgo(40),
      },
      {
        id: 'ref_entry_2',
        inviteeName: 'Arjun Patel',
        status: 'REWARDED',
        rewardPaise: 50000,
        createdAt: isoDaysAgo(25),
      },
      {
        id: 'ref_entry_3',
        inviteeName: 'Naveen G',
        status: 'JOINED',
        createdAt: isoDaysAgo(8),
      },
      {
        id: 'ref_entry_4',
        inviteeName: 'Manoj',
        status: 'PENDING',
        createdAt: isoDaysAgo(2),
      },
    ],
  };
}

export function createSeedSession(partnerId: string = SEED_PARTNER_ID): AuthSession {
  return {
    accessToken: `mock_access_${partnerId}`,
    refreshToken: `mock_refresh_${partnerId}`,
    expiresAt: isoHoursFromNow(12),
    partnerId,
  };
}

export interface SeedBundle {
  partner: Partner;
  personalDetails: PersonalDetails;
  bankDetails: BankDetails;
  onboarding: OnboardingProgress;
  orders: Order[];
  earnings: DeliveryEarning[];
  payouts: Payout[];
  incentives: Incentive[];
  performance: PerformanceMetrics;
  performanceTrend: PerformanceTrendPoint[];
  shifts: Shift[];
  demandZones: DemandZone[];
  notifications: AppNotification[];
  tickets: SupportTicket[];
  faqs: FaqItem[];
  helpTopics: HelpTopic[];
  documents: PartnerDocument[];
  vehicle: Vehicle;
  benefits: Benefit[];
  insurance: InsuranceInfo;
  referral: Referral;
  session: AuthSession | null;
}

export function createFullSeed(options?: {
  loggedIn?: boolean;
  partnerOverrides?: Partial<Partner>;
}): SeedBundle {
  const partner = createSeedPartner(options?.partnerOverrides);
  return {
    partner,
    personalDetails: createSeedPersonalDetails(),
    bankDetails: createSeedBankDetails(),
    onboarding: createSeedOnboarding(),
    orders: createSeedOrders(partner.id),
    earnings: createSeedEarnings(partner.id),
    payouts: createSeedPayouts(),
    incentives: createSeedIncentives(),
    performance: createSeedPerformance(),
    performanceTrend: createSeedPerformanceTrend(),
    shifts: createSeedShifts(),
    demandZones: createSeedDemandZones('NORMAL'),
    notifications: createSeedNotifications(),
    tickets: [],
    faqs: createSeedFaqs(),
    helpTopics: createSeedHelpTopics(),
    documents: createSeedDocuments(true),
    vehicle: createSeedVehicle(),
    benefits: createSeedBenefits(),
    insurance: createSeedInsurance(),
    referral: createSeedReferral(),
    session: options?.loggedIn === false ? null : createSeedSession(partner.id),
  };
}
