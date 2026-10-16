import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonFooter,
  IonRow,
  IonCol,
  IonButton,
  ToastController,
} from '@ionic/angular';

import {
  ProfileService,
  Profile,
  ProfileChanges,
} from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonFooter,
    IonRow,
    IonCol,
    IonButton,
  ],
})
export class ProfilePage implements OnInit, OnDestroy {
  private readonly profileService = inject(ProfileService);
  private readonly toastController = inject(ToastController);

  public userFullName = '';
  public isLoading = true;
  public isSaving = false;
  public profileId: string | null = null;

  public profile: Profile = {
    uid: '',
    name: '',
    email: '',
    DOB: '',
  };

  private destroyed = false;

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    try {
      const existingProfile = await this.profileService.getOrCreateProfile();

      if (this.destroyed) {
        return;
      }

      this.profileId = existingProfile.id;

      this.profile = {
        uid: existingProfile.uid,
        name: existingProfile.name,
        email: existingProfile.email,
        DOB: existingProfile.DOB,
      };

      this.userFullName = this.profile.name;
    } catch (error) {
      console.error('Failed to load profile:', error);

      if (!this.destroyed) {
        await this.showToast('Unable to load your profile.', 'danger');
      }
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile(): Promise<void> {
    if (this.isSaving) {
      return;
    }

    if (this.isLoading || !this.profileId) {
      await this.showToast('Profile has not finished loading.', 'danger');
      return;
    }

    const changes: ProfileChanges = {
      name: this.profile.name.trim(),
      email: this.profile.email.trim(),
      DOB: this.profile.DOB.trim(),
    };

    if (!changes.name) {
      await this.showToast('Please enter your name.', 'danger');
      return;
    }

    if (changes.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changes.email)) {
      await this.showToast('Please enter a valid email address.', 'danger');
      return;
    }

    this.isSaving = true;

    try {
      await this.profileService.updateProfile(changes, this.profileId);

      this.profile = {
        ...this.profile,
        ...changes,
      };

      this.userFullName = changes.name;

      await this.showToast('Profile updated successfully.', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);

      await this.showToast('Unable to save profile changes.', 'danger');
    } finally {
      this.isSaving = false;
    }
  }

  private async showToast(
    message: string,
    color: 'success' | 'danger'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color,
    });

    await toast.present();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }
}
