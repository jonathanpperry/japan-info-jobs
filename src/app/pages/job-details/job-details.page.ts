import { Component, OnInit, inject, signal } from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonFooter,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { addCircleOutline, bookmarkOutline, bookmark } from 'ionicons/icons';

import { Job, JobService } from '../../services/job.service';
import { BookmarkService } from '../../services/bookmark.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  templateUrl: './job-details.page.html',
  styleUrls: ['./job-details.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonFooter,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class JobDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly jobService = inject(JobService);
  private readonly bookmarks = inject(BookmarkService);

  public readonly job = signal<Job | null>(null);
  public readonly isLoading = signal(true);
  public readonly errorMessage = signal('');

  public readonly isSaved = signal(false);
  public readonly bookmarkBusy = signal(false);
  public readonly bookmarkError = signal('');

  constructor() {
    addIcons({
      addCircleOutline,
      bookmarkOutline,
      bookmark,
    });
  }

  ngOnInit(): void {
    void this.loadJob();
  }

  public async loadJob(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.job.set(null);

    if (!id) {
      this.errorMessage.set('No job ID was provided.');
      this.isLoading.set(false);
      return;
    }

    try {
      console.log('[JobDetails] Loading job:', id);

      const job = await this.jobService.getJob(id);

      this.job.set(job);
      this.isSaved.set(await this.bookmarks.isBookmarked(id));

      console.log('[JobDetails] Loaded:', job);
    } catch (error) {
      console.error('[JobDetails] Failed to load job:', error);

      this.errorMessage.set('Unable to load job details. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  public async toggleBookmark(): Promise<void> {
    const job = this.job();

    if (!job || this.bookmarkBusy()) return;

    this.bookmarkBusy.set(true);
    this.bookmarkError.set('');

    try {
      if (this.isSaved()) {
        await this.bookmarks.remove(job.id);
        this.isSaved.set(false);
      } else {
        await this.bookmarks.save(job.id);
        this.isSaved.set(true);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      this.bookmarkError.set('Unable to update bookmark. Please try again.');
    } finally {
      this.bookmarkBusy.set(false);
    }
  }
}
