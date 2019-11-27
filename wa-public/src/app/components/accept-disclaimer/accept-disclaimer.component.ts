import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wap-accept-disclaimer',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Accept Terms</ion-title>
      </ion-toolbar>
    </ion-header>
    <wap-view-wrapper>
      <mat-card>
        <mat-card-content>
          <ion-item lines="none">
            <ion-label
              ><ion-text class="ion-text-wrap"
                >lorem ipsum dolor sit amet...</ion-text
              ></ion-label
            >
            <ion-checkbox
              slot="start"
              (click)="accepted = !accepted"
            ></ion-checkbox>
          </ion-item>
        </mat-card-content>
        <mat-card-actions>
          <button
            mat-raised-button
            (click)="submit()"
            [disabled]="!accepted"
            color="primary"
          >
            Confirm
          </button>
        </mat-card-actions>
      </mat-card>
    </wap-view-wrapper>
  `,
  styleUrls: ['./accept-disclaimer.component.scss']
})
export class AcceptDisclaimerComponent implements OnInit {
  accepted = false;
  constructor(private router: Router) {}

  ngOnInit() {}
  submit() {
    this.router.navigate(['/success']);
  }
}
