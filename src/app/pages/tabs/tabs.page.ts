import { Component } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  homeOutline,
  briefcaseOutline,
  documentTextOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.page.html',
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon],
})
export class TabsPage {
  constructor() {
    addIcons({
      homeOutline,
      briefcaseOutline,
      documentTextOutline,
    });
  }
}
