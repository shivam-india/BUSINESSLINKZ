// Universal Business Network Types — BizLink Worldwide
// Designed for industry-independence, global-first multi-currency, flexible offerings (products & services),
// and universal multi-tier business relationship modeling.

export type AccountType = 'individual' | 'businessman';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: AccountType;
  city: string;
  country?: string;
  countryCode?: string;
  avatar?: string;
  // Businessman specific fields
  businessName?: string;
  businessRole?: string;
  industry?: string;
  businessModel?: string;
  category?: string;
  taxIdentifier?: string; // GST, VAT, EIN, Tax ID
  address?: string;
}

export type BusinessRole =
  | string; // Flexible string to accommodate any industry or legacy role

export type BusinessModelType =
  | 'Product-based'
  | 'Service-based'
  | 'Hybrid (Product & Service)'
  | 'B2B (Business-to-Business)'
  | 'B2C (Business-to-Consumer)'
  | 'D2C (Direct-to-Consumer)'
  | 'Manufacturer'
  | 'Wholesaler / Distributor'
  | 'Retailer / Merchant'
  | 'Agency / Studio'
  | 'Consultancy / Advisory'
  | 'SaaS / Software'
  | 'Healthcare Provider'
  | 'Freelancer / Solo Practitioner'
  | 'Startup'
  | 'Enterprise / Corporation';

export type ServiceDeliveryFormat = 'Remote' | 'On-Site' | 'Hybrid';

export type OfferingPricingType =
  | 'fixed'
  | 'hourly'
  | 'monthly_retainer'
  | 'per_unit'
  | 'custom_quote'
  | 'tiered';

// Universal Offering: Handles both Tangible Products and Intangible Services
export interface UniversalOffering {
  id: string;
  name: string;
  type: 'product' | 'service';
  category: string;
  subCategory?: string;
  description: string;
  price: number;
  currency: string; // e.g. 'USD', 'EUR', 'GBP', 'INR', 'JPY'
  pricingModel: OfferingPricingType;
  // Product specific fields
  moq?: number; // Minimum Order Quantity
  unit?: string; // 'pieces', 'kg', 'boxes', 'licenses', 'seats', 'pallets'
  inStock?: boolean;
  leadTimeDays?: number;
  isDigital?: boolean;
  // Service specific fields
  deliveryFormat?: ServiceDeliveryFormat;
  turnaroundTime?: string; // e.g. '3-5 business days', 'Ongoing', '2 weeks'
  deliverables?: string[];
  // Shared metadata
  tags?: string[];
  imageUrl?: string;
}

// Backward-compatible alias
export interface ProductItem extends UniversalOffering {
  unitPrice: number; // mapped to price
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingBody: string;
  year: number;
  credentialId?: string;
  verificationUrl?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  clientOrSector?: string;
  description: string;
  year: number;
  link?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface BusinessRequirements {
  lookingForPartnerships?: string[];
  seekingServices?: string[];
  seekingProductsOrSuppliers?: string[];
  targetMarkets?: string[];
}

export interface ServiceCoverage {
  scope: 'Local' | 'Regional' | 'National' | 'Global / Remote';
  radiusKm?: number;
  regionsOrCountriesServed?: string[];
}

export interface BusinessLocation {
  address: string;
  area?: string;
  city: string;
  state: string;
  country: string;
  countryCode: string; // ISO 2-letter, e.g. 'US', 'IN', 'GB', 'DE', 'JP', 'SG'
  pincode?: string;
  postalCode?: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  timezone?: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorBusiness?: string;
  authorRole?: string;
  rating: number;
  date: string;
  comment: string;
  source: 'platform_verified' | 'serpapi_google' | 'b2b_trade' | 'google_maps' | 'client_testimonial';
  isVerifiedBuyer: boolean;
}

export interface Business {
  id: string;
  businessCode: string; // e.g. "BL-AMB-000124", "BL-NYC-882014"
  name: string;
  tagline?: string;
  ownerName: string;
  industry: string; // Parent Industry Taxonomy (e.g. "Technology, AI & Software")
  subIndustry?: string; // Sub-industry (e.g. "B2B & B2C SaaS")
  customIndustries?: string[];
  businessModels: BusinessModelType[];
  primaryBusinessModel: BusinessModelType;
  roles: string[]; // For backwards compatibility
  primaryRole: string; // For backwards compatibility
  categories: string[];
  description: string;
  location: BusinessLocation;
  currency: string; // Primary operating currency, e.g. 'USD', 'EUR', 'INR'
  rating: number;
  reviewCount: number;
  verified: boolean;
  phone: string;
  email: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
  imageUrl?: string;
  photos?: string[];
  googleMapsUrl?: string;
  directionsUrl?: string;
  openStatus?: string;
  operatingHours?: Record<string, string>;
  serviceOptions?: Record<string, boolean>;
  placeId?: string;
  gstNumber?: string;
  taxIdentifier?: string; // Global Tax ID / VAT / EIN
  establishedYear: number;
  companySize?: 'Solo (1)' | 'Micro (2-10)' | 'Small (11-50)' | 'Mid-size (51-250)' | 'Enterprise (250+)';
  minOrderValue?: number;
  priceLevel?: string;

  // Universal Offerings
  offerings: UniversalOffering[];
  products: ProductItem[]; // backwards compatibility
  services?: UniversalOffering[];

  // Strategic & Capability Profile
  capabilities: string[];
  skills: string[];
  certifications?: CertificationItem[];
  portfolio?: PortfolioItem[];
  businessRequirements?: BusinessRequirements;
  serviceCoverage: ServiceCoverage;

  // Network & Relationship metrics
  suppliesTo: string[];
  purchasesFrom: string[];
  reviews: Review[];
  totalSuppliersCount: number;
  totalCustomersCount: number;
  trustScore: number; // 0 - 100
  fulfillmentRate: number; // e.g. 98%
  avatarUrl?: string;
  bannerGradient?: string;
  source?: 'serpapi' | 'verified_bizlink' | 'mock_directory' | 'google_maps';
  sourcePlatform?: string;
}

// Configurable Universal Relationship Model
export type UniversalRelationshipType =
  | 'Client ↔ Service Provider'
  | 'Buyer ↔ Supplier / Vendor'
  | 'Strategic Partner ↔ Partner'
  | 'Subcontractor ↔ General Contractor'
  | 'Technology Partner ↔ Integrator'
  | 'Brand ↔ Distributor'
  | 'Consultant ↔ Client'
  | 'Professional Peer';

export interface SupplyRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  sourceName: string;
  targetName: string;
  sourceRole?: string;
  targetRole?: string;
  relationshipType?: UniversalRelationshipType;
  category: string;
  volumeMonthly?: string;
  activeSince: string;
  status: 'active' | 'pending' | 'alternative' | 'collaborating' | 'completed';
  commercialNature?: 'commercial_active' | 'professional_network' | 'contract_based' | 'syndicate';
  creditTermDays?: number;
  sharedProjects?: string[];
}

export type TransactionCommercialType =
  | 'Invoice'
  | 'Retainer'
  | 'Milestone'
  | 'Procurement'
  | 'Credit / Udhaar'
  | 'Debit / Jama';

export interface LedgerTransaction {
  id: string;
  date: string;
  businessId: string;
  businessName: string;
  businessRole?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  type: 'Credit' | 'Debit'; // Debit: You Gave / Receivable | Credit: You Received / Paid
  commercialType?: TransactionCommercialType;
  amount: number;
  currency?: string; // Defaults to business currency
  status: 'Pending' | 'Settled' | 'Overdue';
  invoiceNumber: string;
  description: string;
  dueDate: string;
  category: string;
  paymentMode?: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Credit / Udhaar' | 'Stripe / Card' | 'Wire / SWIFT';
  notes?: string;
}

export interface SerpApiSearchParams {
  query: string;
  location: string;
  country?: string;
  radiusKm?: number;
  industry?: string;
  subIndustry?: string;
  businessModel?: string;
  offeringType?: 'all' | 'product' | 'service';
  businessType?: string | 'All';
  category?: string;
  forceMock?: boolean;
  userLat?: number;
  userLng?: number;
}

export interface SearchResultResponse {
  results: Business[];
  totalResults: number;
  source: 'serpapi_live' | 'mock_fallback' | 'mock_mode';
  query: string;
  location: string;
  radiusKm: number;
  latencyMs: number;
  serpApiQueryUsed?: string;
  detectedCategory?: string;
}
}
