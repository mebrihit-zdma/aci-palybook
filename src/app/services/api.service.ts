import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  createUserSettingsUrl = `${environment.apiBaseUrl}/api/v1/create_user_settings`;
  getUserSettingsUrl = `${environment.apiBaseUrl}/api/v1/org_settings`;
  chatIdUrl = `${environment.apiBaseUrl}/api/v1/get_chat`;
  baseUrl = `${environment.apiBaseUrl}/api/v1`;
  // documentation
  documentationUrl = `${environment.documentationUrl}/api/v1/generated-documents`;
  templatesUrl = `${environment.documentationUrl}/api/v1/documentation-types`;

  // constructor
  constructor(private http: HttpClient) {}
  // create user setting
  createUserSetting(payload: any) {
    return this.http.post(this.createUserSettingsUrl, payload);
  }
  getUserSettings<T>(userId: any): Observable<T> {
    return this.http.get<T>(`${this.getUserSettingsUrl}/${userId}`);
  }
  generateDocumentation(payload: FormData) {
    return this.http.post(this.documentationUrl, payload, {
    });
  }
  getDocumentationHistory() {
    return this.http.get(this.documentationUrl);
  }
  getTemplates() {
    return this.http.get(this.templatesUrl);
  }
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
