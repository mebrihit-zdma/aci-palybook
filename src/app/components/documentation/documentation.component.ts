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
import jsPDF from "jspdf";

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule,FormsModule, ReleaseHistoryTableComponent, MarkdownModule ],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.css'
})
export class DocumentationComponent implements OnInit, OnDestroy {
  // user data
  userName: string = 'User Name';
  userRole: string = 'Product Owner';
  selectedOption1 = '';  
  selectedOption2 = '';  
  // list number
  imagePath ='./app/resources/icons/paste-url-icon.svg';
  listNumber = 3;
  // documentation Pages
  documentationLandingPage = false;
  documentationGeneratingPage = false; 
  documentationGeneratedPage = false; 
  // products
  products: string[] = [];
  selectedProduct: string = "";
  templates: any[] = [];
  // sources
  sources: { newSource: string }[] = [];
  PdfSources: File[] = [];
  selectedTemplate: any = 'Select Template';
  generatedContent: any = '';
  releaseHistory: any[] = [];
  private subscriptions: Subscription[] = []; // Subscriptions for cleanup

  isOpen = false;
  generateTemplateDropdown = false;
  isTemplatesDropdownOpen = false;
  isViewSourcesDropdownOpen = false
  isProductDropdownOpen = false;
  isGenProductDropdownOpen = false;
  isProductDropdownBotOpen = false;
  isFilterDropdownOpen = false;
  pdfNewSource: string = '';
  newSource: string = '';
  generateDoc = false;
  filters =['Type', 'Status', 'Published date', 'Created by'];
  isModalOpen = false; // Initial state (modal is closed)
  showChatBox = false;
  isGeneratingDocumentation: boolean = false;
  releaseNotes: string = '';
  generatedFileName: string = '';
  

  // constructor
  constructor(private userService: UserService, private documentationService: DocumentationService, private router: Router, private onboardingService: OnboardingService, private apiService: ApiService ) {}

  // ngOnInit
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
    
    // Subscribe to selected product changes from onboarding service (for user settings)
    this.subscriptions.push(
      this.onboardingService.getSelectedProduct$().subscribe(product => {
        if (product && product !== this.selectedProduct) {
          this.selectedProduct = product;
          // Also update the documentation service to keep them in sync
          this.documentationService.setSelectedProduct(product);
        }
      })
    );
   
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
  // ngOnDestroy
  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  // go to documentation generated page
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
  // go to documentation generating page
  goToDocumentationGeneratingPage(){
    this.documentationService.setDocumentationLandingPage(false);
    this.documentationService.setDocumentationGeneratedPage(false);
    this.documentationService.setDocumentationGeneratingPage(true);
    this.documentationGeneratedPage = false;
    this.documentationLandingPage = false;
    this.documentationGeneratingPage = true;
  }
  // go to documentation landing page
  goToDocumentationLandingPage() {
    this.documentationService.setDocumentationGeneratingPage(false);
    this.documentationService.setDocumentationGeneratedPage(false);
    this.documentationService.setDocumentationLandingPage(true);
    this.documentationGeneratedPage = false;
    this.documentationLandingPage = true;
    this.documentationGeneratingPage = false;
  }
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
  // open modal
  openModal() {
    this.isModalOpen = true;
  }
  // close modal
  closeModal() {
    this.isModalOpen = false;
  }
  // create document
  createDocument() {
    // Check if both PdfSources and sources arrays have content before proceeding
    if (this.PdfSources.length > 0 && this.sources.length > 0) {
      this.generateDocumentation(this.PdfSources, this.sources); 
    } else {
      console.warn('Cannot generate documentation: Missing PDF files or sources');
    }
  }

  // export section
//   releaseNotes: string = `
// Example: ACI Payment Gateway – Release Notes (Version 2.5.0)

// Release Date: March 15, 2025

// Prepared By: Product Management Team

// 1. Overview
// This release introduces enhanced security measures, improved payment processing speed, and new API integrations to streamline bank and merchant operations. Several bug fixes and performance optimizations have also been included.

// 2. New Features & Enhancements
// Feature    | Description
// -----------|-----------------------------------------------------
// Enhanced Transaction Security | Implemented multi-layer fraud detection with AI-driven anomaly detection.
// Faster Payment Processing | Optimized transaction routing to reduce processing time by 20%.
// New API for Custom Reports | Introduced API endpoints for real-time payment tracking and data export.

// 3. Bug Fixes & Performance Improvements
// Issue    | Resolution
// ---------|-----------------------------------------------------
// Payment approval delays for high-volume transactions | Improved load balancing and optimized database queries.
// Incorrect currency conversion in multi-currency transactions | Fixed calculation logic and tested accuracy.
// Help24 system lagging during peak hours | Upgraded infrastructure and optimized query processing.

// 4. Known Issues & Workarounds
// - **Issue**: Some users may experience delays when accessing new API features.  
//   **Workaround**: Clear cache or wait for server sync to complete within 5 minutes.

// - **Issue**: Legacy integration users may see warning messages when processing transactions.  
//   **Workaround**: Update to the latest API version or contact support for assistance.

// For further details, contact:
// 📩 ACI Support Team – support@aci.com  
// 📄 Documentation & FAQs – ACI Knowledge Base
// `;
  // documentation ask documentaion bot
  documentationAskDocuBot(){
    this.router.navigate(['/dashboard-page/chat']);
  }
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
        this.documentationService.setGeneratedContent(data.generated_content);
        this.generatedFileName = data.pdf_filename;
        console.log("fileName:", data.pdf_filename);
        this.releaseNotes = data.generated_content;
        this.isGeneratingDocumentation = false;
      },
      error: (err: any) => {
        console.error("API Error Details:", err);
        this.isGeneratingDocumentation = false;
      },
    });
  }
  // export as text
  exportAsText() {
    try {
      console.log('Starting PDF export...');
      console.log('Release notes content:', this.releaseNotes);
      
      // Check if we have content to export
      if (!this.releaseNotes || this.releaseNotes.trim() === '') {
        console.warn('No content to export');
        alert('No content available to export. Please generate documentation first.');
        return;
      }

    const doc = new jsPDF();
      const pageWidth = 190; // Page width in mm
      const pageHeight = 280; // Page height in mm
      const margin = 20; // Increased margin for cleaner look
      let yPosition = margin;
      
      // Parse and format the markdown content
      const formattedContent = this.parseMarkdownForPDF(this.releaseNotes);
      console.log('Formatted content:', formattedContent);
      
      // Add content with proper formatting
      for (const element of formattedContent) {
        // Skip spacing elements
        if (element.type === 'spacing') {
          yPosition += element.height;
          continue;
        }
        
        // Check if we need a new page
        if (yPosition + element.height > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Set font based on element type - matching the clean document style
        if (element.type === 'h1') {
          doc.setFontSize(18); // Larger for main title
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
        } else if (element.type === 'h2') {
          doc.setFontSize(12); // Standard size for section headings
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
        } else if (element.type === 'h3') {
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
        } else if (element.type === 'h4') {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
        } else if (element.type === 'numbered_list') {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
        } else if (element.type === 'bullet_list') {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
        } else if (element.type === 'bold') {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
        } else {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
        }
        
        // Add the text with proper spacing and indentation
        if (element.lines && element.lines.length > 0) {
          for (const line of element.lines) {
            if (line && line.trim()) {
              let xPosition = margin;
              if (element.type === 'bullet_list') {
                xPosition = margin + 8; // Indent bullet points
              } else if (element.type === 'numbered_list') {
                xPosition = margin + 8; // Indent numbered items
              }
              doc.text(line, xPosition, yPosition);
              yPosition += 5; // Consistent line spacing
            }
          }
        } else if (element.text && element.text.trim()) {
          let xPosition = margin;
          if (element.type === 'bullet_list') {
            xPosition = margin + 8;
          } else if (element.type === 'numbered_list') {
            xPosition = margin + 8;
          }
          doc.text(element.text, xPosition, yPosition);
          yPosition += 5;
        }
        
        // Add proper spacing after different element types
        if (element.type === 'h1') {
          yPosition += 10; // More space after main title
        } else if (element.type.startsWith('h')) {
          yPosition += 6; // Space after section headings
        } else if (element.type === 'numbered_list' || element.type === 'bullet_list') {
          yPosition += 3; // Small space after list items
        } else if (element.type === 'text' || element.type === 'bold') {
          yPosition += 4; // Space after paragraphs
        }
      }
      
      // Save the document
      const fileName = this.generatedFileName ? 
        this.generatedFileName.replace('.pdf', '') + '.pdf' : 
        'release-notes.pdf';
      
      console.log('Saving PDF with filename:', fileName);
      doc.save(fileName);
      console.log('PDF export completed successfully');
      
    } catch (error) {
      console.error('Error during PDF export:', error);
      alert('Error exporting PDF. Please try again.');
    }
  }

  // Parse markdown content for PDF formatting
  private parseMarkdownForPDF(content: string): any[] {
    if (!content || typeof content !== 'string') {
      console.warn('Invalid content provided to parseMarkdownForPDF');
      return [];
    }

    const elements: any[] = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        elements.push({ type: 'spacing', height: 3 });
        continue;
      }
      
      try {
        // Headers
        if (line.startsWith('# ')) {
          const text = line.substring(2).trim();
          if (text) {
            const cleanText = this.removeBoldMarkers(text);
            const wrappedLines = this.wrapText(cleanText, 160);
            elements.push({ type: 'h1', text: cleanText, lines: wrappedLines, height: wrappedLines.length * 6 + 10 });
          }
        } else if (line.startsWith('## ')) {
          const text = line.substring(3).trim();
          if (text) {
            const cleanText = this.removeBoldMarkers(text);
            const wrappedLines = this.wrapText(cleanText, 160);
            elements.push({ type: 'h2', text: cleanText, lines: wrappedLines, height: wrappedLines.length * 6 + 8 });
          }
        } else if (line.startsWith('### ')) {
          const text = line.substring(4).trim();
          if (text) {
            const cleanText = this.removeBoldMarkers(text);
            const wrappedLines = this.wrapText(cleanText, 160);
            elements.push({ type: 'h3', text: cleanText, lines: wrappedLines, height: wrappedLines.length * 6 + 6 });
          }
        } else if (line.startsWith('#### ')) {
          const text = line.substring(5).trim();
          if (text) {
            const cleanText = this.removeBoldMarkers(text);
            const wrappedLines = this.wrapText(cleanText, 160);
            elements.push({ type: 'h4', text: cleanText, lines: wrappedLines, height: wrappedLines.length * 6 + 6 });
          }
        }
        // Lists
        else if (line.startsWith('- ') || line.startsWith('* ')) {
          const text = line.substring(2).trim();
          if (text) {
            const cleanText = this.removeBoldMarkers(text);
            const wrappedLines = this.wrapText(`• ${cleanText}`, 155);
            elements.push({ type: 'bullet_list', text: cleanText, lines: wrappedLines, height: wrappedLines.length * 5 + 3 });
          }
        } else if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.+)$/);
          if (match) {
            const number = match[1];
            const text = match[2].trim();
            const cleanText = this.removeBoldMarkers(text);
            const wrappedLines = this.wrapText(`${number}. ${cleanText}`, 155);
            elements.push({ type: 'numbered_list', text: cleanText, lines: wrappedLines, height: wrappedLines.length * 5 + 3 });
          }
        }
        // Tables (basic support)
        else if (line.includes('|')) {
          const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
          if (cells.length > 1) {
            const cleanCells = cells.map(cell => this.removeBoldMarkers(cell));
            const tableLine = cleanCells.join(' | ');
            const wrappedLines = this.wrapText(tableLine, 160);
            elements.push({ type: 'table', text: tableLine, lines: wrappedLines, height: wrappedLines.length * 6 + 3 });
          }
        }
        // Regular text
        else {
          // Check if line contains bold text
          if (line.includes('**')) {
            const boldElements = this.parseBoldText(line);
            elements.push(...boldElements);
          } else {
            const cleanText = this.removeBoldMarkers(line);
            const wrappedLines = this.wrapText(cleanText, 160);
            elements.push({ type: 'text', text: cleanText, lines: wrappedLines, height: wrappedLines.length * 6 + 3 });
          }
        }
      } catch (error) {
        console.error('Error parsing line:', line, error);
        // Fallback to regular text
        const cleanText = this.removeBoldMarkers(line);
        const wrappedLines = this.wrapText(cleanText, 160);
        elements.push({ type: 'text', text: cleanText, lines: wrappedLines, height: wrappedLines.length * 6 + 3 });
      }
    }
    
    return elements;
  }

  // Remove bold markers from text
  private removeBoldMarkers(text: string): string {
    if (!text || typeof text !== 'string') {
      return text;
    }
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
  }

  // Parse bold text and return formatted elements
  private parseBoldText(line: string): any[] {
    const elements: any[] = [];
    const parts = line.split(/(\*\*.*?\*\*)/g);
    
    for (const part of parts) {
      if (!part) continue;
      
      if (part.startsWith('**') && part.endsWith('**')) {
        // Bold text - remove ** markers
        const boldText = part.slice(2, -2);
        if (boldText.trim()) {
          const wrappedLines = this.wrapText(boldText, 160);
          elements.push({ 
            type: 'bold', 
            text: boldText, 
            lines: wrappedLines, 
            height: wrappedLines.length * 6 + 3 
          });
        }
      } else if (part.trim()) {
        // Regular text
        const wrappedLines = this.wrapText(part, 160);
        elements.push({ 
          type: 'text', 
          text: part, 
          lines: wrappedLines, 
          height: wrappedLines.length * 6 + 3 
        });
      }
    }
    
    return elements;
  }

  // Helper method to wrap text
  private wrapText(text: string, maxWidth: number): string[] {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      if (!word) continue; // Skip empty words
      
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (testLine.length <= maxWidth / 2.8) { // More precise character width for cleaner wrapping
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines.length > 0 ? lines : [text];
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
        this.releaseHistory = Array.isArray(data) ? data : [];
      },  
      error: (err) => {
        console.error('Error fetching documentation history:', err);
        this.releaseHistory = [];
      },
    });
  }
}
