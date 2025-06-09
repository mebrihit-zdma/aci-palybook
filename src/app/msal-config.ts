import { PublicClientApplication,InteractionType} from '@azure/msal-browser';
import { MsalGuardConfiguration} from '@azure/msal-angular';

export function msalInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      authority: 'https://login.microsoftonline.com/45488ed5-ce1d-4d00-87d2-144f056d15d3',
      redirectUri: 'http://localhost:4200',
      clientId: '9298e23f-f951-4164-ad53-92347706120b',
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
