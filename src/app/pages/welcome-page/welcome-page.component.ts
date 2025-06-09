import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-welcome-page',
  standalone:true,
  imports: [RouterModule, CommonModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export class WelcomePageComponent implements OnInit {
  
  constructor(private router: Router, private userService: UserService) {}

  userName: string | null = 'User Name';
  ngOnInit(): void {
    this.userService.userName$.subscribe(name => {
      this.userName = name;
    });
  }
  goToOnboarding() {
    this.router.navigate(['/on-boarding-page']);
  }

}
