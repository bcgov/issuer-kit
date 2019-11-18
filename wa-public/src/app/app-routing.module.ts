import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeycloakGuard } from './guards/keycloak.guard';
import { ValidInviteGuard } from './guards/valid-invite.guard';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SuccessComponent } from './pages/success/success.component';

const routes: Routes = [
  {
    path: 'validate',
    component: HomeComponent,
    canActivate: [ValidInviteGuard]
  },
  {
    path: 'success',
    component: SuccessComponent,
    canActivate: [ValidInviteGuard, KeycloakGuard]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
