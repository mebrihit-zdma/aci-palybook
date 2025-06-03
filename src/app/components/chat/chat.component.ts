import { HttpClient } from '@angular/common/http';
import { Component, inject,  OnInit, signal, Input, ViewChild, ElementRef   } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ChatService } from '../../services/chat.service';
import { OnboardingService } from '../../services/onboarding.service';
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

  sessionId =  'b956506-2a95-43a2-8737-c0deb90d0b75';
  userId = '8c8cda2b-cda6-41c2-927d-511d40724810';
  app_id = "67daf330d62c5ade928150d1";
  model_name ="openai/gpt-4o";
  top_k = 3;

  // sessionId: any = "";

  askedQuestion: string = '';
  sources: AnswerSource[] = [];
  messages: ChatMessage[] = [];

  createShortcutPrompt = false;
  products: string[] = [];
  selectedProduct: string = '';
  isAddShortcutPrompt = false;
  createdPrompt: string = "";
  isDeletePrompt =false;
  selectedPrompt: any = null;
  @ViewChild('promptInput') promptInput!: ElementRef<HTMLInputElement>;

  constructor(private userService: UserService, private apiService: ApiService, private chatService: ChatService, private sanitizer: DomSanitizer, private onboardingService: OnboardingService){}

  ngOnInit() {
    this.products = this.onboardingService.getProductList()
    this.selectedProduct = this.onboardingService.getSelectedProduct();
    // selected question from chat history
  
    if(this.chatService.getNewChatHistory()){
      this.createShortcutPrompt = true;
    }
    this.chatService.click$.subscribe(() => {
      this.getChat(this.chatService.getChatId());
      this.createShortcutPrompt = true;
      // this.getChat(this.chatService.getChatId());
    });
    // start new chat on clicking the Start New Chat button
    this.chatService.startNewChatClick$.subscribe(() => {
      this.sources = [];
      this.messages = [];
      this.createSessionId(this.userService.getUserId());
      this.createShortcutPrompt = false;
    });
  }

  isProductDropdownOpen = false;
  toggleProductDropdown() {
    this.isProductDropdownOpen = !this.isProductDropdownOpen;
  }
  selectProduct(product: string) {
    this.selectedProduct = product;
    this.isProductDropdownOpen = false;
  }
  // post a question and get answer using api call
  askQuestion(askedQuestion : string ) {
    const question = askedQuestion.trim();
    if (!question) return;
    this.postChat(question);
    this.askedQuestion = ''; 
    this.createShortcutPrompt = true;
  }
  // Chat Stream
  postChat(askedQuestion: string) {
    console.log("this.userService.getUserId(): ", this.userService.getUserId())
    const payload = {
      app_id: this.app_id,
      session_id: this.sessionId,
      user_id: this.userId,
      // user_id: this.userService.getUserId(),
      question: askedQuestion, 
      model_name: this.model_name,
      top_k: this.top_k,
      use_cache: true
    };
    this.messages.push({ sender: 'user', text: askedQuestion });
    this.messages.push({
      sender: 'bot',
      text: '<em>...</em>', 
      loading: true
    });

    this.apiService.post<any>('chat_stream', payload, 'text').subscribe({
      next: async (data) => {
        console.log("api post data mz:", data);
        const extractAnswer = extractAnswerText(data);
        const safeAnswer = await convertMarkdown(extractAnswer, this.sanitizer);

        let answerSource: AnswerSource[] = extractSources(data); 
        // Remove the loading message
        this.messages = this.messages.filter(msg => !msg.loading);
        // Push the actual bot message
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
 
  // shortcut Prompt
  promptShortcuts = [
    { source: "Suggested by AI", 
      question: "What are the differences between the latest and older release notes?", 
    },
    { source: "Suggested by AI", 
      question: "Create a step-by-step guide on configuring ACI Payment Hub based on client-specific needs", 
    },
    { source: "Based on your Activity", 
      question: "Generate an API customization guide for ACI Payment Hub", 
    },
    { source: "Recommended based on your Activity", 
      question: "Generate a guide on configuring custom dashboards and reports for Connetic High value Payments", 
    },
    { source: "Frequently searched by you", 
      question: "Generate a guide on configuring custom dashboards and reports for Connetic High value Payments", 
    },
  ];
  promptsLibrarylist = [
    { prompt: "Generate an API customization guide for ACI Payment Hub", 
    },
    { prompt: "What are the differences between the latest and older release notes?", 
    },
    { prompt: "Explain updates from the latest Release Notes", 
    },
    { prompt: "Generate a guide on configuring custom dashboards and reports for Connetic High value Payments", 
    },
    { prompt: "Generate an API customization guide for ACI Payment Hub", 
    },
    { prompt: "What are the differences between the latest and older release notes?", 
    },
    { prompt: "Explain updates from the latest Release Notes", 
    },
    { prompt: "Generate a guide on configuring custom dashboards and reports for Connetic High value Payments", 
    },
    { prompt: "What are the differences between the latest and older release notes?", 
    },
    { prompt: "Explain updates from the latest Release Notes", 
    },
    { prompt: "Generate a guide on configuring custom dashboards and reports for Connetic High value Payments", 
    },
  ]
  isPromptsLibraryModelOpen = false
  closePromptsLibraryModel(){
    this.isPromptsLibraryModelOpen = false;
  }
  openPromptsLibraryModel(){
    this.isPromptsLibraryModelOpen = true;
  }
  
  // createdPrompt = '';
  addShortcutPrompt(){
    this.isAddShortcutPrompt = true;
    setTimeout(() => {
      this.promptInput?.nativeElement.focus();
    }, 0);
  }
  saveShortcutPrompt(){
    this.isAddShortcutPrompt = false;
    this.promptShortcuts.push({
      source: "Created by you",
      question: this.createdPrompt
    })
    this.createdPrompt = "";
  }
  openDeletePrompt(item: any){
    this.selectedPrompt = this.selectedPrompt === item ? null : item;
  }
  showDeletePrompt(item: any) {
    this.selectedPrompt = this.selectedPrompt === item ? null : item;
  }
  deletePrompt(promptToDelete: any){
    this.promptShortcuts = this.promptShortcuts.filter(prompt => prompt !== promptToDelete);
    this.selectedPrompt = null; 
  }
}
