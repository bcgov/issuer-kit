import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'add-user',
    component: AddUserComponent
  },
  {
    path: 'manage',
    component: ManageUsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
