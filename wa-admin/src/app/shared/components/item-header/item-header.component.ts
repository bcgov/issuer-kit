import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'waa-item-header',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons
          slot="start"
          class="sc-ion-buttons-ios-h sc-ion-buttons-ios-s ios buttons-first-slot hydrated"
        >
          <ion-back-button [defaultHref]="default"> </ion-back-button>
        </ion-buttons>

        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
  `,
  styleUrls: ['./item-header.component.scss']
})
export class ItemHeaderComponent implements OnInit {
  @Input() color: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() default = '/';
  @Input() title: string;

  constructor() {}

  ngOnInit() {}
}
