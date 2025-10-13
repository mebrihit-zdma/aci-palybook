import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-token-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="token-example">
      <h3>Keycloak Token Example</h3>
      
      <div class="token-info">
        <h4>Authentication Status</h4>
        <p>Is Authenticated: {{ isAuthenticated ? 'Yes' : 'No' }}</p>
        
        <h4>Token Information</h4>
        <div class="token-display">
          <label>Access Token:</label>
          <textarea 
            readonly 
            [value]="accessToken || 'No token available'"
            rows="4"
            cols="80">
          </textarea>
        </div>
        
        <div class="token-actions">
          <button (click)="getToken()" [disabled]="!isAuthenticated">
            Get Token
          </button>
          <button (click)="refreshToken()" [disabled]="!isAuthenticated">
            Refresh Token
          </button>
          <button (click)="testApiCall()" [disabled]="!isAuthenticated">
            Test API Call
          </button>
        </div>
        
        <div class="api-response" *ngIf="apiResponse">
          <h4>API Response:</h4>
          <pre>{{ apiResponse | json }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .token-example {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .token-info {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    
    .token-display {
      margin: 15px 0;
    }
    
    .token-display label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .token-display textarea {
      width: 100%;
      font-family: monospace;
      font-size: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
    }
    
    .token-actions {
      margin: 20px 0;
    }
    
    .token-actions button {
      margin-right: 10px;
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .token-actions button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .api-response {
      margin-top: 20px;
      padding: 15px;
      background: #e9ecef;
      border-radius: 4px;
    }
    
    .api-response pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  `]
})
export class TokenExampleComponent implements OnInit {
  isAuthenticated = false;
  accessToken: string | undefined;
  apiResponse: any;

  constructor(
    private userService: UserService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.checkAuthentication();
  }

  async checkAuthentication() {
    this.isAuthenticated = this.userService.isAuthenticated();
  }

  async getToken() {
    try {
      this.accessToken = await this.userService.getAccessToken();
      console.log('Access token retrieved:', this.accessToken);
    } catch (error) {
      console.error('Error getting token:', error);
      this.accessToken = 'Error retrieving token';
    }
  }

  async refreshToken() {
    try {
      const refreshed = await this.userService.refreshToken();
      if (refreshed) {
        console.log('Token refreshed successfully');
        await this.getToken(); // Get the new token
      } else {
        console.log('Token refresh not needed or failed');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }

  async testApiCall() {
    try {
      // Example API call using the authenticated method
      this.apiResponse = await this.apiService.getWithAuth('test-endpoint').toPromise();
      console.log('API call successful:', this.apiResponse);
    } catch (error) {
      console.error('API call failed:', error);
      this.apiResponse = { error: 'API call failed', details: error };
    }
  }
}
