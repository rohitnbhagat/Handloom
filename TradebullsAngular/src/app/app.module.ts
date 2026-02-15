import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { DataTablesModule } from "angular-datatables";
import { ControlsModule } from './controls/controls.module';
import { ToggleOnOffComponent } from './controls/toggle-on-off/toggle-on-off.component';
import { ModelComponent } from './controls/model/model.component';
import { ClientsuggestivetextboxComponent } from './controls/clientsuggestivetextbox/clientsuggestivetextbox.component';
import { LogoutComponent } from './logout/logout.component';
import { CreateuserComponent } from './user/createuser/createuser.component';
import { NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Select2Module } from 'ng-select2-component';
import { provideNativeDateAdapter } from '@angular/material/core';

import { MaterialModule } from './material/material.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerToggle } from '@angular/material/datepicker';
import { CustomDateAdapter } from './CustomDateAdapter'; 
import { MAT_DATE_FORMATS, DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxEditorModule } from 'ngx-editor';
import { MatMenuModule } from '@angular/material/menu';
import { NgxBarcode6Module } from 'ngx-barcode6';
import {MatChipsModule} from '@angular/material/chips';

import { MultiSelectModule } from 'primeng/multiselect';

import { ClientMasterCreateComponent } from './ClientMaster/client-master-create/client-master-create.component';
import { ClientMasterListComponent } from './ClientMaster/client-master-list/client-master-list.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { BrandListComponent } from './Masters/Brand/brand-list/brand-list.component';
import { BrandAddComponent } from './Masters/Brand/brand-add/brand-add.component';
import { CreditTypeAddComponent } from './Masters/CreditType/credit-type-add/credit-type-add.component';
import { CreditTypeListComponent } from './Masters/CreditType/credit-type-list/credit-type-list.component';
import { DueDaysAddComponent } from './Masters/DueDays/due-days-add/due-days-add.component';
import { DueDaysListComponent } from './Masters/DueDays/due-days-list/due-days-list.component';
import { ExhitionAddComponent } from './Masters/Exhition/exhition-add/exhition-add.component';
import { ExhitionListComponent } from './Masters/Exhition/exhition-list/exhition-list.component';
import { HSNCodeAddComponent } from './Masters/HSNCode/hsncode-add/hsncode-add.component';
import { HSNCodeListComponent } from './Masters/HSNCode/hsncode-list/hsncode-list.component';
import { RatingAddComponent } from './Masters/Rating/rating-add/rating-add.component';
import { RatingListComponent } from './Masters/Rating/rating-list/rating-list.component';
import { SalesLocationAddComponent } from './Masters/SalesLocation/sales-location-add/sales-location-add.component';
import { SalesLocationListComponent } from './Masters/SalesLocation/sales-location-list/sales-location-list.component';
import { FilterPipe } from './filter.pipe';
import { PartyTypeAddComponent } from './Masters/PartyType/party-type-add/party-type-add.component';
import { PartyTypeListComponent } from './Masters/PartyType/party-type-list/party-type-list.component';
import { AddressTypeListComponent } from './Masters/AddressType/address-type-list/address-type-list.component';
import { AddressTypeAddComponent } from './Masters/AddressType/address-type-add/address-type-add.component';
import { PartyAddComponent } from './Masters/Party/party-add/party-add.component';
import { PartyListComponent } from './Masters/Party/party-list/party-list.component';
import { PartyAddressAddComponent } from './Masters/Party/party-address-add/party-address-add.component';
import { StockTypeListComponent } from './Masters/StockType/stock-type-list/stock-type-list.component';
import { StockTypeAddComponent } from './Masters/StockType/stock-type-add/stock-type-add.component';
import { StoreListComponent } from './Masters/Store/store-list/store-list.component';
import { StoreAddComponent } from './Masters/Store/store-add/store-add.component';
import { SalesOrderListComponent } from './Sales/SalesOrder/sales-order-list/sales-order-list.component';
import { SalesOrderAddComponent } from './Sales/SalesOrder/sales-order-add/sales-order-add.component';
import { SalesAddProductComponent } from './Sales/SalesOrder/sales-add-product/sales-add-product.component';

import { InsertStockListComponent } from './Sales/InsertStock/insertstock-list/insertstock-list.component';
import { InsertStockAddComponent } from './Sales/InsertStock/insertstock-add/insertstock-add.component';
import { InsertStockAddProductComponent } from './Sales/InsertStock/insertstock-add-product/insertstock-add-product.component';
import { InsertStockPrintComponent } from './Sales/InsertStock/insertstock-print/insertstock-print.component';

import { RemoveStockListComponent } from './Sales/RemoveStock/removestock-list/removestock-list.component';
import { RemoveStockAddComponent } from './Sales/RemoveStock/removestock-add/removestock-add.component';
import { RemoveStockAddProductComponent } from './Sales/RemoveStock/removestock-add-product/removestock-add-product.component';
import { RemoveStockPrintComponent } from './Sales/RemoveStock/removestock-print/removestock-print.component';

import { StockReportComponent } from './Sales/Stock/stock-report/stock-report.component';

import { SyncTablesComponent } from './Settings/sync-tables/sync-tables.component';
import { CountryListComponent } from './Masters/Country/country-list/country-list.component';
import { CountryAddComponent } from './Masters/Country/country-add/country-add.component';
import { StateListComponent } from './Masters/State/state-list/state-list.component';
import { StateAddComponent } from './Masters/State/state-add/state-add.component';
import { CityListComponent } from './Masters/City/city-list/city-list.component';
import { CityAddComponent } from './Masters/City/city-add/city-add.component';
import { SalesAddAddressComponent } from './Sales/SalesOrder/sales-add-address/sales-add-address.component';
import { FiltercolumnPipe } from './filtercolumn.pipe';
import { SalesOrderPrintComponent } from './Sales/SalesOrder/sales-order-print/sales-order-print.component';
import { SalesOrderReportComponent } from './Sales/SalesOrder/sales-order-report/sales-order-report.component';
import { GdnPrintComponent } from './Sales/GDN/gdn-print/gdn-print.component';
import { GdnAddComponent } from './Sales/GDN/gdn-add/gdn-add.component';
import { GdnListComponent } from './Sales/GDN/gdn-list/gdn-list.component';
import { POSModule } from './pos/pos.module';
import { LabelprintsettingsAddComponent } from './Masters/LabelPrintSettings/labelprint-settings-add/labelprint-settings-add.component';
import { LabelprintsettingsListComponent } from './Masters/LabelPrintSettings/labelprint-settings-list/labelprint-settings-list.component';
import { BarcodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import { BarcodeScannerComponent } from './barcode-scanner/barcode-scanner.component';
import { ProductLabelPrintComponent } from './Masters/Product/product-label-print/product-label-print.component';
import { ProcessListComponent } from './Masters/Process/process-list/process-list.component';
import { ProcessAddComponent } from './Masters/Process/process-add/process-add.component';
import { ComponentAddComponent } from './Masters/Component/component-add/component-add.component';
import { ComponentListComponent } from './Masters/Component/component-list/component-list.component';
import { ProductBOMAddComponent } from './Masters/ProductBOM/product-bom-add/product-bom-add.component';
import { WorkorderplanningAddComponent } from './Sales/WorkOrderPlanning/workorderplanning-add/workorderplanning-add.component';
import { WorkorderplanningAddProductComponent } from './Sales/WorkOrderPlanning/workorderplanning-add-product/workorderplanning-add-product.component';
import { WorkorderplanningListComponent } from './Sales/WorkOrderPlanning/workorderplanning-list/workorderplanning-list.component';
import { WorkorderplanningPrintComponent } from './Sales/WorkOrderPlanning/workorderplanning-print/workorderplanning-print.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY', // Define format for parsing
  },
  display: {
    dateInput: 'DD/MM/YYYY', // Define format for display
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    UserListComponent,
    ToggleOnOffComponent,
    ModelComponent,
    ClientsuggestivetextboxComponent,
    LogoutComponent,
    CreateuserComponent,
    ClientMasterCreateComponent,
    ClientMasterListComponent,
    LeftMenuComponent,
    BrandListComponent,
    BrandAddComponent,
    CreditTypeAddComponent,
    CreditTypeListComponent,
    DueDaysAddComponent,
    DueDaysListComponent,
    ExhitionAddComponent,
    ExhitionListComponent,
    HSNCodeAddComponent,
    HSNCodeListComponent,
    RatingAddComponent,
    RatingListComponent,
    SalesLocationAddComponent,
    SalesLocationListComponent,
    FilterPipe,
    PartyTypeAddComponent,
    PartyTypeListComponent,
    AddressTypeListComponent,
    AddressTypeAddComponent,
    PartyAddComponent,
    PartyListComponent,
    PartyAddressAddComponent,
    StockTypeListComponent,
    StockTypeAddComponent,
    StoreListComponent,
    StoreAddComponent,
    SalesOrderListComponent,
    SalesOrderAddComponent,
    SalesAddProductComponent,
    SyncTablesComponent,
    CountryListComponent,
    CountryAddComponent,
    StateListComponent,
    StateAddComponent,
    CityListComponent,
    CityAddComponent,
    SalesAddAddressComponent,
    FiltercolumnPipe,
    SalesOrderPrintComponent,
    SalesOrderReportComponent,
    GdnPrintComponent,
    GdnAddComponent,
    GdnListComponent,
    LabelprintsettingsAddComponent,
    LabelprintsettingsListComponent,
    BarcodeScannerComponent,
    ProductLabelPrintComponent,
    InsertStockListComponent,
    InsertStockAddComponent,
    InsertStockAddProductComponent,
    InsertStockPrintComponent,
    RemoveStockListComponent,
    RemoveStockAddComponent,
    RemoveStockAddProductComponent,
    RemoveStockPrintComponent,
    StockReportComponent,
    ProcessListComponent,
    ProcessAddComponent,
    ComponentAddComponent,
    ComponentListComponent,
    ProductBOMAddComponent,
    WorkorderplanningAddComponent,
    WorkorderplanningAddProductComponent,
    WorkorderplanningListComponent,
    WorkorderplanningPrintComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    DataTablesModule,
    ControlsModule,
    NgbModule,
    NgbPagination,
    Select2Module,
    MaterialModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDatepickerToggle,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxMatSelectSearchModule,
    NgxEditorModule,
    MatMenuModule,
    POSModule,
    NgxBarcode6Module,
    BarcodeScannerLivestreamModule,
    MultiSelectModule,
    MatChipsModule
  ],
  exports: [
  ],
  providers: [
    provideAnimationsAsync(), { provide: DateAdapter, useClass: CustomDateAdapter }, { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
