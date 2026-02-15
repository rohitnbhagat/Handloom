import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule
  ],
  exports: [
    CommonModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule
  ]
})
export class MaterialModule { }
