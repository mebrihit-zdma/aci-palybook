import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { LeftSidebarComponent } from '../../components/left-sidebar/left-sidebar.component';
import { MainContentComponent } from '../../components/main-content/main-content.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [LeftSidebarComponent, MainContentComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  isLeftSidebarCollapsed = signal<boolean>(false);
  
  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }
}
