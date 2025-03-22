import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { from, map } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private keycloak: Keycloak) { }

  isAuthenticated() {
    return this.keycloak.authenticated;
  }

  hasRole(role: string) {
    return this.keycloak.hasResourceRole(role);
  }

  loadUserProfile() {
    return from(this.keycloak.loadUserProfile()).pipe(
      map(profile => (
        {
          username: profile?.username || 'Inconnu',
          email: profile?.email || 'Non renseigné',
          firstName: profile?.firstName || 'Non renseigné',
          lastName: profile?.lastName || 'Non renseigné'
        }
      ) as User)
    );
  }

  logout() {
    this.keycloak.logout();
  }
}
