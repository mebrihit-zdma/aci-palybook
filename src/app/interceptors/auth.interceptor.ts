import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding token for Keycloak URLs and public endpoints
    if (this.shouldSkipToken(req.url)) {
      return next.handle(req);
    }

    // Get the token and add it to the request
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    try {
      const token = await this.userService.getValidToken();
      if (token) {
        // Clone the request and add the Authorization header
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(authReq).toPromise() as Promise<HttpEvent<any>>;
      } else {
        // No token available, proceed without it
        console.warn('No token available for request:', req.url);
        return next.handle(req).toPromise() as Promise<HttpEvent<any>>;
      }
    } catch (error) {
      console.error('Error in auth interceptor:', error);
      return next.handle(req).toPromise() as Promise<HttpEvent<any>>;
    }
  }

  private shouldSkipToken(url: string): boolean {
    // Skip token for Keycloak URLs and public endpoints
    const skipPatterns = [
      '/auth/realms/',
      '/protocol/openid-connect/',
      'keycloak',
      'localhost:8080'
    ];
    
    return skipPatterns.some(pattern => url.includes(pattern));
  }
}
