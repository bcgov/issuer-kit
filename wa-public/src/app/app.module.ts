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
import { IssuePreviewComponent } from './components/issue-preview/issue-preview.component';
import { CardListItemComponent } from './components/card-list-item/card-list-item.component';
import { TrackComponent } from './pages/track/track.component';
import { MatListModule } from '@angular/material/list';
import { RequestTokenComponent } from './components/request-token/request-token.component';
import { AcceptDisclaimerComponent } from './components/accept-disclaimer/accept-disclaimer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CompletedComponent } from './pages/completed/completed.component';

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
  ReactiveFormsModule,
  MatListModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatInputModule,
];

const components = [
  CardToolbarComponent,
  ViewWrapperComponent,
  CredentialIssuanceComponent,
  HomeComponent,
  SuccessComponent,
  PageNotFoundComponent,
  InputComponent,
  IssuePreviewComponent,
  CardListItemComponent,
  TrackComponent,
  RequestTokenComponent,
  AcceptDisclaimerComponent,
  CompletedComponent
];

@NgModule({
  declarations: [[...components], AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    KeycloakAngularModule,
    MatNativeDateModule,
    [...matModules],
    IonicModule.forRoot(),
  ],
  providers: [
    {
      provide: KeycloakService,
      useValue: keycloakService,
    },
  ],
  entryComponents: [AppComponent],
})
export class AppModule {
  ngDoBootstrap(app) {
    // Import app configuration from JSON
    Axios.get('/appconfig').then(response => {
      console.log(`Loaded configuration from ${response.config.url}`);
      const config = response.data;
      keycloakService
        .init({
          config: {
            url: config.keycloak.url,
            realm: config.keycloak.realm,
            clientId: config.keycloak.clientId,
          },
          initOptions: {
            onLoad: 'check-sso',
            checkLoginIframe: false,
          },
          // `/^\/validate\?invite_token=*([^\n\r]*)/gim`
          bearerExcludedUrls: [
            '/assets', 
          '/validate', 
          '/accept', 
          '/renew', '/request', 
          '/completed', 
          '/logout',
          'https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/AutoComplete/v1.00/json3.ws'
        ],
        })
        .then(() => {
          console.log('[ngDoBootstrap] bootstrap app');

          app.bootstrap(AppComponent);
        })
        .catch(error => console.error('[ngDoBootstrap] init Keycloak failed', error));
    });
  }
}
