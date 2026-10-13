import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonTitle,
    IonToolbar,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>パスワードをリセット</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>パスワードをお忘れですか？</h2>
      <p>アカウントのメールアドレスを入力してください。</p>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <ion-input
          type="email"
          label="メールアドレス (Email)"
          labelPlacement="floating"
          fill="outline"
          autocomplete="email"
          inputmode="email"
          formControlName="email"
        ></ion-input>

        @if (form.controls.email.invalid && (form.controls.email.touched || form.controls.email.dirty)) {
          <p role="alert">有効なメールアドレスを入力してください。</p>
        }
        <ion-button expand="block" type="submit" [disabled]="isSubmitting()">
          再設定用メールを送信
        </ion-button>
      </form>

      @if (submitted()) {
        <p role="status">アカウントが存在する場合、パスワード再設定メールが送信されます。</p>
      }
      @if (errorMessage()) {
        <p role="alert">{{ errorMessage() }}</p>
      }
      <p><a routerLink="/login">ログインに戻る</a></p>
    </ion-content>
  `,
})
export class ResetPasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  readonly isSubmitting = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal('');

  async submit(): Promise<void> {
    if (this.isSubmitting()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitted.set(false);
    this.errorMessage.set('');
    try {
      await this.authService.resetPassword(this.form.controls.email.value.trim());
      this.submitted.set(true);
    } catch (error) {
      console.error('Password reset request failed', error);
      this.errorMessage.set('Unable to send the reset email. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
