import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'waa-card-list-item',
  template: `
    <ion-item>
      <ion-label>
        {{ label }}
      </ion-label>
      <ion-badge slot="end" [color]="color">{{ value }}</ion-badge>
    </ion-item>
  `,
  styleUrls: ['./card-list-item.component.scss']
})
export class CardListItemComponent implements OnInit {
  @Input() label;
  @Input() value;
  @Input() color: 'primary' | 'secondary' | 'tertiary' = 'secondary';

  constructor() {}

  ngOnInit() {}
}
