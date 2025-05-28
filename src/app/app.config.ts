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

import {
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  // MsalService,
  // MsalGuard,
  MsalBroadcastService
} from '@azure/msal-angular';

import { msalInstanceFactory, msalGuardConfigFactory } from './msal-config';
import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),

    {
      provide: MSAL_INSTANCE,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);  // Get platformId
        if (isPlatformBrowser(platformId)) {
          return msalInstanceFactory(platformId);  // Pass platformId to the factory
        } else {
          console.warn('MSAL_INSTANCE not created: running on server');
          return {} as any;  // SSR fallback
        }
      },
      deps: [PLATFORM_ID]  // Add platformId as dependency
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: msalGuardConfigFactory
    },
    // MsalService,
    // MsalGuard,
    MsalBroadcastService
  ]
};




