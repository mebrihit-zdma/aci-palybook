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

      this.firstName = profile.firstName ?? ''; // ✅ now stored
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
}
