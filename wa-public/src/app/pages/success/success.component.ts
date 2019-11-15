import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wap-success',
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
