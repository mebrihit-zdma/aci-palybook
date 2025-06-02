import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { ChatService } from '../../services/chat.service';
import { SearchChatService } from '../../services/search-chat.service';
import { ChatHistory } from '../../models/chat.model';
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

  userId: string = "get_all_chats";
  searchValue: string = '';
  chatHistory: ChatHistory[] = [];
  filteredChatHistory: (ChatHistory & { highlightedQuestion: SafeHtml })[] = [];

  constructor(private apiService: ApiService, private chatService: ChatService, private searchChatService: SearchChatService, private sanitizer: DomSanitizer, private router: Router){}
  
  ngOnInit() {
    this.getChatHistory(this.userId);
    this.searchChatService.searchValue$.subscribe(value => {
      this.searchValue = value;
      this.applyFilter();
    });
  }
 
  getChatHistory(userId: string) {
    this.apiService.get<any>(userId).subscribe({
      next: (data) => {
        this.chatHistory = data.map((item: { chat: { question: string }, chat_id: string }) => ({
          question: item.chat?.question || '',
          chatId: item.chat_id
        }));
        this.applyFilter(); // Apply filter immediately after loading
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
  selectChat(chatId: string) {
    this.chatService.setChatId(chatId);
    this.chatService.emitClick();
    this.chatService.setNewChatHistory(true);
    this.searchChatService.setSearchValue(''); // Clear SearchValue
    this.router.navigate(['/dashboard-page/chat']);
  }

  trackChat(index: number, chat: ChatHistory) {
    return chat.chatId;
  }
  

}
