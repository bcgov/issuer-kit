import { Component, OnInit } from '@angular/core';
import { StateService } from '../services/state.service';
import { ActionService } from '../services/action.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wap-home',
  template: ``,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  token: string;
  constructor(
    private stateSvc: StateService,
    private actionSvc: ActionService,
    private route: ActivatedRoute
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
  }

  ngOnInit() {}
}
