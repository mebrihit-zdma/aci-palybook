// keycloak.config.ts
import { environment } from '../environments/environment';
import { KeycloakOnLoad } from 'keycloak-js';

export const keycloakConfig = {
  config: {
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId,
  },
  initOptions: {
    onLoad: 'login-required' as KeycloakOnLoad,
    checkLoginIframe: false,
  },
};