import { PublicClientApplication, IPublicClientApplication} from '@azure/msal-browser';
import { MsalGuardConfiguration} from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';

export function msalInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: '9298e23f-f951-4164-ad53-92347706120b',
      authority: 'https://login.microsoftonline.com/45488ed5-ce1d-4d00-87d2-144f056d15d3',
      redirectUri: 'http://localhost:4200',

      // clientId: '0071edf4-4545-4797-81ea-c5ef43041030',
      // authority: 'https://login.microsoftonline.com/45488ed5-ce1d-4d00-87d2-144f056d15d3',
      // redirectUri: 'https://d15d4x71dime5a.cloudfront.net',
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  });
}
export const msalGuardConfigFactory = (): MsalGuardConfiguration => ({
  interactionType: InteractionType.Redirect,
  authRequest: {
    scopes: ['user.read'],
  }
});
