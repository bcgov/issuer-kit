import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'waa-not-found',
  template: `
    <p>
      This is not the page you're looking for...
    </p>
  `,
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
