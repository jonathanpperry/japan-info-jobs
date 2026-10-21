import { Capacitor } from '@capacitor/core';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(environment.firebaseConfig);

export const firebaseAuth = Capacitor.isNativePlatform()
  ? initializeAuth(firebaseApp, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    })
  : getAuth(firebaseApp);

export const firebaseDb = getFirestore(firebaseApp);
