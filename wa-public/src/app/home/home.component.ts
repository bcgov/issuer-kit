import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';

@Component({
  selector: 'wap-home',
  template: `
    <span>Home Component</span>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private stateSvc: StateService, private router: Router) {}

  ngOnInit() {
    if (this.stateSvc.isAuth) {
      this.router.navigate(['success']);
    }
  }
}
