import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-on-boarding-page',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './on-boarding-page.component.html',
  styleUrl: './on-boarding-page.component.css'
})
export class OnBoardingPageComponent {
  
  constructor(private userService: UserService, private router: Router ) {}

  userRole: string | null = null;
  ngOnInit(): void {
    this.userService.userRole$.subscribe(role => {
      this.userRole = role;
    });
  }

  givenRoleList = false;
  showRoleList(){
    this.givenRoleList = true;
  }
  hideRoleList(){
    this.givenRoleList = false;
  }
  personalizeDashboard  = [
    {
      title:"Documentation History",
      description :"Track the status of your documentation in one place."
    },
    {
      title:"Release Notes Summary",
      description :"Catch up on the changes from the latest  release notes that may impact your product."
    },
    {
      title:"Latest Updates in the product",
      description :"See highlights of new features and improvements."
    },
    {
      title:"Bug Volume Overview",
      description :"Monitor the number of bugs raised this month to gauge product stability."
    },
  ]
  roleList  = [
    {
      icon:"edit_document",
      title:"Product Manager",
      description :"Create, Manage Documentation and product updates."
    },
    {
      icon:"manage_accounts",
      title:"Help 24 Analyst",
      description :"Manage Documentation and product updates."
    },
    {
      icon:"manage_accounts",
      title:"Professional Services",
      description :"Manage Documentation and product updates."
    },
    {
      icon:"manage_accounts",
      title:"Solution Architect",
      description :"Manage Documentation and product updates."
    },
    {
      icon:"wifi_tethering",
      title:"Sales",
      description :"Manage Documentation and product updates."
    },
    {
      icon:"edit_document",
      title:"Marketing",
      description :"Manage Documentation and product updates."
    },
  ]

  // hide the questions at the beginning 
  hiddenProductsSection = true;
  hiddenPersonalizeDashboardSection = true;

  // disable the questions after answered
  disableRoleSection = false;
  disableProductsSection = false;
  disablePersonalizeDashboardSection = false;

  isRoleNextButtonActive = false
  isProductsNextButtonActive = false
  isPersonalizeDashboardNextButtonActive = false

  roleAnswered(){
    this.isRoleNextButtonActive = true
  }

  productsAnswered(){
    this.isProductsNextButtonActive = true
  }

  personalizeDashboardAnswered(){
    this.isPersonalizeDashboardNextButtonActive = true
  }

  goToPoductsSection() {
    // this.disableRoleSection = !this.disableRoleSection;
    // this.hiddenProductsSection = !this.hiddenProductsSection; 
    this.hiddenProductsSection = false; 

  }
  goToPersonalizeDashboardSection() {
    this.disableProductsSection = !this.disableProductsSection;
    this.hiddenPersonalizeDashboardSection = !this.hiddenPersonalizeDashboardSection; 
  }

  goToPervSection() {
    this.router.navigate(['/dashboard-page']);
  }
  
  goToDashboard() {
    this.router.navigate(['/dashboard-page']);
  }

  goToWelcomePage() {
    this.router.navigate(['/welcome-page']);
  }
  selectedRole: string = '';
  selectedRoleList: string = '';
  selectedProduct: string[] = [];
  selectedPersonalize: string[] = [];
  toggleProduct(value: string) {
    const index = this.selectedProduct.indexOf(value);
    if (index === -1) {
      this.selectedProduct.push(value);
    } else {
      this.selectedProduct.splice(index, 1);
    }
  }

  togglePersonalize(value: string) {
    const index = this.selectedPersonalize.indexOf(value);
    if (index === -1) {
      this.selectedPersonalize.push(value);
    } else {
      this.selectedPersonalize.splice(index, 1);
    }
  }
}
