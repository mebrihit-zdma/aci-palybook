import { Component, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.css'
})
export class SummaryCardComponent {
  @Input() data!: any; // Input property to receive data from the parent
}
