import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'waa-success',
  template: `
    <p>
      success works!
    </p>
  `,
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
