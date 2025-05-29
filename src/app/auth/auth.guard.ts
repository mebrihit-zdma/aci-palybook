// // auth.guard.ts
// import { inject } from '@angular/core';
// import { createAuthGuard } from 'keycloak-angular';

// export const authGuard = createAuthGuard(() => {
//   const keycloak = inject(KeycloakAngularModule).getKeycloakInstance();
//   return {
//     isAccessAllowed: async () => keycloak.authenticated ?? false,
//   };
// });
