import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { UserService } from '../../services/user.service';
import { DocumentationService } from '../../services/documentation.service';
import { OnboardingService } from '../../services/onboarding.service';
import { ReleaseHistoryTableComponent } from '../../components/tables/release-history-table/release-history-table.component';
import { BugFixesTableComponent } from '../../components/tables/bug-fixes-table/bug-fixes-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule,FormsModule, ReleaseHistoryTableComponent, BugFixesTableComponent ],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.css'
})
export class DocumentationComponent {
  // userName: string | null = null;
  // userRole: string | null = null;
  userName: string | null = 'User Name';
  userRole: string | null = 'Product Owner';
  selectedOption1 = '';  
  selectedOption2 = '';  
  imagePath ='./app/resources/icons/paste-url-icon.svg';
  listNumber = 5;
  // documentation Pages
  documentationLandingPage = false;
  documentationGeneratingPage = false; 
  documentationGeneratedPage = false; 

  products: string[] = [];
  selectedProduct: string = "";

  constructor(private userService: UserService, private documentationService: DocumentationService, private router: Router, private onboardingService: OnboardingService ) {}

  ngOnInit() {
    // this.userService.userName$.subscribe(name => {
    //   this.userName = name;
    // });
    // this.userService.userRole$.subscribe(role => {
    //   this.userRole = role;
    // });
    this.products = this.onboardingService.getProductList();
    this.selectedProduct = this.onboardingService.getSelectedProduct();
    
    // documentation Pages
    this.documentationLandingPage = this.documentationService.getDocumentationLandingPage();
    this.documentationGeneratingPage = this.documentationService.getDocumentationGeneratingPage(); 
    this.documentationGeneratedPage = this.documentationService.getDocumentationGeneratedPage(); 
  }
  
  goToDocumentationGeneratedPage() {
    this.documentationService.setDocumentationLandingPage(false);
    this.documentationService.setDocumentationGeneratingPage(false);  
    this.documentationGeneratedPage = true;
    this.documentationLandingPage = false;
    this.documentationGeneratingPage = false;
  }
  goToDocumentationGeneratingPage(){
    this.documentationService.setDocumentationLandingPage(false);
    this.documentationService.setDocumentationGeneratedPage(false); 
    this.documentationGeneratedPage = false;
    this.documentationLandingPage = false;
    this.documentationGeneratingPage = true;
  }
  // Select Template section
  isOpen = false;
  isViewSourcesDropdownOpen = false
  isProductDropdownOpen = false;
  isFilterDropdownOpen = false;
  selectedTemplate = 'Select Template';
  templates = ['User Manual', 'Release Notes'];
  filters =['Type', 'Status', 'Published date', 'Created by'];
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  toggleViewSourcesDropdown() {
    this.isViewSourcesDropdownOpen = !this.isViewSourcesDropdownOpen;
    console.log("this.isViewSourcesDropdownOpen: ", this.isViewSourcesDropdownOpen)
  }
  selectTemplate(template: string) {
    this.selectedTemplate = template;
    this.isOpen = false;
  }

  toggleProductDropdown() {
    this.isProductDropdownOpen = !this.isProductDropdownOpen;
  }
  toggleFilterDropdown() {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  selectProduct(product: string) {
    this.selectedProduct = product;
    this.isProductDropdownOpen = false;
  }

  // sources section
  viewSources = [
    { source: 'JIRA-516: Bug Fixes from latest code changes' },
    { source: 'EPIC-516: Payment Hub Security updates' }
  ];
  sources: { source: string }[] = [];
  PdfSources: { PdfSources: string }[] = [];
  pdfNewSource: string = '';

  newSource: string = '';
  generateDoc = false;
  displayDoc = false; 
  
  addSource() {
    if (this.newSource.trim()) {
      this.sources.push({ source: this.newSource });
      this.newSource = ''; // Clear input after adding
    }
    this.generateDoc = true;
  }

  addPdfSource() {
    if (this.pdfNewSource.trim()) {
      this.PdfSources.push({ PdfSources: this.pdfNewSource });
      this.pdfNewSource = ''; // Clear input after adding
    }
    this.generateDoc = true;
  }
  deleteSource(index: number) {
    this.sources.splice(index, 1);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    this.handleFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.PdfSources.push({ PdfSources: files[i].name });
    }
  }
  
  isModalOpen = false; // Initial state (modal is closed)
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  // doc section
  generatedDocument =[
    {
      title:"1. Overview",
      description: "This release introduces enhanced security measures, improved payment processing speed, and new API integrations to streamline bank and merchant operations. Several bug fixes and performance optimizations have also been included."
    },
    {
      title: "2. New Features & Enhancements",
      description:"FeatureDescriptionImpacted UsersEnhanced Transaction SecurityImplemented multi-layer fraud detection with AI-driven anomaly detection.Bank Operators, Compliance TeamsFaster Payment ProcessingOptimized transaction routing to reduce processing time by 20%.Merchants, IT TeamsNew API for Custom ReportsIntroduced API endpoints for real-time payment tracking and data export.Developers, Business Analysts"

    },
    {
      title:"3. Bug Fixes & Performance Improvements",
      description:"IssueResolutionPayment approval delays for high-volume transactions.Improved load balancing and optimized database queries.Incorrect currency conversion in multi-currency transactions.Fixed calculation logic and tested accuracy with various currencies.Help24 system lagging during peak hours.Upgraded infrastructure and optimized query processing."
    },
    {
      title:"4. Known Issues & Workarounds",
      Issues:
        [
          "Issue: Some users may experience delays when accessing new API features.Workaround: Clear cache or wait for server sync to complete within 5 minutes",
          "Issue: Legacy integration users may see warning messages when processing transactions.Workaround: Update to the latest API version or contact support for assistance."
        ]
    },
  ]
  createDocument() {
    this.displayDoc = true;
  }

  // export section
  releaseNotes: string = `
Example: ACI Payment Gateway – Release Notes (Version 2.5.0)

Release Date: March 15, 2025

Prepared By: Product Management Team

1. Overview
This release introduces enhanced security measures, improved payment processing speed, and new API integrations to streamline bank and merchant operations. Several bug fixes and performance optimizations have also been included.

2. New Features & Enhancements
Feature    | Description
-----------|-----------------------------------------------------
Enhanced Transaction Security | Implemented multi-layer fraud detection with AI-driven anomaly detection.
Faster Payment Processing | Optimized transaction routing to reduce processing time by 20%.
New API for Custom Reports | Introduced API endpoints for real-time payment tracking and data export.

3. Bug Fixes & Performance Improvements
Issue    | Resolution
---------|-----------------------------------------------------
Payment approval delays for high-volume transactions | Improved load balancing and optimized database queries.
Incorrect currency conversion in multi-currency transactions | Fixed calculation logic and tested accuracy.
Help24 system lagging during peak hours | Upgraded infrastructure and optimized query processing.

4. Known Issues & Workarounds
- **Issue**: Some users may experience delays when accessing new API features.  
  **Workaround**: Clear cache or wait for server sync to complete within 5 minutes.

- **Issue**: Legacy integration users may see warning messages when processing transactions.  
  **Workaround**: Update to the latest API version or contact support for assistance.

For further details, contact:
📩 ACI Support Team – support@aci.com  
📄 Documentation & FAQs – ACI Knowledge Base
`;

  exportAsText() {
    const blob = new Blob([this.releaseNotes], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'release-notes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

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
  documentationAskDocuBot(){
    this.router.navigate(['/dashboard-page/chat']);
  }
}
