import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) {}

  chatIdUrl = `https://aci-playbook-peerai.azurewebsites.net/api/v1/get_chat`;
  baseUrl = `https://aci-playbook-peerai.azurewebsites.net/api/v1`;

  getSelectedQuestion<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.chatIdUrl}/${endpoint}`);
  }
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }
  post<T>(endpoint: string, data: any, responseType: 'json' | 'text' = 'json'): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: responseType as 'json' & 'text' 
    });
  }
  
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}
