import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-bug-fixes-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bug-fixes-table.component.html',
  styleUrl: './bug-fixes-table.component.css'
})
export class BugFixesTableComponent implements OnChanges {
  @Input() data!: any; // Input property to receive data from the parent
  
  itemsPerPage = 3;
  currentPage = 1;
  
  // Filter properties
  filters = {
    priority: '',
    status: '',
    assignedTo: ''
  };
  
  // Filter dropdown states
  isPriorityFilterOpen = false;
  isStatusFilterOpen = false;
  isAssignedToFilterOpen = false;
  
  // Unique values for filter dropdowns
  uniquePriorities: string[] = [];
  uniqueStatuses: string[] = [];
  uniqueAssignedTo: string[] = [];

  get totalPages(): number {
    const filteredLength = this.filteredData.length;
    return filteredLength > 0 ? Math.ceil(filteredLength / this.itemsPerPage) : 1;
  }

  get filteredData() {
    if (!this.data || this.data.length === 0) {
      return [];
    }
    
    let filtered = [...this.data];
    
    // Apply filters
    if (this.filters.priority) {
      filtered = filtered.filter(item => item.priority === this.filters.priority);
    }
    if (this.filters.status) {
      filtered = filtered.filter(item => item.status === this.filters.status);
    }
    if (this.filters.assignedTo) {
      filtered = filtered.filter(item => item.assignedTo === this.filters.assignedTo);
    }
    
    return filtered;
  }

  get paginatedItems() {
    const filtered = this.filteredData;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
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

  // Filter methods
  updateUniqueValues() {
    if (!this.data || this.data.length === 0) {
      this.uniquePriorities = [];
      this.uniqueStatuses = [];
      this.uniqueAssignedTo = [];
      return;
    }

    this.uniquePriorities = [...new Set(this.data.map(item => item.priority).filter(Boolean))];
    this.uniqueStatuses = [...new Set(this.data.map(item => item.status).filter(Boolean))];
    this.uniqueAssignedTo = [...new Set(this.data.map(item => item.assignedTo).filter(Boolean))];
  }

  toggleFilter(filterType: string) {
    switch (filterType) {
      case 'priority':
        this.isPriorityFilterOpen = !this.isPriorityFilterOpen;
        break;
      case 'status':
        this.isStatusFilterOpen = !this.isStatusFilterOpen;
        break;
      case 'assignedTo':
        this.isAssignedToFilterOpen = !this.isAssignedToFilterOpen;
        break;
    }
  }

  applyFilter(filterType: string, value: string) {
    switch (filterType) {
      case 'priority':
        this.filters.priority = value;
        this.isPriorityFilterOpen = false;
        break;
      case 'status':
        this.filters.status = value;
        this.isStatusFilterOpen = false;
        break;
      case 'assignedTo':
        this.filters.assignedTo = value;
        this.isAssignedToFilterOpen = false;
        break;
    }
    this.currentPage = 1; // Reset to first page when filter is applied
  }

  clearFilter(filterType: string) {
    switch (filterType) {
      case 'priority':
        this.filters.priority = '';
        break;
      case 'status':
        this.filters.status = '';
        break;
      case 'assignedTo':
        this.filters.assignedTo = '';
        break;
    }
    this.currentPage = 1; // Reset to first page when filter is cleared
  }

  clearAllFilters() {
    this.filters = {
      priority: '',
      status: '',
      assignedTo: ''
    };
    this.currentPage = 1;
  }

  hasActiveFilters(): boolean {
    return Object.values(this.filters).some(filter => filter !== '');
  }
}
