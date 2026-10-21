import { Injectable } from '@angular/core';
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs,
  query, serverTimestamp, updateDoc, where,
} from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '../core/firebase';

export interface ResumeFields {
  title: string;
  languageAbilities: string;
  careerObjectives: string;
  specialties: string;
  educationalHistory: string;
  workHistory: string;
}

export interface Resume extends ResumeFields {
  id: string;
  uid: string;
}

export const resumeFields: ReadonlyArray<{ key: keyof ResumeFields; label: string }> = [
  { key: 'title', label: 'Title (タイトル)' },
  { key: 'languageAbilities', label: 'Languages / JLPT (日本語能力)' },
  { key: 'careerObjectives', label: 'Career objectives (経歴目標)' },
  { key: 'specialties', label: 'Specialties and skills (専門とスキル)' },
  { key: 'educationalHistory', label: 'Education (学歴)' },
  { key: 'workHistory', label: 'Work history (職歴)' },
];

export function emptyResume(): ResumeFields {
  return {
    title: '', languageAbilities: '', careerObjectives: '',
    specialties: '', educationalHistory: '', workHistory: '',
  };
}

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private async requireUid(): Promise<string> {
    await firebaseAuth.authStateReady();
    const uid = firebaseAuth.currentUser?.uid;
    if (!uid) throw new Error('Please sign in to manage your résumés.');
    return uid;
  }

  private clean(values: ResumeFields): ResumeFields {
    const result = emptyResume();
    for (const { key, label } of resumeFields) {
      const value = values[key]?.trim();
      if (!value) throw new Error(label + ' is required.');
      if (value.length > 10000) throw new Error(label + ' must be at most 10,000 characters.');
      result[key] = value;
    }
    return result;
  }

  async getResumes(): Promise<Resume[]> {
    const uid = await this.requireUid();
    const snapshot = await getDocs(query(
      collection(firebaseDb, 'resumes'), where('uid', '==', uid)
    ));
    return snapshot.docs.map(item => ({
      ...emptyResume(), ...item.data(), id: item.id,
    } as Resume)).sort((a, b) => a.title.localeCompare(b.title));
  }

  private async ownedResume(id: string, uid: string): Promise<Resume> {
    const snapshot = await getDoc(doc(firebaseDb, 'resumes', id));
    if (!snapshot.exists() || snapshot.data()['uid'] !== uid) {
      throw new Error('This résumé is unavailable.');
    }
    return { ...emptyResume(), ...snapshot.data(), id: snapshot.id } as Resume;
  }

  async getResume(id: string): Promise<Resume> {
    return this.ownedResume(id, await this.requireUid());
  }

  async save(values: ResumeFields, id?: string): Promise<string> {
    const uid = await this.requireUid();
    const data = this.clean(values);
    if (id) {
      await this.ownedResume(id, uid);
      await updateDoc(doc(firebaseDb, 'resumes', id), {
        ...data, updatedAt: serverTimestamp(),
      });
      return id;
    }
    const result = await addDoc(collection(firebaseDb, 'resumes'), {
      ...data, uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    return result.id;
  }

  async remove(id: string): Promise<void> {
    await this.ownedResume(id, await this.requireUid());
    await deleteDoc(doc(firebaseDb, 'resumes', id));
  }
}
