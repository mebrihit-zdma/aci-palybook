import { Component,  ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SummaryCardComponent } from '../../components/cards/summary-card/summary-card.component';
import { ReleaseHistoryTableComponent } from '../../components/tables/release-history-table/release-history-table.component';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { OnboardingService } from '../../services/onboarding.service';
import { TooltipService } from '../../services/tooltip.service';
import { DocumentationService } from '../../services/documentation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SummaryCardComponent, ReleaseHistoryTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  listNumber = 2;
  userName: string | null = 'User Name';
  userRole: string | null = 'Product Owner';
  isUserHasAccountSetup: boolean = false;

  // documentation Pages
  documentationLandingPage = false;
  documentationGeneratingPage = false; 
  documentationGeneratedPage = false; 

  selectedProduct: string = "";
  products: string[] = [];
  personaWidgetList: string[] = [];
  selectedWidgetList: string[] = [];
  selectedCustomizeWidgets: string[] = [];
  releaseHistory: any[] = [];
  isProductDropdownOpen = false;
  // tooltip
  skipTooltipValue = false;
  aciPaymentHubTooltip = false;
  createDocTooltip = false;
  startNewChatTooltip = false;
 
  dashboardModelDone = false;
  aciPaymentHubTooltipDone = false;
  createDocTooltipDone = false;
  startNewChatTooltipDone = false;
  // Customize Widgets
  isCustomizeWidgets = false;

  // constructor
  constructor(private userService: UserService, 
    private tooltipService: TooltipService,  
    private documentationService: DocumentationService, 
    private router: Router, 
    private onboardingService: OnboardingService,
    private apiService: ApiService
  ) {}
  // ngOnInit
  ngOnInit() {
    this.userService.userName$.subscribe(name => {
      this.userName = name;
    });
    this.userService.userRole$.subscribe(role => {
      this.userRole = role;
    });
    this.isUserHasAccountSetup = this.userService.getIsUserHasAccountSetup();

    // Get products
    if(this.onboardingService.getProductList().length > 0) {
        this.products = this.onboardingService.getProductList();
        this.selectedProduct = this.onboardingService.getSelectedProduct();
    } else {
        this.gettingProductListFromApi();
    }
    
    // Subscribe to selected product changes reactively
    this.onboardingService.getSelectedProduct$().subscribe(product => {
      this.selectedProduct = product;
    });
    // Subscribe to persona widget list changes reactively
    this.onboardingService.getPersonaWidgetList$().subscribe(widgetList => {
      this.personaWidgetList = widgetList;
    });
    
    // Subscribe to widget list changes reactively
    this.onboardingService.getSelectedWidgetList$().subscribe(widgetList => {
      this.selectedWidgetList = widgetList;
    });
    
    // Initial load
    this.selectedWidgetList = this.onboardingService.getSelectedWidgetList();
    
    this.documentationLandingPage = this.documentationService.getDocumentationLandingPage();
    this.documentationGeneratingPage = this.documentationService.getDocumentationGeneratingPage(); 
    this.documentationGeneratedPage = this.documentationService.getDocumentationGeneratedPage();
    // getting documentation history from api
    this.gettingDocumentationHistoryFromApi();
  }
  
  toggleProductDropdown() {
    this.isProductDropdownOpen = !this.isProductDropdownOpen;
  }
  selectProduct(product: string) {
    this.selectedProduct = product;
    this.isProductDropdownOpen = false;
  }
  // tooltip
  skipTooltip(){
    this.skipTooltipValue = true;
    this.tooltipService.setSkipTooltipValue(true)
  }
  goToAciPaymentHubTooltip(){
    this.aciPaymentHubTooltip = true;
    this.dashboardModelDone = true;
  }
  skipAciPaymentHubTooltip(){
    this.aciPaymentHubTooltipDone = true;
  }
  goToCreateDocTooltip(){
    this.createDocTooltip = true;
    this.aciPaymentHubTooltipDone = true;
  }
  skipCreateDocTooltip(){
    this.createDocTooltipDone = true;
  }
  goToStartNewChatTooltip(){
    this.startNewChatTooltip = true;
    this.createDocTooltipDone = true;
  }
  doneWithTooltip(){
    this.startNewChatTooltipDone = true;
  }
  customizeWidgets(){
    this.isCustomizeWidgets = true;
  }
  closeCustomizeWidgets(){
    this.isCustomizeWidgets = false;
  }
  goToDocumentationGeneratingPage(){
    this.documentationService.setDocumentationLandingPage(false);
    this.documentationService.setDocumentationGeneratingPage(true); 
    this.documentationService.setDocumentationGeneratedPage(false); 
    
    this.router.navigate(['/dashboard-page/documentation']);
  }
  dashboardStartNewChat(){
    this.router.navigate(['/dashboard-page/chat']);
  }
  toggleCustomizeWidgets(value: string) {
    const index = this.selectedCustomizeWidgets.indexOf(value);
    if (index === -1) {
      this.selectedCustomizeWidgets.push(value);
    } else {
      this.selectedCustomizeWidgets.splice(index, 1);
    }
  }

  saveCustomizeWidgets(){
    this.selectedWidgetList = this.selectedCustomizeWidgets
    this.isCustomizeWidgets = false;
  }
  restoreTodefault(){
    this.selectedWidgetList = this.onboardingService.getSelectedWidgetList();
    this.isCustomizeWidgets = false;
    this.selectedCustomizeWidgets = [];
  }

  // notification  List data 
  notificationListData = {
    inboxCount: 4,
    readCount:2, 
    messages: [ 
      { subject: "Here's What's New in ACI Connectic V1.2.3-A", 
        content: "We've just rolled out the latest product updates. View what's new, improved, or fixed in this release.", 
        datetimeText: "Today at 9:42 AM",
        readStatus: false,

      },
      { subject: "Updated User Manual Now Available", 
        content: "We've added new sections and clarified existing workflows in the user manual. Review the latest guide to stay aligned with system updates.", 
        datetimeText: "Yesterday at 5:30 PM",
        readStatus: false,

      },
      { subject: "Updated", 
        content: " View what's new, improved, or fixed in this release.", 
        datetimeText: "20th February, 2025; 4:30 PM",
        readStatus: true,

      },
      { subject: "XXXX", 
        content: "YYYY", 
        datetimeText: "2nd January, 2025; 2:15 AM",
        readStatus: true,

      },
    ]
  };
  listData = this.notificationListData.messages;

  isViewAll = false;
  viewAll(){ console.log("VIEWALL");
    this.isViewAll =! this.isViewAll;
  }

  goToMarkReadAll() {
    for (let dataUpdate of this.notificationListData.messages) {
      dataUpdate.readStatus=true;
    }
  }

  isNotificationList = false;
  notificationList(){console.log("NOIFICATION")
    this.isNotificationList =! this.isNotificationList;
  }
  closeNotificationList(){ 
    this.isNotificationList = false;
  }

  // onClickOutside
  @ViewChild('dropdown') dropdownRef!: ElementRef;
  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: HTMLElement) {
    if (this.dropdownRef && !this.dropdownRef.nativeElement.contains(targetElement)) {
      this.isProductDropdownOpen = false;
    }
  }
  // getting product list from api
  gettingProductListFromApi() {
    this.apiService.get<any>('list_products').subscribe({
      next: async (data) => {
        this.products = data.map((product: any) => product.name);
      },
    });
  }
  // getting documentation history from api
  gettingDocumentationHistoryFromApi() {
    this.apiService.getDocumentationHistory().subscribe({
      next: async (data: any) => {
        console.log('documentation history: ', data);
        this.releaseHistory = Array.isArray(data) ? data : [];
      },  
      error: (err) => {
        console.error('Error fetching documentation history:', err);
        this.releaseHistory = [];
      },
    });
  }
}
