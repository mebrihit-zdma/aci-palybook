// keycloak.config.ts
import { environment } from '../environments/environment';

export const keycloakConfig = {
  config: {
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId,
  },
  initOptions: {
    onLoad: 'login-required',
    checkLoginIframe: false,
  },
};