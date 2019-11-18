import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { startWith, switchMap } from 'rxjs/operators';
import { interval } from 'rxjs/internal/observable/interval';

@Component({
  selector: 'wap-credential-issuance',
  template: `
    <h1>Issuing Identity Credential</h1>
    <ng-container>
      <mat-progress-bar
        mode="determinate"
        value="{{ progressValue }}"
      ></mat-progress-bar>
    </ng-container>
    <ng-container class="issuing-steps">
      <ul style="list-style: none;">
        <!-- Connection formed -->
        <li id="connection-formed">
          <h2>
            Connection Formed
            <i class="material-icons issuing-step-success"
              >check_circle_outline</i
            >
          </h2>
          <p>
            You now have a connection with the Identity Kit agent.
          </p>
        </li>

        <li id="awaiting-credential-offer">
          <h2>
            Waiting for you to accept the credential offer...
            <ng-template [ngIf]="step === 2">
              <mat-spinner class="inline-spinner" diameter="24"></mat-spinner>
            </ng-template>
            <ng-template [ngIf]="step > 2"
              ><i class="material-icons issuing-step-success"
                >check_circle_outline</i
              ></ng-template
            >
          </h2>
        </li>

        <ng-template [ngIf]="step > 2">
          <!-- Credential Issued -->
          <li id="credential-issued">
            <h2>
              Credential Issued
              <i class="material-icons issuing-step-success"
                >check_circle_outline</i
              >
            </h2>
            <p>
              Congratulations! Your Identity Kit credential has been issued. You
              should receive a notification to store the credential in your
              wallet.
            </p>
          </li>
        </ng-template>
      </ul>
    </ng-container>
  `,
  styleUrls: ['./credential-issuance.component.scss']
})
export class CredentialIssuanceComponent implements OnInit {
  step: number;
  progressValue: number;
  private stateProgressMapping = {
    connected: {
      state: 'connected',
      progressValue: 33,
      step: 1
    },
    offer_sent: {
      state: 'offer_sent',
      progressValue: 66,
      step: 2
    },
    credential_issued: {
      state: 'credential_issued',
      progressValue: 100,
      step: 3
    }
  };

  constructor(private http: HttpClient) {}

  private connectionId: string;
  private transactionStateURL: string;

  ngOnInit() {
    this.connectionId = '123-456-789'; // TODO @SH: set the current connection id
    this.transactionStateURL = `/api/state/${this.connectionId}`;
    this.progressValue = this.stateProgressMapping.connected.progressValue;
    this.step = 1;

    interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.http.get('/assets/data/appConfig.json')) // TODO: @SH replace with this.transactionStateURL
      )
      .subscribe(res => this.updateProgress(res));
  }

  updateProgress(state: any) {
    // Should look like:
    // {
    //   state: 'offer_sent'
    // }
    const newState = this.stateProgressMapping[state.state];
    if (newState) {
      this.progressValue = newState.progressValue;
      this.step = newState.step;
    }
  }
}
