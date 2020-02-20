import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'wap-completed',
  template: `
    <wap-header></wap-header>
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
            To try out your new verified person credential please <a [href]="pocLink">click here</a>.
          </p></mat-card-content
        >
      </mat-card>
    </wap-view-wrapper>
  `,
  styleUrls: ['./completed.component.scss'],
})
export class CompletedComponent implements OnInit {
  pocLink: string;

  constructor(private stateSvc: StateService) {
    this.pocLink = AppConfigService.settings.csbAudio.siteUrl;
  }

  ngOnInit() {}
}
