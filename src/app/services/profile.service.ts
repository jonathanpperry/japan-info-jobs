import { Injectable } from '@angular/core';

import { type User } from 'firebase/auth';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
  type DocumentSnapshot,
} from 'firebase/firestore';

import { firebaseAuth, firebaseDb } from '../core/firebase';

export interface Profile {
  uid: string;
  name: string;
  email: string;
  DOB: string;
}

export type ProfileChanges = Pick<Profile, 'name' | 'email' | 'DOB'>;

export interface ProfileDocument extends Profile {
  id: string;
}

type StoredProfile = Partial<Profile> & {
  fullName?: string;
  dob?: string;
};

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly auth = firebaseAuth;
  private readonly db = firebaseDb;

  private async requireUser(): Promise<User> {
    await this.auth.authStateReady();

    const user = this.auth.currentUser;

    if (!user) {
      throw new Error('No authenticated user found.');
    }

    return user;
  }

  private toProfile(snapshot: DocumentSnapshot, user: User): ProfileDocument {
    const data = snapshot.data() as StoredProfile;

    return {
      id: snapshot.id,
      uid: user.uid,
      name: data.name ?? data.fullName ?? '',
      email: data.email ?? user.email ?? '',
      DOB: data.DOB ?? data.dob ?? '',
    };
  }

  /**
   * Retrieve the authenticated user's profile.
   * Create it if it does not exist.
   */
  async getOrCreateProfile(): Promise<ProfileDocument> {
    const user = await this.requireUser();

    // Preferred modern structure: users/{auth.uid}
    const userRef = doc(this.db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      return this.toProfile(userSnapshot, user);
    }

    // Compatibility with legacy auto-generated document IDs.
    const legacyQuery = query(
      collection(this.db, 'users'),
      where('uid', '==', user.uid),
      limit(1)
    );

    const legacySnapshot = await getDocs(legacyQuery);

    if (!legacySnapshot.empty) {
      return this.toProfile(legacySnapshot.docs[0], user);
    }

    const newProfile: Profile = {
      uid: user.uid,
      name: user.displayName ?? '',
      email: user.email ?? '',
      DOB: '',
    };

    await setDoc(userRef, newProfile);

    return {
      id: user.uid,
      ...newProfile,
    };
  }

  /**
   * Retrieve an existing profile by document ID.
   */
  async getProfile(id: string): Promise<ProfileDocument | undefined> {
    const user = await this.requireUser();

    if (!id) {
      return undefined;
    }

    const snapshot = await getDoc(doc(this.db, 'users', id));

    if (!snapshot.exists()) {
      return undefined;
    }

    const data = snapshot.data() as StoredProfile;

    if (data.uid !== user.uid) {
      throw new Error('Profile does not belong to the current user.');
    }

    return this.toProfile(snapshot, user);
  }

  /**
   * Update editable profile fields.
   * The UID remains unchanged.
   */
  async updateProfile(
    changes: ProfileChanges,
    profileId: string
  ): Promise<void> {
    const user = await this.requireUser();

    if (!profileId) {
      throw new Error('Cannot update profile without a document ID.');
    }

    const name = changes.name.trim();
    const email = changes.email.trim();
    const DOB = changes.DOB.trim();

    if (!name) {
      throw new Error('Name is required.');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email address.');
    }

    const documentRef = doc(this.db, 'users', profileId);

    const snapshot = await getDoc(documentRef);

    if (!snapshot.exists()) {
      throw new Error('Profile document not found.');
    }

    const existing = snapshot.data() as StoredProfile;

    if (existing.uid !== user.uid) {
      throw new Error('You are not authorized to update this profile.');
    }

    await updateDoc(documentRef, {
      name,
      email,
      DOB,
    });
  }
}
