// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class UserService {
  private firstName: string | null = null;

  private userNameSubject = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();

  private userIdSubject = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSubject.asObservable();

  private userImageUrlSubject = new BehaviorSubject<string | null>(null);
  userImageUrl$ = this.userImageUrlSubject.asObservable();

  private isUserHasAccountSetup = false;

  constructor(private keycloak: KeycloakService) {}

  // === Load profile from Keycloak ===
  async loadUserProfile(): Promise<void> {
    try {
      const profile = await this.keycloak.loadUserProfile();
      this.firstName = profile.firstName ?? '';
      const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');

      this.userNameSubject.next(fullName || profile.username || null);
      this.userIdSubject.next(profile.id ?? null);

    } catch (err) {
      console.error('Failed to load user profile', err);
    }
  }

  // === Exposed getters ===
  getFirstName(): string {
    return this.firstName ?? '';
  }

  getUserName(): string | null {
    return this.userNameSubject.value;
  }

  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  getUserId(): string | null {
    return this.userIdSubject.value;
  }

  getUserImageUrl(): string | null {
    return this.userImageUrlSubject.value;
  }

  setUserRole(role: string) {
    this.userRoleSubject.next(role);
  }

  setUserImageUrl(url: string) {
    this.userImageUrlSubject.next(url);
  }

  setIsUserHasAccountSetup(isUserHasAccountSetup: boolean) {
    this.isUserHasAccountSetup = isUserHasAccountSetup;
  }

  getIsUserHasAccountSetup(): boolean {
    return this.isUserHasAccountSetup;
  }

  // === Token Management ===
  
  /**
   * Get the current access token
   * @returns Promise<string | undefined> - The access token or undefined if not available
   */
  async getAccessToken(): Promise<string | undefined> {
    try {
      const token = await this.keycloak.getToken();
      return token;
    } catch (err) {
      console.error('Failed to get access token', err);
      return undefined;
    }
  }

  /**
   * Get the current refresh token
   * Note: The keycloak-angular library doesn't expose refresh tokens directly
   * @returns string | undefined - The refresh token or undefined if not available
   */
  getRefreshToken(): string | undefined {
    try {
      // The keycloak-angular library handles refresh tokens internally
      // and doesn't expose them directly for security reasons
      console.warn('Refresh token access is not directly available in keycloak-angular');
      return undefined;
    } catch (err) {
      console.error('Failed to get refresh token', err);
      return undefined;
    }
  }

  /**
   * Check if the user is authenticated
   * @returns boolean - True if authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return this.keycloak.isLoggedIn();
  }

  /**
   * Refresh the access token
   * @returns Promise<boolean> - True if refresh was successful, false otherwise
   */
  async refreshToken(): Promise<boolean> {
    try {
      return await this.keycloak.updateToken(30); // Refresh if token expires within 30 seconds
    } catch (err) {
      console.error('Failed to refresh token', err);
      return false;
    }
  }

  /**
   * Get token with automatic refresh
   * @returns Promise<string | undefined> - The access token or undefined if not available
   */
  async getValidToken(): Promise<string | undefined> {
    try {
      // Check if token needs refresh
      const refreshed = await this.refreshToken();
      if (refreshed) {
        console.log('Token refreshed successfully');
      }
      return await this.getAccessToken();
    } catch (err) {
      console.error('Failed to get valid token', err);
      return undefined;
    }
  }

  /**
   * Logout the user
   */
  async logout(): Promise<void> {
    try {
      await this.keycloak.logout();
    } catch (err) {
      console.error('Failed to logout', err);
    }
  }
}
