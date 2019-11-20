import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wap-card-list-item',
  template: `
    <ion-item>
      <ion-label>
        {{ label }}
      </ion-label>
      <ion-badge slot="end" [color]="color" *ngIf="label !== 'Date of Birth'">{{
        value
      }}</ion-badge>
      <ion-badge slot="end" [color]="color" *ngIf="label === 'Date of Birth'">{{
        value | date: 'mediumDate'
      }}</ion-badge>
    </ion-item>
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
  constructor() {}

  ngOnInit() {}
}
