// import { ApplicationConfig, provideZoneChangeDetection, inject, PLATFORM_ID } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';
// import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
// import { provideHttpClient } from '@angular/common/http';
// import {withEnabledBlockingInitialNavigation } from '@angular/router';
// import {withInterceptorsFromDi } from '@angular/common/http';
// import { msalInstanceFactory, msalGuardConfigFactory } from './msal-config';
// import {
//   MSAL_INSTANCE,
//   MSAL_GUARD_CONFIG,
//   MsalService,
//   MsalGuard,
//   MsalBroadcastService
// } from '@azure/msal-angular';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes, withEnabledBlockingInitialNavigation()),
//     provideHttpClient(withInterceptorsFromDi()),
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideClientHydration(withEventReplay()),

//     { provide: MSAL_INSTANCE, useFactory: msalInstanceFactory },
//     { provide: MSAL_GUARD_CONFIG, useFactory: msalGuardConfigFactory },
//     MsalService,
//     MsalGuard,
//     MsalBroadcastService,
//   ],
// };
// app.config.ts
// app.config.ts
import { ApplicationConfig, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),
  ]
};




