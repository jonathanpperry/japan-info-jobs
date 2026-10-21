import { Routes } from '@angular/router';
import { MigrationPlaceholderPage } from './pages/migration-placeholder.page';
import { authenticatedGuard, guestGuard } from './guards/auth.guards';

// Remove each path when its real standalone component is migrated.
const pendingRoutes = [
  'applications',
  'application/:id',
  'apply/:id/:resumeId',
  'chooseresume/:id',
  'confirm-apply',
  'confirm-apply/:id',
  'filter-job-categories',
  'menu/:id',
  'profile',
  'resumes',
  'settings',
  'language-popover',
];

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'tabs',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./pages/jobs/jobs.page').then((m) => m.JobsPage),
      },
      {
        path: 'resumes',
        loadComponent: () =>
          import('./pages/resumes/resumes.page').then((m) => m.ResumesPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'profile',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.page').then(
        (m) => m.ResetPasswordPage
      ),
  },
  { path: 'home', redirectTo: 'tabs/home', pathMatch: 'full' },
  { path: 'jobs', redirectTo: 'tabs/jobs', pathMatch: 'full' },
  {
    path: 'job/:id',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('./pages/job-details/job-details.page').then(
        (m) => m.JobDetailsPage
      ),
  },
  { path: 'resumes', redirectTo: 'tabs/resumes', pathMatch: 'full' },
  {
    path: 'bookmarks',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('./pages/bookmarks/bookmarks.page').then((m) => m.BookmarksPage),
  },
  ...['createresume', 'editresume/:id', 'resume/:id'].map((path) => ({
    path,
    canActivate: [authenticatedGuard],
    data: { readOnly: path === 'resume/:id' },
    loadComponent: () =>
      import('./pages/resume-editor/resume-editor.page').then(
        (m) => m.ResumeEditorPage
      ),
  })),
  ...pendingRoutes.map((path) => ({
    path,
    component: MigrationPlaceholderPage,
  })),
];
