import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  collection, 
  deleteDoc, 
  onSnapshot,
  getDocFromServer,
  query,
  orderBy
} from 'firebase/firestore';

import firebaseConfig from '../../firebase-applet-config.json';
import { User, QrConfig } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore & Auth
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId) 
  : getFirestore(app);
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Firestore Error Handler Interface
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on Boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

// User Profile Sync
export async function syncUserProfile(firebaseUser: FirebaseUser, customName?: string): Promise<User> {
  const userPath = `users/${firebaseUser.uid}`;
  const userRef = doc(db, userPath);

  const fallbackName = customName || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User');
  const avatarUrl = firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email || firebaseUser.uid}`;

  try {
    const existingDoc = await getDoc(userRef);
    if (existingDoc.exists()) {
      const data = existingDoc.data();
      return {
        id: firebaseUser.uid,
        name: data.name || fallbackName,
        email: firebaseUser.email || data.email || 'user@linktoqr.in',
        avatar: data.avatar || avatarUrl,
        plan: data.plan || 'Pro',
        createdAt: data.createdAt || new Date().toISOString().split('T')[0],
      };
    } else {
      const newUser: User = {
        id: firebaseUser.uid,
        name: fallbackName,
        email: firebaseUser.email || 'user@linktoqr.in',
        avatar: avatarUrl,
        plan: 'Pro',
        createdAt: new Date().toISOString().split('T')[0],
      };

      await setDoc(userRef, {
        uid: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        plan: newUser.plan,
        createdAt: newUser.createdAt,
      });

      return newUser;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, userPath);
    throw err;
  }
}

// Authentication Helpers
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return await syncUserProfile(result.user);
  } catch (error: any) {
    if (
      error?.code === 'auth/cancelled-popup-request' || 
      error?.code === 'auth/popup-closed-by-user'
    ) {
      console.warn('Google Sign-In popup request was cancelled or closed by user.');
    } else {
      console.error('Google Sign-In Error:', error);
    }
    throw error;
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return await syncUserProfile(result.user);
  } catch (error) {
    console.error('Email Login Error:', error);
    throw error;
  }
}

export async function signupWithEmail(email: string, pass: string, fullName: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    return await syncUserProfile(result.user, fullName);
  } catch (error) {
    console.error('Email Signup Error:', error);
    throw error;
  }
}

export async function logoutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
  }
}

// Firestore Saved QRs Interface
export interface FirestoreSavedQr {
  id: string;
  userId: string;
  name: string;
  type: string;
  payload: string;
  config?: Partial<QrConfig>;
  createdAt: string;
}

// Saved QRs API Helpers
export async function saveQrCodeToFirestore(userId: string, name: string, type: string, payload: string, config?: QrConfig): Promise<FirestoreSavedQr> {
  const qrId = `qr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const qrPath = `users/${userId}/savedQrs/${qrId}`;
  
  const savedItem: FirestoreSavedQr = {
    id: qrId,
    userId,
    name: name || 'Untitled QR',
    type: type || 'url',
    payload: payload || '',
    config: config ? JSON.parse(JSON.stringify(config)) : {},
    createdAt: new Date().toISOString().split('T')[0],
  };

  try {
    await setDoc(doc(db, qrPath), savedItem);
    return savedItem;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, qrPath);
    throw err;
  }
}

export async function fetchUserSavedQrsFromFirestore(userId: string): Promise<FirestoreSavedQr[]> {
  const collectionPath = `users/${userId}/savedQrs`;
  try {
    const q = query(collection(db, collectionPath));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data() as FirestoreSavedQr);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, collectionPath);
    return [];
  }
}

export async function deleteSavedQrFromFirestore(userId: string, qrId: string): Promise<void> {
  const qrPath = `users/${userId}/savedQrs/${qrId}`;
  try {
    await deleteDoc(doc(db, qrPath));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, qrPath);
    throw err;
  }
}

// Test connection on module load
testConnection();
