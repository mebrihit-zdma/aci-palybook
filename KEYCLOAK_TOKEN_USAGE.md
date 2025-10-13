# Keycloak Token Usage Guide

This guide explains how to use the Keycloak authentication token in your Angular application.

## Overview

The application now includes comprehensive token management functionality that allows you to:
- Get access tokens from Keycloak
- Automatically refresh tokens when needed
- Add tokens to HTTP requests automatically
- Make authenticated API calls

## Key Components

### 1. UserService (`src/app/services/user.service.ts`)

The `UserService` now includes several token-related methods:

#### Token Retrieval Methods

```typescript
// Get the current access token
async getAccessToken(): Promise<string | undefined>

// Get the refresh token (Note: keycloak-angular handles this internally)
getRefreshToken(): string | undefined

// Get token with automatic refresh
async getValidToken(): Promise<string | undefined>
```

#### Authentication Methods

```typescript
// Check if user is authenticated
isAuthenticated(): boolean

// Refresh the access token
async refreshToken(): Promise<boolean>

// Logout the user
async logout(): Promise<void>
```

### 2. HTTP Interceptor (`src/app/interceptors/auth.interceptor.ts`)

The `AuthInterceptor` automatically adds the Bearer token to all HTTP requests (except Keycloak URLs).

### 3. Enhanced ApiService (`src/app/services/api.service.ts`)

The `ApiService` now includes token-aware methods:

```typescript
// Get the current token
async getToken(): Promise<string | undefined>

// Create authenticated headers
async getAuthHeaders(): Promise<HttpHeaders>

// Authenticated HTTP methods
getWithAuth<T>(endpoint: string): Observable<T>
postWithAuth<T>(endpoint: string, data: any): Observable<T>
putWithAuth<T>(endpoint: string, data: any): Observable<T>
deleteWithAuth<T>(endpoint: string): Observable<T>

// Check authentication status
isAuthenticated(): boolean
```

## Usage Examples

### 1. Getting a Token in a Component

```typescript
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  // ... component configuration
})
export class MyComponent implements OnInit {
  constructor(private userService: UserService) {}

  async ngOnInit() {
    // Check if user is authenticated
    if (this.userService.isAuthenticated()) {
      // Get the access token
      const token = await this.userService.getAccessToken();
      console.log('Access token:', token);
    }
  }
}
```

### 2. Making Authenticated API Calls

```typescript
import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  // ... component configuration
})
export class MyComponent {
  constructor(private apiService: ApiService) {}

  async makeApiCall() {
    try {
      // Using the token-aware method
      const data = await this.apiService.getWithAuth('my-endpoint').toPromise();
      console.log('API response:', data);
    } catch (error) {
      console.error('API call failed:', error);
    }
  }
}
```

### 3. Manual Token Management

```typescript
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  // ... component configuration
})
export class MyComponent {
  constructor(private userService: UserService) {}

  async handleTokenOperations() {
    // Get current token
    const token = await this.userService.getAccessToken();
    
    // Refresh token if needed
    const refreshed = await this.userService.refreshToken();
    
    // Get valid token (with automatic refresh)
    const validToken = await this.userService.getValidToken();
    
    // Logout
    await this.userService.logout();
  }
}
```

### 4. Using the Token Example Component

A complete example component is available at `src/app/components/token-example/token-example.component.ts` that demonstrates:
- Getting tokens
- Refreshing tokens
- Making authenticated API calls
- Displaying token information

To use this component, add it to your routes or include it in another component.

## Automatic Token Handling

### HTTP Interceptor

The `AuthInterceptor` automatically:
- Adds the Bearer token to all HTTP requests
- Skips token addition for Keycloak URLs
- Handles token refresh when needed

### Token Refresh

Tokens are automatically refreshed when:
- The token expires within 30 seconds
- You call `getValidToken()` method
- The HTTP interceptor detects an expired token

## Configuration

### Environment Configuration

Make sure your Keycloak configuration in `src/environments/environment.ts` is correct:

```typescript
export const environment = {
  // ... other config
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'aci-playbook',
    clientId: 'cx-aci-playbook'
  }
};
```

### App Configuration

The HTTP interceptor is automatically configured in `src/app/app.config.ts`:

```typescript
{
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
}
```

## Best Practices

1. **Use the HTTP Interceptor**: Let the interceptor handle token addition automatically
2. **Use Token-Aware Methods**: Use `getWithAuth()`, `postWithAuth()`, etc. for authenticated requests
3. **Handle Errors**: Always wrap token operations in try-catch blocks
4. **Check Authentication**: Use `isAuthenticated()` before making token-dependent operations
5. **Use getValidToken()**: This method ensures you get a valid token with automatic refresh

## Troubleshooting

### Common Issues

1. **Token is undefined**: Check if user is authenticated with `isAuthenticated()`
2. **API calls fail**: Ensure the backend expects Bearer tokens in the Authorization header
3. **Token refresh fails**: Check Keycloak configuration and network connectivity
4. **Refresh token access**: The keycloak-angular library handles refresh tokens internally and doesn't expose them directly for security reasons

### Debug Information

Enable console logging to see token operations:
- Token retrieval attempts
- Token refresh operations
- API call authentication

## Security Notes

- Tokens are stored securely by the Keycloak library
- Never log or expose tokens in production
- The interceptor skips token addition for Keycloak URLs to prevent conflicts
- Tokens are automatically refreshed to maintain security
