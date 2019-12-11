import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'wap-completed',
  template: `
    <ion-header *ngIf="$title | async as title">
      <ion-toolbar color="primary">
        <ion-title> {{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <wap-view-wrapper>
      <mat-card>
        <mat-card-header>
          <img mat-card-avatar src="assets/VON-Logo.png" alt="VON Network logo" class="header-image" />
          <mat-card-title>
            Congratulations on issuing a credential!
          </mat-card-title>
          <mat-card-subtitle>
            You have completed the Identity Kit Proof of Concept(POC).
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <br />
          <p></p>
          <p>
            To try out your new verified person credential please go to this <a [href]="pocLink">demo site</a>
          </p></mat-card-content
        >
      </mat-card>
    </wap-view-wrapper>
  `,
  styleUrls: ['./completed.component.scss'],
})
export class CompletedComponent implements OnInit {
  $title = of('Identity Kit POC');
  pocLink: string;

  constructor(private stateSvc: StateService) {
    this.pocLink = `https://law-society-demo.pathfinder.gov.bc.ca/`;
  }

  ngOnInit() {}
}
