import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { PosfilterPipe } from './posfilter.pipe';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    ProductlistComponent,
    PosfilterPipe
    
  ],
  imports: [
    BrowserModule,
    RouterModule,
    CommonModule,
    FormsModule,
    Select2Module
  ],
  exports: [ProductlistComponent]
})
export class POSModule { }
