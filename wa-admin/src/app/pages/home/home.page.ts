import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { StateService } from 'src/app/services/state.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ActionService } from 'src/app/services/action.service';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'waa-home',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="secondary">
          <ion-button>
            <ion-label>Logout</ion-label>
            <ion-icon name="log-out"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding fullscreen color="light">
      <ion-toolbar color="secondary">
        <ion-buttons slot="secondary">
          <ion-button
            (click)="router.navigate(['/home/add-user'])"
            slot="start"
          >
            <mat-icon slot="icon-only">person_add</mat-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button
            (click)="action()"
            slot="start"
            [matMenuTriggerFor]="menu"
          >
            <mat-icon slot="icon-only">more_vert</mat-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <waa-manage-users> </waa-manage-users>
    </ion-content>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="changeAction('active')">
        Disable/Enable Access
      </button>
      <button (click)="changeAction('clear')">Clear Selections</button>
    </mat-menu>
  `,
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  title = 'Manage';

  // actions = {
  //   clear: this.actionSvc.applyAction('clear'),
  //   active: this.changeAction('active')
  // };

  get icon() {
    return this.stateSvc.changeRecords.size > 0 ? 'more_vert' : 'person_add';
  }
  constructor(
    private httpSvc: HttpService,
    private stateSvc: StateService,
    private loadingSvc: LoadingService,
    private actionSvc: ActionService,
    public router: Router,
    public popoverController: PopoverController
  ) {}

  ngOnInit() {}
  action() {
    this.stateSvc.changeRecords.size > 0
      ? this.changeAction('active')
      : this.router.navigate(['/home/add-user']);
  }

  changeAction(action: 'active' = 'active') {
    const records = Array.from(this.stateSvc.changeRecords.values());
    console.log('records', records);
    // this.actionSvc.applyAction(action, records);
  }

  async showPopover(ev: any) {}
  addUser() {}
}
