import { Component, OnDestroy, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular';
import { Resume, ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-resumes',
  standalone: true,
  templateUrl: './resumes.page.html',
  styleUrls: ['./resumes.page.scss'],
  imports: [
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
  ],
})
export class ResumesPage implements OnDestroy {
  private readonly service = inject(ResumeService);
  private readonly router = inject(Router);

  readonly resumes = signal<Resume[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  private request = 0;

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;

      const path = event.urlAfterRedirects.split(/[?#]/)[0];

      if (path === '/tabs/resumes') {
        void this.load();
      } else {
        // Ignore outstanding requests after navigating away.
        this.request++;
        this.resumes.set([]);
      }
    });
  }

  ngOnDestroy(): void {
    this.request++;
  }

  async load(): Promise<void> {
    const request = ++this.request;
    this.loading.set(true);
    this.error.set('');
    this.resumes.set([]);
    try {
      const resumes = await this.service.getResumes();
      if (request === this.request) this.resumes.set(resumes);
    } catch {
      if (request === this.request) {
        this.error.set(
          'Could not load your résumés. Check your connection and try again.'
        );
      }
    } finally {
      if (request === this.request) this.loading.set(false);
    }
  }
}
