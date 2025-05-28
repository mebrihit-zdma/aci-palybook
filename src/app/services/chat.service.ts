import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }
  private newChatHistory: boolean = false;
  private chatId: string = '';

  setNewChatHistory(newChatHistory: boolean) {
    this.newChatHistory = newChatHistory;
  }

  getNewChatHistory(): boolean {
    return this.newChatHistory;
  }

  setChatId(chatId: string) {
    this.chatId = chatId;
  }

  getChatId(): string {
    return this.chatId;
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
}
