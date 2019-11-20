import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wap-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Identity Kit';
  constructor() {}
  ngOnInit(): void {}
}
