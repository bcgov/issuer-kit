import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IActionMenuItem } from '../../interfaces/actions.interface';

@Component({
  selector: 'waa-card-toolbar',
  template: `
    <ion-toolbar color="secondary">
      <ion-buttons slot="secondary" *ngIf="secondaryIcon">
        <ion-button (click)="secondary.emit(true)" slot="start">
          <mat-icon slot="icon-only">{{ secondaryIcon }}</mat-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="primary" *ngIf="actions">
        <ion-button slot="start" [matMenuTriggerFor]="menu">
          <mat-icon slot="icon-only">more_vert</mat-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>
        {{ title }}
      </ion-title>
    </ion-toolbar>
    <mat-menu #menu="matMenu">
      <button
        mat-menu-item
        *ngFor="let action of actions"
        (click)="primary.emit(action)"
      >
        {{ action.label }}
      </button>
    </mat-menu>
  `,
  styleUrls: ['./card-toolbar.component.scss']
})
export class CardToolbarComponent implements OnInit {
  @Input() color = 'secondary';
  @Input() actions: IActionMenuItem[];
  @Input() secondaryIcon: string;
  @Input() title: string;
  @Output() secondary = new EventEmitter();
  @Output() primary = new EventEmitter<IActionMenuItem>();

  constructor() {}

  ngOnInit() {}
}
