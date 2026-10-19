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
import { addCircleOutline } from 'ionicons/icons';

import { Job, JobService } from '../../services/job.service';

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

  public readonly job = signal<Job | null>(null);
  public readonly isLoading = signal(true);
  public readonly errorMessage = signal('');

  constructor() {
    addIcons({
      addCircleOutline,
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

      console.log('[JobDetails] Loaded:', job);
    } catch (error) {
      console.error('[JobDetails] Failed to load job:', error);

      this.errorMessage.set('Unable to load job details. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
