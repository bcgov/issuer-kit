import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CanActivateGuard } from './guards/can-activate.guard';

import prefix from './app.constants';
import { HomePage } from './pages/home/home.page';

const routes: Routes = [
  {
    path: prefix.login.path,
    component: LoginFormComponent,
    pathMatch: 'full'
  },
  {
    path: prefix.home.path,
    canActivate: [CanActivateGuard],
    data: { roles: ['wa-admin'] },
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    // canActivate: [CanActivateGuard],
    data: { roles: ['wa-admin'] },
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
