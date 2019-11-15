import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import Axios from 'axios';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { SuccessComponent } from './pages/success/success.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

const keycloakService = new KeycloakService();

@NgModule({
  declarations: [AppComponent,
    HomeComponent,
    SuccessComponent,
    PageNotFoundComponent],
  imports: [BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule, KeycloakAngularModule],
  providers: [
    {
      provide: KeycloakService,
      useValue: keycloakService
    }
  ],
  entryComponents: [AppComponent]
})
export class AppModule {
  ngDoBootstrap(app) {
    // Import app configuration from JSON
    Axios.get('/assets/data/appConfig.json').then(response => {
      console.log(`Loaded configuration from ${response.config.url}`);
      const config = response.data;
      keycloakService
        .init({
          config: {
            url: config.keycloak.url,
            realm: config.keycloak.realm,
            clientId: config.keycloak.clientId
          },
          initOptions: {
            onLoad: 'check-sso',
            checkLoginIframe: false
          },
          bearerExcludedUrls: ['/assets']
        })
        .then(() => {
          console.log('[ngDoBootstrap] bootstrap app');

          app.bootstrap(AppComponent);
        })
        .catch(error =>
          console.error('[ngDoBootstrap] init Keycloak failed', error)
        );
    });
  }
}
