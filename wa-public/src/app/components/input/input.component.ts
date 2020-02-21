import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'wap-input',
  template: `
    <ion-item>
      <ion-label position="stacked">
        {{ label
        }}<ion-text color="danger" *ngIf="required">*</ion-text></ion-label
      >
      <ion-input
        [formControl]="fc"
        (keyup.enter)="out.emit(true)"
        [readonly]="disabled"
        class="input-field"
      >
      </ion-input>
    </ion-item>
    <ion-note *ngIf="invalid">
      <ion-text color="danger" *ngIf="invalid">{{ error }} </ion-text></ion-note
    >
  `,
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() fc: FormControl;
  @Input() invalid: boolean;
  @Input() required = true;
  @Input() error: string;
  @Input() placeholder: string;
  @Input() label: string;
  @Input() disabled: boolean;
  @Output() out = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}
}
