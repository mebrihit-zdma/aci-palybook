import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-source-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './source-card.component.html',
  styleUrl: './source-card.component.css'
})
export class SourceCardComponent {
  @Input() data!: any;
}
