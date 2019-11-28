import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { startWith, switchMap } from 'rxjs/operators';
import { interval } from 'rxjs/internal/observable/interval';
import { StateService } from 'src/app/services/state.service';
import { Observable, of, Subscription } from 'rxjs';
import { ActionService } from 'src/app/services/action.service';

@Component({
  selector: 'wap-credential-issuance',
  template: `
    <div class="content">
      <h2>Issuing Identity Credential</h2>
      <ng-container>
        <mat-progress-bar
          *ngIf="step !== 3"
          mode="indeterminate"
          value="{{ progressValue }}"
        ></mat-progress-bar>
        <mat-progress-bar
          *ngIf="step === 3"
          mode="determinate"
          value="100"
        ></mat-progress-bar>
      </ng-container>
      <mat-list id="issuing-steps">
        <!-- Connection formed -->
        <mat-list-item>
          <mat-icon mat-list-icon class="material-icons issuing-step-success"
            >check_circle_outline</mat-icon
          >
          <h3 mat-line>
            Connection Formed
          </h3>

          <p mat-line *ngIf="$user | async as firstName">
            {{ firstName }} you now have a connection with the Identity Kit
            agent.
          </p>
        </mat-list-item>
        <mat-list-item>
          <mat-icon mat-list-icon *ngIf="step === 2">
            <mat-spinner class="inline-spinner" diameter="24"></mat-spinner>
          </mat-icon>
          <mat-icon
            *ngIf="step > 2"
            mat-list-icon
            class="material-icons issuing-step-success"
          >
            check_circle_outline</mat-icon
          >
          <h3 mat-line>
            Waiting for you to accept the credential offer...
          </h3>
        </mat-list-item>

        <ng-template [ngIf]="step > 2">
          <!-- Credential Issued -->
          <mat-list-item>
            <mat-icon mat-list-icon class="material-icons issuing-step-success"
              >check_circle_outline</mat-icon
            >

            <h3 mat-line>
              Credential Issued
            </h3>
            <p mat-line>
              Your Identity Kit credential has been issued.
            </p>
          </mat-list-item>
        </ng-template>
      </mat-list>
      <mat-card *ngIf="step === 3">
        <mat-card-header>
          <mat-card-title>Credential Issued</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>
            Congratulations! Your credential has been issued. You will receive a
            notification to store the credential in your wallet.
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./credential-issuance.component.scss']
})
export class CredentialIssuanceComponent implements OnInit, OnDestroy {
  @Input() credExId: string;
  $user: Observable<string>;
  step: number;
  progressValue: number;
  subs: Subscription[] = []
  private stateProgressMapping = {
    connected: {
      state: 'connected',
      step: 1
    },
    offer_sent: {
      state: 'offer_sent',
      step: 2
    },
    credential_issued: {
      state: 'stored',
      step: 3
    }
  };

  constructor(private http: HttpClient, private stateSvc: StateService, private actionSvc: ActionService) {}

  private transactionStateURL: string;

  ngOnInit() {
     // TODO @SH: set the current connection id
    // this.transactionStateURL = `/api/state/${this.credExId}`;
    this.step = 2;
    this.subs.push(interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.actionSvc.getCredentialById(this.credExId)) // TODO: @SH replace with this.transactionStateURL
      )
      .subscribe(res => {
        console.log(res)
        if (!res) return
        this.updateProgress(res.issued)
      }));
    // setTimeout(() => (this.step = 3), 20000);
    const user = this.stateSvc.user;
    if (user) this.$user = of(`${user.firstName}`);
  }
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  updateProgress(issued: boolean) {
    if (issued) this.step = 3;
  }
}
