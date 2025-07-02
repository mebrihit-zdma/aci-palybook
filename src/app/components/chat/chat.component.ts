import { Component, ViewChild, ElementRef} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ChatService } from '../../services/chat.service';
import { OnboardingService } from '../../services/onboarding.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SourceCardComponent } from '../../components/cards/source-card/source-card.component';
import { AnswerSource, ChatMessage, ResponseMessage, ResponseSource, ChatHistory, followUpQuestions } from '../../models/chat.model';
import { extractAnswerText, extractfollowUpQuestions, convertMarkdown, extractSources, extractResponseSources } from '../../utils/chat-utils';
import { UserService } from '../../services/user.service';
import { StreamService } from '../../services/stream.service';




@Component({
  selector: 'app-chat',
  standalone:true,
  imports: [CommonModule, FormsModule, SourceCardComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  app_id = "67daf330d62c5ade928150d1";
  model_name ="azure/gpt-4o";
  top_k = 3;

  userName: string | null = 'User Name';

  userId: any = "8c8cda2b-cda6-41c2-927d-511d40724810-test-chat";
  sessionId: any = "";

  askedQuestion: string = '';
  sources: AnswerSource[] = [];
  messages: ChatMessage[] = [];

  chatMessages: ResponseMessage[] = [];

  createShortcutPrompt = false;
  products: string[] = [];
  selectedProduct: string = '';
  isAddShortcutPrompt = false;
  createdPrompt: string = "";
  isDeletePrompt =false;
  selectedPrompt: any = null;
  createdLibraryPrompt:string = "";
  promptsLibrarySearch:string = "";
  
  showAlert = false;
  alertMessage = '';

  @ViewChild('promptInput') promptInput!: ElementRef<HTMLInputElement>;

  constructor(private userService: UserService, private apiService: ApiService, private chatService: ChatService, private sanitizer: DomSanitizer, private onboardingService: OnboardingService, private streamService: StreamService,  private route: ActivatedRoute, private router: Router){}

  ngOnInit() {
    // if(this.chatService.getIsChatButton()){
    //   this.createSessionId(this.userId);
    // }
    this.createSessionId(this.userId);
    this.userService.userName$.subscribe(name => {
      this.userName = name;
    });

    this.products = this.onboardingService.getProductList()
    this.selectedProduct = this.onboardingService.getSelectedProduct();

    // start new chat on clicking the Start New Chat button
    this.chatService.startNewChatClick$.subscribe(() => {
      this.sources = [];
      this.messages = [];
      this.chatMessages = [];
      this.createSessionId(this.userId);
      this.createShortcutPrompt = false;
    });
    // selected question from chat history
    if(this.chatService.getNewChatHistory()){
      this.createShortcutPrompt = true;
    }
    // load chat by sessionId from chat history
    this.route.params.subscribe(() => {
      this.getChatSession(this.chatService.getSessionId())
    });
    // trigger reload on emitted click on chat history
    this.chatService.click$.subscribe(() => {
      this.getChatSession(this.chatService.getSessionId())
      this.createShortcutPrompt = true;
    });

    this.chatService.sessionDeleted$.subscribe((deletedSessionId) => {
      this.alertMessage = deletedSessionId;
      this.showAlert = true;
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
    this.chatStream(question, this.sessionId); 
    this.askedQuestion = ''; 
    this.createShortcutPrompt = true;
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
  // get session using session id
  getChatSession(session_id: string) {
    this.apiService.get<any>(`get_session/${session_id}`).subscribe({
      next: async (data) => {
        console.log("Chat within a session : ", data.chat_history)
        this.processSessionHistory(data.chat_history);
        this.sessionId = session_id;
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
    console.log('session id userId bf:', userId);
    console.log('session id bf:');
    this.apiService.post<any>('create_session', payload, 'json').subscribe({
      next: async (data) => {
        console.log('session id userId:', userId);
        console.log('session id:', data?.session_id);
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

  addPromptToLibrary(){
    this.promptsLibrarylist.push({
      prompt: this.createdLibraryPrompt
    })
    this.createdLibraryPrompt = "";
  }
  
  get filteredPrompts() {
    const query = this.promptsLibrarySearch?.toLowerCase().trim();
    if (!query) return this.promptsLibrarylist;
    return this.promptsLibrarylist.filter(p =>
      p.prompt.toLowerCase().includes(query)
    );
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

  deleteLibraryPrompt(itemToDelete: { prompt: string }) {
    this.promptsLibrarylist = this.promptsLibrarylist.filter(
      item => item !== itemToDelete
    );
  }
  selectedPromptLibrary(prompt: string ){
    this.chatStream(prompt, this.sessionId);
    this.createShortcutPrompt = true;
    this.isPromptsLibraryModelOpen = false;
  }
  selectedShortcutPrompt(prompt: string ){
    this.chatStream(prompt, this.sessionId);
    this.isPromptsLibraryModelOpen = false;
    this.promptsLibrarySearch = "";
  }
  
  chatResponse = '';

  // Chat Stream
  chatStream(askedQuestion: string, sessionId: string) {
    this.chatResponse = '';
    const question = askedQuestion;
  
    const payload = {
      user_id: this.userId,
      session_id: sessionId,
      question,
      app_id: this.app_id,
      model_name: this.model_name,
      top_k: this.top_k,
      use_cache: true
    };
  
    this.chatMessages.push({ sender: 'user', text: askedQuestion });
    this.chatMessages.push({ sender: 'bot', text: '<em>...</em>', loading: true });
    
    this.streamService.streamChatResponse(
      payload,
      chunk => this.chatResponse += chunk,
      async () => {
        console.log("Response: ", this.chatResponse)
        const extractAnswer = extractAnswerText(this.chatResponse);
        const safeAnswer = await convertMarkdown(extractAnswer, this.sanitizer);

        const followUpRaw = extractfollowUpQuestions(this.chatResponse);
        // const safeFollowUpQuestions = followUpRaw
        //   ? await convertMarkdown(followUpRaw, this.sanitizer)
        //   : '';

          const extractedQuestions: string[] = followUpRaw
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^- /, '').trim());
        
        let sources: ResponseSource[] = [];

        sources = extractResponseSources(this.chatResponse);
        
        console.log("sources: ", sources); 
        this.chatMessages = this.chatMessages.filter(msg => !msg.loading);
        this.chatMessages.push({ 
          sender: 'bot', 
          text: safeAnswer,
          follow_up: extractedQuestions,
          sources: sources
        });

        const newSession:ChatHistory = {
          question: askedQuestion,
          sessionId: sessionId
        };
        this.chatService.setNewSession(newSession)
      },
      err => {
        console.error('Stream error:', err);
      }
    );
  }

  private async processSessionHistory(chatHistory: any[]) {

    const history: any[] = [];

    for (const data of chatHistory) {
      if (data?.chat?.question) {
        history.push({
          sender: 'user',
          text: data.chat.question
        });
      }

      if (data?.chat?.answer) {
        const extractAnswer = extractAnswerText(data.chat.answer);
        const safeAnswer = await convertMarkdown(extractAnswer, this.sanitizer)
        ;
        const followUpRaw = extractfollowUpQuestions(this.chatResponse);
        const safeFollowUpQuestions = followUpRaw
          ? await convertMarkdown(followUpRaw, this.sanitizer)
          : '';

        const sources = extractResponseSources(data.chat.answer);

        history.push({
          sender: 'bot',
          text: safeAnswer,
          follow_up_questions: safeFollowUpQuestions,
          sources: sources
        });
      }
    }

    this.chatMessages = [...history];
  }
  handleFollowUp(followUpQuestion: string) {
    console.log("Follow-up clicked:", followUpQuestion);
    this.chatStream(followUpQuestion, this.sessionId); 
  }
}
