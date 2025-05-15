// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   constructor() { }
  
//   private userName: string = '';
//   private userRole: string = '';

//   setUserName(userName: string) {
//     this.userName = userName;
//   }
//   setUserRole(role: string) {
//     this.userRole = role;
//   }

//   getUserName(): string {
//     return this.userName;
//   }

//   getUserRole(): string {
//     return this.userRole;
//   }
// }
// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  private userNameSubject = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();

  private userIdSubject = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSubject.asObservable();

  private userImageUrlSubject = new BehaviorSubject<string | null>(null);
  userImageUrl$ = this.userImageUrlSubject.asObservable();

  // UserName
  setUserName(name: string) {
    this.userNameSubject.next(name);
  }

  getUserName(): string | null {
    return this.userNameSubject.value;
  }
  // UserRole
  setUserRole(role: string) {
    this.userRoleSubject.next(role);
  }

  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }
  // UserId
  setUserID(id: string) {
    this.userIdSubject.next(id);
  }

  getUserId(): string | null {
    return this.userIdSubject.value;
  }
  // userImageUrl
  setUserImageUrl(id: string) {
    this.userImageUrlSubject.next(id);
  }

  getUserImageUrl(): string | null {
    return this.userImageUrlSubject.value;
  }
}
