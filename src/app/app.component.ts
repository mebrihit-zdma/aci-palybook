import { RouterOutlet,RouterModule, Router } from '@angular/router';
import { Component, OnInit, Inject, OnDestroy,} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';
import { LoginService } from './services/login.service';
import { ApiService } from './services/api.service';
import { OnboardingService } from './services/onboarding.service';
import { HttpClient } from '@angular/common/http';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
// export class AppComponent{
//   constructor(
//     private userService: UserService,
//   ) { }
//   ngOnInit(): void {
//     this.userService.setUserName("Joanna");
//   }
// }
export class AppComponent implements OnInit, OnDestroy  {
  accessToken: any = "";
  private readonly _destroying$ = new Subject<void>();
  profileImageUrl:any = "";

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private userService: UserService,
    private loginService: LoginService,
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private onboardingService: OnboardingService,
  ) { }

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe({
      next: (result) => {
        const account = this.authService.instance.getAllAccounts()[0];
        if (account) {
          this.authService.instance.setActiveAccount(account);
          const tokenRequest = {
            scopes: ['User.Read'],
            account: account
          };
  
          this.authService.acquireTokenSilent(tokenRequest).subscribe({
            next: (authResult) => {
              this.accessToken = authResult.accessToken;
              // console.log("accessToken: ", this.accessToken);
  
              const headers = { Authorization: `Bearer ${authResult.accessToken}` };
  
              // Fetch user profile
              this.http.get<any>('https://graph.microsoft.com/v1.0/me', { headers }).subscribe(profile => {
                console.log("profile: ", profile);
                this.userService.setUserID(profile.id);
                this.userService.setUserName(profile.displayName);
              });
  
              // Fetch user profile photo
              fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
                headers: {
                  Authorization: `Bearer ${authResult.accessToken}`
                }
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Photo fetch failed: ${response.status}`);
                }
                return response.blob();
              })
              .then(imageBlob => {
                const imageUrl = URL.createObjectURL(imageBlob);
                console.log("imageUrl: ", imageUrl);
                this.profileImageUrl = imageUrl; 
                this.userService.setUserImageUrl(imageUrl);
              })
              .catch(err => console.error("Error fetching profile picture:", err));
  
              // Check user settings and navigate accordingly
              const userId = "68d1bed409b025cb631e4330";
              // const userId = "testlast12345-product-test-122";

              this.apiService.getUserSettings<any>(userId).subscribe({
                next: (data) => {
                  console.log("user settings data: ", data);
                  // If user settings exist, navigate to dashboard-page
                  if (data) {
                    // set the user role
                    this.userService.setUserRole(data.personas[0].name);
                    // set the widgets list
                    this.onboardingService.setPersonaWidgetList(data.personas[0].widgets);
                    
                    // set the product list
                    const productNames = data.products.map((product: any) => product.name);
                    this.onboardingService.setProductList(productNames);
                    this.userService.setIsUserHasAccountSetup(true);
                    // navigate to dashboard-page
                    this.router.navigate(['/dashboard-page']);
                  } else {
                    // If no user settings, navigate to welcome-page
                    this.router.navigate(['/welcome-page']);
                  }
                },
                error: (err) => {
                  console.error('Error getting user settings:', err);
                  // On error, navigate to welcome-page
                  this.router.navigate(['/welcome-page']);
                },
              });
            },
            error: (err) => console.error('Token error after redirect', err)
          });
        }
      },
      error: (err) => console.error('Redirect error:', err)
    });
  
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
  
        const accounts = this.authService.instance.getAllAccounts();
        if (accounts.length === 0) {
          if (this.msalGuardConfig.authRequest) {
            this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
          } else {
            this.authService.loginRedirect();
          }
        }
      });
  }
  
  setLoginDisplay() {
    this.loginService.setLoginDisplay(this.authService.instance.getAllAccounts().length > 0)
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}



