import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
import { ActionService } from 'src/app/services/action.service';

@Component({
  selector: 'wap-accept-disclaimer',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Accept Terms</ion-title>
      </ion-toolbar>
    </ion-header>
    <wap-view-wrapper *ngIf="hasId; else noIdHelper">
      <mat-card>
        <mat-card-content>
          <ion-item lines="none">
            <ion-label
              ><ion-text class="ion-text-wrap"
                >DISCLAIMER: lorem ipsum dolor sit amet...</ion-text
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
    <ng-template #noIdHelper>
    <wap-view-wrapper>
      <mat-card>
      <mat-card-title>
       Please re-enter invitation link.
      </mat-card-title>
      <mat-card-content>
        Your session has expired. Please re-enter the link from the POC Invitation email.
      </mat-card-content>
      </mat-card>
    </wap-view-wrapper>
  </ng-template>
  `,
  styleUrls: ['./accept-disclaimer.component.scss']
})
export class AcceptDisclaimerComponent implements OnInit {
  hasId = true;
  accepted = false;
  constructor(private router: Router, private stateSvc: StateService, private route: ActivatedRoute) {}

  async ngOnInit() {
    const token = this.route.snapshot.paramMap.get('id')

    if (!this.stateSvc._id) {
      try {
      const res = await this.stateSvc.isValidToken(token)
      res._id ? this.stateSvc._id = res._id : this.hasId = false
      } catch {
        this.hasId = false;
      }

    }
  }
  submit() {
    this.router.navigate(['/success']);
  }
}
