import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import { ChatHistoryComponent } from '../../components/chat-history/chat-history.component';
import { ChatService } from '../../services/chat.service';
import { MsalService } from '@azure/msal-angular';
import { DocumentationService } from '../../services/documentation.service';


@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, ChatHistoryComponent ],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css'
})
export class LeftSidebarComponent {
  
  loginDisplay: boolean = false;
  constructor(private userService: UserService, private loginService: LoginService, private chatService: ChatService, private authService: MsalService, private documentationService: DocumentationService) {
    this.loginDisplay= this.loginService.getLoginDisplay();
  }
  
  // userName: string | null = null;
  // userRole: string | null = null;
  // profileImageUrl: string | null = null;
  profileImageUrl: string | null = 'http://localhost:4200/48a1b773-d4f8-4c49-8379-ba1af18c37bc';
  userName: string | null = 'User Name';
  userRole: string | null = 'Product Owner';
  ngOnInit() {
    // this.userService.userName$.subscribe(name => {
    //   this.userName = name;
    // });
    // this.userService.userRole$.subscribe(role => {
    //   this.userRole = role;
    // });

    // this.userService.userImageUrl$.subscribe(imageUrl => {
    //   this.profileImageUrl = imageUrl;
    // });
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
  };

  // Log the user out
  // logout() {
  //   if(this.loginDisplay){
  //     this.authService.logoutRedirect();
  //   }
  // }
}
