import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton
} from '@ionic/angular';

@Component({
  selector: 'app-resumes',
  templateUrl: './resumes.page.html',
  styleUrls: ['./resumes.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    CommonModule,
    FormsModule,
  ],
})
export class ResumesPage implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log('ResumesPage initialized'); }
}
