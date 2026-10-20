import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AlertController, IonBackButton, IonButton, IonButtons, IonContent,
  IonHeader, IonItem, IonTextarea, IonTitle, IonToolbar,
} from '@ionic/angular';
import {
  emptyResume, ResumeFields, resumeFields, ResumeService,
} from '../../services/resume.service';

@Component({
  selector: 'app-resume-editor',
  standalone: true,
  templateUrl: './resume-editor.page.html',
  imports: [
    FormsModule, RouterLink, IonBackButton, IonButton, IonButtons,
    IonContent, IonHeader, IonItem, IonTextarea, IonTitle, IonToolbar,
  ],
})
export class ResumeEditorPage implements OnInit {
  private readonly service = inject(ResumeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alerts = inject(AlertController);
  readonly id = this.route.snapshot.paramMap.get('id') ?? undefined;
  readonly readOnly = this.route.snapshot.data['readOnly'] === true;
  readonly fields = resumeFields;
  readonly loading = signal(false);
  readonly busy = signal(false);
  readonly loadError = signal('');
  readonly actionError = signal('');
  values: ResumeFields = emptyResume();

  ngOnInit(): void { void this.load(); }

  async load(): Promise<void> {
    if (!this.id) return;
    this.loading.set(true);
    this.loadError.set('');
    try {
      const resume = await this.service.getResume(this.id);
      for (const { key } of this.fields) this.values[key] = resume[key];
    } catch {
      this.loadError.set('This résumé could not be loaded. It may have been removed, or you may not have access.');
    } finally {
      this.loading.set(false);
    }
  }

  async save(form: NgForm): Promise<void> {
    if (this.busy() || this.readOnly) return;
    this.actionError.set('');
    if (form.invalid || this.fields.some(({ key }) => !this.values[key].trim())) {
      form.control.markAllAsTouched();
      this.actionError.set('Please complete every field.');
      return;
    }
    this.busy.set(true);
    try {
      await this.service.save(this.values, this.id);
    } catch {
      this.actionError.set('Could not save your résumé. Your entries are still here. Please try again.');
      this.busy.set(false);
      return;
    }
    // Leave the editor only after Firestore confirms the save.
    await this.router.navigateByUrl('/tabs/resumes', { replaceUrl: true });
    this.busy.set(false);
  }

  async confirmDelete(): Promise<void> {
    if (!this.id || this.busy()) return;
    const alert = await this.alerts.create({
      header: 'Delete résumé?',
      message: 'This permanently removes this résumé.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive', handler: () => { void this.remove(); } },
      ],
    });
    await alert.present();
  }

  private async remove(): Promise<void> {
    if (!this.id || this.busy()) return;
    this.busy.set(true);
    this.actionError.set('');
    try {
      await this.service.remove(this.id);
    } catch {
      this.actionError.set('Could not delete your résumé. Please try again.');
      this.busy.set(false);
      return;
    }
    await this.router.navigateByUrl('/tabs/resumes', { replaceUrl: true });
    this.busy.set(false);
  }
}
