import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ViewComponent } from './components/view/view.component';
import { AppConfigService } from 'src/app/services/app-config.service';

const routes: Routes = [
  {
    path: 'add-user',
    component: AddUserComponent
  }
];

if (AppConfigService.settings.userList.enabled) {
  console.log('User management module is ENABLED');
  routes.push(
    {
      path: '',
      component: HomePage
    },
    {
      path: 'manage',
      component: ManageUsersComponent
    },
    {
      path: 'view/:id',
      component: ViewComponent
    }
  );
} else {
  console.log('User management module is DISABLED');
  routes.push({
    path: '',
    component: AddUserComponent
  });
}

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
