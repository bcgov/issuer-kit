import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'waa-view-wrapper',
  template: `
    <ion-content padding fullscreen color="light">
      <ng-content> </ng-content>
    </ion-content>
  `,
  styleUrls: ['./view-wrapper.component.scss']
})
export class ViewWrapperComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
