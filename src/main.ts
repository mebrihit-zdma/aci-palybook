import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { keycloakConfig } from './app/keycloak.config';
import { KeycloakService } from 'keycloak-angular';

// Initialize Keycloak before bootstrapping the application
const keycloak = new KeycloakService();

keycloak.init(keycloakConfig)
  .then(() => {
    // Keycloak is initialized, now bootstrap the Angular app with the KeycloakService provided
    bootstrapApplication(AppComponent, {
      ...appConfig,
      providers: [
        ...appConfig.providers,
        { provide: KeycloakService, useValue: keycloak }
      ]
    })
      .catch((err) => console.error(err));
  })
  .catch((err) => {
    console.error('Failed to initialize Keycloak', err);
  });
