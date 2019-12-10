import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionService } from 'src/app/services/action.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wap-track',
  template: `
    <ion-header *ngIf="$title | async as title">
      <ion-toolbar color="primary">
        <ion-title> {{ title }}</ion-title>

        <ion-buttons slot="primary">
          <ion-button (click)="logout()">
            <ion-label>Logout</ion-label>
            <ion-icon name="log-out"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="$id | async as credExId" fullscreen>
      <wap-credential-issuance
        [credExId]="credExId"
      ></wap-credential-issuance>
    </ion-content>
  `,
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {
  $title = new BehaviorSubject<string>('Issuing Credential');
  $id = new BehaviorSubject<string>(null);

  constructor(public actionSvc: ActionService, private route: ActivatedRoute) {}

  ngOnInit() {
    const credExId = this.route.snapshot.paramMap.get('id');
    this.$id.next(credExId);
  }
  async logout() {
    await this.actionSvc.logout()
  }
}
