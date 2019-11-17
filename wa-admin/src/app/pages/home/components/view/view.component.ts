import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IInvitationRecord } from 'src/app/shared/interfaces/invitation-record.interface';
import { Observable, of } from 'rxjs';
import { ActionService } from 'src/app/services/action.service';
import { tap, map } from 'rxjs/operators';
import { IActionMenuItem } from 'src/app/shared/interfaces/actions.interface';
import { environment } from 'src/environments/environment';

export interface IViewRecord {
  name: string;
  email: string;
  fields: IFields;
  link: string;
  state: string;
}

export interface IFields {
  [key: string]: string;
  value: string;
}

const publicUrl = environment.publicUrl;

@Component({
  selector: 'waa-view',
  template: `
    <waa-item-header title="Item Record"> </waa-item-header>

    <waa-view-wrapper *ngIf="$record | async as r">
      <waa-card-toolbar
        *ngIf="$actions | async as actions"
        [actions]="actions"
        (primary)="action($event)"
        [title]="r.email"
      >
      </waa-card-toolbar>
      <mat-card>
        <mat-card-header
          color="accent"
          [title]="r.email"
          (primary)="action($event)"
        >
          <mat-icon mat-card-avatar>
            person
          </mat-icon>
          <mat-card-subtitle *ngIf="r.name">{{ r.name }}</mat-card-subtitle>
          <mat-card-subtitle>{{ r.link }}</mat-card-subtitle>
          <mat-card-subtitle
            ><ion-badge color="tertiary">{{
              r.state
            }}</ion-badge></mat-card-subtitle
          >
        </mat-card-header>
        <mat-card-content>
          <ion-list
            ><waa-card-list-item
              *ngFor="let f of r.fields"
              [label]="f.key | titlecase"
              [value]="f.value"
            ></waa-card-list-item>
          </ion-list>
        </mat-card-content>
      </mat-card>
    </waa-view-wrapper>
  `,
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  $record: Observable<IViewRecord>;
  $actions: Observable<IActionMenuItem[]>;
  url: string;

  action(evt: IActionMenuItem) {
    console.log(evt);
  }
  constructor(private route: ActivatedRoute, private actionSvc: ActionService) {
    this.url = publicUrl;
  }

  ngOnInit() {
    const _id = this.route.snapshot.paramMap.get('id');
    const fields = ['jurisdiction', 'method', 'expiry', 'created'];
    const obs = this.actionSvc.getRecord(_id);
    this.$record = obs.pipe(
      map(r => {
        const name = `${r.firstName} ${r.lastName}`;
        const { email, active, consumed } = r;
        const state = consumed ? (active ? 'active' : 'inactive') : 'pending';
        const filtered = Object.keys(r).filter(key =>
          fields.some(field => field === key)
        );
        const mapped = filtered.map(key => ({ key, value: r[key] }));
        const values = mapped.map(field => {
          const value =
            typeof field.value === 'number'
              ? new Date(field.value).toDateString()
              : field.value;
          return {
            key: field.key,
            value
          };
        }) as any;
        return {
          name,
          email,
          fields: values,
          link: `${this.url}${r._id}`,
          state
        };
      })
    );
    this.$actions = obs.pipe(
      map(obs => {
        return obs.consumed
          ? [{ label: 'Disable Access', key: 'active' }]
          : [{ label: 'Send Email', key: 'email' }];
      })
    );
  }
}
