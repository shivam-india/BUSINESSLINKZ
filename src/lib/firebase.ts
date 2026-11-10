import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

// Default config from Next.js environment variables (if configured)
export const getEnvFirebaseConfig = (): FirebaseConfig => {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
};

let cachedApp: FirebaseApp | null = null;
let cachedDb: Firestore | null = null;
let cachedAuth: Auth | null = null;

export const initFirebase = (customConfig?: FirebaseConfig): { app: FirebaseApp | null; db: Firestore | null; auth: Auth | null } => {
  try {
    const config = customConfig || getEnvFirebaseConfig();

    if (!config.apiKey || !config.projectId) {
      return { app: null, db: null, auth: null };
    }

    if (getApps().length > 0) {
      cachedApp = getApp();
    } else {
      cachedApp = initializeApp(config);
    }

    cachedDb = getFirestore(cachedApp);
    cachedAuth = getAuth(cachedApp);

    return { app: cachedApp, db: cachedDb, auth: cachedAuth };
  } catch (err) {
    console.warn('[BizLink Cloud] Firebase initialization warning:', err);
    return { app: null, db: null, auth: null };
  }
};

export const getCloudFirestore = (): Firestore | null => {
  if (cachedDb) return cachedDb;
  const { db } = initFirebase();
  return db;
};

