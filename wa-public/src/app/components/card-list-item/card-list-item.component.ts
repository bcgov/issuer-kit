import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wap-card-list-item',
  template: `
    <ion-item *ngIf="position === 'stacked'; else notStacked">
      <ion-label position="stacked">
        {{ label }}
      </ion-label>
      <ng-container *ngIf="value !== 'not defined'">
        <ion-badge *ngIf="label !== 'Date of Birth'" [color]="color"
          ><ion-text>{{ value }}</ion-text></ion-badge
        >
        <ion-badge [color]="color" *ngIf="label === 'Date of Birth'"
          ><ion-text>{{ value | date: 'mediumDate' }}</ion-text></ion-badge
        >
      </ng-container>
      <ng-container *ngIf="value === 'not defined'">
        <ion-badge color="warning"
          ><ion-text>{{ value }}</ion-text></ion-badge
        >
      </ng-container>
    </ion-item>
    <ng-template #notStacked>
      <ion-item>
        <ion-label>
          {{ label }}
        </ion-label>
        <ng-container *ngIf="value !== 'not defined'">
          <ion-badge
            *ngIf="label !== 'Date of Birth'"
            [color]="color"
            slot="end"
            ><ion-text>{{ value }}</ion-text></ion-badge
          >
          <ion-badge
            [color]="color"
            *ngIf="label === 'Date of Birth'"
            slot="end"
            ><ion-text>{{ value | date: 'mediumDate' }}</ion-text></ion-badge
          >
        </ng-container>
        <ng-container *ngIf="value === 'not defined'">
          <ion-badge color="warning" slot="end"
            ><ion-text>{{ value }}</ion-text></ion-badge
          >
        </ng-container></ion-item
      >
    </ng-template>
  `,
  styleUrls: ['./card-list-item.component.scss']
})
export class CardListItemComponent implements OnInit {
  @Input() label;
  @Input() value;
  @Input() color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'light'
    | 'medium'
    | 'dark' = 'dark';
  @Input() position = 'stacked';
  constructor() {}

  ngOnInit() {}
}
