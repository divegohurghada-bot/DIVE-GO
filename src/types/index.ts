export type KnowledgeSourceType =
  | 'OWNER_VERIFIED'
  | 'MASTER_DB'
  | 'CURRENT_TOUR_SOURCE'
  | 'OFFICIAL_WEBSITE'
  | 'AUTHORIZED_PLATFORM'
  | 'DOCUMENTS'
  | 'RESERVATION_DATA'
  | 'CUSTOMER_STATEMENT'
  | 'AI_INFERENCE';

export interface BusinessProfile {
  isBlank: boolean;
  companyName: string;
  legalName: string;
  website: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  ownerAlertWhatsapp: string;
  location: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  destinations: string[];
  yearsExperience: number;
  story: string;
  values: string[];
  targetMarkets: string[];
  currency: string;
  timezone: string;
  operatingHours: string;
  aiTone: 'formal' | 'friendly' | 'enthusiastic';
  aiDetailLevel: 'short' | 'balanced' | 'detailed';
  aiSalesOrientation: 'informational' | 'consultative' | 'proactive';
  aiForbiddenPromises: string[];
  aiEscalationTriggers: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'diving' | 'sea_trip' | 'desert_safari' | 'transfer' | 'city_tour' | 'cruise' | 'activity';
  description: string;
  priceAdult: number;
  priceChild: number;
  currency: string;
  durationHours: number;
  departureTimes: string[];
  meetingPoint: string;
  pickupAreasIncluded: string[];
  inclusions: string[];
  exclusions: string[];
  minParticipants: number;
  maxCapacity: number;
  cancellationPolicy: string;
  childPolicy: string;
  languagesOffered: string[];
  verificationSource: KnowledgeSourceType;
  updatedAt: string;
  isAvailable: boolean;
}

export interface KnowledgeItem {
  id: string;
  category: 'pricing' | 'policy' | 'service_detail' | 'location_pickup' | 'faq' | 'operational_rule';
  subject: string;
  content: string;
  sourceType: KnowledgeSourceType;
  sourceName: string;
  confidence: number; // 0.0 to 1.0
  verifiedByOwner: boolean;
  expiresAt: string | null; // ISO date string or null
  status: 'active' | 'stale' | 'conflicted' | 'pending_review';
  version: number;
  updatedAt: string;
}

export interface KnowledgeConflict {
  id: string;
  subject: string;
  serviceId?: string;
  field: 'price' | 'child_policy' | 'departure_time' | 'pickup_rule' | 'general';
  sourceA: {
    source: string;
    sourceType: KnowledgeSourceType;
    value: string;
    priority: number;
  };
  sourceB: {
    source: string;
    sourceType: KnowledgeSourceType;
    value: string;
    priority: number;
  };
  resolvedValue: string | null;
  status: 'OPEN' | 'RESOLVED_BY_RULE' | 'RESOLVED_BY_OWNER';
  detectedAt: string;
  notes: string;
}

export interface KnowledgeGap {
  id: string;
  question: string;
  category: string;
  serviceId?: string;
  customerLanguage: string;
  frequency: number;
  status: 'PENDING_OWNER_ANSWER' | 'RESOLVED' | 'DISMISSED';
  ownerAnswer?: string;
  createdAt: string;
  answeredAt?: string;
}

export type PaymentStatus = 'PENDING' | 'DEPOSIT_PAID' | 'CASH_ON_ARRIVAL' | 'PAID_FULL' | 'REFUNDED';
export type BookingStatus = 'CONFIRMED' | 'MODIFIED' | 'CANCELLED' | 'COMPLETED';

export interface Reservation {
  id: string;
  bookingCode: string;
  serviceId: string;
  serviceTitle: string;
  bookingDate: string;
  serviceDate: string; // YYYY-MM-DD
  pickupTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  whatsappNumber: string;
  hotelName: string;
  roomNumber: string;
  adultsCount: number;
  childrenCount: number;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  specialRequests: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  sourceChannel: 'AI_SALES_AGENT' | 'WHATSAPP' | 'MANUAL_DESK' | 'VIATOR_API' | 'GYG_API';
}

export interface OwnerAlert {
  id: string;
  eventId: string;
  timestamp: string;
  priority: 'P0_CRITICAL' | 'P1_HIGH' | 'P2_NORMAL';
  type:
    | 'NEW_BOOKING'
    | 'HOT_LEAD'
    | 'PAYMENT_ISSUE'
    | 'SERIOUS_COMPLAINT'
    | 'KNOWLEDGE_GAP'
    | 'AI_UNCERTAINTY'
    | 'SYSTEM_ERROR';
  title: string;
  message: string;
  recipientNumber: string;
  deliveryStatus: 'DELIVERED' | 'QUEUED' | 'RETRYING' | 'FAILED';
  retryCount: number;
  acknowledged: boolean;
}

export interface SocialPost {
  id: string;
  platform: 'Instagram' | 'Facebook' | 'TikTok';
  headline: string;
  caption: string;
  callToAction: string;
  hashtags: string[];
  imagePrompt: string;
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED' | 'SIMULATED';
  serviceGrounded: string;
  verifiedPrice: string;
  scheduledTime?: string;
  createdAt: string;
}

export interface SocialComment {
  id: string;
  platform: 'Instagram' | 'Facebook' | 'TikTok';
  author: string;
  commentText: string;
  detectedIntent: 'QUESTION' | 'PRAISE' | 'COMPLAINT' | 'PRICING' | 'SPAM';
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  suggestedReply: string;
  status: 'PENDING_APPROVAL' | 'AUTO_REPLIED' | 'ESCALATED';
  timestamp: string;
}

export interface PlatformConnector {
  id: 'getyourguide' | 'tripadvisor' | 'viator' | 'meta' | 'tiktok';
  name: string;
  category: 'OTA' | 'SOCIAL';
  officialApiName: string;
  status: 'CONNECTED' | 'CREDENTIALS_REQUIRED' | 'BLOCKED_BY_APPROVAL' | 'NOT_CONFIGURED';
  authType: 'OAuth 2.0' | 'API Key / Secret' | 'Partner Token';
  scopes: string[];
  rateLimitPerMin: number;
  lastSyncAt: string | null;
  supportedActions: string[];
  unsupportedActions: string[];
  notes: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: 'OWNER' | 'ADMIN' | 'STAFF' | 'AI_AGENT' | 'SYSTEM' | 'AUDITOR';
  action: string;
  entityType: 'RESERVATION' | 'SERVICE' | 'KNOWLEDGE' | 'CONFLICT' | 'ALERT' | 'INTEGRATION';
  entityId: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  tenantId: string;
}

export interface HealthCheckState {
  database: { status: 'HEALTHY' | 'DEGRADED' | 'FAILED'; latencyMs: number };
  aiProvider: { status: 'HEALTHY' | 'DEGRADED' | 'FAILED' | 'NOT_CONFIGURED'; model: string; keyPresent: boolean };
  whatsapp: { status: 'HEALTHY' | 'DEGRADED' | 'FAILED' | 'NOT_CONFIGURED'; notes: string };
  socialConnectors: { status: 'HEALTHY' | 'DEGRADED' | 'FAILED' | 'NOT_CONFIGURED'; notes: string };
  queueWorker: { status: 'HEALTHY' | 'DEGRADED' | 'FAILED'; pendingJobs: number };
  storage: { status: 'HEALTHY' | 'DEGRADED' | 'FAILED'; availableMb: number };
  webhookSecurity: { status: 'HEALTHY' | 'FAILED'; hmacEnabled: boolean };
}

export interface TestScenarioResult {
  scenarioId: number;
  name: string;
  description: string;
  category: 'CORE' | 'AI_SALES' | 'BOOKING' | 'KNOWLEDGE' | 'SECURITY' | 'RESILIENCE';
  status: 'PASSED' | 'FAILED' | 'BLOCKED' | 'SIMULATED';
  executionTimeMs: number;
  evidence: string;
  logs: string[];
}
