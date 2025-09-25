import { Component,  ElementRef, HostListener, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { UserService } from '../../services/user.service';
import { DocumentationService } from '../../services/documentation.service';
import { OnboardingService } from '../../services/onboarding.service';
import { ApiService } from '../../services/api.service';
import { ReleaseHistoryTableComponent } from '../../components/tables/release-history-table/release-history-table.component';
import { Router, TitleStrategy } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule,FormsModule, ReleaseHistoryTableComponent, MarkdownModule ],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.css'
})
export class DocumentationComponent implements OnInit, OnDestroy {
  userName: string = 'User Name';
  userRole: string = 'Product Owner';
  selectedOption1 = '';  
  selectedOption2 = '';  
  imagePath ='./app/resources/icons/paste-url-icon.svg';
  listNumber = 3;
  // documentation Pages
  documentationLandingPage = false;
  documentationGeneratingPage = false; 
  documentationGeneratedPage = false; 

  products: string[] = [];
  selectedProduct: string = "";
  templates: any[] = [];

  // Form data properties (will be managed by service)
  sources: { newSource: string }[] = [];
  PdfSources: File[] = [];
  selectedTemplate: any = 'Select Template';
  generatedContent: any = '';
  releaseHistory: any[] = [];
  // Subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService, private documentationService: DocumentationService, private router: Router, private onboardingService: OnboardingService, private apiService: ApiService ) {}

  ngOnInit() {
    // Subscribe to user service changes
    this.subscriptions.push(
      this.userService.userName$.subscribe(name => {
        this.userName = name || 'User Name';
      })
    );
    
    this.subscriptions.push(
      this.userService.userRole$.subscribe(role => {
        this.userRole = role || 'Product Owner';
      })
    );
    // Get products
    if(this.onboardingService.getProductList().length > 0) {
        this.products = this.onboardingService.getProductList();
        this.selectedProduct = this.onboardingService.getSelectedProduct();
    } else {
        this.gettingProductListFromApi();
    }
   
    // Subscribe to documentation service state changes
    this.subscriptions.push(
      this.documentationService.documentationLandingPage$.subscribe(state => {
        this.documentationLandingPage = state;
      })
    );
    
    this.subscriptions.push(
      this.documentationService.documentationGeneratingPage$.subscribe(state => {
        this.documentationGeneratingPage = state;
      })
    );
    
    this.subscriptions.push(
      this.documentationService.documentationGeneratedPage$.subscribe(state => {
        this.documentationGeneratedPage = state;
      })
    );
    
    // Restore documentation state from service
    this.documentationService.restoreDocumentationState();
    
    // Get initial state from service
    this.documentationLandingPage = this.documentationService.getDocumentationLandingPage();
    this.documentationGeneratingPage = this.documentationService.getDocumentationGeneratingPage(); 
    this.documentationGeneratedPage = this.documentationService.getDocumentationGeneratedPage(); 
    
    // Subscribe to form data from service
    this.subscriptions.push(
      this.documentationService.sources$.subscribe(sources => {
        this.sources = sources;
      })
    );
    
    this.subscriptions.push(
      this.documentationService.pdfSources$.subscribe(pdfSources => {
        this.PdfSources = pdfSources;
      })
    );
    
    this.subscriptions.push(
      this.documentationService.selectedTemplate$.subscribe(template => {
        this.selectedTemplate = template;
      })
    );
    
    this.subscriptions.push(
      this.documentationService.selectedProduct$.subscribe(product => {
        this.selectedProduct = product;
      })
    );
    
    this.subscriptions.push(
      this.documentationService.generatedContent$.subscribe(content => {
        this.generatedContent = content;
      })
    );
    
    // Get initial form data from service
    this.sources = this.documentationService.sources;
    this.PdfSources = this.documentationService.pdfSources;
    this.selectedTemplate = this.documentationService.selectedTemplate;
    this.selectedProduct = this.documentationService.selectedProduct || this.onboardingService.getSelectedProduct();
    this.generatedContent = this.documentationService.generatedContent;
    
    // Subscribe to get templates from API
    this.subscriptions.push(
      this.apiService.getTemplates().subscribe({
        next: (data: any) => {
          this.templates = data.documentation_types;
          this.documentationService.setTemplatesList(data.documentation_types);
        },
        error: (err: any) => {
          console.error('Error fetching templates:', err);
          // Fallback to empty array or default templates
          this.templates = [];
          this.documentationService.setTemplatesList([]);
        }
      })
    );
    
    this.userService.setIsUserHasAccountSetup(true);
    this.gettingDocumentationHistoryFromApi();
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  goToDocumentationGeneratedPage() {
    this.documentationService.setDocumentationLandingPage(false);
    this.documentationService.setDocumentationGeneratingPage(false);
    this.documentationService.setDocumentationGeneratedPage(true);
    this.documentationGeneratedPage = true;
    this.documentationLandingPage = false;
    this.documentationGeneratingPage = false;
    
    // Check if both PdfSources and sources arrays have content before proceeding
    if (this.PdfSources.length > 0 && this.sources.length > 0) {
      this.generateDocumentation(this.PdfSources, this.sources); 
    } else {
      console.warn('Cannot generate documentation: Missing PDF files or sources');
    }
    
  }
  goToDocumentationGeneratingPage(){
    this.documentationService.setDocumentationLandingPage(false);
    this.documentationService.setDocumentationGeneratedPage(false);
    this.documentationService.setDocumentationGeneratingPage(true);
    this.documentationGeneratedPage = false;
    this.documentationLandingPage = false;
    this.documentationGeneratingPage = true;
  }

  goToDocumentationLandingPage() {
    this.documentationService.setDocumentationGeneratingPage(false);
    this.documentationService.setDocumentationGeneratedPage(false);
    this.documentationService.setDocumentationLandingPage(true);
    this.documentationGeneratedPage = false;
    this.documentationLandingPage = true;
    this.documentationGeneratingPage = false;
  }
  // Select Template section
  isOpen = false;
  generateTemplateDropdown = false;
  isTemplatesDropdownOpen = false;
  isViewSourcesDropdownOpen = false
  isProductDropdownOpen = false;
  isGenProductDropdownOpen = false;
  isProductDropdownBotOpen = false;
  isFilterDropdownOpen = false;
  filters =['Type', 'Status', 'Published date', 'Created by'];
  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.generateTemplateDropdown = !this.generateTemplateDropdown;
    this.isTemplatesDropdownOpen = !this.isTemplatesDropdownOpen
  }
  toggleViewSourcesDropdown() {
    this.isViewSourcesDropdownOpen = !this.isViewSourcesDropdownOpen;
    console.log("this.isViewSourcesDropdownOpen: ", this.isViewSourcesDropdownOpen)
  }
  selectTemplate(template: any) {
    this.documentationService.setSelectedTemplate(template);
    this.documentationService.setSelectedTemplateId(template.id);
    this.isOpen = false;
    this.generateTemplateDropdown = false;
    this.isTemplatesDropdownOpen = false;
  }

  toggleProductDropdown() {
    this.isProductDropdownOpen = !this.isProductDropdownOpen;
    this.isProductDropdownBotOpen = !this.isProductDropdownBotOpen;
    this.isGenProductDropdownOpen = !this.isGenProductDropdownOpen;
  }
  toggleFilterDropdown() {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  selectProduct(product: string) {
    this.documentationService.setSelectedProduct(product);
    // Also set the selected product in onboarding service to ensure product ID is set
    this.onboardingService.setSelectedProduct(product);
    this.isProductDropdownOpen = false;
    this.isGenProductDropdownOpen = false;
    this.isProductDropdownBotOpen = false;
  }

  // sources section
  viewSources = [
    { source: 'JIRA-516: Bug Fixes from latest code changes' },
    { source: 'EPIC-516: Payment Hub Security updates' }
  ];
  pdfNewSource: string = '';

  newSource: string = '';
  generateDoc = false;

  addSource() {
    if (this.newSource.trim()) {
      this.documentationService.addSource({ newSource: this.newSource });
      this.newSource = ''; // Clear input after adding
    }
    this.generateDoc = true;
  }

  addPdfSource() {
    console.warn('addPdfSource() is deprecated. Use file upload or sources array for text-based sources.');
  }
  deleteSource(index: number) {
    this.documentationService.removeSource(index);
  }

  deletePdfSource(index: number) {
    this.documentationService.removePdfSource(index);
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
      this.documentationService.addPdfSource(files[i]);
    }
  }
  
  isModalOpen = false; // Initial state (modal is closed)
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  createDocument() {
    // Check if both PdfSources and sources arrays have content before proceeding
    if (this.PdfSources.length > 0 && this.sources.length > 0) {
      this.generateDocumentation(this.PdfSources, this.sources); 
    } else {
      console.warn('Cannot generate documentation: Missing PDF files or sources');
    }
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
  // documentation ask documentaion bot
  documentationAskDocuBot(){
    this.router.navigate(['/dashboard-page/chat']);
  }

  showChatBox = false;

  // On Clicking Outside the dropdown
  @ViewChild('dropdown') dropdownRef!: ElementRef;
  @ViewChild('templatesDropdown') templatesDropdownRef!: ElementRef;
  @ViewChild('botProductDropdown') botProductDropdownRef!: ElementRef;
  @ViewChild('genTemplateDropdown') genTemplateDropdownRef!: ElementRef;
  @ViewChild('genProductDropdown') genProductDropdownRef!: ElementRef;
  @ViewChild('viewSourcesDropdown') viewSourcesDropdownRef!: ElementRef;

  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: HTMLElement): void {
    // Product
    if (this.dropdownRef && !this.dropdownRef.nativeElement.contains(targetElement)) {
      this.isProductDropdownOpen = false;
    }
    if (this.botProductDropdownRef && !this.botProductDropdownRef.nativeElement.contains(targetElement)) {
      this.isProductDropdownBotOpen = false;
    }
    if (this.genProductDropdownRef && !this.genProductDropdownRef.nativeElement.contains(targetElement)) {
      this.isGenProductDropdownOpen = false;
    }

     // Template
    if (this.templatesDropdownRef && !this.templatesDropdownRef.nativeElement.contains(targetElement)) {
      this.isTemplatesDropdownOpen = false;
    }
    if (this.genTemplateDropdownRef && !this.genTemplateDropdownRef.nativeElement.contains(targetElement)) {
      this.generateTemplateDropdown = false;
    }
    // Sources
    if (this.viewSourcesDropdownRef && !this.viewSourcesDropdownRef.nativeElement.contains(targetElement)) {
      this.isViewSourcesDropdownOpen = false;
    }
  }

  // Generate Documentation from API
  isGeneratingDocumentation: boolean = false;
  generateDocumentation(files: File[], sources: { newSource: string }[]) {
    this.isGeneratingDocumentation = true;
    this.documentationService.setGeneratedContent('');
  
    const today = new Date();
    const releaseDate = today.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  
    const sourceStrings = sources.map(s => s.newSource);
  
    const formData = new FormData();
    formData.append("created_by", this.userName);
    formData.append("release_date", releaseDate);
    formData.append("version_number", "1.0.0");
    formData.append("product_type", this.onboardingService.getSelectedProductId());
    formData.append("template_type", this.documentationService.selectedTemplateId);
    formData.append("data_sources", JSON.stringify(sourceStrings));
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
  
    // Debug FormData contents
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    this.apiService.generateDocumentation(formData).subscribe({
      next: (data: any) => {
        console.log("API Response:", data);
        this.documentationService.setGeneratedContent(data.message);
        // this.documentationService.setGeneratedContent(data.generated_content);
        this.isGeneratingDocumentation = false;
      },
      error: (err: any) => {
        console.error("API Error Details:", err);
        this.isGeneratingDocumentation = false;
      },
    });
  }
  

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

   // getting product list from api
  gettingProductListFromApi() {
    this.apiService.get<any>('list_products').subscribe({
      next: async (data) => {
        this.products = data.map((product: any) => product.name);
        // Also set the full product list with IDs so that getSelectedProductId() works
        this.onboardingService.setFullProductList(data);
      },
    });
  }
  // getting documentation history from api
  gettingDocumentationHistoryFromApi() {
    this.apiService.getDocumentationHistory().subscribe({
      next: async (data: any) => {
        console.log("Documentation History: ", data);
        this.releaseHistory = Array.isArray(data) ? data : [];
      },  
      error: (err) => {
        console.error('Error fetching documentation history:', err);
        this.releaseHistory = [];
      },
    });
  }
}
