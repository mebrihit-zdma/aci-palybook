import { Component, input, output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import { SearchChatService } from '../../services/search-chat.service';
import { ChatHistoryComponent } from '../../components/chat-history/chat-history.component';
import { ChatService } from '../../services/chat.service';
import { MsalService } from '@azure/msal-angular';
import { DocumentationService } from '../../services/documentation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, ChatHistoryComponent, FormsModule ],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css'
})
export class LeftSidebarComponent {
  
  loginDisplay: boolean = false;

  constructor(private userService: UserService, private loginService: LoginService, private searchChatService: SearchChatService, private chatService: ChatService, private documentationService: DocumentationService, private router: Router, private authService: MsalService) {

    // this.loginDisplay= this.loginService.getLoginDisplay();
  }
  
  userName: string | null = 'User Name';
  userRole: string | null = 'Product Owner';
  profileImageUrl: string | null = null;
  searchValue: string = "";
  // documentation Pages
  documentationLandingPage = false;
  documentationGeneratingPage = false; 
  documentationGeneratedPage = false; 
  ngOnInit() {
    this.userService.userName$.subscribe(name => {
      this.userName = name;
    });
    this.userService.userRole$.subscribe(role => {
      this.userRole = role;
    });

    this.userService.userImageUrl$.subscribe(imageUrl => {
      this.profileImageUrl = imageUrl;
    });
    // documentation Pages
    this.documentationLandingPage = this.documentationService.getDocumentationLandingPage();
    this.documentationGeneratingPage = this.documentationService.getDocumentationGeneratingPage(); 
    this.documentationGeneratedPage = this.documentationService.getDocumentationGeneratedPage();
    
    this.searchChatService.searchValue$.subscribe(value => {
      this.searchValue = value; 
    });

    this.loginDisplay= this.loginService.getLoginDisplay();
  }

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  dashboardItems = [
    {
      routeLink: 'dashboard',
      icon: 'home',
      label: 'Dashboard',
    },
    {
      routeLink: 'documentation',
      icon: 'feed',
      label: 'Documentation',
    },
    {
      routeLink: 'chat',
      icon: 'chat_bubble',
      label: 'Chat',
    },
  ];
  chatItems = [
    {
      icon: 'add_circle_outline',
      label: 'Start New Chat',
    },
    {
      icon: 'search',
      label: 'Search Previous Chats',
    },
    {
      icon: 'history',
      label: 'Chat History',
    },
  ];
  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
  openSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(false);
  }

  //mobile
  isOpen = false; // Sidebar state

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
  getFirstLetter(name: string | null): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  // start new chat click event listener 
  startNewChat(){
    this.chatService.startNewChatEmitClick();
    this.router.navigate(['/dashboard-page/chat']);
  };
 
  onInputChange(value: string): void {
    this.searchChatService.setSearchValue(value)
  }

  // Log the user out
  logout() {
    if(this.loginDisplay){
      this.authService.logoutRedirect();
    }
  }
}
