// src/app/keycloak.guard.ts
import { createAuthGuard } from 'keycloak-angular';

export const authGuard = createAuthGuard(async () => {
  return true; // or put your custom logic here
});
