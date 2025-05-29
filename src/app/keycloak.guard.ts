
import { createAuthGuard } from 'keycloak-angular';

export const authGuard = createAuthGuard(async () => {
  return true;
});
