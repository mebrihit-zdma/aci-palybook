import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { OnboardingService } from '../../services/onboarding.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-on-boarding-page',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './on-boarding-page.component.html',
  styleUrl: './on-boarding-page.component.css'
})
export class OnBoardingPageComponent {
  
  constructor(private userService: UserService, private router: Router, private apiService: ApiService, private onboardingService: OnboardingService ) {}

  userRole: string | null = 'Product Owner';
  roleList: any[] = [];
  productsList: any[] = [];
  widgetsList: any[] = [];

  selectedRole: string = '';
  selectedRoleList: string = '';
  selectedPersonalize: string[] = [];
  selectedProduct: string = "";
  personaId: string = "";
  ngOnInit(): void {
    this.userService.userRole$.subscribe(role => {
      this.userRole = role;
    });
    // getting role List from api
    this.apiService.get<any>('list_personas').subscribe({
      next: async (data) => {
        this.roleList = data;

        this.roleList = this.roleList.map(role => ({
          ...role,
          icon: this.getRandomIcon()
        }));
      },
      error: (err) => console.error('Error:', err),
    });
    // getting products List the from api
    this.apiService.get<any>('list_products').subscribe({
      next: async (data) => {
        this.productsList = data;
        const productNames = data.map((product: any) => product.name);
        this.onboardingService.setProductList(productNames);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  givenRoleList = false;
  showRoleList(){
    this.givenRoleList = true;
  }
  // hideRoleList(){
  //   this.givenRoleList = false;
  // }
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
  iconList:string[]  = ["edit_document", "manage_accounts","wifi_tethering", "edit_document"]
  getRandomIcon(): string {
    const randomIndex = Math.floor(Math.random() * this.iconList.length);
    return this.iconList[randomIndex];
  }
  // hide the questions at the beginning 
  hiddenProductsSection = true;
  hiddenPersonalizeDashboardSection = true;

  // disable the questions after answered
  disableRoleSection = false;
  disableProductsSection = false;
  disablePersonalizeDashboardSection = false;

  isPersonalizeDashboardNextButtonActive = false

  personalizeDashboardAnswered(){
    this.isPersonalizeDashboardNextButtonActive = true
  }

  goToPoductsSection(id: string) {
    this.personaId = id;
    this.hiddenProductsSection = false; 
  }
onRoleSelected(item: any): void {
  this.selectedRoleList = item.name;
  // Option B: Fetch from API
  this.apiService.get<any>(`get_persona/${item.id}`).subscribe({
    next: (data) => {
      this.widgetsList = data.widgets;
      this.onboardingService.setPersonaWidgetList(data.widgets)
    },
    error: (err) => console.error('Error fetching widgets:', err),
  });
}

  goToPersonalizeDashboardSection() {
    this.hiddenPersonalizeDashboardSection = false; 
  }

  goToPervSection() {
    this.router.navigate(['/dashboard-page']);
  }
  
  goToDashboard() {
    this.selectedWidgets();
    this.router.navigate(['/dashboard-page']);
  }

  goToWelcomePage() {
    this.router.navigate(['/welcome-page']);
  }
  
  togglePersonalize(value: string) {
    const index = this.selectedPersonalize.indexOf(value);
    if (index === -1) {
      this.selectedPersonalize.push(value);
    } else {
      this.selectedPersonalize.splice(index, 1);
    }
  }

  onProductSelected() {
    this.onboardingService.setSelectedProduct(this.selectedProduct)
  }
  
  selectedWidgets(){
    const widgetsList = this.widgetsList.filter(w => this.selectedPersonalize.includes(w.name))
    this.onboardingService.setSelectedWidgetList(widgetsList);
  }
  productOwnerRole(){
    this.apiService.get<any>(`get_persona/682f7f2b824237055c016c39`).subscribe({
      next: (data) => {
        this.widgetsList = data.widgets;
        this.onboardingService.setPersonaWidgetList(data.widgets)
      },
      error: (err) => console.error('Error fetching widgets:', err),
    });
    this.goToPoductsSection('userRole');
  }
  skipOnboarding(){
  
    this.onboardingService.setSelectedWidgetList(this.widgetsList);
    this.router.navigate(['/dashboard-page']);
  }
}
