import { Component, OnInit } from '@angular/core';
import { StateService } from '../services/state.service';
import { ActionService } from '../services/action.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wap-page-not-found',
  template: `
    WHOOPSIES PAGE NOT FOUND
  `,
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  constructor(
    private stateSvc: StateService,
    private actionSvc: ActionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
  }
}
