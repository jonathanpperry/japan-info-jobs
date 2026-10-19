import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonAvatar,
  IonSkeletonText,
  IonLabel,
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  ellipsisHorizontalOutline,
  informationCircleOutline,
} from 'ionicons/icons';

import { Job, JobService } from '../../services/job.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonAvatar,
    IonSkeletonText,
    IonLabel,
  ],
})
export class JobsPage implements OnInit, OnDestroy {
  private readonly jobService = inject(JobService);
  private readonly router = inject(Router);

  private readonly cdr = inject(ChangeDetectorRef);

  public jobList: Job[] = [];
  public allJobs: Job[] = [];

  public isLoading = true;
  public errorMessage = '';

  private searchTerm = '';
  private readonly timeoutMs = 15000;
  private requestId = 0;

  constructor() {
    addIcons({
      ellipsisHorizontalOutline,
      informationCircleOutline,
    });
  }

  ngOnInit(): void {
    void this.loadJobs();
  }

  ngOnDestroy(): void {
    // Prevent a pending request from updating
    // a destroyed component.
    this.requestId++;
  }

  private async loadJobs(refresher?: HTMLIonRefresherElement): Promise<void> {
    const currentRequest = ++this.requestId;

    this.errorMessage = '';
    this.isLoading = this.allJobs.length === 0;

    console.log('[JobsPage] Loading jobs...');

    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    try {
      const timeout = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(new Error('JOB_LOAD_TIMEOUT'));
        }, this.timeoutMs);
      });

      const jobs = await Promise.race([this.jobService.getJobs(), timeout]);

      if (currentRequest !== this.requestId) {
        return;
      }

      this.allJobs = jobs;
      this.applyFilter();

      console.log('[JobsPage] Loaded jobs:', jobs.length);
    } catch (error) {
      if (currentRequest !== this.requestId) {
        return;
      }

      console.error('[JobsPage] Failed to load jobs:', error);

      this.errorMessage =
        error instanceof Error && error.message === 'JOB_LOAD_TIMEOUT'
          ? 'Loading jobs timed out. Please try again.'
          : 'Unable to load jobs. Please check your connection and try again.';
    } finally {
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }

      if (currentRequest === this.requestId) {
        this.isLoading = false;
        this.cdr.markForCheck();
      }

      if (refresher) {
        await refresher.complete();
      }
    }
  }

  public retryLoad(): void {
    void this.loadJobs();
  }

  public doRefresh(event: Event): void {
    const refresher = event.target as HTMLIonRefresherElement;

    void this.loadJobs(refresher);
  }

  public filterJobs(event: Event): void {
    const searchEvent = event as CustomEvent<{ value?: string | null }>;

    this.searchTerm = (searchEvent.detail?.value ?? '').trim().toLowerCase();

    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.searchTerm) {
      this.jobList = [...this.allJobs];
      return;
    }

    this.jobList = this.allJobs.filter((job) =>
      (job.jobTitle || '').toLowerCase().includes(this.searchTerm)
    );
  }

  public openJob(job: Job): void {
    void this.router.navigate(['/job', job.id]);
  }

  public openFilterJobsPage(): void {
    void this.router.navigate(['/filter-job-categories']);
  }
}
