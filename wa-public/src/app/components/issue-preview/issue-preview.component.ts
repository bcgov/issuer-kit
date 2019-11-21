import { Component, OnInit, Input } from '@angular/core';

export interface IIssuePreview {
  firstName: string;
  lastName: string;
  emailAddress: string;
  streetAddress: string;
  locality: string;
  postalCode: string;
  dateOfBirth: string;
}

@Component({
  selector: 'wap-issue-preview',
  template: `
    <ion-list *ngIf="values.length > 0">
      <ng-container *ngFor="let value of values">
        <wap-card-list-item
          *ngIf="value.value"
          [label]="value.label"
          [value]="value.value"
          [position]="position"
        >
        </wap-card-list-item>
      </ng-container>
    </ion-list>
  `,
  styleUrls: ['./issue-preview.component.scss']
})
export class IssuePreviewComponent implements OnInit {
  @Input() values: { key: string; value: string; label: string }[];
  @Input() position = 'stacked';

  constructor() {}

  ngOnInit() {}
}
