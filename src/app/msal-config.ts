// import { PublicClientApplication, IPublicClientApplication} from '@azure/msal-browser';
// import { MsalGuardConfiguration} from '@azure/msal-angular';
// import { InteractionType } from '@azure/msal-browser';

// export function msalInstanceFactory() {
//   return new PublicClientApplication({
//     auth: {
//       clientId: '9298e23f-f951-4164-ad53-92347706120b',
//       authority: 'https://login.microsoftonline.com/45488ed5-ce1d-4d00-87d2-144f056d15d3',
//       redirectUri: 'http://localhost:4200',

//       // clientId: '0071edf4-4545-4797-81ea-c5ef43041030',
//       // authority: 'https://login.microsoftonline.com/45488ed5-ce1d-4d00-87d2-144f056d15d3',
//       // redirectUri: 'https://d15d4x71dime5a.cloudfront.net',
//     },
//     cache: {
//       cacheLocation: 'localStorage',
//       storeAuthStateInCookie: false,
//     },
//   });
// }
// export const msalGuardConfigFactory = (): MsalGuardConfiguration => ({
//   interactionType: InteractionType.Redirect,
//   authRequest: {
//     scopes: ['user.read'],
//   }
// });
// msal-config.ts
import {
  PublicClientApplication,
  BrowserCacheLocation,
  IPublicClientApplication,
  LogLevel,
  Configuration,
  InteractionType
} from '@azure/msal-browser';
import {
  MsalGuardConfiguration,

} from '@azure/msal-angular';
import { isPlatformBrowser } from '@angular/common';

export function msalInstanceFactory(platformId: Object): IPublicClientApplication {
  if (!isPlatformBrowser(platformId)) {
    throw new Error('MSAL should only be initialized in the browser.');
  }

  const config: Configuration = {
    auth: {
      authority: 'https://login.microsoftonline.com/45488ed5-ce1d-4d00-87d2-144f056d15d3',
      clientId: '9298e23f-f951-4164-ad53-92347706120b',
      redirectUri: 'http://localhost:4200',
      // clientId: '0071edf4-4545-4797-81ea-c5ef43041030',
      // redirectUri: 'https://d15d4x71dime5a.cloudfront.net',
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (!containsPii) console.log(`[MSAL] ${level}: ${message}`);
        },
        logLevel: LogLevel.Info,
      },
    },
  };

  return new PublicClientApplication(config);
}

export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect, // ✅ Proper enum
    authRequest: {
      scopes: ['user.read']
    }
  };
}
