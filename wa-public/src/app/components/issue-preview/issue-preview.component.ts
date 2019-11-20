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
      <wap-card-list-item
        *ngFor="let value of values"
        [label]="value.key"
        [value]="value.value"
      >
      </wap-card-list-item>
    </ion-list>
  `,
  styleUrls: ['./issue-preview.component.scss']
})
export class IssuePreviewComponent implements OnInit {
  @Input() values: { key: string; value: string }[];

  constructor() {}

  ngOnInit() {}
}
