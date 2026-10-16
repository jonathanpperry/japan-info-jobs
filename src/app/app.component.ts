import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastController } from '@ionic/angular';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonMenuToggle,
  IonItem,
  IonLabel,
} from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    RouterLink,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonLabel,
  ],
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastController = inject(ToastController);

  public isLoggingOut = false;

  get showMenu(): boolean {
    const url = this.router.url.split(/[?#]/)[0];

    return (
      url === '/tabs' ||
      url.startsWith('/tabs/') ||
      url === '/profile' ||
      url === '/settings'
    );
  }

  async logout(): Promise<void> {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;

    try {
      await this.authService.doLogout();
    } catch (error) {
      console.error('Logout failed:', error);

      const toast = await this.toastController.create({
        message: 'Unable to log out. Please try again.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });

      await toast.present();
    } finally {
      this.isLoggingOut = false;
    }
  }
}
