import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { ChatService } from '../../services/chat.service';
import { ChatHistory } from '../../models/chat.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-history',
  standalone:true,
  imports: [],
  templateUrl: './chat-history.component.html',
  styleUrl: './chat-history.component.css'
})
export class ChatHistoryComponent {
  chatHistory: ChatHistory[] = [];

  constructor(private apiService: ApiService, private chatService: ChatService, private sanitizer: DomSanitizer, private router: Router){}
  
  userId: string = "get_all_chats";
 
  getChatHistory(userId: string) {
    this.apiService.get<any>(userId).subscribe({
      next: (data) => {
        data.forEach((item: { chat: { question: string }, chat_id: string }) => {
          const question = item.chat?.question || "";
          const chatId = item.chat_id;
          this.chatHistory.push({ question, chatId });
        });
      },
      error: (err) => console.error('Error:', err),
    });
  }
  
  ngOnInit() {
    this.getChatHistory(this.userId);
  }
  // selected question from chat history
  selectChat(chatId: string) {
    this.chatService.setChatId(chatId);
    this.chatService.emitClick();
    this.chatService.setNewChatHistory(true);
    this.router.navigate(['/dashboard-page/chat']);
  }

}
