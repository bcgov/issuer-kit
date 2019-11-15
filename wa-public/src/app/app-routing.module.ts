import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SuccessComponent } from './pages/success/success.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'success/:id',
    component: SuccessComponent,
    canActivate: [
      // TODO: @ES - put guard logic here for successful login
    ]
  },
  {
    path: 'validate/:id',
    component: HomeComponent,
    canActivate: [
      // TODO: @ES - put guard logic here for redirect to keycloak, there's a placeholder call to check token validity
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
