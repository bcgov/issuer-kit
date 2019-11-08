import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SharedModule } from './shared/shared/shared.module';

@NgModule({
  declarations: [AppComponent, LoginFormComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot({
      mode: 'ios',
      animated: true
    }),
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
