import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddUserPreviewComponent } from './components/add-user-preview/add-user-preview.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { SuccessComponent } from './components/success/success.component';
import { UserListItemComponent } from './components/user-list-item/user-list-item.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ViewComponent } from './components/view/view.component';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  imports: [CommonModule, FormsModule, HomePageRoutingModule, SharedModule],
  declarations: [
    HomePage,
    AddUserComponent,
    ManageUsersComponent,
    UserListItemComponent,
    UserListComponent,
    SuccessComponent,
    ViewComponent,
    AddUserPreviewComponent
  ]
})
export class HomePageModule {}
