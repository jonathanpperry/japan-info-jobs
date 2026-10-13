import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonIcon,
  LoadingController,
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { logoFacebook, logoGoogle, logoTwitter } from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonCol,
    IonInput,
    IonButton,
    IonIcon,
  ],
})
export class RegisterPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly loadingController = inject(LoadingController);
  private readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly registerForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    addIcons({
      logoFacebook,
      logoGoogle,
      logoTwitter,
    });
  }

  // Form control getters
  get name() {
    return this.registerForm.controls.name;
  }

  get email() {
    return this.registerForm.controls.email;
  }

  get password() {
    return this.registerForm.controls.password;
  }

  // Email/password registration
  async tryRegister(): Promise<void> {
    if (this.isLoading()) {
      return;
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const values = this.registerForm.getRawValue();

    await this.handleRegistration(() =>
      this.authService.doRegister({
        ...values,
        name: values.name.trim(),
      })
    );
  }

  // Facebook registration / login
  async tryRegisterFacebook(): Promise<void> {
    await this.handleRegistration(() => this.authService.doFacebookLogin());
  }

  // Google registration / login
  async tryRegisterGoogle(): Promise<void> {
    await this.handleRegistration(() => this.authService.doGoogleLogin());
  }

  // X / Twitter registration / login
  async tryRegisterTwitter(): Promise<void> {
    await this.handleRegistration(() => this.authService.doTwitterLogin());
  }

  // Shared registration handler
  private async handleRegistration(
    register: () => Promise<unknown>
  ): Promise<void> {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    let loading: HTMLIonLoadingElement | undefined;
    let registered = false;

    try {
      loading = await this.loadingController.create({
        message: 'Creating account...',
        spinner: 'circles',
      });

      await loading.present();

      await register();
      registered = true;

      this.successMessage.set('登録が完了しました。');

      await loading.dismiss();
      loading = undefined;

      const navigated = await this.router.navigateByUrl('/menu', {
        replaceUrl: true,
      });

      if (!navigated) {
        this.errorMessage.set(
          'Registration succeeded, but navigation did not complete.'
        );
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);

      this.errorMessage.set(
        registered
          ? 'Registration succeeded, but navigation failed.'
          : error instanceof Error
          ? error.message
          : 'Unable to register. Please try again.'
      );
    } finally {
      if (loading) {
        await loading.dismiss();
      }

      this.isLoading.set(false);
    }
  }
}
