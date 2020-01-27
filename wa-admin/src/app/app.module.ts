import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AppConfigService } from './services/app-config.service';
import { SharedModule } from './shared/shared.module';

const keycloakService = new KeycloakService();

export function initializeApp(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}
@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    SharedModule,
    HttpClientModule,
    KeycloakAngularModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: KeycloakService,
      useValue: keycloakService
    },
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService],
      multi: true
    }
  ],
  entryComponents: [AppComponent]
})
export class AppModule {
  ngDoBootstrap(app) {
    keycloakService
      .init({
        config: {
          url: AppConfigService.settings.keycloak.url,
          realm: AppConfigService.settings.keycloak.realm,
          clientId: AppConfigService.settings.keycloak.clientId
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
  }
}
