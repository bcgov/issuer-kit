import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

const materialModules = [
  MatListModule,
  MatCheckboxModule,
  MatChipsModule,
  MatIconModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  exports: [ReactiveFormsModule, ReactiveFormsModule, ...materialModules]
})
export class SharedModule {}
