import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

/**
 * The logic below is a simple example, please make it more robust when implementing in your application.
 *
 * Reason: isAccessGranted is not validating the resource, since it is merging all roles. Two resources might
 * have the same role name and it makes sense to validate it more granular.
 */
const isAccessAllowed = async (route: ActivatedRouteSnapshot, __: RouterStateSnapshot, authData: AuthGuardData): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;

  const requiredRoles = route.data['roles'];
  if (!requiredRoles) {
    return false;
  }

  const hasRequiredRole = (roles: string[]) => grantedRoles.resourceRoles['angular-app'].some(role => roles.includes(role))

  if (authenticated && hasRequiredRole(requiredRoles)) {
    return true;
  }

  const router = inject(Router);
  return router.parseUrl('/forbidden');
};

export const authGuard = createAuthGuard<CanActivateFn>(isAccessAllowed);
