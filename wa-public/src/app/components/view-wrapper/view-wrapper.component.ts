import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wap-view-wrapper',
  template: `
    <ion-content class="ion-padding" fullscreen color="light">
      <ng-content> </ng-content>
    </ion-content>
  `,
  styleUrls: ['./view-wrapper.component.scss']
})
export class ViewWrapperComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
