import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import Axios from 'axios';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CredentialIssuanceComponent } from './components/credential-issuance/credential-issuance.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SuccessComponent } from './pages/success/success.component';
import { IonicModule } from '@ionic/angular';
import { HomeComponent } from './home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { ViewWrapperComponent } from './components/view-wrapper/view-wrapper.component';
import { CardToolbarComponent } from './components/card-toolbar/card-toolbar.component';
import { InputComponent } from './components/input/input.component';

const keycloakService = new KeycloakService();

const matModules = [
  MatSidenavModule,
  MatToolbarModule,
  MatCardModule,
  MatIconModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatMenuModule,
  ReactiveFormsModule
];

const components = [
  CardToolbarComponent,
  ViewWrapperComponent,
  CredentialIssuanceComponent,
  HomeComponent,
  SuccessComponent,
  PageNotFoundComponent,
  InputComponent
];

@NgModule({
  declarations: [AppComponent, [...components]],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    KeycloakAngularModule,
    [...matModules],
    IonicModule.forRoot()
  ],
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
