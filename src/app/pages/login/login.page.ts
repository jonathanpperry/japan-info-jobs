
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly loadingController = inject(LoadingController);
  private readonly authService = inject(AuthService);

  private readonly loadingState = signal(false);
  private readonly loginError = signal('');

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(5)],
    ],
  });

  // Form control getters
  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  // Keep the existing HTML bindings unchanged
  get isLoading(): boolean {
    return this.loadingState();
  }

  get errorMessage(): string {
    return this.loginError();
  }

  // Email/password authentication
  async tryLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    await this.handleLogin(() =>
      this.authService.doLogin(this.loginForm.getRawValue())
    );
  }

  // Facebook authentication
  async tryFacebookLogin(): Promise<void> {
    await this.handleLogin(() =>
      this.authService.doFacebookLogin()
    );
  }

  // Google authentication
  async tryGoogleLogin(): Promise<void> {
    await this.handleLogin(() =>
      this.authService.doGoogleLogin()
    );
  }

  // Twitter / X authentication
  async tryTwitterLogin(): Promise<void> {
    await this.handleLogin(() =>
      this.authService.doTwitterLogin()
    );
  }

  // Shared authentication handler
  private async handleLogin(
    authenticate: () => Promise<unknown>
  ): Promise<void> {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.loginError.set('');

    let loading: HTMLIonLoadingElement | undefined;

    try {
      loading = await this.loadingController.create({
        message: 'Logging in...',
        spinner: 'circles',
      });

      await loading.present();

      await authenticate();

      // Dismiss loading before navigation
      await loading.dismiss();
      loading = undefined;

      await this.router.navigateByUrl('/menu', {
        replaceUrl: true,
      });
    } catch (error: unknown) {
      console.error('Login failed:', error);

      this.loginError.set(
        error instanceof Error
          ? error.message
          : 'Unable to log in. Please try again.'
      );
    } finally {
      if (loading) {
        await loading.dismiss();
      }

      this.loadingState.set(false);
    }
  }
}
