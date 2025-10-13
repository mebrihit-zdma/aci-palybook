import { RouterOutlet,RouterModule, Router } from '@angular/router';
import { Component, OnInit, Inject, OnDestroy,} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';
import { LoginService } from './services/login.service';
import { ApiService } from './services/api.service';
import { OnboardingService } from './services/onboarding.service';
import { UserRoleService } from './services/user-role.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  userFirstName: string = '';

  constructor(private userService: UserService, private apiService: ApiService, private userRoleService: UserRoleService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.userService.loadUserProfile();
 
    // Subscribe to userId$ to ensure we get the value once it's available
    this.userService.userId$.pipe(
      filter(userId => userId !== null),
      takeUntil(new Subject())
    ).subscribe(userId => {
      console.log("userId from app.component: ", userId);
      const userIdTest = "39e96565-5bd6-492c-8d59-8a2140b97894";
      this.apiService.getUserSettings<any>(userIdTest).subscribe({
        next: async (data) => {
          console.log("user settings data from app.component: ", data);
          // If user settings exist, navigate to dashboard-page
          if (data) {
            this.userRoleService.setupUserFromSettings(data);
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
    });
  }
}




