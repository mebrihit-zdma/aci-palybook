import { Component, Input, OnChanges, SimpleChanges, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '../../../pipes/highlight.pipe'; 

@Component({
  selector: 'app-release-history-table',
  standalone: true,
  imports: [CommonModule, FormsModule, HighlightPipe],
  templateUrl: './release-history-table.component.html',
  styleUrl: './release-history-table.component.css'
})
export class ReleaseHistoryTableComponent implements OnChanges {
  @Input() data!: any; // Input property to receive data from the parent
  @Input() listPerPage!: number;
  @Input() searchTerm: string = ''; // Input property to receive search term from parent
  
  currentPage = 1;
  
  // Filter properties
  filters = {
    productType: '',
    templateType: '',
    createdBy: '',
    publishedDate: ''
  };
  
  // Filter dropdown states
  isProductTypeFilterOpen = false;
  isTemplateTypeFilterOpen = false;
  isCreatedByFilterOpen = false;
  isPublishedDateFilterOpen = false;
  
  // Unique values for filter dropdowns
  uniqueProductTypes: string[] = [];
  uniqueTemplateTypes: string[] = [];
  uniqueCreatedBy: string[] = [];
  uniquePublishedDates: string[] = [];

  // ViewChild references for dropdown elements
  @ViewChild('productTypeDropdown') productTypeDropdown!: ElementRef;
  @ViewChild('templateTypeDropdown') templateTypeDropdown!: ElementRef;
  @ViewChild('publishedDateDropdown') publishedDateDropdown!: ElementRef;
  @ViewChild('createdByDropdown') createdByDropdown!: ElementRef;

  get totalPages(): number {
    const filteredLength = this.filteredData.length;
    return filteredLength > 0 ? Math.ceil(filteredLength / this.listPerPage) : 1;
  }

  get filteredData() {
    if (!this.data || this.data.length === 0) {
      return [];
    }
    
    let filtered = [...this.data];
    
    // Apply filters
    if (this.filters.productType) {
      filtered = filtered.filter(item => item.product_type === this.filters.productType);
    }
    if (this.filters.templateType) {
      filtered = filtered.filter(item => item.template_type === this.filters.templateType);
    }
    if (this.filters.createdBy) {
      filtered = filtered.filter(item => item.created_by === this.filters.createdBy);
    }
    if (this.filters.publishedDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.release_date).toLocaleDateString('en-US');
        return itemDate === this.filters.publishedDate;
      });
    }
    
    return filtered;
  }

  get paginatedItems() {
    const filtered = this.filteredData;
    const start = (this.currentPage - 1) * this.listPerPage;
    return filtered.slice(start, start + this.listPerPage);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      // Reset to first page when data changes
      this.currentPage = 1;
      // Update unique values for filter dropdowns
      this.updateUniqueValues();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getFirstLetter(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  // Filter methods
  updateUniqueValues() {
    if (!this.data || this.data.length === 0) {
      this.uniqueProductTypes = [];
      this.uniqueTemplateTypes = [];
      this.uniqueCreatedBy = [];
      this.uniquePublishedDates = [];
      return;
    }

    this.uniqueProductTypes = [...new Set(this.data.map((item: any) => item.product_type).filter(Boolean))] as string[];
    this.uniqueTemplateTypes = [...new Set(this.data.map((item: any) => item.template_type).filter(Boolean))] as string[];
    this.uniqueCreatedBy = [...new Set(this.data.map((item: any) => item.created_by).filter(Boolean))] as string[];
    this.uniquePublishedDates = [...new Set(this.data.map((item: any) => 
      new Date(item.release_date).toLocaleDateString('en-US')
    ).filter(Boolean))] as string[];
  }

  toggleFilter(filterType: string) {
    switch (filterType) {
      case 'productType':
        this.isProductTypeFilterOpen = !this.isProductTypeFilterOpen;
        break;
      case 'templateType':
        this.isTemplateTypeFilterOpen = !this.isTemplateTypeFilterOpen;
        break;
      case 'createdBy':
        this.isCreatedByFilterOpen = !this.isCreatedByFilterOpen;
        break;
      case 'publishedDate':
        this.isPublishedDateFilterOpen = !this.isPublishedDateFilterOpen;
        break;
    }
  }

  applyFilter(filterType: string, value: string) {
    switch (filterType) {
      case 'productType':
        this.filters.productType = value;
        this.isProductTypeFilterOpen = false;
        break;
      case 'templateType':
        this.filters.templateType = value;
        this.isTemplateTypeFilterOpen = false;
        break;
      case 'createdBy':
        this.filters.createdBy = value;
        this.isCreatedByFilterOpen = false;
        break;
      case 'publishedDate':
        this.filters.publishedDate = value;
        this.isPublishedDateFilterOpen = false;
        break;
    }
    this.currentPage = 1; // Reset to first page when filter is applied
  }

  clearFilter(filterType: string) {
    switch (filterType) {
      case 'productType':
        this.filters.productType = '';
        break;
      case 'templateType':
        this.filters.templateType = '';
        break;
      case 'createdBy':
        this.filters.createdBy = '';
        break;
      case 'publishedDate':
        this.filters.publishedDate = '';
        break;
    }
    this.currentPage = 1; // Reset to first page when filter is cleared
  }

  clearAllFilters() {
    this.filters = {
      productType: '',
      templateType: '',
      createdBy: '',
      publishedDate: ''
    };
    this.currentPage = 1;
  }

  hasActiveFilters(): boolean {
    return Object.values(this.filters).some(filter => filter !== '');
  }

  // Click outside to close dropdowns
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    // Check if click is outside all dropdown containers
    if (this.productTypeDropdown && !this.productTypeDropdown.nativeElement.contains(target)) {
      this.isProductTypeFilterOpen = false;
    }
    if (this.templateTypeDropdown && !this.templateTypeDropdown.nativeElement.contains(target)) {
      this.isTemplateTypeFilterOpen = false;
    }
    if (this.publishedDateDropdown && !this.publishedDateDropdown.nativeElement.contains(target)) {
      this.isPublishedDateFilterOpen = false;
    }
    if (this.createdByDropdown && !this.createdByDropdown.nativeElement.contains(target)) {
      this.isCreatedByFilterOpen = false;
    }
  }

  // Close all dropdowns
  closeAllDropdowns() {
    this.isProductTypeFilterOpen = false;
    this.isTemplateTypeFilterOpen = false;
    this.isPublishedDateFilterOpen = false;
    this.isCreatedByFilterOpen = false;
  }

  // Enhanced toggle filter with close others functionality
  toggleFilterExclusive(filterType: string) {
    // Close all other dropdowns first
    this.closeAllDropdowns();
    
    // Then toggle the requested one
    this.toggleFilter(filterType);
  }
}
