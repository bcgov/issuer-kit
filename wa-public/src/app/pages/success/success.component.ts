import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { ActionService } from 'src/app/services/action.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wap-success',
  template: `
    <mat-card class="example-card">
      <mat-card-header>
        <mat-card-title>Success</mat-card-title>
        <mat-card-subtitle>You did it</mat-card-subtitle>
      </mat-card-header>
      <img mat-card-image src="assets/VONLogo.png" alt="VON Network logo" />
      <mat-card-content>
        <p>
          Welcome to the app.
        </p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button>Some Action</button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  constructor(
    private stateSvc: StateService,
    private actionSvc: ActionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}
}
