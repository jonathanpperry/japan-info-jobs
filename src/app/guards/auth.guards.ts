import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Protect pages that require authentication.
export const authenticatedGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = await authService.loadUser();

  return user ? true : router.createUrlTree(['/login']);
};

// Redirect already-authenticated users away from login.
export const guestGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = await authService.loadUser();

  return user ? router.createUrlTree(['/tabs/home']) : true;
};
