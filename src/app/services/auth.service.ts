import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { from, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { RoleRepresentation, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private basePath = `${environment.apiBaseUrl}/admin`

  constructor(
    private http: HttpClient,
    private keycloak: Keycloak
  ) { }

  isAuthenticated() {
    return this.keycloak.authenticated;
  }

  hasRole(role: string) {
    return this.keycloak.hasRealmRole(role);
  }

  getToken() {
    return this.keycloak.token;
  }

  getRoles() {
    return this.http.get<RoleRepresentation[]>(`${this.basePath}/roles`);
  }

  loadUserProfile() {
    return from(this.keycloak.loadUserProfile()).pipe(
      map(profile => (
        {
          id: profile?.id,
          username: profile?.username || 'Inconnu',
          email: profile?.email || 'Non renseigné',
          emailVerified: profile.emailVerified,
          lastName: profile?.lastName || 'Non renseigné',
          firstName: profile?.firstName || 'Non renseigné'
        }
      ) as User)
    );
  }

  getUserRoles(id: string) {
    return this.http.get<RoleRepresentation[]>(`${this.basePath}/users/${id}/roles`);
  }

  updateUser(user: User) {
    return this.http.put<User>(`${this.basePath}/users/${user.id}`, user);
  }

  updateUserRoles(id: string, newRoles: RoleRepresentation[]) {
    return this.http.put<RoleRepresentation[]>(`${this.basePath}/users/${id}/roles`, newRoles);
  }

  resetPassword(id: string) {
    return this.http.post(`${this.basePath}/users/${id}/reset-password`, null);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.basePath}/users/${id}`);
  }

  logout() {
    this.keycloak.logout();
  }
}
