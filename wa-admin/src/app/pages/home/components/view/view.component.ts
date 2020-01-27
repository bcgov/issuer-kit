import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IInvitationRecord } from 'src/app/shared/interfaces/invitation-record.interface';
import { Observable, of } from 'rxjs';
import { ActionService } from 'src/app/services/action.service';
import { tap, map } from 'rxjs/operators';
import {
  IActionMenuItem,
  ActionType
} from 'src/app/shared/interfaces/actions.interface';
import { environment } from 'src/environments/environment';
import { AppConfigService } from 'src/app/services/app-config.service';

export interface IViewRecord {
  name: string;
  email: string;
  fields: IFields;
  link: string;
  state: string;
  stateColor?: string;
  _id?: string;
}

export interface IFields {
  key: string;
  value: string;
}

const publicUrl = AppConfigService.settings.publicSite.url;

@Component({
  selector: 'waa-view',
  template: `
    <waa-item-header title="Item Record"> </waa-item-header>

    <waa-view-wrapper *ngIf="$record | async as r">
      <waa-card-toolbar
        *ngIf="$actions | async as actions"
        [actions]="actions"
        (primary)="action($event, r._id)"
        [title]="r.email"
      >
      </waa-card-toolbar>
      <mat-card>
        <mat-card-header
          color="accent"
          [title]="r.email"
          (primary)="action($event, r._id)"
        >
          <mat-icon mat-card-avatar>
            person
          </mat-icon>
          <mat-card-subtitle *ngIf="r.name">{{ r.name }}</mat-card-subtitle>
          <mat-card-subtitle>{{ r.link }}</mat-card-subtitle>
          <mat-card-subtitle
            ><ion-badge [color]="r.stateColor">{{
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

  action(evt: IActionMenuItem, record: string) {
    if (evt.key === 'email') this.actionSvc.sendEmail(record);
    if (evt.key === 'revoke') this.actionSvc.revokeAccess(record);
    this.router.navigate(['/']);
  }
  constructor(
    private route: ActivatedRoute,
    private actionSvc: ActionService,
    private router: Router
  ) {
    this.url = publicUrl;
  }

  ngOnInit() {
    const _id = this.route.snapshot.paramMap.get('id');
    const fields = [
      'jurisdiction',
      'method',
      'expiry',
      'created',
      'addedBy',
      'updatedAt',
      'updatedBy'
    ];
    const obs = this.actionSvc.getRecord(_id);
    this.$record = obs.pipe(
      map(r => {
        const name = `${r.firstName} ${r.lastName}`;
        const { email, active, consumed, issued, expired } = r;
        const state = active
          ? consumed
            ? issued
              ? 'issued'
              : 'logged in'
            : expired
            ? 'expired'
            : 'sent'
          : 'disbled';
        const stateColor = consumed
          ? active
            ? issued
              ? 'success'
              : 'warning'
            : 'danger'
          : active
          ? 'warning'
          : 'danger';

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
          _id,
          email,
          fields: values,
          link: `${this.url}/validate?invite_token=${r.linkId}`,
          state,
          stateColor
        };
      })
    );

    this.$actions = obs.pipe(
      map(obs => {
        const accessLabel = obs.active ? 'Revoke Access' : 'Grant Access';
        return obs.consumed
          ? [
            { label: 'Send Email', key: 'email' }
          ]
          : [
              { label: 'Send Email', key: 'email' },
              { label: accessLabel, key: 'revoke' }
            ];
      })
    );
  }
}
