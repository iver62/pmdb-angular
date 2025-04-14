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
    return this.keycloak.hasRealmRole(role);
  }

  getToken() {
    return this.keycloak.token;
  }

  loadUserProfile() {
    return from(this.keycloak.loadUserProfile()).pipe(
      map(profile => (
        {
          id: profile?.id,
          username: profile?.username || 'Inconnu',
          email: profile?.email || 'Non renseigné',
          emailVerified: profile.emailVerified,
          name: `${profile?.firstName} ${profile?.lastName}` || 'Non renseigné'
        }
      ) as User)
    );
  }

  logout() {
    this.keycloak.logout();
  }
}
