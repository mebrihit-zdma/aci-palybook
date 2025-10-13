import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { OnboardingService } from './onboarding.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(
    private apiService: ApiService,
    private onboardingService: OnboardingService,
    private userService: UserService
  ) { }

  /**
   * Handles role selection logic
   * @param item - The selected role item containing id and name
   * @returns Promise that resolves with the widgets data
   */
  onRoleSelected(item: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Set the selected role name
      const selectedRoleName = item.name;
      
      // Fetch widgets from API based on role ID
      this.apiService.get<any>(`get_persona/${item.id}`).subscribe({
        next: (data) => {
          const widgetsList = data.widgets;
          
          // Store widgets in onboarding service
          this.onboardingService.setPersonaWidgetList(widgetsList);
          
          // Resolve with the data for further processing
          resolve({
            selectedRoleName,
            widgetsList,
            personaData: data
          });
        },
        error: (err) => {
          console.error('Error fetching widgets:', err);
          reject(err);
        }
      });
    });
  }

  /**
   * Sets user role and fetches associated widgets
   * @param role - The role object containing id and name
   * @returns Promise that resolves with the widgets data
   */
  setUserRoleAndFetchWidgets(role: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Set user role in user service
      this.userService.setUserRole(role.name);
      
      // Fetch and set widgets
      this.onRoleSelected(role).then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Sets up user configuration from user settings (used in app component)
   * @param userSettingsData - The complete user settings data containing personas and products
   */
  setupUserFromSettings(userSettingsData: any): void {
    const personaData = userSettingsData.personas[0];

    // Set the user role
    this.userService.setUserRole(personaData.name);
    // Set the Selecte widgets list
    this.onboardingService.setSelectedWidgetList(personaData.widgets);

    // Set the product list and full product list
    const productNames = userSettingsData.products.map((product: any) => product.name);
    // Set the full product list first so that setSelectedProduct can find the ID
    this.onboardingService.setFullProductList(userSettingsData.products);
    this.onboardingService.setProductList(productNames);
    
    // Now set the selected product (this will also set the product ID)
    this.onboardingService.setSelectedProduct(userSettingsData.products[0].name);

    // Fetch widgets from API based on role ID
    this.apiService.get<any>(`get_persona/${personaData.id}`).subscribe({
      next: (data) => {
        const widgetsList = data.widgets;
        // Store widgets in onboarding service
        this.onboardingService.setPersonaWidgetList(widgetsList);
      },
      error: (err) => {
        console.error('Error fetching widgets in setupUserFromSettings:', err);
      }
    });
  }
}
