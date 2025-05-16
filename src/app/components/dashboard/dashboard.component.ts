import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SummaryCardComponent } from '../../components/cards/summary-card/summary-card.component';
import { PieChartCardComponent } from '../../components/cards/pie-chart-card/pie-chart-card.component';
import { ReleaseHistoryTableComponent } from '../../components/tables/release-history-table/release-history-table.component';
import { BugFixesTableComponent } from '../../components/tables/bug-fixes-table/bug-fixes-table.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SummaryCardComponent, NgxChartsModule, PieChartCardComponent, ReleaseHistoryTableComponent, BugFixesTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private userService: UserService ) {}
 
  userName: string | null = null;
  userRole: string | null = null;
  ngOnInit() {
    this.userService.userName$.subscribe(name => {
      this.userName = name;
    });
    this.userService.userRole$.subscribe(role => {
      this.userRole = role;
    });
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
      deliveryDate: "",
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
}
