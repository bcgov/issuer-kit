import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { StateService } from 'src/app/services/state.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ActionService } from 'src/app/services/action.service';
import { Router } from '@angular/router';

@Component({
  selector: 'waa-home',
  template: `
    <!--
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding fullscreen>
      <ion-toolbar>
        <ion-buttons slot="secondary">
          <ion-button (click)="addUser()" slot="start">
            <ion-icon name="add"></ion-icon>
            <ion-label>Add User</ion-label>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-content>
    -->
    <waa-manage-users> </waa-manage-users>
  `,
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  title = 'Manage';
  constructor(
    private httpSvc: HttpService,
    private stateSvc: StateService,
    private loadingSvc: LoadingService,
    private actionSvc: ActionService,
    private router: Router
  ) {}

  ngOnInit() {}

  addUser() {
    this.router.navigate(['/home/add-user']);
  }
}
