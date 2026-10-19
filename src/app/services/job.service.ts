import { Injectable } from '@angular/core';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

import { firebaseDb } from '../core/firebase';

export interface Job {
  id: string;
  isBookmarked: string;
  isHot: string;
  jobTitle: string;
  companyName: string;
  jobID: string;
  location: string;
  industry: string;
  function: string;
  workType: string;
  salary: string;
  requirements: string;
  description: string;
  positions: string;
}

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly db = firebaseDb;

  async getJobs(): Promise<Job[]> {
    const snapshot = await getDocs(collection(this.db, 'jobs'));

    return snapshot.docs.map((jobDoc) => ({
      ...jobDoc.data(),
      id: jobDoc.id,
    })) as Job[];
  }

  async getJob(id: string): Promise<Job> {
    const snapshot = await getDoc(doc(this.db, 'jobs', id));

    if (!snapshot.exists()) {
      throw new Error(`Job not found: ${id}`);
    }

    return {
      ...snapshot.data(),
      id: snapshot.id,
    } as Job;
  }
}
