import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchChatService {

  // private searchValue: string = '';
  // constructor() { }

  // setSearchValue(searchValue: string) {
  //   this.searchValue = searchValue;
  // }

  // getSearchValue(): string {
  //   return this.searchValue;
  // }

  private searchValueSubject = new BehaviorSubject<string>('');
  searchValue$ = this.searchValueSubject.asObservable();

  setSearchValue(value: string) {
    this.searchValueSubject.next(value);
  }
}
