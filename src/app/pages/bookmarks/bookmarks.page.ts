import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bookmarkOutline, trashOutline } from 'ionicons/icons';
import { BookmarkService } from '../../services/bookmark.service';
import { Job } from '../../services/job.service';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonSpinner,
    RouterLink,
  ],
})
export class BookmarksPage {
  private readonly bookmarks = inject(BookmarkService);
  private readonly router = inject(Router);

  readonly jobs = signal<Job[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly removingId = signal<string | null>(null);

  constructor() {
    addIcons({ bookmarkOutline, trashOutline });
  }

  // Ionic may reuse the page; refresh every time it becomes visible.
  ionViewWillEnter(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      this.jobs.set(await this.bookmarks.getSavedJobs());
    } catch (error) {
      console.error('Unable to load bookmarks:', error);
      this.errorMessage.set('Unable to load saved jobs. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  open(job: Job): void {
    void this.router.navigate(['/job', job.id]);
  }

  async remove(job: Job): Promise<void> {
    if (this.removingId()) return;
    this.removingId.set(job.id);
    this.errorMessage.set('');
    try {
      await this.bookmarks.remove(job.id);
      this.jobs.update((jobs) => jobs.filter((saved) => saved.id !== job.id));
    } catch (error) {
      console.error('Unable to remove bookmark:', error);
      this.errorMessage.set('Could not remove saved job. Please try again.');
    } finally {
      this.removingId.set(null);
    }
  }
}
