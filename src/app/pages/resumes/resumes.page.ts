import { Component, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
  IonMenuButton, IonButton, IonList, IonItem, IonLabel,
} from '@ionic/angular';
import { Resume, ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-resumes',
  standalone: true,
  templateUrl: './resumes.page.html',
  styleUrls: ['./resumes.page.scss'],
  imports: [
    RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
    IonMenuButton, IonButton, IonList, IonItem, IonLabel,
  ],
})
export class ResumesPage implements OnDestroy {
  private readonly service = inject(ResumeService);
  readonly resumes = signal<Resume[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  private request = 0;

  ionViewWillEnter(): void { void this.load(); }
  ionViewWillLeave(): void { this.request++; this.resumes.set([]); }
  ngOnDestroy(): void { this.request++; }

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
        this.error.set('Could not load your résumés. Check your connection and try again.');
      }
    } finally {
      if (request === this.request) this.loading.set(false);
    }
  }
}
