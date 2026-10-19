import { Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { firebaseAuth, firebaseDb } from '../core/firebase';
import { Job, JobService } from './job.service';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  constructor(private readonly jobs: JobService) {}

  private async requireUid(): Promise<string> {
    await firebaseAuth.authStateReady();
    const uid = firebaseAuth.currentUser?.uid;
    if (!uid) throw new Error('You must be signed in to manage bookmarks.');
    return uid;
  }

  private async bookmarkRef(jobId: string) {
    const uid = await this.requireUid();
    return doc(firebaseDb, 'users', uid, 'bookmarks', jobId);
  }

  async isBookmarked(jobId: string): Promise<boolean> {
    return (await getDoc(await this.bookmarkRef(jobId))).exists();
  }

  async save(jobId: string): Promise<void> {
    // Check that this ID identifies a real published job before bookmarking it.
    await this.jobs.getJob(jobId);
    await setDoc(await this.bookmarkRef(jobId), {
      jobId,
      createdAt: serverTimestamp(),
    });
  }

  async remove(jobId: string): Promise<void> {
    await deleteDoc(await this.bookmarkRef(jobId));
  }

  async getSavedJobs(): Promise<Job[]> {
    const uid = await this.requireUid();
    const snap = await getDocs(collection(firebaseDb, 'users', uid, 'bookmarks'));
    const records = await Promise.all(snap.docs.map(async (bookmark) => {
      try {
        const job = await this.jobs.getJob(bookmark.id);
        return { job, savedAt: bookmark.data()['createdAt']?.toMillis?.() ?? 0 };
      } catch (error) {
        console.warn('Saved job is no longer available:', bookmark.id, error);
        return null;
      }
    }));

    return records
      .filter((item): item is { job: Job; savedAt: number } => item !== null)
      .sort((a, b) => b.savedAt - a.savedAt)
      .map(item => item.job);
  }
}
