import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginDisplay: boolean = false;

  setLoginDisplay(loginDisplay: boolean) {
    this.loginDisplay = loginDisplay ;
  }

  getLoginDisplay():  boolean{
    return this.loginDisplay;
  }
}
