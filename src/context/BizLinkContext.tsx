'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Business,
  BusinessRole,
  SupplyRelationship,
  LedgerTransaction,
  SearchResultResponse,
  SerpApiSearchParams,
  UserAccount,
  AccountType,
  UniversalOffering,
  UniversalRelationshipType,
} from '@/types';
import { CURRENT_USER_BUSINESS, MOCK_BUSINESSES } from '@/data/mockBusinesses';
import { INITIAL_RELATIONSHIPS } from '@/data/mockRelationships';
import { INITIAL_TRANSACTIONS } from '@/data/mockLedger';

export type ActiveAppMode = 'landing' | 'business_owner' | 'customer';

export type DashboardView =
  | 'overview'
  | 'find_suppliers'
  | 'find_customers'
  | 'products'
  | 'network'
  | 'transactions'
  | 'reviews'
  | 'profile'
  | 'settings';

interface BizLinkContextType {
  // App & User Accounts
  appMode: ActiveAppMode;
  setAppMode: (mode: ActiveAppMode) => void;
  currentUser: UserAccount;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserAccount>>;
  switchAccountType: (type: AccountType) => void;
  dashboardView: DashboardView;
  setDashboardView: (view: DashboardView) => void;
  activeCurrency: string;
  setActiveCurrency: (curr: string) => void;

  // Business Data
  myBusiness: Business;
  updateMyBusiness: (updated: Partial<Business>) => void;
  businesses: Business[];
  relationships: SupplyRelationship[];
  transactions: LedgerTransaction[];
  savedBusinesses: string[];
  toggleSaveBusiness: (businessId: string) => void;
  
  // Modals & Drawers
  inspectingBusiness: Business | null;
  setInspectingBusiness: (business: Business | null) => void;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  isAddTransactionModalOpen: boolean;
  setIsAddTransactionModalOpen: (open: boolean) => void;
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;
  prefilledTxBusiness: Business | null;
  setPrefilledTxBusiness: (business: Business | null) => void;

  // Universal Relationships & Actions
  connectBusinesses: (
    targetBusiness: Business,
    relationshipType: UniversalRelationshipType,
    categoryDescription?: string,
    initialVolume?: string
  ) => void;
  addSupplierToNetwork: (supplier: Business, initialVolume?: string) => void;
  addCustomerToNetwork: (customer: Business, initialVolume?: string) => void;
  addOffering: (offering: Omit<UniversalOffering, 'id'>) => void;
  addTransaction: (tx: Omit<LedgerTransaction, 'id'>) => void;
  settleTransaction: (txId: string) => void;
  registerNewBusiness: (formData: any) => Business;
  registerNewAccount: (accountData: Partial<UserAccount>) => UserAccount;

  // Universal Discovery Search
  isSearching: boolean;
  searchResults: SearchResultResponse | null;
  searchParams: SerpApiSearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<SerpApiSearchParams>>;
  performBusinessSearch: (customParams?: Partial<SerpApiSearchParams>) => Promise<SearchResultResponse | null>;
  useMockMode: boolean;
  setUseMockMode: (val: boolean) => void;
  detectUserLocation: () => Promise<{ lat: number; lng: number; label: string } | null>;
  isDetectingLocation: boolean;

  // Notifications / Toast
  toastMessage: { title: string; desc: string; type?: 'success' | 'info' | 'warning' } | null;
  showToast: (title: string, desc: string, type?: 'success' | 'info' | 'warning') => void;
}

const DEFAULT_USER: UserAccount = {
  id: 'usr_marcus_vance',
  name: 'Marcus Vance',
  email: 'marcus@apexautonomous.io',
  phone: '+1 (512) 555-0194',
  accountType: 'businessman',
  city: 'Austin',
  country: 'United States',
  countryCode: 'US',
  businessName: 'Apex Autonomous Systems',
  industry: 'Technology, AI & Software',
  businessModel: 'Hybrid (Product & Service)',
  category: 'Industrial IoT & Edge AI',
  taxIdentifier: 'EIN 74-9981240',
};

const BizLinkContext = createContext<BizLinkContextType | undefined>(undefined);

export function BizLinkProvider({ children }: { children: React.ReactNode }) {
  const [appMode, setAppMode] = useState<ActiveAppMode>('landing');
  const [dashboardView, setDashboardView] = useState<DashboardView>('overview');
  const [currentUser, setCurrentUser] = useState<UserAccount>(DEFAULT_USER);
  const [activeCurrency, setActiveCurrency] = useState<string>('USD');
  
  const [myBusiness, setMyBusiness] = useState<Business>(CURRENT_USER_BUSINESS);
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  const [relationships, setRelationships] = useState<SupplyRelationship[]>(INITIAL_RELATIONSHIPS);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>(INITIAL_TRANSACTIONS);
  const [savedBusinesses, setSavedBusinesses] = useState<string[]>(['biz_novubio', 'biz_lumina_agency']);
  
  const [inspectingBusiness, setInspectingBusiness] = useState<Business | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [prefilledTxBusiness, setPrefilledTxBusiness] = useState<Business | null>(null);

  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultResponse | null>(null);
  const [useMockMode, setUseMockMode] = useState(false);
  const [searchParams, setSearchParams] = useState<SerpApiSearchParams>({
    query: '',
    location: 'Austin, TX',
    radiusKm: 50,
    offeringType: 'all',
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const switchAccountType = (type: AccountType) => {
    setCurrentUser(prev => ({ ...prev, accountType: type }));
    if (type === 'individual') {
      setAppMode('customer');
      showToast('Switched to Global Explorer', 'You are now discovering businesses as an Individual / Professional.');
    } else {
      setAppMode('business_owner');
      showToast('Switched to Enterprise Portal', 'You are now managing your Universal Business Profile & Network.');
    }
  };

  const updateMyBusiness = (updated: Partial<Business>) => {
    setMyBusiness(prev => {
      const next = { ...prev, ...updated };
      setBusinesses(bList => bList.map(b => (b.id === prev.id ? next : b)));
      return next;
    });
    showToast('Profile Updated', 'Universal business profile updated successfully.');
  };

  const toggleSaveBusiness = (businessId: string) => {
    setSavedBusinesses(prev => {
      const isSaved = prev.includes(businessId);
      if (isSaved) {
        showToast('Removed from Saved', 'Business removed from your network favorites.', 'info');
        return prev.filter(id => id !== businessId);
      } else {
        showToast('Saved to Network', 'Business bookmarked to your network list.', 'success');
        return [...prev, businessId];
      }
    });
  };

  // Universal Connect: Connects ANY two businesses with ANY relationship type
  const connectBusinesses = (
    targetBusiness: Business,
    relationshipType: UniversalRelationshipType,
    categoryDescription: string = 'Strategic Cross-Sector Partnership',
    initialVolume: string = 'Active Collaboration'
  ) => {
    setBusinesses(prev => {
      const exists = prev.find(b => b.id === targetBusiness.id);
      if (!exists) return [...prev, targetBusiness];
      return prev;
    });

    const alreadyConnected = relationships.some(
      r =>
        (r.sourceId === myBusiness.id && r.targetId === targetBusiness.id) ||
        (r.sourceId === targetBusiness.id && r.targetId === myBusiness.id)
    );

    if (alreadyConnected) {
      showToast('Already Connected', `${targetBusiness.name} is already connected in your network.`, 'info');
      return;
    }

    const newRel: SupplyRelationship = {
      id: `rel_${Date.now()}`,
      sourceId: myBusiness.id,
      targetId: targetBusiness.id,
      sourceName: myBusiness.name,
      targetName: targetBusiness.name,
      sourceRole: myBusiness.industry,
      targetRole: targetBusiness.industry,
      relationshipType,
      category: categoryDescription,
      volumeMonthly: initialVolume,
      activeSince: 'Just now',
      status: 'active',
      commercialNature: 'professional_network',
      creditTermDays: 30,
    };

    setRelationships(prev => [newRel, ...prev]);
    showToast(
      'Connection Established!',
      `Connected ${targetBusiness.name} via [${relationshipType}]. Universal Ecosystem Graph updated!`,
      'success'
    );
  };

  // Backwards compatible helper
  const addSupplierToNetwork = (supplier: Business, initialVolume = 'Active Engagement') => {
    connectBusinesses(supplier, 'Buyer ↔ Supplier / Vendor', supplier.categories[0] || 'Procurement', initialVolume);
  };

  // Backwards compatible helper
  const addCustomerToNetwork = (customer: Business, initialVolume = 'Active Engagement') => {
    connectBusinesses(customer, 'Client ↔ Service Provider', customer.categories[0] || 'Client Account', initialVolume);
  };

  // Universal Offerings: Add either a Product or a Service
  const addOffering = (newOff: Omit<UniversalOffering, 'id'>) => {
    const created: UniversalOffering = {
      ...newOff,
      id: `off_${Date.now()}`,
    };

    const updatedOfferings = [created, ...myBusiness.offerings];
    const updatedProducts = updatedOfferings
      .filter(o => o.type === 'product')
      .map(o => ({ ...o, unitPrice: o.price }));
    const updatedServices = updatedOfferings.filter(o => o.type === 'service');

    updateMyBusiness({
      offerings: updatedOfferings,
      products: updatedProducts,
      services: updatedServices,
    });

    showToast(
      'Offering Added to Catalogue',
      `Published "${created.name}" as a ${created.type === 'product' ? 'Product' : 'Service Offering'}.`,
      'success'
    );
  };

  // Ledger / Transaction actions
  const addTransaction = (tx: Omit<LedgerTransaction, 'id'>) => {
    const newTx: LedgerTransaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      currency: tx.currency || activeCurrency,
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast(
      'Transaction Recorded',
      `Recorded entry for ${newTx.businessName || newTx.customerName}.`,
      'success'
    );
  };

  const settleTransaction = (txId: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === txId ? { ...t, status: 'Settled' } : t))
    );
    showToast('Transaction Settled', 'Marked as completed / settled.', 'success');
  };

  // Universal Registration for any business worldwide
  const registerNewBusiness = (formData: any): Business => {
    const city = formData.city || 'Austin';
    const country = formData.country || 'United States';
    const countryCode = formData.countryCode || 'US';
    const locPrefix = (countryCode || 'GL').toUpperCase();
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const newCode = `BL-${locPrefix}-${randomDigits}`;

    const newBiz: Business = {
      id: `biz_reg_${Date.now()}`,
      businessCode: newCode,
      name: formData.name || 'New Enterprise',
      tagline: formData.tagline || 'Pioneering excellence across the global business network',
      ownerName: formData.ownerName || currentUser.name || 'Business Executive',
      industry: formData.industry || 'Technology, AI & Software',
      subIndustry: formData.subIndustry || 'Custom Software & Mobile Dev',
      businessModels: formData.businessModels || ['Hybrid (Product & Service)', 'B2B (Business-to-Business)'],
      primaryBusinessModel: formData.primaryBusinessModel || 'Hybrid (Product & Service)',
      roles: ['Service Provider'],
      primaryRole: 'Enterprise Provider',
      categories: formData.categories?.length ? formData.categories : ['Enterprise Solutions'],
      description: formData.description || 'Verified enterprise operating on the BizLink Universal Business Network.',
      location: {
        address: formData.address || 'Commercial Center',
        city,
        state: formData.state || 'Metro',
        country,
        countryCode,
        postalCode: formData.postalCode || '10001',
        lat: 30.2672,
        lng: -97.7431,
        distanceKm: 0,
      },
      currency: formData.currency || 'USD',
      rating: 5.0,
      reviewCount: 1,
      verified: true,
      phone: formData.phone || currentUser.phone || '+1 (555) 000-0000',
      email: formData.email || currentUser.email || 'contact@enterprise.com',
      website: formData.website,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      establishedYear: new Date().getFullYear(),
      companySize: formData.companySize || 'Small (11-50)',
      offerings: [],
      products: [],
      services: [],
      capabilities: formData.capabilities || ['Global Delivery', 'Verified Quality Compliance'],
      skills: formData.skills || ['Strategic Planning', 'Enterprise Execution'],
      serviceCoverage: {
        scope: formData.serviceScope || 'Global / Remote',
        regionsOrCountriesServed: ['Worldwide'],
      },
      suppliesTo: ['Enterprise / Corporation'],
      purchasesFrom: ['Technology, AI & Software'],
      reviews: [],
      totalSuppliersCount: 0,
      totalCustomersCount: 0,
      trustScore: 95,
      fulfillmentRate: 99.0,
      source: 'verified_bizlink',
    };

    setBusinesses(prev => [newBiz, ...prev]);
    setMyBusiness(newBiz);
    setCurrentUser(prev => ({
      ...prev,
      accountType: 'businessman',
      businessName: newBiz.name,
      businessRole: newBiz.primaryRole,
      city: newBiz.location.city,
      country: newBiz.location.country,
    }));

    showToast(
      'Business Registered Worldwide!',
      `Created profile for ${newBiz.name} with Global Network ID ${newCode}.`,
      'success'
    );
    return newBiz;
  };

  const registerNewAccount = (accountData: Partial<UserAccount>): UserAccount => {
    const newAcc: UserAccount = {
      id: `usr_${Date.now()}`,
      name: accountData.name || 'Professional User',
      email: accountData.email || 'user@bizlink.network',
      phone: accountData.phone || '+1 (555) 012-3456',
      accountType: accountData.accountType || 'individual',
      city: accountData.city || 'Austin',
      country: accountData.country || 'United States',
      countryCode: accountData.countryCode || 'US',
      businessName: accountData.businessName,
      industry: accountData.industry,
      businessModel: accountData.businessModel,
      taxIdentifier: accountData.taxIdentifier,
    };

    setCurrentUser(newAcc);
    if (newAcc.accountType === 'businessman') {
      registerNewBusiness({
        name: newAcc.businessName || `${newAcc.name} International`,
        ownerName: newAcc.name,
        city: newAcc.city,
        country: newAcc.country,
        countryCode: newAcc.countryCode,
        phone: newAcc.phone,
        email: newAcc.email,
        industry: newAcc.industry,
      });
      setAppMode('business_owner');
    } else {
      setAppMode('customer');
    }

    showToast(
      'Account Created!',
      `Welcome to BizLink, ${newAcc.name}!`,
      'success'
    );
    return newAcc;
  };

  const detectUserLocation = async (): Promise<{ lat: number; lng: number; label: string } | null> => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      showToast('Location Notice', 'Geolocation is not supported by your browser.', 'warning');
      return null;
    }

    setIsDetectingLocation(true);
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        position => {
          setIsDetectingLocation(false);
          const lat = Number(position.coords.latitude.toFixed(4));
          const lng = Number(position.coords.longitude.toFixed(4));
          const locLabel = `GPS (${lat}, ${lng})`;
          setSearchParams(prev => ({
            ...prev,
            location: 'Current Location',
            userLat: lat,
            userLng: lng,
          }));
          showToast('GPS Location Detected', `Coordinates: ${lat}, ${lng}. Ready for radius search.`, 'success');
          resolve({ lat, lng, label: locLabel });
        },
        error => {
          setIsDetectingLocation(false);
          console.warn('Geolocation error:', error);
          showToast('GPS Notice', 'Could not retrieve GPS coordinates. Defaulting to country/global discovery.', 'info');
          resolve(null);
        },
        { timeout: 8000 }
      );
    });
  };

  const performBusinessSearch = async (customParams?: Partial<SerpApiSearchParams>): Promise<SearchResultResponse | null> => {
    setIsSearching(true);
    const mergedParams: SerpApiSearchParams = {
      ...searchParams,
      ...customParams,
      forceMock: useMockMode || (customParams?.forceMock ?? false),
    };

    try {
      const res = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mergedParams),
      });

      if (!res.ok) {
        throw new Error(`Search request failed: ${res.statusText}`);
      }

      const data = (await res.json()) as SearchResultResponse;
      setSearchResults(data);

      if (data.results && data.results.length > 0) {
        setBusinesses(prev => {
          const map = new Map(prev.map(b => [b.id, b]));
          data.results.forEach(b => {
            if (!map.has(b.id)) {
              map.set(b.id, b);
            }
          });
          return Array.from(map.values());
        });
      }

      return data;
    } catch (error) {
      console.error('[Search Error]', error);
      showToast('Search Notice', 'Using universal directory catalog.', 'info');
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <BizLinkContext.Provider
      value={{
        appMode,
        setAppMode,
        currentUser,
        setCurrentUser,
        switchAccountType,
        dashboardView,
        setDashboardView,
        activeCurrency,
        setActiveCurrency,
        myBusiness,
        updateMyBusiness,
        businesses,
        relationships,
        transactions,
        savedBusinesses,
        toggleSaveBusiness,
        inspectingBusiness,
        setInspectingBusiness,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isAddTransactionModalOpen,
        setIsAddTransactionModalOpen,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        prefilledTxBusiness,
        setPrefilledTxBusiness,
        connectBusinesses,
        addSupplierToNetwork,
        addCustomerToNetwork,
        addOffering,
        addTransaction,
        settleTransaction,
        registerNewBusiness,
        registerNewAccount,
        isSearching,
        searchResults,
        searchParams,
        setSearchParams,
        performBusinessSearch,
        useMockMode,
        setUseMockMode,
        detectUserLocation,
        isDetectingLocation,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </BizLinkContext.Provider>
  );
}

export function useBizLink() {
  const context = useContext(BizLinkContext);
  if (!context) {
    throw new Error('useBizLink must be used within a BizLinkProvider');
  }
  return context;
}
