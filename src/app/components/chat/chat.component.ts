import { HttpClient } from '@angular/common/http';
import { Component, inject,  OnInit, signal, Input   } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { SourceCardComponent } from '../../components/cards/source-card/source-card.component';
import { AnswerSource, ChatMessage } from '../../models/chat.model';
import { extractAnswerText, convertMarkdown, extractSources } from '../../utils/chat-utils';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-chat',
  standalone:true,
  imports: [CommonModule, FormsModule, SourceCardComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  app_id = "67daf330d62c5ade928150d1";
  model_name ="openai/gpt-4o";
  top_k = 3;

  sessionId: any = "";

  askedQuestion: string = '';
  sources: AnswerSource[] = [];
  messages: ChatMessage[] = [];

  constructor(private userService: UserService, private apiService: ApiService, private chatService: ChatService, private sanitizer: DomSanitizer){}
  isProductDropdownOpen = false;
  selectedProduct = 'Select Product';
  products = ['Connectic - High Value V1.0', 'Connectic - Low Value V1.0'];
  toggleProductDropdown() {
    this.isProductDropdownOpen = !this.isProductDropdownOpen;
  }
  selectProduct(template: string) {
    this.selectedProduct = template;
    this.isProductDropdownOpen = false;
  }
  // post a question and get answer using api call
  askQuestion(askedQuestion : string ) {
    const question = askedQuestion.trim();
    if (!question) return;
    this.postChat(question);
    this.askedQuestion = ''; 
  }
  // Chat Stream
  postChat(askedQuestion: string) {
    console.log("this.userService.getUserId(): ", this.userService.getUserId())
    const payload = {
      app_id: this.app_id,
      session_id: 'b956506-2a95-43a2-8737-c0deb90d0b75',
      user_id: this.userService.getUserId(),
      question: askedQuestion, 
      model_name: this.model_name,
      top_k: this.top_k,
      use_cache: true
    };
    this.apiService.post<any>('chat_stream', payload, 'text').subscribe({
      next: async (data) => {
        console.log("api post data mz:", data);
        const extractAnswer = extractAnswerText(data);
        const safeAnswer = await convertMarkdown(extractAnswer, this.sanitizer);
        
        let answerSource: AnswerSource[] = extractSources(data); 
        
        this.messages.push({ sender: 'user', text: askedQuestion });
        this.messages.push({ 
          sender: 'bot', 
          text: safeAnswer, 
          sources: answerSource 
         });
      },
      error: (err) => console.error('Error:', err),
    });
  }

  // get chat using chat id
  getChat(chat_id: string) {
    this.apiService.getSelectedQuestion<any>(chat_id).subscribe({
      next: async (data) => {
        const raw = data.chat.answer;
        const extractAnswer = extractAnswerText(raw);
        const safeAnswer = await convertMarkdown(extractAnswer, this.sanitizer);
        const question = data.chat.question;

        let answerSource: AnswerSource[] = extractSources(raw); 
        
        this.messages.push({ sender: 'user', text:question });
        this.messages.push({ 
          sender: 'bot', 
          text: safeAnswer, 
          sources: answerSource 
         });
      },
      error: (err) => console.error('Error:', err),
    });
  }
  
  // Create a session id using user id
  createSessionId(userId: any) {
    const payload = {
      user_id: userId,
      app_id: this.app_id
    };
    this.apiService.post<any>('create_session', payload, 'json').subscribe({
      next: async (data) => {
        console.log('createSession data:', data);
        console.log('session_id:', data?.session_id);
        this.sessionId = data?.session_id;
      },
      error: (err) => console.error('Error:', err),
    });
  }
  ngOnInit() {
    // selected question from chat history
    this.chatService.click$.subscribe(() => {
      this.getChat(this.chatService.getChatId());
    });
    // start new chat on clicking the Start New Chat button
    this.chatService.startNewChatClick$.subscribe(() => {
      this.sources = [];
      this.messages = [];
      this.createSessionId(this.userService.getUserId());
      console.log("sessionId: ", this.sessionId)
    });
  }

}
