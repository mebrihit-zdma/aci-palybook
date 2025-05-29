
// app.config.ts
import { ApplicationConfig, importProvidersFrom  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

  //keycloak
import { KeycloakAngularModule, provideKeycloak } from 'keycloak-angular';
import { keycloakConfig } from './keycloak.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),

    //keycloak
    importProvidersFrom(KeycloakAngularModule),
    provideKeycloak({
      config: {
        url: 'http://localhost:8080',        // <- Replace with your Keycloak server
        realm: 'aci-playbook',                 // <- Replace with your realm
        clientId: 'cx-aci-playbook',          // <- Replace with your client ID
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
    }),
  ]
};




