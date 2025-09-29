import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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

  get totalPages(): number {
    return this.data && this.data.length > 0 ? Math.ceil(this.data.length / this.listPerPage) : 1;
  }

  get paginatedItems() {
    if (!this.data || this.data.length === 0) {
      return [];
    }
    const start = (this.currentPage - 1) * this.listPerPage;
    return this.data.slice(start, start + this.listPerPage);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      // Reset to first page when data changes
      this.currentPage = 1;
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
}
