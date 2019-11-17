import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { PopMenuComponent } from './pop-menu/pop-menu.component';
import { MatMenuModule } from '@angular/material/menu';
const materialModules = [
  MatListModule,
  MatCheckboxModule,
  MatChipsModule,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatBadgeModule,
  MatMenuModule
];

const components = [PopMenuComponent];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  exports: [
    ReactiveFormsModule,
    ReactiveFormsModule,
    ...materialModules,
    ...components
  ]
})
export class SharedModule {}
