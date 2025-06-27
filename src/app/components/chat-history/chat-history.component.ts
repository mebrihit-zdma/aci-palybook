import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { ChatService } from '../../services/chat.service';
import { SearchChatService } from '../../services/search-chat.service';
import { ChatHistory} from '../../models/chat.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-history',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './chat-history.component.html',
  styleUrl: './chat-history.component.css'
})
export class ChatHistoryComponent {

  userId: string = "8c8cda2b-cda6-41c2-927d-511d40724810-test-v4";
  searchValue: string = '';

  chatHistory: ChatHistory[] = [];
  filteredChatHistory: (ChatHistory & { highlightedQuestion: SafeHtml })[] = [];

  constructor(private apiService: ApiService, private chatService: ChatService, private searchChatService: SearchChatService, private sanitizer: DomSanitizer, private router: Router){}
  
  ngOnInit() {
    this.getUserSessions(this.userId); 
    this.searchChatService.searchValue$.subscribe(value => {
      this.searchValue = value;
      this.applyFilter();
    });
    this.chatService.getNewSession$().subscribe(session => {
      if (session && !this.chatHistory.find(s => s.sessionId === session.sessionId)) {
        this.chatHistory.unshift(session);
      }
    });
  }
  getUserSessions(userId: string) {
    const payload = {
      user_id: userId,
      app_id: "67daf330d62c5ade928150d1", 
    }
    this.apiService.post<any>('get_chat_sessions_for_user_id', payload).subscribe({
      next: (data) => {
        console.log("User id from chat history:", userId)
        console.log("Sessions List:", data)
        // Filter out entries with "New_Chat"
        this.chatHistory = data
        .filter((item: { summary: string }) => item.summary !== 'New_Chat')
        .map((item: { summary: string, session_id: string }) => ({
          question: item.summary || '',
          sessionId: item.session_id
        }));
        this.applyFilter();
      },
      error: (err) => console.error('Error:', err),
    });
  }

  applyFilter() {
    const search = this.searchValue.toLowerCase().trim();
  
    this.filteredChatHistory = this.chatHistory
      .filter(chat => chat.question.toLowerCase().includes(search))
      .map(chat => ({
        ...chat,
        highlightedQuestion: this.getHighlightedText(chat.question, search)
      }));
  }

  getHighlightedText(text: string, search: string): SafeHtml {
    if (!search) return this.sanitizer.bypassSecurityTrustHtml(text);
  
    const regex = new RegExp(`(${search})`, 'gi');
    const highlighted = text.replace(
      regex,
      `<span class="custom-highlight">$1</span>`
    );
  
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
  
  // selected question from chat history
  selectChat(sessionId: string) {
    console.log("Session Id: ", sessionId)
    this.chatService.setSessionId(sessionId);
    this.chatService.emitClick();
    this.chatService.setNewChatHistory(true);
    this.searchChatService.setSearchValue(''); // Clear SearchValue
    this.router.navigate(['/dashboard-page/chat']);
  }

  trackChat(index: number, chat: ChatHistory) {
    return chat.sessionId;
  }
 
  selectedSession: any = null;
  openDeleteSession(item: any){
    this.selectedSession = this.selectedSession === item ? null : item;
  }

  deleteSession(sessionId: string){
    this.apiService.delete<any>(`delete_session/${sessionId}`).subscribe({
      next: async (data) => {
          // Remove the deleted session from the local array
        this.chatHistory = this.chatHistory.filter(session => session.sessionId !== sessionId);
        this.chatService.setSessionDeleted(data?.message || 'Session deleted successfully')
      },
        error: (err) => console.error('Error:', err),
    });
  }
}
