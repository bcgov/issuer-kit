import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicModule } from "@ionic/angular";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { SharedModule } from "./shared/shared/shared.module";

const keycloakService = new KeycloakService();

@NgModule({
  declarations: [AppComponent, LoginFormComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot({
      mode: "ios",
      animated: true
    }),
    SharedModule,
    HttpClientModule,
    KeycloakAngularModule
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
    keycloakService
      .init({
        config: {
          url: "http://localhost:8180/auth",
          realm: "identity-kit",
          clientId: "identity-kit-admin"
        },
        initOptions: {
          onLoad: "check-sso",
          checkLoginIframe: false
        },
        bearerExcludedUrls: ["/assets"]
      })
      .then(() => {
        console.log("[ngDoBootstrap] bootstrap app");

        app.bootstrap(AppComponent);
      })
      .catch(error =>
        console.error("[ngDoBootstrap] init Keycloak failed", error)
      );
  }
}
