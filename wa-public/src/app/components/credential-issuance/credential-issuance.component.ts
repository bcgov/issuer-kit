import { Component, OnInit, AfterViewInit } from '@angular/core';

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

        <li id="awaiting-credential-request">
          <h2>
            Waiting for you to accept the credential offer...
            <ng-template [ngIf]="step === 1">
              <mat-spinner class="inline-spinner" diameter="24"></mat-spinner>
            </ng-template>
            <ng-template [ngIf]="step > 1"
              ><i class="material-icons issuing-step-success"
                >check_circle_outline</i
              ></ng-template
            >
          </h2>
        </li>

        <ng-template [ngIf]="step > 1">
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
export class CredentialIssuanceComponent implements OnInit, AfterViewInit {
  step: number;
  progressValue: number;
  private stateProgressMapping = {
    connected: {
      state: 'connected',
      progressValue: 33
    },
    offered: {
      state: 'credential-offered',
      progressValue: 66
    },
    issued: {
      state: 'credential-issued',
      progressValue: 100
    }
  };

  constructor() {}

  ngOnInit() {
    this.progressValue = this.stateProgressMapping.connected.progressValue;
    this.step = 1;
  }

  ngAfterViewInit() {
    // TODO: @SH - do stuff to subscribe and update the state to display the progress
    /**
     * We need to subsctribe to something coming from the API that will reflect the state
     * of the credential issuance and use it to show/hide the new elements.
     */
  }
}
