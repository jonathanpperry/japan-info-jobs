import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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

  get showMenu(): boolean {
    const url = this.router.url.split(/[?#]/)[0];

    return (
      url === '/tabs' ||
      url.startsWith('/tabs/') ||
      url === '/profile' ||
      url === '/settings'
    );
  }
}
