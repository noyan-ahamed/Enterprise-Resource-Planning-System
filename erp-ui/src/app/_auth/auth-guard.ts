import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth-service';
import { AuthService } from '../services/auth.service';


export const AuthGuard: CanActivateFn = (route, state) => {
  const userAuthService = inject(UserAuthService);
  const router = inject(Router);
  const authService = inject(AuthService)

    const token = userAuthService.getToken();

  if (!token) {
    router.navigate(['/login-component']);
    return false;
  }

  const roles = route.data['roles'] as Array<string>;

  if (!roles || roles.length === 0) {
    return true;
  }

  const match = authService.roleMatch(roles);

  if (match) {
    return true;
  }
  router.navigate(['/page-not-found']);
  return false;
};
