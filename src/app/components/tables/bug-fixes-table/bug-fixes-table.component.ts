import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-bug-fixes-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bug-fixes-table.component.html',
  styleUrl: './bug-fixes-table.component.css'
})
export class BugFixesTableComponent {
  @Input() data!: any; // Input property to receive data from the parent
  
  itemsPerPage = 3;
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  get paginatedItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.data.slice(start, start + this.itemsPerPage);
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
}
