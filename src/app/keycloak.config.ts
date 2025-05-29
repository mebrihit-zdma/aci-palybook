// keycloak.config.ts
import { KeycloakOptions } from 'keycloak-angular';

export const keycloakConfig: KeycloakOptions = {
  config: {
    url: 'http://localhost:8080',
    realm: 'aci-playbook',
    clientId: 'cx-aci-playbook',
  },
  initOptions: {
    onLoad: 'login-required',
    checkLoginIframe: false,
  },
};
