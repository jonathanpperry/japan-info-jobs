import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

/** Temporary navigation hub until the legacy menu/tabs are fully migrated. */
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonTitle,
    IonToolbar,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Japan Info Jobs</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <p>Navigation is available while the remaining screens are being migrated.</p>
      <ion-list>
        <ion-item routerLink="/home" detail="true"><ion-label>ホーム</ion-label></ion-item>
        <ion-item routerLink="/applications" detail="true"><ion-label>応募履歴</ion-label></ion-item>
        <ion-item routerLink="/resumes" detail="true"><ion-label>履歴書</ion-label></ion-item>
        <ion-item routerLink="/profile" detail="true"><ion-label>プロフィール</ion-label></ion-item>
        <ion-item routerLink="/settings" detail="true"><ion-label>設定</ion-label></ion-item>
      </ion-list>

      <ion-button expand="block" color="medium" (click)="logout()" [disabled]="isSigningOut()">
        ログアウト
      </ion-button>
      @if (errorMessage()) {
        <p role="alert">{{ errorMessage() }}</p>
      }
    </ion-content>
  `,
})
export class MenuPage {
  private readonly authService = inject(AuthService);
  readonly isSigningOut = signal(false);
  readonly errorMessage = signal('');

  async logout(): Promise<void> {
    if (this.isSigningOut()) return;
    this.isSigningOut.set(true);
    this.errorMessage.set('');
    try {
      await this.authService.doLogout();
    } catch (error) {
      console.error('Sign-out failed', error);
      this.errorMessage.set('Could not sign out. Please try again.');
    } finally {
      this.isSigningOut.set(false);
    }
  }
}
