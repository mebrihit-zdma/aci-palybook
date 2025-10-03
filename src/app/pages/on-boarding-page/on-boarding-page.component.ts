import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { OnboardingService } from '../../services/onboarding.service';
import { UserRoleService } from '../../services/user-role.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-on-boarding-page',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './on-boarding-page.component.html',
  styleUrl: './on-boarding-page.component.css'
})
export class OnBoardingPageComponent {
  
  constructor(
    private userService: UserService, 
    private router: Router, 
    private apiService: ApiService, 
    private onboardingService: OnboardingService,
    private userRoleService: UserRoleService
  ) {}

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
    // getting role list from api
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
    // getting product list from api
    this.apiService.get<any>('list_products').subscribe({
      next: async (data) => {
        this.productsList = data;
        const productNames = data.map((product: any) => product.name);
        this.onboardingService.setProductList(productNames);
        this.onboardingService.setFullProductList(data);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  givenRoleList = false;
  showRoleList(){
    this.givenRoleList = true;
  }

  iconList:string[]  = ["edit_document", "manage_accounts","wifi_tethering", "edit_document"]
  getRandomIcon(): string {
    const randomIndex = Math.floor(Math.random() * this.iconList.length);
    return this.iconList[randomIndex];
  }
  // hide the questions at the beginning 
  hiddenProductsSection = true;
  hiddenPersonalizeDashboardSection = true;

  isPersonalizeDashboardNextButtonActive = false

  personalizeDashboardAnswered(){
    this.isPersonalizeDashboardNextButtonActive = true
  }

  goToPoductsSection(role: any) {
    this.personaId = role.id;
    this.hiddenProductsSection = false;
    
    // Use the shared role selection service to set user role and fetch widgets
    this.userRoleService.setUserRoleAndFetchWidgets(role).then((data) => {
      this.widgetsList = data.widgetsList;
    }).catch((err) => {
      console.error('Error in role selection:', err);
    });
  }
  onRoleSelected(item: any): void {
    this.selectedRoleList = item.name;
    
    // Use the shared role selection service
    this.userRoleService.onRoleSelected(item).then((data) => {
      this.widgetsList = data.widgetsList;
    }).catch((err) => {
      console.error('Error in role selection:', err);
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
    this.createUserSettings();
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
  skipOnboarding(){
  
    this.onboardingService.setSelectedWidgetList(this.widgetsList);
    this.router.navigate(['/dashboard-page']);
  }

  createUserSettings(){
    // Find the selected product object from the productsList
    const selectedProductObj = this.productsList.find(product => product.name === this.selectedProduct);
    
    const payload = {
      "user_id": this.userService.getUserId(),
      // "user_id": "1234567test-working-v1",
      "personas": [
        { 
          "id": this.personaId, 
          "name": this.selectedRoleList,
          "widgets": this.onboardingService.getSelectedWidgetList(),
        }
      ],
      "products": this.productsList,
      // "products": this.onboardingService.getSelectedProduct(),
    }
    console.log("payload from on-boarding-page: ", payload);
    this.apiService.createUserSetting(payload).subscribe({
      next: (data) => {
        console.log("user settings data: ", data);
      },
      error: (err) => console.error('Error creating user settings:', err),
    });
  }
}
