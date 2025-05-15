import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  private chatId: string = '';

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
