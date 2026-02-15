import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiscRoutingModule } from './misc-routing.module';
import { Page404Component } from './page404/page404.component';


@NgModule({
  declarations: [
    Page404Component
  ],
  imports: [
    CommonModule,
    MiscRoutingModule
  ]
})
export class MiscModule { }
