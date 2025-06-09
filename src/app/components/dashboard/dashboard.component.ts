import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SummaryCardComponent } from '../../components/cards/summary-card/summary-card.component';
import { ReleaseHistoryTableComponent } from '../../components/tables/release-history-table/release-history-table.component';
import { BugFixesTableComponent } from '../../components/tables/bug-fixes-table/bug-fixes-table.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserService } from '../../services/user.service';
import { OnboardingService } from '../../services/onboarding.service';
import { TooltipService } from '../../services/tooltip.service';
import { DocumentationService } from '../../services/documentation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SummaryCardComponent, NgxChartsModule, ReleaseHistoryTableComponent, BugFixesTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private userService: UserService, private tooltipService: TooltipService,  private documentationService: DocumentationService, private router: Router, private onboardingService: OnboardingService ) {}

  listNumber = 2;
  userName: string | null = 'User Name';
  userRole: string | null = 'Product Owner';

  // documentation Pages
  documentationLandingPage = false;
  documentationGeneratingPage = false; 
  documentationGeneratedPage = false; 

  selectedProduct: string = "";
  products: string[] = [];
  personaWidgetList: string[] = [];
  selectedWidgetList: string[] = [];
  selectedCustomizeWidgets: string[] = [];
  ngOnInit() {
    this.userService.userName$.subscribe(name => {
      this.userName = name;
    });
    this.userService.userRole$.subscribe(role => {
      this.userRole = role;
    });

    this.personaWidgetList = this.onboardingService.getPersonaWidgetList()
    this.selectedWidgetList = this.onboardingService.getSelectedWidgetList()
    this.products = this.onboardingService.getProductList();
    this.selectedProduct = this.onboardingService.getSelectedProduct();
    
    this.documentationLandingPage = this.documentationService.getDocumentationLandingPage();
    this.documentationGeneratingPage = this.documentationService.getDocumentationGeneratingPage(); 
    this.documentationGeneratedPage = this.documentationService.getDocumentationGeneratedPage(); 
  }
  isProductDropdownOpen = false;
  toggleProductDropdown() {
    this.isProductDropdownOpen = !this.isProductDropdownOpen;
  }
  selectProduct(product: string) {
    this.selectedProduct = product;
    this.isProductDropdownOpen = false;
  }
  // cards data
  productLatestUpdates = [
    { 
      latestUpdate: "7th March, 2025", 
      title: "Latest Updates in the product", 
      subTitle:"Enhanced transaction security to prevent unauthorized access.",
      updateList: [
        "Improved API response times by 30% for better performance.",
        "Introduced a new fraud detection feature to minimize risk.",
      ],
      moreInfo:"View More",
      latest:"Latest"
    },
  ]
  releaseNotesSummary = [
    { 
      latestUpdate: "2nd March, 2025", 
      title: "Release Notes Summary", 
      subTitle:"Added batch processing for large transactions to increase efficiency.",
      updateList: [
        "Improved error logging to simplify troubleshooting for failed payments.",
        "Added support for Instant Payments in new regions, including SEPA Instant Credit Transfer.",
      ],
      moreInfo:"View Summary"
    },
  ]
  categoryData = [
    { 
      title: "Total Bug Raised", 
      bugNumber: "12", 
      month:"This month"
    },
    { 
      title: "User Engagement Metrics", 
      bugNumber: "80%", 
      month:"Customer Satisfaction Rate"
    }
  ]
  pieData = [
    {
      title:'Total Bugs Raised', 
      view: [140, 140] as [number, number],
      pieChartData: [
        { name: 'Critical', value: 6, color:'#6A94E5'},
        { name: 'High', value: 2, color:'#C1D3FA'},
        { name: 'Others', value: 4, color:'#1F4BB9'},
      ],
      customColors: [
        { name: 'Critical', value: '#6A94E5' },
        { name: 'High', value: '#C1D3FA' },
        { name: 'Others', value: '#1F4BB9' },
      ]
    }
  ]

  // release history data 
  releaseHistory = [
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "Release Notes",
      status: "In Progress",
      deliveryDate: "Jan 02, 2025",
      executedBy: "Gulse",
      view: "",
    },
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "Release Notes",
      status: "Published",
      deliveryDate: "Jan 13, 2025",
      executedBy: "Jeannie",
      view: "View",
    },
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "User Manual",
      status: "Published",
      deliveryDate: "Jan 13, 2025",
      executedBy: "Meera",
      view: "View",
    },
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "User Manual",
      status: "Published",
      deliveryDate: "Jan 13, 2025",
      executedBy: "Meera",
      view: "View",
    },
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "User Manual",
      status: "Published",
      deliveryDate: "Jan 13, 2025",
      executedBy: "Meera",
      view: "View",
    },
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "User Manual",
      status: "Published",
      deliveryDate: "Jan 13, 2025",
      executedBy: "Meera",
      view: "View",
    },
    { documentation: "Payment_Hub_1.2.3-A", 
      product: "Payment Hub", 
      type: "User Manual",
      status: "Published",
      deliveryDate: "Jan 13, 2025",
      executedBy: "Meera",
      view: "View",
    },
  ];

  // bug fixes data 
  bugFixes = [
    { issue: "SBI-323", 
      description: "Slow loading times", 
      priority: "Low",
      status: "Fix In Progress",
      assignedTo: "Adam",
      viewResolution: "",
    },
    { issue: "SBI-321", 
      description: "Payment approval delays for high volume", 
      priority: "Highest",
      status: "Resolved",
      assignedTo: "Adam",
      viewResolution: "View Resolution",
    },
    { issue: "SBI-319", 
      description: "Performance Optimizations", 
      priority: "High",
      status: "Resolved",
      assignedTo: "Adam",
      viewResolution: "View Resolution",
    },
    { issue: "SBI-319", 
      description: "Performance Optimizations", 
      priority: "High",
      status: "Resolved",
      assignedTo: "Adam",
      viewResolution: "View Resolution",
    },
    { issue: "SBI-319", 
      description: "Performance Optimizations", 
      priority: "High",
      status: "Resolved",
      assignedTo: "Adam",
      viewResolution: "View Resolution",
    },
  ];
  
  // tooltip
  skipTooltipValue = false;
  aciPaymentHubTooltip = false;
  createDocTooltip = false;
  startNewChatTooltip = false;

  dashboardModelDone = false;
  aciPaymentHubTooltipDone = false;
  createDocTooltipDone = false;
  startNewChatTooltipDone = false;

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

  // Customize Widgets
  isCustomizeWidgets = false;
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
  }

}
