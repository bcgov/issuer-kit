import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserListItemComponent } from './components/user-list-item/user-list-item.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { SuccessComponent } from './components/success/success.component';
import { ViewComponent } from './components/view/view.component';
import { ViewAuditComponent } from './components/view-audit/view-audit.component';
import { AddUserPreviewComponent } from './components/add-user-preview/add-user-preview.component';

@NgModule({
  imports: [CommonModule, FormsModule, HomePageRoutingModule, SharedModule],
  declarations: [
    HomePage,
    AddUserComponent,
    ManageUsersComponent,
    UserListItemComponent,
    AdminPanelComponent,
    UserListComponent,
    SuccessComponent,
    ViewComponent,
    ViewAuditComponent,
    AddUserPreviewComponent
  ]
})
export class HomePageModule {}
