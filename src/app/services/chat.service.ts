import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }
  private newChatHistory: boolean = false;
  private sessionId: string = '';

  private isChatButton: boolean = false;

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
