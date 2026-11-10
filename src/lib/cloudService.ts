import { initFirebase, FirebaseConfig } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { Business, SupplyRelationship, LedgerTransaction, UserAccount, UniversalOffering } from '@/types';

const STORAGE_KEYS = {
  USER: 'bizlink_cloud_user_account',
  MY_BUSINESS: 'bizlink_cloud_my_business',
  BUSINESSES: 'bizlink_cloud_directory_businesses',
  RELATIONSHIPS: 'bizlink_cloud_relationships',
  TRANSACTIONS: 'bizlink_cloud_transactions',
  SAVED: 'bizlink_cloud_saved_businesses',
  CONFIG: 'bizlink_cloud_service_config',
};

export interface CloudStatusInfo {
  provider: 'Firebase Cloud Firestore' | 'Local Persistent Vault';
  isConnected: boolean;
  isCloudConfigured: boolean;
  lastSyncedAt: string | null;
  totalSyncedRecords: number;
}

// ── LOCAL STORAGE ENGINE (Client Persistent Cache) ──
export const getLocalData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.error(`[BizLink Vault] Read error for ${key}:`, e);
    return defaultValue;
  }
};

export const setLocalData = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[BizLink Vault] Write error for ${key}:`, e);
  }
};

// ── CLOUD SERVICE CONTROLLER ──
export class CloudServiceManager {
  private static instance: CloudServiceManager;
  private config: FirebaseConfig | null = null;
  private isConnected: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      const savedConfig = getLocalData<FirebaseConfig | null>(STORAGE_KEYS.CONFIG, null);
      if (savedConfig) {
        this.config = savedConfig;
        this.connectCloud(savedConfig);
      } else {
        const { db } = initFirebase();
        this.isConnected = Boolean(db);
      }
    }
  }

  public static getInstance(): CloudServiceManager {
    if (!CloudServiceManager.instance) {
      CloudServiceManager.instance = new CloudServiceManager();
    }
    return CloudServiceManager.instance;
  }

  public getStatus(): CloudStatusInfo {
    const isCloud = this.isConnected;
    const lastSync = getLocalData<string | null>('bizlink_last_sync_timestamp', null);
    const businesses = getLocalData<Business[]>(STORAGE_KEYS.BUSINESSES, []);
    const transactions = getLocalData<LedgerTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    const relationships = getLocalData<SupplyRelationship[]>(STORAGE_KEYS.RELATIONSHIPS, []);

    return {
      provider: isCloud ? 'Firebase Cloud Firestore' : 'Local Persistent Vault',
      isConnected: isCloud,
      isCloudConfigured: Boolean(this.config?.apiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
      lastSyncedAt: lastSync,
      totalSyncedRecords: businesses.length + transactions.length + relationships.length,
    };
  }

  public async connectCloud(customConfig: FirebaseConfig): Promise<{ success: boolean; message: string }> {
    try {
      const { db } = initFirebase(customConfig);
      if (db) {
        this.config = customConfig;
        this.isConnected = true;
        setLocalData(STORAGE_KEYS.CONFIG, customConfig);
        return { success: true, message: 'Successfully connected to Firebase Cloud Firestore!' };
      }
      return { success: false, message: 'Failed to initialize Firebase with the provided credentials.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Connection error' };
    }
  }

  // ── SAVE USER ACCOUNT ──
  public async persistUserAccount(account: UserAccount): Promise<void> {
    setLocalData(STORAGE_KEYS.USER, account);
    const { db } = initFirebase(this.config || undefined);
    if (db) {
      try {
        await setDoc(doc(db, 'bizlink_users', account.id), {
          ...account,
          updatedAt: new Date().toISOString(),
        });
        setLocalData('bizlink_last_sync_timestamp', new Date().toISOString());
      } catch (err) {
        console.warn('[BizLink Cloud] Firestore write error for user account:', err);
      }
    }
  }

  // ── SAVE REGISTERED / CURRENT BUSINESS ──
  public async persistBusiness(business: Business): Promise<void> {
    setLocalData(STORAGE_KEYS.MY_BUSINESS, business);

    // Also update in all businesses list
    const currentList = getLocalData<Business[]>(STORAGE_KEYS.BUSINESSES, []);
    const updated = [business, ...currentList.filter(b => b.id !== business.id)];
    setLocalData(STORAGE_KEYS.BUSINESSES, updated);

    const { db } = initFirebase(this.config || undefined);
    if (db) {
      try {
        await setDoc(doc(db, 'bizlink_businesses', business.id), {
          ...business,
          updatedAt: new Date().toISOString(),
        });
        setLocalData('bizlink_last_sync_timestamp', new Date().toISOString());
      } catch (err) {
        console.warn('[BizLink Cloud] Firestore write error for business:', err);
      }
    }
  }

  // ── SAVE RELATIONSHIP ──
  public async persistRelationship(relationship: SupplyRelationship): Promise<void> {
    const currentList = getLocalData<SupplyRelationship[]>(STORAGE_KEYS.RELATIONSHIPS, []);
    const updated = [relationship, ...currentList.filter(r => r.id !== relationship.id)];
    setLocalData(STORAGE_KEYS.RELATIONSHIPS, updated);

    const { db } = initFirebase(this.config || undefined);
    if (db) {
      try {
        await setDoc(doc(db, 'bizlink_relationships', relationship.id), {
          ...relationship,
          updatedAt: new Date().toISOString(),
        });
        setLocalData('bizlink_last_sync_timestamp', new Date().toISOString());
      } catch (err) {
        console.warn('[BizLink Cloud] Firestore write error for relationship:', err);
      }
    }
  }

  // ── SAVE TRANSACTION ──
  public async persistTransaction(transaction: LedgerTransaction): Promise<void> {
    const currentList = getLocalData<LedgerTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    const updated = [transaction, ...currentList.filter(t => t.id !== transaction.id)];
    setLocalData(STORAGE_KEYS.TRANSACTIONS, updated);

    const { db } = initFirebase(this.config || undefined);
    if (db) {
      try {
        await setDoc(doc(db, 'bizlink_transactions', transaction.id), {
          ...transaction,
          updatedAt: new Date().toISOString(),
        });
        setLocalData('bizlink_last_sync_timestamp', new Date().toISOString());
      } catch (err) {
        console.warn('[BizLink Cloud] Firestore write error for transaction:', err);
      }
    }
  }

  // ── SAVE OFFERING ──
  public async persistOffering(businessId: string, offering: UniversalOffering): Promise<void> {
    const myBiz = getLocalData<Business | null>(STORAGE_KEYS.MY_BUSINESS, null);
    if (myBiz && myBiz.id === businessId) {
      const updatedOfferings = [offering, ...(myBiz.offerings || []).filter(o => o.id !== offering.id)];
      const updatedBiz: Business = {
        ...myBiz,
        offerings: updatedOfferings,
        products: updatedOfferings.filter(o => o.type === 'product').map(p => ({ ...p, unitPrice: p.price })),
        services: updatedOfferings.filter(o => o.type === 'service'),
      };
      await this.persistBusiness(updatedBiz);
    }
  }
}

export const cloudService = CloudServiceManager.getInstance();

