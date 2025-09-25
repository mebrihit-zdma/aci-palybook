import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { ChatHistory} from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private newChatHistory: boolean = false;
  private sessionId: string = '';
  private isChatButton: boolean = false;
  private newSession:ChatHistory| null = null;
  private newSessionSubject = new BehaviorSubject<ChatHistory | null>(null);
  //start new chat
  private clickNewChat = new Subject<void>();
  startNewChatClick$ = this.clickNewChat.asObservable();
  private sessionDeletedSubject = new Subject<string>();
  sessionDeleted$ = this.sessionDeletedSubject.asObservable();
  //click event
  private clickSubject = new Subject<void>();
  click$ = this.clickSubject.asObservable();

  // constructor
  constructor() { }

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
  setSessionDeleted(sessionDeleted: string) {
    this.sessionDeletedSubject.next(sessionDeleted);
  }
  emitClick() {
    this.clickSubject.next();
  }
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
