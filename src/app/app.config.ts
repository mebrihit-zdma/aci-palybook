import { ApplicationConfig, provideZoneChangeDetection, inject, PLATFORM_ID } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown'; 
import { importProvidersFrom } from '@angular/core';
//keycloak
import { KeycloakAngularModule, provideKeycloak } from 'keycloak-angular';
import { keycloakConfig } from './keycloak.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),
    provideMarkdown(),
    //keycloak
    importProvidersFrom(KeycloakAngularModule),
    provideKeycloak({
      config: {
        url: 'http://localhost:8080',        
        realm: 'aci-playbook',                
        clientId: 'cx-aci-playbook',          
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
    }),               
  ]
};






