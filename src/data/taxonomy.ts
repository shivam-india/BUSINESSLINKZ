// Universal Industry Taxonomy, Business Models, Currencies, and Global Classifications
// Scalable, extensible architecture: new industries, models, and attributes can be registered dynamically.

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  suggestedTags: string[];
}

export interface IndustryCategory {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon key
  description: string;
  subcategories: SubCategory[];
  commonCapabilities: string[];
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  dialCode: string;
  measurementSystem: 'metric' | 'imperial';
}

// 1. UNIVERSAL INDUSTRY TAXONOMY
export const UNIVERSAL_TAXONOMY: IndustryCategory[] = [
  {
    id: 'technology_software',
    name: 'Technology, AI & Software',
    icon: '💻',
    description: 'Software development, artificial intelligence, cloud computing, cybersecurity, and IT consulting.',
    subcategories: [
      { id: 'saas', name: 'B2B & B2C SaaS', suggestedTags: ['Cloud', 'Subscription', 'API', 'Enterprise Software'] },
      { id: 'ai_machine_learning', name: 'Artificial Intelligence & ML', suggestedTags: ['GenAI', 'LLM', 'Computer Vision', 'Data Science', 'Deep Learning'] },
      { id: 'custom_software', name: 'Custom Software & Mobile Dev', suggestedTags: ['Fullstack', 'React', 'iOS/Android', 'Node.js', 'Python'] },
      { id: 'cloud_devops', name: 'Cloud Infrastructure & DevOps', suggestedTags: ['AWS', 'GCP', 'Kubernetes', 'CI/CD', 'Terraform'] },
      { id: 'cybersecurity', name: 'Cybersecurity & Compliance', suggestedTags: ['SOC2', 'Penetration Testing', 'InfoSec', 'Zero Trust'] },
    ],
    commonCapabilities: ['API Integration', 'Cloud Architecture', 'Agile Delivery', 'SLA Guarantees', 'High Scalability'],
  },
  {
    id: 'healthcare_lifesciences',
    name: 'Healthcare, Biotech & Medical',
    icon: '🏥',
    description: 'Medical devices, healthcare providers, pharmaceuticals, biotechnology, and telehealth.',
    subcategories: [
      { id: 'medical_equipment', name: 'Medical Devices & Equipment', suggestedTags: ['Diagnostic Imaging', 'Surgical Tools', 'PPE', 'Monitoring Systems'] },
      { id: 'biotech_pharma', name: 'Biotech & Pharmaceuticals', suggestedTags: ['Clinical Trials', 'Formulations', 'Drug Discovery', 'Active Pharma Ingredients'] },
      { id: 'telehealth_digital_health', name: 'Telehealth & Digital Health', suggestedTags: ['HIPAA Compliant', 'Remote Patient Care', 'EHR Systems'] },
      { id: 'clinics_hospitals', name: 'Hospitals, Clinics & Labs', suggestedTags: ['Pathology', 'Specialist Care', 'Outpatient', 'Emergency'] },
    ],
    commonCapabilities: ['ISO 13485', 'FDA/CE Certified', 'HIPAA Compliant', 'Cold Chain Handling', 'Sterile Packaging'],
  },
  {
    id: 'manufacturing_industrial',
    name: 'Manufacturing & Industrial Production',
    icon: '🏭',
    description: 'Precision machining, metal fabrication, plastics, electronics assembly, robotics, and industrial automation.',
    subcategories: [
      { id: 'precision_cnc', name: 'Precision CNC & Tooling', suggestedTags: ['Milling', 'Lathe', 'Tolerances ±5µm', 'Aerospace Grade'] },
      { id: 'electronics_pcba', name: 'Electronics & PCBA Assembly', suggestedTags: ['SMT', 'Through-hole', 'Embedded Systems', 'IoT Hardware'] },
      { id: 'plastics_molding', name: 'Plastics & Injection Molding', suggestedTags: ['Rapid Prototyping', 'Thermoplastics', 'Blow Molding'] },
      { id: 'heavy_machinery', name: 'Industrial Automation & Robotics', suggestedTags: ['PLCs', 'Robotic Arms', 'Conveyor Systems', 'SCADA'] },
    ],
    commonCapabilities: ['ISO 9001', 'Six Sigma', 'Custom Fabrication', 'Rapid Prototyping', 'Volume Production'],
  },
  {
    id: 'creative_marketing_media',
    name: 'Media, Marketing & Creative Design',
    icon: '🎨',
    description: 'Brand identity, digital marketing, video production, UI/UX design, public relations, and content production.',
    subcategories: [
      { id: 'branding_uiux', name: 'Brand Strategy & UI/UX Design', suggestedTags: ['Design Systems', 'Figma', 'Visual Identity', 'Design Thinking'] },
      { id: 'digital_performance_marketing', name: 'Performance Marketing & SEO', suggestedTags: ['Growth Marketing', 'PPC', 'Content SEO', 'Conversion Rate'] },
      { id: 'video_3d_production', name: 'Video Production & 3D Motion', suggestedTags: ['CGI', 'Commercials', 'Post-production', 'Motion Graphics'] },
      { id: 'pr_communications', name: 'Public Relations & Corporate Comms', suggestedTags: ['Media Outreach', 'Crisis Management', 'Press Releases'] },
    ],
    commonCapabilities: ['Multi-channel Strategy', 'Creative Direction', 'Rapid Iteration', 'Global Brand Localization'],
  },
  {
    id: 'finance_legal_consulting',
    name: 'Finance, Legal & Professional Advisory',
    icon: '⚖️',
    description: 'Corporate law, accounting, management consulting, tax planning, M&A advisory, and insurance.',
    subcategories: [
      { id: 'corporate_law', name: 'Corporate & Commercial Law', suggestedTags: ['M&A', 'Intellectual Property', 'Cross-border Contracts', 'Compliance'] },
      { id: 'accounting_tax', name: 'CPA, Auditing & Tax Strategy', suggestedTags: ['GAAP', 'IFRS', 'Bookkeeping', 'Tax Optimization', 'Payroll'] },
      { id: 'management_consulting', name: 'Strategy & Management Consulting', suggestedTags: ['Turnaround', 'Market Entry', 'Operational Excellence', 'ESG'] },
      { id: 'fintech_capital', name: 'Fintech & Capital Advisory', suggestedTags: ['Venture Structuring', 'Payment Rails', 'Risk Underwriting'] },
    ],
    commonCapabilities: ['Certified Practitioners', 'Strict NDA / Confidentiality', 'Jurisdiction-specific Compliance', 'Fiduciary Duty'],
  },
  {
    id: 'construction_architecture',
    name: 'Construction, Architecture & Real Estate',
    icon: '🏗️',
    description: 'Architectural design, civil engineering, general contracting, interior spaces, and property development.',
    subcategories: [
      { id: 'architecture_interior', name: 'Architecture & Sustainable Design', suggestedTags: ['BIM', 'LEED Certified', 'Commercial Spaces', 'Residential'] },
      { id: 'general_contracting', name: 'General Contracting & Civil Works', suggestedTags: ['Turnkey Construction', 'Structural Steel', 'Earthworks'] },
      { id: 'mep_services', name: 'Mechanical, Electrical & Plumbing (MEP)', suggestedTags: ['HVAC', 'Commercial Electrical', 'Fire Suppression'] },
      { id: 'building_materials', name: 'Commercial Building Materials', suggestedTags: ['Engineered Timber', 'Structural Concrete', 'Acoustic Panels'] },
    ],
    commonCapabilities: ['BIM Level 2', 'LEED / BREEAM Certified', 'Safety Compliant', 'Full Turnkey Execution'],
  },
  {
    id: 'logistics_supplychain',
    name: 'Logistics, Supply Chain & Transport',
    icon: '🚢',
    description: 'Freight forwarding, cold chain logistics, warehousing, customs brokerage, and fleet management.',
    subcategories: [
      { id: 'freight_forwarding', name: 'Global Freight Forwarding', suggestedTags: ['Air Cargo', 'Ocean FCL/LCL', 'Intermodal', 'Incoterms 2020'] },
      { id: 'warehousing_3pl', name: 'Warehousing & 3PL Fulfillment', suggestedTags: ['Bonded Storage', 'Pick & Pack', 'Real-time WMS', 'Cross-docking'] },
      { id: 'cold_chain', name: 'Temperature Controlled Logistics', suggestedTags: ['Pharma Grade', 'Perishables', 'GPS Temp Tracking', '-20°C to +4°C'] },
      { id: 'customs_brokerage', name: 'Customs Clearance & Trade Compliance', suggestedTags: ['Harmonized Codes', 'Duty Drawbacks', 'Export Licensing'] },
    ],
    commonCapabilities: ['End-to-End Tracking', 'AEO Certified', 'Dangerous Goods Certified', 'Global Partner Network'],
  },
  {
    id: 'hospitality_food_tourism',
    name: 'Hospitality, Food Science & Tourism',
    icon: '☕',
    description: 'Specialty food & beverage, commercial kitchens, hospitality management, catering, and travel experiences.',
    subcategories: [
      { id: 'specialty_food_bev', name: 'Specialty Food & Beverage Production', suggestedTags: ['Artisan Roastery', 'Organic Bakery', 'Gourmet Sauces', 'Fermentation'] },
      { id: 'restaurant_hospitality', name: 'Restaurants, Cafes & Boutique Venues', suggestedTags: ['Farm-to-Table', 'Hospitality Operations', 'Banqueting'] },
      { id: 'commercial_catering', name: 'Commercial Catering & Food Supply', suggestedTags: ['Corporate Catering', 'Bulk Supply', 'HACCP Certified'] },
      { id: 'travel_tourism', name: 'Corporate Travel & Eco-Tourism', suggestedTags: ['Destination Management', 'B2B Retreats', 'Sustainable Travel'] },
    ],
    commonCapabilities: ['HACCP Certified', 'Organic Certified', 'Food Safety Audited', 'Cold Storage Logistics'],
  },
  {
    id: 'agriculture_sustainability',
    name: 'Agriculture, Farming & Environmental',
    icon: '🌱',
    description: 'Precision agriculture, organic farming, agritech hardware, renewable energy, and environmental services.',
    subcategories: [
      { id: 'agritech_precision', name: 'Agritech & Precision Farming', suggestedTags: ['Soil Sensors', 'Drone Spraying', 'Hydroponics', 'Smart Irrigation'] },
      { id: 'organic_crops', name: 'Commercial Crop Farming & Grains', suggestedTags: ['Non-GMO', 'Specialty Grains', 'Export Grade', 'Contract Farming'] },
      { id: 'cleantech_energy', name: 'Renewable Energy & Solar Installations', suggestedTags: ['Photovoltaic', 'BESS Storage', 'Carbon Offsetting', 'Microgrids'] },
      { id: 'waste_water_treatment', name: 'Industrial Water & Waste Management', suggestedTags: ['Effluent Treatment', 'Zero Liquid Discharge', 'Circular Recycling'] },
    ],
    commonCapabilities: ['Global GAP', 'Fair Trade Certified', 'Carbon Neutral', 'IoT Monitoring'],
  },
  {
    id: 'education_training',
    name: 'Education, EdTech & Corporate Training',
    icon: '🎓',
    description: 'Professional development, corporate training, educational technology, universities, and certification bodies.',
    subcategories: [
      { id: 'corporate_training', name: 'Corporate L&D & Leadership Coaching', suggestedTags: ['Executive Training', 'Team Development', 'Skill Upskilling'] },
      { id: 'edtech_platforms', name: 'EdTech Platforms & Courseware', suggestedTags: ['LMS', 'Interactive Learning', 'Gamified Education', 'SCORM'] },
      { id: 'vocational_technical', name: 'Technical & Vocational Institutes', suggestedTags: ['Trade Certification', 'Coding Bootcamps', 'Industrial Apprenticeships'] },
    ],
    commonCapabilities: ['Accredited Certifications', 'Custom Curriculum Design', 'Global Virtual Classrooms'],
  },
  {
    id: 'retail_consumer_goods',
    name: 'Retail, Wholesale & Consumer Brands',
    icon: '🛍️',
    description: 'Consumer goods, omnichannel retail, fashion apparel, department stores, and wholesale distribution.',
    subcategories: [
      { id: 'fashion_apparel', name: 'Fashion, Footwear & Apparel', suggestedTags: ['Sustainable Fabrics', 'Garment Manufacturing', 'Footwear', 'Accessories'] },
      { id: 'electronics_retail', name: 'Consumer Electronics & Hardware', suggestedTags: ['Smart Home', 'Accessories', 'Audio', 'Warranty Support'] },
      { id: 'groceries_fmcg', name: 'Supermarkets, Kirana & FMCG', suggestedTags: ['Daily Essentials', 'Bulk Provisions', 'Direct Delivery'] },
      { id: 'beauty_cosmetics', name: 'Cosmetics, Skincare & Personal Care', suggestedTags: ['Cruelty-free', 'Clean Beauty', 'Dermatologist Tested', 'Organic'] },
    ],
    commonCapabilities: ['Omnichannel Fulfillment', 'Private Labeling', 'Barcode / EDI Ready', 'Returns Management'],
  },
  {
    id: 'local_independent_services',
    name: 'Local Services & Skilled Specialists',
    icon: '🔧',
    description: 'Automotive diagnostics and repair, beauty salons, electrical contracting, plumbing, and neighbourhood trades.',
    subcategories: [
      { id: 'auto_diagnostics', name: 'Auto Mechanics & Fleet Diagnostics', suggestedTags: ['OBD2 Diagnostics', 'Transmission', 'Brake Service', 'EV Maintenance'] },
      { id: 'salon_wellness', name: 'Beauty Salons & Wellness Spas', suggestedTags: ['Hair Styling', 'Skincare Therapies', 'Aesthetic Treatments'] },
      { id: 'skilled_trades', name: 'Carpentry, Electrical & Plumbing', suggestedTags: ['Emergency Repairs', 'Fixture Fitting', 'Licensed Contractors'] },
    ],
    commonCapabilities: ['Same-day Turnaround', 'Local On-site Service', 'Licensed & Insured Tradespeople'],
  },
  {
    id: 'freelancers_consultants',
    name: 'Freelancers & Independent Consultants',
    icon: '💡',
    description: 'Fractional executives, specialized consultants, independent software architects, copywriters, and solo practitioners.',
    subcategories: [
      { id: 'fractional_exec', name: 'Fractional CTO / CFO / CMO', suggestedTags: ['Advisory', 'Interim Leadership', 'Investor Prep', 'Scaling'] },
      { id: 'independent_tech', name: 'Independent Architects & Tech Leads', suggestedTags: ['Code Audit', 'System Design', 'Performance Tuning'] },
      { id: 'content_strategy', name: 'Copywriting & Content Strategy', suggestedTags: ['Whitepapers', 'Technical Writing', 'UX Writing', 'Storytelling'] },
    ],
    commonCapabilities: ['Agile Retainers', 'Zero Overhead', 'Deep Domain Expertise', 'Direct High-Touch Communication'],
  },
];

// 2. UNIVERSAL BUSINESS MODELS (Multi-select)
export const UNIVERSAL_BUSINESS_MODELS = [
  { id: 'Product-based', label: 'Product-Based', description: 'Designs, manufactures, or retails physical or digital products.' },
  { id: 'Service-based', label: 'Service-Based', description: 'Delivers specialized services, consulting, or hands-on expertise.' },
  { id: 'Hybrid (Product & Service)', label: 'Hybrid (Product & Service)', description: 'Offers both tangible products and complementary services.' },
  { id: 'B2B (Business-to-Business)', label: 'B2B Enterprise', description: 'Transacts primarily with other commercial businesses.' },
  { id: 'B2C (Business-to-Consumer)', label: 'B2C Consumer', description: 'Sells directly to walk-in or online consumers.' },
  { id: 'D2C (Direct-to-Consumer)', label: 'D2C Brand', description: 'Owns manufacturing/brand and sells directly to buyers.' },
  { id: 'Manufacturer', label: 'Manufacturer / Producer', description: 'Operates industrial production or manufacturing lines.' },
  { id: 'Wholesaler / Distributor', label: 'Wholesaler / Master Distributor', description: 'Distributes inventory in bulk to downstream businesses.' },
  { id: 'Retailer / Merchant', label: 'Retailer / Storefront', description: 'Operates physical stores or digital storefronts.' },
  { id: 'Agency / Studio', label: 'Agency / Creative Studio', description: 'Delivers project-based campaigns, engineering, or design.' },
  { id: 'Consultancy / Advisory', label: 'Consultancy / Advisory', description: 'Provides strategic, legal, financial, or technical counsel.' },
  { id: 'SaaS / Software', label: 'SaaS / Cloud Software', description: 'Software platforms with recurring subscription or license models.' },
  { id: 'Healthcare Provider', label: 'Healthcare Facility / Clinic', description: 'Provides medical care, diagnostic, or clinical therapies.' },
  { id: 'Freelancer / Solo Practitioner', label: 'Freelancer / Independent', description: 'Autonomous professional specialist or contractor.' },
  { id: 'Startup', label: 'Venture Startup', description: 'Early to growth stage company innovating in its domain.' },
  { id: 'Enterprise / Corporation', label: 'Enterprise / Multinational', description: 'Large-scale multi-regional or global corporate entity.' },
] as const;

// 3. GLOBAL CURRENCIES
export const GLOBAL_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
];

// 4. GLOBAL COUNTRIES
export const GLOBAL_COUNTRIES: CountryConfig[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', dialCode: '+1', measurementSystem: 'imperial' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', dialCode: '+91', measurementSystem: 'metric' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', dialCode: '+44', measurementSystem: 'metric' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', dialCode: '+49', measurementSystem: 'metric' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', dialCode: '+81', measurementSystem: 'metric' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', dialCode: '+65', measurementSystem: 'metric' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', dialCode: '+61', measurementSystem: 'metric' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', dialCode: '+1', measurementSystem: 'metric' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', dialCode: '+971', measurementSystem: 'metric' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', currency: 'CHF', dialCode: '+41', measurementSystem: 'metric' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', currency: 'EUR', dialCode: '+31', measurementSystem: 'metric' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', currency: 'EUR', dialCode: '+39', measurementSystem: 'metric' },
  { code: 'GLOBAL', name: 'Worldwide / Remote-First', flag: '🌐', currency: 'USD', dialCode: '', measurementSystem: 'metric' },
];

// Helper: Format any amount with proper currency symbol and international format
export function formatCurrencyAmount(amount: number, currencyCode: string = 'USD'): string {
  const config = GLOBAL_CURRENCIES.find(c => c.code === currencyCode) || GLOBAL_CURRENCIES[0];
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch (e) {
    return `${config.symbol}${amount.toLocaleString()}`;
  }
}

// Universal Relationship Types
export const UNIVERSAL_RELATIONSHIP_TYPES = [
  { id: 'Client ↔ Service Provider', label: 'Client ↔ Service Provider', description: 'Engagement for services, consulting, or project delivery' },
  { id: 'Buyer ↔ Supplier / Vendor', label: 'Buyer ↔ Supplier / Vendor', description: 'Procurement of goods, equipment, raw materials, or software licenses' },
  { id: 'Strategic Partner ↔ Partner', label: 'Strategic Collaboration', description: 'Co-marketing, joint venture, syndication, or strategic alliance' },
  { id: 'Subcontractor ↔ General Contractor', label: 'Subcontracting Relationship', description: 'Specialized domain subcontracting under master engagement' },
  { id: 'Technology Partner ↔ Integrator', label: 'Tech Partner & Solution Integrator', description: 'Software platforms and certified integration partners' },
  { id: 'Brand ↔ Distributor', label: 'Brand ↔ Distribution Channel', description: 'Authorized territory distribution or wholesale representation' },
  { id: 'Consultant ↔ Client', label: 'Consultant ↔ Client', description: 'Strategic advisory, legal counsel, or financial restructuring' },
  { id: 'Professional Peer', label: 'Professional Network Connection', description: 'Industry peers sharing best practices, deal flow, and referrals' },
] as const;

