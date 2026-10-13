// Place at src/app/core/firebase.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

// Change firebaseConfig to the property name in your environment file.
export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(environment.firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);
