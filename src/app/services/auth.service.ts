// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  type User,
  type UserCredential,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Observable, map, shareReplay } from 'rxjs';
import { firebaseAuth, firebaseDb } from '../core/firebase';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegistrationDetails extends LoginCredentials {
  name: string;
}

interface UserSession {
  id: string;
  role: 'USER';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = firebaseAuth;
  private readonly firestore = firebaseDb;
  private readonly router = inject(Router);

  // The Firebase SDK restores persistence and notifies the observer.
  readonly currentUser$ = new Observable<User | null>((subscriber) =>
    onAuthStateChanged(
      this.auth,
      (user) => subscriber.next(user),
      (error) => subscriber.error(error)
    )
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  // Compatibility with subscribers to the old authService.user stream.
  // This role value is for UI only; enforce access with Firebase rules/claims.
  readonly user = this.currentUser$.pipe(
    map((user): UserSession | null =>
      user ? { id: user.uid, role: 'USER' } : null
    )
  );

  async loadUser(): Promise<User | null> {
    await this.auth.authStateReady();
    return this.auth.currentUser;
  }

  async doRegister(values: RegistrationDetails): Promise<UserCredential> {
    const result = await createUserWithEmailAndPassword(
      this.auth,
      values.email,
      values.password
    );

    const name = values.name.trim();
    if (name) {
      await updateProfile(result.user, { displayName: name });
    }

    // Passwords must never be written to Firestore.
    await this.createUserProfile(result.user, name);
    return result;
  }

  doLogin(values: LoginCredentials): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.auth,
      values.email,
      values.password
    );
  }

  async doFacebookLogin(): Promise<UserCredential> {
    if (Capacitor.isNativePlatform()) {
      const result = await FirebaseAuthentication.signInWithFacebook({
        skipNativeAuth: true,
      });
      const accessToken = result.credential?.accessToken;
      if (!accessToken) {
        throw new Error('Facebook did not return an access token. Check native Facebook setup.');
      }

      return this.completeSocialLogin(
        signInWithCredential(
          this.auth,
          FacebookAuthProvider.credential(accessToken)
        )
      );
    }

    return this.completeSocialLogin(
      signInWithPopup(this.auth, new FacebookAuthProvider())
    );
  }

  async doGoogleLogin(): Promise<UserCredential> {
    if (Capacitor.isNativePlatform()) {
      const result = await FirebaseAuthentication.signInWithGoogle({
        skipNativeAuth: true,
      });
      const idToken = result.credential?.idToken;
      if (!idToken) {
        throw new Error('Google did not return an ID token. Check native Google setup.');
      }

      return this.completeSocialLogin(
        signInWithCredential(
          this.auth,
          GoogleAuthProvider.credential(idToken)
        )
      );
    }

    return this.completeSocialLogin(
      signInWithPopup(this.auth, new GoogleAuthProvider())
    );
  }

  async doTwitterLogin(): Promise<UserCredential> {
    if (Capacitor.isNativePlatform()) {
      // This provider requires platform-specific validation and setup.
      if (Capacitor.getPlatform() !== 'ios') {
        throw new Error('Native X sign-in on Android requires a separate integration.');
      }

      const result = await FirebaseAuthentication.signInWithTwitter({
        skipNativeAuth: true,
      });
      const token = result.credential?.accessToken;
      const secret = result.credential?.secret;
      if (!token || !secret) {
        throw new Error('X did not return the required credentials.');
      }

      return this.completeSocialLogin(
        signInWithCredential(
          this.auth,
          TwitterAuthProvider.credential(token, secret)
        )
      );
    }

    return this.completeSocialLogin(
      signInWithPopup(this.auth, new TwitterAuthProvider())
    );
  }

  registerFacebook(): Promise<UserCredential> {
    return this.doFacebookLogin();
  }

  getUserID(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  getUserEmail(): string | null {
    return this.auth.currentUser?.email ?? null;
  }

  getUserName(): string | null {
    return this.auth.currentUser?.displayName ?? null;
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  async doLogout(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await FirebaseAuthentication.signOut();
      } catch (error) {
        console.error('Native sign-out failed:', error);
      }
    }

    await signOut(this.auth);
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  private async completeSocialLogin(
    pendingLogin: Promise<UserCredential>
  ): Promise<UserCredential> {
    const result = await pendingLogin;
    if (getAdditionalUserInfo(result)?.isNewUser) {
      await this.createUserProfile(result.user);
    }
    return result;
  }

  private async createUserProfile(
    user: User,
    name?: string
  ): Promise<void> {
    await setDoc(
      doc(this.firestore, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email,
        name: name ?? user.displayName ?? '',
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}
