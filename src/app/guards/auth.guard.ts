import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services';

export const authGuard = (route: ActivatedRouteSnapshot, __: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const requiredRoles: string[] = route.data['roles'];

  // Si aucun rôle spécifique n'est requis, on autorise l'accès
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const router = inject(Router);
  return authService.isAuthenticated() && requiredRoles.some(role => authService.hasRole(role)) ? true : router.parseUrl('/forbidden');
}
