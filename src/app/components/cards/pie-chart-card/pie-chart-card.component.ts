import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pie-chart-card',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './pie-chart-card.component.html',
  styleUrl: './pie-chart-card.component.css'
})
export class PieChartCardComponent {
  @Input() data!: any; // Input property to receive data from the parent
  // Chart properties
  showLegend = false;
  showLabels = false;
  explodeSlices = false;
  doughnut = true;
  arcWidth = 0.2; // Controls thickness of the ring

  constructor( private router: Router ) {}

  viewMore(){
    this.router.navigate(['/dashboard-page/chat']);
  }
}
