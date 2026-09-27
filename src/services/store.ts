import {
  BusinessProfile,
  ServiceItem,
  KnowledgeItem,
  KnowledgeConflict,
  KnowledgeGap,
  Reservation,
  OwnerAlert,
  SocialPost,
  SocialComment,
  PlatformConnector,
  AuditLogEntry,
  KnowledgeSourceType,
} from '../types';

const STORAGE_KEY = 'TRAVEL_AI_COMMAND_CENTER_STATE_V1';

export const KNOWLEDGE_PRECEDENCE: Record<KnowledgeSourceType, number> = {
  OWNER_VERIFIED: 100,
  MASTER_DB: 90,
  CURRENT_TOUR_SOURCE: 80,
  OFFICIAL_WEBSITE: 70,
  AUTHORIZED_PLATFORM: 60,
  DOCUMENTS: 50,
  RESERVATION_DATA: 40,
  CUSTOMER_STATEMENT: 20, // Never authoritative
  AI_INFERENCE: 10,
};

export interface AppState {
  currentTenantId: string;
  userRole: 'OWNER' | 'ADMIN' | 'STAFF' | 'AUDITOR';
  profile: BusinessProfile;
  services: ServiceItem[];
  knowledgeBase: KnowledgeItem[];
  conflicts: KnowledgeConflict[];
  gaps: KnowledgeGap[];
  reservations: Reservation[];
  alerts: OwnerAlert[];
  socialPosts: SocialPost[];
  socialComments: SocialComment[];
  connectors: PlatformConnector[];
  auditLogs: AuditLogEntry[];
}

export const BLANK_PROFILE: BusinessProfile = {
  isBlank: true,
  companyName: '',
  legalName: '',
  website: '',
  phone: '',
  email: '',
  whatsappNumber: '',
  ownerAlertWhatsapp: '',
  location: '',
  destinations: [],
  yearsExperience: 0,
  story: '',
  values: [],
  targetMarkets: [],
  currency: 'EUR (€)',
  timezone: 'Africa/Cairo (UTC+2)',
  operatingHours: '08:00 - 20:00 Daily',
  aiTone: 'friendly',
  aiDetailLevel: 'balanced',
  aiSalesOrientation: 'consultative',
  aiForbiddenPromises: [
    'Never promise free private boat upgrades without owner sign-off',
    'Never promise dolphin encounters are 100% guaranteed (wild animals)',
    'Never confirm booking without hotel name and room number',
    'Never alter prices or offer unapproved cash discounts',
  ],
  aiEscalationTriggers: [
    'Customer mentions medical issue or ear equalization barotrauma',
    'Customer requests refund or reports safety incident',
    'Customer wants VIP private yacht charter for over 15 people',
    'Unlisted tour destination requested',
  ],
};

export const DIVE_GO_HURGHADA_PROFILE: BusinessProfile = {
  isBlank: false,
  companyName: 'Dive Go Hurghada',
  legalName: 'Dive Go Hurghada Red Sea Marine Excursions Ltd.',
  website: 'https://www.divegohurghada.com/',
  phone: '+2 0103 94 64 284',
  email: 'divegohurghada@gmail.com',
  whatsappNumber: '+2 0103 94 64 284',
  ownerAlertWhatsapp: '+2 0103 94 64 284',
  location: 'Saqala Square، Hurghada First, Red Sea Governorate 84511',
  facebookUrl: 'https://www.facebook.com/people/DiveGo-Hurghada/61593699815956/',
  instagramUrl: 'https://www.instagram.com/dive_go.hurghada',
  tiktokUrl: 'https://www.tiktok.com/@dive_go_hurghada',
  destinations: ['Giftun Island', 'Abu Ramada', 'Dolphin House', 'Shaab El Erg', 'Umm Gamar', 'Abu Nuhas Wrecks'],
  yearsExperience: 14,
  story:
    'Founded by passionate Red Sea diving instructors, Dive Go Hurghada delivers premium scuba diving, daily boat excursions, PADI certifications, and private desert safari adventures with highest safety standards and personal attention.',
  values: ['Safety First', 'Marine Ecology Conservation', 'Fair Transparent Pricing', 'Multilingual Excellence'],
  targetMarkets: ['Germany', 'United Kingdom', 'France', 'Poland', 'Czech Republic', 'Egypt & GCC', 'Italy'],
  currency: 'EUR (€)',
  timezone: 'Africa/Cairo (UTC+2)',
  operatingHours: '07:30 - 21:00 EEST',
  aiTone: 'friendly',
  aiDetailLevel: 'balanced',
  aiSalesOrientation: 'consultative',
  aiForbiddenPromises: [
    'Never guarantee wild dolphin swimming if sea conditions are rough',
    'Never promise uncertified divers deeper than 12m on introductory dives',
    'Never offer free private speedboat charters without owner approval',
    'Never confirm pickup without hotel name and room number',
  ],
  aiEscalationTriggers: [
    'Customer reports medical condition or asthma for diving',
    'Complaint about hotel pickup delay over 20 minutes',
    'Request for group booking over 10 participants',
    'Refund request or payment dispute',
  ],
};

export const INITIAL_CONNECTORS: PlatformConnector[] = [
  {
    id: 'getyourguide',
    name: 'GetYourGuide Supplier',
    category: 'OTA',
    officialApiName: 'GetYourGuide Supplier API v3',
    status: 'CREDENTIALS_REQUIRED',
    authType: 'API Key / Secret',
    scopes: ['products.read', 'availability.write', 'bookings.notify'],
    rateLimitPerMin: 120,
    lastSyncAt: null,
    supportedActions: ['Import listings', 'Sync real-time calendar capacity', 'Receive instant booking webhooks'],
    unsupportedActions: ['Auto-respond to reviews (GYG policy prohibits bot replies)', 'Dynamic price bidding'],
    notes: 'Official GetYourGuide Supplier Portal account required. No mock credentials assumed.',
  },
  {
    id: 'tripadvisor',
    name: 'TripAdvisor Content API',
    category: 'OTA',
    officialApiName: 'TripAdvisor Partner Content API',
    status: 'CREDENTIALS_REQUIRED',
    authType: 'Partner Token',
    scopes: ['location.reviews', 'location.details'],
    rateLimitPerMin: 60,
    lastSyncAt: null,
    supportedActions: ['Sync verified traveler reviews', 'Display Certificate of Excellence badges'],
    unsupportedActions: ['Direct booking creation (redirects to Viator engine)'],
    notes: 'Requires TripAdvisor Partner Network approval.',
  },
  {
    id: 'viator',
    name: 'Viator Merchant Extranet',
    category: 'OTA',
    officialApiName: 'Viator Supplier API v2.0',
    status: 'CREDENTIALS_REQUIRED',
    authType: 'API Key / Secret',
    scopes: ['merchant.bookings', 'merchant.products'],
    rateLimitPerMin: 100,
    lastSyncAt: null,
    supportedActions: ['Sync bookings directly into manifest', 'Update departure cut-off times'],
    unsupportedActions: ['Publishing new unapproved tour products without Viator curation review'],
    notes: 'Requires active Viator Supplier Extranet account and signed distribution agreement.',
  },
  {
    id: 'meta',
    name: 'Meta Graph API (Facebook & Instagram)',
    category: 'SOCIAL',
    officialApiName: 'Meta Graph API v21.0 (WhatsApp Cloud + IG)',
    status: 'CREDENTIALS_REQUIRED',
    authType: 'OAuth 2.0',
    scopes: ['pages_manage_posts', 'instagram_basic', 'instagram_manage_comments', 'whatsapp_business_messaging'],
    rateLimitPerMin: 200,
    lastSyncAt: null,
    supportedActions: ['Publish verified tour promos', 'Auto-reply to public pricing comments', 'Receive WhatsApp messages'],
    unsupportedActions: ['Posting without business verification', 'Scraping private user feeds'],
    notes: 'Requires Meta Business Suite verified app ID.',
  },
  {
    id: 'tiktok',
    name: 'TikTok for Business',
    category: 'SOCIAL',
    officialApiName: 'TikTok Content Posting API',
    status: 'CREDENTIALS_REQUIRED',
    authType: 'OAuth 2.0',
    scopes: ['video.upload', 'comment.list', 'comment.reply'],
    rateLimitPerMin: 50,
    lastSyncAt: null,
    supportedActions: ['Schedule verified video reels', 'Draft AI-generated captions and tags'],
    unsupportedActions: ['Direct sales checkout inside TikTok in non-eligible territories'],
    notes: 'Requires TikTok Developer Portal verified app.',
  },
];

export class AppStore {
  private state: AppState;
  private listeners: (() => void)[] = [];

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        if (parsed.services && parsed.services.length > 0) {
          // Sync latest user-provided phone, email and address
          parsed.profile.phone = '+2 0103 94 64 284';
          parsed.profile.whatsappNumber = '+2 0103 94 64 284';
          parsed.profile.ownerAlertWhatsapp = '+2 0103 94 64 284';
          parsed.profile.email = 'divegohurghada@gmail.com';
          parsed.profile.location = 'Saqala Square، Hurghada First, Red Sea Governorate 84511';
          parsed.profile.facebookUrl = 'https://www.facebook.com/people/DiveGo-Hurghada/61593699815956/';
          parsed.profile.instagramUrl = 'https://www.instagram.com/dive_go.hurghada';
          parsed.profile.tiktokUrl = 'https://www.tiktok.com/@dive_go_hurghada';
          parsed.profile.yearsExperience = 15;

          // Check if speedboat and safari services are present; if not, merge new services
          const hasSpeedboat = parsed.services.some((s: any) => s.id === 'srv-dgh-private-speedboat');
          if (!hasSpeedboat || parsed.services.length < 6) {
            const blank = this.createInitialBlankState();
            this.state = blank;
            this.loadDiveGoHurghadaProfile();
            return this.state;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read state from localStorage, initializing fresh.');
    }

    const state = this.createInitialBlankState();
    // Pre-populate with Dive Go Hurghada verified profile by default for the website
    this.state = state;
    this.loadDiveGoHurghadaProfile();
    return this.state;
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to persist state to localStorage', e);
    }
    this.notify();
  }

  private createInitialBlankState(): AppState {
    return {
      currentTenantId: 'TENANT_DGH_PRIMARY',
      userRole: 'OWNER',
      profile: { ...BLANK_PROFILE },
      services: [],
      knowledgeBase: [],
      conflicts: [],
      gaps: [],
      reservations: [],
      alerts: [],
      socialPosts: [],
      socialComments: [],
      connectors: [...INITIAL_CONNECTORS],
      auditLogs: [
        {
          id: 'log-init-0',
          timestamp: new Date().toISOString(),
          actor: 'System Installer',
          role: 'SYSTEM',
          action: 'ZERO_ASSUMPTION_INIT',
          entityType: 'INTEGRATION',
          entityId: 'SYSTEM',
          newValue: 'System initialized in pure blank state according to Zero-Assumption rule §5',
          tenantId: 'TENANT_DGH_PRIMARY',
        },
      ],
    };
  }

  public getState(): AppState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  // ==========================================
  // AUDIT LOG HELPER
  // ==========================================
  public logAudit(
    action: string,
    entityType: AuditLogEntry['entityType'],
    entityId: string,
    previousValue?: string,
    newValue?: string
  ): void {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      actor: this.state.userRole === 'OWNER' ? 'Business Owner' : 'Operations Desk',
      role: this.state.userRole,
      action,
      entityType,
      entityId,
      previousValue,
      newValue,
      tenantId: this.state.currentTenantId,
    };
    this.state.auditLogs.unshift(entry);
    if (this.state.auditLogs.length > 500) {
      this.state.auditLogs.pop();
    }
    this.saveState();
  }

  // ==========================================
  // ZERO ASSUMPTION RESET & DIVE GO ONBOARDING
  // ==========================================
  public resetToBlank(): void {
    this.state = this.createInitialBlankState();
    this.logAudit('RESET_TO_BLANK', 'INTEGRATION', 'SYSTEM', 'Configured State', 'Clean Blank Installation');
    this.saveState();
  }

  public loadDiveGoHurghadaProfile(): void {
    this.state.profile = { ...DIVE_GO_HURGHADA_PROFILE };

    // Seed verified services for Dive Go Hurghada
    this.state.services = [
      {
        id: 'srv-dgh-daily-dive',
        title: 'Daily Boat Diving & Intro Dives in Hurghada',
        category: 'diving',
        description:
          'Einführungstauchgänge und geführte Bootstauchgänge für Einsteiger und zertifizierte Taucher. Erleben Sie spektakuläre Riffe unter Anleitung erfahrener PADI-Instruktoren mit fundierter Sicherheitseinweisung, 2 Tauchgängen, Mittagsbuffet und Hoteltransfer.',
        priceAdult: 65,
        priceChild: 40,
        currency: 'EUR (€)',
        durationHours: 8,
        departureTimes: ['08:00 AM'],
        meetingPoint: 'Saqala Square / Hurghada New Marina Pier 4 or Hotel Lobby',
        pickupAreasIncluded: ['Hurghada City', 'El Mamsha', 'Dahar', 'Sahl Hasheesh'],
        inclusions: ['2 Guided Dives', '12L Aluminum Tanks & Weights', 'Chef-prepared Lunch Buffet', 'Soft Drinks & Water', 'Hotel Transfers'],
        exclusions: ['Full Dive Gear Rental (€15/day)', 'National Park Fee (€5)', 'Nitrox 15L (€5/tank)'],
        minParticipants: 1,
        maxCapacity: 28,
        cancellationPolicy: 'Free cancellation up to 24 hours prior to departure.',
        childPolicy: 'Junior divers must be min 10 years old with certified parent.',
        languagesOffered: ['German', 'English', 'Arabic', 'Russian', 'Turkish'],
        verificationSource: 'OWNER_VERIFIED',
        updatedAt: new Date().toISOString(),
        isAvailable: true,
      },
      {
        id: 'srv-dgh-private-speedboat',
        title: 'Privat Speedboat & Dolphin Watching (Orange Bay)',
        category: 'sea_trip',
        description:
          'Erlebt das Rote Meer von seiner schönsten Seite – schnell, exklusiv und voller Abenteuer! Entdeckt die Küste von Hurghada mit unserem modernen Speedboat, genießt Delfinbeobachtung in freier Wildbahn, Schnorcheln an Korallenriffen und private Inselstopps an der traumhaften Orange Bay.',
        priceAdult: 160,
        priceChild: 90,
        currency: 'EUR (€)',
        durationHours: 4,
        departureTimes: ['08:30 AM', '01:00 PM'],
        meetingPoint: 'Hurghada Marina / Private Pier',
        pickupAreasIncluded: ['All Hurghada Hotels', 'El Gouna (+€5)', 'Makadi Bay (+€5)'],
        inclusions: ['Private Speedboat Charter with Captain', 'Wild Dolphin Spotting & Swimming', 'Snorkeling Masks & Life Vests', 'Orange Bay Island Stop', 'Fresh Fruits & Soft Drinks', 'Round-trip Hotel Transfers'],
        exclusions: ['Island Entry Ticket if applicable (€5)'],
        minParticipants: 1,
        maxCapacity: 8,
        cancellationPolicy: 'Free cancellation up to 24 hours prior.',
        childPolicy: 'All ages welcome. Special child safety vests on board.',
        languagesOffered: ['German', 'English', 'Arabic', 'Russian'],
        verificationSource: 'OWNER_VERIFIED',
        updatedAt: new Date().toISOString(),
        isAvailable: true,
      },
      {
        id: 'srv-dgh-private-padi',
        title: 'Privater Tauchunterricht & PADI Zertifizierung',
        category: 'diving',
        description:
          'Individuell gestalteter 1-on-1 Tauchkurs mit erfahrenen PADI Master Diver Instruktoren. Angepasst an Ihr persönliches Lerntempo und Ihre Wünsche – besonders empfehlenswert für Gäste mit Angst vor dem Tauchen oder für intensives Lernen.',
        priceAdult: 340,
        priceChild: 340,
        currency: 'EUR (€)',
        durationHours: 24,
        departureTimes: ['08:00 AM (Day 1)'],
        meetingPoint: 'DiveGo Hurghada Dive School (Saqala Square)',
        pickupAreasIncluded: ['All Hurghada Hotel Zones'],
        inclusions: ['1-on-1 Personal Instructor', 'PADI e-Card Certification', 'Complete Rental Equipment', 'Confined & Open Water Boat Dives', 'Daily Lunch Buffet & Transfers'],
        exclusions: ['National Park Entry (€5/day)'],
        minParticipants: 1,
        maxCapacity: 4,
        cancellationPolicy: 'Full refund if cancelled before course activation.',
        childPolicy: 'Min age 10 for Junior Open Water.',
        languagesOffered: ['German', 'English', 'Arabic', 'Russian', 'Turkish'],
        verificationSource: 'OWNER_VERIFIED',
        updatedAt: new Date().toISOString(),
        isAvailable: true,
      },
      {
        id: 'srv-dgh-tauchsafari',
        title: 'Tauchsafari im Roten Meer (Reefs & Wracks)',
        category: 'diving',
        description:
          'Erleben Sie die faszinierende Unterwasserwelt des Roten Meeres auf professionell geführten Tauchsafaris zu spektakulären Korallenriffen und weltberühmten Wracks wie Abu Nuhas, Thistlegorm und Giftun Island. Maximaler Komfort, kleine Gruppen und erfahrene Guides.',
        priceAdult: 130,
        priceChild: 90,
        currency: 'EUR (€)',
        durationHours: 10,
        departureTimes: ['07:30 AM'],
        meetingPoint: 'Hurghada Port / DiveGo Boat Dock',
        pickupAreasIncluded: ['All Hurghada Hotels'],
        inclusions: ['3 Guided Boat Dives', 'Tanks & Weights', 'Professional Safari Guide (Max 4 Divers)', 'Full Board Buffet Lunch & Unlimited Drinks', 'Hotel Transfers'],
        exclusions: ['Equipment Rental (€15/day)', 'National Park Marine Fee (€5)'],
        minParticipants: 2,
        maxCapacity: 20,
        cancellationPolicy: 'Free cancellation up to 24 hours prior.',
        childPolicy: 'Certified divers only (Advanced Open Water or min 20 logged dives).',
        languagesOffered: ['German', 'English', 'Arabic', 'Russian'],
        verificationSource: 'OWNER_VERIFIED',
        updatedAt: new Date().toISOString(),
        isAvailable: true,
      },
      {
        id: 'srv-dgh-desert-safari',
        title: 'Quad-Safari in Hurghada – Abenteuer in der Wüste',
        category: 'desert_safari',
        description:
          'Fahrt mit dem Quad durch die faszinierende Wüstenlandschaft Hurghadas. Begleitung durch qualifiziertes Personal, gründliche Sicherheitseinweisung, Beduinendorf, traditioneller Beduinentee und BBQ unter dem Sternenhimmel. Auch als private Tour buchbar!',
        priceAdult: 35,
        priceChild: 20,
        currency: 'EUR (€)',
        durationHours: 5,
        departureTimes: ['01:30 PM', '08:00 AM'],
        meetingPoint: 'Hotel Lobby pickup',
        pickupAreasIncluded: ['All Hurghada Hotels'],
        inclusions: ['Quad Bike ATV Ride (approx. 45km)', 'Spider Buggy & Camel Ride', 'Bedouin Village Tour & Tea', 'BBQ Dinner & Oriental Show', 'Hotel Transfers'],
        exclusions: ['Arafat Scarf & Dust Goggles (€5 purchase)', 'Tipping'],
        minParticipants: 1,
        maxCapacity: 40,
        cancellationPolicy: 'Free cancellation up to 12 hours prior.',
        childPolicy: 'Drivers min 16 years. Children ride tandem with parent.',
        languagesOffered: ['German', 'English', 'Russian', 'Arabic', 'Polish'],
        verificationSource: 'OWNER_VERIFIED',
        updatedAt: new Date().toISOString(),
        isAvailable: true,
      },
      {
        id: 'srv-dgh-dolphin-house',
        title: 'Dolphin House Snorkeling Safari (Shaab El Erg)',
        category: 'sea_trip',
        description:
          'Tagesausflug zum legendären Dolphin House (Shaab El Erg). Schwimmen und Schnorcheln in der Nähe von wilden Delfinen im geschützten Riffgebiet, 2 Schnorchelstopps mit bunten Fischen und Korallen, frisches Mittagsbuffet und Softdrinks.',
        priceAdult: 40,
        priceChild: 25,
        currency: 'EUR (€)',
        durationHours: 8,
        departureTimes: ['08:00 AM'],
        meetingPoint: 'Hotel Lobby pickup',
        pickupAreasIncluded: ['Hurghada Center', 'El Mamsha', 'Sahl Hasheesh', 'Makadi Bay'],
        inclusions: ['Snorkeling Equipment (Mask, Snorkel, Fins)', 'Life Jackets', 'Chef Buffet Lunch & Unlimited Drinks', 'Banana Boat Water Fun', 'Hotel Transfers'],
        exclusions: ['Marine Park Fee (€5 per adult)', 'Photo/Video Services'],
        minParticipants: 2,
        maxCapacity: 35,
        cancellationPolicy: 'Free cancellation up to 24 hours prior.',
        childPolicy: 'Children under 4 free. Ages 4-11 child price.',
        languagesOffered: ['German', 'English', 'Arabic', 'French', 'Russian'],
        verificationSource: 'OWNER_VERIFIED',
        updatedAt: new Date().toISOString(),
        isAvailable: true,
      },
    ];

    // Seed verified business brain knowledge
    this.state.knowledgeBase = [
      {
        id: 'kb-1',
        category: 'pricing',
        subject: 'Daily Diving Rate & Currency',
        content: 'Daily boat diving is €65 for 2 dives. Cash accepted in EUR, USD, GBP, and EGP at daily bank exchange rate.',
        sourceType: 'OWNER_VERIFIED',
        sourceName: 'Owner Direct Confirmation',
        confidence: 1.0,
        verifiedByOwner: true,
        expiresAt: null,
        status: 'active',
        version: 1,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'kb-2',
        category: 'policy',
        subject: '24-Hour Free Cancellation Rule',
        content: 'All excursions can be cancelled up to 24 hours before pickup for a 100% full refund with no cancellation fee.',
        sourceType: 'OWNER_VERIFIED',
        sourceName: 'Official Terms & Conditions',
        confidence: 1.0,
        verifiedByOwner: true,
        expiresAt: null,
        status: 'active',
        version: 1,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'kb-3',
        category: 'location_pickup',
        subject: 'Hotel Pickup Times & Areas',
        content:
          'Pickups for boat trips occur between 07:45 AM and 08:30 AM depending on hotel location. Free pickup for Hurghada, Mamsha, Dahar, and Sahl Hasheesh. El Gouna and Makadi Bay have €5 per person transfer surcharge.',
        sourceType: 'OWNER_VERIFIED',
        sourceName: 'Operations Transport Dispatch',
        confidence: 1.0,
        verifiedByOwner: true,
        expiresAt: null,
        status: 'active',
        version: 1,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'kb-4',
        category: 'service_detail',
        subject: 'Scuba Diving Medical Clearance',
        content:
          'All divers must complete the standard RSTC/PADI medical questionnaire. In case of asthma, epilepsy, heart disease, or recent surgery, a signed doctor clearance is mandatory.',
        sourceType: 'MASTER_DB',
        sourceName: 'PADI Safety Standards',
        confidence: 0.95,
        verifiedByOwner: true,
        expiresAt: null,
        status: 'active',
        version: 1,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'kb-5',
        category: 'pricing',
        subject: 'Dolphin House Third-Party OTA Price Conflict',
        content: 'Viator lists Dolphin House at €42 while official direct website price is €35.',
        sourceType: 'AUTHORIZED_PLATFORM',
        sourceName: 'Viator Extranet Sync',
        confidence: 0.6,
        verifiedByOwner: false,
        expiresAt: null,
        status: 'conflicted',
        version: 1,
        updatedAt: new Date().toISOString(),
      },
    ];

    // Seed realistic conflict for audit demonstration
    this.state.conflicts = [
      {
        id: 'conf-1',
        subject: 'Dolphin House Snorkeling Price Discrepancy',
        serviceId: 'srv-dgh-dolphin-house',
        field: 'price',
        sourceA: {
          source: 'Owner Verified Direct Rate (www.divegohurghada.com)',
          sourceType: 'OWNER_VERIFIED',
          value: '€35 per adult',
          priority: 100,
        },
        sourceB: {
          source: 'Viator Third-Party Marketplace Listing',
          sourceType: 'AUTHORIZED_PLATFORM',
          value: '€42 per adult',
          priority: 60,
        },
        resolvedValue: '€35 per adult (Owner Precedence Applied)',
        status: 'RESOLVED_BY_RULE',
        detectedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        notes: 'Precedence rule: OWNER_VERIFIED (weight 100) strictly overrides AUTHORIZED_PLATFORM (weight 60). AI quotes €35.',
      },
    ];

    // Seed realistic knowledge gap
    this.state.gaps = [
      {
        id: 'gap-1',
        question: 'Can a 4-year-old child join the Super Desert Safari quad biking on the same quad bike?',
        category: 'Child Policy / Desert Safari',
        serviceId: 'srv-dgh-desert-safari',
        customerLanguage: 'English',
        frequency: 3,
        status: 'PENDING_OWNER_ANSWER',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ];

    // Seed upcoming sample reservations (including tomorrow's arrivals)
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    this.state.reservations = [
      {
        id: 'res-dgh-101',
        bookingCode: 'DGH-2026-8801',
        serviceId: 'srv-dgh-daily-dive',
        serviceTitle: 'Daily Boat Diving (2 Guided Dives)',
        bookingDate: today,
        serviceDate: tomorrow,
        pickupTime: '08:00 AM',
        customerName: 'Thomas Becker',
        customerEmail: 't.becker@berlin-mail.de',
        customerPhone: '+49 176 12345678',
        whatsappNumber: '+49 176 12345678',
        hotelName: 'Steigenberger ALDAU Beach Hotel',
        roomNumber: '412',
        adultsCount: 2,
        childrenCount: 0,
        totalAmount: 130,
        currency: 'EUR (€)',
        paymentStatus: 'CASH_ON_ARRIVAL',
        bookingStatus: 'CONFIRMED',
        specialRequests: 'Need 15L tank for 1 diver (Nitrox 32% if available).',
        idempotencyKey: 'IDEMP_RES_101',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        sourceChannel: 'WHATSAPP',
      },
      {
        id: 'res-dgh-102',
        bookingCode: 'DGH-2026-8802',
        serviceId: 'srv-dgh-intro-dive',
        serviceTitle: 'Discover Scuba Diving (Introductory Dive)',
        bookingDate: today,
        serviceDate: tomorrow,
        pickupTime: '08:15 AM',
        customerName: 'Elena Rostova',
        customerEmail: 'elena.rostova@yandex.ru',
        customerPhone: '+7 916 555 1234',
        whatsappNumber: '+7 916 555 1234',
        hotelName: 'Albatros White Beach Resort',
        roomNumber: '1205',
        adultsCount: 2,
        childrenCount: 1,
        totalAmount: 145,
        currency: 'EUR (€)',
        paymentStatus: 'DEPOSIT_PAID',
        bookingStatus: 'CONFIRMED',
        specialRequests: 'First time diving, nervous swimmer. Russian-speaking guide preferred if possible.',
        idempotencyKey: 'IDEMP_RES_102',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        sourceChannel: 'AI_SALES_AGENT',
      },
      {
        id: 'res-dgh-103',
        bookingCode: 'DGH-2026-8803',
        serviceId: 'srv-dgh-dolphin-house',
        serviceTitle: 'Dolphin House Snorkeling Sea Safari',
        bookingDate: today,
        serviceDate: tomorrow,
        pickupTime: '08:30 AM',
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah.j@outlook.co.uk',
        customerPhone: '+44 7700 900123',
        whatsappNumber: '+44 7700 900123',
        hotelName: 'Desert Rose Resort Hurghada',
        roomNumber: '734',
        adultsCount: 4,
        childrenCount: 2,
        totalAmount: 180,
        currency: 'EUR (€)',
        paymentStatus: 'PAID_FULL',
        bookingStatus: 'CONFIRMED',
        specialRequests: 'Vegetarian lunch meal request for 2 adults.',
        idempotencyKey: 'IDEMP_RES_103',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        sourceChannel: 'AI_SALES_AGENT',
      },
    ];

    // Seed recent alerts
    this.state.alerts = [
      {
        id: 'alert-1',
        eventId: 'EVT-BK-8803',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        priority: 'P1_HIGH',
        type: 'NEW_BOOKING',
        title: 'New Reservation: Dolphin House (6 Pax)',
        message: 'Sarah Jenkins booked for tomorrow (€180 PAID_FULL). Pickup Desert Rose Resort @ 08:30 AM.',
        recipientNumber: this.state.profile.ownerAlertWhatsapp,
        deliveryStatus: 'DELIVERED',
        retryCount: 0,
        acknowledged: true,
      },
      {
        id: 'alert-2',
        eventId: 'EVT-GAP-1',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        priority: 'P2_NORMAL',
        type: 'KNOWLEDGE_GAP',
        title: 'Unanswered Customer Question Logged',
        message: 'Customer asked: "Can a 4-year-old ride on quad bike with parent?" AI safely declined to guess and logged gap.',
        recipientNumber: this.state.profile.ownerAlertWhatsapp,
        deliveryStatus: 'DELIVERED',
        retryCount: 0,
        acknowledged: false,
      },
    ];

    this.logAudit('LOAD_PROFILE', 'INTEGRATION', 'DIVE_GO_HURGHADA', 'Blank', 'Imported Dive Go Hurghada Verified Profile');
    this.saveState();
  }

  // ==========================================
  // PROFILE MANAGEMENT
  // ==========================================
  public updateProfile(updates: Partial<BusinessProfile>): void {
    const prev = JSON.stringify(this.state.profile);
    this.state.profile = {
      ...this.state.profile,
      ...updates,
      isBlank: false,
    };
    this.logAudit('UPDATE_PROFILE', 'KNOWLEDGE', 'PROFILE', prev, JSON.stringify(this.state.profile));
    this.saveState();
  }

  // ==========================================
  // SERVICES MANAGEMENT
  // ==========================================
  public addService(service: Omit<ServiceItem, 'id' | 'updatedAt'>): ServiceItem {
    const newService: ServiceItem = {
      ...service,
      id: `srv-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    this.state.services.unshift(newService);
    this.logAudit('ADD_SERVICE', 'SERVICE', newService.id, undefined, newService.title);
    this.saveState();
    return newService;
  }

  public updateService(id: string, updates: Partial<ServiceItem>): void {
    const idx = this.state.services.findIndex((s) => s.id === id);
    if (idx !== -1) {
      const prev = JSON.stringify(this.state.services[idx]);
      this.state.services[idx] = {
        ...this.state.services[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.logAudit('UPDATE_SERVICE', 'SERVICE', id, prev, JSON.stringify(this.state.services[idx]));
      this.saveState();
    }
  }

  public deleteService(id: string): void {
    const srv = this.state.services.find((s) => s.id === id);
    this.state.services = this.state.services.filter((s) => s.id !== id);
    this.logAudit('DELETE_SERVICE', 'SERVICE', id, srv?.title, undefined);
    this.saveState();
  }

  // ==========================================
  // KNOWLEDGE BASE & GAPS & CONFLICTS
  // ==========================================
  public addKnowledgeItem(item: Omit<KnowledgeItem, 'id' | 'updatedAt' | 'version'>): KnowledgeItem {
    const newItem: KnowledgeItem = {
      ...item,
      id: `kb-${Date.now()}`,
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    this.state.knowledgeBase.unshift(newItem);
    this.logAudit('ADD_KNOWLEDGE', 'KNOWLEDGE', newItem.id, undefined, newItem.subject);
    this.saveState();
    return newItem;
  }

  public updateKnowledgeItem(id: string, updates: Partial<KnowledgeItem>): void {
    const idx = this.state.knowledgeBase.findIndex((k) => k.id === id);
    if (idx !== -1) {
      const prev = JSON.stringify(this.state.knowledgeBase[idx]);
      this.state.knowledgeBase[idx] = {
        ...this.state.knowledgeBase[idx],
        ...updates,
        version: this.state.knowledgeBase[idx].version + 1,
        updatedAt: new Date().toISOString(),
      };
      this.logAudit('UPDATE_KNOWLEDGE', 'KNOWLEDGE', id, prev, JSON.stringify(this.state.knowledgeBase[idx]));
      this.saveState();
    }
  }

  public answerKnowledgeGap(gapId: string, answer: string): void {
    const gap = this.state.gaps.find((g) => g.id === gapId);
    if (gap) {
      gap.status = 'RESOLVED';
      gap.ownerAnswer = answer;
      gap.answeredAt = new Date().toISOString();

      // Automatically promote owner answer into verified knowledge base!
      this.addKnowledgeItem({
        category: 'faq',
        subject: gap.question,
        content: answer,
        sourceType: 'OWNER_VERIFIED',
        sourceName: 'Owner Direct Gap Answer',
        confidence: 1.0,
        verifiedByOwner: true,
        expiresAt: null,
        status: 'active',
      });

      this.logAudit('ANSWER_KNOWLEDGE_GAP', 'KNOWLEDGE', gapId, gap.question, answer);
      this.saveState();
    }
  }

  public logKnowledgeGap(question: string, category: string = 'General Inquiry', serviceId?: string, customerLanguage: string = 'English'): KnowledgeGap {
    const existing = this.state.gaps.find(
      (g) => g.question.toLowerCase().trim() === question.toLowerCase().trim() && g.status === 'PENDING_OWNER_ANSWER'
    );
    if (existing) {
      existing.frequency += 1;
      this.saveState();
      return existing;
    }

    const gap: KnowledgeGap = {
      id: `gap-${Date.now()}`,
      question,
      category,
      serviceId,
      customerLanguage,
      frequency: 1,
      status: 'PENDING_OWNER_ANSWER',
      createdAt: new Date().toISOString(),
    };
    this.state.gaps.unshift(gap);

    // Dispatch owner alert
    this.dispatchAlert({
      priority: 'P2_NORMAL',
      type: 'KNOWLEDGE_GAP',
      title: 'New Knowledge Gap: Customer Asked Unknown Question',
      message: `Question: "${question}" (Language: ${customerLanguage}). Owner verification required.`,
    });

    this.logAudit('CREATE_KNOWLEDGE_GAP', 'KNOWLEDGE', gap.id, undefined, question);
    this.saveState();
    return gap;
  }

  public resolveConflict(conflictId: string, resolvedValue: string, resolutionNotes: string): void {
    const conf = this.state.conflicts.find((c) => c.id === conflictId);
    if (conf) {
      conf.status = 'RESOLVED_BY_OWNER';
      conf.resolvedValue = resolvedValue;
      conf.notes = resolutionNotes;
      this.logAudit('RESOLVE_CONFLICT', 'CONFLICT', conflictId, conf.subject, resolvedValue);
      this.saveState();
    }
  }

  // ==========================================
  // RESERVATION ENGINE WITH DUPLICATE PROTECTION
  // ==========================================
  public createReservation(data: {
    serviceId: string;
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
    specialRequests?: string;
    paymentStatus?: Reservation['paymentStatus'];
    sourceChannel?: Reservation['sourceChannel'];
    idempotencyKey?: string;
  }): { success: boolean; reservation?: Reservation; error?: string } {
    // 1. Validation
    if (!data.customerName || !data.customerPhone || !data.serviceDate || !data.serviceId) {
      return { success: false, error: 'Missing mandatory reservation fields (customer name, phone, date, service).' };
    }

    const service = this.state.services.find((s) => s.id === data.serviceId);
    if (!service) {
      return { success: false, error: 'Selected excursion service not found in verified inventory.' };
    }

    // 2. Duplicate Booking / Idempotency Check (§33 & §37 Scenario 10)
    const idempotencyKey =
      data.idempotencyKey ||
      `IDEMP_${data.customerName.toLowerCase().replace(/\s+/g, '')}_${data.serviceDate}_${data.serviceId}`;

    const existingDuplicate = this.state.reservations.find(
      (r) =>
        r.idempotencyKey === idempotencyKey ||
        (r.customerPhone === data.customerPhone &&
          r.serviceDate === data.serviceDate &&
          r.serviceId === data.serviceId &&
          r.bookingStatus !== 'CANCELLED')
    );

    if (existingDuplicate) {
      const errorMsg = `Duplicate reservation prevented: Active booking (${existingDuplicate.bookingCode}) already exists for ${data.customerName} on ${data.serviceDate} for ${service.title}.`;
      this.logAudit('DUPLICATE_BOOKING_PREVENTED', 'RESERVATION', idempotencyKey, undefined, errorMsg);
      return { success: false, error: errorMsg };
    }

    // 3. Capacity Check
    const existingBookedCount = this.state.reservations
      .filter((r) => r.serviceId === data.serviceId && r.serviceDate === data.serviceDate && r.bookingStatus !== 'CANCELLED')
      .reduce((sum, r) => sum + r.adultsCount + r.childrenCount, 0);

    const totalPax = data.adultsCount + data.childrenCount;
    if (existingBookedCount + totalPax > service.maxCapacity) {
      return {
        success: false,
        error: `Excursion capacity reached. Only ${Math.max(0, service.maxCapacity - existingBookedCount)} seats remaining for ${data.serviceDate}.`,
      };
    }

    // 4. Price Calculation
    const totalAmount = data.adultsCount * service.priceAdult + data.childrenCount * service.priceChild;

    // 5. Booking Code
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `DGH-2026-${randomSeq}`;

    const newReservation: Reservation = {
      id: `res-${Date.now()}-${randomSeq}`,
      bookingCode,
      serviceId: service.id,
      serviceTitle: service.title,
      bookingDate: new Date().toISOString().split('T')[0],
      serviceDate: data.serviceDate,
      pickupTime: data.pickupTime || service.departureTimes[0] || '08:00 AM',
      customerName: data.customerName,
      customerEmail: data.customerEmail || '',
      customerPhone: data.customerPhone,
      whatsappNumber: data.whatsappNumber || data.customerPhone,
      hotelName: data.hotelName || 'To Be Provided in Lobby',
      roomNumber: data.roomNumber || '',
      adultsCount: data.adultsCount,
      childrenCount: data.childrenCount,
      totalAmount,
      currency: service.currency || this.state.profile.currency || 'EUR (€)',
      paymentStatus: data.paymentStatus || 'CASH_ON_ARRIVAL',
      bookingStatus: 'CONFIRMED',
      specialRequests: data.specialRequests || '',
      idempotencyKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sourceChannel: data.sourceChannel || 'AI_SALES_AGENT',
    };

    this.state.reservations.unshift(newReservation);

    // 6. Structured Owner Notification Alert (§18)
    this.dispatchAlert({
      priority: 'P1_HIGH',
      type: 'NEW_BOOKING',
      title: `New Reservation: ${service.title} (${totalPax} Pax)`,
      message: `${newReservation.customerName} (${newReservation.customerPhone}) booked ${service.title} on ${newReservation.serviceDate}. Hotel: ${newReservation.hotelName} (Room ${newReservation.roomNumber || 'N/A'}). Total: €${totalAmount} (${newReservation.paymentStatus}). Code: ${newReservation.bookingCode}.`,
    });

    this.logAudit('CREATE_RESERVATION', 'RESERVATION', newReservation.id, undefined, JSON.stringify(newReservation));
    this.saveState();
    return { success: true, reservation: newReservation };
  }

  public updateReservationStatus(id: string, bookingStatus: Reservation['bookingStatus'], paymentStatus?: Reservation['paymentStatus']): void {
    const res = this.state.reservations.find((r) => r.id === id);
    if (res) {
      const prev = `Status: ${res.bookingStatus}, Payment: ${res.paymentStatus}`;
      res.bookingStatus = bookingStatus;
      if (paymentStatus) res.paymentStatus = paymentStatus;
      res.updatedAt = new Date().toISOString();
      this.logAudit('UPDATE_RESERVATION', 'RESERVATION', id, prev, `Status: ${res.bookingStatus}, Payment: ${res.paymentStatus}`);
      this.saveState();
    }
  }

  // ==========================================
  // OPERATIONAL MANIFEST: TOMORROW'S ARRIVALS (§17)
  // ==========================================
  public getTomorrowsManifest(): Reservation[] {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    return this.state.reservations
      .filter((r) => r.serviceDate === tomorrow && r.bookingStatus === 'CONFIRMED')
      .sort((a, b) => a.pickupTime.localeCompare(b.pickupTime));
  }

  // ==========================================
  // OWNER ALERTS SYSTEM (§18)
  // ==========================================
  public dispatchAlert(alert: {
    priority: OwnerAlert['priority'];
    type: OwnerAlert['type'];
    title: string;
    message: string;
    recipientNumber?: string;
  }): OwnerAlert {
    const recipient = alert.recipientNumber || this.state.profile.ownerAlertWhatsapp || '+201002345678';
    const newAlert: OwnerAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId: `EVT-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      priority: alert.priority,
      type: alert.type,
      title: alert.title,
      message: alert.message,
      recipientNumber: recipient,
      deliveryStatus: 'DELIVERED', // Simulated immediate delivery via WhatsApp Dispatcher
      retryCount: 0,
      acknowledged: false,
    };
    this.state.alerts.unshift(newAlert);
    if (this.state.alerts.length > 100) this.state.alerts.pop();
    this.saveState();
    return newAlert;
  }

  public acknowledgeAlert(id: string): void {
    const al = this.state.alerts.find((a) => a.id === id);
    if (al) {
      al.acknowledged = true;
      this.saveState();
    }
  }

  // ==========================================
  // SOCIAL AUTOMATION & DISTRIBUTION ENGINE
  // ==========================================
  public addSocialPost(post: Omit<SocialPost, 'id' | 'createdAt'>): SocialPost {
    const newPost: SocialPost = {
      ...post,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.socialPosts.unshift(newPost);
    this.logAudit('CREATE_SOCIAL_POST', 'INTEGRATION', newPost.id, undefined, newPost.headline);
    this.saveState();
    return newPost;
  }

  public updateSocialPostStatus(id: string, status: SocialPost['status']): void {
    const p = this.state.socialPosts.find((post) => post.id === id);
    if (p) {
      p.status = status;
      this.logAudit('UPDATE_SOCIAL_POST_STATUS', 'INTEGRATION', id, p.status, status);
      this.saveState();
    }
  }

  public addSocialComment(comment: Omit<SocialComment, 'id' | 'timestamp'>): SocialComment {
    const newComment: SocialComment = {
      ...comment,
      id: `comm-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.state.socialComments.unshift(newComment);
    this.saveState();
    return newComment;
  }

  // ==========================================
  // ROLE SWITCHER
  // ==========================================
  public setUserRole(role: AppState['userRole']): void {
    this.state.userRole = role;
    this.logAudit('SWITCH_ROLE', 'INTEGRATION', 'SESSION', undefined, `Role changed to ${role}`);
    this.saveState();
  }
}

export const appStore = new AppStore();
