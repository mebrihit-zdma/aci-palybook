import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { ChatHistory} from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }
  private newChatHistory: boolean = false;
  private sessionId: string = '';
  private isChatButton: boolean = false;

  private newSession:ChatHistory| null = null;

 
  private newSessionSubject = new BehaviorSubject<ChatHistory | null>(null);
  

  setNewSession(session: ChatHistory) {
    this.newSessionSubject.next(session);
  }

  getNewSession$(): Observable<ChatHistory | null> {
    return this.newSessionSubject.asObservable();
  }


  setNewChatHistory(newChatHistory: boolean) {
    this.newChatHistory = newChatHistory;
  }

  getNewChatHistory(): boolean {
    return this.newChatHistory;
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  private sessionDeletedSubject = new Subject<string>();
  sessionDeleted$ = this.sessionDeletedSubject.asObservable();

  setSessionDeleted(sessionDeleted: string) {
    this.sessionDeletedSubject.next(sessionDeleted);
  }

  //click event
  private clickSubject = new Subject<void>();
  click$ = this.clickSubject.asObservable();
  
  emitClick() {
    this.clickSubject.next();
  }

  //start new chat
  private clickNewChat = new Subject<void>();
  startNewChatClick$ = this.clickNewChat.asObservable();

  startNewChatEmitClick() {
    this.clickNewChat.next();
  }

  setIsChatButton(isChatButton: boolean) {
    this.isChatButton = isChatButton;
  }

  getIsChatButton(): boolean {
    return this.isChatButton;
  }
}
