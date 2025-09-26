import { PublicClientApplication,InteractionType} from '@azure/msal-browser';
import { MsalGuardConfiguration} from '@azure/msal-angular';
import { environment } from '../environments/environment';

export function msalInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      authority: environment.authority,
      redirectUri: environment.redirectUri,
      clientId: environment.clientId,
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
