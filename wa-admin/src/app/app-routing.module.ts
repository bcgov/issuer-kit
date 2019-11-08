import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CanActivateGuard } from './guards/can-activate.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginFormComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  },
  {
    path: 'home',
    redirectTo: 'home',
    canActivate: [CanActivateGuard],
    canActivateChild: [CanActivateGuard]
    // loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
